const Person = ({ id, name, number, deletePerson }) => {
	return (
		<div className='person' style={{
			border: 'solid black 1px',
			width: '300px',
			padding: '10px',
			margin: '10px',
			backgroundColor: '#E5FFCC',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			borderRadius: '3px',
		}}>
			<label>{name} -- {number}</label>
			<button onClick={() => deletePerson(id)} >delete</button>
		</div>
	)
}

export default Person