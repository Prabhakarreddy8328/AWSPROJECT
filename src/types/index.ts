export type MachineType = 'CNC Machine' | 'Hydraulic Press' | 'Conveyor Motor' | 'Robotic Arm' | 'Cooling System';

export type PlantArea = 'Production Area' | 'Assembly Area' | 'Utility Area';

export type AssetStatus = 'Healthy' | 'Warning' | 'Critical' | 'Offline' | 'Idle';

export type ProcessingLocation = 'Outposts / Edge' | 'AWS Cloud';

export type AlertSeverity = 'Info' | 'Warning' | 'Critical';

export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export type SensorType = 'Temperature' | 'Pressure' | 'Vibration' | 'Power' | 'Machine Speed';

export interface Telemetry {
  timestamp: string;
  temperature: number; // °C
  pressure: number;    // PSI
  vibration: number;   // mm/s
  power: number;       // kW
  speed: number;       // RPM
  latencyMs: number;   // Edge latency in ms (< 5ms)
  cloudLatencyMs: number; // Cloud latency in ms (30-100ms)
}

export interface Thresholds {
  maxTemp: number;     // °C (default 80)
  maxPressure: number; // PSI (default 120)
  maxVibration: number;// mm/s (default 15.0)
  maxPower: number;    // kW (default 85.0)
}

export interface MaintenanceInfo {
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'Optimal' | 'Due Soon' | 'Overdue';
  operatingHours: number;
  failureCount: number;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  type: MachineType;
  area: PlantArea;
  location: string;
  status: AssetStatus;
  currentTelemetry: Telemetry;
  telemetryHistory: Telemetry[];
  processingLocation: ProcessingLocation;
  healthScore: number; // 0 - 100
  thresholds: Thresholds;
  maintenance: MaintenanceInfo;
  cpuUtilization: number; // %
  networkLatency: number; // ms
  isManualOverride?: boolean;
}

export interface Alert {
  id: string;
  timestamp: string;
  assetId: string;
  assetName: string;
  sensor: SensorType | 'System' | 'Network';
  currentValue: string;
  threshold: string;
  severity: AlertSeverity;
  status: AlertStatus;
  processingLocation: ProcessingLocation;
  actionTaken: string;
  latencyMs: number;
}

export interface EventLog {
  id: string;
  timestamp: string;
  assetId: string;
  assetName: string;
  eventType: string;
  sensorValue: string;
  threshold: string;
  severity: AlertSeverity;
  processingLocation: ProcessingLocation;
  action: string;
  latencyMs: number;
}

export interface LocalRule {
  id: string;
  sensor: SensorType;
  operator: '>' | '>=' | '<' | '<=';
  threshold: number;
  unit: string;
  severity: AlertSeverity;
  action: string;
  description: string;
  enabled: boolean;
}

export interface CloudSyncState {
  mode: 'Online Mode' | 'Edge-Only Mode' | 'Cloud Sync Mode';
  connectionStatus: 'Connected' | 'Disconnected' | 'Degraded';
  lastSyncTime: string;
  eventsWaiting: number;
  eventsSynced: number;
  uploadRateKbps: number;
  networkLatencyMs: number;
  cloudAvailability: number; // %
}

export interface EdgeMetrics {
  avgEdgeLatencyMs: number;
  maxEdgeLatencyMs: number;
  eventsProcessedLocally: number;
  localDecisionsMade: number;
  cloudForwardedEvents: number;
  edgeProcessingRate: number; // events/sec
  networkAvailability: number; // %
}

export interface ScenarioStep {
  stepNumber: number;
  title: string;
  description: string;
  targetAssetId: string;
  expectedOutcome: string;
  isCurrent: boolean;
  isDone: boolean;
}
