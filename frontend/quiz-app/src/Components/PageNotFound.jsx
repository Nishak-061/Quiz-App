import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import "../Styles/PageNotFound.css";

const PageNotFound = () => {
    useEffect(() => {
        Swal.fire({
            title: 'Page Not Found',
            text: 'The page you are looking for does not exist.',
            icon: 'error',
            confirmButtonText: 'Go Home'
        })
    }, [])
  return (
    <div className='page-not-found-container'>
        <h1 className='page-not-found-heading'>404 Page Not Found</h1>
        <p className='page-not-found-text'>The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/"><p className='page-not-found-link'>Go back to home page</p></Link>
    </div>
  )
}

export default PageNotFound