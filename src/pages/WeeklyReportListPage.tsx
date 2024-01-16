import { List, Select } from 'antd';
import useWeeklyReports from '../hooks/useWeeklyReports';
import { Link } from 'react-router-dom';
import WeeklyReportTag from '../components/WeeklyReportTag';
import _ from 'lodash';
import { DALSAMO_SEASONS } from 'src/constants';
import { useState } from 'react';

const SEASON_OPTIONS = DALSAMO_SEASONS.map((season) => {
  return {
    value: season,
    label: season,
  };
});

const WeeklyReportListPage = () => {
  const [season, setSeason] = useState(
    DALSAMO_SEASONS[DALSAMO_SEASONS.length - 1]
  );

  const { data: weeklyReports, isLoading } = useWeeklyReports({
    limit: 50,
    season,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h1>주간기록 열람</h1>
      <Select
        value={season}
        onChange={setSeason}
        style={{ alignSelf: 'end' }}
        options={SEASON_OPTIONS}
      />
      <List
        size="small"
        itemLayout="horizontal"
        bordered
        dataSource={_.orderBy(weeklyReports, ['startDate'], ['desc'])}
        loading={isLoading}
        renderItem={(weeklyReport) => {
          const { id, startDate, status } = weeklyReport;

          return (
            <>
              <List.Item key={id}>
                <div>
                  <Link to={`/weekly-reports/${id}`}>{startDate}</Link>
                </div>
                <WeeklyReportTag status={status} />
              </List.Item>
            </>
          );
        }}
      />
    </div>
  );
};

export default WeeklyReportListPage;
