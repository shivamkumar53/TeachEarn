import React from 'react'
import TeacherNavbar from '../components/TeacherNavbar'

const TeacherSavedJob = () => {
  // Sample data - replace with your actual data fetching logic
  const savedJobs = []; // Empty array to simulate no saved jobs
  // const savedJobs = [{id: 1, title: "Math Teacher"}, {id: 2, title: "Science Tutor"}]; // Uncomment to test with saved jobs

  return (
    <>
      <TeacherNavbar/>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          
          {savedJobs.length > 0 ? (
            <div className="grid gap-4">
              {savedJobs.map(job => (
                <div key={job.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h2 className="text-xl font-semibold text-gray-700">{job.title}</h2>
                  {/* Add more job details here as needed */}
                  <div className="mt-2 flex justify-end">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No saved jobs</h3>
                <p className="mt-1 text-gray-500">You haven't saved any jobs yet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TeacherSavedJob