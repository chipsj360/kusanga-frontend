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
import Modules from './pages/Modules'
import PrivateRoute from "./components/PrivateRoute";
import Users from './pages/Users'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Courses />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
           <Route
            path="/modules"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Modules/>
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
