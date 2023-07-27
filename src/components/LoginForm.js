import { useState } from 'react'
import loginService from '../services/login'
import personService from '../services/person'
import { Form, Button } from 'react-bootstrap'

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
      createFlashMessage(`Welcome, ${user.username}`, 'success')
      personService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      createFlashMessage('Wrong credentials', 'danger')
    }
  }

  const styling = {
    width: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '100px'
  }

  const buttonStyling = {
    marginTop: '20px',
    width: '100%'
  }

  return (
    <div style={styling}>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            id='username'
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
          <Form.Label>password:</Form.Label>
          <Form.Control
            id='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <Button
            style={buttonStyling}
            id='login-button'
            variant='primary'
            type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
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