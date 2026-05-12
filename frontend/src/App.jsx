import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// url = 'http://127.0.0.1:8000'
// getBucketsUrl = url + '/list-buckets'

// ! 200 OK when adding bucket, but i think entire thing is refreshing which is causing loss of bucket info
// TODO: move bucket to json file

function App() {
	const [ buckets, setBuckets ] = useState('')

	const getBuckets = async() => {
		const resp = await fetch('http://127.0.0.1:8000/list-buckets')
		const data = await resp.json()
		setBuckets(data)
	}

	const addBucket = async(name, balance, cap) => {
		const resp = await fetch('http://127.0.0.1:8000/add-bucket', {
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
				<form>
					Name: <input type="text" id="name" placeholder='Enter bucket Name' /> <br /> <br />
					Balance: <input type="number" id="balance" placeholder='Enter balance' /> <br /> <br />
					Cap: <input type="number" id="cap" placeholder='Enter cap (if applicable)' /> <br /> <br />
					<input type="submit" value="Add Bucket" onClick={() => addBucket(name, balance, cap)} />
				</form>
				<form>

				</form>
			</div>

			<h2>Buckets</h2>
			<ol>
				{Object.entries(buckets).map(([name, data]) => (
					<li key={name}>{name}: Balance = {data.balance}, Cap = {data.cap || 'None'}</li>
				))}
			</ol>
		</div>
	)
}

export default App