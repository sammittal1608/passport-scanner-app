import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../../Images/logo.png';
import ID_GO from '../../Images/ID-GO.png';
import './Home.css';
import GuestDetails from '../GuestDetails/GuestDetails';
import settings from '../../app.settings';
import 'bootstrap-icons/font/bootstrap-icons.css';

const fetchReservationData = async (reservationId) => {
    try {

        const response = await fetch(settings.DotsURL+'/api/ows/FetchReservation', {
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

const fetchReservationDataByRefNumber = async (refNumber) => {
    try {
        const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';

        const response = await fetch(corsProxyUrl + settings.DotsURL+'/api/local/FetchReservationDetailsByRefNumber', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "RequestObject": {
                    "ReferenceNumber": refNumber,
                    "ArrivalDate": null
                },
                "SyncFromCloud": null
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched reservation data by reference number:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch reservation data by reference number:", error);
        return null;
    }
};

const handlePushReservation = async (reservationData, roomNumber, adults) => {
    const reservationNumberState = reservationData?.ReservationNumber ?? '';
    const pmsProfileId = reservationData?.GuestProfiles?.[0]?.PmsProfileID ?? '';
    const familyName = reservationData?.GuestProfiles?.[0]?.FamilyName ?? '';
    const givenName = reservationData?.GuestProfiles?.[0]?.GivenName ?? '';
    const nationality = reservationData?.GuestProfiles?.[0]?.Nationality ?? '';
    const gender = reservationData?.GuestProfiles?.[0]?.Gender ?? '';
    const documentNumber = reservationData?.GuestProfiles?.[0]?.PassportNumber ?? '';
    const documentType = reservationData?.GuestProfiles?.[0]?.DocumentType ?? '';
    const guestDetails = reservationData?.GuestProfiles?.[0] ?? {};

    const requestBody1 = {
        "RequestObject": [
            {
                ...reservationData,
                "ReservationNumber": reservationNumberState,
                "Adults": adults,
                "RoomDetails": {
                    ...reservationData.RoomDetails,
                    "RoomNumber": roomNumber || '0',
                },
                "GuestProfiles": [
                    {
                        "PmsProfileID": pmsProfileId,
                        "FamilyName": familyName,
                        "GivenName": givenName,
                        "GuestName": `${givenName} ${familyName}`,
                        "Nationality": nationality,
                        "Gender": gender,
                        "PassportNumber": documentNumber,
                        "DocumentType": documentType,
                        ...guestDetails
                    }
                ]
            }
        ],
        "SyncFromCloud": true
    };

    try {
        const corsProxyUrl = 'https://thingproxy.freeboard.io/fetch/';
        const apiUrl1 = settings.DotsURL+'/api/local/PushReservationDetails';

        const response = await axios.post(corsProxyUrl + apiUrl1, requestBody1, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.data;
        console.log("Push reservation successful:", data);
    } catch (error) {
        console.error("Failed to push reservation:", error);
    }
};

// const handleCheckIn = async (reservationNameID) => {
//     try {
//         const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/GuestCheckIn', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 hotelDomain: settings.hotelDomain,
//                 kioskID: settings.kioskId,
//                 username: settings.username,
//                 password: settings.password,
//                 systemType: settings.systemType,
//                 language: settings.language,
//                 legNumber: settings.legNumber,
//                 chainCode: settings.chainCode,
//                 destinationEntityID: settings.destinationEntityID,
//                 destinationSystemType: settings.destinationSystemType,
//                 SendFolio: settings.SendFolio,
//                 OperaReservation: {
//                     ReservationNameID: reservationNameID
//                 }
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Check-in successful:", data);
//     } catch (error) {
//         console.error("Failed to check in:", error);
//     }
// };

// const handleCheckOut = async (reservationNameID) => {
//     try {
//         const response = await fetch('http://qcapi.saavy-pay.com:8082/api/ows/GuestCheckOut', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 hotelDomain: "EU",
//                 kioskID: "KIOSK",
//                 username: "SUPERVISOR",
//                 password: "PEGASUS2021",
//                 systemType: "KIOSK",
//                 language: "EN",
//                 legNumber: null,
//                 chainCode: "CHA",
//                 destinationEntityID: "TI",
//                 destinationSystemType: "PMS",
//                 SendFolio: false,
//                 OperaReservation: {
//                     ReservationNameID: reservationNameID
//                 }
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Check-out successful:", data);
//     } catch (error) {
//         console.error("Failed to check out:", error);
//     }
// };

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
};

function Home() {
    const { reservationId } = useParams();
    const [reservationData, setReservationData] = useState(null);
    const [guests, setGuests] = useState(['Primary Guest']);
    const [visibleGuestIndex, setVisibleGuestIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isEditingRoomNumber, setIsEditingRoomNumber] = useState(false);
    const [isEditingAdults, setIsEditingAdults] = useState(false);
    const [editableRoomNumber, setEditableRoomNumber] = useState('0');
    const [editableAdults, setEditableAdults] = useState('');

    const roomNumberRef = useRef(null);
    const adultsRef = useRef(null);

    const refreshReservationData = async (refNumber) => {
        const data = await fetchReservationDataByRefNumber(refNumber);
        if (data && data.responseData && data.responseData.length > 0) {
            const reservation = data.responseData[0];
            // setReservationData(reservation);
            setEditableRoomNumber(reservation.RoomNumber ?? '0');
            setEditableAdults(reservation.Adultcount ?? '0');
        } else {
            console.error("Invalid data structure:", data);
        }
    };


    useEffect(() => {
        if (reservationId) {
            fetchReservationData(reservationId).then(data => {
                if (data && data.responseData && data.responseData.length > 0) {
                    const reservation = data.responseData[0];
                    setReservationData(reservation);
                    const guestProfiles = reservation.GuestProfiles || [];
                    setGuests(guestProfiles.map(profile => profile.GuestName || 'Guest'));
                    setEditableRoomNumber(reservation.RoomDetails?.RoomNumber ?? '0');
                    setEditableAdults(reservation.Adults);
                } else {
                    console.error("Invalid data structure on initial fetch:", data);
                }
            });
        }
    }, [reservationId]);

    const addGuest = () => {
        setGuests([...guests, `Accompany ${guests.length}`]);
        setIsButtonClicked(true);
    };

    const toggleGuestDetails = (index) => {
        setVisibleGuestIndex(visibleGuestIndex === index ? null : index);
        setIsExpanded(visibleGuestIndex === index ? false : true);
    };

    const handleRoomNumberChange = (event) => {
        setEditableRoomNumber(event.target.value);
    };

    const handleAdultsChange = (event) => {
        setEditableAdults(event.target.value);
    };

    const handleRoomNumberClick = () => {
        setIsEditingRoomNumber(true);
    };

    const handleAdultsClick = () => {
        setIsEditingAdults(true);
    };

    const handleOutsideClick = (event) => {
        if (roomNumberRef.current && !roomNumberRef.current.contains(event.target)) {
            setIsEditingRoomNumber(false);
        }
        if (adultsRef.current && !adultsRef.current.contains(event.target)) {
            setIsEditingAdults(false);
        }
    };

    const handleKeyPress = async (event, type) => {
        if (event.key === 'Enter') {
            await handlePushReservation(reservationData, editableRoomNumber, editableAdults);
            if (type === 'roomNumber') {
                setIsEditingRoomNumber(false);
            } else if (type === 'adults') {
                setIsEditingAdults(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    if (!reservationData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="Company Logo" />
                </div>
                <div className="id-go-logo">
                    <div className='id-go-border'></div>
                    <img src={ID_GO} alt='ID-GO-Logo' />
                </div>
            </header>
            <div className='bottom'>
                <div className="reservation-info" style={{ height: `${isExpanded ? (30 + guests.length * 5) * 2.5 : 27 + guests.length * 5}rem` }}>
                    <div className='reservation-data'>
                        <div className="info">
                            <div>RESERVATION NUMBER</div>
                            <div>{reservationData.ReservationNumber}</div>
                        </div>
                        <div className="info">
                            <div>RESERVATION STATUS</div>
                            <div>{reservationData.ReservationStatus}</div>
                        </div>
                        <div className="info">
                            <div>ROOM NUMBER</div>
                            {isEditingRoomNumber ? (
                                <input
                                    type="text"
                                    value={editableRoomNumber}
                                    onChange={handleRoomNumberChange}
                                    className="form-control"
                                    ref={roomNumberRef}
                                    onKeyPress={(e) => handleKeyPress(e, 'roomNumber')}
                                    onBlur={() => setIsEditingRoomNumber(false)}
                                />
                            ) : (
                                <div onClick={handleRoomNumberClick}>{editableRoomNumber === '0' ? '0' : editableRoomNumber}</div>
                            )}
                        </div>


                        <div className="info">
                            <div>GUEST NAME</div>
                            <div>{reservationData.GuestProfiles[0]?.GuestName}</div>
                        </div>
                        <div className="info">
                            <div>ARRIVAL DATE</div>
                            <div>{formatDate(reservationData.ArrivalDate)}</div>
                        </div>
                        <div className="info">
                            <div>ARRIVAL TIME</div>
                            <div>{formatTime(reservationData.ArrivalDate)}</div>
                        </div>
                        <div className="info">
                            <div>DEPARTURE DATE</div>
                            <div>{formatDate(reservationData.DepartureDate)}</div>
                        </div>
                        <div className="info">
                            <div>ADULT COUNT</div>
                            {isEditingAdults ? (
                                <input
                                    type="number"
                                    value={editableAdults}
                                    onChange={handleAdultsChange}
                                    className="form-control"
                                    ref={adultsRef}
                                    onKeyPress={(e) => handleKeyPress(e, 'adults')}
                                    onBlur={() => setIsEditingAdults(false)}
                                />
                            ) : (
                                <div onClick={handleAdultsClick}>{editableAdults}</div>
                            )}
                        </div>
                        <div className="info">
                            <div>CHILD COUNT</div>
                            <div>{reservationData.Child !== undefined ? reservationData.Child : ''}</div>
                        </div>
                    </div>
                    <div className="guest-details">
                        {guests.map((guest, index) => (
                            <div className="guest" key={index}>
                                <button className="accordion" onClick={() => toggleGuestDetails(index)}>
                                    {guest}
                                    <i className={`bi ${visibleGuestIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'} accordion-icon`}></i>
                                </button>
                                {visibleGuestIndex === index && (
                                    <GuestDetails
                                    IsAddGuestvisible={guests.length-1===index?true:false}
                                        isVisible={true}
                                        guestData={reservationData.GuestProfiles[index]}
                                        reservationNumber={reservationData.ReservationNumber}
                                        addGuest={addGuest}
                                        isButtonClicked={isButtonClicked}
                                        onSave={() => refreshReservationData(reservationData?.ReservationNumber)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
