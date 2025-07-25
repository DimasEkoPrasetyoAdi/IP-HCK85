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

            {/* Simple Hero Section */}
            <div className="bg-cyan text-white py-5 mt-0">
                <div className="container text-center">
                    <h1 className="fw-bold mb-3">Sport Connect</h1>
                    <p className="lead mb-0">Find and join sports sessions in your area</p>
                </div>
            </div>

            {/* Sessions Section */}
            <div className="container py-5">
                <div className="row">
                    <div className="col-12 mb-4">
                        <h2 className="fw-bold mb-1">Available Sessions</h2>
                        <p className="text-muted">
                            {sessions.length} sessions available
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-clean mx-auto mb-3"></div>
                        <p className="text-muted">Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="text-muted">
                            <h4>No Sessions Available</h4>
                            <p>Be the first to create a session!</p>
                        </div>
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                requireLoginRedirect={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Simple Footer */}
            <footer className="bg-light py-4 mt-auto border-top">
                <div className="container text-center">
                    <p className="text-muted mb-0">
                        &copy; 2025 Sport Connect. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
