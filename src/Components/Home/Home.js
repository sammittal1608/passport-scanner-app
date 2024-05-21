import React, { useState } from 'react';
import logo from '../../Images/logo.png';
import ID_GO from '../../Images/ID-GO.png';
import './Home.css';
import GuestDetails from '../GuestDetails/GuestDetails';

function Home() {
    const [guests, setGuests] = useState(['Primary Guest']);
    const [visibleGuestIndex, setVisibleGuestIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);


    const addGuest = () => {
        setGuests([...guests, `Accompany ${guests.length}`]);
    };

    const toggleGuestDetails = (index) => {
        setVisibleGuestIndex(visibleGuestIndex === index ? null : index);
        setIsExpanded(visibleGuestIndex === index ? false : true);
    };

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
                            <div>1234</div>
                        </div>
                        <div className="info">
                            <div>ROOM NUMBER</div>
                            <div>21</div>
                        </div>
                        <div className="info">
                            <div>GUEST NAME</div>
                            <div>John Doe</div>
                        </div>
                        <div className="info">
                            <div>ARRIVAL DATE</div>
                            <div>12/12/2023</div>
                        </div>
                        <div className="info">
                            <div>DEPARTURE DATE</div>
                            <div>13/12/2023</div>
                        </div>
                        <div className="info">
                            <div>ADULT COUNT</div>
                            <div>1</div>
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
                                {visibleGuestIndex === index && <GuestDetails isVisible={true} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
