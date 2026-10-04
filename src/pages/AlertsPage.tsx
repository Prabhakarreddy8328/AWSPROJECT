import React, { useState } from 'react';
import { ShieldAlert, Filter } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface AlertsPageProps {
  setActiveTab: (tab: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ setActiveTab }) => {
  const { alerts, acknowledgeAlert, resolveAlert, setSelectedAssetId } = useSimulation();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(alert => {
    const matchSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || alert.status === statusFilter;
    return matchSeverity && matchStatus;
  });

  const activeCount = alerts.filter(a => a.status === 'Active').length;
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status === 'Active').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>AWS OUTPOSTS REAL-TIME INCIDENT MONITOR</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Alerts & Safety Notifications ({alerts.length})</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time threshold violations detected and executed locally on AWS Outposts.
          </p>
        </div>

        {/* Quick KPI badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">ACTIVE ALERTS</span>
            <span className="text-lg font-bold text-amber-400">{activeCount}</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-400 block text-[10px]">CRITICAL ALERTS</span>
            <span className="text-lg font-bold text-rose-400">{criticalCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-300">Severity:</span>
          {['ALL', 'Critical', 'Warning', 'Info'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                severityFilter === sev ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-300">Status:</span>
          {['ALL', 'Active', 'Acknowledged', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Alerts Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Sensor / Reading</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Local Action Taken</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 text-xs">
                    No alerts match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => (
                  <tr 
                    key={alert.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      alert.severity === 'Critical' && alert.status === 'Active' ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{alert.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{alert.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{alert.assetName}</td>
                    <td className="py-3 px-4">
                      <strong className="text-slate-100">{alert.sensor}:</strong> <span className="font-mono text-rose-400 font-bold">{alert.currentValue}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{alert.threshold}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-300 font-semibold">{alert.actionTaken}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{alert.latencyMs} ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        alert.status === 'Active' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        alert.status === 'Acknowledged' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {alert.status === 'Active' && (
                        <button 
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded font-semibold text-[10px]"
                        >
                          Ack
                        </button>
                      )}
                      {alert.status !== 'Resolved' && (
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded font-semibold text-[10px]"
                        >
                          Resolve
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setSelectedAssetId(alert.assetId);
                          setActiveTab('asset-detail');
                        }}
                        className="px-2 py-1 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded text-[10px]"
                      >
                        View Asset
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
