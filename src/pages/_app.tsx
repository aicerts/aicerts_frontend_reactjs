import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import 'react-datepicker/dist/react-datepicker.css';
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Navigation from '../app/navigation';
import { useRouter } from 'next/router';
import CertificateContext from "../utils/CertificateContext"
import Head from 'next/head';

import { getAuth } from 'firebase/auth';
// @ts-ignore: Implicit any for children prop
import { app } from "../config/firebaseConfig"
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [badgeUrl, setBadgeUrl] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [signatureUrl, setSignatureUrl] = useState("")
  const [certificateUrl, setCertificateUrl] = useState("https://html.aicerts.io/Background123.png")
  const router = useRouter();
  const isLoginPage = router.pathname === '/';
  // @ts-ignore: Implicit any for children prop
  const auth = getAuth(app)

  useEffect(()=>{
    console.log(badgeUrl, "badge")
  },[badgeUrl])
  
  return (
    // @ts-ignore: Implicit any for children prop
    <CertificateContext.Provider value={{badgeUrl, logoUrl, signatureUrl,certificateUrl, setBadgeUrl:setBadgeUrl,setSignatureUrl:setSignatureUrl, setLogoUrl:setLogoUrl, setCertificateUrl:setCertificateUrl }}>
      <Head>
        <link rel="icon" href="https://images.netcomlearning.com/ai-certs/favIcon.svg" />
      </Head>
      {!isLoginPage && <Navigation />}
      <Component {...pageProps} router={router} />
    </CertificateContext.Provider>
  );
};

export default App;
