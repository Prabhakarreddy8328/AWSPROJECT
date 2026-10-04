import React from 'react';
import { Wrench, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const MaintenancePage: React.FC = () => {
  const { assets } = useSimulation();

  const dueSoonAssets = assets.filter(a => a.maintenance.status === 'Due Soon' || a.maintenance.status === 'Overdue');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
            <Wrench className="w-4 h-4" />
            <span>PREDICTIVE PLANT MAINTENANCE</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Asset Maintenance & Lifecycle Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking operating hours, scheduled service intervals, and predictive health degradation across plant assets.
          </p>
        </div>

        {/* Warning Badge */}
        {dueSoonAssets.length > 0 && (
          <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 p-3 rounded-lg flex items-center space-x-3 text-xs shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold block">Maintenance Action Required</span>
              <span>{dueSoonAssets.length} asset(s) approaching scheduled maintenance interval.</span>
            </div>
          </div>
        )}
      </div>

      {/* Maintenance Asset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(asset => {
          const m = asset.maintenance;
          let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          if (m.status === 'Due Soon') badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
          else if (m.status === 'Overdue') badgeColor = 'bg-rose-500 text-white font-bold';

          return (
            <div key={asset.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400 font-bold">{asset.id}</div>
                  <h3 className="font-bold text-slate-100 text-sm">{asset.name}</h3>
                  <div className="text-[11px] text-slate-400">{asset.location}</div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider border ${badgeColor}`}>
                  {m.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">OPERATING HOURS</span>
                  <span className="font-mono font-bold text-slate-200">{m.operatingHours} hrs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">FAILURE COUNT</span>
                  <span className="font-mono font-bold text-rose-400">{m.failureCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">LAST SERVICE</span>
                  <span className="font-mono text-slate-300">{m.lastMaintenance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">NEXT SERVICE</span>
                  <span className="font-mono text-amber-400 font-bold">{m.nextMaintenance}</span>
                </div>
              </div>

              {/* Maintenance Notes */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Technician Log & Service Notes</span>
                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800 italic">
                  "{m.notes}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
