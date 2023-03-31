import { Row, Col } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const InnerComponent = () => {
  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={16}>
        <h1>Hello, DALSAMO-FE!</h1>
      </Col>
    </Row>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerComponent />
    </QueryClientProvider>
  );
}

export default App;
