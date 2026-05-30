import { useEffect, useState } from 'react';
import { getBlogs } from '../api/blogs';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/blog/PostCard';
import Spinner from '../components/ui/Spinner';

export default function Bookmarks() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getBlogs({ bookmarked: true, limit: 50 })
      .then(({ data }) => setBlogs(data.blogs))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-heading mb-6">Your Bookmarks</h1>
      {blogs.length === 0 ? (
        <p className="text-neutral-body/50 text-center py-12">
          No bookmarked stories yet. Save posts you want to read later.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <PostCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
