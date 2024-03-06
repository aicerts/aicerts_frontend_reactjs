import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import { AppProps } from 'next/app';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
// @ts-ignore: Implicit any for children prop
import { app } from "../config/firebaseConfig"
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  // @ts-ignore: Implicit any for children prop
  const auth = getAuth(app)
  
  return (
    <>
      {!isLoginPage && <Navigation />}
      <Component {...pageProps} router={router} />
    </>
  );
};

export default App;
