import React from 'react';
import { CheckCircle2, XCircle, Code2, RefreshCw, FileText, Binary, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function ResultCard({ result, onReset, onOpenBreakdown }) {
  if (!result) return null;

  const isAccepted = result.status === 'ACCEPT';

  return (
    <div className="space-y-6 max-w-5xl mx-auto my-6">
      
      {/* High Visibility Status Banner */}
      <div
        className={`rounded-2xl p-6 sm:p-8 border shadow-2xl transition-all ${
          isAccepted
            ? 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-500/60 glow-emerald'
            : 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 border-rose-500/60 glow-rose'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${
                isAccepted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {isAccepted ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase border ${
                    isAccepted
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}
                >
                  {isAccepted ? '✓ STATUS: ACCEPT' : '✕ STATUS: REJECT'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  CRC-32 Modulo-2 Evaluated
                </span>
              </div>

              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 font-mono ${
                  isAccepted ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {isAccepted ? '✓ FILE ACCEPTED' : '✕ FILE REJECTED'}
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {result.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenBreakdown}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-sm font-semibold font-mono transition-all shadow-md"
            >
              <Code2 className="w-4 h-4" />
              <span>View CRC Calculation</span>
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Verify Another Pair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ORIGINAL FILE METRICS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
              ORIGINAL DATAWORD
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Filename:</span>
              <span className="font-semibold text-slate-200 break-all">{result.original_filename}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Byte Size:</span>
                <span className="text-slate-200 font-bold">{result.original_size.toLocaleString()} B</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Dataword 1 Length:</span>
                <span className="text-cyan-400 font-bold">{result.dataword1_preview?.total_bits.toLocaleString()} Bits</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Dataword 1 Bit Preview:</span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300 break-all leading-relaxed max-h-24 overflow-y-auto">
                <span className="text-slate-500">[First 64 bits]: </span>
                {result.dataword1_preview?.first_bits}
                <br />
                <span className="text-slate-500">[Last 64 bits]: </span>
                {result.dataword1_preview?.last_bits}
              </div>
            </div>
          </div>
        </div>

        {/* DOWNLOADED FILE METRICS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
              DOWNLOADED DATAWORD
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Filename:</span>
              <span className="font-semibold text-slate-200 break-all">{result.downloaded_filename}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">Byte Size:</span>
                <span className="text-slate-200 font-bold">{result.downloaded_size.toLocaleString()} B</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Dataword 2 Length:</span>
                <span className="text-blue-400 font-bold">{result.dataword2_preview?.total_bits.toLocaleString()} Bits</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] mb-1">Dataword 2 Bit Preview:</span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-blue-300 break-all leading-relaxed max-h-24 overflow-y-auto">
                <span className="text-slate-500">[First 64 bits]: </span>
                {result.dataword2_preview?.first_bits}
                <br />
                <span className="text-slate-500">[Last 64 bits]: </span>
                {result.dataword2_preview?.last_bits}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CRC ALGORITHM VERIFICATION PARAMETERS CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              CRC-32 EVALUATION SUMMARY
            </h3>
          </div>
          <span className="text-xs text-slate-400">Standard 0x04C11DB7 Polynomial</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* CRC Remainder 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              CRC Remainder 1 (Generated)
            </span>
            <div className="text-sm font-bold text-cyan-300 break-all">
              {result.crc_remainder_hex}
            </div>
            <div className="text-[10px] text-slate-400 break-all font-mono">
              Binary: {result.crc_remainder}
            </div>
          </div>

          {/* Verification Remainder */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Verification Remainder
            </span>
            <div
              className={`text-sm font-bold break-all ${
                result.verification_remainder_zero ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.verification_remainder_hex}
            </div>
            <div className="text-[10px] text-slate-400 break-all font-mono">
              Binary: {result.verification_remainder}
            </div>
          </div>

          {/* Dataword Match */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">
              Dataword 1 == Dataword 2
            </span>
            <div
              className={`text-sm font-bold flex items-center space-x-1.5 ${
                result.dataword_match ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.dataword_match ? (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>MATCH (Identical)</span>
                </>
              ) : (
                <>
                  <AlertOctagon className="w-4 h-4" />
                  <span>MISMATCH (Corrupted)</span>
                </>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Bitwise content comparison
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
