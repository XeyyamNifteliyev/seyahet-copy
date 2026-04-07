'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { BlogCard } from '@/components/blog/blog-card';
import type { Blog } from '@/types/blog';
import { Plus, Search, Filter } from 'lucide-react';

export default function BlogListPage() {
  const t = useTranslations('blog');
  const params = useParams();
  const locale = params?.locale as string;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const fetchBlogs = async () => {
      let query = supabase
        .from('blogs')
        .select(`
          *,
          author:profiles!blogs_author_id_fkey(name, avatar_url)
        `)
        .eq('status', 'published')
        .eq('language', locale)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      const { data } = await query;
      if (data) {
        let filtered = data as Blog[];
        if (filterTag) {
          filtered = filtered.filter(blog =>
            blog.tags?.some(tag => tag.toLowerCase() === filterTag.toLowerCase())
          );
        }
        setBlogs(filtered);
      }
      setLoading(false);
    };
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchBlogs();
    getUser();
  }, [locale, search, filterTag]);

  const allTags = Array.from(
    new Set(blogs.flatMap(blog => blog.tags || []))
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          {user && (
            <Link
              href={`/${locale}/blog/new`}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('newPost')}
            </Link>
          )}
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Blog axtar..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtrlər
            </button>
          </div>

          {showFilters && allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterTag('')}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  !filterTag
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Hamısı
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterTag === tag
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-gray-400 text-center py-12">{t('noPosts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
