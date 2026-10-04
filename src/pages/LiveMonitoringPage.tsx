import React from 'react';
import { Activity, Play, Pause, Flame, Gauge, Zap, Radio, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const LiveMonitoringPage: React.FC = () => {
  const { 
    assets, 
    isSimulating, 
    startSimulation, 
    stopSimulation, 
    triggerScenario, 
    activeScenario,
    tickIntervalMs,
    setTickIntervalMs
  } = useSimulation();

  const primaryHistory = assets[0]?.telemetryHistory || [];

  return (
    <div className="space-y-6">
      
      {/* Header & Live Stream Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>HIGH-FREQUENCY TELEMETRY INGESTION STREAM</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Live Sensor Stream & Manual Anomaly Controller</h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuously ingesting high-frequency industrial plant signals processed locally on AWS Outposts EC2.
          </p>
        </div>

        {/* Start / Stop & Speed Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Stream Rate:</span>
            <button 
              onClick={() => setTickIntervalMs(1000)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${tickIntervalMs === 1000 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              1.0s
            </button>
            <button 
              onClick={() => setTickIntervalMs(2000)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono ${tickIntervalMs === 2000 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              2.0s
            </button>
          </div>

          <button 
            onClick={isSimulating ? stopSimulation : startSimulation}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors ${
              isSimulating ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSimulating ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
          </button>
        </div>
      </div>

      {/* Manual Anomaly Trigger Panel (Requirement #5 & #18) */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Manual Scenario Anomaly Triggers (For Demonstration & Hackathon Showcase)</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => triggerScenario('HIGH_TEMP', 'CNC-01')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeScenario === 'HIGH_TEMP' 
                ? 'bg-rose-500 text-white shadow-sm' 
                : 'bg-slate-950 text-rose-400 hover:bg-rose-500/10 border border-rose-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate High Temperature (&gt;80°C)</span>
          </button>

          <button 
            onClick={() => triggerScenario('HIGH_PRESSURE', 'PRESS-01')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeScenario === 'HIGH_PRESSURE' 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-slate-950 text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Simulate High Pressure (&gt;120 PSI)</span>
          </button>

          <button 
            onClick={() => triggerScenario('HIGH_VIBRATION', 'PRESS-01')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeScenario === 'HIGH_VIBRATION' 
                ? 'bg-purple-500 text-white shadow-sm' 
                : 'bg-slate-950 text-purple-400 hover:bg-purple-500/10 border border-purple-500/30'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulate Excessive Vibration (&gt;15mm/s)</span>
          </button>

          <button 
            onClick={() => triggerScenario('MACHINE_FAILURE', 'CNC-01')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeScenario === 'MACHINE_FAILURE' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'bg-slate-950 text-rose-300 hover:bg-rose-600/20 border border-rose-500/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Critical Machine Failure</span>
          </button>

          <button 
            onClick={() => triggerScenario('NETWORK_DELAY')}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeScenario === 'NETWORK_DELAY' 
                ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                : 'bg-slate-950 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate AWS Cloud Network Lag (200ms)</span>
          </button>

          <button 
            onClick={() => triggerScenario('NORMAL')}
            className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
          >
            Reset to Normal Operation
          </button>
        </div>
      </div>

      {/* Real-time Multi-Chart Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temperature Stream */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Plant Temperature Stream (°C)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Threshold: 80°C</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={primaryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
                <XAxis dataKey="timestamp" stroke="#6b7685" fontSize={9} />
                <YAxis stroke="#6b7685" fontSize={9} domain={[20, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d3d9e0', borderRadius: '6px', fontSize: 12 }} />
                <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Stream */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Hydraulic Pressure Stream (PSI)</span>
            </h3>
            <span className="text-[10px] text-slate-400">Threshold: 120 PSI</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={primaryHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e9ee" />
                <XAxis dataKey="timestamp" stroke="#6b7685" fontSize={9} />
                <YAxis stroke="#6b7685" fontSize={9} domain={[20, 150]} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#d3d9e0', borderRadius: '6px', fontSize: 12 }} />
                <Line type="monotone" dataKey="pressure" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
