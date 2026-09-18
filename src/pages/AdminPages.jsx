import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { useFeedback } from "../components/Feedback";
import {
  getRecords,
  removeRecord,
  updateRecord,
  createRecord,
} from "../services/records";
import { sendStatusEmail } from "../services/email";
import { db } from "../firebase";
import { Button, STYLES, Field } from "./shared";

/*
 * ImgBB
 * IMPORTANT:
 * Add your own ImgBB API key to .env:
 * VITE_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
 * Do NOT put your personal API key directly in this file.
 */
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || "";

const COLLECTIONS = [
  { id: "bookings", label: "Stays" },
  { id: "orders", label: "Food Orders" },
  { id: "rooms", label: "Manage Rooms" },
  { id: "foods", label: "Manage Menu" },
  { id: "restaurantReservations", label: "Dining" },
  { id: "eventInquiries", label: "Events" },
  { id: "messages", label: "Messages" },
];

const TRACKABLE_COLLECTIONS = [
  "bookings",
  "orders",
  "roomServiceOrders",
];

const STATUS_COLORS = {
  new: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  pending: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  confirmed: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  preparing: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  ready: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20",
  completed: "bg-stone-400/10 text-stone-400 border-stone-400/20",
  cancelled: "bg-red-400/10 text-red-400 border-red-400/20",
  handled: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const getDisplayName = (item) => {
  if (item?.room?.name) return item.room.name;
  if (item?.foodItem) return item.foodItem;
  if (item?.name) return item.name;
  const fullName = [item?.firstName, item?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  if (fullName) return fullName;
  if (item?.guestName) return item.guestName;
  if (item?.email) return item.email;
  if (item?.id) return item.id.slice(0, 8);
  return "Record";
};

const getTrackingType = (collection) => {
  if (collection === "bookings") return "booking";
  if (collection === "orders") return "order";
  if (collection === "roomServiceOrders") return "roomService";
  return null;
};

const updatePublicTracking = async (record, collection, status) => {
  if (!TRACKABLE_COLLECTIONS.includes(collection)) return;
  if (!record?.reference) return;

  const trackingType = getTrackingType(collection);
  if (!trackingType) return;

  const trackingRef = doc(db, "publicTracking", record.reference);
  await updateDoc(trackingRef, {
    status,
    type: trackingType,
    reference: record.reference,
    title: getDisplayName(record),
    updatedAt: new Date(),
  });
};

/* -------------------------------------------------------------------------- */
/* Admin Login                                                                */
/* -------------------------------------------------------------------------- */

export function AdminLogin() {
  const { login, resetPassword, firebaseConfigured, isAdmin, loading } = useAuth();
  const { notify } = useFeedback();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdmin && !loading) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      notify("error", "Invalid credentials or unauthorized access.");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetPassword(email);
      notify("success", "Password reset instructions sent.");
    } catch (error) {
      notify("error", error?.message || "Failed to reset password.");
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-24">
      <div className={`${STYLES.card} w-full p-8 md:p-10`}>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-400">
            Operations Portal
          </p>
          <h1 className="mt-3 font-serif text-3xl text-white">Staff Login</h1>
        </div>

        {!firebaseConfigured && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            Database connection error. Please verify environment configuration.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Field label="Staff Email">
            <input
              className={STYLES.input}
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@property.com"
            />
          </Field>

          <Field label="Password">
            <input
              className={STYLES.input}
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          <Button
            variant="primary"
            disabled={busy || !firebaseConfigured}
            className="w-full"
          >
            {busy ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            disabled={!email || !firebaseConfigured}
            onClick={handleReset}
            className="text-sm font-medium text-stone-400 transition-colors hover:text-white disabled:opacity-50"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* ImgBB Upload                                                               */
/* -------------------------------------------------------------------------- */

async function uploadToImgBB(file) {
  if (!IMGBB_API_KEY) {
    throw new Error(
      "ImgBB API key is not configured. Add VITE_IMGBB_API_KEY to your .env file."
    );
  }
  if (!file) {
    throw new Error("No image selected.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }
  const maxSize = 32 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image must be smaller than 32MB.");
  }

  const uploadData = new FormData();
  uploadData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(IMGBB_API_KEY)}`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  if (!response.ok) {
    throw new Error(`ImgBB upload failed with status ${response.status}.`);
  }

  const result = await response.json();
  if (!result?.success || !result?.data?.url) {
    throw new Error(result?.error?.message || "ImgBB could not upload the image.");
  }

  return result.data.url;
}

/* -------------------------------------------------------------------------- */
/* Admin Inventory                                                            */
/* -------------------------------------------------------------------------- */

function AdminInventory({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { notify } = useFeedback();

  const resetForm = useCallback(() => {
    setFormData({});
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecords(type);
      setItems(data);
    } catch {
      notify("error", `Failed to load ${type}.`);
    } finally {
      setLoading(false);
    }
  }, [type, notify]);

  useEffect(() => {
    fetchItems();
    resetForm();
  }, [fetchItems, resetForm]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("error", "Please upload a valid image file.");
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image || "";
      if (imageFile) {
        finalImageUrl = await uploadToImgBB(imageFile);
      }
      if (!finalImageUrl) {
        notify("error", "Please upload an image before saving.");
        return;
      }

      const parsedPrice = parseFloat(formData.price);
      const safePrice = Number.isFinite(parsedPrice) ? Math.max(0, parsedPrice) : 0;

      const payload = {
        ...formData,
        name: (formData.name || "").trim(),
        description: (formData.description || "").trim(),
        price: safePrice,
        image: finalImageUrl,
      };

      if (type === "rooms") {
        const parsedCapacity = parseInt(formData.capacity, 10);
        payload.capacity = Number.isFinite(parsedCapacity) ? Math.max(1, parsedCapacity) : 2;
      }

      if (editingId) {
        await updateRecord(type, editingId, payload);
        notify("success", "Item updated successfully.");
      } else {
        await createRecord(type, payload);
        notify("success", "Item added successfully.");
      }

      resetForm();
      await fetchItems();
    } catch (error) {
      console.error("Inventory save error:", error);
      notify("error", error?.message || "Failed to save item.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item permanently?")) {
      return;
    }
    try {
      await removeRecord(type, id);
      notify("success", "Item deleted.");
      await fetchItems();
    } catch {
      notify("error", "Failed to delete item.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setImagePreview(item.image || "");
    setImageFile(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className={`${STYLES.card} p-6`}>
        <h2 className="mb-6 text-xl font-serif capitalize text-white">
          Manage {type}
        </h2>
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-white/10 pb-4"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="h-12 w-16 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-amber-400">${item.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded bg-white/5 px-3 py-1 text-sm text-stone-400 transition-colors hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded bg-red-400/10 px-3 py-1 text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-stone-500">No items found in {type}.</p>
            )}
          </div>
        )}
      </div>

      <div className={`${STYLES.card} sticky top-28 h-fit p-6`}>
        <h3 className="mb-4 text-lg font-serif text-white">
          {editingId
            ? "Edit Item"
            : `Add New ${type === "rooms" ? "Room" : "Food"}`}
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
              Item Image
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleImageDrop}
              className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/20 bg-stone-900/30 p-6 transition-all hover:border-amber-400/50 hover:bg-stone-900/60"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageDrop}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="z-0 h-32 rounded object-contain"
                  alt="Preview"
                />
              ) : (
                <div className="pointer-events-none text-center">
                  <svg
                    className="mx-auto mb-2 h-8 w-8 text-stone-500 transition-colors group-hover:text-amber-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="text-sm text-stone-400">
                    Drag & drop or click to upload
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Images are uploaded to ImgBB.
            </p>
          </div>

          <Field label="Name">
            <input
              required
              className={STYLES.input}
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Deluxe Suite / Burger"
            />
          </Field>

          <Field label="Price ($)">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              className={STYLES.input}
              value={formData.price ?? ""}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="99.00"
            />
          </Field>

          {type === "rooms" && (
            <Field label="Capacity (Guests)">
              <input
                required
                type="number"
                min="1"
                className={STYLES.input}
                value={formData.capacity ?? ""}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="2"
              />
            </Field>
          )}

          <Field label="Description">
            <textarea
              required
              rows="3"
              className={STYLES.input}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description..."
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              type="submit"
              disabled={isUploading}
              className="flex-1 bg-amber-500 text-stone-900 hover:bg-amber-400"
            >
              {isUploading
                ? "Uploading..."
                : editingId
                ? "Update Item"
                : "Save New Item"}
            </Button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isUploading}
                className="px-4 text-stone-400 transition-colors hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Admin Dashboard                                                       */
/* -------------------------------------------------------------------------- */

export function Admin() {
  const { loading, user, isAdmin, logout } = useAuth();
  const { notify } = useFeedback();

  const [activeTab, setActiveTab] = useState("bookings");
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!isAdmin) return;
    if (activeTab === "rooms" || activeTab === "foods") {
      return;
    }
    setBusy(true);
    try {
      const data = await getRecords(activeTab);
      setRecords(
        [...data].sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        })
      );
      setSelectedRecord(null);
    } catch {
      notify("error", "Failed to fetch records.");
    } finally {
      setBusy(false);
    }
  }, [activeTab, isAdmin, notify]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const visibleRecords = useMemo(() => {
    if (!query.trim()) return records;
    const q = query.toLowerCase().trim();

    return records.filter((item) => {
      const searchableContent = Object.entries(item)
        .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
        .map(([, val]) => (typeof val === "object" ? JSON.stringify(val) : String(val ?? "")))
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(q);
    });
  }, [records, query]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const changeStatus = async (id, status) => {
    const originalRecord = records.find((item) => item.id === id);
    if (!originalRecord) {
      notify("error", "Record could not be found.");
      return;
    }

    try {
      await updateRecord(activeTab, id, { status });

      if (TRACKABLE_COLLECTIONS.includes(activeTab)) {
        try {
          await updatePublicTracking(originalRecord, activeTab, status);
        } catch (trackingError) {
          console.error("Public tracking update failed:", trackingError);
        }
      }

      const updatedRecord = { ...originalRecord, status };
      setRecords((currentRecords) =>
        currentRecords.map((item) => (item.id === id ? updatedRecord : item))
      );
      if (selectedRecord?.id === id) {
        setSelectedRecord(updatedRecord);
      }

      if (updatedRecord.email) {
        try {
          await sendStatusEmail({
            to_name: updatedRecord.firstName || updatedRecord.guestName || "Guest",
            to_email: updatedRecord.email,
            reference: updatedRecord.reference || id.slice(0, 8),
            status,
            details: updatedRecord.room?.name || updatedRecord.foodItem || "Hotel Service",
          });
        } catch (emailError) {
          console.error("Status email failed:", emailError);
        }
      }
      notify("success", `Record status updated to ${status}.`);
    } catch (error) {
      console.error("Status update error:", error);
      notify("error", "Failed to update status.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this record?")) {
      return;
    }

    const recordToDelete = records.find((item) => item.id === id);

    try {
      await removeRecord(activeTab, id);

      if (recordToDelete?.reference && TRACKABLE_COLLECTIONS.includes(activeTab)) {
        try {
          await removeRecord("publicTracking", recordToDelete.reference);
        } catch (trackingError) {
          console.error("Failed to delete public tracking record:", trackingError);
        }
      }

      setRecords((currentRecords) => currentRecords.filter((item) => item.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
      notify("success", "Record deleted successfully.");
    } catch (error) {
      console.error("Record deletion error:", error);
      notify("error", "Failed to delete record.");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-400">
            Operations Dashboard
          </p>
          <h1 className="mt-2 font-serif text-3xl text-white md:text-4xl">
            Property Management
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-400">{user.email}</span>
          <Button variant="outline" onClick={logout} className="px-4 py-2 text-sm">
            Sign Out
          </Button>
        </div>
      </header>

      <div className="scrollbar-hide mt-8 flex gap-2 overflow-x-auto pb-2">
        {COLLECTIONS.map(({ id, label }) => (
          <button
            type="button"
            onClick={() => setActiveTab(id)}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20"
                : "border border-white/10 bg-white/5 text-stone-300 hover:bg-white/10"
            }`}
            key={id}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "rooms" || activeTab === "foods" ? (
          <AdminInventory type={activeTab} />
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1fr_24rem]">
            <div className={`${STYLES.card} flex flex-col overflow-hidden`}>
              <div className="border-b border-white/10 bg-stone-900/50 p-5">
                <label className="sr-only" htmlFor="admin-search">
                  Search records
                </label>
                <input
                  id="admin-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search ${
                    COLLECTIONS.find((c) => c.id === activeTab)?.label.toLowerCase()
                  }...`}
                  className={STYLES.input}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-stone-900/80 text-xs uppercase tracking-wider text-stone-400">
                    <tr>
                      <th className="p-5 font-medium">Record Details</th>
                      <th className="p-5 font-medium">Contact Info</th>
                      <th className="p-5 font-medium">Status</th>
                      <th className="p-5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {busy ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-stone-400">
                          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                        </td>
                      </tr>
                    ) : visibleRecords.length ? (
                      visibleRecords.map((item) => (
                        <tr
                          className={`transition-colors hover:bg-white/5 ${
                            selectedRecord?.id === item.id ? "bg-white/5" : ""
                          }`}
                          key={item.id}
                        >
                          <td className="p-5">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(item)}
                              className="text-left"
                            >
                              <strong className="block text-base font-medium text-white transition-colors hover:text-amber-400">
                                {getDisplayName(item)}
                              </strong>
                              <span className="mt-1 block max-w-xs truncate text-stone-500">
                                {item.eventDate ||
                                  item.date ||
                                  item.message ||
                                  item.location ||
                                  item.roomNumber ||
                                  "No date specified"}
                              </span>
                            </button>
                          </td>
                          <td className="p-5 text-stone-300">
                            <div className="flex flex-col gap-1">
                              {item.email && <span>{item.email}</span>}
                              {item.phone && <span className="text-stone-500">{item.phone}</span>}
                              {!item.email && !item.phone && "—"}
                            </div>
                          </td>
                          <td className="p-5">
                            <select
                              value={item.status || "new"}
                              onChange={(e) => changeStatus(item.id, e.target.value)}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider outline-none transition-colors ${
                                STATUS_COLORS[item.status || "new"] || STATUS_COLORS.new
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="handled">Handled</option>
                            </select>
                          </td>
                          <td className="p-5 text-right">
                            <button
                              type="button"
                              onClick={() => remove(item.id)}
                              className="text-stone-500 transition-colors hover:text-red-400"
                              title="Delete Record"
                              aria-label="Delete record"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 2 2 2v2" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-stone-500">
                          {query ? "No matching records found." : "No records in this category yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className={`${STYLES.card} flex h-fit flex-col xl:sticky xl:top-28`}>
              <div className="border-b border-white/10 bg-stone-900/50 p-6">
                <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-400">
                  Record Inspector
                </p>
                <h2 className="mt-2 truncate font-serif text-xl text-white">
                  {selectedRecord ? getDisplayName(selectedRecord) : "No Selection"}
                </h2>
                {selectedRecord?.reference && (
                  <span className="mt-2 inline-block rounded bg-amber-400/10 px-2 py-1 text-xs font-bold text-amber-400">
                    {selectedRecord.reference}
                  </span>
                )}
              </div>
              <div className="p-6">
                {selectedRecord ? (
                  <div className="flex h-full flex-col">
                    <dl className="mb-6 space-y-4 text-sm">
                      {Object.entries(selectedRecord)
                        .filter(([key]) => !["id", "createdAt", "updatedAt", "reference"].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <dt className="text-xs uppercase tracking-wider text-stone-500">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </dt>
                            <dd className="mt-1 break-words font-medium text-stone-200">
                              {value !== null && typeof value === "object" ? (
                                <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-3 text-xs text-stone-400">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                String(value === "" ? "—" : value ?? "—")
                              )}
                            </dd>
                          </div>
                        ))}
                    </dl>
                    {(selectedRecord.status === "pending" || selectedRecord.status === "new") &&
                      ["bookings", "orders"].includes(activeTab) && (
                        <div className="mt-auto border-t border-white/10 pt-6">
                          <p className="mb-3 text-xs text-stone-400">Requires Staff Action</p>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => changeStatus(selectedRecord.id, "confirmed")}
                              className="flex-1 rounded bg-amber-500 py-2 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-400"
                            >
                              Approve / Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => changeStatus(selectedRecord.id, "cancelled")}
                              className="flex-1 rounded border border-white/10 bg-white/5 py-2 text-sm font-bold text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                    <svg
                      className="mb-4 h-10 w-10 text-stone-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm leading-relaxed text-stone-500">
                      Select a record from the table
                      <br />
                      to review the complete submission details.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}