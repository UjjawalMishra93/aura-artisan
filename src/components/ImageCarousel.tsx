import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Share2, Trash2, Star, ChevronLeft, ChevronRight, 
  Calendar, Clock, Palette, Heart
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  generation_time_ms: number;
  is_public: boolean;
  is_favorite: boolean;
}

interface ImageCarouselProps {
  images: GeneratedImage[];
  onDownload: (imageUrl: string, prompt: string) => void;
  onCopy: (imageUrl: string) => void;
  onDelete: (imageId: string) => void;
  onFavorite?: (imageId: string) => void;
}

export const ImageCarousel = ({ 
  images, 
  onDownload, 
  onCopy, 
  onDelete, 
  onFavorite 
}: ImageCarouselProps) => {
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <Card className="glass border-2 border-dashed border-primary/20">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto animate-pulse" />
            <p className="text-muted-foreground">No images created yet</p>
            <p className="text-sm text-muted-foreground">Generate your first masterpiece!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <TooltipProvider>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-1">
          {images.map((image) => (
            <CarouselItem key={image.id} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <Card 
                className="glass border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                onMouseEnter={() => setHoveredImageId(image.id)}
                onMouseLeave={() => setHoveredImageId(null)}
              >
                <div className="aspect-square relative bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Metadata overlay */}
                  {hoveredImageId === image.id && (
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                      {/* Top badges */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/20">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(image.created_at)}
                          </Badge>
                          <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/20">
                            <Clock className="h-3 w-3 mr-1" />
                            {image.generation_time_ms}ms
                          </Badge>
                        </div>
                        
                        {/* Favorite button */}
                        {onFavorite && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onFavorite(image.id)}
                                                                className={`${
                                  image.is_favorite 
                                    ? 'bg-pink-500/20 border-pink-500/40 hover-pink-dark'
                                : 'bg-white/20 border-white/20 hover-white-dark'
                                } backdrop-blur-sm text-white`}
                              >
                                <Heart className={`h-4 w-4 ${image.is_favorite ? 'fill-current text-pink-400' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {image.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      
                      {/* Bottom content */}
                      <div className="space-y-3">
                        <p className="text-white font-medium text-sm line-clamp-2 bg-black/40 backdrop-blur-sm rounded-lg p-2">
                          {image.prompt}
                        </p>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 justify-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onDownload(image.image_url, image.prompt)}
                                className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download image</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onCopy(image.image_url)}
                                className="bg-white/20 backdrop-blur-sm text-white border-white/20 hover-white-dark"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy image URL</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete(image.id)}
                                className="bg-red-500/20 backdrop-blur-sm text-white border-red-500/20 hover-red-dark"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete image</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {images.length > 3 && (
          <>
            <CarouselPrevious className="glass border-primary/20 hover-primary-medium" />
            <CarouselNext className="glass border-primary/20 hover-primary-medium" />
          </>
        )}
      </Carousel>
    </TooltipProvider>
  );
};