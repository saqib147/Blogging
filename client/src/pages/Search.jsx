import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBlogs, getCategoriesAndTags } from '../api/blogs';
import { useDebounce } from '../hooks/useDebounce';
import PostCard from '../components/blog/PostCard';
import CategorySidebar from '../components/blog/CategorySidebar';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-sm bg-primary/5 text-primary border border-primary/15">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-primary/60 hover:text-primary font-bold leading-none"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'popular', label: 'Most liked' },
  { value: 'title', label: 'Title (A–Z)' },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [meta, setMeta] = useState({ categories: [], tags: [] });
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const debouncedQuery = useDebounce(query);
  const category = searchParams.get('category') || '';
  const activeTags = searchParams.getAll('tag');
  const sort = searchParams.get('sort') || 'newest';

  const updateParams = useCallback(
    (mutate) => {
      const params = new URLSearchParams(searchParams);
      mutate(params);
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    getCategoriesAndTags().then(({ data }) => setMeta(data)).catch(() => { });
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 20, sort };
    if (debouncedQuery) params.search = debouncedQuery;
    if (category) params.category = category;
    if (activeTags.length > 0) params.tags = activeTags.join(',');

    getBlogs(params)
      .then(({ data }) => {
        setBlogs(data.blogs);
        setTotal(data.total);
      })
      .catch(() => {
        setBlogs([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, category, activeTags.join(','), sort]);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    updateParams((params) => {
      if (e.target.value) params.set('search', e.target.value);
      else params.delete('search');
    });
  };

  const toggleTag = (tagName) => {
    updateParams((params) => {
      const tags = params.getAll('tag');
      params.delete('tag');
      if (tags.includes(tagName)) {
        tags.filter((t) => t !== tagName).forEach((t) => params.append('tag', t));
      } else {
        [...tags, tagName].forEach((t) => params.append('tag', t));
      }
    });
  };

  const removeTag = (tagName) => {
    updateParams((params) => {
      const tags = params.getAll('tag').filter((t) => t !== tagName);
      params.delete('tag');
      tags.forEach((t) => params.append('tag', t));
    });
  };

  const setCategory = (name) => {
    updateParams((params) => {
      if (name) params.set('category', name);
      else params.delete('category');
    });
  };

  const setSort = (value) => {
    updateParams((params) => {
      if (value && value !== 'newest') params.set('sort', value);
      else params.delete('sort');
    });
  };

  const clearTags = () => {
    updateParams((params) => params.delete('tag'));
  };

  const clearAllFilters = () => {
    setQuery('');
    setSearchParams({});
  };

  const hasFilters = Boolean(debouncedQuery || category || activeTags.length > 0 || sort !== 'newest');

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-neutral-heading">Search Stories</h1>
        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-sm text-neutral-body/60 whitespace-nowrap">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-neutral-body/15 rounded-sm px-3 py-2 bg-surface text-neutral-heading focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8">
        <div>
          <Input
            id="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search by title or content..."
            className="mb-4"
          />

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {debouncedQuery && (
                <FilterChip
                  label={`Search: "${debouncedQuery}"`}
                  onRemove={() => {
                    setQuery('');
                    updateParams((p) => p.delete('search'));
                  }}
                />
              )}
              {category && (
                <FilterChip label={`Category: ${category}`} onRemove={() => setCategory(null)} />
              )}
              {activeTags.map((t) => (
                <FilterChip key={t} label={`Tag: ${t}`} onRemove={() => removeTag(t)} />
              ))}
              {sort !== 'newest' && (
                <FilterChip
                  label={`Sort: ${SORT_OPTIONS.find((o) => o.value === sort)?.label}`}
                  onRemove={() => setSort('newest')}
                />
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-neutral-body/50 hover:text-primary underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {!loading && (
            <p className="text-sm text-neutral-body/50 mb-4">
              {total} {total === 1 ? 'result' : 'results'}
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-body/50 mb-2">No stories found.</p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <PostCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>

        <CategorySidebar
          categories={meta.categories}
          tags={meta.tags}
          activeCategory={category}
          activeTags={activeTags}
          onCategorySelect={setCategory}
          onTagToggle={toggleTag}
          onClearTags={clearTags}
        />
      </div>
    </div>
  );
}
