import clsx from 'clsx';

interface Props {
  className?: string;
}

export function ClubBackground({ className }: Props) {
  return (
    <svg
      className={clsx('opacity-20', className)}
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
    >
      <path
        d="M-50 100 Q100 50 150 150 T350 100 T550 150"
        stroke="#FF4500"
        strokeWidth="40"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-100 200 Q50 150 150 250 T400 200"
        stroke="#343536"
        strokeWidth="50"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-50 350 Q150 300 200 400 T450 350"
        stroke="#FF4500"
        strokeWidth="35"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M0 500 Q100 450 200 520 T400 480"
        stroke="#343536"
        strokeWidth="45"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M-80 600 Q80 550 180 620 T420 580"
        stroke="#FF4500"
        strokeWidth="30"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
