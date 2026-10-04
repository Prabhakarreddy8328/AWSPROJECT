import type { Alert, Asset, EventLog, LocalRule } from '../types';

export interface DecisionEvaluationResult {
  updatedAsset: Asset;
  newAlerts: Alert[];
  newEventLogs: EventLog[];
  localDecisionMade: boolean;
  decisionLatencyMs: number;
}

export const evaluateLocalRules = (
  asset: Asset,
  rules: LocalRule[],
  existingAlerts: Alert[]
): DecisionEvaluationResult => {
  const telemetry = asset.currentTelemetry;
  const newAlerts: Alert[] = [];
  const newEventLogs: EventLog[] = [];
  let localDecisionMade = false;

  let healthScore = 100;
  
  if (telemetry.temperature > 70) healthScore -= (telemetry.temperature - 70) * 1.5;
  if (telemetry.pressure > 110) healthScore -= (telemetry.pressure - 110) * 0.8;
  if (telemetry.vibration > 10) healthScore -= (telemetry.vibration - 10) * 2.5;

  healthScore = Math.max(10, Math.min(100, Math.round(healthScore)));

  let newStatus = asset.status;
  let newSpeed = telemetry.speed;

  const decisionLatencyMs = Number((1.8 + Math.random() * 2.1).toFixed(1));

  for (const rule of rules) {
    if (!rule.enabled) continue;

    let triggered = false;
    let sensorVal = 0;

    if (rule.sensor === 'Temperature') sensorVal = telemetry.temperature;
    else if (rule.sensor === 'Pressure') sensorVal = telemetry.pressure;
    else if (rule.sensor === 'Vibration') sensorVal = telemetry.vibration;
    else if (rule.sensor === 'Power') sensorVal = telemetry.power;
    else if (rule.sensor === 'Machine Speed') sensorVal = telemetry.speed;

    if (rule.operator === '>' && sensorVal > rule.threshold) triggered = true;
    if (rule.operator === '>=' && sensorVal >= rule.threshold) triggered = true;
    if (rule.operator === '<' && sensorVal < rule.threshold) triggered = true;

    if (triggered) {
      localDecisionMade = true;

      if (rule.severity === 'Critical') {
        newStatus = 'Critical';
        if (rule.action.toLowerCase().includes('stop') || rule.action.toLowerCase().includes('shutdown')) {
          newSpeed = 0;
        }
      } else if (rule.severity === 'Warning' && newStatus !== 'Critical') {
        newStatus = 'Warning';
        if (rule.action.toLowerCase().includes('reduce speed')) {
          newSpeed = Math.round(newSpeed * 0.6);
        }
      }

      const hasActiveDuplicate = existingAlerts.some(
        a => a.assetId === asset.id && a.sensor === rule.sensor && a.status === 'Active'
      );

      if (!hasActiveDuplicate) {
        const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
        const alert: Alert = {
          id: alertId,
          timestamp: telemetry.timestamp,
          assetId: asset.id,
          assetName: asset.name,
          sensor: rule.sensor,
          currentValue: `${sensorVal}${rule.unit}`,
          threshold: `${rule.threshold}${rule.unit}`,
          severity: rule.severity,
          status: 'Active',
          processingLocation: 'Outposts / Edge',
          actionTaken: rule.action,
          latencyMs: decisionLatencyMs
        };
        newAlerts.push(alert);

        const eventLog: EventLog = {
          id: `EVT-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: telemetry.timestamp,
          assetId: asset.id,
          assetName: asset.name,
          eventType: `Local Edge Trigger: High ${rule.sensor}`,
          sensorValue: `${sensorVal}${rule.unit}`,
          threshold: `${rule.threshold}${rule.unit}`,
          severity: rule.severity,
          processingLocation: 'Outposts / Edge',
          action: rule.action,
          latencyMs: decisionLatencyMs
        };
        newEventLogs.push(eventLog);
      }
    }
  }

  if (healthScore >= 90 && newStatus !== 'Offline' && newStatus !== 'Idle') {
    newStatus = 'Healthy';
  } else if (healthScore < 90 && healthScore >= 60 && newStatus === 'Healthy') {
    newStatus = 'Warning';
  } else if (healthScore < 60 && newStatus !== 'Offline') {
    newStatus = 'Critical';
  }

  const updatedAsset: Asset = {
    ...asset,
    status: newStatus,
    healthScore,
    currentTelemetry: {
      ...asset.currentTelemetry,
      speed: newSpeed
    }
  };

  return {
    updatedAsset,
    newAlerts,
    newEventLogs,
    localDecisionMade,
    decisionLatencyMs
  };
};
