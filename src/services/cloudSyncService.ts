import type { CloudSyncState, EventLog } from '../types';

export const INITIAL_CLOUD_SYNC_STATE: CloudSyncState = {
  mode: 'Online Mode',
  connectionStatus: 'Connected',
  lastSyncTime: new Date().toLocaleTimeString(),
  eventsWaiting: 0,
  eventsSynced: 12480,
  uploadRateKbps: 1840,
  networkLatencyMs: 42,
  cloudAvailability: 99.99
};

export const processCloudSync = (
  currentState: CloudSyncState,
  newLocalEvents: EventLog[]
): { nextState: CloudSyncState; syncedLogs: EventLog[] } => {
  let eventsWaiting = currentState.eventsWaiting + newLocalEvents.length;
  let eventsSynced = currentState.eventsSynced;
  let lastSyncTime = currentState.lastSyncTime;

  if (currentState.mode === 'Edge-Only Mode' || currentState.connectionStatus === 'Disconnected') {
    return {
      nextState: {
        ...currentState,
        connectionStatus: 'Disconnected',
        eventsWaiting,
        uploadRateKbps: 0,
        networkLatencyMs: 0
      },
      syncedLogs: []
    };
  }

  if (eventsWaiting > 0) {
    const syncBatch = Math.min(eventsWaiting, 15);
    eventsWaiting -= syncBatch;
    eventsSynced += syncBatch;
    lastSyncTime = new Date().toLocaleTimeString();
  }

  const uploadRateKbps = Math.round(1500 + Math.random() * 600);
  const networkLatencyMs = Math.round(38 + Math.random() * 12);

  return {
    nextState: {
      ...currentState,
      connectionStatus: 'Connected',
      lastSyncTime,
      eventsWaiting,
      eventsSynced,
      uploadRateKbps,
      networkLatencyMs
    },
    syncedLogs: newLocalEvents
  };
};
