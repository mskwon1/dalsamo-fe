import createAuthHeader from 'src/libs/create-auth-header';
import ApiRequester from '../libs/api-requester';

const analyzeCaptureIamge = async (captureImage: Blob, token: string) => {
  const formData = new FormData();
  formData.append('image', captureImage);

  const {
    data: { parsedData },
  } = await ApiRequester.post<{
    parsedData: { rawName: string; distance: number }[];
  }>('/utils/analyze-capture-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...createAuthHeader(token),
    },
    timeout: 15000,
  });

  return parsedData;
};

const uploadRunEntryImage = async (runEntryImage: Blob, token: string) => {
  const formData = new FormData();
  formData.append('image', runEntryImage);

  const {
    data: { imageUrl },
  } = await ApiRequester.post<{
    imageUrl: string;
  }>('/utils/upload-run-entry-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...createAuthHeader(token),
    },
    timeout: 15000,
  });

  return imageUrl;
};

export default { analyzeCaptureIamge, uploadRunEntryImage };
