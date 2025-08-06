import { Sparkles } from 'lucide-react';
import logoImage from '@/assets/imagemaster-logo.png';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ showText = true, size = 'md', className = '' }: LogoProps) => {
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
      <div className="relative">
        <img 
          src={logoImage} 
          alt="ImageMaster Logo" 
          className={`${sizeClasses[size]} animate-glow rounded-lg`}
        />
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md animate-pulse"></div>
      </div>
      {showText && (
        <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
          ImageMaster
        </h1>
      )}
    </div>
  );
};