import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserCog } from 'lucide-react';
import { toast } from 'sonner';

type UserRole = 'admin' | 'customer';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  status: 'Active' | 'Inactive';
  totalOrders: number;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', joinDate: '2024-01-10', status: 'Active', totalOrders: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joinDate: '2024-01-12', status: 'Active', totalOrders: 8 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'admin', joinDate: '2024-01-05', status: 'Active', totalOrders: 0 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'customer', joinDate: '2024-01-15', status: 'Active', totalOrders: 15 },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'customer', joinDate: '2024-01-08', status: 'Inactive', totalOrders: 3 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const toggleUserRole = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: user.role === 'admin' ? 'customer' : 'admin' }
        : user
    ));
    toast.success('User role updated successfully');
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    toast.success('User status updated successfully');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground mt-2">Manage user accounts and permissions</p>
      </div>

      {/* Search */}
      <Card className="rounded-2xl border-border mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-6">
            <h3 className="text-sm text-muted-foreground mb-2">Admins</h3>
            <p className="text-3xl font-bold text-primary">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Join Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="rounded-full">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{user.joinDate}</td>
                    <td className="py-4 px-4 text-sm text-foreground">{user.totalOrders}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg"
                          onClick={() => toggleUserRole(user.id)}
                        >
                          <UserCog className="w-4 h-4 mr-1" />
                          Toggle Role
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
