import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import Home from '../pages/Home';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import CalculatorPage from '../pages/CalculatorPage';
import ListPage from '../pages/ListPage';
import ProtectedRoute from '../components/ProtectedRoutes/Protected';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/calculator',
        element: (
          <ProtectedRoute>
            <CalculatorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/list',
        element: (
          <ProtectedRoute>
            <ListPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
