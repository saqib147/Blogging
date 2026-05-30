import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogById, createBlog, updateBlog } from '../api/blogs';
import { uploadImage } from '../api/users';
import TiptapEditor from '../components/editor/TiptapEditor';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Write() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getBlogById(id)
        .then(({ data }) => {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || '');
          setTags(data.tags?.join(', ') || '');
          setCoverImage(data.coverImage || '');
          setStatus(data.status);
        })
        .catch(() => {
          toast.error('Failed to load post');
          navigate('/write');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setCoverImage(data.url);
      toast.success('Cover image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (saveStatus) => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      content,
      category: category.trim(),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      coverImage,
      status: saveStatus,
    };

    try {
      if (isEdit) {
        await updateBlog(id, payload);
        toast.success('Post updated');
        navigate(`/blog/${id}`);
      } else {
        const { data } = await createBlog(payload);
        toast.success(saveStatus === 'published' ? 'Post published!' : 'Draft saved');
        navigate(`/blog/${data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-reading mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-neutral-heading mb-6">
        {isEdit ? 'Edit Story' : 'Write a Story'}
      </h1>

      <div className="space-y-5">
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your story a title"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            id="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Technology"
          />
          <Input
            id="tags"
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-heading mb-1">
            Cover Image
          </label>
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-full max-h-48 object-cover rounded-md mb-2" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={uploading}
            className="text-sm text-neutral-body/70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-heading mb-1">
            Content
          </label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={() => handleSave('published')} disabled={saving}>
            {saving ? 'Saving...' : 'Publish'}
          </Button>
          <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>
            Save Draft
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
