import { Col, List, Row } from 'antd';
import useWeeklyReports from '../hooks/useWeeklyReports';
import { Link } from 'react-router-dom';
import WeeklyReportTag from '../components/WeeklyReportTag';
import _ from 'lodash';

const WeeklyReportListPage = () => {
  const { data: weeklyReports, isLoading } = useWeeklyReports();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>주간기록 열람</h1>
      <Row>
        <Col xs={24} md={12} lg={8}>
          <List
            size="small"
            itemLayout="horizontal"
            bordered
            dataSource={_.orderBy(weeklyReports, ['startDate'], ['desc'])}
            loading={isLoading}
            renderItem={(weeklyReport) => {
              const { id, startDate, status } = weeklyReport;

              return (
                <>
                  <List.Item key={id}>
                    <div>
                      <Link to={`/weekly-reports/${id}`}>{startDate}</Link>
                    </div>
                    <WeeklyReportTag status={status} />
                  </List.Item>
                </>
              );
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default WeeklyReportListPage;
