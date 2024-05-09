import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsItemDetails extends Component {
  state = {
    fullDetails: [],
    similarJobs: [],
    lifeDetails: [],
    skillsSet: [],
    apiStatusS: apiStatusConstants[0],
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatusS: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const mUrl = `https://apis.ccbp.in/jobs/${id}`
    const fToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${fToken}`,
      },
      method: 'GET',
    }

    const finalApi = await fetch(mUrl, options)
    console.log(finalApi)
    if (finalApi.ok === true) {
      const finalRes = await finalApi.json()
      console.log(finalRes)
      const update = {
        companyLogoUrl: finalRes.job_details.company_logo_url,
        companyWebsiteUrl: finalRes.job_details.company_website_url,
        employmentType: finalRes.job_details.employment_type,
        jobDescription: finalRes.job_details.job_description,
        id: finalRes.job_details.id,
        location: finalRes.job_details.location,
        packagePerAnnum: finalRes.job_details.package_per_annum,
        rating: finalRes.job_details.rating,
        title: finalRes.job_details.title,
      }
      const updateSimilarJobs = finalRes.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        id: eachItem.id,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      const life = {
        description: finalRes.job_details.life_at_company.description,
        imageUrl: finalRes.job_details.life_at_company.image_url,
      }
      const skills = finalRes.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))

      this.setState({
        fullDetails: update,
        similarJobs: updateSimilarJobs,
        lifeDetails: life,
        skillsSet: skills,
        apiStatusS: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusS: apiStatusConstants.failure})
    }
  }

  onResetJobDetails = () => {
    this.getDetails()
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div className="s-box">
        <h1 className="heading-1">Similar Jobs</h1>
        <div className="s-1-1">
          <ul className="sim-lis" type="none">
            {similarJobs.map(eachjobItem => (
              <li className="s-1" key={eachjobItem.id}>
                <div className="D-box">
                  <img
                    src={eachjobItem.companyLogoUrl}
                    alt="similar job company logo"
                    className="img-l"
                  />
                  <div className="l">
                    <h1 className="head">{eachjobItem.title}</h1>
                    <div className="rating-box-1">
                      <FaStar className="star" />
                      <p className="rating">{eachjobItem.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="s-des">
                  <h1 className="s-heading">Description</h1>
                  <p className="des-s">{eachjobItem.jobDescription}</p>
                  <div className="oc-1">
                    <div className="full">
                      <MdLocationOn className="loc-logo" />
                      <p className="loc">{eachjobItem.location}</p>
                    </div>
                    <div className="full">
                      <MdWork className="loc-logo" />
                      <p className="loc">{eachjobItem.employmentType}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderSkills = () => {
    const {skillsSet, lifeDetails} = this.state
    return (
      <div className="Skills-set">
        <h1 className="details-heading">Skills</h1>
        <ul className="skills-list" type="none">
          {skillsSet.map(eachItem => (
            <li className="lis-1" key={eachItem.name}>
              <img src={eachItem.imageUrl} alt="name" className="skills-img" />
              <p className="ski-des">{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <h2 className="details-heading">Life at Company</h2>
        <div className="life">
          <p className="des-1">{lifeDetails.description}</p>
          <img
            src={lifeDetails.imageUrl}
            alt="life at company"
            className="life-img"
          />
        </div>
      </div>
    )
  }

  renderDetails = () => {
    const {fullDetails, skillsSet, lifeDetails} = this.state
    console.log(skillsSet)
    console.log(lifeDetails)
    return (
      <div className="main">
        <Header />
        <div className="main-1">
          <div className="j-box">
            <div className="D-box">
              <img
                src={fullDetails.companyLogoUrl}
                alt="job details company logo"
                className="img-l"
              />
              <div className="l">
                <h1 className="head">{fullDetails.title}</h1>
                <div className="rating-box-1">
                  <FaStar className="star" />
                  <p className="rating">{fullDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-1">
              <div className="oc-1">
                <div className="full">
                  <MdLocationOn className="loc-logo" />
                  <p className="loc">{fullDetails.location}</p>
                </div>
                <div className="full">
                  <MdWork className="loc-logo" />
                  <p className="loc">{fullDetails.employmentType}</p>
                </div>
              </div>
              <p className="rate">{fullDetails.packagePerAnnum}</p>
            </div>
            <hr />
            <div className="details-box">
              <div className="h-box">
                <h1 className="details-heading">Description</h1>
                <div className="h-link-box">
                  <a href={fullDetails.companyWebsiteUrl} className="h-link">
                    Visit
                  </a>
                  <FiExternalLink className="h-link" />
                </div>
              </div>
              <p className="des-1">{fullDetails.jobDescription}</p>
            </div>
            {this.renderSkills()}
          </div>

          {this.renderSimilarJobs()}
        </div>
      </div>
    )
  }

  renderLoaderS = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#6366f1" height="50" width="50" />
    </div>
  )

  renderSimilarFailure = () => (
    <div>
      <Header />
      <div className="fail-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="fail-img"
        />
        <h1 className="fail-heading">Oops! Something Went Wrong</h1>
        <p className="fail-des">
          We cannot seem to find the page you are looking for.
        </p>
        <button
          className="bttn-1"
          type="button"
          onClick={this.onResetJobDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  render() {
    const {apiStatusS} = this.state
    switch (apiStatusS) {
      case apiStatusConstants.success:
        return this.renderDetails()
      case apiStatusConstants.failure:
        return this.renderSimilarFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoaderS()
      default:
        return null
    }
  }
}

export default JobsItemDetails
