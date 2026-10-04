import React from 'react';
import { Settings, Sliders, RotateCcw, Zap } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const SettingsPage: React.FC = () => {
  const { 
    rules, 
    toggleRule, 
    resetSimulation, 
    tickIntervalMs, 
    setTickIntervalMs
  } = useSimulation();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-slate-400 font-semibold text-xs mb-1">
            <Settings className="w-4 h-4" />
            <span>AWS OUTPOSTS DASHBOARD CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">System Preferences & Rule Parameters</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure telemetry stream rates, local edge decision rules, and simulation engine parameters.
          </p>
        </div>

        <button 
          onClick={resetSimulation}
          className="flex items-center space-x-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 px-4 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Simulation State</span>
        </button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stream Rate Settings */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Simulation Ingestion Frequency</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="text-slate-400 block">Telemetry Stream Tick Interval:</label>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 1500, 2000].map(ms => (
                <button
                  key={ms}
                  onClick={() => setTickIntervalMs(ms)}
                  className={`p-2 rounded font-mono text-center font-bold border transition-colors ${
                    tickIntervalMs === ms 
                      ? 'bg-amber-500 text-slate-950 border-amber-500' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {ms}ms
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Lower intervals simulate high-frequency industrial IoT sensor bursts.
            </p>
          </div>
        </div>

        {/* Rule Engine Toggles */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Local Outposts Rule Engine Toggles</span>
          </h2>

          <div className="space-y-2">
            {rules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-slate-100">{rule.sensor} Safety Rule ({rule.id})</span>
                  <div className="text-[10px] text-slate-400">Limit: {rule.threshold}{rule.unit}</div>
                </div>

                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1 rounded text-[10px] font-bold ${
                    rule.enabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
