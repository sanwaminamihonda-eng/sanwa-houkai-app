'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { MainLayout } from '@/components/layout';
import { RecordDetailView, VisitRecordForDetail } from '@/components/records';
import { dataConnect } from '@/lib/firebase';
import { getVisitRecord } from '@sanwa-houkai-app/dataconnect';

function RecordDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const recordId = searchParams.get('id');

  const [record, setRecord] = useState<VisitRecordForDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) {
      setError('記録IDが指定されていません');
      setLoading(false);
      return;
    }

    const fetchRecord = async () => {
      try {
        const result = await getVisitRecord(dataConnect, { id: recordId });
        if (result.data.visitRecord) {
          setRecord(result.data.visitRecord as VisitRecordForDetail);
        } else {
          setError('記録が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load record:', err);
        setError('記録の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  return (
    <RecordDetailView
      record={record}
      loading={loading}
      error={error}
      onBack={() => router.push('/records')}
      showExtendedSections={true}
    />
  );
}

export default function RecordDetailPage() {
  return (
    <MainLayout title="記録詳細" showBackButton backHref="/records">
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        }
      >
        <RecordDetailContent />
      </Suspense>
    </MainLayout>
  );
}
