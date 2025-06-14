import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'react-toastify';
import { Instagram, Send } from 'lucide-react';
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
  
  // You'll need to get these from your auth context or props
  const [userId] = useState('your-user-id'); // Replace with actual user ID
  const [token] = useState('your-auth-token'); // Replace with actual auth token
  
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: '1',
      caption: 'Check out our latest product launch! 🚀',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      mediaType: 'image',
      status: 'scheduled',
    },
    {
      id: '2',
      caption: 'Behind the scenes video from our photoshoot',
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
      formData.append('user_id', userId);
      formData.append('caption', caption);
      formData.append('scheduled_date', scheduledDate);
      formData.append('scheduled_time', scheduledTime);

      const response = await createScheduledPost(token, formData);

      // Check if response is already parsed JSON or needs parsing
      const data = response.data || response;

      if (data.success) {
        setSuccess('Post scheduled successfully! 🎉');
        
        // Add the new post to the scheduled posts list
        const newPost = {
          id: data.data.id,
          caption: data.data.caption,
          scheduledDate: new Date(data.data.scheduled_date),
          mediaType: data.data.media_type,
          status: data.data.status,
          mediaUrl: data.data.media_url
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
        setError(data.error || 'Failed to schedule post');
        toast.error(data.error || 'Failed to schedule post');
      }
    } catch (err) {
      setError('Network error while scheduling post');
      toast.error('Network error while scheduling post');
      console.error('Error scheduling post:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePost = (id) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== id));
    toast.success('The scheduled post has been removed.');
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Instagram className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-2xl font-bold">Scheduler</h1>
              <p className="text-sm text-muted-foreground">Schedule your posts like a pro</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Media Upload */}
            <MediaUpload
              onMediaSelect={setSelectedFile}
              selectedFile={selectedFile}
            />

            {/* Caption Input */}
            <Card>
              <CardHeader>
                <CardTitle>Caption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="caption">Write your caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="What's happening? Add your caption here..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={2200}
                  />
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">
                      {caption.length}/2200
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time Picker */}
            <ScheduleDatePicker
              date={scheduledDate}
              time={scheduledTime}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
            />

            {/* Schedule Button */}
            <Button
              onClick={handleSchedulePost}
              className="w-full bg-borderColor hover:bg-primary/100 text-primary-foreground"
              size="lg"
              disabled={submitLoading}
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Schedule Post
                </>
              )}
            </Button>

            {/* Scheduled Posts List */}
            <ScheduledPostsList
              posts={scheduledPosts}
              onDeletePost={handleDeletePost}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Preview</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    How your post will look on Instagram
                  </p>
                </CardHeader>
                <CardContent>
                  <InstagramPreview
                    mediaFile={selectedFile}
                    caption={caption}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automations;