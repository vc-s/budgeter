import { useState, useEffect } from 'react'
import './App.css'

// url = 'http://127.0.0.1:8000'
// getBucketsUrl = url + '/list-buckets'

function App() {
	const [buckets, setBuckets] = useState([])

	const [id, setID] = useState('')
	const [name, setName] = useState('')
	const [balance, setBalance] = useState('')
	const [cap, setCap] = useState('')

	const getBuckets = async () => {
		const resp = await fetch(`http://127.0.0.1:8000/list-buckets`)
		const data = await resp.json()
		setBuckets(data)
	}

	const addBucket = async (e) => {
		e.preventDefault()

		const resp = await fetch(`http://127.0.0.1:8000/add-bucket`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				balance: balance,
				cap: cap
			})
		})
		const data = await resp.json()

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

		setName('')
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
					<div class="form-input-field">
						Name:
						<input
							type="text"
							value={name}
							placeholder='Enter bucket Name'
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<br /> <br />
					
					<div class="form-input-field">
						Balance:
						<input
							type="number"
							value={balance}
							placeholder='Enter balance'
							onChange={(e) => setBalance(e.target.value)}
						/>
					</div>
					<br /> <br />
					
					<div class="form-input-field">
						Cap:
						<input
							type="number"
							value={cap}
							placeholder='Enter cap (if applicable)'
							onChange={(e) => setCap(e.target.value)}
						/>
					</div>
					<br /> <br />
					
					<input
						type="submit"
						value="Add Bucket"
						class="submit-btn"
					/>
				</form>
			</div>

			<h2>Buckets</h2>
			<ol class="bucket-list">
				{Object.entries(buckets).map(([index, data]) => (
					<li key={index}>
						{data.name}: ID = {data.id}, Balance = {data.balance}, Cap = {data.cap || 'None'}
						<button class="delete-button" onClick={() => removeBucket(data.id)}>X</button>
						<br /> <br />
					</li>
				))}
			</ol>
		</div>
	)
}

export default App