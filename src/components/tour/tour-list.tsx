'use client';

import { useState, useEffect } from 'react';
import { Tour } from '@/types/tour';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import {
  Search, MapPin, Calendar, Clock, Users, Star,
  Loader2, Bus, Hotel, Utensils, Eye, ChevronRight
} from 'lucide-react';

const REGIONS = [
  'Quba', 'Şəki', 'Lənkəran', 'Naxçıvan', 'Qarabağ',
  'Bakı', 'Gəncə', 'Zaqatala', 'İsmayıllı', 'Şamaxı',
  'Xaçmaz', 'Qəbələ', 'Tərtər', 'Laçın', 'Ağdam'
];

const TOUR_TYPES = ['active', 'cultural', 'gastronomy', 'family', 'solo', 'nature', 'historical'];

export default function ToursPage() {
  const t = useTranslations('tours');
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string;

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    tourType: '',
    priceMin: '',
    priceMax: '',
    transportation: false,
    rating: '',
    search: '',
  });

  useEffect(() => {
    fetchTours();
  }, [filters]);

  async function fetchTours() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.region) params.set('region', filters.region);
    if (filters.tourType) params.set('tourType', filters.tourType);
    if (filters.priceMin) params.set('priceMin', filters.priceMin);
    if (filters.priceMax) params.set('priceMax', filters.priceMax);
    if (filters.transportation) params.set('transportation', 'true');
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.search) params.set('search', filters.search);

    const res = await fetch(`/api/tours?${params}`);
    const data = await res.json();
    setTours(data.tours || []);
    setLoading(false);
  }

  function getTourTypeLabel(type: string) {
    const key = `type${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return t(key) || type;
  }

  function formatPrice(price: number) {
    return `${price.toLocaleString('az-AZ')} AZN`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MapPin className="w-8 h-8 text-emerald-400" />
            {t('title')}
          </h1>
          <p className="text-slate-400 mt-1">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400"
              />
            </div>
            <select
              value={filters.region}
              onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
              className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white"
            >
              <option value="">{t('allRegions')}</option>
              {REGIONS.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={filters.tourType}
              onChange={e => setFilters(prev => ({ ...prev, tourType: e.target.value }))}
              className="bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white"
            >
              <option value="">{t('allTypes')}</option>
              {TOUR_TYPES.map(type => (
                <option key={type} value={type}>{getTourTypeLabel(type)}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                value={filters.priceMin}
                onChange={e => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                placeholder={t('minPrice')}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white placeholder-slate-400"
              />
              <input
                type="number"
                value={filters.priceMax}
                onChange={e => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                placeholder={t('maxPrice')}
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-3 py-2.5 text-white placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.transportation}
                onChange={e => setFilters(prev => ({ ...prev, transportation: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-sky-500"
              />
              <Bus className="w-4 h-4" />
              {t('transportation')}
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">{t('noTours')}</p>
            <p className="text-slate-500 text-sm mt-1">{t('noToursSub')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div
                key={tour.id}
                onClick={() => router.push(`/${locale}/tours/${tour.slug}`)}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-700 overflow-hidden">
                  {tour.images?.[0] ? (
                    <img
                      src={tour.images[0]}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-slate-500" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/90 text-white text-xs font-medium rounded-full">
                      {getTourTypeLabel(tour.tourType)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-slate-900/80 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {tour.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-emerald-400 transition-colors">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    {tour.region}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-slate-500" />
                      {tour.durationDays} {t('days')} / {tour.durationNights} {t('nights')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-500" />
                      {tour.groupMin}–{tour.groupMax}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-slate-500" />
                      {tour.views}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {tour.transportationIncluded && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-sky-500/10 text-sky-400 text-xs rounded-full">
                        <Bus className="w-3 h-3" />
                        {t('included')}
                      </span>
                    )}
                    {tour.hotelIncluded && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full">
                        <Hotel className="w-3 h-3" />
                        {tour.hotelStars ? `${tour.hotelStars}★` : t('included')}
                      </span>
                    )}
                    {tour.mealsIncluded?.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full">
                        <Utensils className="w-3 h-3" />
                        {tour.mealsIncluded.length}
                      </span>
                    )}
                  </div>

                  {/* Company */}
                  {tour.company && (
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs text-white">
                        {(tour.company as any).company_name?.[0] || 'T'}
                      </div>
                      <span className="text-slate-300 text-sm">{(tour.company as any).company_name}</span>
                      {(tour.company as any).is_verified && (
                        <span className="text-emerald-400 text-xs">✓</span>
                      )}
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 font-bold text-xl">{formatPrice(tour.price)}</span>
                      <span className="text-slate-500 text-sm"> {t('perPerson')}</span>
                    </div>
                    <button className="flex items-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors">
                      {t('bookNow')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
