import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, FileText, Building2, Package, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useB2B } from '@/context/B2BContext';
import { toast } from 'sonner';

const AdminNotifications = () => {
  const { rfqRequests } = useB2B();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'rfq',
      title: 'New RFQ from Acme Corporation',
      message: 'Request for 500 units of Premium Wireless Headphones',
      productName: 'Premium Wireless Headphones',
      quantity: 500,
      company: 'Acme Corporation',
      contactEmail: 'procurement@acme.com',
      time: '5 minutes ago',
      status: 'pending',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      type: 'b2b_order',
      title: 'B2B Bulk Order Pending Approval',
      message: 'TechStart Inc submitted bulk order worth $15,000',
      orderValue: 15000,
      itemCount: 75,
      company: 'TechStart Inc',
      contactEmail: 'orders@techstart.com',
      time: '1 hour ago',
      status: 'pending_approval',
      priority: 'high',
      read: false
    },
    {
      id: 3,
      type: 'rfq',
      title: 'RFQ Response Required',
      message: 'GlobalTech Corp waiting for quote on Smart Watch Pro',
      productName: 'Smart Watch Pro',
      quantity: 200,
      company: 'GlobalTech Corp',
      contactEmail: 'buyers@globaltech.com',
      time: '2 hours ago',
      status: 'quoted',
      priority: 'medium',
      read: true
    },
    {
      id: 4,
      type: 'b2b_registration',
      title: 'New B2B Registration',
      message: 'InnovateCorp completed B2B account registration',
      company: 'InnovateCorp',
      contactEmail: 'admin@innovatecorp.com',
      time: '3 hours ago',
      status: 'pending_verification',
      priority: 'medium',
      read: false
    },
    {
      id: 5,
      type: 'bulk_order',
      title: 'Bulk Order Processing Complete',
      message: 'MegaStore bulk order of 1,000 items processed successfully',
      orderValue: 25000,
      itemCount: 1000,
      company: 'MegaStore',
      time: '6 hours ago',
      status: 'completed',
      priority: 'low',
      read: true
    }
  ]);

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleAction = (notificationId: number, action: 'approve' | 'reject' | 'respond') => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    switch (action) {
      case 'approve':
        setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, status: 'approved', read: true } : n
        ));
        toast.success(`${notification.type === 'b2b_order' ? 'Order' : 'Request'} approved successfully`);
        break;
      case 'reject':
        setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, status: 'rejected', read: true } : n
        ));
        toast.error(`${notification.type === 'b2b_order' ? 'Order' : 'Request'} rejected`);
        break;
      case 'respond':
        setNotifications(notifications.map(n =>
          n.id === notificationId ? { ...n, status: 'responded', read: true } : n
        ));
        toast.success('Response sent successfully');
        break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pending_approval':
      case 'pending_verification':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'approved':
      case 'completed':
      case 'responded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'quoted':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rfq':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'b2b_order':
      case 'bulk_order':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'b2b_registration':
        return <Building2 className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const rfqNotifications = notifications.filter(n => n.type === 'rfq');
  const orderNotifications = notifications.filter(n => ['b2b_order', 'bulk_order'].includes(n.type));
  const registrationNotifications = notifications.filter(n => n.type === 'b2b_registration');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">B2B Notifications</h1>
          <p className="text-muted-foreground mt-2">Manage RFQs, bulk orders, and B2B registrations</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {unreadCount} unread
          </Badge>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rfq">
            RFQs ({rfqNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="orders">
            Orders ({orderNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="registrations">
            Registrations ({registrationNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">{notification.title}</h3>
                            <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                            {getStatusIcon(notification.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                          {/* Additional details based on type */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Company:</span> {notification.company}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {notification.time}
                            </div>
                            {notification.quantity && (
                              <div>
                                <span className="font-medium">Quantity:</span> {notification.quantity} units
                              </div>
                            )}
                            {notification.orderValue && (
                              <div>
                                <span className="font-medium">Value:</span> ${notification.orderValue.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Action buttons based on status */}
                        {notification.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(notification.id, 'approve')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(notification.id, 'reject')}
                              className="text-red-600 hover:text-red-700"
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {notification.status === 'pending_approval' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(notification.id, 'approve')}
                          >
                            Review Order
                          </Button>
                        )}

                        {notification.type === 'rfq' && notification.status !== 'responded' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(notification.id, 'respond')}
                          >
                            Send Quote
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfq">
          <Card>
            <CardHeader>
              <CardTitle>Request for Quote (RFQ) Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rfqNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{notification.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {notification.company} - {notification.quantity} units
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm">
                          Send Quote
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>B2B Order Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{notification.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${notification.orderValue?.toLocaleString()} - {notification.itemCount} items
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Order
                        </Button>
                        <Button size="sm">
                          Process
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>B2B Registration Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {registrationNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{notification.company}</h3>
                        <p className="text-sm text-muted-foreground">{notification.contactEmail}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                        <Button size="sm">
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
