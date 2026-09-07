"""
Flask REST API for Software Download Corruption Verifier backend.
"""

import os
import traceback
from flask import Flask, request, jsonify
from flask_cors import CORS
from verifier import verify_files, corrupt_file_demo

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Software Download Corruption Verifier API",
        "algorithm": "CRC-32 Modulo-2 Binary Polynomial Division"
    })


@app.route('/api/verify', methods=['POST'])
def verify():
    """
    POST /api/verify
    Accepts:
    - original_file
    - downloaded_file
    """
    if 'original_file' not in request.files or 'downloaded_file' not in request.files:
        return jsonify({
            "success": False,
            "error": "Both 'original_file' and 'downloaded_file' must be uploaded."
        }), 400

    file1 = request.files['original_file']
    file2 = request.files['downloaded_file']

    if file1.filename == '' or file2.filename == '':
        return jsonify({
            "success": False,
            "error": "Both uploaded files must have valid filenames."
        }), 400

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Sanitize filenames to prevent path traversal
    f1_name = os.path.basename(file1.filename)
    f2_name = os.path.basename(file2.filename)

    path1 = os.path.join(app.config['UPLOAD_FOLDER'], f"orig_{f1_name}")
    path2 = os.path.join(app.config['UPLOAD_FOLDER'], f"down_{f2_name}")

    try:
        file1.save(path1)
        file2.save(path2)

        result = verify_files(path1, path2, orig_name=f1_name, down_name=f2_name)
        return jsonify(result)
    except Exception as e:
        print("Verification error:", traceback.format_exc())
        return jsonify({
            "success": False,
            "error": f"Verification error: {str(e)}"
        }), 500
    finally:
        # Cleanup uploaded files after verification
        if os.path.exists(path1):
            try: os.remove(path1)
            except Exception: pass
        if os.path.exists(path2):
            try: os.remove(path2)
            except Exception: pass


@app.route('/api/corrupt-demo', methods=['POST'])
def corrupt_demo():
    """
    POST /api/corrupt-demo
    Accepts a single file, creates a temporary corrupted copy, and returns comparative verification results.
    """
    if 'file' not in request.files:
        return jsonify({
            "success": False,
            "error": "A file is required for the corruption demo."
        }), 400

    file_obj = request.files['file']
    if file_obj.filename == '':
        return jsonify({
            "success": False,
            "error": "Uploaded file must have a valid filename."
        }), 400

    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    f_name = os.path.basename(file_obj.filename)
    path = os.path.join(app.config['UPLOAD_FOLDER'], f"demo_{f_name}")

    try:
        file_obj.save(path)
        result = corrupt_file_demo(path, app.config['UPLOAD_FOLDER'])
        return jsonify(result)
    except Exception as e:
        print("Demo error:", traceback.format_exc())
        return jsonify({
            "success": False,
            "error": f"Corruption demo error: {str(e)}"
        }), 500
    finally:
        if os.path.exists(path):
            try: os.remove(path)
            except Exception: pass


if __name__ == '__main__':
    print("Starting Software Download Corruption Verifier Backend on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
