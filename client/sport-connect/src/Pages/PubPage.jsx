import { useState, useEffect } from 'react'
import Navbar from '../Component/Navbar'
import SessionCard from '../Component/SessionCard'
import http from '../lib/http'
import Swal from 'sweetalert2'

export default function PubPage() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        try {
            const { data } = await http.get('/pub')
            setSessions(data)
            setLoading(false)
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response ? error.response.data.message : 'Something went wrong!',
                icon: 'error'
            })
            setLoading(false)
        }
    }

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />

            <div className="container py-5">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h1 className="text-center mb-4">Welcome to Sport Connect</h1>
                        <p className="text-center text-muted">
                            Find and join sports sessions in your area
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {sessions.map((session) => (
                            <SessionCard key={session.id} session={session} />
                        ))}
                    </div>
                )}
            </div>

            <footer className="mt-auto py-4 bg-light">
                <div className="container text-center">
                    <p className="text-muted mb-0">
                        &copy; 2025 Sport Connect. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
