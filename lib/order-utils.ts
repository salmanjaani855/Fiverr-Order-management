export function getAccountId(accountId: { _id: string } | string | null | undefined): string {
  if (!accountId) return '';
  if (typeof accountId === 'string') return accountId;
  return accountId._id ?? '';
}

export function getRemainingTimeMs(
  createdAt: string,
  durationHours: number,
  isPaused?: boolean,
  pausedTime?: number
): number {
  const now = new Date();
  const created = new Date(createdAt);
  const deadline = new Date(created.getTime() + durationHours * 60 * 60 * 1000);
  let remainingMs = deadline.getTime() - now.getTime();

  if (isPaused) {
    remainingMs = pausedTime ?? 0;
  }

  return remainingMs;
}

export function getRemainingTime(
  createdAt: string,
  durationHours: number,
  isPaused?: boolean,
  pausedTime?: number
) {
  const remainingMs = getRemainingTimeMs(createdAt, durationHours, isPaused, pausedTime);
  const paused = Boolean(isPaused);

  if (remainingMs <= 0) {
    const lateMins = Math.floor(Math.abs(remainingMs) / 60000);
    const lateHours = Math.floor(lateMins / 60);
    const lateDays = Math.floor(lateHours / 24);

    if (lateDays > 0) {
      return { display: `${lateDays}d ${lateHours % 24}h late`, isLow: true, isLate: true, isPaused: paused };
    }
    if (lateHours > 0) {
      return { display: `${lateHours}h ${lateMins % 60}m late`, isLow: true, isLate: true, isPaused: paused };
    }
    return { display: `${lateMins}m late`, isLow: true, isLate: true, isPaused: paused };
  }

  const remainingMins = Math.floor(remainingMs / 60000);
  const remainingHours = Math.floor(remainingMins / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (remainingDays > 0) {
    return { display: `${remainingDays}d ${remainingHours % 24}h`, isLow: remainingDays < 1, isLate: false, isPaused: paused };
  }
  if (remainingHours > 0) {
    return { display: `${remainingHours}h ${remainingMins % 60}m`, isLow: remainingHours < 12, isLate: false, isPaused: paused };
  }
  return { display: `${remainingMins}m`, isLow: true, isLate: false, isPaused: paused };
}
