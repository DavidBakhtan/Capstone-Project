import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

import type { ProductWithStore } from '@/data/types';
import { fetchProducts } from '@/data/products.api';

const FeaturedProductsSection = () => {
  const [items, setItems] = useState<ProductWithStore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // نجيب منتجات من الـAPI (مع فول-باك داخلي)، ثم نعرض أول 4
    fetchProducts('All')
      .then((list) => {
        if (!cancelled) setItems(list.slice(0, 4));
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message || 'Failed to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="featured-products" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 animated-gradient-text">Featured Products</h2>
          <p className="text-muted-foreground text-lg">
            Discover our handpicked selection of premium products
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground mb-12">Loading…</div>
        )}

        {error && (
          <div className="text-center text-red-500 mb-12">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {items.map((product, index) => (
              <div
                key={product.id ?? `${product.name}-${index}`}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            asChild
            className="glass-button border-sky-400/50 text-sky-400 hover:bg-sky-400/20 hover:text-sky-300 transition-all duration-300"
          >
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
