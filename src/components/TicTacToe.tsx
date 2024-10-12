import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { ref, set, onValue, off, push } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Grid } from 'lucide-react';

// ... (previous code remains the same)

const TicTacToe: React.FC = () => {
  // ... (previous state and useEffect remain the same)

  const handleClick = (index: number) => {
    if (user && gameId && game[index] === null && !winner) {
      const newGame = [...game];
      newGame[index] = currentPlayer;
      const newWinner = checkWinner(newGame);

      const gameRef = ref(database, `games/${gameId}`);
      set(gameRef, {
        board: newGame,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
        winner: newWinner,
      });

      if (newWinner) {
        // Add activity to the feed when the game ends
        const activityRef = ref(database, 'activities');
        const newActivityRef = push(activityRef);
        set(newActivityRef, {
          userId: user.uid,
          action: newWinner === 'Draw' ? 'played a draw in Tic-Tac-Toe' : `won a game of Tic-Tac-Toe as ${currentPlayer}`,
          timestamp: Date.now(),
        });
      }
    }
  };

  const startNewGame = () => {
    if (user) {
      const newGameId = Date.now().toString();
      setGameId(newGameId);
      const gameRef = ref(database, `games/${newGameId}`);
      set(gameRef, {
        board: Array(9).fill(null),
        currentPlayer: 'X',
        winner: null,
      });

      // Add activity to the feed when starting a new game
      const activityRef = ref(database, 'activities');
      const newActivityRef = push(activityRef);
      set(newActivityRef, {
        userId: user.uid,
        action: 'started a new Tic-Tac-Toe game',
        timestamp: Date.now(),
      });
    }
  };

  // ... (rest of the component remains the same)
};

export default TicTacToe;