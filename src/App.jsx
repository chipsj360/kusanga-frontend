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
import RoleRoute from "./components/RoleRoute";
function App() {
  const [count, setCount] = useState(0)

   return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
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

        {/* Courses – everyone logged in */}
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

        {/* Modules – trainer & admin only */}
        <Route
          path="/modules"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["trainer", "admin"]}>
                <DashboardLayout>
                  <Modules />
                </DashboardLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* Users / Students – trainer & admin only */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["trainer", "admin"]}>
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </RoleRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App
