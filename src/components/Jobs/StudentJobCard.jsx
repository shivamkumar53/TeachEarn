import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, onSnapshot, orderBy, where, Timestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../../assets/css/JobCard.css";
import {
  MdBookmark,
  MdBookmarkBorder,
  MdFilterList,
  MdClose,
  MdExpandMore,
  MdExpandLess
} from "react-icons/md";
import { BsSliders } from "react-icons/bs";

const StudentJobCard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: [],
    Class: [],
    teachingMode: [],
    language: [],
    location: [],
    budget: []
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    subject: true,
    Class: true,
    teachingMode: true,
    language: true,
    location: true,
    budget: true
  });
  const [sortOption, setSortOption] = useState("recent");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    subject: [],
    Class: [],
    teachingMode: [],
    language: [],
    location: [],
    budget: ['Under ₹2000', '₹2000-₹4000', '₹4000-₹6000', '₹6000-₹8000', '₹8000+']
  });

  // Sort options configuration
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "1week", label: "Last Week" },
    { value: "2week", label: "Last 2 Weeks" },
    { value: "1month", label: "Last Month" },
    { value: "highestBudget", label: "Highest Budget" },
    { value: "lowestBudget", label: "Lowest Budget" }
  ];

  // Extract unique values for each filter category from job data
  const extractFilterOptions = (jobs) => {
    const options = {
      subject: [],
      Class: [],
      teachingMode: [],
      language: [],
      location: []
    };

    jobs.forEach(job => {
      // Handle subjects (could be array or string)
      if (job.subjects) {
        if (Array.isArray(job.subjects)) {
          job.subjects.forEach(subject => {
            if (subject && !options.subject.includes(subject)) {
              options.subject.push(subject);
            }
          });
        } else if (!options.subject.includes(job.subjects)) {
          options.subject.push(job.subjects);
        }
      }

      // Handle Class/studyLevel
      const classValue = job.Class || job.studyLevel;
      if (classValue && !options.Class.includes(classValue)) {
        options.Class.push(classValue);
      }

      // Handle teachingMode/studyMode
      const teachingModeValue = job.teachingMode || job.studyMode;
      if (teachingModeValue && !options.teachingMode.includes(teachingModeValue)) {
        options.teachingMode.push(teachingModeValue);
      }

      // Handle language
      if (job.language && !options.language.includes(job.language)) {
        options.language.push(job.language);
      }

      // Handle location
      if (job.location && !options.location.includes(job.location)) {
        options.location.push(job.location);
      }
    });

    // Sort each category alphabetically
    Object.keys(options).forEach(key => {
      options[key].sort();
    });

    return options;
  };

  // Fetch jobs from Firestore in real-time
  useEffect(() => {
    setLoading(true);

    const now = Timestamp.now();
    let timeConstraint;

    switch (sortOption) {
      case "24h":
        timeConstraint = Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
        break;
      case "1week":
        timeConstraint = Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "2week":
        timeConstraint = Timestamp.fromMillis(now.toMillis() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "1month":
        timeConstraint = Timestamp.fromMillis(now.toMillis() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        timeConstraint = null;
    }

    let q;
    if (timeConstraint && !["highestBudget", "lowestBudget"].includes(sortOption)) {
      q = query(
        collection(db, "studentsJob"),
        orderBy("createdAt", "desc"),
        where("createdAt", ">=", timeConstraint)
      );
    } else {
      q = query(
        collection(db, "studentsJob"),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const jobs = [];
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      setJobData(jobs);

      // Extract filter options from the job data
      const extractedOptions = extractFilterOptions(jobs);
      setFilterOptions(prev => ({
        ...prev,
        ...extractedOptions
      }));
      setLoading(false);
      
    }, (error) => {
      console.error("Error fetching jobs: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortOption]);

  // Fetch saved jobs for current user
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const savedJobsRef = doc(db, "savedJobs", user.uid);
        const docSnap = await getDoc(savedJobsRef);
        if (docSnap.exists()) {
          setSavedJobs(docSnap.data().jobs || []);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, [auth.currentUser]);

  // Helper function to extract numeric budget from string
  const extractNumericBudget = (budgetStr) => {
    if (!budgetStr) return 0;

    // Remove all non-numeric characters except decimal point
    const numericStr = budgetStr.replace(/[^0-9.]/g, '');
    return parseFloat(numericStr) || 0;
  };

  const getCountForOption = (filterType, option) => {
    return jobData.filter(job => {
      if (filterType === 'subject') {
        const jobSubjects = Array.isArray(job.subjects) ? job.subjects : [job.subjects];
        return jobSubjects.includes(option);
      } else if (filterType === 'Class') {
        const jobClass = job.Class || job.studyLevel;
        return jobClass === option;
      } else if (filterType === 'teachingMode') {
        const jobTeachingMode = job.teachingMode || job.studyMode;
        return jobTeachingMode === option;
      }
      return job[filterType] === option;
    }).length;
  };

  const getCountForBudgetRange = (range) => {
    return jobData.filter(job => {
      const budget = extractNumericBudget(job.budget);
      switch (range) {
        case 'Under ₹2000':
          return budget < 2000;
        case '₹2000-₹4000':
          return budget >= 2000 && budget <= 4000;
        case '₹4000-₹6000':
          return budget > 4000 && budget <= 6000;
        case '₹6000-₹8000':
          return budget > 6000 && budget <= 8000;
        case '₹8000+':
          return budget > 8000;
        default:
          return false;
      }
    }).length;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSaveJob = async (jobId) => {
    if (saving) return;
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to save jobs");
        navigate('/login');
        return;
      }

      const savedJobsRef = doc(db, "savedJobs", user.uid);
      let updatedSavedJobs = [...savedJobs];

      const jobIndex = updatedSavedJobs.indexOf(jobId);
      if (jobIndex > -1) {
        updatedSavedJobs.splice(jobIndex, 1);
      } else {
        updatedSavedJobs.push(jobId);
      }

      await setDoc(savedJobsRef, { jobs: updatedSavedJobs });
      setSavedJobs(updatedSavedJobs);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to update saved jobs");
    } finally {
      setSaving(false);
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };

  const filteredJobs = jobData.filter(job => {
    const budget = extractNumericBudget(job.budget);
    const budgetFilters = {
      'Under ₹2000': budget < 2000,
      '₹2000-₹4000': budget >= 2000 && budget <= 4000,
      '₹4000-₹6000': budget > 4000 && budget <= 6000,
      '₹6000-₹8000': budget > 6000 && budget <= 8000,
      '₹8000+': budget > 8000
    };

    const jobClass = job.Class || job.studyLevel;
    const jobTeachingMode = job.teachingMode || job.studyMode;
    const jobSubjects = Array.isArray(job.subjects) ? job.subjects : [job.subjects];

    return (
      (filters.subject.length === 0 ||
        filters.subject.some(subj => jobSubjects.includes(subj))) &&
      (filters.Class.length === 0 || filters.Class.includes(jobClass)) &&
      (filters.teachingMode.length === 0 || filters.teachingMode.includes(jobTeachingMode)) &&
      (filters.language.length === 0 || filters.language.includes(job.language)) &&
      (filters.location.length === 0 || filters.location.includes(job.location)) &&
      (filters.budget.length === 0 || filters.budget.some(range => budgetFilters[range]))
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const budgetA = extractNumericBudget(a.budget);
    const budgetB = extractNumericBudget(b.budget);

    if (sortOption === "highestBudget") {
      return budgetB - budgetA;
    } else if (sortOption === "lowestBudget") {
      return budgetA - budgetB;
    }
    return 0;
  });

  const clearFilters = () => {
    setFilters({
      subject: [],
      Class: [],
      teachingMode: [],
      language: [],
      location: [],
      budget: []
    });
  };

  const handleDetailsClick = (jobId) => {
    navigate(`/student-job-detail/${jobId}`);
  };

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  if (loading) {
    return (
        <div className="loader-container flex justify-center items-center">
          <div className="loader">
            <div className="dot"></div>
          </div>
        </div>

    );
  }

  return (
    <div className="job-card-container">
      <button
        className="mobile-filter-toggle"
        onClick={() => setShowMobileFilters(!showMobileFilters)}
      >
        {showMobileFilters ? <MdClose size={20} /> : <MdFilterList size={20} />}
        {showMobileFilters ? "Hide Filters" : "Show Filters"}
        {activeFilterCount > 0 && (
          <span className="filter-count">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className={`filters-section ${showMobileFilters ? 'mobile-visible' : ''}`}>
        <div className="filters-header">
          <h2>Find Students</h2>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear all
            </button>
          )}
        </div>

        {Object.entries(filterOptions).map(([filterType, options]) => (
          <div className="filter-group" key={filterType}>
            <div
              className="filter-group-header"
              onClick={() => toggleSection(filterType)}
            >
              <h3>
                {filterType === 'budget' ? 'Budget' :
                  filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </h3>
              {expandedSections[filterType] ? (
                <MdExpandLess className="filter-icon" />
              ) : (
                <MdExpandMore className="filter-icon" />
              )}
            </div>
            {expandedSections[filterType] && options.length > 0 && (
              <div className="filter-options">
                {options.map((option, index) => (
                  <div key={index} className="filter-option">
                    <input
                      type="checkbox"
                      id={`${filterType}-${index}`}
                      checked={filters[filterType].includes(option)}
                      onChange={() => handleFilterChange(filterType, option)}
                      className="filter-checkbox"
                    />
                    <label htmlFor={`${filterType}-${index}`}>{option}</label>
                    <span className="filter-count">
                      ({filterType === 'budget' ?
                        getCountForBudgetRange(option) :
                        getCountForOption(filterType, option)})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="jobs-list">
        <div className="job-post-time-filter-parent">
          <h1>Available Students ({sortedJobs.length})</h1>
          <div className="sort-container">
            <span>
              Sort by:{" "}
              <strong onClick={() => setShowSortOptions(!showSortOptions)}>
                {sortOptions.find(opt => opt.value === sortOption)?.label}
              </strong>{" "}
              <BsSliders onClick={() => setShowSortOptions(!showSortOptions)} />
            </span>
            {showSortOptions && (
              <div className="sort-dropdown">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-option ${sortOption === option.value ? "active" : ""}`}
                    onClick={() => handleSortOptionClick(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {sortedJobs.length > 0 ? (
          <div className="job-cards">
            {sortedJobs.map((job) => (
              <div className="job-card" key={job.id}>
                <div className={`job-card-inner ${job.bgColor || ''}`}>
                  <div className="job-card-header">
                    <div className="job-date">
                      {job.createdAt?.toDate().toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <button
                      className="save-icon"
                      onClick={() => toggleSaveJob(job.id)}
                      disabled={saving}
                      aria-label={isJobSaved(job.id) ? "Unsave job" : "Save job"}
                    >
                      {isJobSaved(job.id) ? (
                        <MdBookmark size={22} color="black" />
                      ) : (
                        <MdBookmarkBorder size={22} />
                      )}
                    </button>
                  </div>

                  <div className="student-info">
                    <div>
                      <div className="student-name">{job.studentName}</div>
                      <div className="subject-performance">
                        <span className="subject">{job.subjects}</span>
                      </div>
                      <strong className="Class-parent">
                        Class:{" "}
                        <span className="level">{job.studyLevel}</span>
                      </strong>
                    </div>
                    <div className="student-avatar">
                      <img src={job.avatar || "https://via.placeholder.com/50"} alt={job.studentName} />
                    </div>
                  </div>

                  <div className="job-tags">
                    {Array.isArray(job.availability) ? (
                      job.availability.map((availability, index) => (
                        <div className="job-tag" key={index}>{availability}</div>
                      ))
                    ) : job.availability ? (
                      <div className="job-tag">{job.availability}</div>
                    ) : null}
                    <div className="job-tag">{job.studyMode}</div>
                    <div className="job-tag">{job.language}</div>
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="price-location">
                    <strong className="price">{job.budget}</strong>
                    <span className="location">{job.location}</span>
                  </div>

                  <div className="details-button">
                    <button
                      type="button"
                      onClick={() => handleDetailsClick(job.id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs-found">
            <img
              src="https://img.icons8.com/ios/100/000000/nothing-found.png"
              alt="No students found"
              className="no-jobs-image"
            />
            <h3>No students found</h3>
            <p>
              Try adjusting your filters or clear all filters to see more results
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="clear-filters-button"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentJobCard;