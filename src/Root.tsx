import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BaseLayout from './layouts/BaseLayout';

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <BaseLayout />
    </QueryClientProvider>
  );
}

export default Root;
