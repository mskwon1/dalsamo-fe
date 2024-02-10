import _ from 'lodash';
import { MAX_FINE } from './constants';
import StableDate from './libs/date/StableDate';

export const calculatePredictedFine = (params: {
  goalDistance: number;
  runDistance: number;
}) => {
  const { runDistance, goalDistance } = params;

  const leftDistance = _.ceil(goalDistance - runDistance);

  return leftDistance > 0
    ? _.round((leftDistance * MAX_FINE) / goalDistance)
    : 0;
};

export const getWeeklyReportTitle = (startDate: string) => {
  const start = StableDate.utc(startDate).format('YYYY년 M월 D일');
  const end = StableDate.utc(startDate).add(6, 'day').format('YYYY년 M월 D일');

  return `${start} ~ ${end} 주간기록`;
};

export const formatDateString = (dateString: string) => {
  return StableDate.utc(dateString).format('YYYY년 M월 D일');
};
