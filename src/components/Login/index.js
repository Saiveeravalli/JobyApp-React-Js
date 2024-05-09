import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', err: ''}

  onSuccess = token => {
    console.log(token)
    Cookies.set('jwt_token', token, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({err: errorMsg})
  }

  onchangePassword = event => {
    this.setState({password: event.target.value})
  }

  onchangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const data = await fetch(url, options)
    const res = await data.json()
    if (data.ok === true) {
      this.onSuccess(res.jwt_token)
    } else {
      this.onFailure(res.error_msg)
    }
  }

  render() {
    const {username, err} = this.state
    console.log(username)
    const tken = Cookies.get('jwt_token')
    if (tken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-box">
        <div className="log-box">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form className="form-box" onSubmit={this.onSubmitLogin}>
            <div className="user">
              <label htmlFor="username" className="name">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="input"
                placeholder="Username"
                onChange={this.onchangeUsername}
              />
            </div>
            <div className="user">
              <label htmlFor="password" className="name">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Password"
                onChange={this.onchangePassword}
              />
            </div>
            <button className="bttn-2" type="submit">
              Login
            </button>
            <p className="ermsg">{err}</p>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
