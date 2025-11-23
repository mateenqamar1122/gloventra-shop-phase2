import React from 'react';
import { mockProducts } from '@/data/mockProducts';
import ProductCard from '@/components/ProductCard';

const Fashion = () => {
  const fashionProducts = mockProducts.filter(product => product.category === 'Fashion');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Fashion</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fashionProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Fashion;