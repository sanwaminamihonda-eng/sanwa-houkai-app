'use client';

import { DemoLayout } from '@/components/layout';

export default function DemoRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoLayout>{children}</DemoLayout>;
}
