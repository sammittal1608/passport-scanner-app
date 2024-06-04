import React, { useState, useEffect } from 'react';
import './GuestDetails.css';
import axios from 'axios';
import settings from '../../app.settings.js';
// import PassportFront from '../../Images/passport-front.png';
// import PassportBack from '../../Images/passport-back.png';
// import UserPic from '../../Images/UserPic.png';


function GuestDetails({ isVisible, guestData, reservationNumber }) {
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
    const [reservationNumberState, setReservationNumber] = useState(''); // Define state for reservation number

    useEffect(() => {
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
    }, [guestData, reservationNumber]);

    if (!isVisible) return null;

    const handleSave = async () => {
        const requestBody1 = {
            "RequestObject": [
                {
                    "ConfirmationNumber": guestData?.ConfirmationNumber ?? '',
                    "ReservationNumber": reservationNumber,
                    "ReservationNameID": guestData?.ReservationNameID,
                    "ArrivalDate": guestData?.arrivalDate,
                    "DepartureDate": guestData?.departureDate,
                    "CreatedDateTime": guestData?.CreatedDateTime,
                    "Adults": guestData?.adultCount,
                    "Child": guestData?.Child,
                    "ReservationStatus": guestData?.ReservationStatus,
                    "ComputedReservationStatus": guestData?.ComputedReservationStatus,
                    "LegNumber": guestData?.LegNumber,
                    "ChainCode": guestData?.ChainCode,
                    "ExpectedDepartureTime": guestData?.ExpectedDepartureTime,
                    "ExpectedArrivalTime": guestData?.ExpectedArrivalTime,
                    "ReservationSourceCode": guestData?.ReservationSourceCode,
                    "ReservationType": guestData?.ReservationType,
                    "PrintRate": guestData?.PrintRate,
                    "NoPost": guestData?.NoPost,
                    "DoNotMoveRoom": guestData?.DoNotMoveRoom,
                    "TotalAmount": guestData?.TotalAmount,
                    "TotalTax": guestData?.TotalTax,
                    "IsTaxInclusive": guestData?.IsTaxInclusive,
                    "CurrentBalance": guestData?.CurrentBalance,
                    "RoomDetails": {
                        "RoomNumber": guestData?.RoomDetails.RoomNumber,
                        "RoomType": guestData?.RoomDetails.RoomType,
                        "RoomTypeDescription": guestData?.RoomDetails.RoomTypeDescription,
                        "RoomTypeShortDescription": guestData?.RoomDetails.RoomTypeShortDescription,
                        "RoomStatus": guestData?.RoomDetails.RoomStatus,
                        "RTC": guestData?.RoomDetails.RTC,
                        "RTCDescription": guestData?.RoomDetails.RTCDescription,
                        "RTCShortDescription": guestData?.RoomDetails.RTCShortDescription
                    },
                    "RateDetails": {
                        "RateCode": guestData?.RateDetails.RateCode,
                        "RateAmount": guestData?.RateDetails.RateAmount,
                        "DailyRates": guestData?.RateDetails.DailyRates,
                        "IsMultipleRate": guestData?.RateDetails.IsMultipleRate
                    },
                    "PartyCode": guestData?.PartyCode,
                    "PaymentMethod": guestData?.PaymentMethod,
                    "IsPrimary": guestData?.IsPrimary,
                    "ETA": guestData?.ETA,
                    "FlightNo": guestData?.FlightNo,
                    "IsCardDetailPresent": guestData?.IsCardDetailPresent,
                    "IsDepositAvailable": guestData?.IsDepositAvailable,
                    "IsPreCheckedInPMS": guestData?.IsPreCheckedInPMS,
                    "IsSaavyPaid": guestData?.IsSaavyPaid,
                    "SharerReservations": guestData?.SharerReservations,
                    "DepositDetail": guestData?.DepositDetail,
                    "PreferanceDetails": guestData?.PreferanceDetails,
                    "PackageDetails": guestData?.PackageDetails,
                    "userDefinedFields": guestData?.userDefinedFields,
                    "GuestProfiles": [
                        {
                            "PmsProfileID": pmsProfileId,
                            "FamilyName": familyName,
                            "GivenName": givenName,
                            "GuestName": `${givenName} ${familyName}`,
                            "Nationality": nationality,
                            "Gender": gender,
                            "PassportNumber": documentNumber,
                            "DocumentType": guestData?.documentType,
                            "IsPrimary": guestData?.IsPrimary,
                            "MembershipType": guestData?.MembershipType,
                            "MembershipNumber": guestData?.MembershipNumber,
                            "MembershipID": guestData?.MembershipID,
                            "MembershipName": guestData?.MembershipName,
                            "MembershipClass": guestData?.MembershipClass,
                            "MembershipLevel": guestData?.MembershipLevel,
                            "FirstName": givenName,
                            "MiddleName": middleName,
                            "LastName": familyName,
                            "Phones": guestData?.Phones,
                            "Address": guestData?.Address,
                            "Email": guestData?.Email,
                            "BirthDate": dateOfBirth,
                            "IssueDate": issueDate,
                            "IssueCountry": placeOfIssue,
                            "IsActive": guestData?.IsActive,
                            "Title": guestData?.Title,
                            "VipCode": guestData?.VipCode,
                            "CloudProfileDetailID": guestData?.CloudProfileDetailID
                        }
                    ],
                    "Alerts": guestData?.Alerts,
                    "IsMemberShipEnrolled": guestData?.IsMemberShipEnrolled,
                    "reservationDocument": guestData?.reservationDocument,
                    "GuestSignature": guestData?.GuestSignature,
                    "FolioEmail": guestData?.FolioEmail,
                    "IsBreakFastAvailable": guestData?.IsBreakFastAvailable
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
            "destinationEntityID": settings.destinationId,
            "destinationSystemType": settings.destinationSystemType,
            "CreateAccompanyingProfileRequest": {
                "ReservationNumber": reservationNumber,
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

            let response;

           
            response = await axios.post(corsProxyUrl + apiUrl1, requestBody1, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('First save successful:', response.data);


            if (!pmsProfileId) {
                
                response = await axios.post(corsProxyUrl + apiUrl2, requestBody2, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('create new accompany api save successful:', response.data);

            }

            if (response.data && response.data.result) {
                const responseData = response.data.responseData;
                console.log('Response Data:', responseData);
            } else {
                console.error('Save failed:', response.data);
            }
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


    // const handleUpdatePassport = async () => {
    //     const requestBody = {
    //         hotelDomain: "EU",
    //         kioskID: "KIOSK",
    //         username: "SUPERVISOR",
    //         password: "PEGASUS2021",
    //         systemType: "KIOSK",
    //         language: "EN",
    //         legNumber: 1,
    //         chainCode: "CHA",
    //         destinationEntityID: "TI",
    //         destinationSystemType: "PMS",
    //         UpdateProileRequest: {
    //             addresses: [
    //                 {
    //                     addressType: "HOME",
    //                     operaId: 0,
    //                     primary: true,
    //                     displaySequence: 1,
    //                     address1: "addres1",
    //                     address2: "address2",
    //                     city: "test city",
    //                     state: null,
    //                     country: null,
    //                     zip: "123456"
    //                 }
    //             ],
    //             profileID: pmsProfileId,
    //             emails: [
    //                 {
    //                     emailType: "EMAIL",
    //                     operaId: 0,
    //                     primary: true,
    //                     displaySequence: 1,
    //                     email: "test@mail.com"
    //                 }
    //             ],
    //             phones: [
    //                 {
    //                     phoneType: "MOBILE",
    //                     phoneRole: "PHONE",
    //                     operaId: 0,
    //                     primary: true,
    //                     displaySequence: 1,
    //                     phoneNumber: "123456"
    //                 }
    //             ],
    //             dob: dateOfBirth,
    //             gender: gender,
    //             nationality: nationality,
    //             issueCountry: placeOfIssue,
    //             documentNumber: documentNumber,
    //             documentType: documentType,
    //             issueDate: issueDate
    //         }
    //     };

    //     try {
    //         const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
    //         const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdatePassport';

    //         const response = await axios.post(corsProxyUrl + apiUrl, requestBody, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         console.log('Update passport details successful:', response.data);
    //     } catch (error) {
    //         if (error.response) {
    //             console.error('Server responded with non-2xx status:', error.response.data);
    //         } else if (error.request) {
    //             console.error('No response received:', error.request);
    //         } else {
    //             console.error('Error setting up the request:', error.message);
    //         }
    //         console.error('Failed to update passport details:', error);
    //     }
    // };

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
            destinationEntityID: settings.destinationId,
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

            const response = await axios.post( apiUrl, requestBody, {
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
        const requestBody = {
            hotelDomain: settings.hotelDomain,
            kioskID: settings.kioskId,
            username: settings.username,
            password: settings.password,
            systemType: settings.systemType,
            language: settings.language,
            legNumber: settings.legNumber,
            chainCode: settings.chainCode,
            destinationEntityID: settings.destinationId,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                addresses: [
                    {
                        addressType: guestData?.addressType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        address1: guestData?.address1,
                        address2: guestData?.address2,
                        city: guestData?.city,
                        state: guestData?.state,
                        country: guestData?.country,
                        zip: guestData?.zip
                    }
                ],
                profileID: pmsProfileId,
                emails: [
                    {
                        emailType: guestData?.emailType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        email: guestData?.email
                    }
                ],
                phones: [
                    {
                        phoneType: guestData?.phoneType,
                        phoneRole: guestData?.phoneRole,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        phoneNumber: phoneNumber
                    }
                ],
                dob: guestData?.dob,
                gender: guestData?.gender,
                nationality: guestData?.nationality,
                issueCountry: guestData?.issueCountry,
                documentNumber: guestData?.documentNumber,
                documentType: guestData?.documentType,
                issueDate: guestData?.issueDate
            }
        };

        try {
            const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
            const apiUrl = 'http://qcapi.saavy-pay.com:8082/api/ows/UpdatePhoneList';

            const response = await axios.post( apiUrl, requestBody, {
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
            destinationEntityID: settings.destinationId,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                addresses: [
                    {
                        addressType: guestData?.addressType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        address1: guestData?.address1,
                        address2: guestData?.address2,
                        city: guestData?.city,
                        state: guestData?.state,
                        country: guestData?.country,
                        zip: guestData?.zip
                    }
                ],
                profileID: pmsProfileId,
                emails: [
                    {
                        emailType: guestData?.emailType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        email: email
                    }
                ],
                phones: [
                    {
                        phoneType: guestData?.phoneType,
                        phoneRole: guestData?.phoneRole,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        phoneNumber: phoneNumber
                    }
                ],
                dob: guestData?.dob,
                gender: guestData?.gender,
                nationality: guestData?.nationality,
                issueCountry: guestData?.issueCountry,
                documentNumber: guestData?.documentNumber,
                documentType: guestData?.documentType,
                issueDate: guestData?.issueDate
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
            destinationEntityID: settings.destinationId,
            destinationSystemType: settings.destinationSystemType,
            UpdateProileRequest: {
                addresses: [
                    {
                        addressType: guestData?.addressType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        address1: guestData?.address1,
                        address2: guestData?.address2,
                        city: guestData?.city,
                        state: guestData?.state,
                        country: guestData?.country,
                        zip: guestData?.zip
                    }
                ],
                profileID: pmsProfileId,
                emails: [
                    {
                        emailType: guestData?.emailType,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        email: guestData?.email
                    }
                ],
                phones: [
                    {
                        phoneType: guestData?.phoneType,
                        phoneRole: guestData?.phoneRole,
                        operaId: guestData?.operaId,
                        primary: guestData?.primary,
                        displaySequence: guestData?.displaySequence,
                        phoneNumber: phoneNumber
                    }
                ],
                dob: guestData?.dob,
                gender: guestData?.gender,
                nationality: guestData?.nationality,
                issueCountry: guestData?.issueCountry,
                documentNumber: guestData?.documentNumber,
                documentType: guestData?.documentType,
                issueDate: guestData?.issueDate
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


    // const handleUpdateReservationDetails = async () => {
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
                        <option value="Passport">Passport</option>
                        <option value="Id Card">Id Card</option>
                        <option value="Visa">Visa</option>
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
