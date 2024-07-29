import React, { useState } from 'react';
import UploadPdfQr from '../components/uploadPdfQr';
import QrPdfForm from '../components/qrPdfForm';

const IssuePdfQr = () => {
    const [showPdf, setShowPdf] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setSelectedFile(selectedFile);
        } else {
            console.error('Please select a PDF file');
            setSelectedFile(null);
        }
    };

    return (
        <div className='page-bg pdf-qr-wrapper hide-scrollbar'>
            <div className='d-flex justify-content-center text-align-center '>
                <h3 className='title'>Issue New Certificate</h3>
            </div>
            {(showPdf && selectedFile) ? (
                <QrPdfForm file={selectedFile} selectedFile={selectedFile} />
            ) : (
                <UploadPdfQr 
                    handleFileChange={handleFileChange} 
                    setSelectedFile={setSelectedFile} 
                    setShowPdf={setShowPdf} 
                    selectedFile={selectedFile} 
                />
            )}
        </div>
    );
};

export default IssuePdfQr;
