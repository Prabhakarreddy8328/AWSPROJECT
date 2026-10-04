import React, { useState } from 'react';
import { FileText, Download, Search, Cpu } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const EventLogsPage: React.FC = () => {
  const { eventLogs } = useSimulation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const filteredLogs = eventLogs.filter(log => {
    const matchSearch = log.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = locationFilter === 'ALL' || log.processingLocation === locationFilter;
    return matchSearch && matchLocation;
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'Event ID', 'Asset Name', 'Event Type', 'Sensor Value', 'Threshold', 'Severity', 'Location', 'Action', 'Latency (ms)'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.id,
      `"${l.assetName}"`,
      `"${l.eventType}"`,
      l.sensorValue,
      l.threshold,
      l.severity,
      l.processingLocation,
      `"${l.action}"`,
      l.latencyMs
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `outposts_plant_event_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
            <FileText className="w-4 h-4" />
            <span>AUDIT TRAIL & SYSTEM LOGS</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Chronological Event Logs ({eventLogs.length})</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system audit logs recorded locally on AWS Outposts and synchronized to Amazon CloudWatch.
          </p>
        </div>

        <button 
          onClick={exportCSV}
          className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Logs as CSV</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search event ID, machine, or action..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold">Location:</span>
          {['ALL', 'Outposts / Edge', 'AWS Cloud'].map(loc => (
            <button
              key={loc}
              onClick={() => setLocationFilter(loc)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                locationFilter === loc ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 font-sans">
                    No event log records match your filter query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{log.id}</td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-100">{log.assetName}</td>
                    <td className="py-3 px-4 font-sans text-slate-200">{log.eventType}</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">{log.sensorValue}</td>
                    <td className="py-3 px-4 text-slate-400">{log.threshold}</td>
                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-cyan-400 flex items-center space-x-1">
                      <Cpu className="w-3 h-3" />
                      <span>{log.processingLocation}</span>
                    </td>
                    <td className="py-3 px-4 font-sans text-amber-300 font-semibold">{log.action}</td>
                    <td className="py-3 px-4 text-right text-cyan-400 font-bold">{log.latencyMs} ms</td>
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
