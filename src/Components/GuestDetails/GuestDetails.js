import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';

import './GuestDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import settings from '../../app.settings.js';


const fetchReservationData = async (reservationId) => {
    try {
        const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/FetchReservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hotelDomain: settings.hotelDomain,
                kioskID: settings.kioskId,
                username: settings.username,
                password: settings.password,
                systemType: settings.systemType,
                language: settings.language,
                legNumber: settings.legNumber,
                chainCode: settings.chainCode,
                destinationEntityID: settings.destinationEntityID,
                destinationSystemType: settings.destinationSystemType,
                FetchBookingRequest: {
                    ReservationNameID: reservationId
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched reservation data:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch reservation data:", error);
        return null;
    }
};

export function GuestDetails({ isVisible, guestData, reservationNumber, addGuest, isButtonClicked, onSave }) {
    const { reservationId } = useParams();

    const [saturated, setSalutation] = useState('');
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
    const [faceImage, setFaceImage] = useState(null);
    const [pmsProfileId, setPmsProfileId] = useState('');
    const [documentImage2, setDocumentImage2] = useState('');
    const [nationalityList, setNationalityList] = useState([]);
    const [nationalityMapping, setNationalityMapping] = useState({});



    // const [phoneNumber, setPhoneNumber] = useState('');
    // const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [reservationNumberState, setReservationNumber] = useState('');
    const [reservationData, setReservationData] = useState('');
    const [backScanButtonClicked, setBackScanButtonClicked] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (reservationId) {
            fetchReservationData(reservationId).then(data => {
                if (data && data.responseData && data.responseData.length > 0) {
                    setReservationData(data.responseData[0]);
                } else {
                    console.warn('No reservation data found');
                }
            }).catch(error => {
                console.error('Failed to fetch reservation data:', error);
            });
        }
    }, [reservationId]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);


    useEffect(() => {
        if (guestData) {
            setPmsProfileId(guestData.PmsProfileID || '');
            setDocumentType(guestData.DocumentType || '');
            setNationality(guestData.Nationality || '');
            setDocumentNumber(guestData.PassportNumber || '');
            setDateOfBirth(displayDate(guestData.dateOfBirth || ''));
            setGivenName(guestData.FirstName || '');
            setMiddleName(guestData.MiddleName || '');
            setGender(guestData.Gender || '');
            setFamilyName(guestData.LastName || '');
            setIssueDate(guestData.IssueDate ? guestData.IssueDate.split('T')[0] : '');
            setExpiryDate(guestData.ExpiryDate ? guestData.ExpiryDate.split('T')[0] : '');
            setPlaceOfIssue(guestData.IssueCountry || '');
            setDocumentImage(guestData.DocumentImageBase64 || null);
            setFaceImage(guestData.FaceImageBase64 || null);
            setDocumentImage2(guestData.DocumentImageBase64 || null);
            // setPhoneNumber(guestData.PhoneNumber || '');
            // setEmail(guestData.Email || '');
            setAddress(guestData.Address || '');
            setReservationNumber(guestData.ReservationNumber || reservationNumber);
            setSalutation(guestData.Saturated || '');
        } else if (reservationNumber) {
            setReservationNumber(reservationNumber);
        }
    }, [guestData, reservationNumber]);

    useEffect(() => {
        if (reservationData && guestData && guestData.PmsProfileID) {
            fetchProfileDocuments(guestData.PmsProfileID, reservationData.ReservationNameID);
        }
    }, [reservationData, guestData]);

    useEffect(() => {
        fetchNationalityList().then(data => {
            setNationalityList(data);
            const mapping = {};
            data.forEach(country => {
                mapping[country.CountryCode] = country.CountryName;
            });
            setNationalityMapping(mapping);
        }).catch(error => {
            console.error('Failed to fetch nationality list:', error);
        });
    }, []);






    nationalityList.forEach(country => {
        nationalityMapping[country.CountryName] = country.CountryCode;
    });

    const fullName = `${givenName} ${middleName ? middleName + ' ' : ''}${familyName}`;


    if (!isVisible) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const displayDate = (dateString) => {
        return dateString === '0001-01-01T00:00:00' ? 'dd-mm-yyyy' : formatDate(dateString);
    };

    const getGuestDetails = (pmsProfileID) => {
        const guestProfiles = reservationData.GuestProfiles;
        const guestDetails = guestProfiles.find(profile => profile.PmsProfileID === pmsProfileID);
        return guestDetails;
    };

    const handleValidation = () => {
        const newErrors = {};

        const alphanumericRegex = /^[a-z0-9]+$/i;
        const nameRegex = /^[a-zA-Z\s]+$/;

        if (!alphanumericRegex.test(documentNumber)) {
            newErrors.documentNumber = 'Document number should be alphanumeric';
        }

        const today = new Date().toISOString().split('T')[0];
        if (dateOfBirth >= today) {
            newErrors.dateOfBirth = 'Date of birth cannot be today or in the future';
        }

        if (!nameRegex.test(givenName)) {
            newErrors.givenName = 'Given name should only contain letters';
        }

        if (middleName && !nameRegex.test(middleName)) {
            newErrors.middleName = 'Middle name should only contain letters';
        }

        if (!nameRegex.test(familyName)) {
            newErrors.familyName = 'Family name should only contain letters';
        }

        if (issueDate > today) {
            newErrors.issueDate = 'Issue date cannot be in the future';
        }

        if (expiryDate < today) {
            newErrors.expiryDate = 'Expiry date should not be a past date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!handleValidation()) {
            console.log("Form is invalid. Please correct the errors and try again.");
            return;
        }

        const requestBody2 = {
            "hotelDomain": settings.hotelDomain,
            "kioskID": settings.kioskId,
            "username": settings.username,
            "password": settings.password,
            "systemType": settings.systemType,
            "language": settings.language,
            "legNumber": settings.legNumber,
            "chainCode": settings.chainCode,
            "destinationEntityID": settings.destinationEntityID,
            "destinationSystemType": settings.destinationSystemType,
            "CreateAccompanyingProfileRequest": {
                "ReservationNumber": reservationNumberState,
                "Gender": gender,
                "FirstName": givenName,
                "MiddleName": middleName,
                "LastName": familyName
            }
        };

        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl1 = 'http://qcapi.saavy-pay.com:8082/api/local/PushReservationDetails';
            const apiUrl2 = 'http://qcapi.saavy-pay.com:8082/api/ows/CreateAccompanyingGuset';

            let response = {};
            let response2 = {};


            if (!pmsProfileId) {

                response2 = await axios.post(corsProxyUrl + apiUrl2, requestBody2, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('create new accompany api save successful:', response2.data);

            }
            var guestDetails;
            var newPmsProfileId;
            if (response2.data && response2.data.result) {
                const responseData = response2.data?.responseData;
                newPmsProfileId = responseData.PmsProfileID;
                setPmsProfileId(newPmsProfileId);
                console.log('Response Data:', responseData);

            }
            else {
                newPmsProfileId = guestData.PmsProfileID;
                setPmsProfileId(guestData.PmsProfileID);
            }
            // else {
            //     console.error('Failed to get PmsProfileID from response');
            // }
            if (newPmsProfileId && newPmsProfileId != null) {
                guestDetails = await getGuestDetails(newPmsProfileId);
            }
            else {
                guestDetails = await getGuestDetails(pmsProfileId);

            }

            const requestBody1 = {
                "RequestObject": [
                    {
                        "ConfirmationNumber": reservationData?.ConfirmationNumber ?? '',
                        "ReservationNumber": reservationNumberState,
                        "ReservationNameID": reservationData?.ReservationNameID,
                        "ArrivalDate": reservationData?.ArrivalDate,
                        "DepartureDate": reservationData?.DepartureDate,
                        "CreatedDateTime": reservationData?.CreatedDateTime,
                        "Adults": reservationData?.Adults,
                        "Child": reservationData?.Child,
                        "ReservationStatus": reservationData?.ReservationStatus,
                        "ComputedReservationStatus": reservationData?.ComputedReservationStatus,
                        "LegNumber": reservationData?.LegNumber,
                        "ChainCode": reservationData?.ChainCode,
                        "ExpectedDepartureTime": reservationData?.ExpectedDepartureTime,
                        "ExpectedArrivalTime": reservationData?.ExpectedArrivalTime,
                        "ReservationSourceCode": reservationData?.ReservationSourceCode,
                        "ReservationType": reservationData?.ReservationType,
                        "PrintRate": reservationData?.PrintRate,
                        "NoPost": reservationData?.NoPost,
                        "DoNotMoveRoom": reservationData?.DoNotMoveRoom,
                        "TotalAmount": reservationData?.TotalAmount,
                        "TotalTax": reservationData?.TotalTax,
                        "IsTaxInclusive": reservationData?.IsTaxInclusive,
                        "CurrentBalance": reservationData?.CurrentBalance,
                        "RoomDetails": {
                            "RoomNumber": reservationData?.RoomDetails?.RoomNumber,
                            "RoomType": reservationData?.RoomDetails?.RoomType,
                            "RoomTypeDescription": reservationData?.RoomDetails?.RoomTypeDescription,
                            "RoomTypeShortDescription": reservationData?.RoomDetails?.RoomTypeShortDescription,
                            "RoomStatus": reservationData?.RoomDetails?.RoomStatus,
                            "RTC": reservationData?.RoomDetails?.RTC,
                            "RTCDescription": reservationData?.RoomDetails?.RTCDescription,
                            "RTCShortDescription": reservationData?.RoomDetails?.RTCShortDescription
                        },
                        "RateDetails": {
                            "RateCode": reservationData?.RateDetails?.RateCode,
                            "RateAmount": reservationData?.RateDetails?.RateAmount,
                            "DailyRates": reservationData?.RateDetails?.DailyRates,
                            "IsMultipleRate": reservationData?.RateDetails?.IsMultipleRate
                        },
                        "PartyCode": reservationData?.PartyCode,
                        "PaymentMethod": reservationData?.PaymentMethod,
                        "IsPrimary": reservationData?.IsPrimary,
                        "ETA": reservationData?.ETA,
                        "FlightNo": reservationData?.FlightNo,
                        "IsCardDetailPresent": reservationData?.IsCardDetailPresent,
                        "IsDepositAvailable": reservationData?.IsDepositAvailable,
                        "IsPreCheckedInPMS": reservationData?.IsPreCheckedInPMS,
                        "IsSaavyPaid": reservationData?.IsSaavyPaid,
                        "SharerReservations": reservationData?.SharerReservations,
                        "DepositDetail": reservationData?.DepositDetail,
                        "PreferanceDetails": reservationData?.PreferanceDetails,
                        "PackageDetails": reservationData?.PackageDetails,
                        "userDefinedFields": reservationData?.userDefinedFields,
                        "GuestProfiles": [
                            {
                                "PmsProfileID": guestDetails.PmsProfileID,
                                "FamilyName": familyName,
                                "GivenName": givenName,
                                "GuestName": `${givenName} ${familyName}`,
                                "Nationality": nationality,
                                "Gender": gender,
                                "PassportNumber": documentNumber,
                                "DocumentType": documentType,
                                "IsPrimary": guestDetails?.IsPrimary || false,
                                "MembershipType": guestDetails?.MembershipType || null,
                                "MembershipNumber": guestDetails?.MembershipNumber || null,
                                "MembershipID": guestDetails?.MembershipID || null,
                                "MembershipName": guestDetails?.MembershipName || null,
                                "MembershipClass": guestDetails?.MembershipClass || null,
                                "MembershipLevel": guestDetails?.MembershipLevel || null,
                                "FirstName": givenName,
                                "MiddleName": middleName,
                                "LastName": familyName,
                                "Phones": reservationData?.Phones,
                                "Address": reservationData?.Address,
                                "Email": reservationData?.Email,
                                "BirthDate": dateOfBirth,
                                "IssueDate": issueDate,
                                "IssueCountry": placeOfIssue,
                                "IsActive": reservationData?.IsActive,
                                "Title": reservationData?.Title,
                                "VipCode": reservationData?.VipCode,
                                "CloudProfileDetailID": null
                            }
                        ],
                        "Alerts": reservationData?.Alerts,
                        "IsMemberShipEnrolled": reservationData?.IsMemberShipEnrolled,
                        "reservationDocument": reservationData?.reservationDocument,
                        "GuestSignature": reservationData?.GuestSignature,
                        "FolioEmail": reservationData?.FolioEmail || '',
                        "IsBreakFastAvailable": reservationData?.IsBreakFastAvailable
                    }
                ],
                "SyncFromCloud": true
            };

            response = await axios.post(apiUrl1, requestBody1, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('First save successful:', response.data);
            if (response.data && response.data.result) {
                const responseData = response.data.responseData;
                console.log('Response Data:', responseData);
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
            } else {
                console.error('Save failed:', response.data);
            }

            await updatePassportDetails(guestDetails);
            pushDocumentDetails(guestDetails);
            await handleUpdateName(guestDetails);
            onSave();
            // await handleUpdateEmail();
            // await handleUpdatePhone();
            // await handleUpdateAddress();


        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to save guest details:', error);
        }
    };

    const handleCancel = () => {
        console.log('Cancel editing guest details...');
    };

    const updatePassportDetails = async (guestDetails) => {
        try {

            if (!guestDetails) {
                throw new Error('Guest details not found');
            }

            const phoneDetails = guestDetails.Phones && guestDetails.Phones.length > 0 ? guestDetails.Phones[0] : {};
            const emailDetails = guestDetails.Email && guestDetails.Email.length > 0 ? guestDetails.Email[0] : {};
            const addressDetails = guestDetails.Address && guestDetails.Address.length > 0 ? guestDetails.Address[0] : {};

            const requestBody = {
                hotelDomain: settings.hotelDomain,
                kioskID: settings.kioskId,
                username: settings.username,
                password: settings.password,
                systemType: settings.systemType,
                language: settings.language,
                legNumber: settings.legNumber,
                chainCode: settings.chainCode,
                destinationEntityID: settings.destinationEntityID,
                destinationSystemType: settings.destinationSystemType,
                UpdateProileRequest: {
                    addresses: [
                        {
                            addressType: addressDetails.addressType || '',
                            operaId: addressDetails.operaId || 0,
                            primary: addressDetails.primary || true,
                            displaySequence: addressDetails.displaySequence || 1,
                            address1: addressDetails.address1 || '',
                            address2: addressDetails.address2 || '',
                            city: addressDetails.city || '',
                            state: addressDetails.state || '',
                            country: addressDetails.country || '',
                            zip: addressDetails.zip || ''
                        }
                    ],
                    profileID: guestDetails.PmsProfileID,
                    emails: [
                        {
                            emailType: emailDetails.emailType || '',
                            operaId: emailDetails.operaId || 0,
                            primary: emailDetails.primary || true,
                            displaySequence: emailDetails.displaySequence || 1,
                            // email: email || ''
                        }
                    ],
                    phones: [
                        {
                            phoneType: phoneDetails.phoneType || '',
                            phoneRole: phoneDetails.phoneRole || '',
                            operaId: phoneDetails.operaId || 0,
                            primary: phoneDetails.primary || true,
                            displaySequence: phoneDetails.displaySequence || 1,
                            // phoneNumber: phoneNumber || ''
                        }
                    ],
                    dob: dateOfBirth || '',
                    gender: gender || '',
                    nationality: nationality || '',
                    issueCountry: placeOfIssue || '',
                    documentNumber: documentNumber || '',
                    documentType: documentType || '',
                    issueDate: issueDate || '',
                    expiryDate: expiryDate || ''
                }
            };

            console.log(requestBody);
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdatePassport';

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update passport details successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to update passport details:', error);
        }
    };


    const handleScan = async (scanType) => {
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
                const nationalityCode = nationalityMapping[scannedData.NationalityFullName] || '';

                if (scanType === 'front') {
                    if (!documentImage) {
                        setDocumentType(scannedData.DocumentType || '');
                        setNationality(nationalityCode);
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
                        setFaceImage(scannedData.FaceImageBase64 || null);
                    }
                    setBackScanButtonClicked(false);
                } else if (scanType === 'back') {
                    if (!documentImage2) {
                        setDocumentType(scannedData.DocumentType || '');
                        setNationality(nationalityCode);
                        setDocumentNumber(scannedData.DocumentNumber || '');
                        setDateOfBirth(scannedData.DateOfBirth ? scannedData.DateOfBirth.split('T')[0] : '');
                        setGivenName(scannedData.GivenName || '');
                        setMiddleName(scannedData.MiddleName || '');
                        setGender(scannedData.Gender || '');
                        setFamilyName(scannedData.LastName || '');
                        setIssueDate(scannedData.IssueDate ? scannedData.IssueDate.split('T')[0] : '');
                        setExpiryDate(scannedData.ExpiryDate ? scannedData.ExpiryDate.split('T')[0] : '');
                        setPlaceOfIssue(scannedData.IssuingPlace || '');
                        setDocumentImage2(scannedData.DocumentImageBase64 || null);
                        setFaceImage(scannedData.FaceImageBase64 || null);
                    }
                    setBackScanButtonClicked(true);
                }
            } else {
                console.error("Scanning failed:", data.ErrorMessage);
            }
        } catch (error) {
            console.error("Failed to scan document:", error);
        }
    };




    const pushDocumentDetails = (guestDetails) => {
        const requestBody = {
            RequestObject: [
                {
                    ReservationNameID: reservationData.ReservationNameID,
                    ProfileID: guestDetails.PmsProfileID,
                    DocumentNumber: documentNumber,
                    ExpiryDate: expiryDate,
                    IssueDate: issueDate,
                    DocumentImage1: documentImage,
                    DocumentImage2: null,
                    DocumentImage3: null,
                    FaceImage: faceImage,
                    CloudProfileDetailID: "",
                    DocumentTypeCode: null,
                    IssueCountry: placeOfIssue
                }
            ],
            SyncFromCloud: null
        };

        fetch('http://qcapi.saavy-pay.com:8082/api/local/PushDocumentDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };




    const fetchProfileDocuments = (pmsProfileId, reservationNameID) => {
        const requestBody = {
            RequestObject: {
                ProfileID: pmsProfileId,
                ReservationNameID: reservationNameID
            },
            SyncFromCloud: null
        };
        const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
        const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/local/FetchProfileDocumentImageByProfileID';

        fetch(corsProxyUrl + apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
                    return response.text();
                }
                return response.json();
            })
            .then(data => {
                if (typeof data === 'string') {
                    console.error('Error page HTML:', data);
                } else if (data.result) {
                    const profileData = data.responseData[0];
                    setDocumentType(profileData?.DocumentType || '');
                    setNationality(nationalityMapping[profileData?.Nationality] || profileData?.Nationality || '');
                    setDocumentNumber(profileData?.DocumentNumber || '');
                    setIssueDate(profileData?.IssueDate ? profileData.IssueDate.split('T')[0] : '');
                    setExpiryDate(profileData?.ExpiryDate ? profileData.ExpiryDate.split('T')[0] : '');
                    setPlaceOfIssue(profileData?.IssueCountry || '');
                    setDocumentImage(profileData?.DocumentImage1 || null);
                    setFaceImage(profileData?.FaceImage || null);
                    setGivenName(profileData?.FirstName || '');
                    setMiddleName(profileData?.MiddleName || '');
                    setFamilyName(profileData?.LastName || '');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };


    const fetchNationalityList = async () => {
        try {
            const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/GetNationalityList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelDomain: settings.hotelDomain,
                    kioskID: settings.kioskId,
                    username: settings.username,
                    password: settings.password,
                    systemType: settings.systemType,
                    language: settings.language,
                    legNumber: null,
                    chainCode: settings.chainCode,
                    destinationEntityID: settings.destinationEntityID,
                    destinationSystemType: settings.destinationSystemType,
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.responseData;
        } catch (error) {
            console.error("Failed to fetch nationality list:", error);
            return [];
        }
    };



    const handleUpdateName = async (guestDetails) => {
        const requestBody = {
            hotelDomain: settings.hotelDomain,
            kioskID: settings.kioskId,
            username: settings.username,
            password: settings.password,
            systemType: settings.systemType,
            language: settings.language,
            legNumber: settings.legNumber,
            chainCode: settings.chainCode,
            destinationEntityID: settings.destinationEntityID,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                profileID: guestDetails.PmsProfileID,
                GivenName: givenName,
                MiddleName: middleName,
                FamilyName: familyName
            }
        };
        console.log(requestBody);

        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdateName';

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update name successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to update name details:', error);
        }
    };

    const handleUpdatePhone = async () => {
        try {
            var guestDetails = await getGuestDetails(pmsProfileId);
            if (!guestDetails) {
                throw new Error('Guest details not found');
            }

            const phoneDetails = guestDetails.Phones ? guestDetails.Phones[0] : {};

            const requestBody = {
                hotelDomain: settings.hotelDomain,
                kioskID: settings.kioskId,
                username: settings.username,
                password: settings.password,
                systemType: settings.systemType,
                language: settings.language,
                legNumber: settings.legNumber,
                chainCode: settings.chainCode,
                destinationEntityID: settings.destinationEntityID,
                destinationSystemType: settings.destinationSystemType,
                UpdateProileRequest: {
                    addresses: null,
                    profileID: pmsProfileId,
                    emails: null,
                    phones: [
                        {
                            phoneType: phoneDetails.phoneType || '',
                            phoneRole: "PHONE",
                            operaId: phoneDetails.operaId || '',
                            primary: phoneDetails.primary || false,
                            displaySequence: phoneDetails.displaySequence || 0,
                            // phoneNumber: phoneNumber
                        }
                    ],
                    dob: guestDetails.BirthDate || '',
                    gender: guestDetails.Gender || '',
                    nationality: guestDetails.Nationality || '',
                    issueCountry: guestDetails.issueCountry || '',
                    documentNumber: guestDetails.PassportNumber || '',
                    documentType: guestDetails.DocumentType || '',
                    issueDate: guestDetails.IssueDate || ''
                }
            };

            console.log(requestBody);
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdatePhoneList';

            const response = await axios.post(corsProxyUrl + apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update phone list successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to update phone list:', error);
        }
    };

    const handleUpdateEmail = async () => {
        let guestDetails = getGuestDetails(pmsProfileId);
        const requestBody = {
            hotelDomain: settings.hotelDomain,
            kioskID: settings.kioskId,
            username: settings.username,
            password: settings.password,
            systemType: settings.systemType,
            language: settings.language,
            legNumber: settings.legNumber,
            chainCode: settings.chainCode,
            destinationEntityID: settings.destinationEntityID,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                addresses: null,
                profileID: pmsProfileId,
                emails: [
                    {
                        emailType: reservationData?.GemailType,
                        operaId: reservationData?.operaId,
                        primary: reservationData?.primary,
                        displaySequence: reservationData?.displaySequence,
                        // email: email
                    }
                ],
                phones: null,
                dob: reservationData?.dob,
                gender: reservationData?.gender,
                nationality: reservationData?.nationality,
                issueCountry: reservationData?.issueCountry,
                documentNumber: reservationData?.documentNumber,
                documentType: reservationData?.documentType,
                issueDate: reservationData?.issueDate
            }
        };

        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdateEmailList';

            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update email list successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to update email list:', error);
        }
    };

    const handleUpdateAddress = async () => {
        const requestBody = {
            hotelDomain: settings.hotelDomain,
            kioskID: settings.kioskId,
            username: settings.username,
            password: settings.password,
            systemType: settings.systemType,
            language: settings.language,
            legNumber: settings.legNumber,
            chainCode: settings.chainCode,
            destinationEntityID: settings.destinationEntityID,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                addresses: [
                    {
                        addressType: reservationData?.GuestProfiles[0].addresses[0].addressType,
                        operaId: reservationData?.GuestProfiles[0].addresses[0].operaId,
                        primary: reservationData?.GuestProfiles[0].addresses[0].primary,
                        displaySequence: reservationData?.GuestProfiles[0].addresses[0].displaySequence,
                        address1: reservationData?.GuestProfiles[0].addresses[0].address1,
                        address2: reservationData?.GuestProfiles[0].addresses[0].address2,
                        city: reservationData?.GuestProfiles[0].addresses[0].city,
                        state: reservationData?.GuestProfiles[0].addresses[0].state,
                        country: reservationData?.GuestProfiles[0].addresses[0].country,
                        zip: reservationData?.GuestProfiles[0].addresses[0].zip
                    }
                ],
                profileID: pmsProfileId,
                emails: null,
                phones: null,
                dob: reservationData?.dob,
                gender: reservationData?.gender,
                nationality: reservationData?.nationality,
                issueCountry: reservationData?.issueCountry,
                documentNumber: reservationData?.documentNumber,
                documentType: reservationData?.documentType,
                issueDate: reservationData?.issueDate
            }
        };

        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdateAddressList';

            const response = await axios.post(corsProxyUrl + apiUrl, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Update address list successful:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            console.error('Failed to update address list:', error);
        }
    };

    const handleCheckIn = async (reservationNameID) => {
        try {
            const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/GuestCheckIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelDomain: settings.hotelDomain,
                    kioskID: settings.kioskId,
                    username: settings.username,
                    password: settings.password,
                    systemType: settings.systemType,
                    language: settings.language,
                    legNumber: settings.legNumber,
                    chainCode: settings.chainCode,
                    destinationEntityID: settings.destinationEntityID,
                    destinationSystemType: settings.destinationSystemType,
                    SendFolio: settings.SendFolio,
                    OperaReservation: {
                        ReservationNameID: reservationNameID
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Check-in successful:", data);
        } catch (error) {
            console.error("Failed to check in:", error);
        }
    };

    const handleCheckOut = async (reservationNameID) => {
        try {
            const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/GuestCheckOut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelDomain: "EU",
                    kioskID: "KIOSK",
                    username: "SUPERVISOR",
                    password: "PEGASUS2021",
                    systemType: "KIOSK",
                    language: "EN",
                    legNumber: null,
                    chainCode: "CHA",
                    destinationEntityID: "TI",
                    destinationSystemType: "PMS",
                    SendFolio: false,
                    OperaReservation: {
                        ReservationNameID: reservationNameID
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Check-out successful:", data);
        } catch (error) {
            console.error("Failed to check out:", error);
        }
    };


    return (
        <div className="guest-details-container">
            {showSuccessAlert && (
                <Alert variant="filled" severity="success" onClose={() => setShowSuccessAlert(false)}>
                    A new Guest added Successfully.
                </Alert>
            )}
            <div className="guest-images">
                <div className="user-pic">
                    {documentImage ? (
                        <img src={`data:image/png;base64, ${documentImage}`} alt="Document Image" className="full-img" />
                    ) : (
                        <div className="empty-placeholder">No profile picture available</div>
                    )}
                    <button onClick={() => handleScan('front')} className='scan-button'>
                        <i className="bi bi-upc-scan"></i>Scan
                    </button>
                </div>
                <div className="user-pic">
                    {documentImage && backScanButtonClicked ? (
                        <img src={`data:image/png;base64, ${documentImage2}`} alt="Document Image" className="full-img" />
                    ) : (
                        <div className="empty-placeholder">No profile picture available</div>
                    )}
                    <button onClick={() => handleScan('back')} className='scan-button'>
                        <i className="bi bi-upc-scan"></i>Scan
                    </button>
                </div>
                <div className="profile-pic">
                    {faceImage ? (
                        <img src={`data:image/png;base64, ${faceImage}`} alt="Face Image" className="face-img" />
                    ) : (
                        <div className="empty-placeholder">No profile picture available</div>
                    )}
                </div>
                <div className='add-guest-button-container'>
                    {reservationData.ReservationStatus === 'RESERVED' && (
                        <button type="button" className="btn btn-outline-primary out-btn" onClick={() => handleCheckIn(reservationData.ReservationNameID)}>
                            Check In
                            <i className="bi bi-check-square"></i>
                        </button>
                    )}
                    {reservationData.ReservationStatus === 'CHECK-IN' && (
                        <button type="button" className="btn btn-outline-primary in-btn" onClick={() => handleCheckOut(reservationData.ReservationNameID)}>
                            Check Out
                            <i className="bi bi-x-square"></i>
                        </button>
                    )}
                    <button type="button" className={`btn btn-outline-primary ${isButtonClicked ? 'clicked' : ''}`} onClick={addGuest}>
                        Add Guest
                        <i className="bi bi-plus-lg"></i>
                    </button>
                </div>

            </div>

            <div className="guest-form">
                <div className={`document-type ${errors.documentType ? 'has-error' : ''}`}>
                    <label>Document Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                        <option value="">Select Document Type</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="IDCARD">ID Card</option>
                        <option value="VISA">Visa</option>
                    </select>
                    {errors.documentType && <div className="error">{errors.documentType}</div>}
                </div>
                <div className={`document-number ${errors.documentNumber ? 'has-error' : ''}`}>
                    <label>Document Number</label>
                    <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                    {errors.documentNumber && <div className="error">{errors.documentNumber}</div>}
                </div>
                <div className={`nationality ${errors.nationality ? 'has-error' : ''}`}>
                    <label>Nationality</label>
                    <select value={nationality} onChange={(e) => setNationality(e.target.value)}>
                        <option value="">Select Nationality</option>
                        {nationalityList.map(country => (
                            <option key={country.CountryCode} value={country.CountryCode}>
                                {country.CountryName}
                            </option>
                        ))}
                    </select>
                    {errors.nationality && <div className="error">{errors.nationality}</div>}
                </div>
                <div className={`date-of-birth ${errors.dateOfBirth ? 'has-error' : ''}`}>
                    <label>Date of Birth</label>
                    <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    {errors.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}
                </div>
                <div className="saturated">
                    <label>Salutation</label>
                    <input type="text" value={saturated} onChange={(e) => setSalutation(e.target.value)} />
                </div>
                <div className={`given-name ${errors.givenName ? 'has-error' : ''}`}>
                    <label>Given Name</label>
                    <input type="text" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
                    {errors.givenName && <div className="error">{errors.givenName}</div>}
                </div>
                {middleName && (
                    <div className={`middle-name ${errors.middleName ? 'has-error' : ''}`}>
                        <label>Middle Name</label>
                        <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                        {errors.middleName && <div className="error">{errors.middleName}</div>}
                    </div>
                )}
                <div className={`family-name ${errors.familyName ? 'has-error' : ''}`}>
                    <label>Family Name</label>
                    <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                    {errors.familyName && <div className="error">{errors.familyName}</div>}
                </div>
                <div className="full-name">
                    <label>Full Name</label>
                    <input type="text" value={fullName} readOnly />
                </div>
                <div className={`gender ${errors.gender ? 'has-error' : ''}`}>
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                    {errors.gender && <div className="error">{errors.gender}</div>}
                </div>
                <div className={`issue-date ${errors.issueDate ? 'has-error' : ''}`}>
                    <label>Issue Date</label>
                    <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                    {errors.issueDate && <div className="error">{errors.issueDate}</div>}
                </div>
                <div className={`expiry-date ${errors.expiryDate ? 'has-error' : ''}`}>
                    <label>Expiry Date</label>
                    <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    {errors.expiryDate && <div className="error">{errors.expiryDate}</div>}
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
                <button onClick={handleCancel}>
                    <i className="bi bi-x-square"></i>Cancel
                </button>
            </div>
        </div>
    );

}


export default GuestDetails;
