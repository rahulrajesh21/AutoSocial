import React from 'react';
import { Calendar, Clock, Image, Video, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { format } from 'date-fns';





const ScheduledPostsList = ({ posts, onDeletePost }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-accent text-accent-foreground';
      case 'published':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Scheduled Posts ({posts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No scheduled posts yet</p>
            <p className="text-sm">Create your first scheduled post above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg border border-border"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-accent/15 rounded-full flex items-center justify-center">
                  {post.mediaType === 'video' ? (
                    <Video className="w-4 h-4 text-accent" />
                  ) : (
                    <Image className="w-4 h-4 text-accent" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {post.caption || 'No caption'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {format(post.scheduledDate, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <Badge
                    className={`mt-2 text-xs ${getStatusColor(post.status)}`}
                    variant="secondary"
                  >
                    {post.status}
                  </Badge>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeletePost(post.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduledPostsList;
