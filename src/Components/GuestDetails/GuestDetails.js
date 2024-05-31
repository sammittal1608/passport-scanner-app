import React, { useState, useEffect } from 'react';
import './GuestDetails.css';
import PassportFront from '../../Images/passport-front.png';
import PassportBack from '../../Images/passport-back.png';
import UserPic from '../../Images/UserPic.png';

function GuestDetails({ isVisible, guestData, fetchReservationData }) {
    const [documentType, setDocumentType] = useState('');
    const [nationality, setNationality] = useState('');
    const [documentNumber, setDocumentNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [givenName, setGivenName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [gender, setGender] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [placeOfIssue, setPlaceOfIssue] = useState('');
    const [documentImage, setDocumentImage] = useState(null);

    useEffect(() => {
        if (guestData) {
            setDocumentType(guestData.DocumentType || '');
            setNationality(guestData.Nationality || '');
            setDocumentNumber(guestData.DocumentNumber || '');
            setDateOfBirth(guestData.DateOfBirth || '');
            setGivenName(guestData.GivenName || '');
            setMiddleName(guestData.MiddleName || '');
            setGender(guestData.Gender || '');
            setFamilyName(guestData.LastName || '');
            setIssueDate(guestData.IssueDate || '');
            setExpiryDate(guestData.ExpiryDate || '');
            setPlaceOfIssue(guestData.IssuingPlace || '');
            setDocumentImage(guestData.DocumentImageBase64 || null);
        }
    }, [guestData]);

    if (!isVisible) return null;

    const handleSave = () => {
        console.log('Saving guest details...');
    };

    const handleCancel = () => {
        console.log('Cancel editing guest details...');
    };

    const handleScan = async () => {
        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcscannerapi.saavy-pay.com:8082/api/IDScan/ScanDocument';
            const response = await fetch(corsProxyUrl + apiUrl, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                 
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.Result) {
                const scannedData = data.ScannedDocument;
                setDocumentType(scannedData.DocumentType || '');
                setNationality(scannedData.NationalityFullName || '');
                setDocumentNumber(scannedData.DocumentNumber || '');
                setDateOfBirth(scannedData.DateOfBirth ? scannedData.DateOfBirth.split('T')[0] : '');
                setGivenName(scannedData.GivenName || '');
                setMiddleName(scannedData.MiddleName || '');
                setGender(scannedData.Gender || '');
                setFamilyName(scannedData.LastName || '');
                setIssueDate(scannedData.IssueDate ? scannedData.IssueDate.split('T')[0] : '');
                setExpiryDate(scannedData.ExpiryDate ? scannedData.ExpiryDate.split('T')[0] : '');
                setPlaceOfIssue(scannedData.IssuingPlace || '');
                setDocumentImage(scannedData.DocumentImageBase64 || null);
            } else {
                console.error("Scanning failed:", data.ErrorMessage);
            }
        } catch (error) {
            console.error("Failed to scan document:", error);
        }
    };
    

    return (
        <div className="guest-details-container">
            <div className="guest-images">
                {documentImage ? (
                    <img src={`data:image/png;base64, ${documentImage}`} alt="Scanned Document" className="scanned-document-img" />
                ) : (
                    <>
                        <img src={PassportFront} alt="Passport Front" className='passport-pic' />
                        <img src={PassportBack} alt="Passport Back" className='passport-pic' />
                    </>
                )}
                <div className='user-pic'>
                    <img src={UserPic} alt="Profile" />
                </div>
            </div>
            <div className="guest-form">
                <div className="document-type">
                    <label>Document Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                        <option value="Passport">Passport</option>
                        <option value="Id Card">Id Card</option>
                        <option value="Visa">Visa</option>
                    </select>
                </div>
                <div className="nationality">
                    <label>Nationality</label>
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
                <div className="document-number">
                    <label>Document Number</label>
                    <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                </div>
                <div className="date-of-birth">
                    <label>Date of Birth</label>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div className="given-name">
                    <label>Given Name</label>
                    <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
                </div>
                {middleName && (
                    <div className="middle-name">
                        <label>Middle Name</label>
                        <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                    </div>
                )}
                <div className="gender">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>
                <div className="family-name">
                    <label>Family Name</label>
                    <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                </div>
                <div className="issue-date">
                    <label>Issue Date</label>
                    <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </div>
                <div className="expiry-date">
                    <label>Expiry Date</label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
                <div className="place-of-issue">
                    <label>Place of Issue</label>
                    <input type="text" value={placeOfIssue} onChange={(e) => setPlaceOfIssue(e.target.value)} />
                </div>
            </div>

            <div className="form-buttons">
                <button onClick={handleSave}>
                    <i className="bi bi-floppy"></i>Save
                </button>
                <button>
                    <i className="bi bi-file-plus"></i>Add Page
                </button>
                <button onClick={handleScan}>
                    <i className="bi bi-upc-scan"></i>Scan
                </button>
                <button onClick={handleCancel}>
                    <i className="bi bi-x-square"></i>Cancel
                </button>
            </div>
        </div>
    );
}

export default GuestDetails;
