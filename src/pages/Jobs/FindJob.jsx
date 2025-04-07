import React from 'react'
import JobsCard from "../../components/Jobs/StudentJobCard";
import JobSearchBar from '../../components/Jobs/JobSearchBar'
import { MdFilterList } from "react-icons/md";
import "../../assets/css/FindJob.css";
import JobsSearchBarFilter from '../../components/Jobs/JobsSearchBarFilter'

const FindJob = () => {
  return (
    <div>
      <nav>
      <JobSearchBar /> 
      </nav>
    <main className='Hero-section'>
      <aside className="job-filter-parent">
      <div className="ads-card-parent">
          <div className="ads-card">
            <p>Turn Your Skills into Success – Get Hired as a Tutor Now! </p>
            <button className='btn'>Get Hired</button>
          </div>
        </div>
      <JobsSearchBarFilter />
      </aside>
      <div className="right-side">
            <div className="title-sort-by-parent">
              <h2>Jobs Result <span>386</span></h2>
        
              <div className="sort-by-parent">
                <p>Sort by: <strong>Last updated</strong></p>
                <div className="sort-icon"><MdFilterList size={22} /></div>
              </div>
            </div>
      <JobsCard />
      </div>
      
    </main>


    </div>
  )
}

export default FindJob
