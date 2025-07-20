import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const {storeTokenInLS, API} = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        storeTokenInLS(result.token);
        console.log("Login successful");
        navigate("/dashboard");
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email: </label>
      <input name="email" className="border-2 mt-5" type="email" placeholder="Email" onChange={handleChange} />
      <br/>
      <label>Password: </label>
      <input name="password" type="password" className="border-2 mt-5" placeholder="Password" onChange={handleChange} />
      <br/>
      <button type="submit" className="mt-5 border-3 ml-5">Login</button>
    </form>
  );
};

export default Login;
