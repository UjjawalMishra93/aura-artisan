import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, Camera, Palette, Mountain, Building2, 
  Rocket, Flower, Car, Crown, Gamepad2 
} from 'lucide-react';

interface QuickPrompt {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const quickPrompts: QuickPrompt[] = [
  { text: "Futuristic cityscape at sunset", icon: Building2, category: "Architecture" },
  { text: "Magical forest with glowing mushrooms", icon: Flower, category: "Fantasy" },
  { text: "Abstract art with vibrant colors", icon: Palette, category: "Abstract" },
  { text: "Vintage car in the rain", icon: Car, category: "Automotive" },
  { text: "Majestic dragon soaring through clouds", icon: Crown, category: "Fantasy" },
  { text: "Cyberpunk warrior in neon city", icon: Gamepad2, category: "Sci-Fi" },
  { text: "Serene mountain lake at dawn", icon: Mountain, category: "Nature" },
  { text: "Space station orbiting distant planet", icon: Rocket, category: "Sci-Fi" },
];

interface QuickPromptsProps {
  onPromptSelect: (prompt: string) => void;
  className?: string;
}

export const QuickPrompts = ({ onPromptSelect, className = '' }: QuickPromptsProps) => {
  return (
    <Card className={`glass border-0 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          Quick Inspiration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickPrompts.map((prompt, index) => {
            const IconComponent = prompt.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => onPromptSelect(prompt.text)}
                className="h-auto p-4 text-left flex items-start gap-3 hover-primary-light border-primary/20 transition-all duration-200 group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10 group-hover:from-primary/20 group-hover:to-purple-500/20 transition-colors">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-tight">{prompt.text}</p>
                  <p className="text-xs text-muted-foreground">{prompt.category}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};