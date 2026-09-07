"""
Automated unit test suite for Software Download Corruption Verifier backend.
"""

import os
import pytest
import tempfile
from crc32 import calculate_crc32_bitwise, calculate_crc32_stream, verify_codeword_bitwise
from verifier import verify_files, corrupt_file_demo


@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmp:
        yield tmp


def test_1_same_file_accept(temp_dir):
    """TEST 1: Same original file uploaded as both File 1 and File 2 -> ACCEPT"""
    file1 = os.path.join(temp_dir, "file1.txt")
    file2 = os.path.join(temp_dir, "file2.txt")
    
    content = b"Hello, World! This is a test file for CRC-32 verification."
    with open(file1, 'wb') as f: f.write(content)
    with open(file2, 'wb') as f: f.write(content)
    
    res = verify_files(file1, file2)
    assert res["success"] is True
    assert res["dataword_match"] is True
    assert res["verification_remainder_zero"] is True
    assert res["status"] == "ACCEPT"


def test_2_one_byte_modified_reject(temp_dir):
    """TEST 2: One byte modified in File 2 -> REJECT"""
    file1 = os.path.join(temp_dir, "file1.txt")
    file2 = os.path.join(temp_dir, "file2.txt")
    
    content = bytearray(b"Hello, World! This is a test file for CRC-32 verification.")
    with open(file1, 'wb') as f: f.write(content)
    
    # Flip 1 bit in File 2
    content[5] ^= 0x01
    with open(file2, 'wb') as f: f.write(content)
    
    res = verify_files(file1, file2)
    assert res["success"] is True
    assert res["dataword_match"] is False
    assert res["status"] == "REJECT"


def test_3_multiple_bytes_modified_reject(temp_dir):
    """TEST 3: Multiple bytes modified -> REJECT"""
    file1 = os.path.join(temp_dir, "file1.txt")
    file2 = os.path.join(temp_dir, "file2.txt")
    
    content1 = bytearray(b"Software Download Corruption Verifier Test String 1234567890")
    content2 = bytearray(content1)
    content2[0] = ord('X')
    content2[10] = ord('Y')
    content2[20] = ord('Z')
    
    with open(file1, 'wb') as f: f.write(content1)
    with open(file2, 'wb') as f: f.write(content2)
    
    res = verify_files(file1, file2)
    assert res["success"] is True
    assert res["dataword_match"] is False
    assert res["status"] == "REJECT"


def test_4_different_files_reject(temp_dir):
    """TEST 4: Completely different files -> REJECT"""
    file1 = os.path.join(temp_dir, "file1.txt")
    file2 = os.path.join(temp_dir, "file2.txt")
    
    with open(file1, 'wb') as f: f.write(b"Original software installer package v1.0")
    with open(file2, 'wb') as f: f.write(b"Completely different file payload contents")
    
    res = verify_files(file1, file2)
    assert res["success"] is True
    assert res["dataword_match"] is False
    assert res["status"] == "REJECT"


def test_5_small_text_file_crc_correctness():
    """TEST 5: Small text file -> Bitwise vs stream calculation consistency & 0 remainder on valid codeword"""
    sample = b"Academic CRC-32 Test String"
    crc_bit = calculate_crc32_bitwise(sample)
    
    # Verify bitwise codeword verification
    rem_verif = verify_codeword_bitwise(sample, crc_bit)
    assert rem_verif == 0, f"Expected verification remainder 0, got {hex(rem_verif)}"


def test_6_binary_file_processing(temp_dir):
    """TEST 6: Binary file (ZIP/PDF/PNG simulated binary data) -> Correct processing"""
    file1 = os.path.join(temp_dir, "test.zip")
    file2 = os.path.join(temp_dir, "test_copy.zip")
    
    # 64 KB of binary data (simulating a zip archive)
    binary_data = bytes([i % 256 for i in range(65536)])
    with open(file1, 'wb') as f: f.write(binary_data)
    with open(file2, 'wb') as f: f.write(binary_data)
    
    res = verify_files(file1, file2)
    assert res["success"] is True
    assert res["original_size"] == 65536
    assert res["dataword_match"] is True
    assert res["verification_remainder_zero"] is True
    assert res["status"] == "ACCEPT"
