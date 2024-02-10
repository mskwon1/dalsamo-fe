import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const WeeklyReportTag = (props: { status: 'pending' | 'confirmed' }) => {
  const { status } = props;

  if (status === 'pending') {
    return (
      <Tag
        data-testid="tag"
        color="geekblue-inverse"
        icon={<ClockCircleOutlined />}
      >
        결산 전
      </Tag>
    );
  }

  return (
    <Tag data-testid="tag" color="green-inverse" icon={<CheckCircleOutlined />}>
      결산 완료
    </Tag>
  );
};

export default WeeklyReportTag;
