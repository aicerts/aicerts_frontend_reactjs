import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Modal from 'react-bootstrap/Modal';
import Image from 'next/image';
import { Rnd } from 'react-rnd';

const DisplayPdf = ({ file, scale, isLocked, setRectangle, rectangle }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const containerRef = useRef(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onPageLoadSuccess = (page) => {
        const { width, height } = page.getViewport({ scale });
        setPdfDimensions({ width, height });
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
    };

    const cancelSelection = () => {
        setRectangle(null);
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.width = `${pdfDimensions.width}px`;
            containerRef.current.style.height = `${pdfDimensions.height}px`;
        }
    }, [pdfDimensions, scale]);

    return (
        <div className="hide-scrollbar" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
            className="hide-scrollbar"
                ref={containerRef}
                style={{
                    overflow: 'auto',
                    position: 'relative'
                }}
            >
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.error}>
                    <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} onLoadSuccess={onPageLoadSuccess} />
                </Document>
                {rectangle && (
                    <Rnd
                        size={{ width: rectangle.width * scale, height: rectangle.height * scale }}
                        position={{ x: rectangle.x * scale, y: rectangle.y * scale }}
                        onDragStop={(e, d) => {
                            if (!isLocked) {
                                setRectangle(prev => ({
                                    ...prev,
                                    x: d.x / scale,
                                    y: d.y / scale
                                }));
                            }
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            if (!isLocked) {
                                const size = Math.min(ref.offsetWidth, ref.offsetHeight);
                                setRectangle(prev => ({
                                    ...prev,
                                    width: size / scale,
                                    height: size / scale,
                                    x: position.x / scale,
                                    y: position.y / scale
                                }));
                            }
                        }}
                        lockAspectRatio={1} // Ensures the rectangle is resized as a square
                        bounds="parent"
                        disableDragging={isLocked}
                        enableResizing={!isLocked}
                        style={{
                            border: '2px solid red',
                            backgroundColor: isLocked ? 'rgba(255,0,0,0.1)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'red',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}
                    >
                        {isLocked && <div>Locked</div>}
                    </Rnd>
                )}
            </div>
            <Modal className='loader-modal' show={isLoading} centered>
                <Modal.Body style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                    <div className='certificate-loader'>
                        <Image
                            src="/backgrounds/login-loading.gif"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <p>Please dont reload the Page. It may take a few minutes.</p>
                </Modal.Body>
            </Modal>
            <Modal className='loader-modal text-center' show={show} centered onHide={() => setShow(false)}>
                <Modal.Body className='p-5'>
                    {error && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Error'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{error}</h3>
                            <button className='warning' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                    {success && (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Success'
                                />
                            </div>
                            <h3 style={{ color: 'green' }}>{success}</h3>
                            <button className='success' onClick={() => setShow(false)}>Ok</button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DisplayPdf;