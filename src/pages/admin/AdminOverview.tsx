import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ShoppingCart, Store, Bell, FileText, Building2, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useB2B } from '@/context/B2BContext';

const AdminOverview = () => {
  const [stats] = useState({
    totalUsers: 1245,
    totalOrders: 456,
    totalSales: 45678.90,
    totalProducts: 89,
    b2bUsers: 89,
    pendingRFQs: 12
  });

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'rfq', message: 'New RFQ from Acme Corp for Premium Headphones', time: '5 min ago', read: false },
    { id: 2, type: 'b2b_order', message: 'B2B bulk order pending approval - $15,000', time: '1 hour ago', read: false },
    { id: 3, type: 'rfq', message: 'RFQ updated by TechStart Inc', time: '2 hours ago', read: true },
  ]);

  // Enhanced analytics data
  const salesByCurrency = [
    { currency: 'USD', amount: 28500, percentage: 65, color: '#0088FE' },
    { currency: 'EUR', amount: 8900, percentage: 20, color: '#00C49F' },
    { currency: 'GBP', amount: 4450, percentage: 10, color: '#FFBB28' },
    { currency: 'CAD', amount: 2228, percentage: 5, color: '#FF8042' },
  ];

  const salesByRegion = [
    { region: 'North America', sales: 18500, orders: 245 },
    { region: 'Europe', sales: 12300, orders: 189 },
    { region: 'Asia Pacific', sales: 8900, orders: 156 },
    { region: 'Latin America', sales: 3400, orders: 78 },
    { region: 'Middle East', sales: 2600, orders: 45 },
  ];

  const marketplaceData = [
    { channel: 'Direct Store', sales: 25000, percentage: 55, orders: 356 },
    { channel: 'Amazon', sales: 12000, percentage: 27, orders: 234 },
    { channel: 'eBay', sales: 5500, percentage: 12, orders: 123 },
    { channel: 'AliExpress', sales: 2800, percentage: 6, orders: 67 },
  ];

  const salesData = [
    { name: 'Mon', sales: 4000, b2b: 1200 },
    { name: 'Tue', sales: 3000, b2b: 900 },
    { name: 'Wed', sales: 5000, b2b: 2100 },
    { name: 'Thu', sales: 4500, b2b: 1800 },
    { name: 'Fri', sales: 6000, b2b: 2400 },
    { name: 'Sat', sales: 5500, b2b: 1650 },
    { name: 'Sun', sales: 4800, b2b: 1440 },
  ];

  const recentOrders = [
    { id: '#ORD-001', customer: 'Acme Corp', amount: 2999.99, status: 'B2B', date: '2024-01-15', type: 'b2b' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 149.99, status: 'Pending', date: '2024-01-15', type: 'regular' },
    { id: '#ORD-003', customer: 'TechStart Inc', amount: 15599.99, status: 'Shipped', date: '2024-01-14', type: 'b2b' },
    { id: '#ORD-004', customer: 'Alice Brown', amount: 199.99, status: 'Delivered', date: '2024-01-14', type: 'regular' },
  ];

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const statCards = [
    {
      title: 'Total Sales',
      value: `$${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'B2B Customers',
      value: stats.b2bUsers.toString(),
      icon: Building2,
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      title: 'Pending RFQs',
      value: stats.pendingRFQs.toString(),
      icon: FileText,
      change: '+3',
      changeType: 'neutral'
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Button variant="outline" className="relative">
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read).length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications Panel */}
      {notifications.filter(n => !n.read).length > 0 && (
        <Card className="rounded-2xl border-orange-200 bg-orange-50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.filter(n => !n.read).map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      notification.type === 'rfq' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-2xl border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="currency">By Currency</TabsTrigger>
          <TabsTrigger value="region">By Region</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Sales Trends (B2B vs Regular)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem'
                      }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Sales" />
                    <Line type="monotone" dataKey="b2b" stroke="hsl(var(--accent))" strokeWidth={2} name="B2B Sales" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          order.type === 'b2b' ? 'bg-blue-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{order.id} - {order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">${order.amount}</p>
                        <Badge variant={order.type === 'b2b' ? 'default' : 'secondary'} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="currency">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Sales by Currency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salesByCurrency}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({currency, percentage}) => `${currency} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {salesByCurrency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Currency Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesByCurrency.map((currency, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: currency.color }}></div>
                        <span className="font-medium">{currency.currency}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${currency.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{currency.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="region">
          <Card className="rounded-2xl border-border">
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesByRegion} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="region" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem'
                    }}
                    formatter={(value, name) => [
                      name === 'sales' ? `$${value.toLocaleString()}` : `${value} orders`,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Marketplace Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketplaceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="channel" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem'
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceData.map((channel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{channel.channel}</p>
                          <p className="text-sm text-muted-foreground">{channel.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">${channel.sales.toLocaleString()}</p>
                        <Badge variant="secondary">{channel.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOverview;
