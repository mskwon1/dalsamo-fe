import { Row, Col } from 'antd';
import useUsers from '../hooks/useUsers';

const CreateWeeklyReportPage = () => {
  const { data: users } = useUsers();

  console.log(users);

  return (
    <Row justify="center" align="middle">
      <Col span={22}>
        <h1>Hello, DALSAMO-FE!</h1>
      </Col>
    </Row>
  );
};

export default CreateWeeklyReportPage;
