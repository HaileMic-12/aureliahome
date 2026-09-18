import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Button, Confirmation, Field, STYLES, SectionTitle } from "./shared";
import { money } from "../config/site";
import { createTrackableRecord } from "../services/records";
import { generateSecureReference } from "../lib/booking";

export function FoodOrdering() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [reference, setReference] = useState("");
  const [orderForm, setOrderForm] = useState({
    guestName: "",
    email: "", // Added email field
    phone: "",
    orderType: "room",
    location: "",
    quantity: 1,
    specialInstructions: ""
  });

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const snap = await getDocs(collection(db, "foods"));
        setFoods(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsOrdering(true);

    try {
      const safeQty = Math.max(1, parseInt(orderForm.quantity, 10) || 1);
      const refCode = generateSecureReference("ORD");
      
      await createTrackableRecord(
        "orders",
        {
          ...orderForm,
          quantity: safeQty,
          foodItem: selectedFood.name,
          pricePerItem: selectedFood.price,
          totalPrice: selectedFood.price * safeQty,
          status: "pending",
        },
        {
          reference: refCode,
          type: "order",
          status: "pending",
          title: selectedFood.name,
        }
      );

      setReference(refCode);
      setSelectedFood(null);
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (reference) {
    return (
      <Confirmation
        title="Order Received!"
        reference={reference}
        copy={orderForm.orderType === "room" 
           ? "Your food is being prepared and will be delivered to your room shortly. Check your email for status updates."
           : "Your order is being prepared. We will serve it to you shortly. Check your email for status updates."}
      />
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionTitle eyebrow="Dining" title="Restaurant & Room Service" />
      <p className="mt-2 text-stone-400 mb-10">Freshly prepared meals, delivered to your door or served at your table.</p>

      {loading ? (
        <div className="text-center text-stone-400 py-20">Loading menu...</div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <div key={food.id} className={`${STYLES.card} overflow-hidden flex flex-col`}>
              <img src={food.image || "/api/placeholder/400/250"} alt={food.name} className="h-48 w-full object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-serif text-white">{food.name}</h3>
                  <span className="text-amber-400 font-bold">{money(food.price)}</span>
                </div>
                <p className="text-stone-400 text-sm mb-6 flex-grow">{food.description}</p>
                <Button variant="primary" className="w-full" onClick={() => setSelectedFood(food)}>
                  View Details & Order
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className={`${STYLES.card} w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative`}>
            <button 
              onClick={() => setSelectedFood(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              Close
            </button>
            
            <h2 className="text-2xl font-serif text-white mb-6">Complete Your Order</h2>
            
            <div className="flex gap-4 p-4 bg-stone-900/50 rounded-lg mb-8 border border-white/5">
              <img src={selectedFood.image || "/api/placeholder/100/100"} className="w-20 h-20 object-cover rounded" alt="" />
              <div>
                <h4 className="text-white font-bold">{selectedFood.name}</h4>
                <p className="text-amber-400">{money(selectedFood.price)}</p>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Guest Name">
                  <input required className={STYLES.input} value={orderForm.guestName} onChange={e => setOrderForm({...orderForm, guestName: e.target.value})} placeholder="Jane Doe" />
                </Field>
                <Field label="Email Address">
                  <input required type="email" className={STYLES.input} value={orderForm.email} onChange={e => setOrderForm({...orderForm, email: e.target.value})} placeholder="jane@example.com" />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Phone Number">
                  <input required className={STYLES.input} value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} placeholder="Room phone or mobile" />
                </Field>
                <Field label="Quantity">
                  <input type="number" min="1" max="10" className={STYLES.input} value={orderForm.quantity} onChange={e => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})} />
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Order Type">
                  <select 
                    className={STYLES.input} 
                    value={orderForm.orderType} 
                    onChange={e => setOrderForm({...orderForm, orderType: e.target.value, location: ""})}
                  >
                    <option value="room">Room Delivery</option>
                    <option value="spot">On the Spot (Dine-in/Pool)</option>
                  </select>
                </Field>
                <Field label={orderForm.orderType === "room" ? "Room Number" : "Table Number / Location"}>
                  <input required className={STYLES.input} value={orderForm.location} onChange={e => setOrderForm({...orderForm, location: e.target.value})} placeholder={orderForm.orderType === "room" ? "e.g. 304" : "e.g. Table 12, Poolside"} />
                </Field>
              </div>

              <Field label="Special Instructions (Optional)">
                <textarea className={STYLES.input} rows="2" value={orderForm.specialInstructions} onChange={e => setOrderForm({...orderForm, specialInstructions: e.target.value})} placeholder="No onions, extra sauce..." />
              </Field>

              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <div className="text-white">
                  Total: <span className="text-amber-400 font-bold text-xl ml-2">{money(selectedFood.price * orderForm.quantity)}</span>
                </div>
                <Button variant="primary" disabled={isOrdering}>
                  {isOrdering ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}