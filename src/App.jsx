import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import Signup from './pages/Signup'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/"
          element={
            <DashboardLayout>
              <Dashboard/>
            </DashboardLayout>
          }/>
          <Route
            path="/courses"
            element={
            <DashboardLayout>
            <Courses />
            </DashboardLayout>
            }
          />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
