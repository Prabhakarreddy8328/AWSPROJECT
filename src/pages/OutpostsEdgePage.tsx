import React from 'react';
import { Cpu, Zap, Cloud, Sliders, Clock } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const OutpostsEdgePage: React.FC = () => {
  const { edgeMetrics, cloudSyncState, rules, toggleRule, eventLogs } = useSimulation();

  const localDecisionLogs = eventLogs.filter(log => log.processingLocation === 'Outposts / Edge');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30 shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AWS OUTPOSTS ON-PREMISES EDGE ENGINE</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-100">Low-Latency Local Processing & Edge Rules</h1>
        <p className="text-xs text-slate-400 max-w-3xl">
          AWS Outposts delivers native AWS infrastructure (EC2, VPC, EBS) directly into the manufacturing plant facility. Local decisions are evaluated in &lt; 5ms without dependence on AWS Region cloud latency.
        </p>
      </div>

      {/* Requirement #6: Edge Processing Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Avg Edge Latency</span>
          <span className="text-2xl font-semibold text-cyan-400 font-mono">{edgeMetrics.avgEdgeLatencyMs} ms</span>
          <span className="text-[9px] text-slate-500 block">&lt; 5ms Target</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Max Edge Latency</span>
          <span className="text-2xl font-semibold text-cyan-300 font-mono">{edgeMetrics.maxEdgeLatencyMs} ms</span>
          <span className="text-[9px] text-slate-500 block">Peak Load</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Events Processed</span>
          <span className="text-xl font-bold text-slate-100 font-mono">{edgeMetrics.eventsProcessedLocally.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block">Local Ingestion</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Local Decisions</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{edgeMetrics.localDecisionsMade}</span>
          <span className="text-[9px] text-slate-500 block">Automated Cutoffs</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Cloud Synced</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{edgeMetrics.cloudForwardedEvents.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block">Async S3/CloudWatch</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Throughput</span>
          <span className="text-xl font-bold text-slate-100 font-mono">{edgeMetrics.edgeProcessingRate} req/s</span>
          <span className="text-[9px] text-slate-500 block">High-Frequency</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Network Availability</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{edgeMetrics.networkAvailability}%</span>
          <span className="text-[9px] text-slate-500 block">Local LAN Uptime</span>
        </div>

      </div>

      {/* Latency Visual Comparison (Outposts Edge <5ms vs AWS Region Cloud 42ms) */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Visual Processing Latency Breakdown</span>
        </h2>

        <div className="space-y-4">
          
          {/* Outposts Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-cyan-400 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4" />
                <span>AWS Outposts On-Premises Local Processing: &lt; 3.5 ms</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold">100% Deterministic Safety Control</span>
            </div>
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
              <div className="h-full bg-cyan-400 w-[5%]" />
              <div className="h-full bg-slate-800 w-[95%]" />
            </div>
          </div>

          {/* AWS Cloud Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-400 flex items-center space-x-1.5">
                <Cloud className="w-4 h-4" />
                <span>AWS Region Cloud Processing (us-east-1): {cloudSyncState.networkLatencyMs} ms</span>
              </span>
              <span className="text-slate-400 font-mono">Delayed by WAN Network Latency</span>
            </div>
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
              <div className="h-full bg-amber-500 w-[60%]" />
              <div className="h-full bg-slate-800 w-[40%]" />
            </div>
          </div>

        </div>
      </div>

      {/* Requirement #7: Local Decision Pipeline Visualizer & Active Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Local Rules Engine Panel */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Local Outposts Rule Engine</span>
              </h2>
              <p className="text-[11px] text-slate-400">Rules evaluated instantaneously on incoming sensor packets.</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded font-mono">
              {rules.filter(r => r.enabled).length} Active Rules
            </span>
          </div>

          <div className="space-y-3">
            {rules.map(rule => (
              <div 
                key={rule.id}
                className={`p-3.5 rounded-lg border transition-all text-xs space-y-2 ${
                  rule.enabled ? 'bg-slate-950 border-slate-800' : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400 font-bold">{rule.id}</span>
                    <span className="font-bold text-slate-100">{rule.sensor} Threshold Rule</span>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      rule.enabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {rule.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <p className="text-slate-300 font-mono text-[11px]">
                  IF {rule.sensor} {rule.operator} {rule.threshold}{rule.unit} → <strong className="text-amber-400">{rule.action}</strong>
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>Severity: <strong className={rule.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>{rule.severity}</strong></span>
                  <span className="text-cyan-400 font-mono">Exec Latency: ~3.1 ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Decision Trace Logs */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Local Decision Execution Log Trace</span>
          </h2>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {localDecisionLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No local edge decisions triggered yet. Inject an anomaly scenario to observe microsecond rule evaluation!
              </div>
            ) : (
              localDecisionLogs.map(log => (
                <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>{log.timestamp} • {log.id}</span>
                    <span className="text-cyan-400 font-bold">{log.latencyMs} ms Latency</span>
                  </div>

                  <div className="font-bold text-slate-100">{log.assetName} — {log.eventType}</div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span>Value: <strong className="text-rose-400">{log.sensorValue}</strong> (Limit: {log.threshold})</span>
                    <span className="text-amber-400 font-semibold">{log.action}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
