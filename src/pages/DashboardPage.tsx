import { Card, Col, Empty, Row, Select, Skeleton, Statistic } from 'antd';
import { filter, isEmpty, map, meanBy, round, size, sumBy } from 'lodash';
import useUserRunEntries from '#hooks/useUserRunEntries';
import useFineStatus from '#hooks/useFineStatus';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryScatter,
} from 'victory';
import { PropsWithChildren, useMemo } from 'react';
import {
  AppstoreOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { DALSAMO_SEASONS } from 'src/constants';

const SEASON_OPTIONS = DALSAMO_SEASONS.map((season) => {
  return {
    value: season,
    label: season,
  };
});

const CardLayout = (props: PropsWithChildren) => {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 400,
      }}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      {props.children}
    </Card>
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
    return (
      <CardLayout>
        <Card.Meta
          title="벌금 현황"
          style={{ textAlign: 'center', marginBottom: 8 }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton.Node style={{ width: 400, height: 400 }} active>
            <PieChartOutlined style={{ fontSize: 200, color: '#bfbfbf' }} />
          </Skeleton.Node>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout>
      <Card.Meta
        title="벌금 현황"
        style={{ textAlign: 'center', marginBottom: 8 }}
      />
      {isEmpty(fineStatus) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Empty description="데이터가 없습니다" />
        </div>
      ) : (
        <svg width={400} height={400}>
          <VictoryPie
            data={convertedFineStatus}
            labels={({ datum }) => `${datum.x}`}
            labelPlacement="perpendicular"
            innerRadius={80}
            labelRadius={160}
            padAngle={2}
            standalone={false}
          />
          <VictoryPie
            data={convertedFineStatus}
            labels={({ datum }) => `${datum.y}`}
            labelPlacement="parallel"
            innerRadius={100}
            labelRadius={100}
            padAngle={2}
            standalone={false}
            style={{ labels: { fill: 'white' } }}
          />
        </svg>
      )}
    </CardLayout>
  );
};

const RunEntryResultCard = () => {
  const [season, setSeason] = useState(
    DALSAMO_SEASONS[DALSAMO_SEASONS.length - 1]
  );
  const { data: userRunEntries, isLoading } = useUserRunEntries({ season });

  const goalDistances = useMemo(() => {
    if (!userRunEntries) {
      return [];
    }

    return map(userRunEntries, (runEntry) => {
      return {
        x: runEntry.weeklyReportId,
        y: runEntry.goalDistance,
        y0: runEntry.goalDistance,
      };
    });
  }, [userRunEntries]);

  const runDistances = useMemo(() => {
    if (!userRunEntries) {
      return [];
    }

    return map(userRunEntries, (runEntry) => {
      return {
        x: runEntry.weeklyReportId,
        y: runEntry.runDistance,
        y0: runEntry.runDistance,
      };
    });
  }, [userRunEntries]);

  console.log({ goalDistances, runDistances });

  if (isLoading) {
    return (
      <CardLayout>
        <Card.Meta
          title="기록 추이"
          style={{ textAlign: 'center', marginBottom: 8 }}
        />
        <Select
          value={season}
          onChange={setSeason}
          style={{ alignSelf: 'end' }}
          options={SEASON_OPTIONS}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton.Node style={{ width: 400, height: 400 }} active>
            <LineChartOutlined style={{ fontSize: 200, color: '#bfbfbf' }} />
          </Skeleton.Node>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout>
      <Card.Meta
        title="기록 추이"
        style={{ textAlign: 'center', marginBottom: 8 }}
      />
      <Select
        value={season}
        onChange={setSeason}
        style={{ alignSelf: 'end' }}
        options={SEASON_OPTIONS}
      />
      {isEmpty(userRunEntries) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Empty description="데이터가 없습니다" />
        </div>
      ) : (
        <svg width={400} height={400}>
          <VictoryChart width={400} height={400} standalone={false}>
            <VictoryLine
              data={goalDistances}
              style={{ data: { stroke: 'red' } }}
            />
            <VictoryScatter
              data={goalDistances}
              style={{ data: { fill: 'red' } }}
            />
            <VictoryLine
              data={runDistances}
              style={{ data: { stroke: 'green' } }}
            />
            <VictoryScatter
              data={runDistances}
              style={{ data: { fill: 'green' } }}
            />
            <VictoryAxis scale="linear" domain={[0, 14]} dependentAxis />
          </VictoryChart>
        </svg>
      )}
    </CardLayout>
  );
};

