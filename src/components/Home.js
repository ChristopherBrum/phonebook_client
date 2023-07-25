import { useState } from 'react'
import Input from './Input'
import Header from './Header'
import Person from './Person'

const Home = ({ persons, deletePerson }) => {
  const [newSearch, setNewSearch] = useState('')

	const handleSearchInput = (event) => setNewSearch(event.target.value)
	const getFilteredPersons = () => {
    return persons.filter(person => {
      return person.name.slice(0, newSearch.length).toLowerCase() === newSearch.toLowerCase()
    })
  }
  const filteredPersons = newSearch.length > 0 ? getFilteredPersons() : persons

	return (
		<>
			<form>
				<Input
					text='filter shown with '
					stateValue={newSearch}
					stateHandler={handleSearchInput}
				/>
			</form>

			<Header title="Numbers" size='2' />
			{filteredPersons.map((person) =>
				<Person
					key={person.id}
					id={person.id}
					name={person.name}
					number={person.number}
					deletePerson={deletePerson}
				/>
			)}
		</>
	)
}

export default Home