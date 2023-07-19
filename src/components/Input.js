const Input = (props) => {
	return (
		<div>
			{props.text}: <input value={props.stateValue} onChange={props.stateHandler}/>
		</div>
	)
}

export default Input