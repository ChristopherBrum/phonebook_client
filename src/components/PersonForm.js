const PersonForm = ({ onSubmit, handleNameInput, handleNumberInput, newName, newNumber }) => {
	return (
		<div style={{
				backgroundColor: '#E5FFCC',
				width: '250px',
				padding: '0 30px 20px',
				margin: '10px',
				borderLeft: '1px solid black',
				border: '1px solid black',
				borderRadius: '3px',
			}}>
			<h2>Create a new contact</h2>

			<form onSubmit={onSubmit}>
				<div>
					<label>Name:</label>
					<input
						value={newName}
						onChange={handleNameInput}
					/>
				</div>
				<div>
					<label>Number:</label>
					<input
						value={newNumber}
						onChange={handleNumberInput}
					/>
				</div>
				<button type="submit">save</button>

			</form>
		</div>
	)
}

export default PersonForm