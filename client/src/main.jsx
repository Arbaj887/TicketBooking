import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import BookTicket from './components/BookTicket.jsx';
import VerifyTicket from './components/verifyTicket.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route  element={<App />} >
     <Route  path='/' element={<Login/>}/>
     <Route path='/register' element={<Register/>}/>
     <Route path='/bookticket' element={<BookTicket/>}/>
     <Route path='/verfiyticket' element={<VerifyTicket/>}/>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
