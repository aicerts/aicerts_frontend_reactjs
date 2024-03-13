import { createContext } from "react";

const CertificateContext = createContext({
    badgeUrl:"",
    logoUrl:"",
    signatureUrl:"",
    certificateUrl:""
})

export default CertificateContext;