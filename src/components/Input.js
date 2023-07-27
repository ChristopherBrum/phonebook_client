const Input = ({ text, stateHandler, stateValue }) => {
	return (
		<div>
			{text}: <input value={stateValue} onChange={stateHandler}/>
		</div>
	)
}

export default Input