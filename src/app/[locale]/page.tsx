'use client';

import { useTranslations } from 'next-intl';
import { FlightSearch } from '@/components/search/flight-search';
import { GlobeHero } from '@/components/home/globe-hero';
import { Globe, MapPin, Star } from 'lucide-react';

const popularDestinations = [
  { slug: 'turkey', name: 'Türkiyə', flag: '🇹🇷', price: '199 AZN' },
  { slug: 'dubai', name: 'Dubai', flag: '🇦🇪', price: '399 AZN' },
  { slug: 'georgia', name: 'Gürcüstan', flag: '🇬🇪', price: '99 AZN' },
  { slug: 'japan', name: 'Yaponiya', flag: '🇯🇵', price: '1199 AZN' },
];

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('heroTitle')}
              </h1>
              <p className="text-gray-400 text-lg mb-8">{t('heroSubtitle')}</p>
            </div>

            {/* Right: 3D Globe */}
            <div className="flex-shrink-0 w-[280px] h-[280px] hidden md:block">
              <GlobeHero />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-5xl mx-auto px-4 -mt-8">
        <FlightSearch />
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">{t('popularDestinations')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularDestinations.map((dest) => (
            <div
              key={dest.slug}
              className="bg-surface rounded-xl p-4 border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="text-4xl mb-3">{dest.flag}</div>
              <h3 className="font-semibold">{dest.name}</h3>
              <p className="text-gray-400 text-sm mt-1">From {dest.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
