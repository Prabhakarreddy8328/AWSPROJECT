import type { Asset, LocalRule } from '../types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'CNC-01',
    name: 'CNC Machine 01',
    type: 'CNC Machine',
    area: 'Production Area',
    location: 'Bay A1 - Milling Station',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 98,
    cpuUtilization: 34,
    networkLatency: 2.4,
    thresholds: {
      maxTemp: 80,
      maxPressure: 120,
      maxVibration: 15.0,
      maxPower: 85.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 58.2,
      pressure: 95.4,
      vibration: 3.2,
      power: 42.5,
      speed: 2450,
      latencyMs: 3.1,
      cloudLatencyMs: 42.0
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-08-15',
      nextMaintenance: '2026-11-15',
      status: 'Optimal',
      operatingHours: 1420,
      failureCount: 0,
      notes: 'Spindle bearings lubricated and alignment calibrated.'
    }
  },
  {
    id: 'CNC-02',
    name: 'CNC Machine 02',
    type: 'CNC Machine',
    area: 'Production Area',
    location: 'Bay A2 - Turning Station',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 94,
    cpuUtilization: 28,
    networkLatency: 2.8,
    thresholds: {
      maxTemp: 80,
      maxPressure: 120,
      maxVibration: 15.0,
      maxPower: 85.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 61.5,
      pressure: 98.1,
      vibration: 4.1,
      power: 46.2,
      speed: 2510,
      latencyMs: 2.9,
      cloudLatencyMs: 45.5
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-07-20',
      nextMaintenance: '2026-10-20',
      status: 'Optimal',
      operatingHours: 1850,
      failureCount: 1,
      notes: 'Coolant filter replaced.'
    }
  },
  {
    id: 'PRESS-01',
    name: 'Hydraulic Press 01',
    type: 'Hydraulic Press',
    area: 'Production Area',
    location: 'Bay B1 - Stamping Station',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 91,
    cpuUtilization: 42,
    networkLatency: 3.2,
    thresholds: {
      maxTemp: 85,
      maxPressure: 135,
      maxVibration: 18.0,
      maxPower: 95.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 66.8,
      pressure: 112.5,
      vibration: 6.8,
      power: 74.0,
      speed: 1200,
      latencyMs: 3.4,
      cloudLatencyMs: 48.2
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-06-10',
      nextMaintenance: '2026-10-10',
      status: 'Due Soon',
      operatingHours: 2310,
      failureCount: 2,
      notes: 'Hydraulic fluid pressure check scheduled.'
    }
  },
  {
    id: 'CONV-01',
    name: 'Conveyor Motor 01',
    type: 'Conveyor Motor',
    area: 'Assembly Area',
    location: 'Line C - Transport Track',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 96,
    cpuUtilization: 19,
    networkLatency: 2.1,
    thresholds: {
      maxTemp: 75,
      maxPressure: 90,
      maxVibration: 12.0,
      maxPower: 60.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 48.5,
      pressure: 45.0,
      vibration: 2.4,
      power: 28.3,
      speed: 1800,
      latencyMs: 2.5,
      cloudLatencyMs: 39.8
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-09-01',
      nextMaintenance: '2026-12-01',
      status: 'Optimal',
      operatingHours: 890,
      failureCount: 0,
      notes: 'Belt tension verified.'
    }
  },
  {
    id: 'ARM-01',
    name: 'Robotic Arm 01',
    type: 'Robotic Arm',
    area: 'Assembly Area',
    location: 'Line C - Welding Station',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 99,
    cpuUtilization: 55,
    networkLatency: 2.2,
    thresholds: {
      maxTemp: 78,
      maxPressure: 100,
      maxVibration: 10.0,
      maxPower: 70.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 52.0,
      pressure: 62.4,
      vibration: 1.8,
      power: 35.8,
      speed: 2800,
      latencyMs: 2.7,
      cloudLatencyMs: 41.2
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-09-10',
      nextMaintenance: '2026-12-10',
      status: 'Optimal',
      operatingHours: 1100,
      failureCount: 0,
      notes: 'Joint zero-point position recalibrated.'
    }
  },
  {
    id: 'COOL-01',
    name: 'Cooling System 01',
    type: 'Cooling System',
    area: 'Utility Area',
    location: 'HVAC Annex - Chiller 1',
    status: 'Healthy',
    processingLocation: 'Outposts / Edge',
    healthScore: 95,
    cpuUtilization: 22,
    networkLatency: 3.0,
    thresholds: {
      maxTemp: 70,
      maxPressure: 110,
      maxVibration: 14.0,
      maxPower: 80.0
    },
    currentTelemetry: {
      timestamp: new Date().toLocaleTimeString(),
      temperature: 38.2,
      pressure: 88.0,
      vibration: 2.9,
      power: 52.1,
      speed: 1500,
      latencyMs: 3.2,
      cloudLatencyMs: 44.0
    },
    telemetryHistory: [],
    maintenance: {
      lastMaintenance: '2026-08-01',
      nextMaintenance: '2026-11-01',
      status: 'Optimal',
      operatingHours: 1680,
      failureCount: 0,
      notes: 'Compressor refrigerant topped up.'
    }
  }
];

export const INITIAL_RULES: LocalRule[] = [
  {
    id: 'R-01',
    sensor: 'Temperature',
    operator: '>',
    threshold: 80,
    unit: '°C',
    severity: 'Critical',
    action: 'Stop Machine & Isolate Power',
    description: 'IF temperature > 80°C THEN Generate Critical Alert & Stop Machine locally on Outposts',
    enabled: true
  },
  {
    id: 'R-02',
    sensor: 'Pressure',
    operator: '>',
    threshold: 120,
    unit: 'PSI',
    severity: 'Warning',
    action: 'Reduce Machine Speed by 40%',
    description: 'IF pressure > 120 PSI THEN Generate Warning & Reduce Machine Speed locally',
    enabled: true
  },
  {
    id: 'R-03',
    sensor: 'Vibration',
    operator: '>',
    threshold: 15.0,
    unit: 'mm/s',
    severity: 'Critical',
    action: 'Emergency Shutdown & Lockout',
    description: 'IF vibration > 15.0 mm/s THEN Emergency Shutdown & Notify On-Call Technician',
    enabled: true
  },
  {
    id: 'R-04',
    sensor: 'Power',
    operator: '>',
    threshold: 85.0,
    unit: 'kW',
    severity: 'Warning',
    action: 'Throttle Load & Log Surge',
    description: 'IF power > 85 kW THEN Throttle motor load & send telemetry log to AWS CloudWatch',
    enabled: true
  }
];
