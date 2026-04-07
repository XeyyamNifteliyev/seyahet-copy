'use client';

import { useState, useEffect } from 'react';
import { BlogComment } from '@/types/comment';
import { useTranslations } from 'next-intl';
import { createBrowserClient } from '@/lib/supabase/client';
import { MessageSquare, Send, Trash2, Loader2, User } from 'lucide-react';

interface BlogCommentsProps {
  blogId: string;
}

export default function BlogComments({ blogId }: BlogCommentsProps) {
  const t = useTranslations('blog');
  const supabase = createBrowserClient();

  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    checkAuth();
  }, [blogId]);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchComments() {
    setLoading(true);
    const res = await fetch(`/api/comments?blogId=${blogId}`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setSubmitting(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, content: content.trim() }),
    });

    if (res.ok) {
      setContent('');
      fetchComments();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchComments();
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-700">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" />
        Şərhlər ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Şərh yaz..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white rounded-xl transition-colors"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-slate-400 text-sm mb-6">Şərh yazmaq üçün daxil olun.</p>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 text-center py-4">Hələ şərh yoxdur. İlk şərh yazın!</p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-slate-300 text-sm font-medium">
                  {comment.author?.name?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 bg-slate-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{comment.author?.name || 'Anonim'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">{formatDate(comment.createdAt)}</span>
                    {user && comment.userId === user.id && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
