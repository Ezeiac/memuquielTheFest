import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Background } from './components/Background.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/index.css'
import App from './components/App.jsx'



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    {/* <Background /> */}
    <App />
  </StrictMode>
  </BrowserRouter>
)
