import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/css/bootstrap.min.css'
import './assets/css/file-upload.css'
import './assets/css/plyr.css'
import './assets/css/full-calendar.css'
import './assets/css/jquery-ui.css'
import './assets/css/editor-quill.css'
import './assets/css/apexcharts.css'
import './assets/css/calendar.css'
import './assets/css/jquery-jvectormap-2.0.5.css'
import './assets/css/main.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
