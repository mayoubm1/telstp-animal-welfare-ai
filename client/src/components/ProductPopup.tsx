import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, X } from 'lucide-react';
import type { Product } from '@shared/commerce/types';

interface ProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productHandle?: string;
  context?: 'education' | 'training' | 'practices' | 'landing';
}

export function ProductPopup({ isOpen, onClose, productHandle, context }: ProductPopupProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem, loading } = useCart();

  // Fetch product if handle provided
  const { data: product, isLoading } = trpc.commerce.products.byHandle.useQuery(
    { handle: productHandle || '' },
    { enabled: Boolean(productHandle) && isOpen }
  );

  // Fetch all products if no specific handle
  const { data: allProducts = [] } = trpc.commerce.products.list.useQuery(
    {},
    { enabled: !productHandle && isOpen }
  );

  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    } else if (!productHandle && allProducts.length > 0) {
      setSelectedProduct(allProducts[0]);
    }
  }, [product, productHandle, allProducts]);

  const handleAddToCart = async () => {
    if (selectedProduct?.variants[0]) {
      await addItem(selectedProduct.variants[0].id, 1);
      // Cart context will open the drawer automatically
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    onClose();
  };

  if (!selectedProduct && !isLoading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-amber-400/30">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-amber-200">
                🛍️ Where to Get It
              </DialogTitle>
              <DialogDescription className="text-amber-100/60 mt-2">
                {context === 'education' && 'Recommended product for pet nutrition'}
                {context === 'training' && 'Essential equipment for training success'}
                {context === 'practices' && 'Recommended by veterinary experts'}
                {context === 'landing' && 'Premium pet care products'}
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-amber-400/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-amber-200" />
            </button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400" />
          </div>
        ) : selectedProduct ? (
          <div className="space-y-6">
            {/* Product Image */}
            <div className="flex justify-center">
              {selectedProduct.images[0] ? (
                <img
                  src={selectedProduct.images[0].url}
                  alt={selectedProduct.title}
                  className="w-64 h-64 object-cover rounded-lg border border-amber-400/20"
                />
              ) : (
                <div className="w-64 h-64 bg-slate-800 rounded-lg border border-amber-400/20 flex items-center justify-center">
                  <span className="text-amber-100/40">No image</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-amber-200">{selectedProduct.title}</h3>
                <p className="text-amber-100/60 text-sm mt-1">
                  By {selectedProduct.vendor || 'Premium Vendor'}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-amber-400">
                  {selectedProduct.priceRange.min.amount}
                </span>
                <span className="text-amber-200">
                  {selectedProduct.priceRange.min.currencyCode}
                </span>
                {selectedProduct.priceRange.max.amount !== selectedProduct.priceRange.min.amount && (
                  <>
                    <span className="text-amber-100/40">to</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {selectedProduct.priceRange.max.amount}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-amber-100/70 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Tags */}
              {selectedProduct.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.slice(0, 5).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-xs text-amber-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Availability */}
              <div className="flex items-center gap-2">
                {selectedProduct.variants[0]?.availableForSale ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-300">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                    <span className="text-red-300">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-amber-400/20">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedProduct.variants[0]?.availableForSale || loading}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-amber-400/50 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {loading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="border-amber-400/30 text-amber-200 hover:bg-amber-400/10"
              >
                Continue Shopping
              </Button>
            </div>

            {/* Other Products */}
            {allProducts.length > 1 && (
              <div className="pt-4 border-t border-amber-400/20">
                <p className="text-sm text-amber-100/60 mb-3">Other Recommended Products:</p>
                <div className="grid grid-cols-2 gap-2">
                  {allProducts
                    .filter((p) => p.id !== selectedProduct.id)
                    .slice(0, 3)
                    .map((product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="p-3 bg-slate-800/50 border border-amber-400/20 rounded-lg hover:border-amber-400/50 transition-colors text-left"
                      >
                        <p className="text-sm font-semibold text-amber-200 truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-amber-100/60">
                          {product.priceRange.min.amount} {product.priceRange.min.currencyCode}
                        </p>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
