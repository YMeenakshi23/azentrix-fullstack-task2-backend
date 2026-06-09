import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Status states
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage({ text: "✨ Registration successful! Redirecting to login...", type: "success" });
      
      // Auto redirect to login page after 2 seconds on success
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Registration failed. Email might already be taken.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700/50">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Create Account</h2>
          <p className="text-slate-400 text-sm">Sign up to get started with your personal workspace</p>
        </div>

        {/* Dynamic Inner Feedback Alerts */}
        {message.text && (
          <div
            className={`mb-5 p-3 rounded-lg text-sm text-center font-medium border ${
              message.type === "error"
                ? "bg-rose-950/50 text-rose-300 border-rose-800"
                : "bg-emerald-950/50 text-emerald-300 border-emerald-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Registration Block */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Bottom Route Swap Redirect Anchor */}
        <div className="text-center mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium underline transition">
              Log in instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;