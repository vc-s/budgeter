import './App.css'
import { useState, useEffect } from 'react'
import Toast from './components/Toast/Toast.jsx'

// url = 'http://127.0.0.1:8000'
// getBucketsUrl = url + '/list-buckets'

function App() {
	const [buckets, setBuckets] = useState([])

	const [ id, setID ] = useState('')
	const [ name, setName ] = useState('')
	const [ balance, setBalance ] = useState('')
	const [ cap, setCap ] = useState(null)
	const [ amount, setAmount ] = useState('')

	const [ toasts, setToasts ] = useState([])

	const [ errors, setErrors ] = useState({})

	const getBuckets = async () => {
		const resp = await fetch(`http://127.0.0.1:8000/list-buckets`)
		const data = await resp.json()
		setBuckets(data)
	}

	const addToast = (message) => {
		const newToast = {
			id: Date.now(),
			message: message
		}

		setToasts([...toasts, newToast])
		
	}

	const removeToast = (id) => {
		setToasts(newToasts => newToasts.filter(toast => toast.id != id))
	}

	const addBucket = async (e) => {
		e.preventDefault()

		setErrors({})

		const newErrors = {}
		if (!name.trim()) newErrors.name = 'Name is required'
		if (!balance) newErrors.balance = 'Balance is required'

		if (Object.keys(newErrors).length > 0) {
			addToast('Please fill in all required fields')
			setErrors(newErrors)
			return
		}

		const resp = await fetch(`http://127.0.0.1:8000/add-bucket`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				balance: balance,
				cap: cap === '' ? null : cap
			})
		})
		const data = await resp.json()
		
		if (resp.ok){
			addToast(data)
		} else {
			data.detail.forEach(message => addToast(message))
		}

		setName('')
		setBalance('')
		setCap('')

		getBuckets()
	}

	const removeBucket = async(id) => {

		const resp = await fetch(`http://127.0.0.1:8000/remove-bucket/${Number(id)}`, {
			method: 'DELETE'
		})

		const data = await resp.json()

		addToast(data)

		setID('')
		getBuckets()
	}

	const updateDetails = async(e) => {

		const resp = await fetch(``, {
			methos: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id,
				newname: name,
				balance: balance,
				cap: cap
			})
		})

		const data = await resp.json()

		addToast(data)

		setID('')
		setName('')
		setBalance('')
		setCap('')

		getBuckets()
	}

	const updateBalance = async(e) => {

		const resp = await fetch(``, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id,
				amount: amount
			})
		})

		const data = await resp.json()

		addToast(data)

		setID('')
		setAmount('')

		getBuckets()
	}

	useEffect(() => {
		getBuckets()
	}, [])

	return (
		<div>
			<h1>The Budgeter</h1>

			<h2>Add Bucket</h2>
			<div>
				<form onSubmit={addBucket}>
					<div className="form-input-field">
						Name:
						<input
							type="text"
							value={name}
							placeholder='Enter bucket Name'
							onChange={(e) => setName(e.target.value)}
							style={{
								borderColor: errors.name ? 'red' : 'var(--font-color)'
							}}
						/>
					</div>
					<br /> <br />
					
					<div className="form-input-field">
						Balance:
						<input
							type="number"
							value={balance}
							placeholder='Enter balance'
							onChange={(e) => setBalance(e.target.value)}
							style={{
								borderColor: errors.balance ? 'red' : 'var(--font-color)'
							}}
						/>
					</div>
					<br /> <br />
					
					<div className="form-input-field">
						Cap:
						<input
							type="number"
							value={cap}
							placeholder='Enter cap (if applicable)'
							onChange={(e) => setCap(e.target.value)}
						/>
					</div>
					<br /> <br />
					
					<button className="submit-btn" type="submit">
						Add Bucket
					</button>
				</form>
			</div>

			<h2>Buckets</h2>
			<ol className="bucket-list">
				{Object.entries(buckets).map(([index, data]) => (
					<li key={index}>
						{data.name}: Balance = {data.balance} | Cap = {data.cap || 'None'}
						<button className="delete-button" onClick={() => removeBucket(data.id)}>X</button>
						<br /> <br />
					</li>
				))}
			</ol>

			<div className="toast-container">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						id={toast.id}
						onDismiss={removeToast}
					/>
				))}
			</div>

		</div>
	)
}
// TODO: line 206 - edit details
// add the pencil button to edit the bucket details. it transforms each field into an input box
// add a + button to add money into a bucket. make an input field appear below the bucket asking how much, once entered hide it again

export default App