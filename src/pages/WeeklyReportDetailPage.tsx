import { useParams } from 'react-router-dom';
import useWeeklyReport from '../hooks/useWeeklyReport';
import { Skeleton } from 'antd';
import AdminPendingReportPage from '../prototypes/WeeklyReportDetailPage/PendingReportPage/AdminPendingReportPage';
import ConfirmedReportPage from '../prototypes/WeeklyReportDetailPage/ConfirmedReportPage';
import useLoginUser from '@hooks/useLoginUser';
import MemberPendingReportPage from '@prototypes/WeeklyReportDetailPage/PendingReportPage/MemberPendingReportPage';

const WeeklyReportDetailPage = () => {
  const { weeklyReportId } = useParams();

  const { data: weeklyReport, isLoading } = useWeeklyReport(
    weeklyReportId as string
  );
  const { data: user } = useLoginUser();

  if (isLoading || !weeklyReport || !user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton
          title={{ width: 200 }}
          paragraph={{ rows: 6, width: [400, 400, 400, 400, 400, 400] }}
        />
      </div>
    );
  }

  const { status } = weeklyReport;

  if (status === 'pending') {
    const { roles } = user;

    if (roles.includes('admin')) {
      return <AdminPendingReportPage weeklyReport={weeklyReport} />;
    }

    return <MemberPendingReportPage weeklyReport={weeklyReport} />;
  }

  return <ConfirmedReportPage weeklyReport={weeklyReport} />;
};

export default WeeklyReportDetailPage;
