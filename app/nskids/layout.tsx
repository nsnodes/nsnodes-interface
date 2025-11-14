import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NS Kids - Private',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NSKidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
