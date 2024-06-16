import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes'
import { UserProvider } from './context/userContext'


ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
    <RouterProvider router={router} />
    </UserProvider>
)
