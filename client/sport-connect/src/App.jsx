import { BrowserRouter, Routes, Route } from 'react-router'
import Homepage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'

function App() {
 return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Homepage />} />

        
       
        
        
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
