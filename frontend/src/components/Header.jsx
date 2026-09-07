import React from 'react';
import { ShieldCheck, Cpu, AlertTriangle, BookOpen, FlaskConical } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Title & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white flex-shrink-0">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent uppercase font-mono">
                  SOFTWARE DOWNLOAD CORRUPTION VERIFIER
                </h1>
                <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-xs px-2.5 py-0.5 rounded-full font-mono font-medium">
                  CRC-32 Modulo-2
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                CRC-32 Based Error &amp; Corruption Detection Engine
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-sm font-medium">
            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'verify'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifier Suite</span>
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'demo'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Corruption Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('academic')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'academic'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>How It Works</span>
            </button>
          </div>

        </div>

        {/* Academic Security Disclaimer Banner */}
        <div className="mt-3.5 bg-amber-950/40 border border-amber-800/50 rounded-lg px-3.5 py-2 flex items-center space-x-2 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>
            <strong className="font-semibold text-amber-200">Academic Integrity Note:</strong> CRC detects accidental data corruption and noise transmission errors. It does not provide cryptographic authenticity or protection against intentional malicious tampering.
          </span>
        </div>
      </div>
    </header>
  );
}
