import React from 'react';
import { 
  ArrowLeft, 
  Activity, 
  Flame, 
  Gauge, 
  Zap, 
  Clock, 
  Wrench 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AssetDetailPageProps {
  setActiveTab: (tab: string) => void;
}

export const AssetDetailPage: React.FC<AssetDetailPageProps> = ({ setActiveTab }) => {
  const { assets, selectedAssetId, eventLogs, triggerScenario } = useSimulation();

  const asset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const telemetry = asset.currentTelemetry;
  const history = asset.telemetryHistory;

  const assetLogs = eventLogs.filter(log => log.assetId === asset.id);

  const getHealthRatingText = (score: number) => {
    if (score >= 90) return { label: 'Healthy', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (score >= 70) return { label: 'Warning', color: 'text-amber-400', bg: 'bg-amber-500' };
    if (score >= 40) return { label: 'Attention Required', color: 'text-orange-400', bg: 'bg-orange-500' };
    return { label: 'Critical', color: 'text-rose-400', bg: 'bg-rose-500' };
  };

  const rating = getHealthRatingText(asset.healthScore);

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Back & Asset Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('assets')}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
            title="Back to Assets List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-bold">{asset.id}</span>
              <span className="text-xs text-slate-400">• {asset.location}</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-100">{asset.name}</h1>
          </div>
        </div>

        {/* Quick Simulation Trigger for this asset */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Test Anomaly:</span>
          <button 
            onClick={() => triggerScenario('HIGH_TEMP', asset.id)}
            className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 font-semibold"
          >
            High Temp
          </button>
          <button 
            onClick={() => triggerScenario('HIGH_VIBRATION', asset.id)}
            className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-semibold"
          >
            Vibration
          </button>
          <button 
            onClick={() => triggerScenario('NORMAL')}
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Gauges + Health Score + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Telemetry Snapshot Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Temp Gauge */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Temperature</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <div className={`text-2xl font-semibold font-mono ${telemetry.temperature > asset.thresholds.maxTemp ? 'text-rose-400' : 'text-slate-100'}`}>
                {telemetry.temperature} °C
              </div>
              <div className="text-[10px] text-slate-500">Threshold: {asset.thresholds.maxTemp}°C</div>
            </div>

            {/* Pressure Gauge */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Pressure</span>
                <Gauge className="w-4 h-4 text-amber-400" />
              </div>
              <div className={`text-2xl font-semibold font-mono ${telemetry.pressure > asset.thresholds.maxPressure ? 'text-amber-400' : 'text-slate-100'}`}>
                {telemetry.pressure} PSI
              </div>
              <div className="text-[10px] text-slate-500">Threshold: {asset.thresholds.maxPressure} PSI</div>
            </div>

            {/* Vibration Gauge */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Vibration</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className={`text-2xl font-semibold font-mono ${telemetry.vibration > asset.thresholds.maxVibration ? 'text-rose-400' : 'text-slate-100'}`}>
                {telemetry.vibration} mm/s
              </div>
              <div className="text-[10px] text-slate-500">Threshold: {asset.thresholds.maxVibration} mm/s</div>
            </div>

            {/* Machine Speed */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Machine Speed</span>
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-semibold font-mono text-slate-100">
                {telemetry.speed} RPM
              </div>
              <div className="text-[10px] text-slate-500">Power: {telemetry.power} kW</div>
            </div>

          </div>

          {/* Real-time Telemetry Graph */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Temperature & Pressure Stream</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
                  <XAxis dataKey="timestamp" stroke="#6b7685" fontSize={10} />
                  <YAxis stroke="#6b7685" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d3d9e0', borderRadius: '6px', fontSize: 12 }}
                    labelStyle={{ color: '#566070' }}
                  />
                  <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#dc2626" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pressure" name="Pressure (PSI)" stroke="#d97706" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Health Breakdown + Maintenance */}
        <div className="space-y-6">
          
          {/* Health Score Box */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Asset Health Assessment</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${rating.bg} text-slate-950`}>
                {rating.label}
              </span>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className={`text-5xl font-semibold ${rating.color}`}>
                {asset.healthScore}
              </div>
              <div className="text-xs text-slate-400">Score Range: 0 – 100</div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
              <div className="flex justify-between text-slate-400">
                <span>CPU / Edge Micro-utilization:</span>
                <span className="font-mono font-bold text-slate-200">{asset.cpuUtilization}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Local Outposts Latency:</span>
                <span className="font-mono font-bold text-cyan-400">{telemetry.latencyMs} ms</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Processing Location:</span>
                <span className="font-mono font-bold text-slate-200">{asset.processingLocation}</span>
              </div>
            </div>
          </div>

          {/* Maintenance Summary Box */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>Maintenance & Operating Hours</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Operating Hours:</span>
                <span className="font-mono font-bold">{asset.maintenance.operatingHours} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Last Maintenance:</span>
                <span className="font-mono">{asset.maintenance.lastMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Scheduled:</span>
                <span className="font-mono text-amber-400">{asset.maintenance.nextMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Historical Failures:</span>
                <span className="font-mono">{asset.maintenance.failureCount}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 italic">
              "{asset.maintenance.notes}"
            </p>
          </div>

        </div>

      </div>

      {/* Chronological Recent Events Log for this Asset */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Chronological Asset Event History</span>
        </h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {assetLogs.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No recent anomaly events logged for this asset.</p>
          ) : (
            assetLogs.map(log => (
              <div 
                key={log.id} 
                className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-400">{log.timestamp}</span>
                  <span className="font-bold text-slate-200">{log.eventType}</span>
                  <span className="text-slate-400">Value: <strong className="text-slate-100">{log.sensorValue}</strong></span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-cyan-400 font-mono text-[11px]">{log.action}</span>
                  <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono">{log.latencyMs} ms</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
