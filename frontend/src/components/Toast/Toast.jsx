import { useState, useEffect } from 'react'
import './Toast.css'

// TODO: differentiate between info and error toasts
function Toast({ message, id, onDismiss }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id)
        }, 3000)
    }, [id, onDismiss])

    return (
        <div className='toast'>
            <span className='toast-message'>{message}</span>
            <button className='toast-close' onClick={() => onDismiss(id)}>x</button>
        </div>
    )

}

export default Toast;