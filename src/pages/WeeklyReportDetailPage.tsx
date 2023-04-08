import { useParams } from 'react-router-dom';
import useWeeklyReport from '../hooks/useWeeklyReport';
import { Col, Row, Skeleton } from 'antd';
import PendingReportPage from '../prototypes/WeeklyReportDetailPage/PendingReportPage/PendingReportPage';
import ConfirmedReportPage from '../prototypes/WeeklyReportDetailPage/PendingReportPage/ConfirmedReportPage';

const WeeklyReportDetailPage = () => {
  const { weeklyReportId } = useParams();

  const { data: weeklyReport, isLoading } = useWeeklyReport(
    weeklyReportId as string
  );

  if (isLoading || !weeklyReport) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Row>
          <Col xs={24} md={16}>
            <Skeleton
              title={{ width: 200 }}
              paragraph={{ rows: 6, width: [400, 400, 400, 400, 400, 400] }}
            />
          </Col>
        </Row>
      </div>
    );
  }

  const { status } = weeklyReport;

  if (status === 'pending') {
    return <PendingReportPage weeklyReport={weeklyReport} />;
  }

  return <ConfirmedReportPage weeklyReport={weeklyReport} />;
};

export default WeeklyReportDetailPage;
