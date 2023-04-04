import { useNavigate, useParams } from 'react-router-dom';
import useWeeklyReport from '../hooks/useWeeklyReport';
import {
  Button,
  Col,
  Descriptions,
  Image,
  Input,
  Row,
  Skeleton,
  Space,
  Table,
  Upload,
  notification,
} from 'antd';
import dayjs from 'dayjs';
import WeeklyReportTag from '../components/WeeklyReportTag';
import { useState, useCallback } from 'react';
import _ from 'lodash';
import {
  CheckCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  RocketFilled,
  UploadOutlined,
} from '@ant-design/icons';
import {
  calculatePredictedFine,
  getWeeklyReportTitle,
  parseRundayImage,
} from '../utils';
import { createWorker } from 'tesseract.js';
import levenshtein from 'js-levenshtein';
import { RcFile } from 'antd/es/upload';

const BasicInfoSection = (props: { weeklyReport: WeeklyReportEntity }) => {
  const { weeklyReport } = props;
  const { startDate, status } = weeklyReport;

  return (
    <Descriptions size="small" layout="vertical" bordered column={4}>
      <Descriptions.Item label="시작 기준일" span={3}>
        {dayjs.utc(startDate).format('YYYY년 M월 D일')}
      </Descriptions.Item>
      <Descriptions.Item label="상태" span={1}>
        <WeeklyReportTag status={status} />
      </Descriptions.Item>
    </Descriptions>
  );
};

const RunEntriesSection = (props: {
  runEntries: RunEntryEntity[];
  onRunDistanceChange: (id: string, distance: number) => void;
}) => {
  const { runEntries, onRunDistanceChange } = props;

  return (
    <Table
      size="small"
      bordered
      dataSource={runEntries}
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
                  onRunDistanceChange(id, _.toNumber(e.target.value))
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
  );
};

const ImagePreviewSection = (props: {
  base64ImageUrl: string | null;
  onRemove: () => void;
}) => {
  const { base64ImageUrl, onRemove } = props;

  if (!base64ImageUrl) {
    return null;
  }

  return (
    <Space align="end" style={{ justifyContent: 'end' }}>
      <Image src={base64ImageUrl} width={50} preview />
      <Button
        size="small"
        type="primary"
        danger
        icon={<CloseOutlined />}
        onClick={onRemove}
        shape="circle"
      />
    </Space>
  );
};

const PendingReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { id, startDate, status, runEntries } = weeklyReport;

  const navigate = useNavigate();

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

  const [isAnalyzingCapture, setIsAnlalyzingCapture] = useState(false);

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

  const addRunDistance = useCallback((id: string, value: number) => {
    setEditableRunEntries((prevEntries) => {
      const targetIndex = _.findIndex(prevEntries, { id });

      if (targetIndex === -1) {
        return [...prevEntries];
      }

      return [
        ..._.slice(prevEntries, 0, targetIndex),
        {
          ...prevEntries[targetIndex],
          runDistance: prevEntries[targetIndex].runDistance + value,
        },
        ..._.slice(prevEntries, targetIndex + 1, prevEntries.length),
      ];
    });
  }, []);

  const onClickSubmit = useCallback(async () => {
    console.log(editableRunEntries);

    // const { data: result } = await ApiRequester.post(
    //   `/weekly-reports/${id}/close`,
    //   {
    //     runEntries: _.map(
    //       editableRunEntries,
    //       fp.pick(['id', 'runDistance', 'goalDistance', 'userId', 'userName'])
    //     ),
    //   }
    // );
  }, [id, editableRunEntries, navigate]);

  const parseAndAnalyzeCaptureImage = useCallback(async (file: RcFile) => {
    setIsAnlalyzingCapture(true);

    const reader = new FileReader();

    reader.onload = (e) => {
      setImageBase64(e.target?.result as string);
    };

    reader.readAsDataURL(file);

    const worker = await createWorker();
    const records = await parseRundayImage(worker, file);

    const updateTargetRecords: {
      runEntryId: string;
      userName: string;
      distance: number;
    }[] = [];
    for (const record of records) {
      const { rawName, distance } = record;

      const targetEntry = _.minBy(editableRunEntries, ({ userName }) =>
        levenshtein(rawName, userName.replaceAll(' ', ''))
      );

      if (targetEntry) {
        updateTargetRecords.push({
          runEntryId: targetEntry.id,
          userName: targetEntry.userName,
          distance,
        });
      }
    }

    setIsAnlalyzingCapture(false);

    console.log(updateTargetRecords);

    notification.open({
      message: '캡쳐기록 추가 확인',
      description: (
        <div>
          <p style={{ whiteSpace: 'pre-line' }}>
            {_.join(
              _.map(updateTargetRecords, ({ userName, distance }) => {
                return `${userName} - ${distance}KM 추가`;
              }),
              '\n'
            )}
          </p>
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                _.each(updateTargetRecords, ({ runEntryId, distance }) => {
                  addRunDistance(runEntryId, distance);
                });
              }}
            >
              확인
            </Button>
          </div>
        </div>
      ),
      duration: 0,
      icon: <RocketFilled style={{ color: 'green' }} />,
    });

    return false;
  }, []);

  const [imageBase64, setImageBase64] = useState<string | null>(null);

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
          <RunEntriesSection
            runEntries={editableRunEntries}
            onRunDistanceChange={setRunDistance}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'middle',
            }}
          >
            <Space.Compact>
              <Upload
                accept="image/*"
                disabled={isAnalyzingCapture}
                beforeUpload={parseAndAnalyzeCaptureImage}
                maxCount={1}
                showUploadList={false}
              >
                <Button
                  disabled={isAnalyzingCapture}
                  icon={
                    isAnalyzingCapture ? (
                      <LoadingOutlined />
                    ) : (
                      <UploadOutlined />
                    )
                  }
                >
                  캡쳐 업로드/기록적용
                </Button>
              </Upload>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={onClickSubmit}
              >
                결산 완료
              </Button>
            </Space.Compact>
          </div>
          <ImagePreviewSection
            base64ImageUrl={imageBase64}
            onRemove={() => setImageBase64('')}
          />
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>{getWeeklyReportTitle(startDate)}</h1>
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
