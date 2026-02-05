import { useState } from 'react';
import type { ClubMember } from '../../shared/types';
import { useGame } from '../hooks/useGame';
import { GameScreen } from '../components/GameScreen';
import { ResultScreen } from '../components/ResultScreen';
import { ClubScreen } from '../components/ClubScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { SplashScreen } from '../components/SplashScreen';
import { Layout } from '../components/ui/Layout';
import { ErrorScreen } from '../components/ErrorScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { MemeReviewScreen } from '../components/MemeReviewScreen';

function GameContent() {
  const [viewingProfile, setViewingProfile] = useState<ClubMember | null>(null);
  const [viewingMeme, setViewingMeme] = useState(false);
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
      <Layout className="items-center justify-center" container="fullscreen">
        <LoadingScreen />
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout className="items-center justify-center" container="fullscreen">
        <ErrorScreen error={error} onRetry={retry} />
      </Layout>
    );
  }

  if (status === 'result' && result) {
    if (viewingProfile) {
      return (
        <Layout backButton={{ onClick: () => setViewingProfile(null), label: '← Club' }}>
          <ProfileScreen member={viewingProfile} onBack={() => setViewingProfile(null)} />
        </Layout>
      );
    }

    if (showClub && clubState) {
      return (
        <Layout
          variant="secondary"
          backButton={{ onClick: () => setShowClub(false), label: '← Results' }}
        >
          <ClubScreen
            clubState={clubState}
            myClubMember={result.newClubMember ?? null}
            onBack={() => setShowClub(false)}
            onViewProfile={setViewingProfile}
          />
        </Layout>
      );
    }

    if (viewingMeme && challenge && selectedOptionId) {
      return (
        <Layout nextButton={{ onClick: () => setViewingMeme(false), label: 'Results →' }}>
          <MemeReviewScreen challenge={challenge} selectedOptionId={selectedOptionId} />
        </Layout>
      );
    }

    return (
      <Layout backButton={{ onClick: () => setViewingMeme(true), label: '← Meme' }}>
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
      <Layout className="items-center justify-center" container="fullscreen">
        <SplashScreen onPlay={() => setStarted(true)} />
      </Layout>
    );
  }

  return <GameContent />;
};
