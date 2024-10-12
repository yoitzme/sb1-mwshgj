import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, onValue, off, query, limitToLast } from 'firebase/database';import { useAuthState } from 'react-firebase-hooks/auth';
import { Activity } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const [user] = useAuthState(auth);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const activitiesRef = query(ref(database, 'activities'), limitToLast(10));
      onValue(activitiesRef, (snapshot) => {
        if (snapshot.exists()) {
          const activitiesData = Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            ...value as object,
          }));
          setActivities(activitiesData.reverse());
        }
      });

      return () => {
        off(activitiesRef);
      };
    }
  }, [user]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Activity className="mr-2" /> Activity Feed
      </h3>
      <ul className="space-y-2">
        {activities.map((activity) => (
          <li key={activity.id} className="bg-white p-3 rounded-lg shadow">
            <p className="text-sm text-gray-600">{activity.userId} {activity.action}</p>
            <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;