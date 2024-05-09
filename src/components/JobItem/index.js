import './index.css'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {FaStar} from 'react-icons/fa'

import {MdLocationOn, MdWork} from 'react-icons/md'

import {Link} from 'react-router-dom'

class JobItem extends Component {
  state = {jobItemDetails: [], value: ''}

  componentDidMount() {
    this.getJobItem()
    this.renderValue()
  }

  getJobItem = async () => {
    const {value} = this.state
    const jwtjobToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search=${value}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtjobToken}`,
      },
      method: 'GET',
    }

    const jobData = await fetch(url, options)

    if (jobData.ok === true) {
      const res = await jobData.json()
      console.log(res.jobs[0])
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
      this.setState({jobItemDetails: updateJobData})
    }
  }

  renderValue = () => {
    const {searchValue} = this.props
    this.setState({value: searchValue}, this.getJobItem)
    console.log(searchValue)
  }

  rendervalue = () => {
    const {jobItemDetails} = this.state

    return (
      <div className="JobItem-box">
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
                  <div className="full">
                    <MdLocationOn className="loc-logo" />
                    <p className="loc">{eachItem.location}</p>
                  </div>
                  <div className="full">
                    <MdWork className="loc-logo" />
                    <p className="loc">{eachItem.employmentType}</p>
                  </div>
                </div>
                <hr className="line-1" />
                <div className="des-box">
                  <p className="des-title">Description</p>
                  <p className="des">{eachItem.jobDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return <div>{this.rendervalue()}</div>
  }
}

export default JobItem
