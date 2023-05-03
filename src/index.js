/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import react from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './App'
import './index.css'

createRoot(document.getElementById('root'))
.render(<Router> 
            <App />
        </Router>
    )

/*ReactDom.render(
<Router> 
    <App />
</Router>, 
document.getElementById('root'));*/