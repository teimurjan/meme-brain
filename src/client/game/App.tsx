import { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { GameScreen } from '../components/GameScreen';
import { ResultScreen } from '../components/ResultScreen';
import { ClubScreen } from '../components/ClubScreen';
import { SplashScreen } from '../components/SplashScreen';
import { Layout } from '../components/ui/Layout';
import { ErrorScreen } from '../components/ErrorScreen';
import { LoadingScreen } from '../components/LoadingScreen';

function GameContent() {
  const {
    status,
    challenge,
    selectedOptionId,
    result,
    error,
    clubState,
    showClub,
    selectOption,
    retry,
    reset,
    resetClub,
    setShowClub,
  } = useGame();

  if (status === 'loading') {
    return (
      <Layout className="items-center justify-center">
        <LoadingScreen />
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout className="items-center justify-center">
        <ErrorScreen error={error} onRetry={retry} />
      </Layout>
    );
  }

  if (status === 'result' && result) {
    if (showClub && clubState) {
      return (
        <Layout>
          <ClubScreen
            clubState={clubState}
            myClubMember={result.newClubMember ?? null}
            onBack={() => setShowClub(false)}
          />
        </Layout>
      );
    }

    return (
      <Layout>
        <ResultScreen
          optionResult={result.optionResult}
          strike={result.strike}
          humorProfile={result.humorProfile}
          shareText={result.shareText}
          onReset={(clearChallenge) => void reset(clearChallenge)}
          onResetClub={() => void resetClub()}
          onShowClub={() => setShowClub(true)}
        />
      </Layout>
    );
  }

  if ((status === 'ready' || status === 'playing') && challenge) {
    return (
      <Layout>
        <GameScreen
          challenge={challenge}
          onSelect={selectOption}
          isPlaying={status === 'playing'}
          selectedOptionId={selectedOptionId}
        />
      </Layout>
    );
  }

  return null;
}

export const App = () => {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <Layout className="items-center justify-center">
        <SplashScreen onPlay={() => setStarted(true)} />
      </Layout>
    );
  }

  return <GameContent />;
};
