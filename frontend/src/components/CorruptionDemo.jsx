import React, { useState, useRef } from 'react';
import { FlaskConical, UploadCloud, AlertTriangle, ArrowRight, CheckCircle2, XCircle, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { corruptDemoApi } from '../utils/api';

export default function CorruptionDemo() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleGenerateSample = () => {
    const text = "Academic CRC-32 Test Data for Automatic Byte Mutation Demo\nFile ID: DEMO-9982\nChecksum Target: 0x04C11DB7";
    const f = new File([text], 'demo_source.txt', { type: 'text/plain' });
    setFile(f);
    setDemoResult(null);
    setError(null);
  };

  const handleRunDemo = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await corruptDemoApi(file);
      setDemoResult(result);
    } catch (err) {
      setError(err.message || 'Demo execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 my-6">
      
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">
              CORRUPTION DEMONSTRATION BENCH
            </h2>
            <p className="text-xs text-slate-400">
              Inject single-byte mutation into a temporary copy and test CRC-32 detection
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateSample}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono border border-slate-700 transition-all"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Load Sample File</span>
        </button>
      </div>

      {/* Upload & Run Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono mb-2">
            1. SELECT TEST FILE FOR DEMO
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Upload any file or use the sample file above. The system will create a temporary copy with 1 byte modified and will never modify your original file.
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 bg-slate-950/40 hover:bg-slate-950/80 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                  setDemoResult(null);
                }
              }}
            />
            <UploadCloud className="w-8 h-8 text-purple-400 mb-2" />
            {file ? (
              <div>
                <p className="text-sm font-semibold text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-400 font-mono">Size: {file.size.toLocaleString()} bytes</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Click or drag file here to test corruption detection</p>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <button
            onClick={handleRunDemo}
            disabled={!file || loading}
            className={`flex items-center space-x-2 px-8 py-3.5 rounded-xl font-mono font-bold text-sm uppercase transition-all shadow-lg ${
              file && !loading
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white cursor-pointer shadow-purple-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Byte Mutation &amp; Verifying...</span>
              </>
            ) : (
              <>
                <span>[ INJECT CORRUPTION &amp; VERIFY ]</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Results Screen */}
      {demoResult && (
        <div className="space-y-6">
          
          {/* Result Banner */}
          <div className="bg-slate-900 border border-rose-500/60 rounded-2xl p-6 shadow-2xl glow-rose">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                    ✕ STATUS: REJECT
                  </span>
                  <h3 className="text-2xl font-extrabold text-rose-300 font-mono mt-1">
                    CORRUPTION DETECTED!
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    1 byte mutated at byte index <code className="text-amber-300 font-bold">{demoResult.corrupted_index}</code> in the temporary copy.
                  </p>
                </div>
              </div>

              <div className="text-right font-mono text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>Verification Remainder:</div>
                <div className="text-rose-400 font-bold text-sm">{demoResult.verification_remainder_hex}</div>
                <div className="text-[10px] text-slate-500">Non-zero remainder proves corruption</div>
              </div>
            </div>
          </div>

          {/* Side by Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Original Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  ORIGINAL FILE
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div>Filename: <strong className="text-slate-100">{demoResult.original_filename}</strong></div>
                <div>Size: <strong>{demoResult.original_size} bytes</strong></div>
                <div>CRC Remainder 1: <strong className="text-cyan-300">{demoResult.crc_remainder_hex}</strong></div>
                <div className="text-[10px] text-slate-500 break-all">Binary: {demoResult.crc_remainder}</div>
              </div>
            </div>

            {/* Corrupted Card */}
            <div className="bg-slate-900 border border-rose-900/80 rounded-2xl p-5 space-y-3 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                  MUTATED COPY (1 BYTE ALTERED)
                </span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xs space-y-1.5 text-slate-300">
                <div>Filename: <strong className="text-slate-100">{demoResult.downloaded_filename}</strong></div>
                <div>Mutated Index: <strong className="text-rose-400">Byte #{demoResult.corrupted_index}</strong></div>
                <div>Verification Remainder: <strong className="text-rose-400">{demoResult.verification_remainder_hex}</strong></div>
                <div className="text-[10px] text-slate-500 break-all">Binary: {demoResult.verification_remainder}</div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
