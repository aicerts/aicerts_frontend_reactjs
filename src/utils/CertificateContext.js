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
    certificatesData:[],
    isDesign:false
})

export default CertificateContext;