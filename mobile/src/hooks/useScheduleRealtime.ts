import { useEffect, useCallback, useRef } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type ScheduleUpdateAction = 'create' | 'update' | 'delete';

export interface ScheduleUpdate {
  scheduleId: string;
  action: ScheduleUpdateAction;
  updatedBy: string;
  updatedAt: Timestamp;
}

interface UseScheduleRealtimeOptions {
  facilityId: string | null;
  staffId: string | null;
  onUpdate: () => void;
}

export function useScheduleRealtime({
  facilityId,
  staffId,
  onUpdate,
}: UseScheduleRealtimeOptions) {
  const lastUpdateRef = useRef<string | null>(null);

  useEffect(() => {
    if (!facilityId || !db) return;

    const updatesRef = collection(db, 'facilities', facilityId, 'schedule_updates');
    const q = query(updatesRef, orderBy('updatedAt', 'desc'), limit(1));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as ScheduleUpdate;

            // 自分自身の更新は無視（既にローカルで反映済み）
            if (data.updatedBy === staffId) {
              return;
            }

            // 同じ更新を2回処理しない
            if (lastUpdateRef.current === change.doc.id) {
              return;
            }
            lastUpdateRef.current = change.doc.id;

            // 他のユーザーの更新を検知したらコールバック実行
            onUpdate();
          }
        });
      },
      (error) => {
        console.error('Failed to listen to schedule updates:', error);
      }
    );

    return () => unsubscribe();
  }, [facilityId, staffId, onUpdate]);

  const notifyScheduleUpdate = useCallback(
    async (scheduleId: string, action: ScheduleUpdateAction) => {
      if (!facilityId || !staffId || !db) return;

      try {
        const updatesRef = collection(db, 'facilities', facilityId, 'schedule_updates');
        await addDoc(updatesRef, {
          scheduleId,
          action,
          updatedBy: staffId,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Failed to notify schedule update:', error);
      }
    },
    [facilityId, staffId]
  );

  return { notifyScheduleUpdate };
}
