import './index.css'

import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {IoMdHome} from 'react-icons/io'

import {IoBag} from 'react-icons/io5'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header-box">
      <Link to="/">
        <button className="bt" type="button">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-1"
          />
        </button>
      </Link>
      <ul className="head-list" type="none">
        <Link to="/" className="link">
          <li className="l-1">Home</li>
        </Link>
        <Link to="/jobs" className="link">
          <li className="l-1">Jobs</li>
        </Link>
      </ul>

      <button className="bttn" type="button" onClick={onLogout}>
        Logout
      </button>

      <ul type="none" className="icon-box">
        <Link to="/" className="link">
          <li>
            <IoMdHome className="l-1" />
          </li>
        </Link>
        <Link to="/jobs" className="link">
          <li>
            <IoBag className="l-1" />
          </li>
        </Link>
        <button className="btt" type="button" onClick={onLogout}>
          logout
        </button>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
