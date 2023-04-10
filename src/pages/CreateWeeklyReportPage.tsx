import { Table, Button, DatePicker, Form, Row, Col } from 'antd';
import useUsers from '../hooks/useUsers';
import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import weeklyReportApi from '../api/weekly-report-api';
import { useNavigate } from 'react-router-dom';
import UserRoleGuard from '@components/UserRoleGuard';

const CreateWeeklyReportPage = () => {
  const { data: users } = useUsers();

  const [startDate, setStartDate] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<UserEntity[]>([]);

  const navigate = useNavigate();

  const isSubmittable = useMemo(() => {
    if (!startDate) {
      return false;
    }

    if (selectedRows.length === 0) {
      return false;
    }

    return true;
  }, [startDate, selectedRows]);

  const onClickSubmit = useCallback(async () => {
    const weeklyReportId = await weeklyReportApi.requestOpenWeeklyReport({
      startDate,
      runEntries: selectedRows.map((user) => {
        return {
          userId: user.id,
          userName: user.name,
          goalDistance: user.currentGoal,
        };
      }),
    });

    navigate(`/weekly-reports/${weeklyReportId}`);
  }, [startDate, selectedRows, navigate]);

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
