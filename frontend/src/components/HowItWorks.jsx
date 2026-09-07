import React, { useState } from 'react';
import { BookOpen, Cpu, ShieldAlert, ArrowDown, Binary, CheckCircle2, FileText, Layers, Hash, HelpCircle, ChevronDown, ChevronUp, Play, RotateCcw } from 'lucide-react';

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive XOR Division Demonstration state
  const sampleDatawordBits = "110101"; // Simple 6-bit sample dataword
  const generatorPoly = "1011"; // 4-bit polynomial (x^3 + x + 1)
  const [simStep, setSimStep] = useState(0);

  const faqList = [
    {
      id: 1,
      title: "What is CRC (Cyclic Redundancy Check)?",
      answer: "CRC is an error-detecting code based on cyclic algebraic codes. It treats binary file data as coefficients of a polynomial and divides it by a standardized 33-bit generator polynomial G(x) using modulo-2 arithmetic (bitwise XOR without binary carries or borrows)."
    },
    {
      id: 2,
      title: "Why append 32 zeros during CRC generation?",
      answer: "Appending 32 zero bits multiplies the dataword polynomial D(x) by x³², shifting the file data left by 32 bit positions. This reserves the lower 32 bit slots to hold the 32-bit remainder R(x) produced by polynomial division, ensuring no data bits are overwritten."
    },
    {
      id: 3,
      title: "What is the standard CRC-32 Generator Polynomial?",
      answer: "The IEEE 802.3 standard CRC-32 generator polynomial is G(x) = x³² + x²⁶ + x²³ + x²² + x¹⁶ + x¹² + x¹¹ + x¹⁰ + x⁸ + x⁷ + x⁵ + x⁴ + x² + x + 1. In binary, it is represented as 0x104C11DB7 (a 33-bit binary string: 1 0000 0100 1100 0001 0001 1101 1011 0111)."
    },
    {
      id: 4,
      title: "Why does a valid codeword yield remainder 0?",
      answer: "Since Augmented Dataword D(x)·x³² = Q(x)·G(x) ⊕ R(x), the Codeword C(x) is formed as C(x) = D(x)·x³² ⊕ R(x) = Q(x)·G(x). Because C(x) is an exact multiple of G(x), dividing C(x) by G(x) yields remainder (Q(x)·G(x)) mod G(x) = 0."
    },
    {
      id: 5,
      title: "What does corruption mean and how is it detected?",
      answer: "If any bit in the downloaded file or codeword is corrupted during transmission (flipped from 0 to 1 or 1 to 0), the received polynomial becomes C'(x) = C(x) ⊕ E(x), where E(x) is the error polynomial. Dividing C'(x) by G(x) yields remainder E(x) mod G(x) ≠ 0, triggering instant REJECT."
    },
    {
      id: 6,
      title: "CRC vs Cryptographic Hashes (SHA-256)",
      answer: "CRC-32 is engineered for ultra-fast detection of accidental data corruption (such as network packet loss, storage bit rot, or noise). It is non-cryptographic: an intentional attacker can easily modify a file to match a specific CRC. For security authentication, SHA-256 or digital signatures are required."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 my-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-mono uppercase">
            ACADEMIC THEORY &amp; ALGORITHM FLOWCHART
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive breakdown of CRC-32 Modulo-2 XOR binary polynomial division.
          </p>
        </div>
      </div>

      {/* Professor's Flowchart Architecture Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-mono uppercase">
              PROFESSOR'S ALGORITHM FLOWCHART
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
            Source of Truth Architecture
          </span>
        </div>

        {/* Visual Pipeline */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
          
          {/* FILE 1 SENDER PIPELINE */}
          <div className="space-y-4">
            <div className="text-center font-bold text-cyan-400 uppercase tracking-widest text-xs">
              === SENDER / GENERATION PIPELINE (FILE 1) ===
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <FileText className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200 block">FILE 1</span>
                <span className="text-[10px] text-slate-500">Original File</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <Binary className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold text-cyan-300 block">DATAWORD 1</span>
                <span className="text-[10px] text-slate-500">Bit Stream</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <Hash className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-amber-300 block">+ 32 ZEROS</span>
                <span className="text-[10px] text-slate-500">Augmentation</span>
              </div>

              <div className="p-3 bg-slate-900 border border-cyan-800/80 rounded-xl bg-cyan-950/30">
                <Cpu className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <span className="font-bold text-cyan-300 block">XOR DIVISION</span>
                <span className="text-[10px] text-slate-500">0x104C11DB7</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-cyan-400 animate-bounce" />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center max-w-md mx-auto">
              <span className="text-slate-400 text-[10px] block">OUTPUT FROM GENERATOR:</span>
              <span className="text-emerald-400 font-bold text-sm block my-1">
                CODEWORD = DATAWORD 1 + 32-BIT REMAINDER
              </span>
              <span className="text-slate-500 text-[10px]">
                Valid Codeword forms exact multiple of Generator polynomial G(x)
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 my-6" />

          {/* FILE 2 RECEIVER PIPELINE */}
          <div className="space-y-4">
            <div className="text-center font-bold text-blue-400 uppercase tracking-widest text-xs">
              === RECEIVER / VERIFICATION PIPELINE (FILE 2) ===
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <FileText className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="font-bold text-slate-200 block">FILE 2</span>
                <span className="text-[10px] text-slate-500">Downloaded File</span>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <Binary className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="font-bold text-blue-300 block">DATAWORD 2</span>
                <span className="text-[10px] text-slate-500">Received Bit Stream</span>
              </div>

              <div className="p-3 bg-slate-900 border border-blue-800/80 rounded-xl bg-blue-950/30">
                <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="font-bold text-blue-300 block">DIVIDE CODEWORD</span>
                <span className="text-[10px] text-slate-500">By 0x104C11DB7</span>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-5 h-5 text-blue-400 animate-bounce" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-400 text-[10px] block font-bold">CHECK 1: REMAINDER == 0</span>
                <p className="text-slate-300 text-[11px] mt-1">
                  Remainder = <code className="text-cyan-300">0000...0000</code> confirms valid codeword division.
                </p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <span className="text-slate-400 text-[10px] block font-bold">CHECK 2: DATAWORD 1 == DATAWORD 2</span>
                <p className="text-slate-300 text-[11px] mt-1">
                  Bitwise stream matching confirms exact file identicality.
                </p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-950 to-rose-950 border border-slate-800 rounded-xl text-center">
              <span className="text-slate-300 font-bold block text-sm">
                FINAL DECISION: [ ACCEPT ] OR [ REJECT / CORRUPTION DETECTED ]
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Modulo-2 Division Mini Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 font-mono">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              INTERACTIVE MODULO-2 XOR DIVISION DEMONSTRATOR
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Educational Mini Example</span>
        </div>

        <p className="text-xs text-slate-300">
          Step through a 4-bit polynomial division example (Dataword: <code>110101</code>, Generator: <code>1011</code>, Appended Zeros: <code>000</code>):
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block">Dataword</span>
              <span className="text-cyan-300 font-bold">{sampleDatawordBits}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block">+ 3 Zeros</span>
              <span className="text-amber-300 font-bold">000</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block">Generator G(x)</span>
              <span className="text-purple-300 font-bold">{generatorPoly}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block">Current Step</span>
              <span className="text-emerald-300 font-bold">Step {simStep} / 6</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200">
            {simStep === 0 && <div>Click <strong>Next Division Step</strong> below to start Modulo-2 XOR division trace.</div>}
            {simStep === 1 && <div>Step 1: Load initial 4 bits <code>1101</code>. Top bit is 1, XOR with <code>1011</code> &rarr; Remainder: <code>0110</code>.</div>}
            {simStep === 2 && <div>Step 2: Shift in next bit 0 &rarr; <code>1100</code>. Top bit is 1, XOR with <code>1011</code> &rarr; Remainder: 0111.</div>}
            {simStep === 3 && <div>Step 3: Shift in next bit 1 &rarr; <code>1111</code>. Top bit is 1, XOR with <code>1011</code> &rarr; Remainder: 0100.</div>}
            {simStep === 4 && <div>Step 4: Shift in 1st zero &rarr; <code>1000</code>. Top bit is 1, XOR with <code>1011</code> &rarr; Remainder: 0011.</div>}
            {simStep === 5 && <div>Step 5: Shift in 2nd zero &rarr; <code>0110</code>. Top bit is 0, shift only (no XOR) &rarr; Remainder: 0110.</div>}
            {simStep === 6 && <div>Step 6: Shift in 3rd zero &rarr; <code>1100</code>. Top bit is 1, XOR with <code>1011</code> &rarr; Final Remainder: <strong className="text-emerald-400">001</strong>. Codeword: <code>110101 001</code>!</div>}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => setSimStep((prev) => (prev < 6 ? prev + 1 : 0))}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-bold transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{simStep < 6 ? 'Next Division Step' : 'Restart Mini Trace'}</span>
            </button>
            <button
              onClick={() => setSimStep(0)}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Academic FAQ Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100 font-mono uppercase">
            ACADEMIC CONCEPTS &amp; FREQUENTLY ASKED QUESTIONS
          </h3>
        </div>

        <div className="space-y-3">
          {faqList.map((item) => {
            const isOpen = openFaq === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : item.id)}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm text-slate-200 hover:text-cyan-300 transition-colors"
                >
                  <span className="font-mono text-xs">{item.title}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-900/60 bg-slate-950/80">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
