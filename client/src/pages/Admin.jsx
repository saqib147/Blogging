import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
  deleteAdminUser,
  getAdminBlogs,
  updateAdminBlogStatus,
  deleteAdminBlog,
  getAdminComments,
  deleteAdminComment,
} from '../api/admin';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-5 flex flex-col gap-2 border border-accent/40 bg-surface/80 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}
        >
          {icon}
        </div>
        {sub != null && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            +{sub} this week
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-heading tabular-nums">
          {value?.toLocaleString() ?? '—'}
        </p>
        <p className="text-xs text-neutral-body/55 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

function DeleteButton({ onConfirm, label = 'Delete' }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => { setConfirming(false); onConfirm(); }}
          className="text-xs px-2 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-1 rounded border border-neutral-body/15 text-neutral-body/60"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-xs px-2.5 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 font-medium"
    >
      {label}
    </button>
  );
}

const TABS = [
  { id: 'users', label: 'Users', icon: '👥' },
  { id: 'blogs', label: 'Blogs', icon: '📝' },
  { id: 'comments', label: 'Comments', icon: '💬' },
];

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    setLoadingData(true);
    setSearch('');

    const fetchers = {
      users: getAdminUsers,
      blogs: getAdminBlogs,
      comments: getAdminComments,
    };

    fetchers[activeTab]()
      .then(({ data }) => {
        if (activeTab === 'users') setUsers(data);
        else if (activeTab === 'blogs') setBlogs(data);
        else setComments(data);
      })
      .catch(() => toast.error(`Failed to load ${activeTab}`))
      .finally(() => setLoadingData(false));
  }, [activeTab]);

  const refreshStats = () => {
    getAdminStats().then(({ data }) => setStats(data)).catch(() => {});
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteAdminUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      refreshStats();
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      const { data } = await updateAdminUserRole(id, role);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: data.role } : u)));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Role update failed');
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteAdminBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      refreshStats();
      toast.success('Blog deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { data } = await updateAdminBlogStatus(id, status);
      setBlogs((prev) => prev.map((b) => (b._id === id ? data : b)));
      refreshStats();
      toast.success(`Post ${status === 'published' ? 'published' : 'moved to drafts'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteAdminComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      refreshStats();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const q = search.toLowerCase();
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      (b.author?.name || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q)
  );
  const filteredComments = comments.filter(
    (c) =>
      c.text.toLowerCase().includes(q) ||
      (c.author?.name || '').toLowerCase().includes(q) ||
      (c.blogId?.title || '').toLowerCase().includes(q)
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers, icon: '👥', accent: 'var(--primary)', sub: stats?.newUsersWeek },
    { label: 'Published Posts', value: stats?.publishedBlogs, icon: '📝', accent: 'var(--secondary)', sub: stats?.newBlogsWeek },
    { label: 'Drafts', value: stats?.draftBlogs, icon: '🗒️', accent: 'var(--tertiary)' },
    { label: 'Comments', value: stats?.totalComments, icon: '💬', accent: '#0891b2' },
    { label: 'Total Likes', value: stats?.totalLikes, icon: '♥', accent: '#e11d48' },
    { label: 'Bookmarks', value: stats?.totalBookmarks, icon: '★', accent: '#059669' },
  ];

  const tabCount = {
    users: stats?.totalUsers,
    blogs: stats?.totalBlogs,
    comments: stats?.totalComments,
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">⚙️</span>
            <h1 className="text-3xl font-bold text-neutral-heading">Admin Dashboard</h1>
          </div>
          <p className="text-neutral-body/55 text-sm ml-11">
            Logged in as <span className="font-semibold text-neutral-heading">{user?.name}</span>
            {' · '}
            <span className="text-primary font-medium">Administrator</span>
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-body/40 mb-4">
            Platform Overview
          </h2>
          {loadingStats ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          )}
        </section>

        <section
          className="rounded-2xl overflow-hidden bg-surface/90 border border-accent shadow-card"
        >
          <div className="flex gap-0 border-b border-neutral-body/8 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/3'
                    : 'border-transparent text-neutral-body/50 hover:text-neutral-heading'
                }`}
              >
                {tab.icon} {tab.label}
                {tabCount[tab.id] != null && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {tabCount[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 border-b border-neutral-body/6">
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-body/35 text-sm">🔍</span>
              <input
                type="text"
                placeholder={
                  activeTab === 'users'
                    ? 'Search by name or email…'
                    : activeTab === 'blogs'
                      ? 'Search by title, author, or category…'
                      : 'Search comments, authors, or posts…'
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border border-neutral-body/15 bg-background"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loadingData ? (
              <div className="flex justify-center py-16"><Spinner /></div>
            ) : activeTab === 'users' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-heading/3 border-b border-neutral-body/8">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Posts</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Joined</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-body/5">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-neutral-body/40">No users found.</td></tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-heading/2">
                      <td className="px-6 py-3.5">
                        <Link to={`/profile/${u._id}`} className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={u.name} size="sm" />
                          <span className="font-medium text-neutral-heading">{u.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-body/60">{u.email}</td>
                      <td className="px-6 py-3.5">
                        {u._id === user?._id ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            admin
                          </span>
                        ) : (
                          <select
                            value={u.role || 'user'}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className="text-xs border border-neutral-body/15 rounded px-2 py-1 bg-surface"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-neutral-body/60">{u.postsCount ?? 0}</td>
                      <td className="px-6 py-3.5 text-neutral-body/50">
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {u._id !== user?._id ? (
                          <DeleteButton onConfirm={() => handleDeleteUser(u._id)} />
                        ) : (
                          <span className="text-xs text-neutral-body/30 italic">You</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'blogs' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-heading/3 border-b border-neutral-body/8">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Author</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Category</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Likes</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Date</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-body/5">
                  {filteredBlogs.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-neutral-body/40">No blogs found.</td></tr>
                  ) : filteredBlogs.map((b) => (
                    <tr key={b._id} className="hover:bg-neutral-heading/2">
                      <td className="px-6 py-3.5 max-w-[220px]">
                        <Link to={`/blog/${b._id}`} className="font-medium text-neutral-heading hover:text-primary line-clamp-2">
                          {b.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5">
                        <Link to={`/profile/${b.author?._id}`} className="flex items-center gap-2">
                          <Avatar src={b.author?.avatar} name={b.author?.name} size="sm" />
                          <span className="text-neutral-body/70 text-xs">{b.author?.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-body/55">{b.category || '—'}</td>
                      <td className="px-6 py-3.5">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`text-xs border rounded px-2 py-1 bg-surface ${
                            b.status === 'published'
                              ? 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'border-secondary/20 text-secondary bg-secondary/5'
                          }`}
                        >
                          <option value="published">published</option>
                          <option value="draft">draft</option>
                        </select>
                      </td>
                      <td className="px-6 py-3.5 tabular-nums text-neutral-body/55">{b.likes?.length ?? 0}</td>
                      <td className="px-6 py-3.5 text-neutral-body/50">
                        {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <DeleteButton onConfirm={() => handleDeleteBlog(b._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-heading/3 border-b border-neutral-body/8">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Comment</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Author</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Post</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-body/45">Date</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-body/5">
                  {filteredComments.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-neutral-body/40">No comments found.</td></tr>
                  ) : filteredComments.map((c) => (
                    <tr key={c._id} className="hover:bg-neutral-heading/2">
                      <td className="px-6 py-3.5 max-w-xs">
                        <p className="line-clamp-2 text-neutral-body">{c.text}</p>
                        {c.parentComment && (
                          <span className="text-[10px] text-neutral-body/40 uppercase tracking-wide">Reply</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <Avatar src={c.author?.avatar} name={c.author?.name} size="sm" />
                          <span className="text-xs text-neutral-body/70">{c.author?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 max-w-[180px]">
                        {c.blogId?._id ? (
                          <Link to={`/blog/${c.blogId._id}`} className="text-xs text-primary hover:underline line-clamp-2">
                            {c.blogId.title}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-neutral-body/50 text-xs">
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <DeleteButton onConfirm={() => handleDeleteComment(c._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loadingData && (
            <div className="px-6 py-3 border-t border-neutral-body/6 text-xs text-neutral-body/40">
              {activeTab === 'users' && `Showing ${filteredUsers.length} of ${users.length} users`}
              {activeTab === 'blogs' && `Showing ${filteredBlogs.length} of ${blogs.length} blogs`}
              {activeTab === 'comments' && `Showing ${filteredComments.length} of ${comments.length} comments`}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
