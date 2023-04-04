import _ from 'lodash';
import { MAX_FINE } from './constants';
import Tesseract from 'tesseract.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

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

const USERNAMES_RECTANGLE_PRESET = {
  left: 170,
  width: 300,
  top: 650,
  height: 700,
};

const DISTANCES_RECTANGLE_PRESET = {
  left: 500,
  width: 150,
  top: 650,
  height: 700,
};

export const parseRundayImage = async (
  worker: Tesseract.Worker,
  file: Blob
) => {
  await worker.loadLanguage('eng+kor');
  await worker.initialize('eng+kor');

  const {
    data: { text: userNamesText },
  } = await worker.recognize(file, {
    rectangle: USERNAMES_RECTANGLE_PRESET,
  });

  const {
    data: { text: distancesText },
  } = await worker.recognize(file, {
    rectangle: DISTANCES_RECTANGLE_PRESET,
  });

  const userNames = getCompatRecords(userNamesText);
  const distances = getCompatRecords(distancesText).map((text) =>
    text.replaceAll('km', '')
  );

  await worker.terminate();

  return _.map(userNames, (rawName, index) => {
    return {
      rawName,
      distance: _.toNumber(distances[index]),
    };
  });
};

const getCompatRecords = (target: string) => {
  return _.chain(target)
    .split('\n')
    .map((record) => record.split(' ').join('').replace(' ', ''))
    .compact()
    .value();
};

dayjs.extend(utc);

export const getWeeklyReportTitle = (startDate: string) => {
  const start = dayjs.utc(startDate).format('YYYY년 M월 D일');
  const end = dayjs.utc(startDate).add(6, 'day').format('YYYY년 M월 D일');

  return `${start} ~ ${end} 주간기록`;
};
