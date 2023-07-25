const Header = ({ title, size }) => {
	if (size === '1') {
		return (
			<h1>{title}</h1>
		)
	} else if (size === '2') {
		return (
			<h2>{title}</h2>
		)
	} else if (size === '3') {
		return (
			<h3>{title}</h3>
		)
	}
}

export default Header