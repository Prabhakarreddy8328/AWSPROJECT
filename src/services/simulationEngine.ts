import type { Asset, Telemetry } from '../types';

export type ActiveScenario = 
  | 'NORMAL'
  | 'HIGH_TEMP'
  | 'HIGH_PRESSURE'
  | 'HIGH_VIBRATION'
  | 'MACHINE_FAILURE'
  | 'NETWORK_DELAY'
  | 'CLOUD_DISCONNECTED';

export interface PhysicsTickResult {
  updatedAsset: Asset;
  simulatedLatencyMs: number;
}

export const generateTelemetryTick = (
  asset: Asset,
  scenario: ActiveScenario,
  scenarioTargetAssetId: string | null,
  tickCount: number
): PhysicsTickResult => {
  const isTargetAsset = scenarioTargetAssetId ? asset.id === scenarioTargetAssetId : true;

  let baseTemp = 55;
  let basePressure = 90;
  let baseVibration = 3.5;
  let basePower = 40;
  let baseSpeed = 2200;

  if (asset.type === 'Hydraulic Press') {
    baseTemp = 65;
    basePressure = 110;
    baseVibration = 6.0;
    basePower = 70;
    baseSpeed = 1200;
  } else if (asset.type === 'Conveyor Motor') {
    baseTemp = 48;
    basePressure = 45;
    baseVibration = 2.5;
    basePower = 28;
    baseSpeed = 1800;
  } else if (asset.type === 'Robotic Arm') {
    baseTemp = 52;
    basePressure = 60;
    baseVibration = 1.8;
    basePower = 35;
    baseSpeed = 2800;
  } else if (asset.type === 'Cooling System') {
    baseTemp = 38;
    basePressure = 85;
    baseVibration = 2.8;
    basePower = 50;
    baseSpeed = 1500;
  }

  const curr = asset.currentTelemetry;
  let temp = curr.temperature;
  let pressure = curr.pressure;
  let vibration = curr.vibration;
  let power = curr.power;
  let speed = curr.speed;

  if (asset.status === 'Critical' && speed === 0) {
    temp = Math.max(25, temp - 1.2);
    pressure = Math.max(1, pressure - 5);
    vibration = Math.max(0, vibration - 0.5);
    power = 0.5;
    speed = 0;
  } else {
    const sinFactor = Math.sin(tickCount * 0.2);
    const noise = (Math.random() - 0.5);

    temp = Math.max(20, Math.min(100, baseTemp + sinFactor * 2 + noise * 0.8));
    pressure = Math.max(10, Math.min(160, basePressure + sinFactor * 4 + noise * 1.5));
    vibration = Math.max(0.5, Math.min(25, baseVibration + sinFactor * 0.5 + noise * 0.3));
    power = Math.max(5, Math.min(110, basePower + sinFactor * 3 + noise * 1.0));
    speed = Math.max(0, Math.min(3200, baseSpeed + sinFactor * 20 + noise * 15));

    if (isTargetAsset) {
      if (scenario === 'HIGH_TEMP') {
        temp = Math.min(96, curr.temperature + 4.5 + Math.random() * 2);
      } else if (scenario === 'HIGH_PRESSURE') {
        pressure = Math.min(150, curr.pressure + 6.0 + Math.random() * 3);
      } else if (scenario === 'HIGH_VIBRATION') {
        vibration = Math.min(22.0, curr.vibration + 1.8 + Math.random() * 0.5);
      } else if (scenario === 'MACHINE_FAILURE') {
        temp = Math.min(98, curr.temperature + 5.0);
        vibration = Math.min(24.0, curr.vibration + 3.0);
        power = Math.min(105, curr.power + 8.0);
      }
    }
  }

  let latencyMs = Number((2.2 + Math.random() * 1.8).toFixed(1));
  let cloudLatencyMs = Number((38.0 + Math.random() * 25.0).toFixed(1));

  if (scenario === 'NETWORK_DELAY') {
    cloudLatencyMs = Number((180.0 + Math.random() * 200.0).toFixed(1));
    latencyMs = Number((2.5 + Math.random() * 1.2).toFixed(1));
  }

  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

  const newTelemetry: Telemetry = {
    timestamp: timeString,
    temperature: Number(temp.toFixed(1)),
    pressure: Number(pressure.toFixed(1)),
    vibration: Number(vibration.toFixed(1)),
    power: Number(power.toFixed(1)),
    speed: Math.round(speed),
    latencyMs,
    cloudLatencyMs
  };

  const updatedHistory = [...asset.telemetryHistory, newTelemetry].slice(-40);

  const updatedAsset: Asset = {
    ...asset,
    currentTelemetry: newTelemetry,
    telemetryHistory: updatedHistory
  };

  return {
    updatedAsset,
    simulatedLatencyMs: latencyMs
  };
};
