import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { fetchPosts, createPost, uploadFile, deletePost } from './api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'notes', tags: '', jobLink: '', content: '', file: null, jobDescription: '' });
  // const [likedPosts, setLikedPosts] = useState([]); // Removed unused variable
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [commentsModalPost, setCommentsModalPost] = useState(null);
  const modalRef = useRef();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch posts only once on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    fetchPosts(token)
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        toast.error('Failed to fetch posts');
      });
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const initialLikes = {};
      const initialLiked = {};
      posts.forEach(post => {
        initialLikes[post._id || post.id] = post.likes || 0;
        initialLiked[post._id || post.id] = false;
      });
      setLikes(initialLikes);
      setLiked(initialLiked);
    }
  }, [posts]);

  // Fetch current user info (assume JWT in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ _id: payload.userId, name: payload.name, email: payload.email });
      } catch {}
    }
  }, []);

  // Memoized search and filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesType = filter === 'all' || post.type === filter;
      const matchesSearch =
        post.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (post.tags && post.tags.join(' ').toLowerCase().includes(debouncedSearch.toLowerCase())) ||
        (post.author && post.author.name && post.author.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [posts, filter, debouncedSearch]);

  const handleCreatePost = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    let postData = { ...form };
    try {
      if (form.type === 'notes' && form.file) {
        // Validate PDF
        if (!form.file.type || form.file.type !== 'application/pdf') {
          toast.error('Only PDF files are allowed for notes.');
          return;
        }
        // Upload PDF
        const uploadRes = await uploadFile(form.file, token);
        postData.fileUrl = uploadRes.url;
      }
      if (form.type === 'notes') {
        postData.tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      }
      if (form.type === 'jobs') {
        postData.description = form.jobDescription;
      }
      const newPost = await createPost(postData, token);
      toast.success('Post created!');
      setShowModal(false);
      setForm({ title: '', type: 'notes', tags: '', jobLink: '', content: '', file: null, jobDescription: '' });
      // Optimistically add the new post to the list instead of refetching
      setPosts(prevPosts => [newPost, ...prevPosts]);
    } catch (err) {
      toast.error('Failed to create post');
    }
  }, [form]);

  const handleLike = useCallback((postId) => {
    setLikes(likes => ({
      ...likes,
      [postId]: liked[postId] ? Math.max((likes[postId] || 0) - 1, 0) : (likes[postId] || 0) + 1
    }));
    setLiked(liked => ({
      ...liked,
      [postId]: !liked[postId]
    }));
  }, [liked]);

  // Delete post logic
  const handleDeletePost = useCallback(async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await deletePost(postId, token);
      setPosts(posts => posts.filter(p => (p._id || p.id) !== postId));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  }, []);

  // Helper to check if current user is the owner of a post
  function isPostOwner(post, currentUser) {
    if (!currentUser) return false;
    const authorId = typeof post.author === 'object'
      ? post.author._id || post.author.id
      : post.author;
    return authorId && authorId.toString() === currentUser._id?.toString();
  }

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen flex flex-col items-center justify-start">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-primary-900 dark:text-neutral-100">Posts</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all"
          onClick={() => setShowModal(true)}
        >
          Add New Post
        </button>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          className="flex-1 rounded-full px-5 py-2 bg-neutral-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search by title, tags, or username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="rounded-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="notes">Notes</option>
          <option value="jobs">Jobs</option>
          <option value="threads">Threads</option>
        </select>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleCreatePost} className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 flex flex-col gap-5" encType="multipart/form-data">
            <h3 className="text-2xl font-extrabold mb-2 text-primary-900 dark:text-neutral-100 text-center">Create Post</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                placeholder="Title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <select
                className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value, file: null }))}
              >
                <option value="notes">Notes</option>
                <option value="jobs">Jobs</option>
                <option value="threads">Threads</option>
              </select>
              {form.type === 'notes' && (
                <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <input
                    type="text"
                    className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
                    required
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Only PDF files allowed</span>
                </div>
              )}
              {form.type === 'jobs' && (
                <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <input
                    type="url"
                    className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    placeholder="Job Link (URL)"
                    value={form.jobLink}
                    onChange={e => setForm(f => ({ ...f, jobLink: e.target.value }))}
                    required
                  />
                  <textarea
                    className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    placeholder="Job Description"
                    value={form.jobDescription}
                    onChange={e => setForm(f => ({ ...f, jobDescription: e.target.value }))}
                    required
                  />
                </div>
              )}
              {form.type === 'threads' && (
                <div className="flex flex-col gap-3 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <textarea
                    className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                    placeholder="Thread content..."
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    required
                  />
          </div>
              )}
          </div>
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" className="px-5 py-2 rounded-lg dark:text-gray-200 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-all font-semibold" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-semibold transition-all">Create</button>
          </div>
          </form>
        </div>
      )}
      <div className="w-full flex flex-col gap-6 mt-2">
        {filteredPosts.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center">No posts found.</div>
        ) : (
          filteredPosts.map(post => {
            const ownerCheck = isPostOwner(post, currentUser);
            console.log('POST DEBUG:', {
              postId: post._id || post.id,
              postAuthor: post.author,
              currentUser,
              isOwner: ownerCheck
            });
            return (
            <PostCard
              key={post._id || post.id}
              post={post}
              likes={likes[post._id || post.id] || 0}
              liked={liked[post._id || post.id]}
              onLike={() => handleLike(post._id || post.id)}
                isOwner={ownerCheck}
              onDelete={() => handleDeletePost(post._id || post.id)}
                currentUser={currentUser}
                setCommentsModalPost={setCommentsModalPost}
            />
            );
          })
        )}
      </div>
      {commentsModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div ref={modalRef} className="relative bg-neutral-900 dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-900">
            <button
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none"
              onClick={() => setCommentsModalPost(null)}
              title="Close"
              aria-label="Close comments"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-200">
              Discussion
              <span className="ml-2 text-base text-blue-400 font-normal">(
                {Array.isArray(commentsModalPost.comments) ? commentsModalPost.comments.length : ''} comments)
              </span>
            </h3>
            <ThreadComments postId={commentsModalPost._id || commentsModalPost.id} currentUser={currentUser} />
          </div>
        </div>
      )}
      <ToastContainer />
          </div>
  );
}

