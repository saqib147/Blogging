import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Tag from '../ui/Tag';

export default function CategorySidebar({
  categories = [],
  tags = [],
  activeCategory,
  activeTags = [],
  onCategorySelect,
  onTagToggle,
  onClearTags,
}) {
  const isInteractive = Boolean(onCategorySelect || onTagToggle);

  return (
    <aside className="space-y-6">
      {categories.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-body/45">
              Categories
            </h3>
            {isInteractive && activeCategory && (
              <button
                type="button"
                onClick={() => onCategorySelect?.(null)}
                className="text-xs text-neutral-body/50 hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {categories.map(({ name, count }) =>
              isInteractive ? (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => onCategorySelect?.(activeCategory === name ? null : name)}
                    className={`flex w-full justify-between text-sm transition-colors text-left ${
                      activeCategory === name
                        ? 'text-primary font-medium'
                        : 'text-neutral-body/70 hover:text-primary'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-neutral-body/40">{count}</span>
                  </button>
                </li>
              ) : (
                <li key={name}>
                  <Link
                    to={`/search?category=${encodeURIComponent(name)}`}
                    className={`flex justify-between text-sm transition-colors ${
                      activeCategory === name
                        ? 'text-primary font-medium'
                        : 'text-neutral-body/70 hover:text-primary'
                    }`}
                  >
                    <span>{name}</span>
                    <span className="text-neutral-body/40">{count}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </Card>
      )}

      {tags.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-body/45">
              Popular Tags
            </h3>
            {isInteractive && activeTags.length > 0 && (
              <button
                type="button"
                onClick={() => onClearTags?.()}
                className="text-xs text-neutral-body/50 hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ name }) =>
              isInteractive ? (
                <Tag
                  key={name}
                  label={name}
                  onClick={() => onTagToggle?.(name)}
                  active={activeTags.includes(name)}
                />
              ) : (
                <Tag
                  key={name}
                  label={name}
                  to={`/search?tag=${encodeURIComponent(name)}`}
                  active={activeTags.includes(name)}
                />
              )
            )}
          </div>
          {isInteractive && activeTags.length > 1 && (
            <p className="text-xs text-neutral-body/45 mt-3">
              Showing posts matching all selected tags.
            </p>
          )}
        </Card>
      )}
    </aside>
  );
}
