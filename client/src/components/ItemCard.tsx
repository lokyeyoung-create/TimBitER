import { useState } from 'react';
import type { FC } from 'react';
import type { Item } from '../types';
import ItemForm from './ItemForm';

interface ItemCardProps {
  item: Item;
  onUpdate: (id: string, item: Partial<Item>) => Promise<Item>;
  onDelete: (id: string) => Promise<boolean>;
}

const ItemCard: FC<ItemCardProps> = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (updatedItem: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>) => {
    await onUpdate(item._id, updatedItem);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setIsDeleting(true);
      try {
        await onDelete(item._id);
      } catch {
        setIsDeleting(false);
      }
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Item</h3>
        <ItemForm
          onSubmit={handleUpdate}
          initialValues={item}
          onCancel={() => setIsEditing(false)}
          submitLabel="Update Item"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {item.category}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-green-600">
          ${item.price.toFixed(2)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Added: {new Date(item.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ItemCard;
