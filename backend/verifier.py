"""
Verification engine coordinating File 1 (Original) and File 2 (Downloaded) evaluation.
"""

import os
from crc32 import (
    calculate_crc32_stream,
    verify_codeword_stream,
    int_to_bin32,
    int_to_hex32,
    bytes_to_bin_preview,
    generate_division_trace,
    FULL_GENERATOR_BIN,
    FULL_GENERATOR_HEX
)


def verify_files(file1_path: str, file2_path: str, orig_name: str = None, down_name: str = None) -> dict:
    """
    Performs full verification between File 1 and File 2 following the professor's flowchart:
    1. Read File 1 -> Dataword 1
    2. Append 32 zeros
    3. CRC-32 polynomial division using 0x104C11DB7
    4. Calculate 32-bit CRC Remainder 1
    5. Formulate Codeword 1
    6. Read File 2 -> Dataword 2
    7. Verify Codeword 1 (Divide Dataword 2 + Remainder 1 by Generator)
    8. Calculate Verification Remainder
    9. Compare Dataword 1 == Dataword 2
    10. Return ACCEPT if verification remainder == 0 AND Dataword 1 == Dataword 2, else REJECT.
    """
    if not os.path.exists(file1_path):
        return {"success": False, "error": f"Original file not found: {file1_path}"}
    if not os.path.exists(file2_path):
        return {"success": False, "error": f"Downloaded file not found: {file2_path}"}

    file1_size = os.path.getsize(file1_path)
    file2_size = os.path.getsize(file2_path)

    orig_filename = orig_name or os.path.basename(file1_path)
    down_filename = down_name or os.path.basename(file2_path)

    # 1. Read small sample previews for UI bitwise visualization
    with open(file1_path, 'rb') as f1:
        file1_sample = f1.read(4096)
        f1.seek(0)
        crc1_int = calculate_crc32_stream(f1)

    with open(file2_path, 'rb') as f2:
        file2_sample = f2.read(4096)
        f2.seek(0)
        verif_rem_int = verify_codeword_stream(f2, crc1_int)

    # Calculate Dataword match: Compare sizes and hash/content chunk by chunk
    dataword_match = True
    if file1_size != file2_size:
        dataword_match = False
    else:
        with open(file1_path, 'rb') as f1, open(file2_path, 'rb') as f2:
            while True:
                b1 = f1.read(65536)
                b2 = f2.read(65536)
                if b1 != b2:
                    dataword_match = False
                    break
                if not b1:
                    break

    # Format binary previews
    preview1 = bytes_to_bin_preview(file1_sample)
    preview2 = bytes_to_bin_preview(file2_sample)
    
    # Adjust total bits in preview to accurately reflect whole file size
    preview1["total_bits"] = file1_size * 8
    preview1["total_bytes"] = file1_size
    preview2["total_bits"] = file2_size * 8
    preview2["total_bytes"] = file2_size

    if file1_size > 1024:
        preview1["full_bin"] = None
        preview1["is_small_file"] = False
    if file2_size > 1024:
        preview2["full_bin"] = None
        preview2["is_small_file"] = False

    crc_remainder_bin = int_to_bin32(crc1_int)
    crc_remainder_hex = int_to_hex32(crc1_int)

    verif_remainder_bin = int_to_bin32(verif_rem_int)
    verif_remainder_hex = int_to_hex32(verif_rem_int)

    is_verif_zero = (verif_rem_int == 0)

    status = "ACCEPT" if (is_verif_zero and dataword_match) else "REJECT"

    if status == "ACCEPT":
        message = "File integrity verified! Codeword remainder is zero and Dataword 1 matches Dataword 2 perfectly."
    else:
        reasons = []
        if not is_verif_zero:
            reasons.append("Non-zero verification remainder detected (codeword corrupted)")
        if not dataword_match:
            reasons.append("Dataword content mismatch between File 1 and File 2")
        message = "Corruption detected: " + "; ".join(reasons) + "."

    # Step-by-step division trace snippet for UI visualization
    trace = generate_division_trace(file1_sample)

    return {
        "success": True,
        "original_filename": orig_filename,
        "downloaded_filename": down_filename,
        "original_size": file1_size,
        "downloaded_size": file2_size,
        "dataword1_preview": preview1,
        "dataword2_preview": preview2,
        "generator_poly": FULL_GENERATOR_BIN,
        "generator_poly_hex": FULL_GENERATOR_HEX,
        "crc_remainder": crc_remainder_bin,
        "crc_remainder_hex": crc_remainder_hex,
        "codeword_generated": True,
        "verification_remainder": verif_remainder_bin,
        "verification_remainder_hex": verif_remainder_hex,
        "verification_remainder_zero": is_verif_zero,
        "dataword_match": dataword_match,
        "status": status,
        "message": message,
        "division_trace": trace
    }


def corrupt_file_demo(file_path: str, uploads_dir: str) -> dict:
    """
    Creates a temporary corrupted copy of file_path by flipping 1 bit/byte in a copy,
    then executes verification comparing Original vs Corrupted copy.
    """
    if not os.path.exists(file_path):
        return {"success": False, "error": "Source file for corruption demo not found."}

    orig_name = os.path.basename(file_path)
    corrupted_path = os.path.join(uploads_dir, f"corrupted_{orig_name}")

    with open(file_path, 'rb') as f_in:
        content = bytearray(f_in.read())

    if len(content) == 0:
        content = bytearray(b"Sample file for CRC corruption verification test.")

    # Mutate 1 byte in the middle
    mutation_index = len(content) // 2
    content[mutation_index] ^= 0x01  # Flip 1 bit

    with open(corrupted_path, 'wb') as f_out:
        f_out.write(content)

    # Run verification between original and corrupted copy
    result = verify_files(file_path, corrupted_path, orig_name=orig_name, down_name=f"corrupted_{orig_name}")
    result["corrupted_index"] = mutation_index
    result["is_demo"] = True

    return result
