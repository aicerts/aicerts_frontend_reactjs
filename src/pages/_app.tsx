import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { AppProps } from 'next/app';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';
import Head from 'next/head';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  
  return (
    <>
     <Head>
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
      </Head>
      {!isLoginPage && <Navigation />}
      <Component {...pageProps} router={router} />
    </>
  );
};

export default App;
