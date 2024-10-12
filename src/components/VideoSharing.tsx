import React, { useState, useEffect } from 'react';
import { auth, database, storage } from '../firebase';
import { ref as dbRef, push, set, get, query, limitToLast } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import ReactPlayer from 'react-player';
import { Video, Upload } from 'lucide-react';

const VideoSharing: React.FC = () => {
  // ... (previous code remains the same)

  const handleUpload = async () => {
    if (user && videoFile) {
      setUploading(true);
      const videoRef = storageRef(storage, `videos/${user.uid}/${Date.now()}_${videoFile.name}`);
      try {
        const snapshot = await uploadBytes(videoRef, videoFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const newVideoRef = push(dbRef(database, 'videos'));
        await set(newVideoRef, {
          userId: user.uid,
          url: downloadURL,
          timestamp: Date.now(),
        });

        // Add activity to the feed
        const activityRef = dbRef(database, 'activities');
        const newActivityRef = push(activityRef);
        await set(newActivityRef, {
          userId: user.uid,
          action: 'uploaded a new video',
          timestamp: Date.now(),
        });

        setVideoFile(null);
        setUploading(false);
        // Refresh the video list
        const videosRef = query(dbRef(database, 'videos'), limitToLast(10));
        const snapshot = await get(videosRef);
        if (snapshot.exists()) {
          const videosData = Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            ...value as object,
          }));
          setVideos(videosData.reverse());
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        setUploading(false);
      }
    }
  };

  // ... (rest of the component remains the same)
};

export default VideoSharing;