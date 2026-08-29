import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Check, ShoppingCart, X } from "lucide-react";
import type { Product } from "@shared/commerce/types";

interface ProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  productHandle?: string;
  context?: "education" | "training" | "practices" | "landing";
}

export function ProductPopup({ isOpen, onClose, productHandle, context }: ProductPopupProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem, loading } = useCart();
  const { data: product, isLoading: isProductLoading } = trpc.commerce.products.byHandle.useQuery(
    { handle: productHandle || "" },
    { enabled: Boolean(productHandle) && isOpen }
  );
  const { data: allProducts = [], isLoading: isCatalogLoading } = trpc.commerce.products.list.useQuery(
    {},
    { enabled: !productHandle && isOpen }
  );

  useEffect(() => {
    if (productHandle && product) setSelectedProduct(product);
    if (!productHandle) setSelectedProduct(null);
  }, [product, productHandle]);

  const handleClose = () => {
    setSelectedProduct(null);
    onClose();
  };

  const handleAddToCart = async () => {
    if (selectedProduct?.variants[0]) await addItem(selectedProduct.variants[0].id, 1);
  };

  const contextCopy = {
    education: "Product information for nutrition and daily care",
    training: "Equipment information for a structured training plan",
    practices: "Product information to discuss with your veterinarian",
    landing: "Product information from the connected storefront",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-slate-200 bg-white text-slate-900">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-semibold text-[#12343b]">{selectedProduct ? selectedProduct.title : "Choose a product"}</DialogTitle>
              <DialogDescription className="mt-2 text-slate-500">{contextCopy[context || "landing"]}</DialogDescription>
            </div>
            <button type="button" onClick={handleClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close"><X className="h-5 w-5" aria-hidden="true" /></button>
          </div>
        </DialogHeader>

        {productHandle && isProductLoading && <div className="flex items-center justify-center py-12"><div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#0c5660]" /></div>}

        {!productHandle && !selectedProduct && (isCatalogLoading ? <div className="flex items-center justify-center py-12"><div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-[#0c5660]" /></div> : <div className="grid gap-3 sm:grid-cols-2">{allProducts.map((item) => <button type="button" key={item.id} onClick={() => setSelectedProduct(item)} className="flex gap-3 rounded-xl border border-slate-200 p-3 text-start transition hover:border-[#86bdb5] hover:bg-[#f3f7f7]"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.images[0]?.url ? <img src={item.images[0].url} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>}</div><span className="min-w-0"><span className="block truncate text-sm font-semibold text-[#12343b]">{item.title}</span><span className="mt-1 block text-sm text-slate-500">{item.priceRange.min.amount} {item.priceRange.min.currencyCode}</span></span></button>)}</div>)}

        {selectedProduct && !isProductLoading && <div className="space-y-6">
          <div className="flex justify-center rounded-xl bg-[#f3f7f7] p-5">{selectedProduct.images[0]?.url ? <img src={selectedProduct.images[0].url} alt={selectedProduct.images[0].altText || selectedProduct.title} className="h-64 w-64 rounded-lg object-cover" /> : <div className="flex h-64 w-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">No source image supplied</div>}</div>
          <div><p className="text-xl font-semibold text-[#12343b]">{selectedProduct.title}</p><p className="mt-1 text-sm text-slate-500">{selectedProduct.vendor || "Connected storefront"}</p><p className="mt-4 text-3xl font-semibold text-[#0c5660]">{selectedProduct.priceRange.min.amount} <span className="text-sm font-medium text-slate-500">{selectedProduct.priceRange.min.currencyCode}</span></p><p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-600">{selectedProduct.description || "No description supplied by the connected storefront."}</p></div>
          {selectedProduct.tags.length > 0 && <div className="flex flex-wrap gap-2">{selectedProduct.tags.slice(0, 6).map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">{tag}</span>)}</div>}
          <div className="flex items-center gap-2 text-sm">{selectedProduct.variants[0]?.availableForSale ? <><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-emerald-700">In stock</span></> : <><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-red-700">Out of stock</span></>}</div>
          <div className="flex gap-3 border-t border-slate-200 pt-5"><Button onClick={handleAddToCart} disabled={!selectedProduct.variants[0]?.availableForSale || loading} className="flex-1 bg-[#0c5660] text-white hover:bg-[#08434b]"><ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />{loading ? "Adding..." : "Add to cart"}</Button>{!productHandle && <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)} className="border-slate-200 text-slate-700">Choose another</Button>}</div>
        </div>}

        {!productHandle && !isCatalogLoading && allProducts.length === 0 && <div className="py-10 text-center text-sm text-slate-500">No products are available from the connected storefront.</div>}
      </DialogContent>
    </Dialog>
  );
}
