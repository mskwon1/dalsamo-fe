import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Root';
import ErrorPage from './pages/ErrorPage';
import CreateWeeklyReportPage from './pages/CreateWeeklyReportPage';
import WeeklyReportListPage from './pages/WeeklyReportListPage';
import WeeklyReportDetailPage from './pages/WeeklyReportDetailPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'weekly-reports',
        element: <WeeklyReportListPage />,
      },
      {
        path: 'weekly-reports/new',
        element: <CreateWeeklyReportPage />,
      },
      {
        path: 'weekly-reports/:weeklyReportId',
        element: <WeeklyReportDetailPage />,
      },
      {
        path: 'weekly-reports/:weeklyReportId/close',
        element: <WeeklyReportDetailPage />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
