export const createBookmark = async (payload: any, token: string) => {
  const res = await fetch(`/api/bookmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteBookmark = async (bookmarkId: string, token: string) => {
  const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getUserBookmarks = async (userId: string) => {
  const res = await fetch(`/api/bookmarks/user/${userId}`);
  return res.json();
};

export const isBookmarked = async (itemId: string, token: string) => {
  const res = await fetch(`/api/bookmarks/check/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const deleteBookmarkByItem = async (itemId: string, token: string) => {
  const res = await fetch(`/api/bookmarks/item/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
