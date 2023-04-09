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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="1078272982167-an324rb6h5v59b2fvnoq5n4a5ph2ijqf.apps.googleusercontent.com">
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
