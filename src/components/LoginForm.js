import { useState } from 'react'
import loginService from '../services/login'
import personService from '../services/person'
// import PropTypes from 'prop-types'

const LoginForm = ({ createFlashMessage, setUser }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))
      createFlashMessage('Log in successful', true)
      personService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      createFlashMessage('Wrong credentials', false)
    }
  }

  const styling = {
    backgroundColor: '#E5FFCC',
    width: '250px',
    padding: '0 30px 20px',
    margin: '10px',
    borderLeft: '1px solid black',
    border: '1px solid black',
    borderRadius: '3px',
  }

  return (
    <div style={styling}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username:
          <input
            id='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password:
          <input
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

// LoginForm.propTypes = {
  // handleSubmit: PropTypes.func.isRequired,
  // handleUsernameChange: PropTypes.func.isRequired,
  // handlePasswordChange: PropTypes.func.isRequired,
  // username: PropTypes.string.isRequired,
  // password: PropTypes.string.isRequired,
// }

export default LoginForm