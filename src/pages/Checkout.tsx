import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle, MapPin, DollarSign, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useCurrency } from '@/features/phase2/currency/useCurrency';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  getShippingRates, 
  calculateShippingWeight, 
  type ShippingOption 
} from '@/features/phase2/shipping/shippingService';
import {
  calculateCheckoutTotals,
  validateShippingAddress,
  createPaymentIntent,
  processPayment,
  type ShippingAddress,
  type PaymentDetails,
  type CheckoutCalculation,
} from '@/features/phase2/checkout/checkoutService';
import {
  shippingAddressSchema,
  paymentDetailsSchema,
} from '@/features/phase2/checkout/checkoutValidation';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const { convertAndFormat, currency } = useCurrency();
  
  const [loading, setLoading] = useState(false);
  const [calculations, setCalculations] = useState<CheckoutCalculation | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [loadingShipping, setLoadingShipping] = useState(false);
  
  // Shipping form state
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });
  
  // Payment form state
  const [payment, setPayment] = useState<PaymentDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  // Fetch shipping rates when destination changes
  useEffect(() => {
    const fetchShippingRates = async () => {
      if (!shipping.country || !shipping.city || !shipping.postalCode) {
        return;
      }

      setLoadingShipping(true);
      try {
        const weight = calculateShippingWeight(cart);
        const rates = await getShippingRates(
          {
            destinationCountry: shipping.country,
            destinationCity: shipping.city,
            destinationPostalCode: shipping.postalCode,
            weight,
            items: cart.map(item => ({
              productId: String(item.id),
              quantity: item.quantity,
              price: item.price,
            })),
          },
          currency
        );
        setShippingOptions(rates);
        // Auto-select first option if none selected
        if (rates.length > 0 && !selectedShipping) {
          setSelectedShipping(rates[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch shipping rates:', error);
      }
      setLoadingShipping(false);
    };

    fetchShippingRates();
  }, [shipping.country, shipping.city, shipping.postalCode, cart, currency]);

  // Calculate totals when cart, currency, or shipping changes
  useEffect(() => {
    const loadCalculations = async () => {
      if (cart.length === 0) return;
      
      const selectedOption = shippingOptions.find(opt => opt.id === selectedShipping);
      
      const calc = await calculateCheckoutTotals(
        cart,
        currency,
        shipping.country ? shipping : undefined
      );
      
      // Override shipping cost with selected option
      if (selectedOption) {
        calc.shipping = selectedOption.rate;
        calc.total = calc.subtotal + calc.shipping + calc.tax;
      }
      
      setCalculations(calc);
    };

    loadCalculations();
  }, [cart, currency, shipping.country, selectedShipping, shippingOptions]);

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePaymentChange = (field: keyof PaymentDetails, value: string) => {
    setPayment(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Record<string, string> = {};

    // Validate shipping address
    const shippingResult = shippingAddressSchema.safeParse(shipping);
    if (!shippingResult.success) {
      shippingResult.error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
    } else {
      // Backend validation
      const addressValidation = await validateShippingAddress(shipping);
      if (!addressValidation.valid) {
        toast.error(addressValidation.message || 'Invalid shipping address');
        return false;
      }
    }

    // Validate payment details
    const paymentResult = paymentDetailsSchema.safeParse(payment);
    if (!paymentResult.success) {
      paymentResult.error.errors.forEach(err => {
        newErrors[err.path[0] as string] = err.message;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!calculations) {
      toast.error('Please wait while we calculate your order total');
      return;
    }

    setLoading(true);

    try {
      // Validate form
      const isValid = await validateForm();
      if (!isValid) {
        setLoading(false);
        toast.error('Please fix the errors in the form');
        return;
      }

      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        calculations.total,
        currency,
        paymentMethod,
        cart,
        shipping
      );

      // Process payment
      const result = await processPayment(paymentIntent.id, payment);

      if (result.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Checkout</h1>

        {/* Currency Conversion Notice */}
        {currency !== 'USD' && (
          <Alert className="mb-6 border-accent/50 bg-accent/5">
            <DollarSign className="h-4 w-4 text-accent" />
            <AlertDescription className="text-sm text-foreground">
              Prices are displayed in {currency}. Your payment will be processed in {currency} at the current exchange rate.
              Original prices are in USD.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping & Payment Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shipping.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className={`mt-1 rounded-xl ${errors.fullName ? 'border-destructive' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="addressLine1">Address Line 1</Label>
                    <Input
                      id="addressLine1"
                      value={shipping.addressLine1}
                      onChange={(e) => handleShippingChange('addressLine1', e.target.value)}
                      placeholder="123 Main Street"
                      className={`mt-1 rounded-xl ${errors.addressLine1 ? 'border-destructive' : ''}`}
                    />
                    {errors.addressLine1 && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.addressLine1}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                    <Input
                      id="addressLine2"
                      value={shipping.addressLine2}
                      onChange={(e) => handleShippingChange('addressLine2', e.target.value)}
                      placeholder="Apt, Suite, Floor (optional)"
                      className="mt-1 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shipping.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        placeholder="New York"
                        className={`mt-1 rounded-xl ${errors.city ? 'border-destructive' : ''}`}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={shipping.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        placeholder="NY"
                        className={`mt-1 rounded-xl ${errors.state ? 'border-destructive' : ''}`}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shipping.postalCode}
                        onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                        placeholder="10001"
                        className={`mt-1 rounded-xl ${errors.postalCode ? 'border-destructive' : ''}`}
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.postalCode}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={shipping.country}
                        onValueChange={(value) => handleShippingChange('country', value)}
                      >
                        <SelectTrigger className="mt-1 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={shipping.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`mt-1 rounded-xl ${errors.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Shipping Options */}
              {shippingOptions.length > 0 && (
                <Card className="p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">Shipping Method</h2>
                  </div>

                  {loadingShipping ? (
                    <p className="text-muted-foreground">Loading shipping options...</p>
                  ) : (
                    <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                              selectedShipping === option.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <RadioGroupItem value={option.id} className="mt-1" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-foreground">
                                  {option.carrier} - {option.serviceName}
                                </p>
                                <p className="font-bold text-primary">
                                  {convertAndFormat(option.rate, option.currency)}
                                </p>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {option.estimatedDays} business days
                                </span>
                                <span>
                                  Est. delivery: {new Date(option.estimatedDeliveryDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </Card>
              )}

              {/* Payment Details */}
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value: 'stripe' | 'paypal') => setPaymentMethod(value)}
                    >
                      <SelectTrigger className="mt-1 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'stripe' && (
                    <>
                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          value={payment.cardholderName}
                          onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                          placeholder="John Doe"
                          className={`mt-1 rounded-xl ${errors.cardholderName ? 'border-destructive' : ''}`}
                        />
                        {errors.cardholderName && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cardholderName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            value={payment.cardNumber}
                            onChange={(e) => handlePaymentChange('cardNumber', e.target.value.replace(/\D/g, ''))}
                            placeholder="4242424242424242"
                            maxLength={19}
                            className={`mt-1 rounded-xl ${errors.cardNumber ? 'border-destructive' : ''}`}
                          />
                          <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            value={payment.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              handlePaymentChange('expiryDate', value);
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className={`mt-1 rounded-xl ${errors.expiryDate ? 'border-destructive' : ''}`}
                          />
                          {errors.expiryDate && (
                            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            value={payment.cvc}
                            onChange={(e) => handlePaymentChange('cvc', e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            maxLength={4}
                            className={`mt-1 rounded-xl ${errors.cvc ? 'border-destructive' : ''}`}
                          />
                          {errors.cvc && (
                            <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.cvc}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === 'paypal' && (
                    <Alert className="border-accent/50 bg-accent/5">
                      <AlertDescription className="text-sm text-foreground">
                        You will be redirected to PayPal to complete your payment securely.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-muted/50 p-4 rounded-xl flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 rounded-2xl sticky top-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Order Summary</h2>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm text-primary whitespace-nowrap">
                        {convertAndFormat(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{calculations ? convertAndFormat(calculations.subtotal) : '...'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{calculations ? (calculations.shipping === 0 ? 'Free' : convertAndFormat(calculations.shipping)) : '...'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (10%)</span>
                    <span>{calculations ? convertAndFormat(calculations.tax) : '...'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
                    <span>Total ({currency})</span>
                    <span className="text-primary">{calculations ? convertAndFormat(calculations.total) : '...'}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 mt-6"
                  disabled={loading || !calculations}
                >
                  {loading ? 'Processing...' : `Pay ${calculations ? convertAndFormat(calculations.total) : '...'}`}
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
