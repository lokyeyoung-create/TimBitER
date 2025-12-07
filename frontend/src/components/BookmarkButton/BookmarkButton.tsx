import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isBookmarked, createBookmark, deleteBookmark } from '../../api/services/bookmark.service';

interface Props {
  itemId: string;
  itemType?: string;
  itemName?: string;
}

const BookmarkButton: React.FC<Props> = ({ itemId, itemType = 'external', itemName }) => {
  const { user, token } = useAuth();
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user || !token) return;
      try {
        const res = await isBookmarked(itemId, token);
        if (mounted) setBookmarked(res?.bookmarked === true || res?.isBookmarked === true);
      } catch (e) {}
    };
    load();
    return () => { mounted = false; };
  }, [itemId, user, token]);

  const toggle = async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      if (bookmarked) {
        if ((bookmarked as any) && (bookmarked as any)._id) {
          // not ideal: if component receives full bookmark object, handle
          await deleteBookmark((bookmarked as any)._id, token);
        } else {
          // fallback: call server to delete by item id
          await fetch(`/api/bookmarks/item/${itemId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        }
        setBookmarked(false);
      } else {
        await createBookmark({ externalItemId: itemId, externalItemType: itemType, externalItemName: itemName }, token);
        setBookmarked(true);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-sm ${bookmarked ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
};

export default BookmarkButton;
