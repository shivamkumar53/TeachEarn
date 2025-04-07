import React, { useEffect, useState } from 'react';
import TeacherNavbar from '../components/TeacherNavbar';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherSavedJob = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const savedJobsRef = collection(db, 'savedJobs');
        const q = query(
          savedJobsRef,
          where('teacherId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const jobs = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          jobs.push({
            id: doc.id,
            jobId: data.jobId,
            jobTitle: data.jobTitle || 'No Title',
            companyName: data.companyName || 'Unknown Company',
            jobDescription: data.jobDescription || '',
            savedAt: data.savedAt // Keep as Firestore Timestamp for now
          });
        });

        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        setError('Failed to load saved jobs. Please try again.');
        toast.error('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobDocId) => {
    try {
      if (!window.confirm('Are you sure you want to remove this job from your saved list?')) {
        return;
      }

      await deleteDoc(doc(db, 'savedJobs', jobDocId));
      setSavedJobs(savedJobs.filter(job => job.id !== jobDocId));
      toast.success('Job removed from saved list', {
        autoClose: 2000,
        hideProgressBar: true
      });
    } catch (error) {
      console.error('Error removing saved job:', error);
      toast.error('Failed to remove job from saved list');
    }
  };

  // Format date safely
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Unknown date';
    return timestamp.toDate().toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <TeacherNavbar />
        <div className="container mt-4">
          <div className="text-center">
            <div className="loader-container flex justify-center items-center">
              <div className="loader">
                <div className="dot"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TeacherNavbar />
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TeacherNavbar />
      <ToastContainer position="top-right" />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Your Saved Jobs</h2>
          <span className="badge bg-primary">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </span>
        </div>

        {savedJobs.length === 0 ? (
          <div className="card">
            <div className="card-body text-center">
              <i className="bi bi-bookmark-star fs-1 text-muted mb-3"></i>
              <h5 className="card-title">No saved jobs yet</h5>
              <p className="card-text">When you save jobs, they'll appear here.</p>
              <a href="/jobs" className="btn btn-primary">
                Browse Available Jobs
              </a>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {savedJobs.map((job) => (
              <div key={job.id} className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title">{job.jobTitle}</h5>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleUnsaveJob(job.id)}
                        aria-label="Unsave job"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {job.companyName}
                    </h6>
                    <p className="card-text">
                      {job.jobDescription?.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Saved on: {formatDate(job.savedAt)}
                      </small>
                      <div>
                        <a
                          href={`/jobs/${job.jobId}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeacherSavedJob;