import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router-dom'

import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import DTCTheme from './dtc_assets/Theme'

// layouts and pages
import RootLayout from './layouts/RootLayout'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Search from './pages/Search'

import { useEffect } from 'react'
import { gapi } from 'gapi-script'

const clientId = "449883430868-j3aom1pndrf721cv5f1tblpce43lthqi.apps.googleusercontent.com";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="search" element={<Search />} />
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
    <ChakraProvider theme={DTCTheme}>
      <CSSReset />
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}

export default App