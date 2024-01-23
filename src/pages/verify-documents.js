import React, {useState} from 'react';
import UploadCertificate from './upload-certificate';
import DocumentsValid from './documents-valid';

const VerifyDocuments = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log('API URL:', apiUrl);


    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('pdfFile', selectedFile);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                const response = await fetch(`http://54.146.227.42:3001/api/verify`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json(); // Assuming response is in JSON format
                setApiData(responseData);

            } catch (error) {
                console.error('Error uploading file:', error);
                // Handle error
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <UploadCertificate
                handleFileChange={handleFileChange}
                isLoading={isLoading}
                apiUrl={apiUrl}
                setApiData={setApiData}
            />
            <DocumentsValid apiData={apiData} />
        </div>
    );
}

export default VerifyDocuments;
