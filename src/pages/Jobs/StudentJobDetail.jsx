import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path to your Firebase config

const StudentJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "studentsJob", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Failed to fetch job");
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Back to jobs
        </button>
        <div className="text-center py-10">
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Back to jobs
        </button>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-600">{error || "Job not found"}</h2>
          <p>No job found with ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <MdArrowBack className="mr-1" /> Back to jobs
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img 
            src={job.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
            alt="Student" 
            className="w-32 h-32 rounded-full mx-auto md:mx-0 mb-4"
          />
          <h1 className="text-2xl font-bold">Job Details</h1>
          <p className="text-gray-600">Posted on: {job.date || "Not specified"}</p>
          
          <div className="mt-4 space-y-2">
            <p><strong>Budget:</strong> {job.budget || "Not specified"}</p>
            <p><strong>Contact:</strong> {job.contactNumber || "Not specified"}</p>
            <p><strong>Availability:</strong> {job.additionalRequirements?.availability || "Not specified"}</p>
          </div>
        </div>

        <div className="md:w-2/3">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p>{job.description || "No description provided"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Additional Requirements</h2>
            <div className="grid grid-cols-1 gap-2">
              <p><strong>Availability:</strong> {job.additionalRequirements?.availability || "Flexible"}</p>
              {/* Add more requirements as needed */}
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Apply for this Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentJobDetail;