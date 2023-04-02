import _ from 'lodash';
import { MAX_FINE } from './constants';

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
