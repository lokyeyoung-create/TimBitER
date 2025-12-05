import type { FC } from 'react';
import type { Item } from '../types';
import ItemCard from './ItemCard';

interface ItemListProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: string, item: Partial<Item>) => Promise<Item>;
  onDelete: (id: string) => Promise<boolean>;
}

const ItemList: FC<ItemListProps> = ({ items, loading, error, onUpdate, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No items found</p>
        <p className="text-sm">Add your first item using the form above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ItemList;
