import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle, Loader2 } from 'lucide-react';

const ALGORITHM_STEPS = [
  { id: 1, title: "STEP 1", label: "File 1 → Binary Dataword 1", desc: "Reading reference file stream and extracting bitwise representation." },
  { id: 2, title: "STEP 2", label: "Append 32 Zeros", desc: "Augmenting Dataword 1 with 32 zero bits (0000...0000) for CRC-32 division." },
  { id: 3, title: "STEP 3", label: "CRC-32 Generator", desc: "Loading 33-bit polynomial generator G(x) = 0x104C11DB7." },
  { id: 4, title: "STEP 4", label: "XOR Polynomial Division", desc: "Performing bitwise modulo-2 division using binary XOR operations." },
  { id: 5, title: "STEP 5", label: "Calculate CRC Remainder", desc: "Extracting 32-bit CRC remainder from division accumulator." },
  { id: 6, title: "STEP 6", label: "Generate Codeword", desc: "Formulating Codeword = Dataword 1 + CRC Remainder." },
  { id: 7, title: "STEP 7", label: "File 2 → Dataword 2", desc: "Reading downloaded file stream into binary bit sequence." },
  { id: 8, title: "STEP 8", label: "Verify Codeword", desc: "Dividing Codeword (Dataword 2 + Remainder) by Generator polynomial." },
  { id: 9, title: "STEP 9", label: "Check Remainder == 0", desc: "Evaluating if verification remainder equals 32 zeros (0x00000000)." },
  { id: 10, title: "STEP 10", label: "Compare Dataword 1 & Dataword 2", desc: "Performing bitwise stream comparison between File 1 and File 2." },
];

export default function ProcessingVisualizer({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ALGORITHM_STEPS.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => onComplete && onComplete(), 300);
          return prev;
        }
      });
    }, 250); // Animated speed through 10 steps

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase">
              ALGORITHM EXECUTION PIPELINE
            </h3>
            <p className="text-xs text-slate-400">
              Executing Modulo-2 Polynomial Division &amp; Verification Flow
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs text-cyan-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Stage {currentStep} / {ALGORITHM_STEPS.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full mb-6 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${(currentStep / ALGORITHM_STEPS.length) * 100}%` }}
        />
      </div>

      {/* 10 Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALGORITHM_STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                  : isDone
                  ? 'bg-slate-950/60 border-slate-800 opacity-90'
                  : 'bg-slate-950/20 border-slate-900/60 opacity-40'
              }`}
            >
              <div className="pt-0.5">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    {step.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-cyan-900/80 text-cyan-300 px-1.5 py-0.2 rounded font-mono animate-pulse">
                      PROCESSING
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate">
                  {step.label}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
