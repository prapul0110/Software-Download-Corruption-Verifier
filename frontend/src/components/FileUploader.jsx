import React, { useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, ArrowRight, Sparkles, Binary, FileArchive, FileCode } from 'lucide-react';

export default function FileUploader({
  originalFile,
  setOriginalFile,
  downloadedFile,
  setDownloadedFile,
  onVerify,
  isProcessing
}) {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (file) => {
    if (!file) return <UploadCloud className="w-10 h-10 text-cyan-400 mb-2" />;
    const ext = file.name.split('.').pop().toLowerCase();
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="w-10 h-10 text-amber-400 mb-2" />;
    if (['exe', 'bin', 'iso', 'dll'].includes(ext)) return <Binary className="w-10 h-10 text-purple-400 mb-2" />;
    if (['js', 'py', 'json', 'cpp', 'html'].includes(ext)) return <FileCode className="w-10 h-10 text-emerald-400 mb-2" />;
    return <FileText className="w-10 h-10 text-blue-400 mb-2" />;
  };

  // Helper to load sample files into memory for instant testing
  const handleLoadSample = (mode) => {
    let text1 = "Software Download Corruption Verifier Academic Test File\nVersion: 1.0.0\nAuthor: Senior Developer";
    let text2 = text1;
    let name1 = "sample_reference.txt";
    let name2 = "sample_downloaded.txt";

    if (mode === 'corrupted') {
      text2 = "Software Download Corruption Verifier Academic Test File\nVersion: 1.0.0\nAuthor: Senior DevXloper"; // 1 char changed
      name2 = "sample_downloaded_corrupted.txt";
    } else if (mode === 'binary') {
      const arr = new Uint8Array([0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x08, 0x00, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65]);
      const blob1 = new Blob([arr], { type: 'application/octet-stream' });
      const f1 = new File([blob1], 'installer_v1.0.zip', { type: 'application/octet-stream' });
      setOriginalFile(f1);
      setDownloadedFile(f1);
      return;
    }

    const file1 = new File([text1], name1, { type: 'text/plain' });
    const file2 = new File([text2], name2, { type: 'text/plain' });
    setOriginalFile(file1);
    setDownloadedFile(file2);
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Test Presets */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Need sample test files for demonstration?</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleLoadSample('valid')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg transition-all"
          >
            Load Valid Text Pair
          </button>
          <button
            onClick={() => handleLoadSample('corrupted')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 rounded-lg transition-all"
          >
            Load Corrupted Pair
          </button>
          <button
            onClick={() => handleLoadSample('binary')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded-lg transition-all"
          >
            Load Binary ZIP Pair
          </button>
        </div>
      </div>

      {/* Side-by-Side Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: ORIGINAL FILE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60 uppercase">
                FILE 1: Reference
              </span>
              <span className="text-xs text-slate-400">Original Source File</span>
            </div>
            
            <h2 className="text-lg font-bold text-slate-100 mb-1">
              ORIGINAL / REFERENCE FILE
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              The known authentic source file from software repository.
            </p>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef1.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) setOriginalFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                originalFile
                  ? 'border-cyan-500/60 bg-cyan-950/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef1}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setOriginalFile(e.target.files[0])}
              />

              {getFileIcon(originalFile)}

              {originalFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-100 break-all">{originalFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Size: {formatSize(originalFile.size)} ({originalFile.size.toLocaleString()} bytes)
                  </p>
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 pt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Original File Ready</span>
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-300">Click or Drag &amp; Drop File Here</p>
                  <p className="text-xs text-slate-500">Supports TXT, PDF, ZIP, PNG, JPG, EXE, BIN, etc.</p>
                </div>
              )}
            </div>
          </div>

          {originalFile && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setOriginalFile(null)}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove File</span>
              </button>
            </div>
          )}
        </div>

        {/* CARD 2: DOWNLOADED FILE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-blue-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60 uppercase">
                FILE 2: Received
              </span>
              <span className="text-xs text-slate-400">Target Download File</span>
            </div>
            
            <h2 className="text-lg font-bold text-slate-100 mb-1">
              DOWNLOADED / RECEIVED FILE
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              The downloaded or transmitted file to be verified for corruption.
            </p>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef2.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) setDownloadedFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
                downloadedFile
                  ? 'border-blue-500/60 bg-blue-950/10'
                  : 'border-slate-700 hover:border-slate-500 bg-slate-950/40 hover:bg-slate-950/80'
              }`}
            >
              <input
                ref={fileInputRef2}
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setDownloadedFile(e.target.files[0])}
              />

              {getFileIcon(downloadedFile)}

              {downloadedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-100 break-all">{downloadedFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Size: {formatSize(downloadedFile.size)} ({downloadedFile.size.toLocaleString()} bytes)
                  </p>
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 pt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Downloaded File Ready</span>
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-300">Click or Drag &amp; Drop File Here</p>
                  <p className="text-xs text-slate-500">Supports TXT, PDF, ZIP, PNG, JPG, EXE, BIN, etc.</p>
                </div>
              )}
            </div>
          </div>

          {downloadedFile && (
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setDownloadedFile(null)}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove File</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* VERIFY FILE ACTION BUTTON */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onVerify}
          disabled={!originalFile || !downloadedFile || isProcessing}
          className={`group flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-base tracking-wide transition-all shadow-xl font-mono uppercase ${
            originalFile && downloadedFile && !isProcessing
              ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 cursor-pointer transform hover:-translate-y-0.5'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <span>[ VERIFY FILE INTEGRITY ]</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
