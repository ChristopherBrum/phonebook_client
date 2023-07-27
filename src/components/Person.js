import { Link } from 'react-router-dom'

const Person = ({ id, name, number, deletePerson }) => {
	const styling = {
		border: 'solid black 1px',
		width: '100%',
		padding: '10px',
		margin: '10px',
		backgroundColor: '#EEEEEE',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: '3px',
	}

	return (
		<div className='person' style={styling}>
			<label><Link to={`/contacts/${id}`}>{name} -- {number}</Link></label>
			<button onClick={() => deletePerson(id)}>delete</button>
		</div>
	)
}

export default Person