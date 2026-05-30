import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, getCategoriesAndTags } from '../api/blogs';
import HeroPost from '../components/blog/HeroPost';
import PostCard from '../components/blog/PostCard';
import CategorySidebar from '../components/blog/CategorySidebar';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [meta, setMeta] = useState({ categories: [], tags: [] });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriesAndTags()
      .then(({ data }) => setMeta(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getBlogs({ page, limit: 9 })
      .then(({ data }) => {
        setBlogs(data.blogs);
        setPages(data.pages);
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, [page]);

  const heroBlog = blogs[0];
  const gridBlogs = blogs.slice(1);

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 lg:py-14">
      <section className="mb-12 lg:mb-16 text-center max-w-2xl mx-auto">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary mb-3">
          Welcome to Ink & Echo
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-neutral-heading leading-tight text-balance mb-4">
          Stories that stay with you
        </h1>
        <p className="text-neutral-body/65 text-base sm:text-lg leading-relaxed mb-6">
          Discover essays, travel notes, and ideas from writers who take their time — and invite you to do the same.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/search">
            <Button variant="outline">Browse stories</Button>
          </Link>
          <Link to="/write">
            <Button>Start writing</Button>
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-primary/8 bg-surface/50">
          <h2 className="font-display text-2xl font-semibold text-neutral-heading mb-2">No stories yet</h2>
          <p className="text-neutral-body/60 mb-6">Be the first to share something worth reading.</p>
          <Link to="/write"><Button>Write the first story</Button></Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          <div className="space-y-10">
            {heroBlog && <HeroPost blog={heroBlog} />}
            {gridBlogs.length > 0 && (
              <>
                <div className="flex items-center gap-4">
                  <h2 className="font-display text-xl font-semibold text-neutral-heading shrink-0">
                    Latest stories
                  </h2>
                  <div className="divider-fade flex-1" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridBlogs.map((blog) => (
                    <PostCard key={blog._id} blog={blog} />
                  ))}
                </div>
              </>
            )}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-neutral-body/55 tabular-nums">
                  Page {page} of {pages}
                </span>
                <Button variant="outline" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            )}
          </div>
          <CategorySidebar categories={meta.categories} tags={meta.tags} />
        </div>
      )}
    </div>
  );
}
