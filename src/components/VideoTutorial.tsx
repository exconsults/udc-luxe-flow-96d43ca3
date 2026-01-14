import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";

interface VideoTutorialProps {
  title: string;
  description: string;
  videoId?: string;
  thumbnailUrl?: string;
  duration?: string;
  placeholder?: boolean;
}

const VideoTutorial = ({ 
  title, 
  description, 
  videoId, 
  thumbnailUrl,
  duration = "2:30",
  placeholder = true 
}: VideoTutorialProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // If no videoId provided, show placeholder
  if (placeholder || !videoId) {
    return (
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          {/* Placeholder thumbnail with play button overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-primary/90 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="px-3 py-1 bg-black/60 text-white text-sm rounded-full">
              {duration}
            </span>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-medium text-sm truncate">{title}</p>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground italic">
            Video tutorial coming soon. Check back for step-by-step video guides!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {!isPlaying ? (
          <>
            {/* Thumbnail with play button */}
            <img
              src={thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                size="lg"
                className="gap-2 rounded-full"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="h-5 w-5" fill="currentColor" />
                Play Video
              </Button>
            </div>
            <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
              {duration}
            </span>
          </>
        ) : (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      {!isPlaying && videoId && (
        <CardContent className="pt-0">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a 
              href={`https://www.youtube.com/watch?v=${videoId}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3 w-3" />
              Watch on YouTube
            </a>
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default VideoTutorial;
