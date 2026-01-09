import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import ThemeRegistry from '@/components/ThemeRegistry';

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '訪問介護記録管理',
  description: '訪問介護サービスの記録・管理システム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
