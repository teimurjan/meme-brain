import type { ClubMember } from '../../shared/types';
import { LUCKY_NUMBER_LORE } from '../../shared/types';
import { formatAccountAge, formatDate } from '../../shared/utils/date';
import { formatKarma } from '../../shared/utils/format';
import defaultSnooGray from '../../../assets/default-snoo-gray.png';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

type Props = {
  member: ClubMember;
  onBack: () => void;
};

export function ProfileScreen({ member, onBack }: Props) {
  const lore = LUCKY_NUMBER_LORE[member.luckyNumber];
  const hasKarma = member.linkKarma !== undefined && member.commentKarma !== undefined;
  const totalKarma = (member.linkKarma ?? 0) + (member.commentKarma ?? 0);

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      {/* Profile header */}
      <div className="border-2 border-black bg-white p-5 shadow-[4px_4px_0_0]">
        <div className="flex items-center gap-4">
          <img
            src={member.snoovatarUrl ?? defaultSnooGray}
            alt={`u/${member.username}'s snoovatar`}
            className="w-20 h-20 object-contain shrink-0 border-2 border-black bg-orange-50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black truncate">u/{member.username}</h1>
              {member.isAdmin && <Badge variant="error">Admin</Badge>}
              {member.hasVerifiedEmail && <Badge variant="success">Verified</Badge>}
            </div>
            {member.displayName && member.displayName !== member.username && (
              <p className="text-sm text-gray-600 font-medium mt-0.5">{member.displayName}</p>
            )}
            {member.accountCreatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Joined {formatDate(member.accountCreatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Club spot badge */}
      <div className="border-2 border-black bg-orange-200 p-3 shadow-[2px_2px_0_0]">
        <p className="text-center font-bold">
          <span className="bg-black text-white px-2 py-0.5 inline-block">
            #{member.luckyNumber}
          </span>{' '}
          {lore.title} — {lore.description}
        </p>
      </div>

      {/* Stats grid */}
      {hasKarma && (
        <div className="grid grid-cols-3 gap-3">
          <div className="border-2 border-black bg-yellow-100 p-3 shadow-[2px_2px_0_0] text-center">
            <p className="text-2xl font-black">{formatKarma(totalKarma)}</p>
            <p className="text-xs text-gray-600 font-medium">total karma</p>
          </div>
          <div className="border-2 border-black bg-blue-100 p-3 shadow-[2px_2px_0_0] text-center">
            <p className="text-2xl font-black">{formatKarma(member.commentKarma ?? 0)}</p>
            <p className="text-xs text-gray-600 font-medium">comment</p>
          </div>
          <div className="border-2 border-black bg-green-100 p-3 shadow-[2px_2px_0_0] text-center">
            <p className="text-2xl font-black">
              {member.accountCreatedAt ? formatAccountAge(member.accountCreatedAt) : '—'}
            </p>
            <p className="text-xs text-gray-600 font-medium">account age</p>
          </div>
        </div>
      )}

      {/* About section */}
      {member.about && (
        <div className="border-2 border-black bg-orange-50 p-4 shadow-[2px_2px_0_0]">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About</p>
          <p className="text-sm text-gray-800 leading-relaxed">{member.about}</p>
        </div>
      )}

      {/* Back button */}
      <Button onClick={onBack} className="w-full">
        ← Back to Club
      </Button>
    </div>
  );
}
