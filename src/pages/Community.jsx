import React, { useState } from 'react';
import Card from '../components/common/Card';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';

function Community() {
  const [posts] = useState([
    {
      id: 1,
      author: 'Priya Singh',
      avatar: 'https://via.placeholder.com/48',
      content: 'Just completed the Spiti Valley trek! Amazing experience with an incredible group. #WravelerForLife',
      image: 'https://via.placeholder.com/400x300',
      likes: 342,
      comments: 28,
      timestamp: '2 days ago',
    },
    {
      id: 2,
      author: 'Rahul Patel',
      avatar: 'https://via.placeholder.com/48',
      content: 'Looking for travel buddies for Ladakh in February! Solo traveler here. Anyone interested?',
      likes: 156,
      comments: 42,
      timestamp: '1 day ago',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Community</h1>

        {/* Create Post */}
        <Card className="p-6 mb-8">
          <textarea
            placeholder="Share your travel story or find travel buddies..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-orange-500"
            rows="4"
          />
          <div className="mt-4 flex justify-end">
            <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              Post
            </button>
          </div>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <Card key={post.id} className="overflow-hidden">
              {/* Header */}
              <div className="p-6 flex items-center space-x-4 border-b">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{post.author}</h3>
                  <p className="text-sm text-gray-500">{post.timestamp}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t flex justify-around text-gray-600">
                <button className="flex items-center space-x-2 hover:text-orange-500 transition">
                  <FiHeart size={20} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-orange-500 transition">
                  <FiMessageCircle size={20} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-orange-500 transition">
                  <FiShare2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community;
