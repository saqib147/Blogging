import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Tag from '../ui/Tag';

export default function PostCard({ blog }) {
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card hover className="overflow-hidden h-full flex flex-col group">
      {blog.coverImage && (
        <Link to={`/blog/${blog._id}`} className="block overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
      )}
      <div className="p-5 flex flex-col flex-1">
        {blog.category && (
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-widest mb-2.5">
            {blog.category}
          </span>
        )}
        <Link to={`/blog/${blog._id}`}>
          <h3 className="font-display text-lg font-semibold text-neutral-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-primary/5">
          <Link to={`/profile/${blog.author?._id}`} className="flex items-center gap-2 min-w-0">
            <Avatar src={blog.author?.avatar} name={blog.author?.name} size="sm" />
            <span className="text-sm text-neutral-body/70 truncate">{blog.author?.name}</span>
          </Link>
          <span className="text-neutral-body/25 shrink-0">·</span>
          <span className="text-xs text-neutral-body/45 shrink-0">{date}</span>
          {blog.readTime && (
            <>
              <span className="text-neutral-body/25 shrink-0">·</span>
              <span className="text-xs text-neutral-body/45 shrink-0">{blog.readTime} min</span>
            </>
          )}
        </div>
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} label={tag} to={`/search?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
