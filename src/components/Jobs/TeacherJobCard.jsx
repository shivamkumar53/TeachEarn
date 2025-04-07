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

const TeacherJobCard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: [],
    teachingMode: [],
    language: [],
    location: [],
    price: [],
    qualification: []
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    subject: true,
    teachingMode: true,
    language: true,
    location: true,
    price: true,
    qualification: true
  });
  const [sortOption, setSortOption] = useState("recent");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    subject: [],
    teachingMode: [],
    language: [],
    location: [],
    qualification: [],
    price: ['Under ₹2000', '₹2000-₹4000', '₹4000-₹6000', '₹6000-₹8000', '₹8000+']
  });

  // Sort options configuration
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "1week", label: "Last Week" },
    { value: "2week", label: "Last 2 Weeks" },
    { value: "1month", label: "Last Month" },
    { value: "highestPrice", label: "Highest Price" },
    { value: "lowestPrice", label: "Lowest Price" }
  ];

  // Extract unique values for each filter category from job data
  const extractFilterOptions = (jobs) => {
    const options = {
      subject: [],
      teachingMode: [],
      language: [],
      location: [],
      qualification: []
    };

    jobs.forEach(job => {
      if (job.subject && !options.subject.includes(job.subject)) {
        options.subject.push(job.subject);
      }
      if (job.teachingMode && !options.teachingMode.includes(job.teachingMode)) {
        options.teachingMode.push(job.teachingMode);
      }
      if (job.language && !options.language.includes(job.language)) {
        options.language.push(job.language);
      }
      if (job.location && !options.location.includes(job.location)) {
        options.location.push(job.location);
      }
      if (job.qualification && !options.qualification.includes(job.qualification)) {
        options.qualification.push(job.qualification);
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

    // Calculate time ranges for sorting
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
    if (timeConstraint && !["highestPrice", "lowestPrice"].includes(sortOption)) {
      q = query(
        collection(db, "teachersJob"),
        orderBy("createdAt", "desc"),
        where("createdAt", ">=", timeConstraint)
      );
    } else {
      q = query(
        collection(db, "teachersJob"),
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

  // Helper function to extract numeric price from string
  const extractNumericPrice = (priceStr) => {
    if (!priceStr) return 0;

    // Remove all non-numeric characters except decimal point
    const numericStr = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(numericStr) || 0;
  };

  const getCountForOption = (filterType, option) => {
    return jobData.filter(job => job[filterType] === option).length;
  };

  const getCountForPriceRange = (range) => {
    return jobData.filter(job => {
      const price = extractNumericPrice(job.price);
      switch (range) {
        case 'Under ₹2000':
          return price < 2000;
        case '₹2000-₹4000':
          return price >= 2000 && price <= 4000;
        case '₹4000-₹6000':
          return price > 4000 && price <= 6000;
        case '₹6000-₹8000':
          return price > 6000 && price <= 8000;
        case '₹8000+':
          return price > 8000;
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
    const price = extractNumericPrice(job.price);
    const priceFilters = {
      'Under ₹2000': price < 2000,
      '₹2000-₹4000': price >= 2000 && price <= 4000,
      '₹4000-₹6000': price > 4000 && price <= 6000,
      '₹6000-₹8000': price > 6000 && price <= 8000,
      '₹8000+': price > 8000
    };

    return (
      (filters.subject.length === 0 || filters.subject.includes(job.subject)) &&
      (filters.teachingMode.length === 0 || filters.teachingMode.includes(job.teachingMode)) &&
      (filters.language.length === 0 || filters.language.includes(job.language)) &&
      (filters.location.length === 0 || filters.location.includes(job.location)) &&
      (filters.qualification.length === 0 || filters.qualification.includes(job.qualification)) &&
      (filters.price.length === 0 || filters.price.some(range => priceFilters[range]))
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const priceA = extractNumericPrice(a.price);
    const priceB = extractNumericPrice(b.price);

    if (sortOption === "highestPrice") {
      return priceB - priceA;
    } else if (sortOption === "lowestPrice") {
      return priceA - priceB;
    }
    return 0;
  });

  const clearFilters = () => {
    setFilters({
      subject: [],
      teachingMode: [],
      language: [],
      location: [],
      price: [],
      qualification: []
    });
  };

  const handleDetailsClick = (jobId) => {
    navigate(`/teacher-job-detail/${jobId}`);
  };

  const handleSortOptionClick = (option) => {
    setSortOption(option);
    setShowSortOptions(false);
  };

  // Calculate active filter count
  const activeFilterCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  if (loading) {
    return (
      <div className="job-card-container">
        <div className="loader-container flex justify-center items-center">
          <div className="loader">
            <div className="dot"></div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="job-card-container">
      {/* Mobile filter toggle button */}
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

      {/* Filters section */}
      <div className={`filters-section ${showMobileFilters ? 'mobile-visible' : ''}`}>
        <div className="filters-header">
          <h2>Find Teaching Jobs</h2>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="clear-filters">
              Clear all
            </button>
          )}
        </div>

        {/* Subject Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('subject')}
          >
            <h3>Subject</h3>
            {expandedSections.subject ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.subject && filterOptions.subject.length > 0 && (
            <div className="filter-options">
              {filterOptions.subject.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`subject-${index}`}
                    checked={filters.subject.includes(option)}
                    onChange={() => handleFilterChange('subject', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`subject-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForOption('subject', option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teaching Mode Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('teachingMode')}
          >
            <h3>Teaching Mode</h3>
            {expandedSections.teachingMode ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.teachingMode && filterOptions.teachingMode.length > 0 && (
            <div className="filter-options">
              {filterOptions.teachingMode.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`teachingMode-${index}`}
                    checked={filters.teachingMode.includes(option)}
                    onChange={() => handleFilterChange('teachingMode', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`teachingMode-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForOption('teachingMode', option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('language')}
          >
            <h3>Language</h3>
            {expandedSections.language ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.language && filterOptions.language.length > 0 && (
            <div className="filter-options">
              {filterOptions.language.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`language-${index}`}
                    checked={filters.language.includes(option)}
                    onChange={() => handleFilterChange('language', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`language-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForOption('language', option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('location')}
          >
            <h3>Location</h3>
            {expandedSections.location ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.location && filterOptions.location.length > 0 && (
            <div className="filter-options">
              {filterOptions.location.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`location-${index}`}
                    checked={filters.location.includes(option)}
                    onChange={() => handleFilterChange('location', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`location-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForOption('location', option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('price')}
          >
            <h3>Price</h3>
            {expandedSections.price ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.price && (
            <div className="filter-options">
              {filterOptions.price.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`price-${index}`}
                    checked={filters.price.includes(option)}
                    onChange={() => handleFilterChange('price', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`price-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForPriceRange(option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Qualification Filter */}
        <div className="filter-group">
          <div
            className="filter-group-header"
            onClick={() => toggleSection('qualification')}
          >
            <h3>Qualification</h3>
            {expandedSections.qualification ? (
              <MdExpandLess className="filter-icon" />
            ) : (
              <MdExpandMore className="filter-icon" />
            )}
          </div>
          {expandedSections.qualification && filterOptions.qualification.length > 0 && (
            <div className="filter-options">
              {filterOptions.qualification.map((option, index) => (
                <div key={index} className="filter-option">
                  <input
                    type="checkbox"
                    id={`qualification-${index}`}
                    checked={filters.qualification.includes(option)}
                    onChange={() => handleFilterChange('qualification', option)}
                    className="filter-checkbox"
                  />
                  <label htmlFor={`qualification-${index}`}>{option}</label>
                  <span className="filter-count">
                    ({getCountForOption('qualification', option)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Jobs list */}
      <div className="jobs-list">
        <div className="job-post-time-filter-parent">
          <h1>Available Jobs ({sortedJobs.length})</h1>
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
                      <div className="student-name">{job.teacher}</div>
                      <div className="subject-performance">
                        <span className="subject">{job.subject} Teacher</span>
                      </div>
                      <strong className="Qualification-parent">
                        Qualification:{" "}
                        <span className="Qualification">{job.qualification}</span>
                      </strong>
                    </div>
                    <div className="student-avatar">
                      <img src={job.avatar} alt={job.teacher} />
                    </div>
                  </div>

                  <div className="job-tags">
                    {job.availability?.map((availability, index) => (
                      <div className="job-tag" key={index}>
                        {availability}
                      </div>
                    ))}
                    <div className="job-tag">{job.teachingMode}</div>
                    <div className="job-tag">{job.language}</div>
                  </div>
                </div>

                <div className="job-card-footer">
                  <div className="price-location">
                    <strong className="price">{job.price}</strong>
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
              alt="No jobs found"
              className="no-jobs-image"
            />
            <h3>No teaching jobs found</h3>
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

export default TeacherJobCard;