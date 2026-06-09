import "./BucketCard.css"
import { useEffect, useState, useRef } from "react";

function BucketCard({ data, fillBucket, removeBucket, onEdit }) {

    const [ isOpen, setIsOpen ] = useState(false)

    const percentage = (data.balance / data.cap) * 100

    const handleClick = () => setIsOpen(!isOpen)

    return (
        <div className="bucket-card">
            <div className="header">
                <h2>{data.name}</h2>
                <button className="menu" onClick={handleClick}>...</button>
                {isOpen && (
                    <div className="dropdown">
                        <button onClick={() => {fillBucket(data.id, true); handleClick()}}>Fill</button>
                        <button onClick={() => {onEdit(data); handleClick()}}>Edit</button>
                        <button onClick={() => {removeBucket(data.id); handleClick()}}>Delete</button>
                    </div>
                )}
            </div>

            <p>{data.balance}/{data.cap}</p>

            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
            
            
        </div>
    )
}

// TODO: add editable bucket pop up. input fields in existing locations with current values as placeholders.
// save button and close button
    // EXTRA: add click outside close functionality !!

export default BucketCard;