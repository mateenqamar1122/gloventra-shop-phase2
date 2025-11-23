import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { useCurrency } from '@/features/phase2/currency/useCurrency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { convertAndFormat } = useCurrency();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="group overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 animate-fade-in">
        <div className="relative overflow-hidden aspect-square bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          {product.marketplace && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.marketplace}
            </div>
          )}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {convertAndFormat(product.price)}
              </span>
              {product.stock !== undefined && (
                <p className="text-sm text-muted-foreground mt-1">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </p>
              )}
              {product.rating && (
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 fill-accent text-accent" />
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <Button
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
