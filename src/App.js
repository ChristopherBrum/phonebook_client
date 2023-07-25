import {
  useState,
  useEffect } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate } from 'react-router-dom'

import Header from './components/Header'
import personService from './services/person'
import Notification from './components/Notification'
import Home from './components/Home'
import Add from './components/Add'
import LoginForm from './components/LoginForm'
import Contact from './components/Contact'

const App = () => {
  const [persons, setPersons] = useState([])
  const [flashMessage, setFlashMessage] = useState(null)
  const [requestSuccess, setRequestSuccess] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedPhonebookUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      personService.setToken(user.token)
    }
  }, [])

  const findPerson = (id) => persons.find(person => person.id === id)

  const deletePerson = (id) => {
    const personName = findPerson(id).name
    if (window.confirm(`Delete ${personName}?`)) {
      personService
        .destroy(id)
        .then(() => {
          const updatedPersons = persons.filter(person => person.id !== id)
          setPersons(updatedPersons)
          createFlashMessage(`${personName} has been deleted`, true)
        })
        .catch(err => {
          console.log(err)
          createFlashMessage(err.message, false)
        })
    }
  }

  const createFlashMessage = (message, success) => {
    setRequestSuccess(success)
    setFlashMessage(message)
    setTimeout(() => setFlashMessage(''), 5000)
  }


  const navItemStyling = {
    marginLeft: '24px'
  }

  const headerStyling = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const navStyling = {
    display: 'flex',
    alignItems: 'center'
  }

  const handleLogout = () => {
    createFlashMessage('successfully logged out', true)
    window.localStorage.removeItem('loggedPhonebookUser')
    setUser(null)
  }

  if (!user) {
    return (
      <Router>
        <div style={headerStyling}>
          <Header title="Phonebook" size='1'/>
        </div>

        { flashMessage && <Notification message={flashMessage} requestSuccess={requestSuccess} />}

        <LoginForm
          createFlashMessage={createFlashMessage}
          setUser={setUser}
        />

      </Router>
    )
  }

  return (
    <>
      <Router>
        <div style={headerStyling}>
          <div style={navStyling}>
            <Header title="Phonebook" size='1'/>
            <div id="nav-container">
              <Link style={navItemStyling} to="/">home</Link>
              <Link style={navItemStyling} to="/add">add</Link>
              <button style={navItemStyling} onClick={handleLogout}>logout</button>
            </div>
          </div>
          <p>logged in as {user.username}</p>
        </div>

        { flashMessage && <Notification message={flashMessage} requestSuccess={requestSuccess} />}

        <Routes>
          <Route
            path="/contacts/:id"
            element={
              user
              ? <Contact persons={persons} />
              : <Navigate replace to='/login' />
            }>
          </Route>
          <Route
            path="/add"
            element={
              <Add
                user={user}
                persons={persons}
                setPersons={setPersons}
                createFlashMessage={createFlashMessage}
              />
            }>
          </Route>
          <Route
            path='/login'
            element={
              user
              ? <Navigate replace to='/' />
              : <LoginForm
                createFlashMessage={createFlashMessage}
                setUser={setUser}
              />
            }>
          </Route>
          <Route
            path="/"
            element={
              <Home
                persons={persons}
                deletePerson={deletePerson}
              />
            }>
          </Route>
        </Routes>
      </Router>

      <div style={{
        textAlign: 'center',
        marginTop: '50px',
        borderTop: '1px solid rbg(225, 225, 225)'
      }}>
        <p>©christopherbrum.com 2023</p>
      </div>
    </>
  )
}

export default App