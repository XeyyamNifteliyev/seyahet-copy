'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { Plane, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: `/${locale}/flights`, label: t('flights') },
    { href: `/${locale}/hotels`, label: t('hotels') },
    { href: `/${locale}/tours`, label: t('tours') },
    { href: `/${locale}/countries`, label: t('countries') },
    { href: `/${locale}/companions`, label: t('companions') },
    { href: `/${locale}/visa`, label: t('visa') },
    { href: `/${locale}/blog`, label: t('blog') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-primary font-bold text-xl">
            <Plane className="w-6 h-6" />
            <span>{t('appName')}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={isLoggedIn ? `/${locale}/profile` : `/${locale}/auth/login`}
              className="hidden md:flex items-center gap-1 text-sm text-gray-300 hover:text-primary transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{isLoggedIn ? t('profile') : t('login')}</span>
            </Link>
            <MobileMenu navLinks={navLinks} />
          </div>
        </div>
      </div>
    </header>
  );
}