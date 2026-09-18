import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { Button, Field, STYLES, SectionTitle } from "./shared";

export function AdminInventory({ type }) {
  // type should be passed as either "rooms" or "foods"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, type));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setFormData({});
    setEditingId(null);
  }, [type]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Ensure price is saved as a number
      const payload = { ...formData, price: Number(formData.price) };
      
      if (editingId) {
        await updateDoc(doc(db, type, editingId), payload);
      } else {
        await addDoc(collection(db, type), payload);
      }
      
      setFormData({});
      setEditingId(null);
      fetchItems();
    } catch (error) {
      alert("Failed to save item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item permanently?")) return;
    try {
      await deleteDoc(doc(db, type, id));
      fetchItems();
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* ITEMS LIST */}
      <div className={`${STYLES.card} p-6`}>
        <h2 className="text-xl font-serif text-white mb-6 capitalize">Manage {type}</h2>
        {loading ? (
          <p className="text-stone-400">Loading...</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex gap-4 items-center">
                  {item.image && <img src={item.image} alt="" className="w-16 h-12 object-cover rounded" />}
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-sm text-amber-400">${item.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-stone-400 hover:text-white text-sm px-3 py-1 bg-white/5 rounded">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1 bg-red-400/10 rounded">Delete</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-stone-500">No items found.</p>}
          </div>
        )}
      </div>

      {/* ADD / EDIT FORM */}
      <div className={`${STYLES.card} p-6 h-fit`}>
        <h3 className="text-lg font-serif text-white mb-4">
          {editingId ? "Edit Item" : `Add New ${type === 'rooms' ? 'Room' : 'Food'}`}
        </h3>
        
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Name">
            <input required className={STYLES.input} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Deluxe Suite / Burger" />
          </Field>
          
          <Field label="Price ($)">
            <input required type="number" step="0.01" className={STYLES.input} value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="99.00" />
          </Field>
          
          <Field label="Image URL">
            <input required className={STYLES.input} value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
          </Field>

          {type === "rooms" && (
            <Field label="Capacity (Guests)">
              <input required type="number" className={STYLES.input} value={formData.capacity || ''} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} placeholder="2" />
            </Field>
          )}

          <Field label="Description">
            <textarea required rows="3" className={STYLES.input} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description..." />
          </Field>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" type="submit" className="flex-1">
              {editingId ? "Update" : "Save New"}
            </Button>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setFormData({});}} className="text-stone-400 hover:text-white px-4">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}