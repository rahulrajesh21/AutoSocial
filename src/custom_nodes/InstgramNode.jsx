// InstagramNode.jsx
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Instagram,
  Send,
  MessageCircle,
  Image,
  Video,
  Users,
  Heart,
  Eye,
  Settings,
  Download,
  Upload,
  Bell,
  UserPlus,
  BarChart3,
  ChevronDown,
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getInstagramPosts } from '../utils/api';

// Instagram node options
const instagramOptions = [
  {
    id: 'send-message',
    title: 'Send Message',
    description: 'Send text messages, images, or media to Instagram users via Instagram Messaging API',
    icon: Send,
    color: 'text-blue-500',
    bgColor: 'bg-gradient-to-br from-blue-800 to-blue-900'
  },
  {
    id: 'receive-message',
    title: 'Receive Message',
    description: 'Listen for incoming messages from Instagram users and process webhook events',
    icon: MessageCircle,
    color: 'text-green-500',
    bgColor: 'bg-gradient-to-br from-green-800 to-green-900'
  },
  {
    id: 'send-media',
    title: 'Send Media',
    description: 'Send photos, videos, stories, or carousel posts to Instagram Business accounts',
    icon: Image,
    color: 'text-purple-500',
    bgColor: 'bg-gradient-to-br from-purple-800 to-purple-900'
  },
  {
    id: 'reply-comment',
    title: 'Reply Comment',
    description: 'Reply to comments on Instagram posts',
    icon: MessageCircle,
    color: 'text-cyan-500',
    bgColor: 'bg-gradient-to-br from-cyan-800 to-cyan-900',
    requiresPostSelection: false
  },
  {
    id: 'post-content',
    title: 'Post Content',
    description: 'Create and publish posts, stories, reels to Instagram Business accounts',
    icon: Upload,
    color: 'text-pink-500',
    bgColor: 'bg-gradient-to-br from-pink-800 to-pink-900'
  },
  {
    id: 'get-comments',
    title: 'Get Comments',
    description: 'Retrieve comments from posts and manage comment interactions',
    icon: MessageCircle,
    color: 'text-yellow-500',
    bgColor: 'bg-gradient-to-br from-yellow-800 to-yellow-900',
    requiresPostSelection: true
  },
  {
    id: 'get-followers',
    title: 'Get Followers',
    description: 'Retrieve follower information and manage follower interactions',
    icon: Users,
    color: 'text-indigo-500',
    bgColor: 'bg-gradient-to-br from-indigo-800 to-indigo-900'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Get insights and analytics data from Instagram Business accounts',
    icon: BarChart3,
    color: 'text-orange-500',
    bgColor: 'bg-gradient-to-br from-orange-800 to-orange-900'
  }
];

