import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { 
  Instagram, 
  Send, 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  MessageSquare, 
  ListTodo, 
  History,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MediaUpload from '../components/MediaUpload';
import InstagramPreview from '../components/InstagramPreview';
import ScheduleDatePicker from '../components/ScheduleDatePicker';
import ScheduledPostsList from '../components/ScheduledPostList';
import { createScheduledPost } from '../utils/api';

const Automations = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'scheduled'
  const [expandedPosts, setExpandedPosts] = useState({});
  const { getToken } = useAuth();
  
  // Function to toggle expanded state for a post
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };
  
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: '1',
      caption: 'Check out our latest product launch! 🚀 This is a longer caption that might need truncation when displayed in the list view. We want to make sure it looks good.',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      mediaType: 'image',
      status: 'scheduled',
    },
    {
      id: '2',
      caption: 'Behind the scenes video from our photoshoot. We had such an amazing time creating content for our new campaign. Stay tuned for more updates coming soon!',
      scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      mediaType: 'video',
      status: 'scheduled',
    },
  ]);

  const handleSchedulePost = async () => {
    if (!selectedFile) {
      setError('Please select an image or video to post');
      return;
    }

    if (!scheduledDate) {
      setError('Please select a date and time for scheduling');
      return;
    }

    // Validate that scheduled date is in the future
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    if (scheduledDateTime <= new Date()) {
      setError('Scheduled date must be in the future');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append('media', selectedFile);
      formData.append('caption', caption);
      formData.append('scheduled_date', scheduledDate);
      formData.append('scheduled_time', scheduledTime);
      
      const token = await getToken();
      console.log('Got token, making API call...');
      
      const response = await createScheduledPost(token, formData);
      console.log('API response received:', response);

      // Check if the backend operation was successful
      if (response && (response.success || response.data)) {
        setSuccess('Post scheduled successfully! 🎉');
        
        // Add the new post to the scheduled posts list
        const newPost = {
          id: response.data?.id || `temp-${Date.now()}`,
          caption: response.data?.caption || caption,
          scheduledDate: new Date(response.data?.scheduled_date || scheduledDateTime),
          mediaType: response.data?.media_type || selectedFile.type,
          status: response.data?.status || 'scheduled',
          mediaUrl: response.data?.media_url || URL.createObjectURL(selectedFile)
        };
        
        setScheduledPosts(prev => [...prev, newPost]);
        
        // Reset form
        setSelectedFile(null);
        setCaption('');
        setScheduledDate(null);
        setScheduledTime('12:00');
        
        // Clear file input
        const fileInput = document.getElementById('media-upload');
        if (fileInput) fileInput.value = '';
        
        // Show success toast
        toast.success('Post scheduled successfully! 🎉');
      } else {
        const errorMsg = response?.error || response?.message || 'Failed to schedule post';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Error scheduling post:', err);
      setError(`Error scheduling post: ${err.message || 'Unknown error'}`);
      toast.error(`Error scheduling post: ${err.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePost = (id) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== id));
    toast.success('The scheduled post has been removed.');
  };

  return (
    <div className="p-6 text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1 flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-rose-600/20">
              <Instagram size={20} className="text-rose-400" />
            </div>
            Content Scheduler
          </h1>
          <p className="text-sm text-gray-400">
            Schedule and manage your social media posts
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <Send size={16} />
              Create Post
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'scheduled'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <Calendar size={16} />
              Scheduled <span className="ml-1 bg-gray-700/80 text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
                {scheduledPosts.length}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-900/30 rounded-lg flex items-start gap-3">
          <div className="p-1 bg-red-900/30 rounded-full mt-0.5">
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-900/30 rounded-lg flex items-start gap-3">
          <div className="p-1 bg-green-900/30 rounded-full mt-0.5">
            <CheckCircle size={16} className="text-green-400" />
          </div>
          <p className="text-green-300 text-sm">{success}</p>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Upload */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
                <div className="p-1.5 rounded-full bg-green-600/20">
                  <ImageIcon size={18} className="text-green-400" />
                </div>
                <h2 className="text-lg font-medium text-white">Media Upload</h2>
              </div>
              <div className="p-6">
                <MediaUpload
                  onMediaSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              </div>
            </div>

            {/* Caption Input */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
                <div className="p-1.5 rounded-full bg-blue-600/20">
                  <MessageSquare size={18} className="text-blue-400" />
                </div>
                <h2 className="text-lg font-medium text-white">Caption</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caption" className="text-gray-300 mb-2 block text-sm">Write your caption</Label>
                    <Textarea
                      id="caption"
                      placeholder="What's happening? Add your caption here..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="min-h-[120px] resize-none bg-gray-700/60 border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-gray-200"
                      maxLength={2200}
                    />
                    <div className="text-right mt-1.5">
                      <span className="text-xs text-gray-400">
                        {caption.length}/2200
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 flex-wrap">
                    <button onClick={() => setCaption(caption + ' #AutoSocial')} className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors">
                      #AutoSocial
                    </button>
                    <button onClick={() => setCaption(caption + ' #Marketing')} className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors">
                      #Marketing
                    </button>
                    <button onClick={() => setCaption(caption + ' #SocialMedia')} className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors">
                      #SocialMedia
                    </button>
                    <button onClick={() => setCaption(caption + ' #ContentCreation')} className="px-3 py-1.5 bg-gray-700/60 hover:bg-gray-700 rounded-full text-xs text-gray-300 transition-colors">
                      #ContentCreation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time Picker */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
                <div className="p-1.5 rounded-full bg-amber-600/20">
                  <Clock size={18} className="text-amber-400" />
                </div>
                <h2 className="text-lg font-medium text-white">Schedule</h2>
              </div>
              <div className="p-6">
                <ScheduleDatePicker
                  date={scheduledDate}
                  time={scheduledTime}
                  onDateChange={setScheduledDate}
                  onTimeChange={setScheduledTime}
                />
              </div>
            </div>

            {/* Schedule Button */}
            <button
              onClick={handleSchedulePost}
              disabled={submitLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors text-white py-4 px-6 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Schedule Post
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
                <div className="p-1.5 rounded-full bg-purple-600/20">
                  <Instagram size={18} className="text-purple-400" />
                </div>
                <h2 className="text-lg font-medium text-white">Preview</h2>
              </div>
              <div className="p-6 flex justify-center">
                <InstagramPreview
                  mediaFile={selectedFile}
                  caption={caption}
                />
              </div>
              <div className="px-6 py-3 border-t border-gray-700/50 bg-gray-800">
                <p className="text-xs text-gray-400 text-center">
                  This is how your post will appear on Instagram
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700/50">
            <div className="p-1.5 rounded-full bg-rose-600/20">
              <ListTodo size={18} className="text-rose-400" />
            </div>
            <h2 className="text-lg font-medium text-white">Scheduled Posts</h2>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{scheduledPosts.length}</span> posts scheduled
              </div>
              <button className="p-2 bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors">
                <History size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            {scheduledPosts.length > 0 ? (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="bg-gray-700/40 rounded-lg overflow-hidden border border-gray-600/30">
                    <div className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-600/50 rounded-md flex items-center justify-center flex-shrink-0">
                          {post.mediaType === 'video' ? (
                            <video className="w-full h-full object-cover rounded-md" />
                          ) : (
                            <ImageIcon size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="text-sm text-gray-300 mb-1 line-clamp-2">
                            {expandedPosts[post.id] 
                              ? post.caption 
                              : post.caption.length > 100 
                                ? `${post.caption.substring(0, 100)}...` 
                                : post.caption}
                          </div>
                          {post.caption.length > 100 && (
                            <button 
                              onClick={() => togglePostExpansion(post.id)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 mt-1"
                            >
                              {expandedPosts[post.id] ? (
                                <>
                                  <ChevronUp size={12} />
                                  <span>Show less</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={12} />
                                  <span>Read more</span>
                                </>
                              )}
                            </button>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="bg-gray-600/50 px-2 py-1 rounded text-xs text-gray-300 flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{post.scheduledDate.toLocaleDateString()}</span>
                            </div>
                            <div className="bg-gray-600/50 px-2 py-1 rounded text-xs text-gray-300 flex items-center gap-1">
                              <Clock size={12} />
                              <span>{post.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                              post.status === 'scheduled' 
                                ? 'bg-green-900/30 text-green-300' 
                                : 'bg-amber-900/30 text-amber-300'
                            }`}>
                              <span>{post.status.charAt(0).toUpperCase() + post.status.slice(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button 
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-md transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-700/40 rounded-full p-4 inline-flex mb-4">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-2">No scheduled posts</h3>
                <p className="text-gray-400 mb-4">You haven't scheduled any posts yet.</p>
                <button 
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-sm transition-colors"
                >
                  Create a post
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;