import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import Swal from 'sweetalert2'
import http from "../lib/http"

export default function LoginPage() {

  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

 
  const navigate = useNavigate()

  if (localStorage.getItem('access_token')) {
    return <Navigate to="/" />
  }


  return (
    <div className="container mt-5">

      <div className="row">
        <div className="col"></div>
        <div className="col">
          <h1 className="mb-4">Login</h1>
          <form

            onSubmit={async (event) => {
              event.preventDefault() 

              try {
                const response = await http.post('/login', {
                  email, password
                })

                localStorage.setItem('access_token', response.data.access_token)
                Swal.fire({
                  title: 'Success!',
                  text: 'Login successful',
                  icon: 'success',
                  confirmButtonText: 'Close'
                })
                navigate('/user')
              }
              catch (error) {
                
                let errorMessage = 'Something went wrong!'
                if (error.response) {
                  errorMessage = error.response.data.message
                }

                Swal.fire({
                  title: 'Error!',
                  text: errorMessage,
                  icon: 'error',
                  confirmButtonText: 'Close'
                })

              }
            }}

          >
            <div>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type="password" className="form-control" id="exampleInputPassword1" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
        <div className="col"></div>
      </div>

    </div>
  )
}