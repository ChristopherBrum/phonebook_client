const Notification = ({ message, requestSuccess }) => {
	if (message === null) {
		return null
	}

	const error = {
		color: 'red',
		background: 'lightgrey',
		fontSize: '20px',
		borderStyle: 'solid',
		borderRadius: '5px',
		padding: '10px',
		marginBottom: '10px',
	}

	const success = {
		color: 'green',
		background: 'lightgrey',
		fontSize: '20px',
		borderStyle: 'solid',
		borderRadius: '5px',
		padding: '10px',
		marginBottom: '10px',
	}

	if (requestSuccess) {
		return (
			<div id='success' style={success}>
				{message}
			</div>
		)
	}
	return (
		<div id='error' style={error}>
			{message}
		</div>
	)
}

export default Notification