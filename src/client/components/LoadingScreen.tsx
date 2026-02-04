export function LoadingScreen() {
  return (
    <div>
      <span className="text-sm font-semibold">Loading today's challenge...</span>
      <div
        className="w-48 mt-2"
        role="progressbar"
        aria-valuenow={25}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="w-full border-2 border-black bg-white p-1 shadow-[4px_4px_0_0]">
          <div className="h-3 bg-black animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
