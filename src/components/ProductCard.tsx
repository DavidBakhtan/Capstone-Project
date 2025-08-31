import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ProductWithStore } from '@/data/types';

interface ProductCardProps {
  product: ProductWithStore;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  // حِمايات بسيطة عشان الداتا تيجي من API أو فولباك
  const price = Number(product.price ?? 0);
  const originalPrice =
    product.originalPrice !== undefined && product.originalPrice !== null
      ? Number(product.originalPrice)
      : undefined;
  const salePercentage =
    product.salePercentage !== undefined && product.salePercentage !== null
      ? Number(product.salePercentage)
      : undefined;
  const isOnSale =
    (product as any).isOnSale !== undefined
      ? Boolean((product as any).isOnSale)
      : !!(salePercentage && salePercentage > 0);

  const productHref = `/product/${product.id ?? encodeURIComponent(product.name)}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="group relative glass-effect rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/10 hover:border-sky-400/50 h-full flex flex-col">
      <Link to={productHref} className="flex flex-col h-full">
        <div className="relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center">
              <span className="text-slate-300 text-sm">No image</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="glass-effect rounded-full p-3 border-white/20">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Store indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 border border-white/20">
            <Store className="h-3 w-3" />
            <span>{product.store ?? 'Main Store'}</span>
          </div>

          {/* Sale badge */}
          {isOnSale && salePercentage !== undefined && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
              SALE {salePercentage}% OFF
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="mb-2">
            {product.category && (
              <span className="text-xs font-medium text-sky-400 bg-sky-400/10 px-2 py-1 rounded-full border border-sky-400/20">
                {product.category}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-sky-400 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              {isOnSale && originalPrice !== undefined && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                ${price.toFixed(2)}
              </span>
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 transition-all duration-300 hover:scale-105 text-white border-0 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add to </span>Cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
