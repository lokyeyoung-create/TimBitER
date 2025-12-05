import { useState, useEffect, useCallback } from 'react';
import type { Item, ApiResponse } from '../types';

const API_BASE_URL = '/api/items';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_BASE_URL);
      const data: ApiResponse<Item[]> = await response.json();
      if (data.success && data.data) {
        setItems(data.data);
      } else {
        setError(data.message || 'Failed to fetch items');
      }
    } catch {
      setError('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = useCallback(
    async (item: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>) => {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      const data: ApiResponse<Item> = await response.json();
      if (data.success && data.data) {
        setItems((prev) => [data.data!, ...prev]);
        return data.data;
      }
      throw new Error(data.message || 'Failed to create item');
    },
    []
  );

  const updateItem = useCallback(
    async (id: string, item: Partial<Item>) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      const data: ApiResponse<Item> = await response.json();
      if (data.success && data.data) {
        setItems((prev) =>
          prev.map((i) => (i._id === id ? data.data! : i))
        );
        return data.data;
      }
      throw new Error(data.message || 'Failed to update item');
    },
    []
  );

  const deleteItem = useCallback(async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    const data: ApiResponse<null> = await response.json();
    if (data.success) {
      setItems((prev) => prev.filter((item) => item._id !== id));
      return true;
    }
    throw new Error(data.message || 'Failed to delete item');
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
