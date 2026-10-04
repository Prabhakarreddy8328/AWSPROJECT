import React from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const ReportsPage: React.FC = () => {
  const { assets, alerts, edgeMetrics, cloudSyncState } = useSimulation();

  const handlePrint = () => {
    window.print();
  };

  const activeAlerts = alerts.filter(a => a.status === 'Active');

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>AWS OUTPOSTS EXECUTIVE REPORT GENERATOR</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Industrial Plant Performance & Study Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated audit report summarizing edge processing benchmarks, asset health scores, and AWS Cloud sync statistics.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg text-xs border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 space-y-8 print:bg-white print:text-slate-100 shadow-sm">
        
        {/* Report Header */}
        <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">AWS Outposts Design Study Report</div>
            <h2 className="text-2xl font-semibold text-slate-100 mt-1">Low-Latency Plant Workload Study</h2>
            <div className="text-xs text-slate-400 mt-1">
              Location: Manufacturing Facility Bay 4 • Rack ID: op-0a82f941c9b2 • Generated: {new Date().toLocaleString()}
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded border border-emerald-500/40 uppercase text-[10px]">
              AUDIT VERIFIED
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">1. Plant Executive Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">TOTAL ASSETS</span>
              <span className="text-lg font-bold text-slate-100">{assets.length} Machines</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">AVG EDGE LATENCY</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">{edgeMetrics.avgEdgeLatencyMs} ms</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">ACTIVE ALERTS</span>
              <span className="text-lg font-bold text-amber-400">{activeAlerts.length} Active</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SYSTEM AVAILABILITY</span>
              <span className="text-lg font-bold text-emerald-400">99.99%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Asset Health Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">2. Asset Telemetry & Health Audit</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Asset ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Temp (°C)</th>
                  <th className="py-2.5 px-3">Pressure (PSI)</th>
                  <th className="py-2.5 px-3">Vibration</th>
                  <th className="py-2.5 px-3">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {assets.map(a => (
                  <tr key={a.id}>
                    <td className="py-2 px-3 text-cyan-400">{a.id}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-100">{a.name}</td>
                    <td className="py-2 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        a.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">{a.currentTelemetry.temperature}</td>
                    <td className="py-2 px-3">{a.currentTelemetry.pressure}</td>
                    <td className="py-2 px-3">{a.currentTelemetry.vibration}</td>
                    <td className="py-2 px-3 font-bold text-emerald-400">{a.healthScore}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: AWS Outposts Edge vs Region Cloud Benchmark */}
        <div className="space-y-3 border-t border-slate-800 pt-6">
          <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">3. AWS Outposts Edge vs AWS Cloud Benchmark Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">AWS Outposts Local Processing</span>
              <p className="text-slate-400">
                Average decision latency: <strong className="text-cyan-400">{edgeMetrics.avgEdgeLatencyMs} ms</strong>. Local decision engine operates with 100% autonomy even during internet WAN disconnections.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">AWS Region Cloud Synchronization</span>
              <p className="text-slate-400">
                Average WAN latency: <strong className="text-amber-400">{cloudSyncState.networkLatencyMs} ms</strong>. Flushed {cloudSyncState.eventsSynced.toLocaleString()} aggregated telemetry events to Amazon S3 & CloudWatch.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
