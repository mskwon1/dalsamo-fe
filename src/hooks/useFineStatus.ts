import { useQuery } from '@tanstack/react-query';
import { FineStatusQueryKey } from 'src/query-keys';
import fineApi from '#api/fine-api';

const useFineStatus = () => {
  return useQuery(FineStatusQueryKey(), async () =>
    fineApi.requestFineStatus()
  );
};
export default useFineStatus;
