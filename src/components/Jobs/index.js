import './index.css'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  fail: 'FAIL',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants[0],
    apiJobStatus: apiStatusConstants[0],
    profile: [],
    searchValue: '',
    check1: [],
    check2: '',
    jobItemDetails: [],
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobItem()
  }

  getProfileApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const profileToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${profileToken}`,
      },
      method: 'GET',
    }
    const res = await fetch(url, options)

    if (res.ok === true) {
      const data = await res.json()

      const update = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profile: update, apiStatus: apiStatusConstants.success})
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobItem = async () => {
    const {searchValue, check1, check2} = this.state
    this.setState({apiJobStatus: apiStatusConstants.inProgress})
    console.log(searchValue)
    const jwtjobToken = Cookies.get('jwt_token')
    const jobType = check1.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${jobType}&minimum_package=${check2}&search=${searchValue}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtjobToken}`,
      },
      method: 'GET',
    }

    const jobData = await fetch(url, options)
    console.log(jobData)
    const res = await jobData.json()
    if (jobData.ok === true) {
      const updateJobData = res.jobs.map(eachItem => ({
        companylogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobItemDetails: updateJobData,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  onSearch = event => {
    this.setState({searchValue: event.target.value})
  }

  searchbutn = () => {
    this.getJobItem()
  }

  onEntersearch = event => {
    if (event.key === 'Enter') {
      this.getJobItem()
    }
  }

  onReset = () => {
    this.setState({searchValue: '', check1: [], check2: ''}, this.getJobItem)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00000" height="50" width="50" />
    </div>
  )

  onprofileReset = () => {
    this.getProfileApi()
  }

  renderFailure = () => (
    <div className="failure">
      <button className="bttn" type="button" onClick={this.onprofileReset}>
        Retry
      </button>
    </div>
  )

  onClik1 = event => {
    const {check1} = this.state

    if (check1.includes(event.target.id)) {
      const upd = check1.filter(each => each !== event.target.id)
      console.log(upd)
      this.setState({check1: upd}, this.getJobItem)
    } else {
      this.setState(
        prevState => ({
          check1: [...prevState.check1, event.target.id],
        }),
        this.getJobItem,
      )
    }
  }

  onSalary = event => {
    const isCheck1 = event.target.checked
    if (isCheck1 === true) {
      this.setState({check2: event.target.value}, this.getJobItem)
    } else {
      this.setState({check2: ''}, this.getJobItem)
    }
  }

  renderProfileBox = () => {
    const {profile} = this.state

    return (
      <>
        <div>
          <div className="profile-box">
            <img
              src={profile.profileImageUrl}
              alt="profile"
              className="pro-img"
              key={profile.name}
            />
            <h1 className="title">{profile.name}</h1>
            <p className="short">{profile.shortBio}</p>
          </div>
          <hr className="line" />
          <div className="type">
            <h1 className="type-head">Type of Employment</h1>
            <ul className="list-box" type="none">
              {employmentTypesList.map(eachItem => (
                <li className="l-1" key={eachItem.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachItem.employmentTypeId}
                    value={eachItem.employmentTypeId}
                    onChange={this.onClik1}
                    key={eachItem.employmentTypeId}
                  />
                  <label htmlFor={eachItem.employmentTypeId} className="li-1">
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <hr className="line" />
          <div className="type">
            <h1 className="type-head">Salary Range</h1>
            <ul className="list-box" type="none">
              {salaryRangesList.map(eachItem => (
                <li className="l-1" key={eachItem.salaryRangeId}>
                  <input
                    type="checkbox"
                    id={eachItem.salaryRangeId}
                    value={eachItem.salaryRangeId}
                    onChange={this.onSalary}
                    key={eachItem.salaryRangeId}
                  />
                  <label htmlFor={eachItem.salaryRangeId} className="li-1">
                    {eachItem.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderSimilarFailure = () => (
    <div>
      <div className="fail-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="fail-img"
        />
        <h1 className="fail-heading">No Jobs Found</h1>
        <p className="fail-des">
          We could not find any jobs. Try other filters
        </p>
        <button className="bttn-1" type="button" onClick={this.onReset}>
          Retry
        </button>
      </div>
    </div>
  )

  renderSimilarFailure1 = () => (
    <div>
      <div className="fail-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="fail-img"
        />
        <h1 className="fail-heading">Oops! Something Went Wrong</h1>
        <p className="fail-des">
          We cannot seem to find the page you are looking for
        </p>
        <button className="bttn-1" type="button" onClick={this.onReset}>
          Retry
        </button>
      </div>
    </div>
  )

  rendervalue = () => {
    const {jobItemDetails} = this.state

    return (
      <div className="JobItem-box">
        {jobItemDetails.length > 1 ? (
          <ul className="list-job" type="none">
            {jobItemDetails.map(eachItem => (
              <Link className="link" to={`/jobs/${eachItem.id}`}>
                <div className="p-main">
                  <div className="p-1">
                    <img
                      src={eachItem.companylogoUrl}
                      alt="company logo"
                      className="img"
                    />
                    <div>
                      <h1 className="title">{eachItem.title}</h1>
                      <div className="rating-box">
                        <FaStar className="star" />
                        <p className="rating">{eachItem.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="location">
                    <div className="s-loc">
                      <div className="full">
                        <MdLocationOn className="loc-logo" />
                        <p className="loc">{eachItem.location}</p>
                      </div>
                      <div className="full">
                        <MdWork className="loc-logo" />
                        <p className="loc">{eachItem.employmentType}</p>
                      </div>
                    </div>
                    <p className="sal">{eachItem.packagePerAnnum}</p>
                  </div>
                  <hr className="line-1" />
                  <div className="des-box">
                    <h1 className="des-title">Description</h1>
                    <p className="des">{eachItem.jobDescription}</p>
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <div>{this.renderSimilarFailure()}</div>
        )}
      </div>
    )
  }

  renderListJob = () => {
    const {searchValue} = this.state
    return (
      <>
        <div className="search">
          <input
            type="search"
            className="search-box"
            value={searchValue}
            placeholder="Search"
            onChange={this.onSearch}
            onKeyDown={this.onEntersearch}
          />
          <button
            type="button"
            data-testid="searchButton"
            className="search-bttn"
            onClick={this.searchbutn}
          >
            O
          </button>
        </div>
      </>
    )
  }

  renderSwitchProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileBox()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobItemSwitch = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.rendervalue()
      case apiStatusConstants.failure:
        return this.renderSimilarFailure1()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-container">
        <Header />
        <div className="row-box">
          {this.renderSwitchProfile()}
          <div className="job-container">
            {this.renderListJob()}
            {this.renderJobItemSwitch()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
