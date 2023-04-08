import { Col, Descriptions, Row, Table } from 'antd';
import { formatDateString, getWeeklyReportTitle } from '../../../utils';
import WeeklyReportTag from '../../../components/WeeklyReportTag';
import BasicInfoSection from './BasicInfoSection';

const ConfirmedReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { id, startDate, status, runEntries } = weeklyReport;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>{getWeeklyReportTitle(startDate)}</h1>
      <Row gutter={8}>
        <Col
          xs={24}
          md={16}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <BasicInfoSection weeklyReport={weeklyReport} />
          <Table
            size="small"
            bordered
            dataSource={runEntries}
            columns={[
              { title: '회원명', dataIndex: 'userName', key: 'userName' },
              {
                title: '달린거리',
                dataIndex: 'runDistance',
                width: 50,
              },
              {
                title: '목표거리',
                dataIndex: 'goalDistance',
              },
            ]}
            rowKey="id"
            pagination={false}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmedReportPage;
