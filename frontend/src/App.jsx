import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ProcessingVisualizer from './components/ProcessingVisualizer';
import ResultCard from './components/ResultCard';
import CrcBreakdownModal from './components/CrcBreakdownModal';
import CorruptionDemo from './components/CorruptionDemo';
import HowItWorks from './components/HowItWorks';
import IntroOverlay from './components/IntroAnimation/IntroOverlay';
import { verifyFilesApi, checkBackendHealth } from './utils/api';
import { AlertTriangle, Server, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'demo' | 'academic'
  const [originalFile, setOriginalFile] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showIntroOverlay, setShowIntroOverlay] = useState(true); // Opening animation on site load
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    checkBackendHealth().then((res) => {
      if (res && res.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    });
  }, []);

  const handleVerify = async () => {
    if (!originalFile || !downloadedFile) return;

    setError(null);
    setIsProcessing(true);
    setPendingResult(null);
    setResult(null);

    try {
      const data = await verifyFilesApi(originalFile, downloadedFile);
      setPendingResult(data);
    } catch (err) {
      setError(err.message || 'Verification API request failed');
      setIsProcessing(false);
    }
  };

  const handleVisualizationComplete = () => {
    setIsProcessing(false);
    if (pendingResult) {
      setResult(pendingResult);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setDownloadedFile(null);
    setResult(null);
    setPendingResult(null);
    setError(null);
    setIsProcessing(false);
    setShowBreakdownModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Opening Intro Animation Overlay (Auto-unmounts after playing) */}
      {showIntroOverlay && (
        <IntroOverlay
          onDismiss={() => setShowIntroOverlay(false)}
          autoDismissTime={3000}
        />
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Backend Offline Warning Banner */}
        {backendStatus === 'offline' && (
          <div className="mb-6 p-4 bg-amber-950/80 border border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-200 shadow-xl">
            <div className="flex items-center space-x-3">
              <Server className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <strong className="font-bold">Backend Flask Server Offline:</strong> Make sure the Flask backend is running on <code className="bg-amber-900/60 px-1 py-0.5 rounded">http://localhost:5000</code>.
              </div>
            </div>
            <button
              onClick={() => checkBackendHealth().then(res => setBackendStatus(res?.status === 'healthy' ? 'online' : 'offline'))}
              className="px-3 py-1 bg-amber-900 hover:bg-amber-800 border border-amber-700 rounded-lg font-mono"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* TAB 1: VERIFIER SUITE */}
        {activeTab === 'verify' && (
          <div className="space-y-8">
            
            {/* API Error Toast */}
            {error && (
              <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-200 text-sm rounded-2xl flex items-center space-x-3 shadow-xl">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Uploader Section */}
            {!isProcessing && !result && (
              <FileUploader
                originalFile={originalFile}
                setOriginalFile={setOriginalFile}
                downloadedFile={downloadedFile}
                setDownloadedFile={setDownloadedFile}
                onVerify={handleVerify}
                isProcessing={isProcessing}
              />
            )}

            {/* Processing Visualizer */}
            {isProcessing && (
              <ProcessingVisualizer onComplete={handleVisualizationComplete} />
            )}

            {/* Result Display */}
            {!isProcessing && result && (
              <ResultCard
                result={result}
                onReset={handleReset}
                onOpenBreakdown={() => setShowBreakdownModal(true)}
              />
            )}

          </div>
        )}

        {/* TAB 2: CORRUPTION DEMO */}
        {activeTab === 'demo' && <CorruptionDemo />}

        {/* TAB 3: ACADEMIC GUIDE */}
        {activeTab === 'academic' && <HowItWorks />}

      </main>

      {/* Modal */}
      {showBreakdownModal && result && (
        <CrcBreakdownModal
          result={result}
          onClose={() => setShowBreakdownModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SOFTWARE DOWNLOAD CORRUPTION VERIFIER — Academic Final Project</span>
          <span className="flex items-center space-x-1 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>CRC-32 Polynomial: 0x104C11DB7</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
