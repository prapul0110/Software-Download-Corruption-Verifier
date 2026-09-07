"""
Academic CRC-32 Engine using XOR-based binary polynomial division.

Generator Polynomial:
G(x) = x^32 + x^26 + x^23 + x^22 + x^16 + x^12 + x^11 + x^10 + x^8 + x^7 + x^5 + x^4 + x^2 + x + 1
33-bit binary: 1 0000 0100 1100 0001 0001 1101 1011 0111 (0x104C11DB7)
Lower 32 bits polynomial constant: 0x04C11DB7
"""

POLY_32 = 0x04C11DB7
FULL_GENERATOR_HEX = "0x104C11DB7"
FULL_GENERATOR_BIN = "10000010011000010001110110110111"


def _build_crc_table():
    """
    Precompute 256-entry table for byte-at-a-time XOR polynomial division.
    Mathematically identical to bit-by-bit modulo-2 polynomial division with 0x04C11DB7.
    """
    table = []
    for i in range(256):
        rem = (i << 24) & 0xFFFFFFFF
        for _ in range(8):
            msb = (rem >> 31) & 1
            rem = (rem << 1) & 0xFFFFFFFF
            if msb:
                rem ^= POLY_32
        table.append(rem)
    return table

CRC_TABLE = _build_crc_table()


def calculate_crc32_bitwise(data_bytes: bytes) -> int:
    """
    Pure bit-by-bit XOR modulo-2 division of data_bytes augmented with 32 zeros.
    Used for verification, testing, and small files.
    """
    rem = 0
    # Process data bits
    for b in data_bytes:
        for bit_idx in range(7, -1, -1):
            bit = (b >> bit_idx) & 1
            msb = (rem >> 31) & 1
            rem = ((rem << 1) | bit) & 0xFFFFFFFF
            if msb:
                rem = rem ^ POLY_32

    # Append 32 zero bits (augmentation)
    for _ in range(32):
        msb = (rem >> 31) & 1
        rem = ((rem << 1) | 0) & 0xFFFFFFFF
        if msb:
            rem = rem ^ POLY_32

    return rem


def calculate_crc32_stream(file_obj, chunk_size=65536) -> int:
    """
    Efficient chunk-based CRC-32 calculation for files of any size.
    Produces exact same modulo-2 polynomial division remainder as bitwise division.
    """
    rem = 0
    while True:
        chunk = file_obj.read(chunk_size)
        if not chunk:
            break
        for b in chunk:
            top = (rem >> 24) & 0xFF
            rem = (((rem & 0x00FFFFFF) << 8) | b) ^ CRC_TABLE[top]
    
    # Process the 32 zero bits (4 bytes of 0x00) for augmentation
    for _ in range(4):
        top = (rem >> 24) & 0xFF
        rem = ((rem & 0x00FFFFFF) << 8) ^ CRC_TABLE[top]

    return rem


def verify_codeword_stream(file_obj, crc_remainder_int: int, chunk_size=65536) -> int:
    """
    Verifies a Codeword by feeding Dataword + 32-bit CRC Remainder through the generator.
    Returns 32-bit remainder. Valid codeword produces 0.
    """
    rem = 0
    while True:
        chunk = file_obj.read(chunk_size)
        if not chunk:
            break
        for b in chunk:
            top = (rem >> 24) & 0xFF
            rem = (((rem & 0x00FFFFFF) << 8) | b) ^ CRC_TABLE[top]

    # Feed the 4 bytes of CRC remainder (MSB first) instead of 32 zeros
    crc_bytes = crc_remainder_int.to_bytes(4, byteorder='big')
    for b in crc_bytes:
        top = (rem >> 24) & 0xFF
        rem = (((rem & 0x00FFFFFF) << 8) | b) ^ CRC_TABLE[top]

    return rem


def verify_codeword_bitwise(data_bytes: bytes, crc_remainder_int: int) -> int:
    """
    Bitwise codeword division verification for data_bytes + crc_remainder_int.
    """
    rem = 0
    # Process data bits
    for b in data_bytes:
        for bit_idx in range(7, -1, -1):
            bit = (b >> bit_idx) & 1
            msb = (rem >> 31) & 1
            rem = ((rem << 1) | bit) & 0xFFFFFFFF
            if msb:
                rem = rem ^ POLY_32

    # Process 32 bits of CRC remainder
    for bit_idx in range(31, -1, -1):
        bit = (crc_remainder_int >> bit_idx) & 1
        msb = (rem >> 31) & 1
        rem = ((rem << 1) | bit) & 0xFFFFFFFF
        if msb:
            rem = rem ^ POLY_32

    return rem


def int_to_bin32(val: int) -> str:
    """Formats 32-bit integer as a 32-character binary string with leading zeros."""
    return format(val & 0xFFFFFFFF, '032b')


def int_to_hex32(val: int) -> str:
    """Formats 32-bit integer as 0xXXXXXXXX hex string."""
    return f"0x{(val & 0xFFFFFFFF):08X}"


def bytes_to_bin_preview(data_bytes: bytes, max_bits=128) -> dict:
    """
    Generates binary preview details for UI display.
    """
    total_bits = len(data_bytes) * 8
    total_bytes = len(data_bytes)
    
    # Convert whole file if <= 1024 bytes
    full_bin = "".join(format(b, '08b') for b in data_bytes) if len(data_bytes) <= 1024 else None
    
    # Build first N bits and last N bits previews
    bits_each = max_bits // 2
    if total_bits <= max_bits:
        all_bits = "".join(format(b, '08b') for b in data_bytes)
        first_bits = all_bits
        last_bits = all_bits
    else:
        full_str = "".join(format(b, '08b') for b in data_bytes[: (bits_each // 8) + 2])
        first_bits = full_str[:bits_each]
        
        full_str_end = "".join(format(b, '08b') for b in data_bytes[-((bits_each // 8) + 2):])
        last_bits = full_str_end[-bits_each:]

    return {
        "total_bits": total_bits,
        "total_bytes": total_bytes,
        "first_bits": first_bits,
        "last_bits": last_bits,
        "full_bin": full_bin,
        "is_small_file": total_bytes <= 1024
    }


def generate_division_trace(sample_bytes: bytes, max_steps=12) -> list:
    """
    Generates a step-by-step trace of XOR division for visual demonstration in UI.
    """
    bits = "".join(format(b, '08b') for b in sample_bytes[:4]) + "0" * 32
    trace = []
    rem = 0
    
    for idx, bit_char in enumerate(bits[:max_steps * 2]):
        bit = int(bit_char)
        msb = (rem >> 31) & 1
        prev_rem_bin = format(rem, '032b')
        
        rem = ((rem << 1) | bit) & 0xFFFFFFFF
        xor_applied = False
        if msb:
            rem = rem ^ POLY_32
            xor_applied = True
            
        trace.append({
            "step": idx + 1,
            "bit_in": bit,
            "msb": msb,
            "prev_remainder_bin": prev_rem_bin,
            "xor_applied": xor_applied,
            "poly_used": FULL_GENERATOR_BIN if xor_applied else "00000000000000000000000000000000",
            "new_remainder_bin": format(rem, '032b'),
            "new_remainder_hex": f"0x{rem:08X}"
        })
        if len(trace) >= max_steps:
            break
            
    return trace
