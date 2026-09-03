import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { FeedbackProvider } from "./components/Feedback";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { Layout } from "./components/Layout";
import {
  About,
  Admin,
  AdminLogin,
  Booking,
  Contact,
  Events,
  Gallery,
  Home,
  Legal,
  NotFound,
  Restaurant,
  RestaurantReservation,
  RoomDetail,
  Rooms,
  RoomService,
} from "./pages";

function ScrollTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <BrowserRouter>
          <AppErrorBoundary>
            <ScrollTop />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/rooms/:roomId" element={<RoomDetail />} />
                <Route path="/book" element={<Booking />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route
                  path="/restaurant/reservation"
                  element={<RestaurantReservation />}
                />
                <Route path="/room-service" element={<RoomService />} />
                <Route path="/events" element={<Events />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Legal kind="privacy" />} />
                <Route path="/terms" element={<Legal kind="terms" />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AppErrorBoundary>
        </BrowserRouter>
      </FeedbackProvider>
    </AuthProvider>
  );
}
