const DAY_MS = 86_400_000;

export type ConsistencyLog = {
  occurred_on: string;
  status: string;
};

function dayNumber(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) throw new Error("invalid_date");
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

export function saoPauloDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

export function calculateObservedConsistency(input: {
  diagnosticCompletedOn: string;
  today: string;
  logs: ConsistencyLog[];
}) {
  const start = dayNumber(input.diagnosticCompletedOn);
  const today = dayNumber(input.today);
  const ageDays = Math.max(0, today - start);
  const activeLogs = input.logs.filter((log) => log.status !== "archived" && dayNumber(log.occurred_on) >= start && dayNumber(log.occurred_on) <= today);
  const eligibilityWeeks = new Set(activeLogs.map((log) => Math.floor((dayNumber(log.occurred_on) - start) / 7)));
  const eligible = ageDays >= 21 && activeLogs.length >= 6 && eligibilityWeeks.size >= 3;

  const windowStart = Math.max(start, today - 27);
  const eligibleWeeks = Math.min(4, Math.max(1, Math.ceil((today - windowStart + 1) / 7)));
  const windowLogs = activeLogs.filter((log) => dayNumber(log.occurred_on) >= windowStart);
  const activeWeeks = new Set(windowLogs.map((log) => Math.min(eligibleWeeks - 1, Math.floor((dayNumber(log.occurred_on) - windowStart) / 7)))).size;
  const distinctDays = new Set(windowLogs.map((log) => log.occurred_on.slice(0, 10))).size;
  const continuity = Math.round((activeWeeks / eligibleWeeks) * 100);
  const frequency = Math.round(Math.min(distinctDays / (2 * eligibleWeeks), 1) * 100);

  return {
    eligible,
    score: Math.round(continuity * 0.7 + frequency * 0.3),
    continuity,
    frequency,
    activeWeeks,
    eligibleWeeks,
    distinctDays,
    activeLogCount: activeLogs.length,
  };
}
