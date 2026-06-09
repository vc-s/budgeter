import './App.css'
import { useState, useEffect } from 'react'
import Toast from './components/Toast/Toast.jsx'
import BucketCard from './components/BucketCard/BucketCard.jsx'
import BucketEdit from './components/BucketEdit/BucketEdit.jsx'

// url = 'http://127.0.0.1:8000'
// getBucketsUrl = url + '/list-buckets'

function App() {
	const [ buckets, setBuckets ] = useState([])

	const [ name, setName ] = useState('')
	const [ balance, setBalance ] = useState('')
	const [ cap, setCap ] = useState('')
	const [ amount, setAmount ] = useState('')

	const [ isEditOpen, setIsEditOpen ] = useState(false)
	const [ editingBucket, setEditingBucket ] = useState(0)

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
		if (!cap) newErrors.cap = 'Cap is required'

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
				cap: cap
			})
		})
		const data = await resp.json()
		
		if (resp.ok){
			addToast(data)
		} else {
			data.detail.forEach(message => addToast(message))
		}

		setName('')
		setCap('')

		getBuckets()
	}

	const removeBucket = async(id) => {

		const resp = await fetch(`http://127.0.0.1:8000/remove-bucket/${Number(id)}`, {
			method: 'DELETE'
		})

		const data = await resp.json()

		addToast(data)

		getBuckets()
	}

	const handleClickEdit = (data) => {
		setIsEditOpen(true)
		setEditingBucket(data)
	}

	const updateBalance = async(id, isFill = false) => {

		const resp = await fetch(`http://127.0.0.1:8000/update-balance`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: id,
				amount: isFill ? 0 : amount,
				isFill: isFill
			})
		})

		const data = await resp.json()

		addToast(data)

		setAmount('')

		getBuckets()
	}

	useEffect(() => {
		getBuckets()
	}, [])

	return (
		<div>
			<header>
				<h1>The Budgeter</h1>
				<p style={{fontWeight: 'bold'}}>Account: 10,000</p>
			</header>

			<h2>Add Bucket</h2>
			<div>
				<form onSubmit={addBucket}>
					<div className="form-input-field">
						Name:
						<input
							type="text"
							value={name}
							placeholder='Enter bucket name'
							onChange={(e) => setName(e.target.value)}
							style={{
								borderColor: errors.name ? 'red' : 'var(--font-color)'
							}}
						/>
					</div>
					<br /> <br />
					
					<div className="form-input-field">
						Cap:
						<input
							type="number"
							value={cap}
							placeholder='Enter cap amount'
							onChange={(e) => setCap(e.target.value)}
						/>
					</div>
					<br /> <br />
					
					<button className="submit-btn" type="submit">
						Add Bucket
					</button>
				</form>
			</div>
			
			{isEditOpen && (
				<BucketEdit
					data={editingBucket}
					addToast={addToast}
					onSave={() => {
						setIsEditOpen(false)
						getBuckets()
					}}
				/>
			)}

			<div className="bucket-list">
				{Object.entries(buckets).map(([index, data]) => (
					<BucketCard
						key={index}
						data={data}
						fillBucket={updateBalance}
						removeBucket={removeBucket}
						onEdit={handleClickEdit}
					/>
				))}
			</div>

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
//TODO: add floating plus menu in bottom right for:
	// - add bucket
	// - add transaction
	// - fill all buckets
	// - transfer between buckets

// maybe side panel opens for all
// 2 and 3 are both just transactions -
	// fill all buckets = transaction with amount = cap - balance for each bucket
// 4 is a different one again

// for 2, not only buckets, direct account also has to be an option

export default App