import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
const FeedbackContext = createContext(null);
export const useFeedback = () => useContext(FeedbackContext);
export function FeedbackProvider({ children }) {
  const [message, setMessage] = useState(null);
  const notify = useCallback((type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 6000);
  }, []);
  const value = useMemo(() => ({ notify }), [notify]);
  return (
    <FeedbackContext.Provider value={value}>
      {children}
      {message && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[100] max-w-sm rounded-2xl border px-5 py-4 shadow-2xl ${message.type === "error" ? "border-red-400/40 bg-red-950 text-red-100" : "border-emerald-400/40 bg-emerald-950 text-emerald-100"}`}
        >
          {message.text}
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
