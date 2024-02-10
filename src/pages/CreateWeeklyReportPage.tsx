import { Table, Button, DatePicker, Form, Row, Col, Select } from 'antd';
import useUsers from '../hooks/useUsers';
import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import weeklyReportApi from '../api/weekly-report-api';
import { useNavigate } from 'react-router-dom';
import UserRoleGuard from '#components/UserRoleGuard';
import useAuthToken from '#hooks/useAuthToken';
import { DALSAMO_SEASONS } from 'src/constants';

const SEASON_OPTIONS = DALSAMO_SEASONS.map((season) => {
  return {
    value: season,
    label: season,
  };
});

const DEFAULT_SEASON = DALSAMO_SEASONS[DALSAMO_SEASONS.length - 1];

const CreateWeeklyReportPage = () => {
  const { authToken } = useAuthToken();
  const { data: users } = useUsers();

  const [startDate, setStartDate] = useState<string>('');
  const [season, setSeason] = useState<string>(DEFAULT_SEASON);
  const [selectedRows, setSelectedRows] = useState<UserEntity[]>([]);

  const navigate = useNavigate();

  const isSubmittable = useMemo(() => {
    if (!startDate) {
      return false;
    }

    if (selectedRows.length === 0) {
      return false;
    }

    if (!season) {
      return false;
    }

    return true;
  }, [startDate, selectedRows, season]);

  const onClickSubmit = useCallback(async () => {
    if (!authToken) {
      return;
    }

    const weeklyReportId = await weeklyReportApi.requestOpenWeeklyReport(
      {
        startDate,
        season,
        runEntries: selectedRows.map((user) => {
          return {
            userId: user.id,
            userName: user.name,
            goalDistance: user.currentGoal,
          };
        }),
      },
      authToken
    );

    navigate(`/weekly-reports/${weeklyReportId}`);
  }, [startDate, season, selectedRows, navigate, authToken]);

  return (
    <UserRoleGuard allowedRoles={['admin']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1>신규 주간기록 생성</h1>
        <Form layout="vertical">
          <Form.Item label="시작날짜" colon={false} required={true}>
            <DatePicker
              picker="date"
              onChange={(date, dateString) => setStartDate(dateString)}
              style={{ alignSelf: 'start' }}
              format="YYYYMMDD"
              showToday
            />
          </Form.Item>
          <Form.Item label="시즌" colon={false} required={true}>
            <Select
              defaultValue={DEFAULT_SEASON}
              options={SEASON_OPTIONS}
              value={season}
              onChange={setSeason}
              style={{ alignSelf: 'start' }}
            />
          </Form.Item>
          <Form.Item label="대상회원" colon={false} required={true}>
            <Table
              size="small"
              bordered
              rowSelection={{
                type: 'checkbox',
                onChange: (keys, rows) => setSelectedRows(rows),
              }}
              pagination={false}
              dataSource={users}
              rowKey={(user) => user.id}
              columns={[
                { title: '회원명', dataIndex: 'name', key: 'name' },
                {
                  title: '목표 KM',
                  dataIndex: 'currentGoal',
                  key: 'currentGoal',
                },
              ]}
            />
          </Form.Item>
        </Form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'middle',
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            disabled={!isSubmittable}
            onClick={onClickSubmit}
          >
            생성하기 ({selectedRows.length}명 대상)
          </Button>
        </div>
      </div>
    </UserRoleGuard>
  );
};

export default CreateWeeklyReportPage;
