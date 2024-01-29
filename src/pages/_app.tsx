import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { AppProps } from 'next/app';
import { MyContextProvider } from '../app/AuthProvider';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';
import AdminNavigation from '@/app/admin-navigation';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  const isAdminLoginPage = router.pathname === '/admin';
  const isAdminSignup = router.pathname === '/admin/signup';
  return (
    <MyContextProvider>
       {isLoginPage || isAdminLoginPage ? 
       (null) : (
        isAdminSignup ? (
          <AdminNavigation />
        ) : (
          <Navigation />
        )
       )}
       
      <Component {...pageProps} router={router} />
    </MyContextProvider>
  );
};

export default App;