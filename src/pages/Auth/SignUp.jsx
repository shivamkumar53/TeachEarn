import { useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import React from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../assets/css/SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Check if email already exists
      const userQuery = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        setError("This email is already registered.");
        return;
      }

      // Create user authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      // If teacher, create their personal collection
      if (role === "teacher") {
        await setDoc(doc(db, "teachers", user.uid), {
          basicInfo: {
            email: user.email,
            createdAt: new Date(),
            status: "active"
          },
          stats: {
            jobPosts: 0,
            lastPosted: null
          }
        });

        // Initialize jobs subcollection with a dummy document
        const jobsRef = collection(db, `teachers/${user.uid}/jobs`);
        await addDoc(jobsRef, {
          initialized: true,
          timestamp: new Date()
        });
      }

      navigate(role === "student" ? "/find-student" : "/find-teacher");
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp} className="auth-form">
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
          <div className="form-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>I am a</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Student</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Teacher</span>
              </label>
            </div>
          </div>
          <button type="submit" className="auth-button primary">
            Sign Up
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;