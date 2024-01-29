import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'

// layouts and pages
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CardSearch from './pages/CardSearch'

import { useEffect } from 'react'
import { gapi } from 'gapi-script'

const clientId = "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="cardsearch" element={<CardSearch />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  )
)

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      });
    }

    gapi.load('client:auth2', start);
  }, []);  
  
  return (
    <RouterProvider router={router} />
  )
}

export default App