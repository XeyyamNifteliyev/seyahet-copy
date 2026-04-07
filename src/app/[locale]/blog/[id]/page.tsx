'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { Blog } from '@/types/blog';
import { Calendar, Eye, Heart, ArrowLeft, Share2, Tag } from 'lucide-react';
import Link from 'next/link';
import BlogComments from '@/components/blog/blog-comments';

export default function BlogDetailPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const blogId = params?.id as string;
  const t = useTranslations('blog');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('blogs')
        .select(`
          *,
          author:profiles!blogs_author_id_fkey(name, avatar_url, bio)
        `)
        .eq('id', blogId)
        .single();
      if (data) setBlog(data as Blog);
      setLoading(false);
    };
    fetchBlog();
  }, [blogId]);

  async function handleLike() {
    if (!blog) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('blogs')
      .update({ likes: blog.likes + 1 })
      .eq('id', blog.id)
      .select()
      .single();
    if (data) setBlog(data as Blog);
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: blog?.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">{t('loading')}</div>;
  if (!blog) return <div className="max-w-3xl mx-auto px-4 py-12">{t('notFound')}</div>;

  const author = (blog as any).author;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href={`/${locale}/blog`} className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('backToBlogs')}
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{blog.title}</h1>

        <div className="flex items-center gap-4 text-gray-400 text-sm mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(blog.created_at).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {blog.views} {t('views')}
          </span>
          <button onClick={handleLike} className="flex items-center gap-1 hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4" />
            {blog.likes} {t('likes')}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 hover:text-sky-400 transition-colors">
            <Share2 className="w-4 h-4" />
            Paylaş
          </button>
        </div>

        {blog.cover_image && (
          <img src={blog.cover_image} alt={blog.title} className="w-full rounded-xl mb-8" />
        )}

        {author && (
          <div className="flex items-center gap-3 mb-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-10 h-10 bg-sky-500/20 rounded-full flex items-center justify-center">
              <span className="text-sky-400 font-medium">{author.name?.[0] || 'A'}</span>
            </div>
            <div>
              <p className="text-white font-medium">{author.name}</p>
              {author.bio && <p className="text-slate-400 text-sm">{author.bio}</p>}
            </div>
          </div>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1 px-3 py-1 bg-sky-500/10 text-sky-400 text-sm rounded-full">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="prose prose-invert max-w-none text-slate-300"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <BlogComments blogId={blog.id} />
      </div>
    </div>
  );
}
