import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const list = await getProducts();
        if (on) setAllProducts(list);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  const product = useMemo(() => {
    if (!id) return undefined;
    return allProducts.find(p => String(p.id) === String(id));
  }, [allProducts, id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => String(p.id) !== String(product.id) && p.category === product.category).slice(0, 4);
  }, [allProducts, product]);

  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fade-in">
          <Link
            to="/products"
            className="inline-flex items-center text-nokNuk-blue hover:text-nokNuk-blue/80 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="animate-slide-up">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-nokNuk-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-nokNuk-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-muted-foreground">(4.8 out of 5)</span>
              </div>
              <p className="text-4xl font-bold text-nokNuk-gold mb-6">
                ${product.price}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-nokNuk-blue" />
                <span className="text-sm">Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Truck className="h-5 w-5 text-nokNuk-gold" />
                <span className="text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-nokNuk-blue" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-nokNuk-blue hover:bg-nokNuk-blue/90 transition-all duration-200 hover:scale-105"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Free shipping on orders over $100. Secure checkout guaranteed.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
