import React from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';



const InstagramPreview = ({ mediaFile, caption }) => {
  const mediaUrl = mediaFile ? URL.createObjectURL(mediaFile) : null;
  const isVideo = mediaFile?.type.startsWith('video/');

  return (
    <Card className="max-w-sm mx-auto bg-card border border-border">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2 ">
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">your_account</p>
            <p className="text-xs text-muted-foreground">Sponsored</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="aspect-square bg-muted/20 flex items-center justify-center overflow-hidden bg-borderColor">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                controls={false}
                muted
              />
            ) : (
              <img
                src={mediaUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="text-muted-foreground text-sm">No media selected</div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Heart className="w-6 h-6 text-white hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-6 h-6 text-white hover:text-accent cursor-pointer transition-colors" />
              <Send className="w-6 h-6 text-white hover:text-accent cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 text-white hover:text-accent cursor-pointer transition-colors" />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">1,234 likes</p>
            {caption && (
              <div className="text-sm text-white">
                <span className="font-semibold">your_account</span>{' '}
                <span>{caption}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramPreview;
