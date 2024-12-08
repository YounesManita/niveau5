"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const [postList, setPostList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/Login');
      return;
    }
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 5000); 
    
    return () => clearInterval(intervalId);
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/withcomment`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch posts');
      }
      setPostList(response.data);
      console.log(response.data);
      
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) {
      return;
    }

    try {
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        user_id: localStorage.getItem('iduser'),
      };
      const response = await axios.post(`http://localhost:5000/user/posts`, newPost);
      if (response.status === 200) {
        setSuccessMessage('Post added successfully!');
        fetchPosts(); 
        setNewPostTitle('');
        setNewPostContent('');

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addComment = async (postId: number) => {
    const commentText = comments[postId];
    if (commentText) {
      const newComment = {
        post_id: postId,
        user_id: localStorage.getItem('iduser'),
        comment: commentText,
      };

      try {
        const response = await axios.post(`http://localhost:5000/user/comments`, newComment);
        if (response.status === 200) {
          setComments((prev) => ({ ...prev, [postId]: '' })); 
          fetchPosts(); 
        }
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Posts</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      <div className="mb-6 border p-4 rounded-lg shadow-lg bg-white w-1/2 mx-auto">
        <form onSubmit={addPost}>
          <h2 className="text-2xl mb-4">Add a New Post</h2>
          <input
            type="text"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <textarea
            placeholder="Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Post
          </button>
        </form>
      </div>

      <h2 className="text-2xl mb-4 text-center">Post List</h2>
      <div className="w-1/2 mx-auto">
        {postList.map((post) => (
          <div key={post.post_id} className="border rounded-lg mb-6 p-4 bg-gray-50 shadow-md " style={{overflow:"auto"}}>
            <h3 className="font-bold text-xl mb-2">{post.title}</h3>
            <p className="mb-4">{post.content}</p>
            <p className="text-sm">
              <strong>Author:</strong> {post.post_author.prenom} {post.post_author.nom}
            </p>
            <div>
              <h4 className="font-semibold text-lg">Comments</h4>
              {post.comments.length > 0 ? (
                post.comments.map((comment: any) => (
                  <div key={comment.comment_id} className="ml-4 text-sm mb-2">
                    <strong>{comment.comment_author.prenom} {comment.comment_author.nom}:</strong> {comment.comment}
                  </div>
                ))
              ) : (
                <p className="ml-4 text-sm">No comments yet.</p>
              )}
              <input
                type="text"
                placeholder="Add a comment"
                value={comments[post.post_id] || ''}
                onChange={(e) => setComments((prev) => ({ ...prev, [post.post_id]: e.target.value }))}
                className="border p-2 rounded w-full mb-2"
              />
              <button onClick={() => addComment(post.post_id)} className="bg-blue-500 text-white p-2 rounded">
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
