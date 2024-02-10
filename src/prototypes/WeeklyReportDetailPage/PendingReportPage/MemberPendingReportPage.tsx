import { PlusOutlined, SaveFilled, SmileOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Input,
  Result,
  Row,
  Table,
  Upload,
  UploadFile,
} from 'antd';
import BasicInfoSection from './BasicInfoSection';
import { getWeeklyReportTitle } from 'src/utils';
import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  compact,
  find,
  findIndex,
  map,
  random,
  reject,
  slice,
  toNumber,
} from 'lodash';
import utilApi from '#api/util-api';
import useAuthToken from '#hooks/useAuthToken';
import useLoginUser from '#hooks/useLoginUser';
import { UploadFileStatus } from 'antd/es/upload/interface';
import { useQueryClient } from '@tanstack/react-query';
import weeklyReportApi from '#api/weekly-report-api';
import { WeeklyReportQueryKey } from 'src/query-keys';

const generateRandomUid = () =>
  `${Date.now().valueOf()}_${random(1, 1000000000)}`;

const MemberPendingReportPage = (props: {
  weeklyReport: ComposedWeeklyReportEntity;
}) => {
  const { weeklyReport } = props;

  const [runDistance, setRunDistance] = useState<number | undefined>();
  const [imageList, setImageList] = useState<UploadFile[]>([]);

  const { id, startDate, runEntries } = weeklyReport;
  const { data: user } = useLoginUser();
  const { authToken } = useAuthToken();

  const userRunEntry = useMemo(() => {
    if (!runEntries) {
      return null;
    }

    if (!user) {
      return null;
    }

    return find(runEntries, { userId: user.id });
  }, [user, runEntries]);

  useEffect(() => {
    if (!userRunEntry) {
      return;
    }

    const { runDistance, imageUrls } = userRunEntry;

    setRunDistance(runDistance);
    setImageList(
      map(imageUrls, (url) => {
        const uid = generateRandomUid();

        return {
          uid,
          name: uid,
          status: 'success',
          thumbUrl: url,
        };
      })
    );
  }, [userRunEntry]);

  const addImage = useCallback((params: { uid: string; name: string }) => {
    const { uid, name } = params;

    setImageList((prev) => [
      ...prev,
      {
        uid,
        name,
        status: 'uploading',
      },
    ]);
  }, []);

  const editImage = useCallback(
    (uid: string, params: { status: UploadFileStatus; imageUrl?: string }) => {
      const { status, imageUrl } = params;

      setImageList((prev) => {
        const targetIndex = findIndex(prev, { uid });

        if (targetIndex === -1) {
          return [...prev];
        }

        return [
          ...slice(prev, 0, targetIndex),
          {
            ...prev[targetIndex],
            status,
            thumbUrl: imageUrl,
          },
          ...slice(prev, targetIndex + 1, prev.length),
        ];
      });
    },
    []
  );

  const removeImage = useCallback((uid: string) => {
    setImageList((prev) => reject(prev, { uid }));
  }, []);

  const queryClient = useQueryClient();
  const onSave = useCallback(async () => {
    if (!userRunEntry || !authToken || !runDistance) {
      return;
    }

    const { id: runEntryId } = userRunEntry;
    console.log({ id, runEntryId, runDistance, imageList });

    const result = await weeklyReportApi.requestUpdateRunEntry(
      {
        weeklyReportId: id,
        runEntryId,
      },
      { runDistance, imageUrls: compact(map(imageList, 'thumbUrl')) },
      authToken
    );

    console.log(result);

    queryClient.invalidateQueries(WeeklyReportQueryKey(id));
  }, [runDistance, imageList, queryClient, userRunEntry, id, authToken]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1>{getWeeklyReportTitle(startDate)}</h1>
        <Row gutter={8}>
          <Col
            xs={24}
            md={16}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <BasicInfoSection weeklyReport={weeklyReport} />
            {userRunEntry ? (
              <>
                <Table
                  size="small"
                  bordered
                  dataSource={[userRunEntry]}
                  columns={[
                    { title: '회원명', dataIndex: 'userName', key: 'userName' },
                    {
                      title: '달린거리',
                      dataIndex: 'runDistance',
                      render: () => {
                        return (
                          <Input
                            value={runDistance}
                            type="number"
                            min={0}
                            onChange={(e) =>
                              setRunDistance(toNumber(e.target.value))
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
                  ]}
                  rowKey="id"
                  pagination={false}
                />
                <Upload
                  customRequest={async ({ file }) => {
                    const uid = generateRandomUid();
                    try {
                      const imageFile = file as File;

                      addImage({
                        uid,
                        name: imageFile.name,
                      });

                      const imageUrl = await utilApi.uploadRunEntryImage(
                        imageFile,
                        authToken as string
                      );

                      editImage(uid, { status: 'success', imageUrl });
                      console.log(imageUrl);
                    } catch (e) {
                      console.log(e);
                      editImage(uid, { status: 'error' });
                    }
                  }}
                  multiple
                  listType="picture-card"
                  fileList={imageList}
                  onRemove={({ uid }) => removeImage(uid)}
                >
                  <div>
                    <PlusOutlined />
                  </div>
                  <div style={{ marginTop: 8 }}>사진 추가하기</div>
                </Upload>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  <Button type="primary" icon={<SaveFilled />} onClick={onSave}>
                    저장
                  </Button>
                </div>
              </>
            ) : (
              <Result
                icon={<SmileOutlined />}
                title="회원님의 기록이 없습니다"
                subTitle="결산이 완료될때까지 기다려주세요"
              />
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MemberPendingReportPage;
