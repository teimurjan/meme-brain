import { useGame } from '../hooks/useGame';
import { GameScreen } from '../components/GameScreen';
import { ResultScreen } from '../components/ResultScreen';
import { Layout } from '../components/ui/Layout';
import { ErrorScreen } from '../components/ErrorScreen';
import { LoadingScreen } from '../components/LoadingScreen';

export const App = () => {
  const {
    status,
    challenge,
    userState,
    selectedOptionId,
    result,
    error,
    selectOption,
    retry,
    reset,
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

  if (status === 'result' && result && userState) {
    return (
      <Layout>
        <ResultScreen
          archetype={result.archetype}
          stats={result.stats}
          userState={userState}
          shareText={result.shareText}
          onReset={(clearChallenge) => void reset(clearChallenge)}
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
};
