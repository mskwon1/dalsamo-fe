import { Descriptions } from 'antd';
import WeeklyReportTag from '#components/WeeklyReportTag';
import { formatDateString } from 'src/utils';

const BasicInfoSection = (props: { weeklyReport: WeeklyReportEntity }) => {
  const { weeklyReport } = props;
  const { startDate, status } = weeklyReport;

  return (
    <Descriptions size="small" layout="vertical" bordered column={4}>
      <Descriptions.Item label="시작 기준일" span={3}>
        {formatDateString(startDate)}
      </Descriptions.Item>
      <Descriptions.Item label="상태" span={1}>
        <WeeklyReportTag status={status} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default BasicInfoSection;
