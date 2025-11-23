import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, FileText, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/mockProducts';
import { toast } from 'sonner';
import { useCurrency } from '@/features/phase2/currency/useCurrency';
import { useB2B } from '@/context/B2BContext';
import RFQDialog from '@/components/RFQDialog';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { convertAndFormat } = useCurrency();
  const { isB2BUser, getB2BPricing } = useB2B();
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const product = mockProducts.find((p) => p.id === Number(id));
  const b2bPricing = product ? getB2BPricing(product.id) : null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col lg:col-span-2">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-foreground">{product.name}</h1>

            {product.rating && (
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-accent text-accent'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-muted-foreground">
                  {product.rating.toFixed(1)} out of 5
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-5xl font-bold text-primary mb-2">
                {b2bPricing && isB2BUser
                  ? convertAndFormat(b2bPricing.b2bPrice)
                  : convertAndFormat(product.price)
                }
                {b2bPricing && isB2BUser && (
                  <span className="ml-3 text-2xl line-through text-muted-foreground">
                    {convertAndFormat(product.price)}
                  </span>
                )}
              </p>

              {/* B2B Pricing Alert */}
              {isB2BUser && b2bPricing && (
                <Alert className="mb-4 border-primary/50 bg-primary/5">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-primary">B2B Price: {convertAndFormat(b2bPricing.b2bPrice)}</strong>
                        <p className="text-sm mt-1">
                          Min Order: {b2bPricing.minQuantity} units
                          {b2bPricing.maxQuantity && ` | Max: ${b2bPricing.maxQuantity} units`}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-4">
                        Save {Math.round(((product.price - b2bPricing.b2bPrice) / product.price) * 100)}%
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {!isB2BUser && (
                <Alert className="mb-4">
                  <AlertDescription className="text-sm">
                    💼 <strong>Business customer?</strong> Register for a B2B account to access wholesale pricing and bulk ordering features.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-foreground">Product Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Premium quality materials</li>
                <li>• 1-year warranty included</li>
                <li>• Free shipping on orders over $100</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              {product.inStock ? (
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-lg flex-grow md:flex-grow-0"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Add to Cart
                </Button>
              ) : (
                <Button size="lg" disabled className="rounded-full text-lg flex-grow md:flex-grow-0">
                  Out of Stock
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-lg flex-grow md:flex-grow-0"
                onClick={() => setIsRFQOpen(true)}
              >
                <FileText className="mr-2 w-5 h-5" />
                Request a Quote
              </Button>
            </div>

            {/* RFQ Dialog */}
            {product && (
              <RFQDialog
                open={isRFQOpen}
                onOpenChange={setIsRFQOpen}
                product={product}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;