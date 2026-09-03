import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../AuthContext";
import { FeedbackProvider } from "../components/Feedback";
import { Layout } from "../components/Layout";
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
} from "./index";

const routes = [
  ["/", "/", Home],
  ["/rooms", "/rooms", Rooms],
  ["/rooms/:roomId", "/rooms/garden-king", RoomDetail],
  ["/book", "/book", Booking],
  ["/restaurant", "/restaurant", Restaurant],
  ["/restaurant/reservation", "/restaurant/reservation", RestaurantReservation],
  ["/room-service", "/room-service", RoomService],
  ["/events", "/events", Events],
  ["/gallery", "/gallery", Gallery],
  ["/about", "/about", About],
  ["/contact", "/contact", Contact],
  ["/privacy", "/privacy", () => <Legal kind="privacy" />],
  ["/terms", "/terms", () => <Legal kind="terms" />],
  ["/admin/login", "/admin/login", AdminLogin],
  ["/admin", "/admin", Admin],
  ["*", "/missing-route", NotFound],
];

describe("route rendering", () => {
  it.each(routes)("renders %s without a runtime error", (pattern, path, Page) => {
    globalThis.window = { location: { search: "" } };
    const markup = renderToString(
      <AuthProvider>
        <FeedbackProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route element={<Layout />}>
                <Route path={pattern} element={<Page />} />
              </Route>
            </Routes>
          </MemoryRouter>
        </FeedbackProvider>
      </AuthProvider>,
    );

    expect(markup).not.toEqual("");
  });
});
