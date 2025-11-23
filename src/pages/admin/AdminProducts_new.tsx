import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
    Package,
    RefreshCw,
    Search,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Mock product data
const initialProducts = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        sku: 'PWH-001',
        price: 199.99,
        stock: 45,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        status: 'active',
        marketplaces: {
            amazon: { enabled: true, lastSync: '2024-01-15 10:30' },
            ebay: { enabled: false, lastSync: null },
            aliexpress: { enabled: true, lastSync: '2024-01-14 15:45' }
        }
    },
    {
        id: 2,
        name: 'Smart Fitness Watch',
        sku: 'SFW-002',
        price: 299.99,
        stock: 23,
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        status: 'active',
        marketplaces: {
            amazon: { enabled: true, lastSync: '2024-01-15 09:15' },
            ebay: { enabled: true, lastSync: '2024-01-15 11:20' },
            aliexpress: { enabled: false, lastSync: null }
        }
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        sku: 'BS-003',
        price: 89.99,
        stock: 67,
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
        status: 'active',
        marketplaces: {
            amazon: { enabled: false, lastSync: null },
            ebay: { enabled: true, lastSync: '2024-01-14 16:30' },
            aliexpress: { enabled: true, lastSync: '2024-01-15 08:45' }
        }
    },
    {
        id: 4,
        name: 'Gaming Mechanical Keyboard',
        sku: 'GMK-004',
        price: 159.99,
        stock: 34,
        category: 'Gaming',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop',
        status: 'active',
        marketplaces: {
            amazon: { enabled: true, lastSync: '2024-01-15 12:10' },
            ebay: { enabled: false, lastSync: null },
            aliexpress: { enabled: false, lastSync: null }
        }
    },
    {
        id: 5,
        name: 'Wireless Phone Charger',
        sku: 'WPC-005',
        price: 49.99,
        stock: 89,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop',
        status: 'active',
        marketplaces: {
            amazon: { enabled: true, lastSync: '2024-01-15 13:25' },
            ebay: { enabled: true, lastSync: '2024-01-15 10:55' },
            aliexpress: { enabled: true, lastSync: '2024-01-15 14:15' }
        }
    }
];

