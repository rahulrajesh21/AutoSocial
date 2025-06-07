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



const Automations = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');
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

  const handleSchedulePost = () => {
    if (!selectedFile) {
      toast({
        title: "Missing Media",
        description: "Please select an image or video to post.",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: "Missing Date",
        description: "Please select a date and time for scheduling.",
        variant: "destructive",
      });
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      caption,
      scheduledDate: new Date(`${scheduledDate.toDateString()} ${scheduledTime}`),
      mediaType: selectedFile.type.startsWith('video/') ? 'video' : 'image',
      status: 'scheduled',
    };

    setScheduledPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setSelectedFile(null);
    setCaption('');
    setScheduledDate(null);
    setScheduledTime('12:00');

    toast({
      title: "Post Scheduled! 🎉",
      description: "Your Instagram post has been successfully scheduled.",
    });
  };

  const handleDeletePost = (id) => {
    setScheduledPosts(prev => prev.filter(post => post.id !== id));
    toast({
      title: "Post Deleted",
      description: "The scheduled post has been removed.",
    });
  };

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            
            <div>
              <h1 className="text-2xl font-bold">Scheduler</h1>
            </div>
              <p className="text-sm text-muted-foreground">Schedule your posts like a pro</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
            >
              <Send className="w-4 h-4 mr-2" />
              Schedule Post
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
