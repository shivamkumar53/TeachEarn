import { useState, createContext, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'teacher', 'student', or null

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchUserRole(user.uid).then((role) => setUserRole(role));
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
    });
    return unsubscribe;
  }, []);

  async function fetchUserRole(uid) {
    // Example: Fetch role from Firestore
    // const doc = await getDoc(doc(db, "users", uid));
    // return doc.data()?.role || 'student'; (default to student)
    return 'teacher'; // Hardcoded for testing (replace with actual logic)
  }

  const value = {
    currentUser,
    userRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}