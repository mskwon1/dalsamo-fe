import { Button, Col, Image, Row, Space, Table, Typography } from 'antd';
import { getWeeklyReportTitle } from '../../utils';
import BasicInfoSection from './PendingReportPage/BasicInfoSection';
import { useMemo, useRef } from 'react';
import { find, map, maxBy, orderBy } from 'lodash';
import {
  ArrowUpOutlined,
  CaretUpFilled,
  CrownFilled,
  DownloadOutlined,
  LineOutlined,
  RocketFilled,
} from '@ant-design/icons';
import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { MAX_DISTANCE } from 'constants';
import { report } from 'process';

const ConfirmedReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { startDate, runEntries, fines, reportImageUrl } = weeklyReport;

  const canvasTargetRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = useCallback(async () => {
    if (!canvasTargetRef.current) {
      return;
    }

    const canvas = await html2canvas(canvasTargetRef.current);
    const data = canvas.toDataURL('image/png', 1.0);

    const fakeLink = document.createElement('a');

    fakeLink.setAttribute('style', 'display:none;');
    fakeLink.setAttribute('download', `dalsamo-${startDate}주차`);
    fakeLink.setAttribute('href', data);

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    fakeLink.remove();
  }, [startDate]);

  const composedRunEntries = useMemo(() => {
    const composedEntries = map(runEntries, (entry) => {
      return {
        ...entry,
        fine: find(fines, { userId: entry.userId })?.value || 0,
      };
    });

    return orderBy(composedEntries, ['fine'], ['desc']);
  }, [runEntries, fines]);

  const weeklyKingUserId = useMemo(() => {
    return maxBy(fines, 'value')?.userId;
  }, [fines]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Row gutter={4}>
        <Col xs={24} md={20}>
          <div ref={canvasTargetRef} style={{ padding: 4 }}>
            <Typography.Title level={4} style={{ marginTop: 0 }}>
              기본 정보
            </Typography.Title>
            <BasicInfoSection weeklyReport={weeklyReport} />

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
                            ? {}
                            : { color: 'blue', fontWeight: 'bold' }
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
                  title: '다음목표',
                  render: (val, { runDistance, goalDistance }) => {
                    if (runDistance < goalDistance) {
                      return (
                        <span>
                          {goalDistance}
                          <LineOutlined
                            style={{ marginLeft: 4, color: 'blue' }}
                          />
                        </span>
                      );
                    }

                    if (goalDistance >= MAX_DISTANCE) {
                      return (
                        <span>
                          {goalDistance}
                          <RocketFilled
                            style={{ marginLeft: 4, color: 'green' }}
                          />
                        </span>
                      );
                    }

                    return (
                      <span>
                        {goalDistance + 1}
                        <CaretUpFilled
                          style={{ marginLeft: 4, color: 'red' }}
                        />
                      </span>
                    );
                  },
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
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'end',
              marginTop: 4,
            }}
          >
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadAsImage}
            >
              이미지로 다운로드
            </Button>
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
