'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ClientDetailView, ClientForDetail } from '@/components/clients';
import { dataConnect } from '@/lib/firebase';
import { demoGetClient } from '@sanwa-houkai-app/dataconnect';

function ClientDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get('id');

  const [client, setClient] = useState<ClientForDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setError('利用者IDが指定されていません');
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const result = await demoGetClient(dataConnect, { id: clientId });
        if (result.data.client) {
          setClient(result.data.client as ClientForDetail);
        } else {
          setError('利用者が見つかりません');
        }
      } catch (err) {
        console.error('Failed to load client:', err);
        setError('利用者情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  return (
    <ClientDetailView
      client={client}
      loading={loading}
      error={error}
      onBack={() => router.push('/demo/clients')}
      showExtendedSections={true}
    />
  );
}

export default function DemoClientDetailPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      }
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        利用者詳細
      </Typography>
      <ClientDetailContent />
    </Suspense>
  );
}
