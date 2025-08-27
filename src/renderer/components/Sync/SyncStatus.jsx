import React from 'react';
import { useSyncContext } from '../../context/SyncContext';
import { usePilesContext } from '../../context/PilesContext';
import styles from './SyncStatus.module.scss';

function SyncStatus() {
  const {
    syncStatus,
    syncProgress,
    lastSyncTime,
    performSync,
    canSync,
    autoSyncEnabled,
    setAutoSyncEnabled,
  } = useSyncContext();
  const { currentPile } = usePilesContext();

  if (!canSync || !currentPile?.isCloudPile) {
    return null;
  }

  const handleManualSync = () => {
    if (syncStatus === 'idle') {
      performSync('manual');
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return '🔄';
      case 'complete':
        return '✅';
      case 'error':
        return '⚠️';
      default:
        return '☁️';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return syncProgress > 0
          ? `Syncing... ${Math.round(syncProgress)}%`
          : 'Syncing...';
      case 'complete':
        return 'Sync complete';
      case 'error':
        return 'Sync failed';
      default:
        return lastSyncTime
          ? `Last sync: ${formatLastSync(lastSyncTime)}`
          : 'Not synced';
    }
  };

  const formatLastSync = (time) => {
    const now = new Date();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className={styles.syncStatus}>
      <div className={styles.statusInfo}>
        <span className={styles.icon}>{getSyncStatusIcon()}</span>
        <span className={styles.text}>{getSyncStatusText()}</span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.syncButton}
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          title="Manual sync"
        >
          {syncStatus === 'syncing' ? '⏸' : '🔄'}
        </button>

        <button
          className={`${styles.autoSyncButton} ${autoSyncEnabled ? styles.enabled : ''}`}
          onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
          title={`Auto-sync: ${autoSyncEnabled ? 'ON' : 'OFF'}`}
        >
          ⚡
        </button>
      </div>

      {syncProgress > 0 && syncStatus === 'syncing' && (
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${syncProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default SyncStatus;
