import { useEffect, useState } from "react";
import './BucketEdit.css'

function BucketEdit ({ data, addToast, onSave }) {
    const [ name, setName ] = useState('')
    const [ balance, setBalance ] = useState('')
    const [ cap, setCap ] = useState('')

    // TODO: check if i can just move updateDetails here and not pass as a prop, since its only used here. also check if i can just pass the whole data object back to updateDetails instead of extracting id and other details separately

    const updateDetails = async(id, name, balance, cap) => {

		const resp = await fetch(`http://127.0.0.1:8000/update-details`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			// TODO: get the right like variables here, how to extract from data object ?
			body: JSON.stringify({
				id: id,
				newname: name ? name : data.name,
				balance: balance !== '' ? balance : data.balance,
				cap: cap !== '' ? cap : data.cap
			})
		})

		const msg = await resp.json()

        onSave()

        if (Array.isArray(msg.detail)) { addToast(msg.detail[0]) }
        else { addToast(msg) }
    }

    return (
        <div className="modal-overlay">
            <div className='edit-popup'>
                <form onSubmit={(e) => {e.preventDefault(); updateDetails(data.id, name, balance, cap)}}>
                    <div className="form-input-field">
                        Name:
                        <input
                            type="text"
                            value={name}
                            placeholder={data.name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <br /> <br />
                    
                    <div className="form-input-field">
                        Cap:
                        <input
                            type="number"
                            value={cap}
                            placeholder={data.cap}
                            onChange={(e) => setCap(e.target.value)}
                        />
                    </div>
                    <br /> <br />

                    <div className="form-input-field">
                        Balance:
                        <input
                            type="number"
                            value={balance}
                            placeholder={data.balance}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                    </div>
                    <br /> <br />
                    
                    <button className="submit-btn" type="submit">Save</button>
                </form>
            </div>
        </div>
    )
}

export default BucketEdit;