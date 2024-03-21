import { createContext } from "react";

const CertificateContext = createContext({
    badgeUrl:"",
    logoUrl:"",
    signatureUrl:"",
    certificateUrl:"",
    tab:"",
    selectedCard:0,
    issuerName:"",
    issuerDesignation:""
})

export default CertificateContext;