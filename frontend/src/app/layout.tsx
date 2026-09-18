import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { MerchantProvider } from '@/context/MerchantContext';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: 'Paytm Saarthi AI — Your AI Business Teammate',
  description: 'Tell it your goal. Saarthi gets it done. Autonomous AI for Indian merchants.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#faf8ff] dark:bg-[#080e1a] text-slate-900 dark:text-slate-50 transition-colors">
        <ThemeProvider>
          <MerchantProvider>
            <Shell>{children}</Shell>
          </MerchantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
