import ApiRequester from '../libs/api-requester';

const analyzeCaptureIamge = async (captureImage: Blob) => {
  const formData = new FormData();
  formData.append('image', captureImage);

  const {
    data: { parsedData },
  } = await ApiRequester.post<{
    parsedData: { rawName: string; distance: number }[];
  }>('/utils/analyze-capture-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 15000,
  });

  return parsedData;
};

export default { analyzeCaptureIamge };