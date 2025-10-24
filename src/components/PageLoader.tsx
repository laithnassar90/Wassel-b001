import { Loader2 } from 'lucide-react';
import { Logo } from './Logo';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoader({ message = 'Loading...', fullScreen = true }: PageLoaderProps) {
  const containerClass = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-background' 
    : 'size-full flex items-center justify-center bg-background';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />
        <div className="flex items-center gap-3">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}
