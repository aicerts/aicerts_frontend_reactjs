import { createContext } from "react";

const CertificateContext = createContext({
    badgeUrl:"",
    logoUrl:"",
    signatureUrl:"",
    certificateUrl:"",
    id: "",
    tab:"",
    selectedCard:0,
    issuerName:"",
    issuerDesignation:"",
    certificatesData:[]
})

export default CertificateContext;