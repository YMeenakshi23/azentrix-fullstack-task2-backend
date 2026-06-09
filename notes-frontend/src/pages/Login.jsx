import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      console.log("Login Response Data:", response.data);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700/50">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-400 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Log in to manage your workspace notes</p>
        </div>

        {/* Error Feedback Message instead of browser alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-rose-950/50 text-rose-300 border border-rose-800 text-center font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium underline transition">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;