import { Col, Image, Row, Table, Typography } from 'antd';
import { getWeeklyReportTitle } from '../../utils';
import BasicInfoSection from './PendingReportPage/BasicInfoSection';
import { useMemo } from 'react';
import _ from 'lodash';

const ConfirmedReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { id, startDate, status, runEntries, reportImageUrl } = weeklyReport;

  const orderedRunEntries = useMemo(() => {
    return _.orderBy(runEntries, ['runDistance'], ['desc']);
  }, [runEntries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>{getWeeklyReportTitle(startDate)}</h1>
      <Row gutter={4}>
        <Col
          xs={24}
          md={20}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <BasicInfoSection weeklyReport={weeklyReport} />

          <div>
            <Typography.Title level={4}>달리기 기록</Typography.Title>
            <Table
              size="small"
              bordered
              dataSource={orderedRunEntries}
              columns={[
                { title: '회원명', dataIndex: 'userName', key: 'userName' },
                {
                  title: '달린거리',
                  render: (val, { runDistance, goalDistance }) => {
                    return (
                      <span
                        style={
                          runDistance >= goalDistance
                            ? { color: 'green' }
                            : { color: 'red', fontWeight: 'bold' }
                        }
                      >
                        {runDistance}
                      </span>
                    );
                  },
                },
                {
                  title: '목표거리',
                  dataIndex: 'goalDistance',
                },
              ]}
              rowKey="id"
              pagination={false}
            />
          </div>

          {reportImageUrl && (
            <>
              <Typography.Title level={4}>첨부 이미지</Typography.Title>
              <Image src={reportImageUrl} width={200} />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmedReportPage;
