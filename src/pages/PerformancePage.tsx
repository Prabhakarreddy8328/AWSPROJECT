import React from 'react';
import { Gauge, Cpu, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const PerformancePage: React.FC = () => {
  const latencyData = [
    { name: 'Local Sensor Processing', OutpostsEdge: 3.2, TraditionalCloud: 45.0 },
    { name: 'Safety Rule Evaluation', OutpostsEdge: 2.1, TraditionalCloud: 62.0 },
    { name: 'Emergency Shutdown Action', OutpostsEdge: 4.8, TraditionalCloud: 85.0 },
    { name: 'Telemetry Query Latency', OutpostsEdge: 1.8, TraditionalCloud: 38.0 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
          <Gauge className="w-5 h-5" />
          <span>AWS OUTPOSTS BENCHMARK STUDY</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-100">Edge Processing vs Traditional Cloud Performance</h1>
        <p className="text-xs text-slate-400 max-w-3xl">
          Quantitative benchmarking comparing local AWS Outposts EC2 processing against pure AWS Region cloud execution.
        </p>
        <span className="inline-block bg-slate-950 text-amber-400 font-bold text-[10px] px-2.5 py-0.5 rounded border border-amber-500/40">
          NOTE: Values represent simulated demo benchmarks for architecture study presentation.
        </span>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Outposts Edge Card */}
        <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-slate-100">AWS Outposts Local Edge</h2>
            </div>
            <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2.5 py-0.5 rounded border border-cyan-500/40">
              ULTRA-LOW LATENCY
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Processing Latency:</span>
              <span className="text-2xl font-semibold text-cyan-400 font-mono">&lt; 3.5 ms</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Internet / WAN Dependency:</span>
              <span className="font-bold text-emerald-400">ZERO (Fully Autonomous)</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Safety Cutoff Speed:</span>
              <span className="font-bold text-cyan-400 font-mono">&lt; 5 ms</span>
            </div>
            <div className="flex justify-between items-baseline pb-1">
              <span className="text-slate-400">Offline Decision Capability:</span>
              <span className="font-bold text-emerald-400">100% Operational</span>
            </div>
          </div>
        </div>

        {/* Traditional Pure Cloud Card */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100">Traditional AWS Region Cloud</h2>
            </div>
            <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-0.5 rounded">
              STANDARD WAN
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Processing Latency:</span>
              <span className="text-2xl font-semibold text-amber-400 font-mono">42 – 85 ms</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Internet / WAN Dependency:</span>
              <span className="font-bold text-amber-400">HIGH (Requires WAN Connection)</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-800/60 pb-2">
              <span className="text-slate-400">Safety Cutoff Speed:</span>
              <span className="font-bold text-amber-400 font-mono">85+ ms</span>
            </div>
            <div className="flex justify-between items-baseline pb-1">
              <span className="text-slate-400">Offline Decision Capability:</span>
              <span className="font-bold text-rose-400">0% (Stalls on Disconnect)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Side-by-Side Benchmark Latency Chart */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-100">Side-by-Side Execution Response Time (Milliseconds)</h2>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
              <XAxis dataKey="name" stroke="#6b7685" fontSize={10} />
              <YAxis stroke="#6b7685" fontSize={10} label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', fill: '#6b7685' }} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d3d9e0', borderRadius: '6px', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="OutpostsEdge" name="AWS Outposts Edge (ms)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TraditionalCloud" name="Traditional AWS Cloud (ms)" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
