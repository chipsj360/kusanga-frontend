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
import CourseGroups from "./pages/CourseGroups";
import Enrollment from "./pages/Enrollment";
import TrainingRecords from "./pages/TrainingRecords";
import VideoModulePlayer from "./components/VideoModulePlayer";
import Departments from "./pages/Departments";
function App() {
  const [count, setCount] = useState(0)

   return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        
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

        {/* Video launcher popup route */}
        <Route
          path="/module-launcher/:moduleId"
          element={
            <PrivateRoute>
              <VideoModulePlayer />
            </PrivateRoute>
          }
        />
        <Route path="/course-groups" element={
           <PrivateRoute>
            <RoleRoute allowedRoles={["trainer", "admin"]}>
              <DashboardLayout>
               <CourseGroups />
              </DashboardLayout>
            </RoleRoute> 
          </PrivateRoute>
            } />
        <Route path="/enrollments" element={
           <PrivateRoute>
            <RoleRoute allowedRoles={["trainer", "admin"]}>
              <DashboardLayout>
               <Enrollment/>
              </DashboardLayout>
            </RoleRoute> 
          </PrivateRoute>
            } />
        <Route path="/training-records"  element={
           <PrivateRoute>
            <RoleRoute allowedRoles={["trainer", "admin", "student"]}>
              <DashboardLayout>
               <TrainingRecords />
              </DashboardLayout>
            </RoleRoute> 
          </PrivateRoute>
            } />
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
        <Route
          path="/departments"
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={["trainer", "admin"]}>
                <DashboardLayout>
                  <Departments />
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