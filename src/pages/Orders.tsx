import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Truck, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { getUserOrders, getTrackingInfo } from '@/features/phase2/shipping/shippingService';
import { Order, TrackingInfo } from '@/features/phase2/shipping/types';
import { useCurrency } from '@/features/phase2/currency/useCurrency';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTracking, setSelectedTracking] = useState<TrackingInfo | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const { convertAndFormat } = useCurrency();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getUserOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleTrackShipment = async (trackingNumber: string, carrier: string) => {
    setTrackingLoading(true);
    try {
      const tracking = await getTrackingInfo(trackingNumber, carrier);
      setSelectedTracking(tracking);
    } catch (error) {
      console.error('Tracking error:', error);
    }
    setTrackingLoading(false);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'confirmed':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  const getTrackingStatusColor = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'out_for_delivery':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-purple-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                <Link to="/products">
                  <Button>Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{order.orderNumber}
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                          {order.estimatedDelivery && (
                            <span className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{convertAndFormat(order.total, order.currency)}</p>
                        <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Items */}
                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{convertAndFormat(item.price * item.quantity, order.currency)}</p>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Shipping Info */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Shipping Address
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {order.shippingAddress.fullName}<br />
                            {order.shippingAddress.addressLine1}<br />
                            {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>

                        {order.shippingMethod && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Truck className="h-4 w-4" />
                              Shipping Method
                            </h4>
                            <p className="text-sm">
                              {order.shippingMethod.carrier} - {order.shippingMethod.serviceName}
                            </p>
                            {order.trackingNumber && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => handleTrackShipment(order.trackingNumber!, order.shippingMethod!.carrier)}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Track Shipment
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Shipment Tracking</DialogTitle>
                                    <DialogDescription>
                                      Tracking Number: {order.trackingNumber}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {trackingLoading ? (
                                    <p className="text-center py-8">Loading tracking info...</p>
                                  ) : selectedTracking ? (
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                        <div>
                                          <p className="font-semibold">Current Status</p>
                                          <p className="text-sm text-muted-foreground">{selectedTracking.currentLocation}</p>
                                        </div>
                                        <Badge className={getTrackingStatusColor(selectedTracking.status)}>
                                          {selectedTracking.status.replace('_', ' ')}
                                        </Badge>
                                      </div>

                                      {selectedTracking.estimatedDelivery && (
                                        <div className="p-4 bg-muted rounded-lg">
                                          <p className="font-semibold">Estimated Delivery</p>
                                          <p className="text-sm">{new Date(selectedTracking.estimatedDelivery).toLocaleDateString()}</p>
                                        </div>
                                      )}

                                      <div>
                                        <h4 className="font-semibold mb-3">Tracking History</h4>
                                        <div className="space-y-3">
                                          {selectedTracking.events.map((event, index) => (
                                            <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                                              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                              <div className="flex-1">
                                                <p className="font-medium">{event.status}</p>
                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  {new Date(event.timestamp).toLocaleString()} - {event.location}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>{convertAndFormat(order.subtotal, order.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping</span>
                          <span>{convertAndFormat(order.shipping, order.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax</span>
                          <span>{convertAndFormat(order.tax, order.currency)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{convertAndFormat(order.total, order.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