const AdminProducts = () => {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Form state for add/edit product
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        image: ''
    });

    // Filter products based on search, category, and status
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Get unique categories for filter dropdown
    const categories = ['all', ...new Set(products.map(p => p.category))];

    // Reset form data
    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            price: '',
            stock: '',
            category: '',
            image: ''
        });
    };

    // Handle form input changes
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle marketplace sync toggle
    const handleMarketplaceToggle = (productId: number, marketplace: string, enabled: boolean) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                    ? {
                        ...product,
                        marketplaces: {
                            ...product.marketplaces,
                            [marketplace]: {
                                ...product.marketplaces[marketplace as keyof typeof product.marketplaces],
                                enabled,
                                lastSync: enabled ? new Date().toISOString().slice(0, 16).replace('T', ' ') : null
                            }
                        }
                    }
                    : product
            )
        );

        toast.success(`${marketplace.charAt(0).toUpperCase() + marketplace.slice(1)} sync ${enabled ? 'enabled' : 'disabled'}`);
    };

    // Handle sync all products
    const handleSyncAll = async () => {
        setIsSyncing(true);

        // Simulate API call
        setTimeout(() => {
            const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

            setProducts(prevProducts =>
                prevProducts.map(product => ({
                    ...product,
                    marketplaces: {
                        amazon: {
                            ...product.marketplaces.amazon,
                            lastSync: product.marketplaces.amazon.enabled ? now : product.marketplaces.amazon.lastSync
                        },
                        ebay: {
                            ...product.marketplaces.ebay,
                            lastSync: product.marketplaces.ebay.enabled ? now : product.marketplaces.ebay.lastSync
                        },
                        aliexpress: {
                            ...product.marketplaces.aliexpress,
                            lastSync: product.marketplaces.aliexpress.enabled ? now : product.marketplaces.aliexpress.lastSync
                        }
                    }
                }))
            );

            setIsSyncing(false);
            toast.success('All products synced successfully!');
        }, 2000);
    };

    // Get marketplace badges for a product
    const getMarketplaceBadges = (marketplaces: any) => {
        const badges = [];
        if (marketplaces.amazon.enabled) badges.push('AMZ');
        if (marketplaces.ebay.enabled) badges.push('eBay');
        if (marketplaces.aliexpress.enabled) badges.push('Ali');
        return badges;
    };

    // Handle add product
    const handleAddProduct = () => {
        if (!formData.name || !formData.sku || !formData.price || !formData.stock || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        const newProduct = {
            id: Math.max(...products.map(p => p.id)) + 1,
            name: formData.name,
            sku: formData.sku,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category: formData.category,
            image: formData.image || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
            status: 'active',
            marketplaces: {
                amazon: { enabled: false, lastSync: null },
                ebay: { enabled: false, lastSync: null },
                aliexpress: { enabled: false, lastSync: null }
            }
        };

        setProducts(prev => [...prev, newProduct]);
        setIsAddDialogOpen(false);
        resetForm();
        toast.success('Product added successfully!');
    };

    // Handle edit product
    const handleEditProduct = () => {
        if (!formData.name || !formData.sku || !formData.price || !formData.stock || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        setProducts(prev =>
            prev.map(product =>
                product.id === selectedProduct.id
                    ? {
                        ...product,
                        name: formData.name,
                        sku: formData.sku,
                        price: parseFloat(formData.price),
                        stock: parseInt(formData.stock),
                        category: formData.category,
                        image: formData.image || product.image
                    }
                    : product
            )
        );

        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        resetForm();
        toast.success('Product updated successfully!');
    };

    // Handle delete product
    const handleDeleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(product => product.id !== productId));
        setIsDeleteDialogOpen(false);
        toast.success('Product deleted successfully!');
    };

    // Open edit dialog with product data
    const openEditDialog = (product: any) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            image: product.image
        });
        setIsEditDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600">Manage your products and marketplace synchronization</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleSyncAll} disabled={isSyncing} className="bg-blue-600 hover:bg-blue-700">
                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Syncing...' : 'Sync All'}
                    </Button>

                    <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                            </div>
                            <Package className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Amazon Synced</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {products.filter(p => p.marketplaces.amazon.enabled).length}
                                </p>
                            </div>
                            <ExternalLink className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">eBay Synced</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {products.filter(p => p.marketplaces.ebay.enabled).length}
                                </p>
                            </div>
                            <ExternalLink className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">AliExpress Synced</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {products.filter(p => p.marketplaces.aliexpress.enabled).length}
                                </p>
                            </div>
                            <ExternalLink className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.filter(c => c !== 'all').map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Products ({filteredProducts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Product</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">SKU</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Price</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Stock</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Marketplaces</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Sync Status</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Last Sync</th>
                                    <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProducts.map((product) => {
                                    const badges = getMarketplaceBadges(product.marketplaces);

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            {/* Product Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.category}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* SKU */}
                                            <td className="py-4 px-6">
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {product.sku}
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Stock */}
                                            <td className="py-4 px-6">
                                                <span className={`font-medium ${product.stock > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                                                    {product.stock}
                                                </span>
                                            </td>

                                            {/* Marketplace Toggles */}
                                            <td className="py-4 px-6">
                                                <div className="space-y-2">
                                                    {/* Amazon */}
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={product.marketplaces.amazon.enabled}
                                                            onCheckedChange={(enabled) =>
                                                                handleMarketplaceToggle(product.id, 'amazon', enabled)
                                                            }
                                                        />
                                                        <span className="text-sm text-orange-600 font-medium">Amazon</span>
                                                    </div>

                                                    {/* eBay */}
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={product.marketplaces.ebay.enabled}
                                                            onCheckedChange={(enabled) =>
                                                                handleMarketplaceToggle(product.id, 'ebay', enabled)
                                                            }
                                                        />
                                                        <span className="text-sm text-blue-600 font-medium">eBay</span>
                                                    </div>

                                                    {/* AliExpress */}
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={product.marketplaces.aliexpress.enabled}
                                                            onCheckedChange={(enabled) =>
                                                                handleMarketplaceToggle(product.id, 'aliexpress', enabled)
                                                            }
                                                        />
                                                        <span className="text-sm text-red-600 font-medium">AliExpress</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Sync Badges */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {badges.map((badge) => (
                                                        <Badge
                                                            key={badge}
                                                            variant="secondary"
                                                            className={`text-xs ${
                                                                badge === 'AMZ' ? 'bg-orange-100 text-orange-800' :
                                                                    badge === 'eBay' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {badge}
                                                        </Badge>
                                                    ))}
                                                    {badges.length === 0 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            No Sync
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Last Sync */}
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    {product.marketplaces.amazon.enabled && product.marketplaces.amazon.lastSync && (
                                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            AMZ: {product.marketplaces.amazon.lastSync}
                                                        </div>
                                                    )}
                                                    {product.marketplaces.ebay.enabled && product.marketplaces.ebay.lastSync && (
                                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            eBay: {product.marketplaces.ebay.lastSync}
                                                        </div>
                                                    )}
                                                    {product.marketplaces.aliexpress.enabled && product.marketplaces.aliexpress.lastSync && (
                                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Ali: {product.marketplaces.aliexpress.lastSync}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700"
                                                        onClick={() => openEditDialog(product)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700"
                                                        onClick={() => {
                                                            setSelectedProduct(product);
                                                            setIsDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Add Product Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                            Fill in the details of the product you want to add.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                                id="sku"
                                placeholder="Enter product SKU"
                                value={formData.sku}
                                onChange={(e) => handleInputChange('sku', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="Enter product price"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                placeholder="Enter stock quantity"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c !== 'all').map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="image">Image URL</Label>
                            <Input
                                id="image"
                                placeholder="Enter image URL"
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsAddDialogOpen(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                            Add Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update the details of the product.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="edit-name">Product Name</Label>
                            <Input
                                id="edit-name"
                                placeholder="Enter product name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-sku">SKU</Label>
                            <Input
                                id="edit-sku"
                                placeholder="Enter product SKU"
                                value={formData.sku}
                                onChange={(e) => handleInputChange('sku', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-price">Price</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                placeholder="Enter product price"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-stock">Stock</Label>
                            <Input
                                id="edit-stock"
                                type="number"
                                placeholder="Enter stock quantity"
                                value={formData.stock}
                                onChange={(e) => handleInputChange('stock', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c !== 'all').map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="edit-image">Image URL</Label>
                            <Input
                                id="edit-image"
                                placeholder="Enter image URL"
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setIsEditDialogOpen(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleEditProduct} className="bg-blue-600 hover:bg-blue-700">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleDeleteProduct(selectedProduct?.id)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
