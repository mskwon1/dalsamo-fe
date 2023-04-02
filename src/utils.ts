import _ from 'lodash';
import { MAX_FINE } from './constants';
import Tesseract from 'tesseract.js';

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

const RECTANGLE_PRESET = {
  left: 170,
  width: 470,
  top: 650,
  height: 700,
};

export const parseRundayImage = async (
  worker: Tesseract.Worker,
  file: Blob
) => {
  await worker.loadLanguage('eng+kor');
  await worker.initialize('eng+kor');

  await worker.setParameters({
    tessedit_ocr_engine_mode: Tesseract.OEM.TESSERACT_LSTM_COMBINED,
  });

  const { data } = await worker.recognize(file, {
    rectangle: RECTANGLE_PRESET,
  });

  await worker.terminate();

  const records = data.text.split('\n');

  return _(records)
    .map((record) => {
      const words = record.split(' ');

      const distance = +(words.pop() as string).replace('km', '');
      const userName = words.join('').replace(' ', '');

      if (!userName) {
        return false;
      }

      return { distance, rawName: userName };
    })
    .compact()
    .value();
};
