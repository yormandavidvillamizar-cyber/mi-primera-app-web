'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications } from '@/hooks/use-notifications';

export function NotificationBell() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
              {notifications.length}
            </span>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notificaciones</h4>
            <p className="text-sm text-muted-foreground">
              Alertas y recordatorios importantes.
            </p>
          </div>
          <div className="grid gap-2">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between rounded-md border p-3"
                >
                  <p className="text-sm">{notification.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                  >
                    X
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No hay notificaciones nuevas.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
