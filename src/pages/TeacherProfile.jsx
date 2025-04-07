import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const TeacherProfile = () => {
  const { id } = useParams(); // Get teacher ID from URL
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherRef = doc(db, "teachers", id);
        const teacherSnap = await getDoc(teacherRef);
        
        if (teacherSnap.exists()) {
          setTeacherData(teacherSnap.data());
          // Check if this is the profile of the currently logged in user
          setIsCurrentUser(currentUser && currentUser.uid === id);
        } else {
          console.log("No teacher data found!");
          navigate('/teachers'); // Redirect if teacher not found
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeacherData();
    }
  }, [id, currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading teacher profile...</div>;
  }

  if (!teacherData) {
    return <div>Teacher profile not found.</div>;
  }

  return (
    <div className="teacher-profile">
      <h2>{teacherData.name}'s Profile</h2>
      <div className="profile-info">
        <p><strong>Email:</strong> {teacherData.email}</p>
        <p><strong>Subjects:</strong> {teacherData.subjects?.join(", ") || "Not specified"}</p>
        <p><strong>Bio:</strong> {teacherData.bio || "No bio available"}</p>
        <p><strong>Qualifications:</strong> {teacherData.qualifications || "Not specified"}</p>
        {/* Add more fields as needed */}
      </div>
      
      {/* Only show logout if this is the current user's profile */}
      {isCurrentUser && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}

export default TeacherProfile;