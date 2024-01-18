export const WeeklyReportQueryKey = (id: string) => ['weekly-report', id];

export const WeeklyReportsQueryKey = (params: {
  limit: number;
  season?: string;
}) => ['weekly-reports', params];

export const LoginUserQueryKey = () => ['login-user'];

export const UserRunEntriesQueryKey = (params: { season?: string }) => [
  'user-run-entries',
  params,
];

export const FineStatusQueryKey = () => ['fine-status'];
