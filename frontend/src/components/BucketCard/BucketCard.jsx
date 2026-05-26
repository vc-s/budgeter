import "./BucketCard.css"
import { useEffect, useState, useRef } from "react";

function BucketCard({ data, removeBucket, updateDetails }) {

    const [ isOpen, setIsOpen ] = useState(false)

    const [ id, setID ] = useState('')
	const [ name, setName ] = useState('')
	const [ balance, setBalance ] = useState('')
	const [ cap, setCap ] = useState('')

    const percentage = (data.balance / data.cap) * 100

    const handleClick = () => setIsOpen(!isOpen)

    return (
        <div className="bucket-card">
            <div className="header">
                <h2>{data.name}</h2>
                <button className="menu" onClick={handleClick}>...</button>
                {isOpen && (
                    <div className="dropdown">
                        <button>Fill</button>
                        <button onClick={() => updateDetails(data)}>Edit</button>
                        <button onClick={() => removeBucket(data.id)}>Delete</button>
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