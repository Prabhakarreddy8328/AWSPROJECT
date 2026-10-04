import React from 'react';
import { Network, Cpu } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import type { PlantArea } from '../types';

interface PlantOverviewPageProps {
  setActiveTab: (tab: string) => void;
}

export const PlantOverviewPage: React.FC<PlantOverviewPageProps> = ({ setActiveTab }) => {
  const { assets, setSelectedAssetId } = useSimulation();

  const plantAreas: PlantArea[] = ['Production Area', 'Assembly Area', 'Utility Area'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'border-emerald-500 bg-emerald-950/20 text-emerald-400';
      case 'Warning': return 'border-amber-500 bg-amber-950/20 text-amber-400';
      case 'Critical': return 'border-rose-500 bg-rose-950/30 text-rose-400';
      default: return 'border-slate-700 bg-slate-900 text-slate-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Healthy': return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />;
      case 'Warning': return <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />;
      case 'Critical': return <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />;
      default: return <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
            <Network className="w-4 h-4" />
            <span>AWS OUTPOSTS PLANT TOPOLOGY</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Interactive Plant Hierarchy & Asset Nodes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual map of plant production zones connected to the local AWS Outposts rack via high-speed Industrial Ethernet (PROFINET / EtherCAT).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Healthy</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      {/* Main Visual Plant Diagram Tree Structure */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-8 relative overflow-hidden">
        
        {/* Plant Root Node */}
        <div className="flex justify-center">
          <div className="bg-slate-900 border border-amber-500/50 px-6 py-3 rounded-xl flex items-center space-x-3 shadow-sm">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-lg font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Master Plant Controller</div>
              <div className="text-sm font-semibold text-slate-100">AWS Outposts Local Rack (op-0a82f941c9b2)</div>
              <div className="text-[10px] text-slate-400">Local EC2 Micro-datacenter • &lt; 5ms Processing</div>
            </div>
          </div>
        </div>

        {/* Vertical Connecting Line */}
        <div className="w-0.5 h-6 bg-slate-800 mx-auto" />

        {/* Plant Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {plantAreas.map(area => {
            const areaAssets = assets.filter(a => a.area === area);

            return (
              <div 
                key={area}
                className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 space-y-4 shadow-sm"
              >
                {/* Area Header */}
                <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{area}</h3>
                    <span className="text-[10px] text-slate-400">{areaAssets.length} Connected Machines</span>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                    Subnet 10.0.{area === 'Production Area' ? '1' : area === 'Assembly Area' ? '2' : '3'}.0/24
                  </span>
                </div>

                {/* Asset Nodes List */}
                <div className="space-y-3">
                  {areaAssets.map(asset => {
                    const t = asset.currentTelemetry;
                    const statusClass = getStatusColor(asset.status);

                    return (
                      <div 
                        key={asset.id}
                        onClick={() => {
                          setSelectedAssetId(asset.id);
                          setActiveTab('assets');
                        }}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer  shadow-sm space-y-2.5 ${statusClass}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStatusDot(asset.status)}
                            <span className="font-bold text-xs text-slate-100">{asset.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{asset.id}</span>
                        </div>

                        {/* Live Metrics Grid */}
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] bg-slate-950/90 p-2 rounded text-center border border-slate-800/80">
                          <div>
                            <span className="text-[9px] text-slate-500 block">TEMP</span>
                            <span className={`font-mono font-bold ${t.temperature > asset.thresholds.maxTemp ? 'text-rose-400' : 'text-slate-200'}`}>
                              {t.temperature}°C
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block">PRESS</span>
                            <span className={`font-mono font-bold ${t.pressure > asset.thresholds.maxPressure ? 'text-amber-400' : 'text-slate-200'}`}>
                              {t.pressure} PSI
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block">VIB</span>
                            <span className={`font-mono font-bold ${t.vibration > asset.thresholds.maxVibration ? 'text-rose-400' : 'text-slate-200'}`}>
                              {t.vibration}
                            </span>
                          </div>
                        </div>

                        {/* Footer details */}
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Health: <strong className="text-emerald-400">{asset.healthScore}/100</strong></span>
                          <span className="text-cyan-400 font-medium">Outposts Edge</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};
