import { render, screen } from '@testing-library/react';

import WeeklyReportTag from './WeeklyReportTag';

it('should show "결산 전" if pending', () => {
  render(<WeeklyReportTag status="pending" />);
  const pendingText = screen.getByText(/결산 전/i);
  expect(pendingText).toBeInTheDocument();
});

it('should show "결산 완료" if pending', () => {
  render(<WeeklyReportTag status="confirmed" />);
  const pendingText = screen.getByText(/결산 완료/i);
  expect(pendingText).toBeInTheDocument();
});
