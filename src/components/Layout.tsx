import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { CookieBanner } from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
      <CookieBanner/>
    </div>
  );
}
