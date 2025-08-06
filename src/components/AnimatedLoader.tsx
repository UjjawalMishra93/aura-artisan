import { Palette, Sparkles, Wand2 } from 'lucide-react';

interface AnimatedLoaderProps {
  message?: string;
}

export const AnimatedLoader = ({ message = "Generating Magic..." }: AnimatedLoaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* Main spinning circle */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-l-primary"></div>
        
        {/* Inner icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse">
            <Palette className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
            <Sparkles className="h-3 w-3 text-purple-500 animate-pulse" />
          </div>
        </div>
        
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1">
            <Wand2 className="h-3 w-3 text-pink-500 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-foreground animate-pulse">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};