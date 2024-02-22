// pages/certificate/[id].tsx
import React from 'react';
import { useRouter } from 'next/router';
import CertificateDisplayPage from '../../components/batch-issue-certificates';

const CertificatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const cardId = Array.isArray(id) ? id[0] : id;

  return <CertificateDisplayPage cardId={cardId} />;
};

export default CertificatePage;
