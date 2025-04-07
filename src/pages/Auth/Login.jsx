import { useState, useEffect } from "react";
import React from "react";
import { auth, googleProvider, db } from "../../firebase"; // Ensure Firestore is imported
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "../../assets/css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkUserRole(user.uid); // Fetch and redirect based on role
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const checkUserRole = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "teacher") {
          navigate("/find-student");
        } else {
          navigate("/find-teacher");
        }
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setError("Failed to get user role. Please try again.");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkUserRole(userCredential.user.uid);
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          setError("Invalid email or password");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/too-many-requests":
          setError("Account temporarily locked due to too many attempts");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your connection");
          break;
        default:
          setError("Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await checkUserRole(userCredential.user.uid);
    } catch (err) {
      console.error("Google login error:", err.code, err.message);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled");
      } else {
        setError("Google sign-in failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleEmailLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="auth-button primary"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="auth-button google-button"
          disabled={isLoading}
        >
          <FcGoogle  size={22}/>

          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
        <p className="auth-footer">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
