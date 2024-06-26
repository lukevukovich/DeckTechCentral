import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// layouts and pages
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import CardSearch from "./pages/CardSearch/CardSearch";
import DeckSearch from "./pages/DeckSearch/DeckSearch";
import Deck from "./pages/Deck/Deck";
import NotFound from "./pages/NotFound/NotFound";
import "./App.css";

export const baseUrl = "http://localhost:5272";

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="cardsearch" element={<CardSearch />} />
      <Route path="decksearch" element={<DeckSearch />} />
      <Route path="profile" element={<Profile />} />
      <Route path="deck" element={<Deck />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
