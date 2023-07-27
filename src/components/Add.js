import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PersonForm from './PersonForm'
import personService from '../services/person'

const Add = ({ user, persons, createFlashMessage, setPersons }) => {
  const navigate = useNavigate()

	const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

	const handleNameInput = (event) => setNewName(event.target.value)
  const handleNumberInput = (event) => setNewNumber(event.target.value)

	const existingPerson = () => {
    return persons.some((person) => person.name === newName)
  }

	const findPersonByName = () => persons.find(person => person.name === newName)

  const createPerson = (event) => {
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber,
    }

    if (newName.length < 3) {
      createFlashMessage('name must be at least 3 characters long', 'danger')
      return
    }

    if (!(/^\d{3}-\d{3}-\d{4}$/.test(newNumber)) || newNumber.length !== 12) {
      createFlashMessage('number must be formatted `xxx-xxx-xxxx`', 'danger')
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
          createFlashMessage('check your inputs', 'danger')
          return
        }
        const personsObj = persons.concat(createdPerson)
        setPersons(personsObj)
        setNewName('')
        setNewNumber('')
        navigate('/')
        createFlashMessage(`'${createdPerson.name}' has been created`, 'success')
      })
      .catch(err => {
        console.log(err)
        createFlashMessage(err.message, 'danger')
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
        createFlashMessage(`${updatedPerson.name} has been updated`, 'success')
      })
      .catch(err => {
        console.log(err)
        createFlashMessage(err.message, false)
      })
  }


	if (!user) return (
		<></>
	)

	return (
		<div>
			<PersonForm
				newName={newName}
				newNumber={newNumber}
				handleNameInput={handleNameInput}
				handleNumberInput={handleNumberInput}
				onSubmit={createPerson}
			/>
		</div>
	)
}

export default Add