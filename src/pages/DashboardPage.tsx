import { Card, Col, Row } from 'antd';
import { map } from 'lodash';
import useUserRunEntries from '@hooks/useUserRunEntries';
import useFineStatus from '@hooks/useFineStatus';
import { VictoryPie, VictoryLabel, VictoryTooltip } from 'victory';
import { useMemo } from 'react';

const CustomLabel = (props: any) => {
  return (
    <g>
      <VictoryLabel {...props} style={{ fontSize: 10 }} />
      <VictoryTooltip
        {...props}
        orientation="top"
        pointerLength={0}
        cornerRadius={50}
        flyoutWidth={100}
        flyoutHeight={100}
        flyoutStyle={{ fill: 'black' }}
      />
    </g>
  );
};

const FineStatusCard = () => {
  const { data: fineStatus, isLoading } = useFineStatus();

  const convertedFineStatus = useMemo(() => {
    if (!fineStatus) {
      return [];
    }

    return map(fineStatus, (status) => {
      console.log(status);

      return {
        x: status.userName,
        y: status.sum,
      };
    });
  }, [fineStatus]);

  if (isLoading) {
    return <VictoryPie />;
  }

  console.log(convertedFineStatus);

  return (
    <Card>
      <Card.Meta
        title="벌금 현황"
        style={{ textAlign: 'center', marginBottom: 8 }}
      />
      <VictoryPie
        animate={{ duration: 500 }}
        data={convertedFineStatus}
        labels={({ datum }) => `${datum.x}`}
        labelComponent={<CustomLabel />}
        labelPlacement="perpendicular"
        innerRadius={100}
        labelRadius={160}
        padAngle={2}
      />
    </Card>
  );
};

const DashboardPage = () => {
  const { data: userRunEntries } = useUserRunEntries();

  return (
    <Row>
      <Col sm={24} md={12}>
        <FineStatusCard />
      </Col>
    </Row>
  );
};

export default DashboardPage;
