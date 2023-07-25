import Header from './Header'
import { useParams } from 'react-router-dom'

const Contact = ({ persons }) => {
	const id = useParams().id
	const contact = persons.find(person => person.id === id)

	return (
		<div>
			<Header title={contact.name} size='3' />
			<p>Number: {contact.number}</p>
			<p>ID: {contact.id}</p>
		</div>
	)
}

export default Contact