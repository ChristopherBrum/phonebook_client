import axios from 'axios'
const baseUrl = '/api/persons'

let token = null

const setToken = (newToken) => {
	token = `Bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then((response) => {
		return response.data
	})
	.catch(error => console.log(error.response.data.error))
}

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token },
	}

	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = (id, newObject) => {
	const request = axios.put(`${baseUrl}/${id}`, newObject)
	return request.then((response) => {
		return response.data
	})
	.catch(error => console.log(error.response.data.error))
}

const destroy = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`)
	return request.then(response => {
		return response.data
	})
	.catch(error => console.log(error.response.data.error))
}

const contactService = { getAll, create, update, destroy, setToken }

export default contactService