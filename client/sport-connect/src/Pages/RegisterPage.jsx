import { useState } from "react"
import { Navigate, useNavigate, NavLink } from "react-router"
import Swal from 'sweetalert2'
import http from "../lib/http"





export default function Register() {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()


        try {
            const response = await http.post('/register', {
                email, password, name
            })

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response ? error.response.data.message : 'Something went wrong!',
                icon: 'error'
            })

            navigate('/login')

        }

    }

    return (
             <form onSubmit={handleSubmit}className="w-50 m-auto mt-5 border p-5 rounded" style={{maxWidth : "400px"}}>
      <h2>Sport Connect</h2>
      <div className="mb-3">
        <label className="form-label">User Name</label>
        <input type="text" className="form-control" style={{maxWidth:"300px"}}
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="form-label">Email</label>
        <input type="email" className="form-control" aria-describedby="emailHelp" style={{maxWidth:"300px"}}
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" className="form-control" style={{maxWidth: "300px"}}
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-warning">Register</button>
      <div>
        <p className="mt-3">
          do you have an account ?
          <NavLink to= "/login">Login</NavLink>
        </p>
      </div>
    </form >

        )


}