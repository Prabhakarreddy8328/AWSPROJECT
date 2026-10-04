import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  Cloud, 
  Activity, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Server, 
  ArrowRight 
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { 
    assets, 
    alerts, 
    edgeMetrics, 
    cloudSyncState, 
    systemUptimeSeconds,
    setSelectedAssetId,
    triggerScenario
  } = useSimulation();

  const totalAssets = assets.length;
  const healthyAssets = assets.filter(a => a.status === 'Healthy').length;
  const warningAssets = assets.filter(a => a.status === 'Warning').length;
  const criticalAssets = assets.filter(a => a.status === 'Critical').length;

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'Critical');

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  let overallStatus = 'Healthy';
  let overallBadgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  let overallIcon = CheckCircle2;

  if (criticalAssets > 0 || criticalAlerts.length > 0) {
    overallStatus = 'Critical';
    overallBadgeColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    overallIcon = XCircle;
  } else if (warningAssets > 0 || activeAlerts.length > 0) {
    overallStatus = 'Warning';
    overallBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    overallIcon = AlertTriangle;
  }

  const OverallIconComp = overallIcon;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: AWS Outposts Executive Summary */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase">
              AWS Outposts Plant SCADA
            </span>
            <span className="text-xs text-slate-400">Rack op-0a82f941c9b2 • us-east-1</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
            Industrial Plant Real-Time Monitoring
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulating ultra-low latency local sensor processing on AWS Outposts (&lt;5ms) while continuously batching aggregated telemetry to AWS Region Cloud services (S3 & CloudWatch).
          </p>
        </div>

        {/* System Overall Status Card */}
        <div className={`px-5 py-3 rounded-lg border flex items-center space-x-3 shrink-0 ${overallBadgeColor}`}>
          <OverallIconComp className="w-8 h-8 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall System Status</span>
            <span className="text-lg font-semibold tracking-wide">{overallStatus.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Requirement #2 & #14: System Overview & KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Active Assets */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Assets</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{totalAssets}</div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
            <span className="text-emerald-400 font-semibold">{healthyAssets} Healthy</span>
            <span className="text-amber-400 font-semibold">{warningAssets} Warn</span>
            <span className="text-rose-400 font-semibold">{criticalAssets} Crit</span>
          </div>
        </div>

        {/* Card 2: Active & Critical Alerts */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{activeAlerts.length}</div>
          <div className="text-[10px] text-rose-400 font-semibold pt-1">
            {criticalAlerts.length} Critical Alerts
          </div>
        </div>

        {/* Card 3: Outposts Edge Processing Latency */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Edge Latency</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {edgeMetrics.avgEdgeLatencyMs} ms
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            AWS Outposts Local EC2
          </div>
        </div>

        {/* Card 4: Cloud Sync Status */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Cloud Sync Status</span>
            <Cloud className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 truncate pt-1">
            {cloudSyncState.connectionStatus}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 truncate">
            {cloudSyncState.mode}
          </div>
        </div>

        {/* Card 5: Total Readings Processed */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Events Processed</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            {edgeMetrics.eventsProcessedLocally.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 pt-1">
            {edgeMetrics.edgeProcessingRate} req/sec
          </div>
        </div>

        {/* Card 6: System Uptime */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>System Uptime</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono truncate pt-1">
            {formatUptime(systemUptimeSeconds)}
          </div>
          <div className="text-[10px] text-emerald-400 pt-1">
            99.99% Availability
          </div>
        </div>

      </div>

      {/* Latency Comparison Spotlight Banner (Edge vs Cloud Requirement #6 & #13) */}
      <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">
              Low-Latency Outposts Edge vs AWS Cloud Comparison
            </h2>
          </div>
          <button 
            onClick={() => setActiveTab('outposts-edge')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-semibold"
          >
            <span>View Edge Engine Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Outposts Edge Card */}
          <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-400 font-bold text-[10px] px-2.5 py-0.5 rounded-bl">
              LOCAL EDGE
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">AWS Outposts Local EC2</h3>
                <p className="text-[11px] text-slate-400">On-Premises Plant Processing</p>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-cyan-400 font-mono">&lt; 3.5 ms</span>
              <span className="text-xs text-slate-400">Response Latency</span>
            </div>

            <ul className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-2">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Autonomous Local Decision Engine (No Cloud Round-Trip)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Immediate Safety Cutoff & Automation (&lt; 5ms)</span>
              </li>
            </ul>
          </div>

          {/* AWS Cloud Card */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 font-bold text-[10px] px-2.5 py-0.5 rounded-bl">
              AWS REGION
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">AWS Region (us-east-1)</h3>
                <p className="text-[11px] text-slate-400">Centralized Cloud Storage & Analytics</p>
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold text-amber-400 font-mono">42 – 85 ms</span>
              <span className="text-xs text-slate-400">Internet / VPC Latency</span>
            </div>

            <ul className="text-xs text-slate-400 space-y-1 border-t border-slate-800 pt-2">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Long-term Data Storage in Amazon S3</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>Global Metrics & Dashboards in Amazon CloudWatch</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Main Content Grid: Asset Cards + Live Alerts Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Plant Asset Quick Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Plant Asset Telemetry Stream</span>
            </h2>
            <button 
              onClick={() => setActiveTab('assets')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View All Assets ({assets.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assets.map(asset => {
              const telemetry = asset.currentTelemetry;
              let statusBorder = 'border-slate-800 hover:border-slate-700';
              let statusBadge = 'bg-emerald-500/20 text-emerald-400';

              if (asset.status === 'Critical') {
                statusBorder = 'border-rose-500/50 bg-rose-950/10';
                statusBadge = 'bg-rose-500 text-white font-bold';
              } else if (asset.status === 'Warning') {
                statusBorder = 'border-amber-500/40 bg-amber-950/10';
                statusBadge = 'bg-amber-500/20 text-amber-400 font-bold';
              }

              return (
                <div 
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setActiveTab('assets');
                  }}
                  className={`bg-slate-900 p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${statusBorder}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">{asset.id}</div>
                      <h3 className="font-bold text-slate-100 text-sm">{asset.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${statusBadge}`}>
                      {asset.status}
                    </span>
                  </div>

                  {/* Telemetry Snapshot */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Temp</span>
                      <span className={`font-mono font-bold ${telemetry.temperature > asset.thresholds.maxTemp ? 'text-rose-400' : 'text-slate-200'}`}>
                        {telemetry.temperature} °C
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pressure</span>
                      <span className={`font-mono font-bold ${telemetry.pressure > asset.thresholds.maxPressure ? 'text-amber-400' : 'text-slate-200'}`}>
                        {telemetry.pressure} PSI
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vibration</span>
                      <span className={`font-mono font-bold ${telemetry.vibration > asset.thresholds.maxVibration ? 'text-rose-400' : 'text-slate-200'}`}>
                        {telemetry.vibration} mm/s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Speed</span>
                      <span className="font-mono font-bold text-slate-200">
                        {telemetry.speed} RPM
                      </span>
                    </div>
                  </div>

                  {/* Health Score & Processing Tag */}
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Health: <strong className="text-emerald-400">{asset.healthScore}/100</strong></span>
                    <span className="text-cyan-400 font-semibold flex items-center space-x-1">
                      <Cpu className="w-3 h-3" />
                      <span>{asset.processingLocation}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Active Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Active Alerts Feed</span>
            </h2>
            <button 
              onClick={() => setActiveTab('alerts')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              All Alerts ({alerts.length}) →
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-3 space-y-3 max-h-[480px] overflow-y-auto">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs text-slate-400">No active alerts right now.</p>
                <button 
                  onClick={() => triggerScenario('HIGH_TEMP', 'CNC-01')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1 rounded font-semibold transition-colors"
                >
                  Inject Demo Alert Scenario
                </button>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs space-y-2 ${
                    alert.severity === 'Critical' 
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' 
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{alert.assetName} ({alert.assetId})</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-slate-300">
                    <strong className="text-slate-100">{alert.sensor}:</strong> {alert.currentValue} exceeds threshold ({alert.threshold})
                  </p>

                  <div className="bg-slate-950/60 p-1.5 rounded text-[10px] text-cyan-300 font-mono flex items-center justify-between">
                    <span>Local Action: {alert.actionTaken}</span>
                    <span className="text-slate-400">{alert.latencyMs} ms</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
