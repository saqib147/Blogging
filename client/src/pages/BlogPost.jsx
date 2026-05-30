import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, likeBlog, unlikeBlog, bookmarkBlog, unbookmarkBlog } from '../api/blogs';
import { getBlogComments } from '../api/comments';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/ui/Avatar';
import Tag from '../components/ui/Tag';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import CommentThread from '../components/comments/CommentThread';
import toast from 'react-hot-toast';

function TableOfContents({ content }) {
  const headings = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return Array.from(doc.querySelectorAll('h2, h3')).map((el, i) => ({
      id: `heading-${i}`,
      text: el.textContent,
      level: el.tagName === 'H2' ? 2 : 3,
    }));
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-body/50 mb-3">
        On this page
      </h4>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${h.id}`}
              className="text-neutral-body/70 hover:text-primary transition-colors line-clamp-2"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = () => {
    getBlogById(id)
      .then(({ data }) => setBlog(data))
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false));
  };

  const fetchComments = () => {
    getBlogComments(id).then(({ data }) => setComments(data)).catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    fetchBlog();
    fetchComments();
  }, [id]);

  const contentWithIds = useMemo(() => {
    if (!blog?.content) return '';
    let i = 0;
    return blog.content.replace(/<(h[23])(\s[^>]*)?>/gi, (match, tag, attrs = '') => {
      if (/\bid\s*=/.test(attrs)) return match;
      return `<${tag}${attrs} id="heading-${i++}">`;
    });
  }, [blog?.content]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const api = blog.isLiked ? unlikeBlog : likeBlog;
      const { data } = await api(id);
      setBlog((prev) => ({ ...prev, isLiked: data.isLiked, likesCount: data.likesCount }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const api = blog.isBookmarked ? unbookmarkBlog : bookmarkBlog;
      const { data } = await api(id);
      setBlog((prev) => ({ ...prev, isBookmarked: data.isBookmarked }));
      toast.success(data.isBookmarked ? 'Saved to bookmarks' : 'Removed from bookmarks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-body/60">Post not found.</p>
      </div>
    );
  }

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isAuthor = user?._id === blog.author?._id;

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8">
      <div className="grid xl:grid-cols-[1fr_45rem_200px] gap-8 justify-center">
        <div className="hidden xl:block" />
        <article>
          {blog.category && (
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
              {blog.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-heading mt-2 mb-4">
            {blog.title}
          </h1>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-body/10">
            <Link to={`/profile/${blog.author?._id}`} className="flex items-center gap-2">
              <Avatar src={blog.author?.avatar} name={blog.author?.name} />
              <span className="text-sm font-medium">{blog.author?.name}</span>
            </Link>
            <span className="text-neutral-body/30">·</span>
            <span className="text-sm text-neutral-body/60">{date}</span>
            {blog.readTime && (
              <>
                <span className="text-neutral-body/30">·</span>
                <span className="text-sm text-neutral-body/60">{blog.readTime} min read</span>
              </>
            )}
          </div>

          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full rounded-md mb-8 max-h-[480px] object-cover"
            />
          )}

          <div
            className="prose-content max-w-reading mx-auto"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-neutral-body/10">
              {blog.tags.map((tag) => (
                <Tag key={tag} label={tag} to={`/search?tag=${encodeURIComponent(tag)}`} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            <Button
              variant={blog.isLiked ? 'secondary' : 'outline'}
              onClick={handleLike}
              className="text-sm"
            >
              {blog.isLiked ? '♥ Liked' : '♡ Like'} ({blog.likesCount || 0})
            </Button>
            <Button
              variant={blog.isBookmarked ? 'secondary' : 'outline'}
              onClick={handleBookmark}
              className="text-sm"
            >
              {blog.isBookmarked ? '★ Saved' : '☆ Save'}
            </Button>
            {isAuthor && (
              <Link to={`/edit/${blog._id}`}>
                <Button variant="ghost" className="text-sm">Edit</Button>
              </Link>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-body/10">
            <CommentThread
              blogId={id}
              blogAuthorId={blog.author?._id}
              comments={comments}
              onRefresh={fetchComments}
            />
          </div>
        </article>
        <TableOfContents content={blog.content} />
      </div>
    </div>
  );
}
