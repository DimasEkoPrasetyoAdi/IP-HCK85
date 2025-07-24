import { BrowserRouter, Routes, Route } from 'react-router'
import PubPage from './Pages/PubPage'
import UserPage from './Pages/UserPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'
import SessionCreate from './Pages/SessionCreate' 
import SessionUser from './Pages/SessionUser'
import SessionEdit  from './Pages/SessionEdit'  



function App() {
 return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PubPage />} />
        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/create-session" element={<SessionCreate type='add' />} />
        <Route path="/update-session/" element={<SessionUser  />} />
        <Route path="/sessions/:id/edit" element={<SessionEdit type='edit' />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
