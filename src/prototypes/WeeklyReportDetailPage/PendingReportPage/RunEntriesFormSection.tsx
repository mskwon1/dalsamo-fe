import { Input, Table } from 'antd';
import _ from 'lodash';

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

export default RunEntriesSection;
