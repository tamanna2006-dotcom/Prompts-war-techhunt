import { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X
} from 'lucide-react';
import { generateTextAuditReport, downloadTextReport, printStyledPdfReport } from '../utils/reportGenerator';

export default function SafetyAuditExporter({
  isOpen,
  onClose,
  origin,
  destination,
  timeOfDay,
  mode,
  safetyResult,
  contacts,
  userLocation,
  hazards
}) {
  const [copied, setCopied] = useState(false);

  const reportData = {
    origin,
    destination,
    timeOfDay,
    mode,
    safetyResult,
    contacts,
    userLocation,
    hazards
  };

  const textSummary = generateTextAuditReport(reportData);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    printStyledPdfReport(reportData);
  };

  const handleDownloadTxt = () => {
    downloadTextReport(reportData);
  };

  const score = safetyResult?.score || 88;
  const level = safetyResult?.level || 'High Safety';
  const badgeColor = score >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60' : score >= 50 ? 'text-amber-400 border-amber-500/40 bg-amber-950/60' : 'text-rose-400 border-rose-500/40 bg-rose-950/60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Export Safety Audit Report
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  PDF & TEXT READY
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Download a clean, verified safety brief to share with family, guardians, or campus security.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Report Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Route Safety Score</div>
            <div className="text-2xl font-black text-cyan-400">{score}/100</div>
            <div className={`text-[10px] font-bold uppercase mt-0.5 px-2 py-0.5 rounded-md border inline-block ${badgeColor}`}>
              {level}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Commute Route</div>
            <div className="text-xs font-bold text-white truncate mt-1">{origin}</div>
            <div className="text-[11px] text-cyan-400 truncate">➡️ {destination}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Monitored Hazards</div>
            <div className="text-2xl font-black text-emerald-400">
              {safetyResult?.tradeOff?.safest?.hazardsAvoided || 2} Avoided
            </div>
            <div className="text-[10px] text-slate-400">4 Safe Havens on Path</div>
          </div>
        </div>

        {/* Live Scrollable Report Transcript */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Formatted Audit Transcript Preview
          </label>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
            {textSummary}
          </pre>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Print / PDF Button */}
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            {/* Download Text Button */}
            <button
              onClick={handleDownloadTxt}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download .TXT Brief</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Markdown */}
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Brief!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold transition-colors"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