// --- ThreadComments component for nested replies ---
function ThreadComments({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const inputRef = useRef(null);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch comments');
        return res.json();
      })
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, loading]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Render comments in a compact, clean style
  function renderComments(comments) {
    return comments.map(comment => {
      const name = comment.user?.name && comment.user.name.trim() ? comment.user.name : 'User';
      const isOwn = currentUser && comment.user && (comment.user._id === currentUser._id || comment.user._id?.toString() === currentUser._id?.toString());
      return (
        <div
          key={comment._id}
          className={`mb-2 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col transition-colors
            ${isOwn ? 'bg-blue-100 dark:bg-blue-900' : 'bg-neutral-50 dark:bg-neutral-800'}`}
        >
          <span className="font-bold text-blue-700 dark:text-blue-300">{name}:</span>
          <span className="text-gray-900 dark:text-gray-100">{comment.text}</span>
        </div>
      );
    });
  }

  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentError('');
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: (() => {
          const form = new FormData();
          form.append('text', newComment);
          return form;
        })()
      });
      if (!res.ok) throw new Error('Failed to comment');
      const updatedComments = await res.json();
      setComments(updatedComments);
      setNewComment('');
    } catch (err) {
      setCommentError('Failed to add comment.');
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full justify-end">
      <hr className="border-neutral-700 mb-2" />
      {loading ? <div>Loading comments...</div> : (
        comments.length === 0 ? <div className="text-gray-500 text-sm">No comments yet. Be the first to comment!</div> :
        <div className="flex flex-col gap-1 max-h-[55vh] overflow-y-auto pr-2" style={{ flexGrow: 1 }}>
          {renderComments(comments)}
          <div ref={commentsEndRef} />
        </div>
      )}
      <form onSubmit={handleAddComment} className="mt-4 flex flex-col gap-2">
        <input ref={inputRef} className="border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." required />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow self-start transition-all">Post</button>
        {commentError && <div className="text-xs text-red-500">{commentError}</div>}
      </form>
    </div>
  );
}

