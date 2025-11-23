import { useState, useEffect, useMemo } from 'react';
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';

const RECENT_SEARCHES_KEY = 'gloventra_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export const useSearch = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearches = (searches: string[]) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  // Add a search term to recent searches
  const addRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const trimmedTerm = searchTerm.trim().toLowerCase();
    const newRecentSearches = [
      trimmedTerm,
      ...recentSearches.filter(term => term !== trimmedTerm)
    ].slice(0, MAX_RECENT_SEARCHES);

    saveRecentSearches(newRecentSearches);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    saveRecentSearches([]);
  };

  // Get search suggestions based on products
  const getSearchSuggestions = (query: string): string[] => {
    if (!query.trim() || query.length < 2) return [];

    const searchTerms = new Set<string>();
    const lowercaseQuery = query.toLowerCase();

    mockProducts.forEach((product) => {
      // Add product name if it matches
      if (product.name.toLowerCase().includes(lowercaseQuery)) {
        searchTerms.add(product.name);
      }

      // Add category if it matches
      if (product.category.toLowerCase().includes(lowercaseQuery)) {
        searchTerms.add(product.category);
      }

      // Add description words if they match
      const descriptionWords = product.description.toLowerCase().split(' ');
      descriptionWords.forEach(word => {
        if (word.length > 3 && word.includes(lowercaseQuery)) {
          searchTerms.add(word);
        }
      });
    });

    return Array.from(searchTerms).slice(0, 6);
  };

  // Search products
  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return mockProducts;

    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      );
    });
  };

  // Get popular search terms (based on product names and categories)
  const popularSearches = useMemo(() => {
    const terms = new Set<string>();
    mockProducts.forEach(product => {
      terms.add(product.category);
      // Add brand or key terms from product names
      const nameWords = product.name.split(' ');
      nameWords.forEach(word => {
        if (word.length > 3 && !['the', 'and', 'with', 'for'].includes(word.toLowerCase())) {
          terms.add(word);
        }
      });
    });
    return Array.from(terms).slice(0, 8);
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    getSearchSuggestions,
    searchProducts,
    popularSearches,
  };
};
