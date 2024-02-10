import { Table, Button, Form, InputNumber, Select } from 'antd';
import useUsers from '../hooks/useUsers';
import { useCallback, useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import UserRoleGuard from '#components/UserRoleGuard';
import fineApi from '#api/fine-api';
import { head, map, toNumber } from 'lodash';
import useAuthToken from '#hooks/useAuthToken';

const CreateFinePage = () => {
  const { data: users } = useUsers();

  const [fineValue, setFineValue] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<UserEntity[]>([]);

  const reset = useCallback(() => {
    setFineValue(null);
    setSelectedRows([]);
  }, []);

  const isSubmittable = useMemo(() => {
    if (!fineValue) {
      return false;
    }

    if (selectedRows.length === 0) {
      return false;
    }

    return true;
  }, [fineValue, selectedRows]);

  const { authToken } = useAuthToken();
  const onClickSubmit = useCallback(async () => {
    if (!authToken) {
      return;
    }

    const targetUser = head(selectedRows);

    if (!targetUser) {
      return;
    }

    if (!fineValue) {
      return;
    }

    const fineId = await fineApi.requestCreateFine(
      {
        userId: targetUser.id,
        userName: targetUser.name,
        value: fineValue,
      },
      authToken
    );

    console.log('fine created => ', fineId);
    reset();
  }, [fineValue, selectedRows, authToken, reset]);

  return (
    <UserRoleGuard allowedRoles={['admin']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1>신규 벌금기록 생성</h1>
        <Form layout="vertical">
          <Form.Item label="대상회원" colon={false} required={true}>
            <Table
              size="small"
              bordered
              rowSelection={{
                type: 'radio',
                selectedRowKeys: map(selectedRows, 'id'),
                onChange: (keys, rows) => setSelectedRows(rows),
              }}
              pagination={false}
              dataSource={users}
              rowKey={(user) => user.id}
              columns={[{ title: '회원명', dataIndex: 'name', key: 'name' }]}
            />
          </Form.Item>
          <Form.Item label="벌금" colon={false} required={true}>
            <InputNumber
              type="number"
              addonAfter="₩"
              value={fineValue}
              onChange={(value) => setFineValue(value ? toNumber(value) : null)}
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
            생성하기
          </Button>
        </div>
      </div>
    </UserRoleGuard>
  );
};

export default CreateFinePage;
