import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Alert, 
  Asset, 
  CloudSyncState, 
  EdgeMetrics, 
  EventLog, 
  LocalRule, 
  ScenarioStep 
} from '../types';
import { INITIAL_ASSETS, INITIAL_RULES } from '../data/initialAssets';
import type { ActiveScenario } from '../services/simulationEngine';
import { generateTelemetryTick } from '../services/simulationEngine';
import { evaluateLocalRules } from '../services/decisionEngine';
import { INITIAL_CLOUD_SYNC_STATE, processCloudSync } from '../services/cloudSyncService';

interface SimulationContextType {
  assets: Asset[];
  alerts: Alert[];
  eventLogs: EventLog[];
  rules: LocalRule[];
  cloudSyncState: CloudSyncState;
  edgeMetrics: EdgeMetrics;
  isSimulating: boolean;
  activeScenario: ActiveScenario;
  scenarioTargetAssetId: string | null;
  selectedAssetId: string;
  demoScenarioSteps: ScenarioStep[];
  currentDemoStepIndex: number;
  systemUptimeSeconds: number;
  tickIntervalMs: number;
  
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  triggerScenario: (scenario: ActiveScenario, targetAssetId?: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  toggleRule: (ruleId: string) => void;
  toggleCloudSyncMode: (mode: 'Online Mode' | 'Edge-Only Mode') => void;
  setSelectedAssetId: (id: string) => void;
  advanceDemoScenario: () => void;
  resetDemoScenario: () => void;
  setTickIntervalMs: (ms: number) => void;
}

const DEMO_SCENARIO_STEPS: ScenarioStep[] = [
  {
    stepNumber: 1,
    title: '1. Normal Plant Operation',
    description: 'All 6 plant assets are operating normally. Low latency edge processing monitors telemetry continuously.',
    targetAssetId: 'CNC-01',
    expectedOutcome: 'System status: Healthy. Edge Latency < 3.5ms.',
    isCurrent: true,
    isDone: false
  },
  {
    stepNumber: 2,
    title: '2. Temperature Increase Spikes',
    description: 'CNC Machine 01 spindle friction causes temperature to gradually rise above 75°C towards 85°C.',
    targetAssetId: 'CNC-01',
    expectedOutcome: 'Temperature crosses threshold (>80°C).',
    isCurrent: false,
    isDone: false
  },
  {
    stepNumber: 3,
    title: '3. Outposts Edge Detection & Decision (<5ms)',
    description: 'Local decision engine evaluates Rule R-01 on Outposts in 3.1ms without cloud round-trip delay.',
    targetAssetId: 'CNC-01',
    expectedOutcome: 'Critical alert generated locally. Machine auto-stopped.',
    isCurrent: false,
    isDone: false
  },
  {
    stepNumber: 4,
    title: '4. Critical Alert & Event Logged',
    description: 'Critical Alert appears prominently on Dashboard. Event recorded instantly in local Outposts log.',
    targetAssetId: 'CNC-01',
    expectedOutcome: 'Dashboard updates instantly. Asset status changes to Critical.',
    isCurrent: false,
    isDone: false
  },
  {
    stepNumber: 5,
    title: '5. AWS Cloud Synchronization',
    description: 'Critical event & telemetry history synchronized to AWS Cloud (S3/CloudWatch) asynchronously.',
    targetAssetId: 'CNC-01',
    expectedOutcome: 'Cloud sync complete. Complete audit trail stored in CloudWatch.',
    isCurrent: false,
    isDone: false
  }
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [rules, setRules] = useState<LocalRule[]>(INITIAL_RULES);
  const [cloudSyncState, setCloudSyncState] = useState<CloudSyncState>(INITIAL_CLOUD_SYNC_STATE);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<ActiveScenario>('NORMAL');
  const [scenarioTargetAssetId, setScenarioTargetAssetId] = useState<string | null>('CNC-01');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('CNC-01');
  const [systemUptimeSeconds, setSystemUptimeSeconds] = useState<number>(34820);
  const [tickCount, setTickCount] = useState<number>(0);
  const [tickIntervalMs, setTickIntervalMs] = useState<number>(1500);

  const [demoScenarioSteps, setDemoScenarioSteps] = useState<ScenarioStep[]>(DEMO_SCENARIO_STEPS);
  const [currentDemoStepIndex, setCurrentDemoStepIndex] = useState<number>(0);

  const [edgeMetrics, setEdgeMetrics] = useState<EdgeMetrics>({
    avgEdgeLatencyMs: 3.1,
    maxEdgeLatencyMs: 4.8,
    eventsProcessedLocally: 8540,
    localDecisionsMade: 42,
    cloudForwardedEvents: 8498,
    edgeProcessingRate: 120,
    networkAvailability: 99.98
  });

  const runSimulationTick = useCallback(() => {
    setTickCount(prev => prev + 1);
    setSystemUptimeSeconds(prev => prev + 1);

    let newLocalEventsAccumulator: EventLog[] = [];
    let localDecisionsThisTick = 0;

    setAssets(prevAssets => {
      return prevAssets.map(asset => {
        const { updatedAsset: assetWithTelemetry } = generateTelemetryTick(
          asset,
          activeScenario,
          scenarioTargetAssetId,
          tickCount
        );

        const { 
          updatedAsset: finalAsset, 
          newAlerts, 
          newEventLogs, 
          localDecisionMade 
        } = evaluateLocalRules(assetWithTelemetry, rules, alerts);

        if (localDecisionMade) {
          localDecisionsThisTick++;
        }

        if (newAlerts.length > 0) {
          setAlerts(prev => [...newAlerts, ...prev].slice(0, 100));
        }

        if (newEventLogs.length > 0) {
          newLocalEventsAccumulator.push(...newEventLogs);
          setEventLogs(prev => [...newEventLogs, ...prev].slice(0, 200));
        }

        return finalAsset;
      });
    });

    setCloudSyncState(prevState => {
      const { nextState } = processCloudSync(prevState, newLocalEventsAccumulator);
      return nextState;
    });

    setEdgeMetrics(prev => ({
      ...prev,
      eventsProcessedLocally: prev.eventsProcessedLocally + assets.length,
      localDecisionsMade: prev.localDecisionsMade + localDecisionsThisTick,
      avgEdgeLatencyMs: Number((2.8 + Math.random() * 0.6).toFixed(1)),
      edgeProcessingRate: Math.round(110 + Math.random() * 25)
    }));

  }, [activeScenario, scenarioTargetAssetId, tickCount, rules, alerts, assets.length]);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      runSimulationTick();
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [isSimulating, tickIntervalMs, runSimulationTick]);

