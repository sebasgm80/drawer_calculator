import { Outlet } from 'react-router-dom';
import './App.css';
import { Footer, Header } from './components';
import { UserProvider } from './context/userContext';

export const App = () => {
  return (
    <UserProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </UserProvider>
  );
};
