import React, { useState, useEffect } from 'react';
import './GuestDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import settings from '../../app.settings.js';

export const fetchReservationData = async (reservationId) => {
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


function GuestDetails({ isVisible, guestData, reservationNumber }) {
    const { reservationId } = useParams();

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
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [reservationNumberState, setReservationNumber] = useState('');
    const [reservationData, setReservationData] = useState('');

    useEffect(() => {
        if (reservationId) {
            fetchReservationData(reservationId).then(data => {
                setReservationData(data.responseData[0]);
            });
        }

        if (guestData) {
            setPmsProfileId(guestData.PmsProfileID || '');
            setDocumentType(guestData.DocumentType || '');
            setNationality(guestData.Nationality || '');
            setDocumentNumber(guestData.PassportNumber || '');
            setDateOfBirth(guestData.BirthDate ? guestData.BirthDate.split('T')[0] : '');
            setGivenName(guestData.FirstName || '');
            setMiddleName(guestData.MiddleName || '');
            setGender(guestData.Gender || '');
            setFamilyName(guestData.LastName || '');
            setIssueDate(guestData.IssueDate ? guestData.IssueDate.split('T')[0] : '');
            setExpiryDate(guestData.ExpiryDate ? guestData.ExpiryDate.split('T')[0] : '');
            setPlaceOfIssue(guestData.IssueCountry || '');
            setDocumentImage(guestData.DocumentImageBase64 || null);
            setFaceImage(guestData.FaceImageBase64 || null);
            setPhoneNumber(guestData.PhoneNumber || '');
            setEmail(guestData.Email || '');
            setAddress(guestData.Address || '');
            setReservationNumber(guestData.ReservationNumber || reservationNumber);
        } else if (reservationNumber) {
            setReservationNumber(reservationNumber);
        }

        if (guestData && guestData.PmsProfileID && reservationNumber) {
            fetchProfileDocuments(guestData.PmsProfileID);
        }
    }, [guestData, reservationNumber]);

    if (!isVisible) return null;

    const getGuestDetails = (pmsProfileID) => {
        const guestProfiles = reservationData.GuestProfiles;
        const guestDetails = guestProfiles.find(profile => profile.PmsProfileID === pmsProfileID);
        return guestDetails;
    };

    const handleSave = async () => {
        var guestDetails = await getGuestDetails(pmsProfileId);

        const requestBody1 = {
            "RequestObject": [
                {
                    "ConfirmationNumber": reservationData?.ConfirmationNumber ?? '',
                    "ReservationNumber": reservationNumberState,
                    "ReservationNameID": reservationData?.ReservationNameID,
                    "ArrivalDate": reservationData?.ArrivalDate,
                    "DepartureDate": reservationData?.DepartureDate,
                    "CreatedDateTime": reservationData?.CreatedDateTime,
                    "Adults": reservationData?.Adult,
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
                            "PmsProfileID": pmsProfileId,
                            "FamilyName": familyName,
                            "GivenName": givenName,
                            "GuestName": `${givenName} ${familyName}`,
                            "Nationality": nationality,
                            "Gender": gender,
                            "PassportNumber": documentNumber,
                            "DocumentType": guestDetails?.DocumentType,
                            "IsPrimary": guestDetails?.IsPrimary,
                            "MembershipType": guestDetails?.MembershipType,
                            "MembershipNumber": guestDetails?.MembershipNumber,
                            "MembershipID": guestDetails?.MembershipID,
                            "MembershipName": guestDetails?.MembershipName,
                            "MembershipClass": guestDetails?.MembershipClass,
                            "MembershipLevel": guestDetails?.MembershipLevel,
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

                response2 = await axios.post(apiUrl2, requestBody2, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('create new accompany api save successful:', response2.data);

            }

            if (response2.data && response2.data.result) {
                const responseData = response2.data?.responseData;
                setPmsProfileId(responseData.PmsProfileID);
                console.log('Response Data:', responseData);
            }


            response = await axios.post(corsProxyUrl + apiUrl1, requestBody1, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('First save successful:', response.data);
            if (response.data && response.data.result) {
                const responseData = response.data.responseData;
                console.log('Response Data:', responseData);
            } else {
                console.error('Save failed:', response.data);
            }

            await updatePassportDetails(pmsProfileId);
            pushDocumentDetails();
            await handleUpdateName();
            await handleUpdateEmail();
            await handleUpdatePhone();
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

    const updatePassportDetails = async (pmsProfileId) => {
        try {
            let guestDetails = await getGuestDetails(pmsProfileId);

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
                    profileID: pmsProfileId,
                    emails: [
                        {
                            emailType: emailDetails.emailType || '',
                            operaId: emailDetails.operaId || 0,
                            primary: emailDetails.primary || true,
                            displaySequence: emailDetails.displaySequence || 1,
                            email: email || ''
                        }
                    ],
                    phones: [
                        {
                            phoneType: phoneDetails.phoneType || '',
                            phoneRole: phoneDetails.phoneRole || '',
                            operaId: phoneDetails.operaId || 0,
                            primary: phoneDetails.primary || true,
                            displaySequence: phoneDetails.displaySequence || 1,
                            phoneNumber: phoneNumber || ''
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
                setFaceImage(scannedData.FaceImageBase64 || null);
                setEmail(scannedData.email || '');
                setPhoneNumber(scannedData.PhoneNumber || '');

            } else {
                console.error("Scanning failed:", data.ErrorMessage);
            }
        } catch (error) {
            console.error("Failed to scan document:", error);
        }
    };

    const pushDocumentDetails = () => {
        const requestBody = {
            RequestObject: [
                {
                    ReservationNameID: reservationData.ReservationNameID,
                    ProfileID: pmsProfileId,
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

    const fetchProfileDocuments = (pmsProfileId) => {
        fetchReservationData();

        const requestBody = {
            RequestObject: {
                ProfileID: pmsProfileId,
                ReservationNameID: reservationNameId
            },
            SyncFromCloud: null
        };

        fetch('http://qcapi.saavy-pay.com:8082/api/local/FetchProfileDocumentImageByProfileID', {
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
                setDocumentType(profileData.DocumentType || '');
                setNationality(profileData.Nationality || '');
                setDocumentNumber(profileData.DocumentNumber || '');
                setIssueDate(profileData.IssueDate ? profileData.IssueDate.split('T')[0] : '');
                setExpiryDate(profileData.ExpiryDate ? profileData.ExpiryDate.split('T')[0] : '');
                setPlaceOfIssue(profileData.IssueCountry || '');
                setDocumentImage(profileData.DocumentImage1 || null);
                setFaceImage(profileData.FaceImage || null);
                setGivenName(profileData.FirstName || '');
                setMiddleName(profileData.MiddleName || '');
                setFamilyName(profileData.LastName || '');
            }
        })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const handleUpdateName = async () => {
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
                profileID: pmsProfileId,
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
                            phoneRole: phoneDetails.phoneRole || '',
                            operaId: phoneDetails.operaId || '',
                            primary: phoneDetails.primary || false,
                            displaySequence: phoneDetails.displaySequence || 0,
                            phoneNumber: phoneNumber
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
                        email: email
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
    //     const requestBody = {
    //         "RequestObject": [
    //             {
    //                 "ConfirmationNumber": null,
    //                 "ReservationNumber": "308151",
    //                 "ReservationNameID": "302151",
    //                 "ArrivalDate": "2008-05-16T00:00:00",
    //                 "DepartureDate": "2008-05-17T00:00:00",
    //                 "CreatedDateTime": null,
    //                 "Adults": 1,
    //                 "Child": 0,
    //                 "ReservationStatus": "RESERVED",
    //                 "ComputedReservationStatus": null,
    //                 "LegNumber": null,
    //                 "ChainCode": null,
    //                 "ExpectedDepartureTime": null,
    //                 "ExpectedArrivalTime": "1900-01-01T04:44:00",
    //                 "ReservationSourceCode": null,
    //                 "ReservationType": "NON",
    //                 "PrintRate": null,
    //                 "NoPost": null,
    //                 "DoNotMoveRoom": null,
    //                 "TotalAmount": 100.0,
    //                 "TotalTax": null,
    //                 "IsTaxInclusive": false,
    //                 "CurrentBalance": 0.0,
    //                 "RoomDetails": {
    //                     "RoomNumber": null,
    //                     "RoomType": "SKI",
    //                     "RoomTypeDescription": "Standard King",
    //                     "RoomTypeShortDescription": null,
    //                     "RoomStatus": null,
    //                     "RTC": null,
    //                     "RTCDescription": null,
    //                     "RTCShortDescription": null
    //                 },
    //                 "RateDetails": {
    //                     "RateCode": null,
    //                     "RateAmount": null,
    //                     "DailyRates": null,
    //                     "IsMultipleRate": false
    //                 },
    //                 "PartyCode": null,
    //                 "PaymentMethod": null,
    //                 "IsPrimary": null,
    //                 "ETA": null,
    //                 "FlightNo": null,
    //                 "IsCardDetailPresent": false,
    //                 "IsDepositAvailable": false,
    //                 "IsPreCheckedInPMS": null,
    //                 "IsSaavyPaid": null,
    //                 "SharerReservations": null,
    //                 "DepositDetail": null,
    //                 "PreferanceDetails": null,
    //                 "PackageDetails": null,
    //                 "userDefinedFields": null,
    //                 "GuestProfiles": [
    //                     {
    //                         "PmsProfileID": "194711",
    //                         "FamilyName": familyName,
    //                         "GivenName": givenName,
    //                         "GuestName": null,
    //                         "Nationality": nationality,
    //                         "Gender": gender,
    //                         "PassportNumber": documentNumber,
    //                         "DocumentType": documentType,
    //                         "IsPrimary": false,
    //                         "MembershipType": null,
    //                         "MembershipNumber": null,
    //                         "MembershipID": null,
    //                         "MembershipName": null,
    //                         "MembershipClass": null,
    //                         "MembershipLevel": null,
    //                         "FirstName": givenName,
    //                         "MiddleName": middleName,
    //                         "LastName": familyName,
    //                         "Phones": [
    //                             {
    //                                 "phoneType": "PHONE",
    //                                 "phoneRole": null,
    //                                 "operaId": 0,
    //                                 "primary": true,
    //                                 "displaySequence": 1,
    //                                 "PhoneNumber": null
    //                             }
    //                         ],
    //                         "Address": [
    //                             {
    //                                 "addressType": null,
    //                                 "operaId": 0,
    //                                 "primary": null,
    //                                 "displaySequence": null,
    //                                 "address1": "sfsfdfd",
    //                                 "address2": null,
    //                                 "city": "sdfdsfdsf",
    //                                 "state": null,
    //                                 "country": "IN",
    //                                 "zip": "324324"
    //                             }
    //                         ],
    //                         "Email": [
    //                             {
    //                                 "emailType": "EMAIL",
    //                                 "operaId": 0,
    //                                 "primary": true,
    //                                 "displaySequence": 1,
    //                                 "email": null
    //                             }
    //                         ],
    //                         "BirthDate": dateOfBirth,
    //                         "IssueDate": issueDate,
    //                         "IssueCountry": null,
    //                         "IsActive": false,
    //                         "Title": null,
    //                         "VipCode": null,
    //                         "CloudProfileDetailID": "2"
    //                     }
    //                 ],
    //                 "Alerts": null,
    //                 "IsMemberShipEnrolled": false,
    //                 "reservationDocument": null,
    //                 "GuestSignature": "yHJtimDlwsXGEIBAkwQQrCbp0zYEIJCLAIKVCxcbQwACTRJAsJqkT9sQgEAuAv8BAAaMZi1o7bwAAAAASUVORK5CYII=",
    //                 "FolioEmail": null,
    //                 "IsBreakFastAvailable": null
    //             }
    //         ],
    //         "SyncFromCloud": true
    //     };

    //     try {
    //         const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
    //         const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/local/PushReservationDetails';

    //         const response = await axios.post(corsProxyUrl + apiUrl, requestBody, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         console.log('Update reservation details successful:', response.data);
    //     } catch (error) {
    //         if (error.response) {
    //             console.error('Server responded with non-2xx status:', error.response.data);
    //         } else if (error.request) {
    //             console.error('No response received:', error.request);
    //         } else {
    //             console.error('Error setting up the request:', error.message);
    //         }
    //         console.error('Failed to update reservation details:', error);
    //     }
    // };

    return (
        <div className="guest-details-container">
            <div className="guest-images">
                {documentImage ? (
                    <img src={`data:image/png;base64, ${documentImage}`} alt="Scanned Document" className="scanned-document-img" />
                ) : (
                    <>
                        <div className="empty-placeholder">No document image available</div>

                    </>
                )}
                <div className='user-pic'>
                    {faceImage ? (
                        <img src={`data:image/png;base64, ${faceImage}`} alt="Face Image" className='face-img' />
                    ) : (
                        <div className="empty-placeholder">No profile picture available</div>)}
                </div>
            </div>
            <div className="guest-form">
                <div className="document-type">
                    <label>Document Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                        <option value="">Select Document Type</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="IDCARD">ID Card</option>
                        <option value="VISA">Visa</option>
                    </select>
                </div>

                <div className="document-number">
                    <label>Document Number</label>
                    <input type="text" value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} />
                </div>
                <div className="nationality">
                    <label>Nationality</label>
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
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
                        <option value="">Select Gender</option>

                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                    </select>
                </div>
                <div className="family-name">
                    <label>Family Name</label>
                    <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
                </div>
                <div className="email">
                    <label>Email</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="phone-number">
                    <label>Phone Number</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