  const startSimulation = () => setIsSimulating(true);
  const stopSimulation = () => setIsSimulating(false);

  const resetSimulation = () => {
    setAssets(INITIAL_ASSETS);
    setAlerts([]);
    setEventLogs([]);
    setActiveScenario('NORMAL');
    setScenarioTargetAssetId('CNC-01');
    setCloudSyncState(INITIAL_CLOUD_SYNC_STATE);
  };

  const triggerScenario = (scenario: ActiveScenario, targetAssetId: string = 'CNC-01') => {
    setActiveScenario(scenario);
    setScenarioTargetAssetId(targetAssetId);
    if (scenario === 'CLOUD_DISCONNECTED') {
      setCloudSyncState(prev => ({ ...prev, mode: 'Edge-Only Mode', connectionStatus: 'Disconnected' }));
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Resolved' } : a));
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, enabled: !r.enabled } : r));
  };

  const toggleCloudSyncMode = (mode: 'Online Mode' | 'Edge-Only Mode') => {
    setCloudSyncState(prev => ({
      ...prev,
      mode,
      connectionStatus: mode === 'Online Mode' ? 'Connected' : 'Disconnected'
    }));
  };

  const advanceDemoScenario = () => {
    const nextIdx = (currentDemoStepIndex + 1) % DEMO_SCENARIO_STEPS.length;
    setCurrentDemoStepIndex(nextIdx);

    setDemoScenarioSteps(prev => prev.map((step, idx) => ({
      ...step,
      isCurrent: idx === nextIdx,
      isDone: idx < nextIdx
    })));

    if (nextIdx === 0) {
      setActiveScenario('NORMAL');
    } else if (nextIdx === 1) {
      setActiveScenario('HIGH_TEMP');
      setScenarioTargetAssetId('CNC-01');
      setSelectedAssetId('CNC-01');
    } else if (nextIdx === 4) {
      setCloudSyncState(prev => ({ ...prev, mode: 'Online Mode', connectionStatus: 'Connected' }));
    }
  };

  const resetDemoScenario = () => {
    setCurrentDemoStepIndex(0);
    setDemoScenarioSteps(DEMO_SCENARIO_STEPS);
    setActiveScenario('NORMAL');
    resetSimulation();
  };

  return (
    <SimulationContext.Provider value={{
      assets,
      alerts,
      eventLogs,
      rules,
      cloudSyncState,
      edgeMetrics,
      isSimulating,
      activeScenario,
      scenarioTargetAssetId,
      selectedAssetId,
      demoScenarioSteps,
      currentDemoStepIndex,
      systemUptimeSeconds,
      tickIntervalMs,
      startSimulation,
      stopSimulation,
      resetSimulation,
      triggerScenario,
      acknowledgeAlert,
      resolveAlert,
      toggleRule,
      toggleCloudSyncMode,
      setSelectedAssetId,
      advanceDemoScenario,
      resetDemoScenario,
      setTickIntervalMs
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
