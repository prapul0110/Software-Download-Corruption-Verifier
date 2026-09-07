import React, { useState } from 'react';
import { X, Code, CheckCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function CrcBreakdownModal({ result, onClose }) {
  const [showFullBin1, setShowFullBin1] = useState(false);
  const [showFullBin2, setShowFullBin2] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const copyCrcInfo = () => {
    const text = `
CRC-32 Evaluation Summary
-------------------------
Original File: ${result.original_filename} (${result.original_size} bytes)
Downloaded File: ${result.downloaded_filename} (${result.downloaded_size} bytes)
Generator Poly: ${result.generator_poly} (${result.generator_poly_hex})
CRC Remainder: ${result.crc_remainder} (${result.crc_remainder_hex})
Verification Remainder: ${result.verification_remainder} (${result.verification_remainder_hex})
Dataword Match: ${result.dataword_match ? 'MATCH' : 'MISMATCH'}
Status: ${result.status}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8 font-mono">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 uppercase">
                CRC-32 MATH &amp; DIVISION BREAKDOWN
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Detailed Modulo-2 Polynomial XOR Division Trace &amp; Codeword Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyCrcInfo}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center space-x-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed">
          
          {/* Generator Polynomial Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold uppercase text-[11px] block">
              1. GENERATOR POLYNOMIAL G(x)
            </span>
            <p className="text-slate-300 font-sans text-xs">
              Standard CRC-32 generator polynomial (33 bits):
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-slate-200 text-xs font-mono border border-slate-800 overflow-x-auto">
              G(x) = x³² + x²⁶ + x²³ + x²² + x¹⁶ + x¹² + x¹¹ + x¹⁰ + x⁸ + x⁷ + x⁵ + x⁴ + x² + x + 1
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-500">Hex Representation: </span>
                <span className="text-cyan-300 font-bold">{result.generator_poly_hex}</span>
              </div>
              <div>
                <span className="text-slate-500">33-Bit Binary String: </span>
                <span className="text-cyan-300 font-bold">{result.generator_poly}</span>
              </div>
            </div>
          </div>

          {/* Augmentation & Codeword Math */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-cyan-400 font-bold uppercase text-[11px] block">
              2. AUGMENTATION &amp; CODEWORD FORMULATION
            </span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold">Augmented Dataword 1:</span>
                <div className="p-2.5 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 break-all">
                  [DATAWORD 1] + [32 ZEROS: 00000000000000000000000000000000]
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold">Formulated Codeword:</span>
                <div className="p-2.5 bg-slate-900 rounded-lg text-emerald-300 border border-slate-800 break-all">
                  [DATAWORD 1] + [CRC REMAINDER: {result.crc_remainder}]
                </div>
              </div>
            </div>
          </div>

          {/* XOR Division Trace Table */}
          {result.division_trace && result.division_trace.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-cyan-400 font-bold uppercase text-[11px] block">
                3. XOR POLYNOMIAL DIVISION TRACE (SAMPLE STEPS)
              </span>
              <p className="text-slate-400 font-sans text-xs">
                Demonstrating bitwise XOR reduction over the initial stream bits:
              </p>

              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-2">Step</th>
                      <th className="p-2">In Bit</th>
                      <th className="p-2">MSB</th>
                      <th className="p-2">XOR Poly Applied</th>
                      <th className="p-2">New Remainder (Hex)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {result.division_trace.map((step) => (
                      <tr key={step.step} className="hover:bg-slate-900/50">
                        <td className="p-2 font-bold text-slate-400">{step.step}</td>
                        <td className="p-2 text-cyan-300 font-bold">{step.bit_in}</td>
                        <td className="p-2 text-amber-300">{step.msb}</td>
                        <td className="p-2 font-mono">
                          {step.xor_applied ? (
                            <span className="text-rose-400 font-semibold">0x104C11DB7 (XOR)</span>
                          ) : (
                            <span className="text-slate-600">None (Shift)</span>
                          )}
                        </td>
                        <td className="p-2 text-emerald-400 font-bold">{step.new_remainder_hex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Small File Full Binary Viewer Option */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase text-[11px]">
                4. BINARY DATAWORD VIEWER
              </span>
              {result.dataword1_preview?.is_small_file && (
                <button
                  onClick={() => setShowFullBin1(!showFullBin1)}
                  className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center space-x-1 font-sans"
                >
                  <span>{showFullBin1 ? 'Hide Full Binary' : 'Show Full Binary Data (< 1 KB)'}</span>
                  {showFullBin1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {showFullBin1 && result.dataword1_preview?.full_bin ? (
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px]">Full Binary Dataword 1:</span>
                <div className="p-3 bg-slate-900 rounded-lg text-cyan-300 text-[10px] break-all max-h-40 overflow-y-auto leading-relaxed border border-slate-800">
                  {result.dataword1_preview.full_bin}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 font-sans text-xs">
                {result.dataword1_preview?.is_small_file
                  ? "Click above to reveal full binary data for small file preview."
                  : `File size is ${result.original_size.toLocaleString()} bytes. Displaying truncated 128-bit preview window (first/last 64 bits) to prevent browser memory freezing.`}
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider font-mono transition-all shadow-md"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
