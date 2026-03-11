
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import pb from '@/lib/pocketbaseClient';

const SearchBar = ({ onResults, onLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm);
      } else {
        onResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async (term) => {
    if (onLoading) onLoading(true);
    try {
      const filter = `title ~ "${term}" || summary ~ "${term}"`;
      const results = await pb.collection('news').getList(1, 50, {
        filter,
        sort: '-created_at',
        $autoCancel: false
      });
      onResults(results.items);
    } catch (error) {
      console.error('Search error:', error);
      onResults([]);
    } finally {
      if (onLoading) onLoading(false);
    }
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        type="text"
        placeholder="Buscar notícias por título ou resumo..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 bg-white text-gray-900 placeholder:text-gray-500"
      />
    </div>
  );
};

export default SearchBar;
