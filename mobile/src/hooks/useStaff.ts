import { useState, useEffect } from 'react';
import { dataConnect } from '../lib/firebase';
import { getStaffByFirebaseUid, GetStaffByFirebaseUidData } from '@sanwa-houkai-app/dataconnect';
import { useAuth } from '../contexts/AuthContext';

type Staff = GetStaffByFirebaseUidData['staffs'][0];

interface UseStaffResult {
  staff: Staff | null;
  facilityId: string | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStaff(): UseStaffResult {
  const { user } = useAuth();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async (uid: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStaffByFirebaseUid(dataConnect, { uid });
      if (result.data.staffs.length > 0) {
        setStaff(result.data.staffs[0]);
      } else {
        setStaff(null);
        setError('スタッフ情報が見つかりません');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '取得エラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setStaff(null);
      setLoading(false);
      return;
    }
    fetchStaff(user.uid);
  }, [user]);

  const refetch = async () => {
    if (user) {
      await fetchStaff(user.uid);
    }
  };

  return {
    staff,
    facilityId: staff?.facility.id ?? null,
    loading,
    error,
    refetch,
  };
}
