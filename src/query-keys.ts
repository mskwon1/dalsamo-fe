export const WeeklyReportQueryKey = (id: string) => ['weekly-report', id];

export const WeeklyReportsQueryKey = (params: { limit: number }) => [
  'weekly-reports',
  params,
];
