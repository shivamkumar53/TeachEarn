import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/PostJob.css";
import StudentNavbar from '../../components/StudentNavbar';

// Background color options
const bgColors = [
  { name: 'student-card-orange', display: 'Orange' },
  { name: 'student-card-green', display: 'Green' },
  { name: 'student-card-purple', display: 'Purple' },
  { name: 'student-card-blue', display: 'Blue' },
  { name: 'student-card-gray', display: 'Gray' },
  { name: 'student-card-indigo', display: 'Indigo' }
];

const PostJobForStudying = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedBgColor, setSelectedBgColor] = useState(bgColors[0]);
  const navigate = useNavigate();

  const studyTypes = [
    'Academic Tutoring',
    'Test Preparation',
    'Skill Development',
    'Language Learning',
    'Homework Help',
    'Project Assistance',
    'Research Guidance',
    'Other'
  ];

  const studyLevels = [
    'Elementary School',
    'Middle School',
    'High School',
    'Undergraduate',
    'Graduate',
    'Professional'
  ];

  const studyModes = [
    'Online',
    'In-person',
    'Hybrid'
  ];

  const availabilityOptions = [
    'Weekdays Morning',
    'Weekdays Afternoon',
    'Weekdays Evening',
    'Weekends Morning',
    'Weekends Afternoon',
    'Weekends Evening',
    'Flexible'
  ];

  const budgetOptions = [
    'Per hour',
    'Per session',
    'Per month',
    'Fixed price'
  ];

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/sign-up');
    }
  }, [navigate]);

  const handleTagAdd = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storage = getStorage();
    const storageRef = ref(storage, `student-requests/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const ensureStudentExists = async (userId, userEmail) => {
    const studentRef = doc(db, "students", userId);
    await setDoc(studentRef, {
      basicInfo: {
        email: userEmail,
        createdAt: new Date(),
        status: "active"
      },
      stats: {
        studyRequests: 0,
        lastPosted: null
      }
    }, { merge: true });
    return studentRef;
  };

  const getRandomBgColor = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in as a student to post study requests");
      }

      // 1. Ensure student document exists
      const studentRef = await ensureStudentExists(user.uid, user.email);

      // 2. Upload image if exists
      const imageUrl = imageFile ? await uploadImage(imageFile) : null;

      // 3. Prepare study request data
      const studyRequestData = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        studentName: data.studentName,
        avatar: imageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
        studyType: data.studyType,
        studyLevel: data.studyLevel,
        subjects: data.subjects.split(',').map(item => item.trim()),
        description: data.description,
        budget: `₹${data.budget}/${data.budgetOption.replace('Per ', '').toLowerCase()}`,
        location: data.location,
        availability: data.availability,
        studyMode: data.studyMode,
        language: data.language.split(',').map(item => item.trim()).join(', '),
        bgColor: selectedBgColor.name,
        contactNumber: data.contactNumber || null,
        email: data.email,
        tags: tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        studentId: user.uid,
        studentEmail: user.email,
        additionalRequirements: data.additionalRequirements || '',
        preferredTeacherQualification: data.preferredTeacherQualification || '',
        duration: data.duration || '',
        startDate: data.startDate || ''
      };

      // 4. Save to student's personal collection
      const studentRequestsRef = collection(db, `students/${user.uid}/requests`);
      const studentRequestDoc = await addDoc(studentRequestsRef, studyRequestData);

      // 5. Save to main studentsJob collection
      const mainRequestRef = await addDoc(collection(db, "studentsJob"), {
        ...studyRequestData,
        studentRequestId: studentRequestDoc.id
      });

      // 6. Update references
      await updateDoc(doc(db, `students/${user.uid}/requests`, studentRequestDoc.id), {
        mainRequestId: mainRequestRef.id
      });

      // 7. Update student stats
      await updateDoc(studentRef, {
        "stats.studyRequests": increment(1),
        "stats.lastPosted": new Date()
      });

      setIsSuccess(true);
      reset();
      setTags([]);
      setPreviewImage(null);
      setImageFile(null);
      setSelectedBgColor(getRandomBgColor());
      
      // Redirect to student profile after success
      setTimeout(() => navigate(`/student-profile/${user.uid}`), 2000);
    } catch (error) {
      console.error("Error posting study request:", error);
      alert(`Failed to post study request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <StudentNavbar/>
    
    <div className="job-posting-container">
      <h2>Create Your Study Request</h2>
      <p className="subtitle">Fill out this form to find the perfect tutor or educational opportunity</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="job-posting-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="studentPhoto">Profile Image (Optional)</label>
            <div className="image-upload-container">
              {previewImage ? (
                <div className="image-preview">
                  <img src={previewImage} alt="Student preview" />
                  <button 
                    type="button" 
                    onClick={() => {
                      setPreviewImage(null);
                      setImageFile(null);
                    }}
                    className="remove-image-btn"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="upload-label">
                  <input
                    id="studentPhoto"
                    type="file"
                    accept="image/*"
                    {...register('studentPhoto')}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-placeholder">
                    <span>+</span>
                    <p>Click to upload profile image</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="studentName">Your Name*</label>
            <input
              id="studentName"
              type="text"
              {...register('studentName', { required: 'Your name is required' })}
              placeholder="Enter your full name"
            />
            {errors.studentName && <span className="error">{errors.studentName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studyLevel">Your Education Level*</label>
            <select
              id="studyLevel"
              {...register('studyLevel', { required: 'Education level is required' })}
            >
              <option value="">Select your current education level</option>
              {studyLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.studyLevel && <span className="error">{errors.studyLevel.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="studyType">Type of Help Needed*</label>
            <select
              id="studyType"
              {...register('studyType', { required: 'Study type is required' })}
            >
              <option value="">Select what you need help with</option>
              {studyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.studyType && <span className="error">{errors.studyType.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subjects">Subjects/Courses*</label>
            <input
              id="subjects"
              type="text"
              {...register('subjects', { required: 'Subjects are required' })}
              placeholder="Mathematics, Physics, English, etc. (comma separated)"
            />
            {errors.subjects && <span className="error">{errors.subjects.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Study Details</h3>
          
          <div className="form-group">
            <label htmlFor="studyMode">Preferred Learning Mode*</label>
            <div className="checkbox-group">
              {studyModes.map(mode => (
                <label key={mode} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={mode}
                    {...register('studyMode', { required: 'Learning mode is required' })}
                  />
                  {mode}
                </label>
              ))}
            </div>
            {errors.studyMode && <span className="error">Please select at least one learning mode</span>}
          </div>

          <div className="form-group">
            <label htmlFor="availability">Preferred Availability*</label>
            <select
              id="availability"
              {...register('availability', { required: 'Availability is required' })}
            >
              <option value="">Select your preferred time</option>
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.availability && <span className="error">{errors.availability.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="duration">Expected Duration</label>
            <input
              id="duration"
              type="text"
              {...register('duration')}
              placeholder="e.g., 3 months, 1 semester, ongoing"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Preferred Start Date</label>
            <input
              id="startDate"
              type="date"
              {...register('startDate')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Preferred Language*</label>
            <input
              id="language"
              type="text"
              {...register('language', { required: 'Language is required' })}
              placeholder="English, Hindi, etc. (comma separated)"
            />
            {errors.language && <span className="error">{errors.language.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Budget & Contact</h3>
          
          <div className="form-group">
            <label>Budget Option*</label>
            <div className="radio-group">
              {budgetOptions.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    value={option}
                    {...register('budgetOption', { required: 'Budget option is required' })}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.budgetOption && <span className="error">Please select a budget option</span>}
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget Amount*</label>
            <div className="price-input">
              <span className="currency-symbol">₹</span>
              <input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                {...register('budget', { 
                  required: 'Budget is required',
                  min: { value: 0, message: 'Budget must be positive' }
                })}
                placeholder="0.00"
              />
            </div>
            {errors.budget && <span className="error">{errors.budget.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location*</label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'Location is required' })}
              placeholder="City, State or Remote"
            />
            {errors.location && <span className="error">{errors.location.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="preferredTeacherQualification">Preferred Tutor Qualifications</label>
            <input
              id="preferredTeacherQualification"
              type="text"
              {...register('preferredTeacherQualification')}
              placeholder="e.g., MSc, PhD, Certified Teacher, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              type="tel"
              {...register('contactNumber', {
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              placeholder="Optional phone number"
            />
            {errors.contactNumber && <span className="error">{errors.contactNumber.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Your email address"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="form-group">
            <label htmlFor="description">Detailed Request*</label>
            <textarea
              id="description"
              rows="6"
              {...register('description', { 
                required: 'Description is required',
                minLength: {
                  value: 50,
                  message: 'Description should be at least 50 characters'
                }
              })}
              placeholder="Describe what you're looking for in detail, your learning goals, specific topics you need help with, etc."
            ></textarea>
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="additionalRequirements">Additional Requirements</label>
            <textarea
              id="additionalRequirements"
              rows="3"
              {...register('additionalRequirements')}
              placeholder="Any special requirements (e.g., female tutor, specific teaching style, etc.)"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Card Background Color</label>
            <div className="color-options">
              {bgColors.map(color => (
                <label key={color.name} className="color-option">
                  <input
                    type="radio"
                    name="bgColor"
                    value={color.name}
                    checked={selectedBgColor.name === color.name}
                    onChange={() => setSelectedBgColor(color)}
                  />
                  <span 
                    className={`color-preview ${color.name}`}
                    title={color.display}
                  ></span>
                  <span className="color-name">{color.display}</span>
                </label>
              ))}
            </div>
            <div className="selected-color-display">
              <strong>Selected Color:</strong>
              <span className={`color-preview ${selectedBgColor.name}`}></span>
              <span>{selectedBgColor.display}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="customTag">Tags</label>
            <div className="tags-input">
              <input
                id="customTag"
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add tags (e.g., CBSE, IIT-JEE, NEET, Python, Calculus)"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              />
              <button type="button" onClick={handleTagAdd} className="add-tag-btn">
                Add
              </button>
            </div>
            <div className="tags-container">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="remove-tag">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => {
            reset();
            setTags([]);
            setPreviewImage(null);
            setImageFile(null);
            setSelectedBgColor(getRandomBgColor());
          }} className="reset-btn">
            Reset
          </button>
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Posting Request...' : 'Post Study Request'}
          </button>
        </div>

        {isSuccess && (
          <div className="success-message">
            Your study request has been posted successfully! Redirecting to your profile...
          </div>
        )}
      </form>
    </div>
    </>
  );
};

export default PostJobForStudying;