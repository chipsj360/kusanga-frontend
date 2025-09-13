import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
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
