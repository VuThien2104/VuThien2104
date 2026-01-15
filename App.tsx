import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Layout from './components/Layout';
import { ScreenState } from './types';

// Screens
import Intro from './screens/Intro';
import Login from './screens/Login';
import MainHall from './screens/MainHall';
import Breakthrough from './screens/Breakthrough';
import Dungeon from './screens/Dungeon';
import Shop from './screens/Shop';
import Events from './screens/Events';

const ScreenManager = () => {
  const { screen, setScreen } = useGame();

  switch (screen) {
    case ScreenState.INTRO:
      return <Intro />;
    case ScreenState.LOGIN:
      return <Login />;
    case ScreenState.MAIN_HALL:
      return <MainHall />;
    case ScreenState.BREAKTHROUGH:
      return <Breakthrough />;
    case ScreenState.DUNGEON:
      return <Dungeon />;
    case ScreenState.SHOP:
      return <Shop />;
    case ScreenState.RANKING: // Mapped to Events now
      return <Events />;
    case ScreenState.SKILLS:
    case ScreenState.SECT:
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-4xl font-cinzel text-cyan mb-4">Tính năng đang phát triển</h2>
            <p className="text-gray-400 mb-8">Vị đạo hữu này, thiên cơ chưa đến lúc lộ diện.</p>
            <button 
                onClick={() => setScreen(ScreenState.MAIN_HALL)} 
                className="px-8 py-3 bg-cyan text-dark font-bold rounded-full hover:scale-105 transition-transform"
            >
                Quay Về
            </button>
        </div>
      );
    default:
      return <MainHall />;
  }
};

const App = () => {
  return (
    <GameProvider>
      <Layout>
        <ScreenManager />
      </Layout>
    </GameProvider>
  );
};

export default App;