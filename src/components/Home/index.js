import './index.css'

import {Link} from 'react-router-dom'

import Header from '../Header'

const Home = () => (
  <div>
    <Header />
    <div className="home-box">
      <div className="b-1">
        <h1 className="main-heading">Find The Job That Fits Your Life</h1>
        <p className="des">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="bttn-1" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