// Post Selection Component
const PostSelectionModal = ({ isOpen, onClose, onSelect, currentSelection, posts, loading, onRefresh }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg p-4 w-[500px] max-w-full max-h-[600px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Select Instagram Post</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={onRefresh}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
              title="Refresh posts"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin text-blue-500" size={24} />
            <span className="ml-2 text-gray-300">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Instagram size={48} className="mx-auto mb-4 text-gray-600" />
            <p>No posts found</p>
            <button 
              onClick={onRefresh}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2">
            {posts.map((post) => {
              const isSelected = currentSelection === post.id;
              const caption = post.caption || 'No caption';
              const truncatedCaption = caption.length > 100 ? caption.substring(0, 100) + '...' : caption;
              
              return (
                <div
                  key={post.id}
                  onClick={() => onSelect(post)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-900/30' 
                      : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {post.media_type === 'IMAGE' && <Image size={20} className="text-green-400" />}
                      {post.media_type === 'VIDEO' && <Video size={20} className="text-blue-400" />}
                      {post.media_type === 'CAROUSEL_ALBUM' && <Images size={20} className="text-purple-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 font-mono">{post.media_type}</span>
                        {isSelected && <Check size={16} className="text-blue-500" />}
                        {post.permalink && (
                          <a 
                            href={post.permalink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      {post.username && (
                        <p className="text-xs text-blue-300 mb-1">@{post.username}</p>
                      )}
                      <p className="text-white text-sm mb-1 break-words">{truncatedCaption}</p>
                      <p className="text-xs text-gray-500">ID: {post.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Options Modal Component
const InstagramOptionsModal = ({ isOpen, onClose, onSelect, currentSelection, nodePosition }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg p-4 w-96 max-w-full max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Select Instagram Action</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-2">
          {instagramOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = currentSelection === option.id;
            
            return (
              <div
                key={option.id}
                onClick={() => onSelect(option)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-900/30' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${option.color} p-2 rounded-full bg-white/20`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white text-sm">{option.title}</h4>
                      {isSelected && <Check size={16} className="text-blue-500" />}
                      {option.requiresPostSelection && (
                        <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                          Post Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 mt-1">{option.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Base Instagram Node Component
const BaseInstagramNode = ({ data, option }) => {
  const Icon = option?.icon || Instagram;
  const title = option?.title || data.label || 'Instagram';
  const description = option?.description || 'Send or receive messages, media, or data via Instagram';
  const color = option?.color || 'text-pink-500';
  const bgColor = option?.bgColor || 'bg-gradient-to-br from-pink-800 to-pink-900';

  // Show selected post info if available
  const selectedPost = data.selectedPost;
  const showPostInfo = option?.requiresPostSelection && selectedPost;

  return (
    <div className={`${bgColor} text-white rounded-lg shadow-lg border-2 border-gray-600 p-4 min-w-[220px] max-w-[280px] cursor-pointer hover:shadow-xl transition-all duration-200`}>
      <div className='flex items-center mb-3 gap-3'>
        <div className={`${color} p-2 rounded-full bg-white/20`}>
          <Icon size={24} />
        </div>
        <div className='flex flex-col justify-center flex-1'>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className='text-xs text-gray-300'>
            ID: <span className='text-gray-400 font-mono'>{data.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Settings size={14} className="text-gray-400" />
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
      
      {showPostInfo && (
        <div className="mb-3 p-2 bg-black/20 rounded border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-green-300 font-medium">Post Selected</span>
          </div>
          {selectedPost.username && (
            <p className="text-xs text-blue-200 mb-1">
              @{selectedPost.username}
            </p>
          )}
          <p className="text-xs text-gray-200 truncate">
            {selectedPost.caption ? 
              (selectedPost.caption.length > 40 ? selectedPost.caption.substring(0, 40) + '...' : selectedPost.caption) :
              `${selectedPost.media_type} Post`
            }
          </p>
          <p className="text-xs text-gray-400 mt-1 font-mono">ID: {selectedPost.id}</p>
        </div>
      )}
      
      <p className="text-xs text-gray-200 leading-relaxed mb-2">
        {description}
      </p>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  );
};

// Main Instagram Node Component
const InstagramNode = ({ data, selected }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const { getToken } = useAuth();
  
  // Find the current option based on data.selectedOption
  const currentOption = instagramOptions.find(opt => opt.id === data.selectedOption);
  
  const handleNodeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleOptionSelect = (option) => {
    // Update the node data with the selected option
    if (data.onUpdate) {
      data.onUpdate({
        id: data.id,
        data: {
          ...data,
          selectedOption: option.id,
          label: option.title,
          // Clear selected post when changing options
          selectedPost: null
        }
      });
    }
    setIsModalOpen(false);
    
    // If this option requires post selection, open post modal
    if (option.requiresPostSelection) {
      fetchPosts();
      setIsPostModalOpen(true);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const token = await getToken();
      const data =  await getInstagramPosts(token);  
      setPosts(data.data || data || []);
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handlePostSelect = (post) => {
    if (data.onUpdate) {
      data.onUpdate({
        id: data.id,
        data: {
          ...data,
          selectedPost: post
        }
      });
    }
    setIsPostModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePostModalClose = () => {
    setIsPostModalOpen(false);
  };

  // Show post selection button in node if option requires it and no post is selected
  const showPostSelectionButton = currentOption?.requiresPostSelection && !data.selectedPost;

  return (
    <>
      <div onClick={handleNodeClick}>
        <BaseInstagramNode 
          data={data} 
          option={currentOption}
        />
      </div>
      
      {showPostSelectionButton && (
        <div className="absolute -bottom-8 left-0 right-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              fetchPosts();
              setIsPostModalOpen(true);
            }}
            className="w-full px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded shadow-lg transition-colors"
          >
            Select Post
          </button>
        </div>
      )}
      
      <InstagramOptionsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSelect={handleOptionSelect}
        currentSelection={data.selectedOption}
      />
      
      <PostSelectionModal
        isOpen={isPostModalOpen}
        onClose={handlePostModalClose}
        onSelect={handlePostSelect}
        currentSelection={data.selectedPost?.id}
        posts={posts}
        loading={postsLoading}
        onRefresh={fetchPosts}
      />
    </>
  );
};

export default InstagramNode;