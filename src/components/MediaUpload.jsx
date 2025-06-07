import React, { useCallback } from 'react';
import { Upload, Image, Video } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { cn } from '../lib/utils';



const MediaUpload = ({ onMediaSelect, selectedFile }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        onMediaSelect(file);
      }
    }
  }, [onMediaSelect]);

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onMediaSelect(files[0]);
    }
  };

  const isVideo = selectedFile?.type.startsWith('video/');
  const isImage = selectedFile?.type.startsWith('image/');

  return (
    <Card className="border-2 border-dashed border-border hover:border-accent transition-colors">
      <CardContent className="p-6">
        <div
          className={cn(
            "relative border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer",
            selectedFile && "border-solid border-accent"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          {selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                {isVideo ? (
                  <Video className="w-8 h-8 text-accent" />
                ) : (
                  <Image className="w-8 h-8 text-accent" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Drop your media here or click to browse
                </p>
                <p className="text-xs text-muted-foreground text-gray-400">
                  Supports JPG, PNG, MP4, MOV files
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUpload;
