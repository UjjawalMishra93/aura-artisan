import { Sparkles } from 'lucide-react';
import logoImage from '@/assets/imagemaster-logo.png';
import { useEffect, useState } from 'react';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ showText = true, size = 'md', className = '' }: LogoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger logo reveal animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative group">
        {/* Enhanced logo container with gradient background */}
        <div className={`${sizeClasses[size]} relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-purple-500/20 to-pink-500/10 p-1 transition-all duration-700 ${
          isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <img 
            src={logoImage} 
            alt="ImageMaster Logo" 
            className={`w-full h-full object-contain transition-all duration-700 ${
              isLoaded ? 'scale-100 rotate-0' : 'scale-110 rotate-3'
            }`}
          />
          
          {/* Subtle animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/30 to-pink-500/20 rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Animated sparkle icon overlay */}
          <div className={`absolute -top-1 -right-1 transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}>
            <div className="p-1 bg-gradient-to-r from-primary to-purple-600 rounded-full shadow-lg">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        
        {/* Enhanced glow ring */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-purple-500/40 to-pink-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}>
          <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Image
          </span>
          <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-primary bg-clip-text text-transparent">
            Master
          </span>
        </h1>
      )}
    </div>
  );
};