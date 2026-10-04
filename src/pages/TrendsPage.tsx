import React, { useState } from 'react';
import { TrendingUp, Flame, Gauge, Activity, Cpu } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export const TrendsPage: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId } = useSimulation();
  const [timeRange, setTimeRange] = useState<string>('5m');
  const [activeMetric, setActiveMetric] = useState<'temp' | 'pressure' | 'vibration' | 'power'>('temp');

  const currentAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const history = currentAsset.telemetryHistory;

  let values: number[] = [];
  let threshold = 80;
  let metricLabel = 'Temperature (°C)';
  let strokeColor = '#dc2626';

  if (activeMetric === 'temp') {
    values = history.map(h => h.temperature);
    threshold = currentAsset.thresholds.maxTemp;
    metricLabel = 'Temperature (°C)';
    strokeColor = '#dc2626';
  } else if (activeMetric === 'pressure') {
    values = history.map(h => h.pressure);
    threshold = currentAsset.thresholds.maxPressure;
    metricLabel = 'Hydraulic Pressure (PSI)';
    strokeColor = '#d97706';
  } else if (activeMetric === 'vibration') {
    values = history.map(h => h.vibration);
    threshold = currentAsset.thresholds.maxVibration;
    metricLabel = 'Vibration (mm/s)';
    strokeColor = '#7c3aed';
  } else if (activeMetric === 'power') {
    values = history.map(h => h.power);
    threshold = currentAsset.thresholds.maxPower;
    metricLabel = 'Power Consumption (kW)';
    strokeColor = '#2563eb';
  }

  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 0;
  const avgVal = values.length > 0 ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>AWS CLOUDWATCH HISTORICAL TELEMETRY ANALYTICS</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Time-Series Trends & Anomaly Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing historical sensor trends, threshold reference lines, and edge latency distributions.
          </p>
        </div>

        {/* Asset Selector & Time Range Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
          
          <select 
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500 font-semibold"
          >
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
            ))}
          </select>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['5m', '15m', '1h', '24h'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                  timeRange === range ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs overflow-x-auto">
        <button 
          onClick={() => setActiveMetric('temp')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeMetric === 'temp' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Temperature (°C)</span>
        </button>

        <button 
          onClick={() => setActiveMetric('pressure')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeMetric === 'pressure' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Pressure (PSI)</span>
        </button>

        <button 
          onClick={() => setActiveMetric('vibration')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeMetric === 'vibration' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vibration (mm/s)</span>
        </button>

        <button 
          onClick={() => setActiveMetric('power')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold transition-all ${
            activeMetric === 'power' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Power (kW)</span>
        </button>
      </div>

      {/* Main Time-Series Chart */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-100">
            {currentAsset.name} — {metricLabel}
          </h2>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-slate-400">Min: <strong className="text-slate-100">{minVal}</strong></span>
            <span className="text-slate-400">Avg: <strong className="text-cyan-400">{avgVal}</strong></span>
            <span className="text-slate-400">Max: <strong className="text-rose-400">{maxVal}</strong></span>
            <span className="text-slate-400">Threshold: <strong className="text-amber-400">{threshold}</strong></span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
              <XAxis dataKey="timestamp" stroke="#6b7685" fontSize={10} />
              <YAxis stroke="#6b7685" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d3d9e0', borderRadius: '6px', fontSize: 12 }} />
              <ReferenceLine y={threshold} label={`Threshold (${threshold})`} stroke="#ef4444" strokeDasharray="4 4" />
              <Line 
                type="monotone" 
                dataKey={activeMetric === 'temp' ? 'temperature' : activeMetric === 'pressure' ? 'pressure' : activeMetric === 'vibration' ? 'vibration' : 'power'} 
                stroke={strokeColor} 
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
