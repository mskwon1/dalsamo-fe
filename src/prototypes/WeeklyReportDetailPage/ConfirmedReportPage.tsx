import { Col, Image, Row, Table, Typography } from 'antd';
import { getWeeklyReportTitle } from '../../utils';
import BasicInfoSection from './PendingReportPage/BasicInfoSection';
import { useMemo } from 'react';
import { find, map, maxBy, orderBy } from 'lodash';
import { CrownFilled } from '@ant-design/icons';

const ConfirmedReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { startDate, runEntries, fines, reportImageUrl } = weeklyReport;

  const composedRunEntries = useMemo(() => {
    const entriesWithFine = map(runEntries, (entry) => {
      return {
        ...entry,
        fine: find(fines, { userId: entry.userId })?.value || 0,
      };
    });

    return orderBy(entriesWithFine, ['fine'], ['desc']);
  }, [runEntries, fines]);

  const weeklyKingUserId = useMemo(() => {
    return maxBy(fines, 'value')?.userId;
  }, [fines]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography.Title level={2}>
        {getWeeklyReportTitle(startDate)}
      </Typography.Title>
      <Row gutter={4}>
        <Col xs={24} md={20}>
          <BasicInfoSection weeklyReport={weeklyReport} />

          <div>
            <Typography.Title level={4}>결산 결과</Typography.Title>
            <Table
              size="small"
              bordered
              dataSource={composedRunEntries}
              columns={[
                {
                  title: '회원명',
                  key: 'userName',
                  render: (val, entry) => {
                    const isKing = weeklyKingUserId === entry.userId;

                    if (isKing) {
                      return (
                        <span style={{ fontWeight: 'bold' }}>
                          <CrownFilled
                            style={{ color: 'gold', marginRight: 4 }}
                          />
                          {entry.userName}
                        </span>
                      );
                    }

                    return <span>{entry.userName}</span>;
                  },
                },
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
                {
                  title: '벌금',
                  dataIndex: 'fine',
                  render: (val, entry) => {
                    return entry.fine > 0 ? `${entry.fine}원` : '-';
                  },
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
