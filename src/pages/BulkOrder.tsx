import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BulkOrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price?: number;
  errors?: string[];
}

const BulkOrder = () => {
  const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!['csv', 'xlsx', 'xls'].includes(fileExtension || '')) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    setIsProcessing(true);

    try {
      if (fileExtension === 'csv') {
        await parseCSV(file);
      } else {
        toast.info('Excel parsing requires additional library. Please use CSV for now.');
        // For Excel, you would use a library like 'xlsx'
        // import * as XLSX from 'xlsx';
      }
    } catch (error) {
      toast.error('Error parsing file. Please check the format.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());

          if (lines.length < 2) {
            toast.error('File must contain header and at least one data row');
            reject(new Error('Invalid file format'));
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          const productIdIndex = headers.findIndex(h => h.includes('product') && h.includes('id'));
          const quantityIndex = headers.findIndex(h => h.includes('quantity'));

          if (productIdIndex === -1 || quantityIndex === -1) {
            toast.error('CSV must contain "product_id" and "quantity" columns');
            reject(new Error('Missing required columns'));
            return;
          }

          const items: BulkOrderItem[] = [];

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const productId = values[productIdIndex];
            const quantity = parseInt(values[quantityIndex]);

            if (productId && !isNaN(quantity)) {
              items.push({
                productId,
                quantity,
                errors: quantity < 1 ? ['Quantity must be at least 1'] : undefined,
              });
            }
          }

          setOrderItems(items);
          toast.success(`Parsed ${items.length} items successfully`);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  };

  const downloadTemplate = () => {
    const csvContent = 'product_id,quantity,notes\n1,100,Example order\n2,50,Another example\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_order_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const submitBulkOrder = async () => {
    if (orderItems.length === 0) {
      toast.error('No items to submit');
      return;
    }

    const hasErrors = orderItems.some(item => item.errors && item.errors.length > 0);
    if (hasErrors) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setIsProcessing(true);

    try {
      // In production, call your Django API:
      // const response = await axios.post('/api/b2b/bulk-orders/', { items: orderItems });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Bulk order submitted successfully!');
      setOrderItems([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('Failed to submit bulk order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <FileSpreadsheet className="w-8 h-8" />
              Bulk Order Upload
            </CardTitle>
            <CardDescription>
              Upload a CSV or Excel file to place orders for multiple products at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your file must include columns: <strong>product_id</strong> and <strong>quantity</strong>.
                Download our template to get started.
              </AlertDescription>
            </Alert>

            {/* File Upload Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <Upload className="mr-2 w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Upload CSV/Excel File'}
                  </Button>
                </label>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={downloadTemplate}
              >
                <Download className="mr-2 w-5 h-5" />
                Download Template
              </Button>
            </div>

            {/* Preview Table */}
            {orderItems.length > 0 && (
              <>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.productId}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.errors && item.errors.length > 0 ? (
                              <span className="text-destructive text-sm">{item.errors.join(', ')}</span>
                            ) : (
                              <span className="text-green-600 text-sm">✓ Valid</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    Total Items: <strong>{orderItems.length}</strong>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOrderItems([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      size="lg"
                      onClick={submitBulkOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Submitting...' : 'Submit Bulk Order'}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* File Format Guide */}
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">CSV Format Example:</h3>
              <pre className="text-sm bg-background p-3 rounded border">
{`product_id,quantity
1,100
2,50
3,200`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkOrder;

