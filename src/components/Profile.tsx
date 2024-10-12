import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, set, get } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { User, Edit } from 'lucide-react';
import FriendSystem from './FriendSystem';
import ActivityFeed from './ActivityFeed';

const defaultTemplate = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f0f0; border-radius: 10px;">
  <h1 style="color: #333; text-align: center;">Welcome to My Profile!</h1>
  <p style="color: #666;">This is my awesome profile page. Feel free to customize it!</p>
</div>
`;

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [template, setTemplate] = useState(defaultTemplate);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}/profile`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setTemplate(snapshot.val().template);
        }
      });
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}/profile`);
      set(userRef, { template });
      setIsEditing(false);

      // Add activity to the feed
      const activityRef = ref(database, 'activities');
      const newActivityRef = push(activityRef);
      set(newActivityRef, {
        userId: user.uid,
        action: 'updated their profile',
        timestamp: Date.now(),
      });
    }
  };

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <User className="mr-2" /> My Profile
      </h2>
      {isEditing ? (
        <div>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full h-64 p-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Save
          </button>
        </div>
      ) : (
        <div>
          <div dangerouslySetInnerHTML={{ __html: template }} />
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
          >
            <Edit className="mr-2" /> Edit Profile
          </button>
        </div>
      )}
      <FriendSystem />
      <ActivityFeed />
    </div>
  );
};

export default Profile;