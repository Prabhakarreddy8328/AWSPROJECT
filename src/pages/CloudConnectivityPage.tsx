import React from 'react';
import { Cloud, Wifi, WifiOff, Cpu, Server } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const CloudConnectivityPage: React.FC = () => {
  const { cloudSyncState, toggleCloudSyncMode } = useSimulation();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
            <Cloud className="w-4 h-4" />
            <span>AWS OUTPOSTS HYBRID CLOUD CONNECTIVITY BRIDGE</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100">Cloud Connectivity & Edge Resilience</h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing the hybrid link between local AWS Outposts EC2 instances and AWS Region Cloud Services (S3, CloudWatch).
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800 shrink-0">
          <span className="text-xs text-slate-400 font-semibold pl-1">Simulation Mode:</span>
          <button 
            onClick={() => toggleCloudSyncMode('Online Mode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cloudSyncState.mode === 'Online Mode' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Online Mode
          </button>
          <button 
            onClick={() => toggleCloudSyncMode('Edge-Only Mode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              cloudSyncState.mode === 'Edge-Only Mode' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edge-Only (Offline) Mode
          </button>
        </div>
      </div>

      {/* Connection State Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Link Status</span>
          <div className="flex items-center space-x-2">
            {cloudSyncState.connectionStatus === 'Connected' ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-rose-400" />
            )}
            <span className={`text-base font-bold ${cloudSyncState.connectionStatus === 'Connected' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {cloudSyncState.connectionStatus}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Events Queued (Buffer)</span>
          <div className={`text-2xl font-semibold font-mono ${cloudSyncState.eventsWaiting > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
            {cloudSyncState.eventsWaiting}
          </div>
          <span className="text-[9px] text-slate-500">Local Outposts Buffer</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Events Synced</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {cloudSyncState.eventsSynced.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-500">Flushed to AWS Cloud</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Data Upload Speed</span>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {cloudSyncState.uploadRateKbps} Kbps
          </div>
          <span className="text-[9px] text-slate-500">Direct Connect / VPN</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Network Latency</span>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {cloudSyncState.networkLatencyMs} ms
          </div>
          <span className="text-[9px] text-slate-500">WAN Round-Trip</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Cloud SLA Uptime</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {cloudSyncState.cloudAvailability}%
          </div>
          <span className="text-[9px] text-slate-500">us-east-1 SLA</span>
        </div>

      </div>

      {/* Visual Pipeline Architecture (Sensors -> Outposts -> AWS Region Cloud) */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>Hybrid Data Ingestion Pipeline & Resilience Visualizer</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Node 1: Plant Sensors */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Server className="w-4 h-4" />
              <span>STEP 1: PLANT SENSORS</span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Industrial Telemetry Stream</h3>
            <p className="text-xs text-slate-400">
              Sensors emit temperature, pressure, vibration, and RPM telemetry over PROFINET / OPC-UA every 1,000ms.
            </p>
          </div>

          {/* Node 2: AWS Outposts */}
          <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/40 space-y-3 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-bl">
              LOCAL EDGE (&lt;5ms)
            </div>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>STEP 2: AWS OUTPOSTS RACK</span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Local Decision Engine</h3>
            <p className="text-xs text-slate-300">
              Evaluates critical safety rules locally in &lt;3.5ms. Executes immediate machine cutoffs even if internet fails!
            </p>
          </div>

          {/* Node 3: AWS Cloud */}
          <div className={`p-5 rounded-xl border space-y-3 transition-all ${
            cloudSyncState.connectionStatus === 'Connected' 
              ? 'bg-slate-950 border-amber-500/40' 
              : 'bg-rose-950/20 border-rose-500/50 opacity-80'
          }`}>
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Cloud className="w-4 h-4" />
              <span>STEP 3: AWS REGION CLOUD</span>
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Amazon S3 & CloudWatch</h3>
            <p className="text-xs text-slate-400">
              Asynchronously stores long-term telemetry archives, predictive analytics, and executive dashboards.
            </p>
            {cloudSyncState.connectionStatus === 'Disconnected' && (
              <div className="text-[10px] text-rose-400 font-bold bg-rose-950 p-2 rounded border border-rose-500/40">
                Disconnected: Events buffering locally on Outposts disk queue ({cloudSyncState.eventsWaiting} pending)
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
