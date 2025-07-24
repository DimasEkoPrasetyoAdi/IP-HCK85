import { Link } from "react-router"
import { useState, useEffect } from "react"
import http from "../lib/http"

export default function SideBar() {
    

    return (
        <div className="bg-light border-end vh-100 p-3" style={{width: "280px"}}>
            <h5 className="mb-3">My Dashboard</h5>
            
            <div className="d-grid mb-4">
                <Link to="/create-session" className="btn btn-primary">
                    Create New Session
                </Link>
            </div>
            <div className="d-grid mb-4">
                <Link to="/update-session" className="btn btn-primary">
                    Update Session
                </Link>
            </div>
            <div className="mt-auto">
                <button 
                    onClick={() => {
                        localStorage.removeItem('access_token')
                        window.location.href = '/'
                    }}
                    className="btn btn-outline-danger w-100"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}