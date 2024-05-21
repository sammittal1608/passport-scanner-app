import React from 'react';
import './GuestDetails.css';
import PassportFront from '../../Images/passport-front.png'
import PassportBack from '../../Images/passport-back.png'
import UserPic from '../../Images/UserPic.png'

function GuestDetails({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="guest-details-container">
            <div className="guest-images">
                <img src={PassportFront} alt="Passport" className='passport-pic' />
                <img src={PassportBack} alt="ID Card" className='passport-pic' />
                <div className='user-pic'>
                    <img src={UserPic} alt="Profile" />

                </div>
            </div>
            <div className="guest-form">
                <div className="document-type">
                    <label>Document Type</label>
                    <select>
                        <option>Passport</option>
                        <option>Id Card</option>
                        <option>Visa</option>

                    </select>
                </div>
                <div className="nationality">
                    <label>Nationality</label>
                    <select>
                        <option>Indian</option>
                        <option>UAE</option>
                        <option>USA</option>
                    </select>

                </div>
                <div className="document-number">
                    <label>Document Number</label>
                    <input type="text" />
                </div>
                <div className="date-of-birth">
                    <label>Date of Birth</label>
                    <input type="date" />
                </div>
                <div className="given-name">
                    <label>Given Name</label>
                    <input type="text" />
                </div>
                <div className="gender">
                    <label>Gender</label>
                    <input type="text" />
                </div>
                <div className="family-name">
                    <label>Family Name</label>
                    <input type="text" />
                </div>
                <div className="issue-date">
                    <label>Issue Date</label>
                    <input type="date" />
                </div>
                <div className="expiry-date">
                    <label>Expiry Date</label>
                    <input type="date" />
                </div>
                <div className="place-of-issue">
                    <label>Place of Issue</label>
                    <input type="text" />
                </div>
            </div>
            
            <div className="form-buttons">
                <button>
                    <i class="bi bi-floppy"></i>Save
                </button>
                <button>
                    <i class="bi bi-file-plus"></i>Add Page
                </button>
                <button>
                    <i class="bi bi-upc-scan"></i>Scan
                </button>
                <button>
                    <i class="bi bi-x-square"></i>Cancel
                </button>
            </div>
        </div>
    );
}

export default GuestDetails;
