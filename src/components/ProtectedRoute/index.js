import {Redirect, Route} from 'react-router-dom'

import Cookies from 'js-cookie'

const ProtectedRoute = props => {
  console.log(props)
  const webToken = Cookies.get('jwt_token')

  if (webToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProtectedRoute
