import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../../Images/logo.png';
import ID_GO from '../../Images/ID-GO.png';
import './Home.css';
import GuestDetails from '../GuestDetails/GuestDetails';
import settings from '../../app.settings';

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

function Home() {
    const { reservationId } = useParams();
    const [reservationData, setReservationData] = useState(null);
    const [guests, setGuests] = useState(['Primary Guest']);
    const [visibleGuestIndex, setVisibleGuestIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    useEffect(() => {
        if (reservationId) {
            fetchReservationData(reservationId).then(data => {
                if (data) {
                    setReservationData(data.responseData[0]);
                    const guestProfiles = data.responseData[0].GuestProfiles || [];
                    setGuests(guestProfiles.map(profile => profile.GuestName || 'Guest'));
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
                <div className="reservation-info" style={{ height: `${isExpanded ? (27 + guests.length * 5) * 2.5 : 27 + guests.length * 5}rem` }}>
                    <div className='reservation-data'>
                        <div className="info">
                            <div>RESERVATION NUMBER</div>
                            <div>{reservationData.ReservationNumber}</div>
                        </div>
                        <div className="info">
                            <div>ROOM NUMBER</div>
                            <div>{reservationData.RoomDetails.RoomNumber}</div>
                        </div>
                        <div className="info">
                            <div>GUEST NAME</div>
                            <div>{reservationData.GuestProfiles[0]?.GuestName}</div>
                        </div>
                        <div className="info">
                            <div>ARRIVAL DATE</div>
                            <div>{reservationData.ArrivalDate}</div>
                        </div>
                        <div className="info">
                            <div>DEPARTURE DATE</div>
                            <div>{reservationData.DepartureDate}</div>
                        </div>
                        <div className="info">
                            <div>ADULT COUNT</div>
                            <div>{reservationData.Adults}</div>
                        </div>
                    </div>
                    <div className="guest-details">
                        <div className='add-button-container'>
                            <h4>Guest Details</h4>
                            <button type="button"
                                className={`btn btn-outline-primary ${isButtonClicked ? 'clicked' : ''}`}
                                onClick={addGuest}>
                                Add Guest
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        {guests.map((guest, index) => (
                            <div className="guest" key={index}>
                                <button className="accordion" onClick={() => toggleGuestDetails(index)}>
                                    {guest}
                                </button>
                                {visibleGuestIndex === index && (
                                    <GuestDetails
                                        isVisible={true}
                                        guestData={reservationData.GuestProfiles[index]}
                                        reservationNumber={reservationData.ReservationNumber}
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
