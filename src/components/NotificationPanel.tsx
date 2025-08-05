import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { markAsRead, removeNotification } from '@/store/slices/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  const notifications = useAppSelector(state => state.notifications.notifications);
  const dispatch = useAppDispatch();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  if (notifications.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Bell className="h-5 w-5 mr-2" />
          <CardTitle className="text-lg">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Bell className="h-5 w-5 mr-2" />
        <CardTitle className="text-lg">Notifications</CardTitle>
        <Badge variant="secondary" className="ml-auto">
          {notifications.filter(n => !n.read).length}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border transition-colors ${
              notification.read ? 'bg-muted/50' : 'bg-card'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">{notification.title}</h4>
                    <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => dispatch(removeNotification(notification.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-6 text-xs"
                onClick={() => dispatch(markAsRead(notification.id))}
              >
                Mark as read
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;