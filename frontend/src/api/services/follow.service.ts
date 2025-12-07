export const followUser = async (userId: string, token: string) => {
  const res = await fetch(`/api/follows/${userId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const unfollowUser = async (userId: string, token: string) => {
  const res = await fetch(`/api/follows/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getFollowers = async (userId: string) => {
  const res = await fetch(`/api/follows/followers/${userId}`);
  return res.json();
};

export const getFollowing = async (userId: string) => {
  const res = await fetch(`/api/follows/following/${userId}`);
  return res.json();
};

export const checkFollowStatus = async (userId: string, token: string) => {
  const res = await fetch(`/api/follows/check/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getFollowStats = async (userId: string) => {
  const res = await fetch(`/api/follows/stats/${userId}`);
  return res.json();
};
