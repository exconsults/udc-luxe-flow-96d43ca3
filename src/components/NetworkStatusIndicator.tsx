import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function NetworkStatusIndicator() {
  const { isOnline, lastOnline } = useNetworkStatus();

  const formatLastOnline = () => {
    if (!lastOnline) return 'Unknown';
    const now = new Date();
    const diff = now.getTime() - lastOnline.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return lastOnline.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              isOnline
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-destructive/10 text-destructive animate-pulse'
            )}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isOnline ? (
            <p>Connected to server</p>
          ) : (
            <p>
              You're offline. Changes will sync when reconnected.
              {lastOnline && (
                <span className="block text-muted-foreground text-xs mt-1">
                  Last online: {formatLastOnline()}
                </span>
              )}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
