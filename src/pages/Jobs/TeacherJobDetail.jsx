import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdOutlineBookmarkBorder, MdOutlineShare } from "react-icons/md";

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const teacher = teacherData.find(teacher => teacher.id === Number(id));

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <MdArrowBack className="mr-1" /> Back to teachers
        </button>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-600">Teacher not found</h2>
          <p>No teacher found with ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-6 rounded-xl shadow-md mt-6 ${teacher.bgColor}`}>
      <div className="flex justify-between items-start mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-lg"
        >
          <MdArrowBack className="mr-1" /> Back to teachers
        </button>
        <div className="flex gap-3">
          <button className="p-2 rounded-full bg-white hover:bg-gray-100">
            <MdOutlineBookmarkBorder size={20} />
          </button>
          <button className="p-2 rounded-full bg-white hover:bg-gray-100">
            <MdOutlineShare size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Teacher Profile Section */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <img 
              src={teacher.avatar} 
              alt={teacher.teacher} 
              className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-white shadow-md"
            />
            
            <div className="text-center">
              <h1 className="text-2xl font-bold">{teacher.teacher}</h1>
              <p className="text-gray-600 text-lg">{teacher.subject} Teacher</p>
              
              <div className="flex justify-center items-center mt-2 gap-2">
                <span className="flex items-center text-yellow-500 font-semibold">
                  ★ {teacher.rating}
                </span>
                <span className="text-gray-500">•</span>
                <span>{teacher.studentsTaught} students</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Qualification</h3>
                <p>{teacher.qualification}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Experience</h3>
                <p>{teacher.experience}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Price</h3>
                <p className="text-xl font-bold">{teacher.price}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p>{teacher.location}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Teaching Mode</h3>
                <p>{teacher.teachingMode}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700">Languages</h3>
                <p>{teacher.language}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Details Section */}
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Specialization</h2>
            <p className="text-lg">{teacher.specialization}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <p className="whitespace-pre-line">{teacher.description}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Availability</h2>
            <div className="flex flex-wrap gap-2">
              {teacher.availability.map((slot, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-4">Teaching Approach</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Methodology</h3>
                <p>Customized learning plans based on student needs, interactive sessions, and regular progress assessments.</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Materials</h3>
                <p>Provides comprehensive study materials, practice problems, and reference guides.</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Success Rate</h3>
                <p>90% of students show significant improvement within the first month of classes.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex-1">
              Contact Teacher
            </button>
            <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex-1">
              Book Trial Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetail;