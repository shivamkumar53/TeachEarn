import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/PostJob.css";
import TeacherNavbar from '../../components/TeacherNavbar';

// Background color options matching TeacherJobCard
const bgColors = [
  { name: 'teacher-card-orange', display: 'Orange' },
  { name: 'teacher-card-green', display: 'Green' },
  { name: 'teacher-card-purple', display: 'Purple' },
  { name: 'teacher-card-blue', display: 'Blue' },
  { name: 'teacher-card-gray', display: 'Gray' },
  { name: 'teacher-card-indigo', display: 'Indigo' }
];

const PostJobForTeaching = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedBgColor, setSelectedBgColor] = useState(bgColors[0]);
  const navigate = useNavigate();

  const employmentTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship'
  ];

  const teachingModes = [
    'Online',
    'In-person',
    'Hybrid'
  ];

  const teachingContexts = [
    'Coaching Institute',
    'School',
    'University',
    'Private Tutor',
    'Corporate Trainer',
    'Other'
  ];

  const experienceLevels = [
    'Beginner (1-3 years)',
    'Intermediate (4-6 years)',
    'Advanced (7-10 years)',
    'Expert (10+ years)'
  ];

  const pricingOptions = [
    'Per hour',
    'Per session',
    'Per month',
    'Per course',
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
    const storageRef = ref(storage, `teacher-jobs/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const ensureTeacherExists = async (userId, userEmail) => {
    const teacherRef = doc(db, "teachers", userId);
    await setDoc(teacherRef, {
      basicInfo: {
        email: userEmail,
        createdAt: new Date(),
        status: "active"
      },
      stats: {
        jobPosts: 0,
        lastPosted: null
      }
    }, { merge: true });
    return teacherRef;
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
        throw new Error("You must be logged in as a teacher to post jobs");
      }

      // 1. Ensure teacher document exists
      const teacherRef = await ensureTeacherExists(user.uid, user.email);

      // 2. Upload image if exists
      const imageUrl = imageFile ? await uploadImage(imageFile) : null;

      // 3. Prepare job data matching TeacherJobCard structure
      const jobData = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        teacher: data.yourName,
        avatar: imageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg', // Default avatar if none provided
        subject: data.subject,
        qualification: data.qualification,
        experience: data.experience,
        rating: "4.5", // Default rating for new teachers
        studentsTaught: "0", // Will be updated after first students
        specialization: data.specialization,
        description: data.description,
        price: `₹${data.price}/${data.pricingOption.replace('Per ', '').toLowerCase()}`,
        location: data.location,
        availability: data.availability.split(',').map(item => item.trim()),
        teachingMode: data.teachingMode,
        language: data.language.split(',').map(item => item.trim()).join(', '),
        bgColor: selectedBgColor.name,
        teachingContext: data.teachingContext,
        employmentType: data.employmentType,
        contactNumber: data.contactNumber || null,
        email: data.email,
        tags: tags,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        teacherId: user.uid,
        teacherEmail: user.email
      };

      // 4. Save to teacher's personal collection
      const teacherJobsRef = collection(db, `teachers/${user.uid}/jobs`);
      const teacherJobDoc = await addDoc(teacherJobsRef, jobData);

      // 5. Save to main teachersJob collection
      const mainJobRef = await addDoc(collection(db, "teachersJob"), {
        ...jobData,
        teacherJobId: teacherJobDoc.id
      });

      // 6. Update references
      await updateDoc(doc(db, `teachers/${user.uid}/jobs`, teacherJobDoc.id), {
        mainJobId: mainJobRef.id
      });

      // 7. Update teacher stats
      await updateDoc(teacherRef, {
        "stats.jobPosts": increment(1),
        "stats.lastPosted": new Date()
      });

      setIsSuccess(true);
      reset();
      setTags([]);
      setPreviewImage(null);
      setImageFile(null);
      setSelectedBgColor(getRandomBgColor());
      
      // Redirect to teacher profile after success instead of dashboard
      setTimeout(() => navigate(`/teacher-profile/${user.uid}`), 2000);
    } catch (error) {
      console.error("Error posting job:", error);
      alert(`Failed to post job: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <TeacherNavbar/>
    
    <div className="job-posting-container">
      <h2>Create Your Teacher Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="job-posting-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="tutorLogo">Profile Image</label>
            <div className="image-upload-container">
              {previewImage ? (
                <div className="image-preview">
                  <img src={previewImage} alt="Teacher preview" />
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
                    id="tutorLogo"
                    type="file"
                    accept="image/*"
                    {...register('tutorLogo')}
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
            <label htmlFor="yourName">Your Name*</label>
            <input
              id="yourName"
              type="text"
              {...register('yourName', { required: 'Your name is required' })}
              placeholder="Enter your full name"
            />
            {errors.yourName && <span className="error">{errors.yourName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject You Teach*</label>
            <input
              id="subject"
              type="text"
              {...register('subject', { required: 'Subject is required' })}
              placeholder="Mathematics, Physics, English, etc."
            />
            {errors.subject && <span className="error">{errors.subject.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="qualification">Your Qualification*</label>
            <input
              id="qualification"
              type="text"
              {...register('qualification', { required: 'Qualification is required' })}
              placeholder="PhD, MSc, BEd, etc."
            />
            {errors.qualification && <span className="error">{errors.qualification.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization*</label>
            <input
              id="specialization"
              type="text"
              {...register('specialization', { required: 'Specialization is required' })}
              placeholder="Algebra, Quantum Physics, Literature, etc."
            />
            {errors.specialization && <span className="error">{errors.specialization.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Teaching Details</h3>
          
          <div className="form-group">
            <label htmlFor="teachingContext">Teaching Context*</label>
            <select
              id="teachingContext"
              {...register('teachingContext', { required: 'Teaching context is required' })}
            >
              <option value="">Select where you teach</option>
              {teachingContexts.map(context => (
                <option key={context} value={context}>{context}</option>
              ))}
            </select>
            {errors.teachingContext && <span className="error">{errors.teachingContext.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience Level*</label>
            <select
              id="experience"
              {...register('experience', { required: 'Experience is required' })}
            >
              <option value="">Select your experience level</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.experience && <span className="error">{errors.experience.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="teachingMode">Teaching Mode*</label>
            <div className="checkbox-group">
              {teachingModes.map(mode => (
                <label key={mode} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={mode}
                    {...register('teachingMode', { required: 'Teaching mode is required' })}
                  />
                  {mode}
                </label>
              ))}
            </div>
            {errors.teachingMode && <span className="error">Please select at least one teaching mode</span>}
          </div>

          <div className="form-group">
            <label htmlFor="language">Languages You Teach In*</label>
            <input
              id="language"
              type="text"
              {...register('language', { required: 'Language is required' })}
              placeholder="English, Hindi, etc. (comma separated)"
            />
            {errors.language && <span className="error">{errors.language.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability*</label>
            <textarea
              id="availability"
              {...register('availability', { required: 'Availability is required' })}
              placeholder="Monday-Friday 4-6pm, Saturday mornings, etc."
              rows="3"
            />
            {errors.availability && <span className="error">{errors.availability.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing & Contact</h3>
          
          <div className="form-group">
            <label>Employment Type*</label>
            <div className="checkbox-group">
              {employmentTypes.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={type}
                    {...register('employmentType', { required: 'At least one employment type is required' })}
                  />
                  {type}
                </label>
              ))}
            </div>
            {errors.employmentType && <span className="error">Please select at least one employment type</span>}
          </div>

          <div className="form-group">
            <label>Pricing Option*</label>
            <div className="radio-group">
              {pricingOptions.map(option => (
                <label key={option} className="radio-label">
                  <input
                    type="radio"
                    value={option}
                    {...register('pricingOption', { required: 'Pricing option is required' })}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.pricingOption && <span className="error">Please select a pricing option</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price*</label>
            <div className="price-input">
              <span className="currency-symbol">₹</span>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                placeholder="0.00"
              />
            </div>
            {errors.price && <span className="error">{errors.price.message}</span>}
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
            <label htmlFor="description">Teaching Description*</label>
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
              placeholder="Describe your teaching approach, methodology, and what students can expect..."
            ></textarea>
            {errors.description && <span className="error">{errors.description.message}</span>}
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
                placeholder="Add tags (e.g., CBSE, IIT-JEE, NEET)"
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
            {isSubmitting ? 'Creating Profile...' : 'Create Teacher Profile'}
          </button>
        </div>

        {isSuccess && (
          <div className="success-message">
            Your teacher profile has been created successfully! Redirecting to your profile...
          </div>
        )}
      </form>
    </div>
    </>
  );
};

export default PostJobForTeaching;