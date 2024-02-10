import {
  CheckCircleOutlined,
  LoadingOutlined,
  RocketFilled,
  UploadOutlined,
} from '@ant-design/icons';
import ImagePreviewSection from './ImagePreviewSection';
import { Button, Col, Row, Space, Upload, notification } from 'antd';
import RunEntriesSection from './RunEntriesFormSection';
import BasicInfoSection from './BasicInfoSection';
import { calculatePredictedFine, getWeeklyReportTitle } from 'src/utils';
import { useCallback, useState } from 'react';
import levenshtein from 'js-levenshtein';
import _ from 'lodash';
import fp from 'lodash/fp';
import utilApi from '#api/util-api';
import { RcFile } from 'antd/es/upload';
import useCloseWeeklyReport from '#hooks/useCloseWeeklyReport';
import useAuthToken from '#hooks/useAuthToken';

const AdminPendingReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const { id, startDate, runEntries } = weeklyReport;

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
  const [base64Image, setBase64Image] = useState<string | undefined>();
  const [api, contextHolder] = notification.useNotification();

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

      const newRunDistance = prevEntries[targetIndex].runDistance + value;

      return [
        ..._.slice(prevEntries, 0, targetIndex),
        {
          ...prevEntries[targetIndex],
          runDistance: newRunDistance,
          predictedFine: calculatePredictedFine({
            goalDistance: prevEntries[targetIndex].goalDistance,
            runDistance: newRunDistance,
          }),
        },
        ..._.slice(prevEntries, targetIndex + 1, prevEntries.length),
      ];
    });
  }, []);

  const { authToken } = useAuthToken();
  const closeWeeklyReportMutation = useCloseWeeklyReport(id);
  const onClickSubmit = useCallback(async () => {
    closeWeeklyReportMutation({
      runEntries: _.map(
        editableRunEntries,
        fp.pick(['id', 'runDistance', 'goalDistance', 'userId', 'userName'])
      ),
      base64Image,
    });
  }, [id, editableRunEntries, base64Image]);

  const parseAndAnalyzeCaptureImage = useCallback(
    async (file: RcFile) => {
      try {
        if (!authToken) {
          return false;
        }

        setIsAnlalyzingCapture(true);

        // Set preview image
        const reader = new FileReader();
        reader.onload = (e) => {
          setBase64Image(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        const records = await utilApi.analyzeCaptureIamge(file, authToken);

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

        const key = `open${Date.now().valueOf()}`;

        api.open({
          key,
          message: '캡쳐기록 추가 확인',
          description: (
            <div>
              <p style={{ whiteSpace: 'pre-line' }}>
                {_.join(
                  _.map(updateTargetRecords, ({ userName, distance }) => {
                    return `${userName} - ${distance}km`;
                  }),
                  '\n'
                )}
              </p>
            </div>
          ),
          btn: (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                _.each(updateTargetRecords, ({ runEntryId, distance }) => {
                  addRunDistance(runEntryId, distance);
                });
                api.destroy(key);
              }}
            >
              확인
            </Button>
          ),
          duration: 0,
          icon: <RocketFilled style={{ color: 'green' }} />,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setIsAnlalyzingCapture(false);
        return false;
      }
    },
    [api, authToken]
  );

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1>{getWeeklyReportTitle(startDate)}</h1>
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
                  isAnalyzingCapture ? <LoadingOutlined /> : <UploadOutlined />
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
          base64ImageUrl={base64Image}
          onRemove={() => setBase64Image(undefined)}
        />
      </div>
    </>
  );
};

export default AdminPendingReportPage;