const RunEntryStatisticCard = () => {
  const [season, setSeason] = useState(
    DALSAMO_SEASONS[DALSAMO_SEASONS.length - 1]
  );
  const { data: userRunEntries, isLoading } = useUserRunEntries({ season });

  const totalRunDistance = useMemo(() => {
    if (!userRunEntries) {
      return 0;
    }

    return sumBy(userRunEntries, 'runDistance');
  }, [userRunEntries]);

  const goalMetPercentage = useMemo(() => {
    if (!userRunEntries || isEmpty(userRunEntries)) {
      return 0;
    }

    const goalMetEntries = filter(
      userRunEntries,
      ({ runDistance, goalDistance }) => {
        return runDistance >= goalDistance;
      }
    );

    return round((size(goalMetEntries) / size(userRunEntries)) * 100, 2);
  }, [userRunEntries]);

  const averageRunPercentage = useMemo(() => {
    if (!userRunEntries || isEmpty(userRunEntries)) {
      return 0;
    }

    return meanBy(userRunEntries, ({ runDistance, goalDistance }) => {
      return round((runDistance / goalDistance) * 100, 2);
    });
  }, [userRunEntries]);

  const averageRunDistance = useMemo(() => {
    if (!userRunEntries || isEmpty(userRunEntries)) {
      return 0;
    }

    return meanBy(userRunEntries, 'runDistance');
  }, [userRunEntries]);

  if (isLoading) {
    return (
      <CardLayout>
        <Select
          value={season}
          onChange={setSeason}
          style={{ alignSelf: 'end' }}
          options={SEASON_OPTIONS}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton.Node style={{ width: 400, height: 400 }} active>
            <AppstoreOutlined style={{ fontSize: 200, color: '#bfbfbf' }} />
          </Skeleton.Node>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout>
      <Select
        value={season}
        onChange={setSeason}
        style={{ alignSelf: 'end' }}
        options={SEASON_OPTIONS}
      />
      <div
        style={{
          flexGrow: 1,
          width: '100%',
        }}
      >
        <Row
          gutter={16}
          justify="space-between"
          align="stretch"
          style={{ height: '100%' }}
        >
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                height: '100%',
              }}
            >
              <Statistic
                title="총 달린거리"
                value={totalRunDistance}
                precision={2}
                suffix="KM"
                style={{ textAlign: 'center' }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                height: '100%',
              }}
            >
              <Statistic
                title="평균 주간 달린거리"
                value={averageRunDistance}
                precision={2}
                suffix="KM"
                style={{ textAlign: 'center' }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                height: '100%',
              }}
            >
              <Statistic
                title="주간 성공률"
                value={goalMetPercentage}
                precision={2}
                suffix="%"
                style={{ textAlign: 'center' }}
              />
            </div>
          </Col>
          <Col span={12}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                height: '100%',
              }}
            >
              <Statistic
                title="평균 주간 달성률"
                value={averageRunPercentage}
                precision={2}
                suffix="%"
                style={{ textAlign: 'center' }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </CardLayout>
  );
};

const DashboardPage = () => {
  return (
    <Row gutter={8}>
      <Col sm={24} md={12} style={{ marginBottom: 8 }}>
        <FineStatusCard />
      </Col>
      <Col sm={24} md={12} style={{ marginBottom: 8 }}>
        <RunEntryResultCard />
      </Col>
      <Col sm={24} md={12} style={{ marginBottom: 8 }}>
        <RunEntryStatisticCard />
      </Col>
    </Row>
  );
};

export default DashboardPage;
