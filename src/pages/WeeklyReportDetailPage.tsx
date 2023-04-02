import { useParams } from 'react-router-dom';
import useWeeklyReport from '../hooks/useWeeklyReport';
import {
  Button,
  Col,
  Descriptions,
  Input,
  Row,
  Skeleton,
  Space,
  Table,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import WeeklyReportTag from '../components/WeeklyReportTag';
import { useState, useCallback } from 'react';
import _ from 'lodash';
import fp from 'lodash/fp';
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { calculatePredictedFine, parseRundayImage } from '../utils';
import ApiRequester from '../libs/api-requester';
import { createWorker } from 'tesseract.js';

dayjs.extend(utc);

const PendingReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { id, startDate, status, runEntries } = weeklyReport;

  const [editableRunEntries, setEditableRunEntries] = useState(() =>
    _.map(runEntries, (entry) => {
      return {
        ...entry,
        predictedFine: calculatePredictedFine({
          goalDistance: entry.goalDistance,
          runDistance: entry.runDistance,
        }),
      };
    })
  );

  const titleString = useMemo(() => {
    const { startDate } = weeklyReport;

    const start = dayjs.utc(startDate).format('YYYY년 M월 D일');
    const end = dayjs.utc(startDate).add(6, 'day').format('YYYY년 M월 D일');

    return `${start} ~ ${end} 주간기록`;
  }, [startDate]);

  const setRunDistance = useCallback((id: string, value: number) => {
    setEditableRunEntries((prevEntries) => {
      const targetIndex = _.findIndex(prevEntries, { id });

      if (targetIndex === -1) {
        return [...prevEntries];
      }

      return [
        ..._.slice(prevEntries, 0, targetIndex),
        {
          ...prevEntries[targetIndex],
          runDistance: value,
          predictedFine: calculatePredictedFine({
            goalDistance: prevEntries[targetIndex].goalDistance,
            runDistance: value,
          }),
        },
        ..._.slice(prevEntries, targetIndex + 1, prevEntries.length),
      ];
    });
  }, []);

  const onClickSubmit = useCallback(async () => {
    console.log(editableRunEntries);

    const { data: result } = await ApiRequester.post(
      `/weekly-reports/${id}/close`,
      {
        runEntries: _.map(
          editableRunEntries,
          fp.pick(['id', 'runDistance', 'goalDistance', 'userId', 'userName'])
        ),
      }
    );

    console.log(result);
  }, [id, editableRunEntries]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>{titleString}</h1>
      <Row gutter={8}>
        <Col
          xs={24}
          md={16}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Descriptions size="small" layout="vertical" bordered column={4}>
            <Descriptions.Item label="시작 기준일" span={3}>
              {dayjs.utc(startDate).format('YYYY년 M월 D일')}
            </Descriptions.Item>
            <Descriptions.Item label="상태" span={1}>
              <WeeklyReportTag status={status} />
            </Descriptions.Item>
          </Descriptions>
          <Table
            size="small"
            bordered
            dataSource={editableRunEntries}
            columns={[
              { title: '회원명', dataIndex: 'userName', key: 'userName' },
              {
                title: '달린거리',
                dataIndex: 'runDistance',
                render: (value, { id, runDistance }) => {
                  return (
                    <Input
                      value={runDistance}
                      type="number"
                      min={0}
                      onChange={(e) =>
                        setRunDistance(id, _.toNumber(e.target.value))
                      }
                    />
                  );
                },
                width: 150,
              },
              {
                title: '목표거리',
                dataIndex: 'goalDistance',
              },
              {
                title: '예상 벌금',
                dataIndex: 'predictedFine',
              },
            ]}
            rowKey="id"
            pagination={false}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'middle',
            }}
          >
            <Space>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={async (file) => {
                  const worker = await createWorker();

                  const test = await parseRundayImage(worker, file);
                  console.log(test);

                  return false;
                }}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>캡쳐파일 업로드</Button>
              </Upload>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={onClickSubmit}
              >
                결산 완료하기
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const ConfirmedReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const {
    weeklyReport: { id, startDate, status, runEntries },
  } = props;

  const titleString = useMemo(() => {
    const start = dayjs.utc(startDate).format('YYYY년 M월 D일');
    const end = dayjs.utc(startDate).add(6, 'day').format('YYYY년 M월 D일');

    return `${start} ~ ${end} 주간기록`;
  }, [startDate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>{titleString}</h1>
      <Row gutter={8}>
        <Col
          xs={24}
          md={16}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Descriptions size="small" layout="vertical" bordered column={4}>
            <Descriptions.Item label="시작 기준일" span={3}>
              {dayjs.utc(startDate).format('YYYY년 M월 D일')}
            </Descriptions.Item>
            <Descriptions.Item label="상태" span={1}>
              <WeeklyReportTag status={status} />
            </Descriptions.Item>
          </Descriptions>
          <Table
            size="small"
            bordered
            dataSource={runEntries}
            columns={[
              { title: '회원명', dataIndex: 'userName', key: 'userName' },
              {
                title: '달린거리',
                dataIndex: 'runDistance',
                width: 150,
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
