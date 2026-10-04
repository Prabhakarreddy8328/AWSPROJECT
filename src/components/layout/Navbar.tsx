import React from 'react';
import { Play, Pause, RotateCcw, Bell, ChevronRight } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  'plant-overview': 'Plant Overview',
  assets: 'Assets',
  'asset-detail': 'Asset Detail',
  'live-monitoring': 'Live Monitoring',
  alerts: 'Alerts & Notifications',
  trends: 'Trends & Analytics',
  'outposts-edge': 'Outposts / Edge',
  'event-logs': 'Event Logs',
  maintenance: 'Maintenance',
  'cloud-connectivity': 'Cloud Connectivity',
  performance: 'Performance',
  'aws-architecture': 'AWS Architecture',
  reports: 'Reports',
  settings: 'Settings',
};

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    isSimulating,
    startSimulation,
    stopSimulation,
    resetSimulation,
    cloudSyncState,
    edgeMetrics,
    alerts,
    demoScenarioSteps,
    currentDemoStepIndex,
    advanceDemoScenario,
    resetDemoScenario,
    triggerScenario,
    activeScenario,
  } = useSimulation();

  const activeAlertsCount = alerts.filter((a) => a.status === 'Active').length;
  const currentStep = demoScenarioSteps[currentDemoStepIndex];
  const connected = cloudSyncState.connectionStatus === 'Connected';

  const scenarioBtn = (active: boolean) =>
    `px-2.5 py-1 rounded text-xs font-medium transition-colors ${
      active ? 'bg-slate-100 text-white' : 'text-slate-300 hover:bg-slate-800'
    }`;

  return (
    <header className="bg-slate-900 border-b border-slate-800 z-40 shrink-0">
      {/* Primary bar */}
      <div className="flex items-center justify-between h-14 px-5">
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded bg-cyan-500 text-white text-[11px] font-bold flex items-center justify-center">
              OP
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-100">Plant Monitor</div>
              <div className="text-[11px] text-slate-500">AWS Outposts Edge</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
            <span>Monitoring</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-100 font-medium truncate">{PAGE_TITLES[activeTab] ?? activeTab}</span>
          </div>
        </div>

        {/* Live metrics */}
        <div className="hidden lg:flex items-center divide-x divide-slate-800 text-xs">
          <div className="px-5">
            <div className="text-slate-500">Edge latency</div>
            <div className="font-mono font-semibold text-slate-100">{edgeMetrics.avgEdgeLatencyMs} ms</div>
          </div>
          <div className="px-5">
            <div className="text-slate-500">Region latency</div>
            <div className="font-mono font-semibold text-slate-100">{cloudSyncState.networkLatencyMs} ms</div>
          </div>
          <div className="px-5">
            <div className="text-slate-500">Sync</div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-100">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {cloudSyncState.mode}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {isSimulating ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors"
              title="Pause telemetry stream"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium bg-cyan-500 text-white hover:bg-cyan-300 transition-colors"
              title="Start telemetry stream"
            >
              <Play className="w-3.5 h-3.5" />
              Run
            </button>
          )}
          <button
            onClick={resetSimulation}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
            title="Reset simulation data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className="relative h-8 w-8 flex items-center justify-center rounded-md border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
            title="View active alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
                {activeAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Demo toolbar */}
      <div className="bg-slate-950 border-t border-slate-800 px-5 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-500 shrink-0">Guided demo</span>
          <span className="font-medium text-slate-100 truncate">{currentStep.title}</span>
          <span className="text-slate-500 hidden xl:inline truncate">— {currentStep.description}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 mr-1">Scenario</span>
            <button onClick={() => triggerScenario('HIGH_TEMP', 'CNC-01')} className={scenarioBtn(activeScenario === 'HIGH_TEMP')}>
              Temp spike
            </button>
            <button onClick={() => triggerScenario('HIGH_VIBRATION', 'PRESS-01')} className={scenarioBtn(activeScenario === 'HIGH_VIBRATION')}>
              Vibration
            </button>
            <button onClick={() => triggerScenario('NORMAL')} className={scenarioBtn(activeScenario === 'NORMAL')}>
              Normal
            </button>
          </div>
          <button
            onClick={advanceDemoScenario}
            className="flex items-center gap-1 h-7 px-3 rounded-md bg-cyan-500 text-white font-medium hover:bg-cyan-300 transition-colors"
          >
            Next step
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={resetDemoScenario} className="text-slate-500 hover:text-slate-100 transition-colors">
            Reset
          </button>
        </div>
      </div>
    </header>
  );
};
