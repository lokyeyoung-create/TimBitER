import { useState } from 'react';
import { useItems } from './hooks/useItems';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import type { Item } from './types';

function App() {
  const { items, loading, error, createItem, updateItem, deleteItem } = useItems();
  const [showForm, setShowForm] = useState(false);

  const handleCreateItem = async (item: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>) => {
    await createItem(item);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">TimBitER</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {showForm ? 'Cancel' : 'Add New Item'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
              <ItemForm onSubmit={handleCreateItem} onCancel={() => setShowForm(false)} />
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Items ({items.length})
          </h2>
          <ItemList
            items={items}
            loading={loading}
            error={error}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            TimBitER &copy; {new Date().getFullYear()} - Full Stack CRUD Application
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
