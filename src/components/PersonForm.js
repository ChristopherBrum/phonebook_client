import { Form, Button } from 'react-bootstrap'

const PersonForm = ({
	onSubmit,
	handleNameInput,
	handleNumberInput,
	newName,
	newNumber }) => {

	const personStyling = {
		width: '500px',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: '100px'
	}

	const buttonStyling = {
		width: '100%',
		marginTop: '20px',
	}

	return (
		<div style={personStyling}>
			<h2>Create a new contact</h2>

			<Form onSubmit={onSubmit}>
				<Form.Group>
					<Form.Label>Name:</Form.Label>
					<Form.Control
						value={newName}
						onChange={handleNameInput}
						className='test'
						id='name'
					/>
					<Form.Label>Number:</Form.Label>
					<Form.Control
						value={newNumber}
						onChange={handleNumberInput}
						id='number'
					/>
					<Button
						style={buttonStyling}
						id='create-contact-button'
						className='test'
						variant='primary'
						type='submit'>
						save
					</Button>
				</Form.Group>
			</Form>
		</div>
	)
}

export default PersonForm