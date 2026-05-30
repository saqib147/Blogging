import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import Tag from '../ui/Tag';

export default function HeroPost({ blog }) {
  if (!blog) return null;

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="overflow-hidden group">
      <div className="grid md:grid-cols-2 gap-0">
        {blog.coverImage && (
          <Link to={`/blog/${blog._id}`} className="block overflow-hidden relative">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 md:h-full min-h-[300px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 md:hidden" />
          </Link>
        )}
        <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-surface to-background/30">
          {blog.category && (
            <span className="inline-flex w-fit items-center gap-2 text-[11px] font-semibold text-secondary uppercase tracking-widest mb-4">
              <span className="h-px w-6 bg-secondary/40" />
              Featured · {blog.category}
            </span>
          )}
          <Link to={`/blog/${blog._id}`}>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-bold text-neutral-heading mb-4 leading-tight text-balance group-hover:text-primary transition-colors">
              {blog.title}
            </h2>
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 text-sm">
            <Link to={`/profile/${blog.author?._id}`} className="flex items-center gap-2 hover:opacity-80">
              <Avatar src={blog.author?.avatar} name={blog.author?.name} />
              <span className="font-medium text-neutral-heading">{blog.author?.name}</span>
            </Link>
            <span className="text-neutral-body/25">·</span>
            <span className="text-neutral-body/55">{date}</span>
            {blog.readTime && (
              <>
                <span className="text-neutral-body/25">·</span>
                <span className="text-neutral-body/55">{blog.readTime} min read</span>
              </>
            )}
          </div>
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Tag key={tag} label={tag} to={`/search?tag=${encodeURIComponent(tag)}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
