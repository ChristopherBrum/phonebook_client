import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Person from './components/Person'
import Input from './components/Input'
import LoginForm from './components/LoginForm'
import PersonForm from './components/PersonForm'
import personService from './services/person'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [flashMessage, setFlashMessage] = useState(null)
  const [requestSuccess, setRequestSuccess] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [loginVisible, setLoginVisible] = useState(false)

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

  const handleNameInput = (event) => setNewName(event.target.value)
  const handleNumberInput = (event) => setNewNumber(event.target.value)
  const handleSearchInput = (event) => setNewSearch(event.target.value)

  const createPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber,
    }

    if (newName.length < 3) {
      createFlashMessage('name must be at least 3 characters long', false)
      return
    }

    if (!(/^\d{3}-\d{3}-\d{4}$/.test(newNumber)) || newNumber.length !== 12) {
      createFlashMessage('number must be formatted `xxx-xxx-xxxx`', false)
      return
    }

    if (existingPerson()) {
      if (window.confirm(`${newName} is already added to phonebook. Replace old number with new one?`)) {
        const contact = findPersonByName()
        updateUser(contact)
      }
      return
    }

    personService
      .create(newPersonObject)
      .then((createdPerson) => {
        if (!createdPerson) {
          createFlashMessage('check your inputs', false)
          return
        }
        personFormRef.current.toggleVisibility()
        const personsObj = persons.concat(createdPerson)
        setPersons(personsObj)
        setNewName('')
        setNewNumber('')
        createFlashMessage(`${createdPerson.name} has been created`, true)
      })
      .catch(err => {
        console.log(err)
        createFlashMessage(err.message, false)
      })
  }

  const updateUser = (person) => {
    const updatedPerson = { ...person, number: newNumber }

    personService
      .update(person.id, updatedPerson)
      .then(updatedPerson => {
        const updatedPersons = persons.map(person => updatedPerson.id === person.id ? updatedPerson : person)
        setPersons(updatedPersons)
        setNewName('')
        setNewNumber('')
        createFlashMessage(`${updatedPerson.name} has been updated`, true)
      })
      .catch(err => {
        console.log(err)
        createFlashMessage(err.message, false)
      })
  }

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

  const existingPerson = () => {
    return persons.some((person) => person.name === newName)
  }

  const getFilteredPersons = () => {
    return persons.filter(person => {
      return person.name.slice(0, newSearch.length).toLowerCase() === newSearch.toLowerCase()
    })
  }

  const filteredPersons = newSearch.length > 0 ? getFilteredPersons() : persons
  const findPerson = (id) => persons.find(person => person.id === id)
  const findPersonByName = () => persons.find(person => person.name === newName)

  const createFlashMessage = (message, success) => {
    setRequestSuccess(success)
    setFlashMessage(message)
    setTimeout(() => setFlashMessage(''), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedPhonebookUser', JSON.stringify(user))

      personService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      createFlashMessage('Wrong credentials', false)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedPhonebookUser')
    setUser(null)
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const personForm = () => {
    return (
      <div>
        <p>logged in as {user.username}</p>
        <Togglable buttonLabel="new contact" ref={personFormRef}>
          <PersonForm
            newName={newName}
            newNumber={newNumber}
            handleNameInput={handleNameInput}
            handleNumberInput={handleNumberInput}
            onSubmit={createPerson}
            handleLogout={handleLogout}
          />
        </Togglable>
        <button onClick={handleLogout}>logout</button>
      </div>
    )
  }

  const personFormRef = useRef()

  return (
    <div>
      <Header title="Phonebook" />

      { flashMessage && <Notification message={flashMessage} requestSuccess={requestSuccess} />}

      {!user && loginForm()}
      {user && personForm()}

      <form>
        <Input
          text='filter shown with '
          stateValue={newSearch}
          stateHandler={handleSearchInput}
        />
      </form>

      <Header title="Numbers" />
      {filteredPersons.map((person) =>
        <Person
          key={person.id}
          id={person.id}
          name={person.name}
          number={person.number}
          deletePerson={deletePerson}
        />
      )}
    </div>
  )
}

export default App