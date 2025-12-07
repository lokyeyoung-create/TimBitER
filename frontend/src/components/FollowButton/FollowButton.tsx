import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { checkFollowStatus, followUser, unfollowUser } from '../../api/services/follow.service';

interface Props {
  targetUserId: string;
}

const FollowButton: React.FC<Props> = ({ targetUserId }) => {
  const { user, token } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user || !token) return;
      try {
        const res = await checkFollowStatus(targetUserId, token);
        if (mounted) setIsFollowing(res?.following === true || res?.isFollowing === true);
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => { mounted = false; };
  }, [targetUserId, user, token]);

  const toggleFollow = async () => {
    if (!user || !token) return; // maybe prompt login in UI
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(targetUserId, token);
        setIsFollowing(false);
      } else {
        await followUser(targetUserId, token);
        setIsFollowing(true);
      }
    } catch (e) {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  // hide button if not logged in or viewing own profile
  if (!user || user._id === targetUserId) return null;

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`px-3 py-1 rounded-md text-sm ${isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
