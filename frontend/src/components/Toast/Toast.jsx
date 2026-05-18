import { useState, useEffect } from 'react'
import './Toast.css'

// TODO: add toasts for add/remove bucket success/failure
function Toast({ message }) {


    return (
        <div class="toast">
            <div>✅</div>
            <div>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Toast;