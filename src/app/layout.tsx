import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import { TopAccessibilityBar } from '@/components/ui/NavigationMap';
import { GlossaryModal } from '@/components/ui/GlossaryModal';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'As Estações do Ano: Como Funciona o Clima na Terra?',
  description:
    'Material didático digital interativo para explorar os movimentos da Terra, a inclinação do eixo terrestre e as quatro estações do ano.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${lexend.className} min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-sky-50/60 text-slate-800 antialiased selection:bg-indigo-600 selection:text-white`}
      >
        <Suspense fallback={null}>
          <TopAccessibilityBar />
        </Suspense>
        <GlossaryModal />
        <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">{children}</main>
      </body>
    </html>
  );
}