import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ApiRequester from '../libs/api-requester';

const useUsers = () => {
  return useQuery(['users'], async () => {
    const {
      data: { users },
    } = await ApiRequester.get<{ users: UserEntity[] }>('/users', {
      params: { limit: 10 },
    });

    return users;
  });
};

export default useUsers;
