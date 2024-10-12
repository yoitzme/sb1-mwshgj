import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, set, push, onValue, off } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { UserPlus, Users } from 'lucide-react';

const FriendSystem: React.FC = () => {
  const [user] = useAuthState(auth);
  const [friendId, setFriendId] = useState('');
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const friendsRef = ref(database, `users/${user.uid}/friends`);
      onValue(friendsRef, (snapshot) => {
        if (snapshot.exists()) {
          setFriends(Object.keys(snapshot.val()));
        }
      });

      return () => {
        off(friendsRef);
      };
    }
  }, [user]);

  const addFriend = () => {
    if (user && friendId) {
      const friendRef = ref(database, `users/${user.uid}/friends/${friendId}`);
      set(friendRef, true);
      setFriendId('');
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Users className="mr-2" /> Friends
      </h3>
      <div className="flex mb-4">
        <input
          type="text"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          placeholder="Enter friend's user ID"
          className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addFriend}
          className="bg-blue-500 text-white py-2 px-4 rounded-r-lg hover:bg-blue-600 transition duration-200 flex items-center"
        >
          <UserPlus className="mr-2" /> Add Friend
        </button>
      </div>
      <ul className="list-disc pl-5">
        {friends.map((friendId) => (
          <li key={friendId}>{friendId}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendSystem;