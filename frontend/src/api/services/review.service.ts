export const createReview = async (payload: any, token: string) => {
  const res = await fetch(`/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const getReviewsByItem = async (itemId: string) => {
  const res = await fetch(`/api/reviews/item/${itemId}`);
  return res.json();
};

export const getReviewsByUser = async (userId: string) => {
  const res = await fetch(`/api/reviews/user/${userId}`);
  return res.json();
};

export const updateReview = async (reviewId: string, payload: any, token: string) => {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteReview = async (reviewId: string, token: string) => {
  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getItemRating = async (itemId: string) => {
  const res = await fetch(`/api/reviews/item/${itemId}/rating`);
  return res.json();
};
