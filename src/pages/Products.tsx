import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategories, getProducts } from '@/lib/api';

const Products: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts()
        ]);
        if (on) {
          setCategories(cats);
          setProducts(prods);
        }
      } catch {
        if (on) {
          setCategories(['All']);
          setProducts([]);
        }
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.store || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    return list.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'store':
          return (a.store || '').localeCompare(b.store || '');
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground">
            Discover our complete collection of premium products from top stores
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "hover:bg-sky-500 hover:text-white"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="store">Sort by Store</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Results Info */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
