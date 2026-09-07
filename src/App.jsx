import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { FeedbackProvider } from "./components/Feedback";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { Layout } from "./components/Layout";

const lazyPage = (load, name) => lazy(() => load().then((module) => ({ default: module[name] })));

const Home = lazyPage(() => import("./pages/HomePage"), "Home");
const Rooms = lazyPage(() => import("./pages/RoomsPage"), "Rooms");
const RoomDetail = lazyPage(() => import("./pages/RoomsPage"), "RoomDetail");
const Booking = lazyPage(() => import("./pages/BookingPage"), "Booking");
const Restaurant = lazyPage(() => import("./pages/RestaurantPage"), "Restaurant");
const RestaurantReservation = lazyPage(
  () => import("./pages/RestaurantReservationPage"),
  "RestaurantReservation",
);
const RoomService = lazyPage(() => import("./pages/RoomServicePage"), "RoomService");
const Events = lazyPage(() => import("./pages/EventsPage"), "Events");
const Gallery = lazyPage(() => import("./pages/GalleryPage"), "Gallery");
const About = lazyPage(() => import("./pages/AboutPage"), "About");
const Contact = lazyPage(() => import("./pages/ContactPage"), "Contact");
const Legal = lazyPage(() => import("./pages/LegalPage"), "Legal");
const AdminLogin = lazyPage(() => import("./pages/AdminPages"), "AdminLogin");
const Admin = lazyPage(() => import("./pages/AdminPages"), "Admin");
const NotFound = lazyPage(() => import("./pages/NotFoundPage"), "NotFound");

function PageLoader() {
  return (
    <div className="grid min-h-[45vh] place-items-center px-5" role="status" aria-live="polite">
      <p className="text-sm text-stone-400">Loading page…</p>
    </div>
  );
}

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
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </AppErrorBoundary>
        </BrowserRouter>
      </FeedbackProvider>
    </AuthProvider>
  );
}
