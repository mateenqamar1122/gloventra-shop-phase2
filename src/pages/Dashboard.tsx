import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Mock user data - replace with actual API call
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const orders = [
    { id: 1, date: '2024-01-15', total: 299.99, status: 'Delivered' },
    { id: 2, date: '2024-01-20', total: 179.99, status: 'In Transit' },
    { id: 3, date: '2024-01-25', total: 129.99, status: 'Processing' },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">My Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="rounded-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info */}
          <Card className="p-6 rounded-2xl lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-full mb-2" onClick={() => navigate('/dashboard/edit-profile')}>
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full rounded-full" onClick={() => navigate('/admin')}>
              <Package className="w-4 h-4 mr-2" />
              Seller Account
            </Button>
          </Card>

          {/* Stats */}
          <Card className="p-6 rounded-2xl bg-gradient-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-muted-foreground">Total Orders</h3>
              <Package className="w-5 h-5 text-primary" />
            </div>
            <p className="text-4xl font-bold text-foreground">{orders.length}</p>
          </Card>

          <Card className="p-6 rounded-2xl bg-gradient-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-muted-foreground">Total Spent</h3>
              <Package className="w-5 h-5 text-accent" />
            </div>
            <p className="text-4xl font-bold text-foreground">
              ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </p>
          </Card>
        </div>

        {/* Order History */}
        <Card className="p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Order History</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">${order.total.toFixed(2)}</p>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'In Transit'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
