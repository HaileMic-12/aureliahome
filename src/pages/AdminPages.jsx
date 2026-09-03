import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useFeedback } from "../components/Feedback";
import { getRecords, removeRecord, updateRecord } from "../services/records";
import { Button, card, Field, input } from "./shared";

export function AdminLogin() {
  const { login, resetPassword, firebaseConfigured, isAdmin, loading } = useAuth();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (isAdmin && !loading) navigate("/admin", { replace: true });
  }, [isAdmin, loading, navigate]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setBusy(false);
    }
  };
  const reset = async () => {
    try {
      await resetPassword(email);
      notify("success", "Password reset email sent.");
    } catch (error) {
      notify("error", error.message);
    }
  };
  return (
    <section className="mx-auto max-w-md px-5 py-24">
      <div className={`${card} p-8`}>
        <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-300">
          Property administration
        </p>
        <h1 className="mt-3 font-serif text-4xl">Sign in</h1>
        {!firebaseConfigured && (
          <p className="mt-5 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Firebase is not configured. See DOCUMENTATION/firebase-setup.md.
          </p>
        )}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <Field label="Email">
            <input
              className={input}
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <input
              className={input}
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button disabled={busy || !firebaseConfigured} className="w-full">
            {busy ? "Signing in…" : "Sign in securely"}
          </Button>
        </form>
        <button
          disabled={!email || !firebaseConfigured}
          onClick={reset}
          className="mt-5 text-sm text-amber-200 disabled:opacity-50"
        >
          Send password reset email
        </button>
      </div>
    </section>
  );
}

const collections = [
  ["bookings", "Bookings"],
  ["restaurantReservations", "Restaurant reservations"],
  ["roomServiceOrders", "Room-service orders"],
  ["eventInquiries", "Event inquiries"],
  ["messages", "Messages"],
  ["newsletterSubscribers", "Newsletter"],
];

export function Admin() {
  const { loading, user, isAdmin, logout } = useAuth();
  const { notify } = useFeedback();
  const [active, setActive] = useState("bookings");
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!isAdmin) return;
    setBusy(true);
    getRecords(active)
      .then(setRecords)
      .catch((error) => notify("error", error.message))
      .finally(() => setBusy(false));
  }, [active, isAdmin, notify]);
  if (loading)
    return <p className="p-10 text-center text-stone-400">Checking account…</p>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  const visibleRecords = records.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
  );
  const changeStatus = async (id, status) => {
    try {
      await updateRecord(active, id, { status });
      setRecords(
        records.map((item) => (item.id === id ? { ...item, status } : item)),
      );
      notify("success", "Status updated.");
    } catch (error) {
      notify("error", error.message);
    }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await removeRecord(active, id);
      setRecords(records.filter((item) => item.id !== id));
      notify("success", "Record deleted.");
    } catch (error) {
      notify("error", error.message);
    }
  };
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-amber-300">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-4xl">Operations desk</h1>
        </div>
        <button
          className="rounded-xl border border-white/15 px-4 py-2 text-sm"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {collections.map(([id, label]) => (
          <button
            onClick={() => setActive(id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${active === id ? "bg-amber-400 font-bold text-stone-950" : "border border-white/15 text-stone-300"}`}
            key={id}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className={`${card} overflow-x-auto`}>
          <div className="border-b border-white/10 p-4">
            <label className="sr-only" htmlFor="admin-search">
              Search records
            </label>
            <input
              id="admin-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this section"
              className="w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-300"
            />
          </div>
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-white/10 text-stone-400">
              <tr>
                <th className="p-4">Record</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {busy ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-stone-400">
                    Loading…
                  </td>
                </tr>
              ) : visibleRecords.length ? (
                visibleRecords.map((item) => (
                  <tr className="border-b border-white/5" key={item.id}>
                    <td className="p-4">
                      <button
                        onClick={() => setSelected(item)}
                        className="text-left hover:text-amber-200"
                      >
                        <strong className="text-white">
                          {item.room?.name ||
                            item.name ||
                            item.email ||
                            item.id.slice(0, 8)}
                        </strong>
                        <p className="mt-1 max-w-sm truncate text-stone-500">
                          {item.eventDate ||
                            item.date ||
                            item.message ||
                            item.roomNumber ||
                            ""}
                        </p>
                      </button>
                    </td>
                    <td className="p-4 text-stone-300">
                      {item.email || item.phone || "—"}
                    </td>
                    <td className="p-4">
                      <select
                        value={item.status || "new"}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="rounded border border-white/15 bg-stone-900 px-2 py-1"
                      >
                        <option>new</option>
                        <option>pending</option>
                        <option>confirmed</option>
                        <option>completed</option>
                        <option>cancelled</option>
                        <option>handled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => remove(item.id)}
                        className="text-red-300 hover:text-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-stone-500">
                    {query ? "No matching records." : "No records yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <aside className={`${card} h-fit p-6 xl:sticky xl:top-28`}>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-300">
            Record details
          </p>
          {selected ? (
            <>
              <h2 className="mt-3 font-serif text-2xl text-white">
                {selected.room?.name ||
                  selected.name ||
                  selected.email ||
                  selected.id.slice(0, 8)}
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                {Object.entries(selected)
                  .filter(
                    ([key]) => !["id", "createdAt", "updatedAt"].includes(key),
                  )
                  .map(([key, value]) => (
                    <div key={key} className="border-b border-white/10 pb-3">
                      <dt className="capitalize text-stone-500">
                        {key.replace(/([A-Z])/g, " $1")}
                      </dt>
                      <dd className="mt-1 break-words text-stone-200">
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value || "—")}
                      </dd>
                    </div>
                  ))}
              </dl>
            </>
          ) : (
            <p className="mt-5 text-sm leading-6 text-stone-500">
              Select a record from the table to review the complete submitted
              information.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
