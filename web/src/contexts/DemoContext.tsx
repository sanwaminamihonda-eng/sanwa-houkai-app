'use client';

import React, { createContext, useContext } from 'react';

// デモ用固定値（環境変数で上書き可能）
// シードデータ（demo-seed.sql）と一致させる
const DEMO_FACILITY_ID = process.env.NEXT_PUBLIC_DEMO_FACILITY_ID || '00000000-0000-0000-0000-000000000001';
const DEMO_STAFF_ID = process.env.NEXT_PUBLIC_DEMO_STAFF_ID || '00000000-0000-0000-0000-000000000101';

interface DemoContextType {
  isDemo: true;
  facilityId: string;
  staffId: string;
  staffName: string;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const value: DemoContextType = {
    isDemo: true,
    facilityId: DEMO_FACILITY_ID,
    staffId: DEMO_STAFF_ID,
    staffName: 'デモユーザー',
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within DemoProvider');
  }
  return context;
}

export { DemoContext };
