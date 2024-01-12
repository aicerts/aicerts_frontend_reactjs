import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { AppProps } from 'next/app';
import { MyContextProvider } from '../app/MyContext';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  return (
    <MyContextProvider>
       {isLoginPage ? <></> : <Navigation />}
      <Component {...pageProps} />
    </MyContextProvider>
  );
};

export default App;