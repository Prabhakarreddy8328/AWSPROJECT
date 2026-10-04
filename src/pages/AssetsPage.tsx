import React, { useState } from 'react';
import { Boxes, Search, Cpu, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface AssetsPageProps {
  setActiveTab: (tab: string) => void;
}

export const AssetsPage: React.FC<AssetsPageProps> = ({ setActiveTab }) => {
  const { assets, setSelectedAssetId } = useSimulation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveTab('asset-detail');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
            <Boxes className="w-4 h-4" />
            <span>AWS OUTPOSTS ASSET CATALOG</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Manufacturing Plant Assets ({assets.length})</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and health monitoring for industrial CNC machines, presses, conveyors, and robotic arms.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search asset ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'Healthy', 'Warning', 'Critical'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  statusFilter === status 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          const telemetry = asset.currentTelemetry;

          let statusBadgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          if (asset.status === 'Critical') statusBadgeClass = 'bg-rose-500 text-white';
          else if (asset.status === 'Warning') statusBadgeClass = 'bg-amber-500/20 text-amber-400 border-amber-500/40';

          return (
            <div 
              key={asset.id}
              onClick={() => handleSelectAsset(asset.id)}
              className="bg-slate-900 rounded-xl border border-slate-800 hover:border-amber-500/50 p-5 transition-all cursor-pointer space-y-4 shadow-sm hover: group"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">{asset.id}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{asset.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors mt-0.5">
                    {asset.name}
                  </h3>
                  <div className="text-[11px] text-slate-400">{asset.location}</div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${statusBadgeClass}`}>
                  {asset.status}
                </span>
              </div>

              {/* Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block">TEMPERATURE</span>
                  <span className={`font-mono font-bold ${telemetry.temperature > asset.thresholds.maxTemp ? 'text-rose-400' : 'text-slate-200'}`}>
                    {telemetry.temperature} °C
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">PRESSURE</span>
                  <span className={`font-mono font-bold ${telemetry.pressure > asset.thresholds.maxPressure ? 'text-amber-400' : 'text-slate-200'}`}>
                    {telemetry.pressure} PSI
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">VIBRATION</span>
                  <span className={`font-mono font-bold ${telemetry.vibration > asset.thresholds.maxVibration ? 'text-rose-400' : 'text-slate-200'}`}>
                    {telemetry.vibration} mm/s
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">POWER</span>
                  <span className="font-mono font-bold text-slate-200">
                    {telemetry.power} kW
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SPEED</span>
                  <span className="font-mono font-bold text-slate-200">
                    {telemetry.speed} RPM
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">LATENCY</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {telemetry.latencyMs} ms
                  </span>
                </div>
              </div>

              {/* Health Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Health Score</span>
                  <span className="font-bold text-emerald-400">{asset.healthScore} / 100</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      asset.healthScore > 85 ? 'bg-emerald-500' : asset.healthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${asset.healthScore}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 text-slate-400">
                <span className="flex items-center space-x-1 text-cyan-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{asset.processingLocation}</span>
                </span>
                <span className="flex items-center space-x-1 group-hover:text-amber-400 font-semibold">
                  <span>View Asset Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
