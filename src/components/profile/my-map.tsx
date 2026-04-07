'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Globe, Plus, Trash2, MapPin } from 'lucide-react';

const COUNTRIES = [
  { slug: 'turkiye', name: 'Türkiyə', flag: '🇹🇷' },
  { slug: 'russia', name: 'Rusiya', flag: '🇷🇺' },
  { slug: 'georgia', name: 'Gürcüstan', flag: '🇬🇪' },
  { slug: 'iran', name: 'İran', flag: '🇮🇷' },
  { slug: 'uae', name: 'Dubai', flag: '🇦🇪' },
  { slug: 'thailand', name: 'Tailand', flag: '🇹🇭' },
  { slug: 'japan', name: 'Yaponiya', flag: '🇯🇵' },
  { slug: 'germany', name: 'Almaniya', flag: '🇩🇪' },
  { slug: 'france', name: 'Fransa', flag: '🇫🇷' },
  { slug: 'italy', name: 'İtaliya', flag: '🇮🇹' },
  { slug: 'spain', name: 'İspaniya', flag: '🇪🇸' },
  { slug: 'egypt', name: 'Misir', flag: '🇪🇬' },
  { slug: 'maldives', name: 'Maldiv', flag: '🇲🇻' },
  { slug: 'indonesia', name: 'Bali', flag: '🇮🇩' },
  { slug: 'south-korea', name: 'Koreya', flag: '🇰🇷' },
  { slug: 'usa', name: 'ABŞ', flag: '🇺🇸' },
  { slug: 'uk', name: 'İngiltərə', flag: '🇬🇧' },
  { slug: 'azerbaijan', name: 'Azərbaycan', flag: '🇦🇿' },
];

export function MyMap() {
  const params = useParams();
  const locale = params?.locale as string;
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data } = await supabase
        .from('user_countries')
        .select('*')
        .eq('user_id', user.id)
        .order('visited_at', { ascending: false });

      if (data) setCountries(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!selectedCountry || !user) return;
    setAdding(true);
    await supabase.from('user_countries').insert({
      user_id: user.id,
      country_slug: selectedCountry,
      visited_at: visitDate || null,
    });
    const { data } = await supabase
      .from('user_countries')
      .select('*')
      .eq('user_id', user.id)
      .order('visited_at', { ascending: false });
    if (data) setCountries(data);
    setShowAdd(false);
    setSelectedCountry('');
    setVisitDate('');
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ölkəni silmək istədiyinizə əminsiniz?')) return;
    await supabase.from('user_countries').delete().eq('id', id);
    setCountries((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-12 bg-surface rounded-xl" /><div className="h-12 bg-surface rounded-xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="w-6 h-6 text-yellow-400" />
          Xəritəm
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ölkə Əlavə Et
        </button>
      </div>

      {showAdd && (
        <div className="bg-surface rounded-xl p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ölkə</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-dark/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Ölkə seçin</option>
              {COUNTRIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Səyahət tarixi (opsional)</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full bg-dark/50 border border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={adding || !selectedCountry}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Əlavə Et
            </button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
              Ləğv Et
            </button>
          </div>
        </div>
      )}

      {countries.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 border border-gray-700 text-center">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">Hələ ölkə əlavə etməmisiniz</p>
          <button onClick={() => setShowAdd(true)} className="text-primary hover:underline">
            İlk ölkənizi əlavə edin →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {countries.map((country) => {
            const countryInfo = COUNTRIES.find((c) => c.slug === country.country_slug);
            return (
              <div key={country.id} className="bg-surface rounded-xl p-4 border border-gray-700 flex items-center justify-between group">
                <div>
                  <span className="text-2xl">{countryInfo?.flag || '🌍'}</span>
                  <p className="text-sm font-medium mt-1">{countryInfo?.name || country.country_slug}</p>
                  {country.visited_at && (
                    <p className="text-xs text-gray-500">{new Date(country.visited_at).toLocaleDateString('az-AZ')}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
