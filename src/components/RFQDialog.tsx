import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useB2B } from '@/context/B2BContext';
import { Product } from '@/types/product';

interface RFQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

const RFQDialog = ({ open, onOpenChange, product }: RFQDialogProps) => {
  const { submitRFQ } = useB2B();
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || parseInt(quantity) < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRFQ(product.id, parseInt(quantity), message);

      toast.success('Quote request submitted successfully! We will contact you within 24 hours.');
      onOpenChange(false);

      // Reset form
      setQuantity('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit quote request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Request a custom quote for bulk orders of {product.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Input id="product" value={product.name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter desired quantity"
                required
              />
              <p className="text-sm text-muted-foreground">
                Minimum order quantity may apply for B2B pricing
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Details (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your requirements, delivery timeline, or any special requests..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RFQDialog;