function PostCard({ post, likes = 0, liked = false, onLike, isOwner = false, onDelete, currentUser, setCommentsModalPost }) {
  // Download handler for notes - removed unused function

  // Card for each post type
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border-2 border-blue-100 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 p-7 flex flex-col gap-4 cursor-pointer relative group">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs px-3 py-1 rounded-full font-bold tracking-wide bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow group-hover:from-blue-500 group-hover:to-blue-700 transition-all">{post.type.charAt(0).toUpperCase() + post.type.slice(1)}</span>
        <span className="font-extrabold text-xl text-gray-900 dark:text-gray-100">{post.title}</span>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 font-medium">by {post.author?.name || 'User'}</span>
        {isOwner && (
          <>
            <button onClick={onDelete} className="ml-2 px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-all">Delete</button>
            {/* <button className="ml-1 px-2 py-1 text-xs rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-all">Edit</button> */}
          </>
        )}
          </div>
      {post.type === 'notes' && (
        <div className="flex flex-col gap-2 items-start">
          <div className="flex gap-2 flex-wrap mb-1">
            {post.tags && post.tags.map((tag, i) => (
              <span key={i} className="bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 px-3 py-0.5 rounded-full text-xs font-semibold shadow">{tag}</span>
            ))}
          </div>
          {post.fileUrl && (
            <a
              href={`/api/posts/pdf-proxy/${encodeURIComponent(post.fileUrl ? post.fileUrl.split('/').pop() : (post.title ? post.title.replace(/\s+/g, '_') + '.pdf' : 'download.pdf'))}`}
              download={post.title ? post.title.replace(/\s+/g, '_') + '.pdf' : 'download.pdf'}
               className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full font-semibold transition-all text-sm mt-2"
              title="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
              </svg>
              Download
            </a>
          )}
        </div>
      )}
      {post.type === 'jobs' && (
        <div className="flex flex-col gap-2 items-start">
          {post.jobLink && (
            <a href={post.jobLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-full font-semibold transition-all text-sm mt-2" title="View Job Opening">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346-2.07A2 2 0 0012.416 5.5h-1.832a2 2 0 00-1.978 1.43L8.26 9m6.48 0l.346 2.07A2 2 0 0111.584 14.5h1.832a2 2 0 001.978-1.43L15.74 9m-6.48 0H6.5m11 0h-1.26m-7.48 0a2 2 0 01-1.978-1.43L6.26 9m0 0l-.346-2.07A2 2 0 017.584 5.5h1.832a2 2 0 011.978 1.43L8.26 9z" />
              </svg>
              View Job Opening
            </a>
          )}
          {post.description && (
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-1">{post.description}</div>
          )}
          {post.referral && (
            <div className="text-xs text-gray-600 dark:text-gray-400">Referral: {post.referral}</div>
          )}
          </div>
      )}
      {post.type === 'threads' && (
        <div className="flex flex-col gap-2">
          <div className="text-base text-gray-700 dark:text-gray-200 mb-1">{post.content || 'Discuss your engineering questions and get answers from peers across all branches!'}</div>
          <button className="text-xs bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-full w-fit mt-2" onClick={() => setCommentsModalPost(post)}>
            Comments
          </button>
          </div>
      )}
      {/* Like and comment count row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {post.type !== 'threads' && <span>0 comments</span>}
        </div>
        <button onClick={onLike} className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold shadow transition-all text-xs ${liked ? 'bg-pink-500 text-white' : 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200 hover:bg-pink-200 dark:hover:bg-pink-800'}`} title={liked ? 'Unlike' : 'Like'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>{likes}</span>
        </button>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 absolute bottom-2 right-4">Posted on {new Date(post.createdAt).toLocaleString()}</div>
    </div>
  );
} 