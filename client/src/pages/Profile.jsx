import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getUserProfile,
  getUserPosts,
  getUserLikedPosts,
  getUserBookmarkedPosts,
  getUserFollowers,
  getUserFollowing,
  followUser,
  unfollowUser,
  updateUserProfile,
  uploadImage,
} from '../api/users';
import { useAuth } from '../hooks/useAuth';
import Avatar from '../components/ui/Avatar';
import PostCard from '../components/blog/PostCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

// ─── User Card (for Followers / Following lists) ──────────────────────────────
function UserCard({ person, currentUserId, onFollowToggle }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSelf = currentUserId && currentUserId === person._id;

  const handleToggle = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(person._id);
        setFollowing(false);
      } else {
        await followUser(person._id);
        setFollowing(true);
      }
      if (onFollowToggle) onFollowToggle();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-accent bg-surface/60 hover:bg-surface transition-colors">
      <Link to={`/profile/${person._id}`} className="shrink-0">
        <Avatar src={person.avatar} name={person.name} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${person._id}`}
          className="font-semibold text-neutral-heading hover:text-primary transition-colors truncate block"
        >
          {person.name}
        </Link>
        {person.bio && (
          <p className="text-xs text-neutral-body/60 mt-0.5 line-clamp-2">{person.bio}</p>
        )}
      </div>
      {!isSelf && currentUserId && (
        <Button
          variant={following ? 'ghost' : 'primary'}
          className="shrink-0 text-xs px-3 py-1.5"
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? '…' : following ? 'Unfollow' : 'Follow'}
        </Button>
      )}
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const POST_TABS = [
  { id: 'published', label: 'Published', ownerOnly: false },
  { id: 'liked', label: 'Liked', ownerOnly: true },
  { id: 'saved', label: 'Saved', ownerOnly: true },
];
const PEOPLE_TABS = [
  { id: 'followers', label: 'Followers' },
  { id: 'following', label: 'Following' },
];

// ─── Main Profile component ───────────────────────────────────────────────────
export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?._id === id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [activeTab, setActiveTab] = useState('published');
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', avatar: '' });
  const [saving, setSaving] = useState(false);

  // Fetch profile header
  const fetchProfile = useCallback(() => {
    return getUserProfile(id)
      .then(({ data }) => {
        setProfile(data);
        setFollowing(data.isFollowing);
        setEditForm({ name: data.name, bio: data.bio || '', avatar: data.avatar || '' });
      })
      .catch(() => toast.error('Profile not found'));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  // Fetch tab content whenever the active tab or profile changes
  useEffect(() => {
    if (!profile) return;
    const isPeopleTab = activeTab === 'followers' || activeTab === 'following';

    setTabLoading(true);
    setPosts([]);
    setPeople([]);

    if (isPeopleTab) {
      const fetcher = activeTab === 'followers' ? getUserFollowers : getUserFollowing;
      fetcher(id)
        .then(({ data }) => setPeople(data))
        .catch(() => setPeople([]))
        .finally(() => setTabLoading(false));
    } else {
      // owner-only tabs guard
      if ((activeTab === 'liked' || activeTab === 'saved') && !isOwner) {
        setTabLoading(false);
        return;
      }
      const fetchers = {
        published: () => getUserPosts(id),
        liked: () => getUserLikedPosts(id),
        saved: () => getUserBookmarkedPosts(id),
      };
      fetchers[activeTab]()
        .then(({ data }) => setPosts(data))
        .catch(() => setPosts([]))
        .finally(() => setTabLoading(false));
    }
  }, [id, activeTab, profile, isOwner]);

  // Follow / Unfollow toggle
  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setFollowLoading(true);
    try {
      const api = following ? unfollowUser : followUser;
      const { data } = await api(id);
      setFollowing(data.isFollowing);
      setProfile((prev) => ({ ...prev, followersCount: data.followersCount }));
      toast.success(data.isFollowing ? 'Following!' : 'Unfollowed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setFollowLoading(false);
    }
  };

  // Profile edit save
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await updateUserProfile(id, editForm);
      setProfile((prev) => ({ ...prev, ...data }));
      setEditing(false);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data } = await uploadImage(file);
      setEditForm((prev) => ({ ...prev, avatar: data.url }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20 text-neutral-body/60">Profile not found.</div>;
  }

  const visiblePostTabs = POST_TABS.filter((t) => !t.ownerOnly || isOwner);
  const isPeopleTab = activeTab === 'followers' || activeTab === 'following';

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-8">

      {/* ── Profile Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <Avatar src={profile.avatar} name={profile.name} size="lg" />

        <div className="flex-1">
          {editing ? (
            <div className="space-y-3 max-w-md">
              <Input
                id="edit-name"
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <Input
                id="edit-bio"
                label="Bio"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-1">Avatar</label>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-neutral-body/70" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={saving}>Save</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-neutral-heading">{profile.name}</h1>

                {/* Follow / Unfollow button — only visible to other logged-in users */}
                {currentUser && !isOwner && (
                  <Button
                    variant={following ? 'ghost' : 'primary'}
                    className="text-sm px-4 py-1.5"
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                  >
                    {followLoading ? '…' : following ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>

              {profile.bio && (
                <p className="text-neutral-body/70 mt-2 max-w-lg">{profile.bio}</p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-1 mt-3 text-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab('published')}
                  className="px-3 py-1 rounded-full hover:bg-primary/8 transition-colors text-neutral-body/70 hover:text-primary"
                >
                  <span className="font-semibold text-neutral-heading">{profile.postsCount}</span>
                  {' '}posts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('followers')}
                  className={`px-3 py-1 rounded-full transition-colors ${activeTab === 'followers'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-primary/8 text-neutral-body/70 hover:text-primary'
                    }`}
                >
                  <span className="font-semibold text-neutral-heading">{profile.followersCount}</span>
                  {' '}followers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('following')}
                  className={`px-3 py-1 rounded-full transition-colors ${activeTab === 'following'
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-primary/8 text-neutral-body/70 hover:text-primary'
                    }`}
                >
                  <span className="font-semibold text-neutral-heading">{profile.followingCount}</span>
                  {' '}following
                </button>
              </div>

              {isOwner && (
                <Button variant="outline" className="mt-4 text-sm" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────── */}
      <div className="border-b border-accent mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {visiblePostTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-body/60 hover:text-neutral-heading'
                }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Divider between post tabs and people tabs */}
          <div className="mx-2 self-center h-4 w-px bg-accent" />

          {PEOPLE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-neutral-body/60 hover:text-neutral-heading'
                }`}
            >
              {tab.label}
              {tab.id === 'followers' && (
                <span className="ml-1.5 text-xs bg-accent text-neutral-body/60 px-1.5 py-0.5 rounded-full">
                  {profile.followersCount}
                </span>
              )}
              {tab.id === 'following' && (
                <span className="ml-1.5 text-xs bg-accent text-neutral-body/60 px-1.5 py-0.5 rounded-full">
                  {profile.followingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────── */}
      {tabLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : isPeopleTab ? (
        /* Followers / Following list */
        people.length === 0 ? (
          <div className="text-center py-16 text-neutral-body/50">
            {activeTab === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {people.map((person) => (
              <UserCard
                key={person._id}
                person={person}
                currentUserId={currentUser?._id}
                onFollowToggle={fetchProfile}
              />
            ))}
          </div>
        )
      ) : (
        /* Post tabs */
        posts.length === 0 ? (
          <p className="text-neutral-body/50 text-center py-12">No posts in this tab yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((blog) => (
              <PostCard key={blog._id} blog={blog} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

