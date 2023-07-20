import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Person from './Person'

test('renders content', () => {
	const person = {
		name: 'Nikki Breadsticks',
		number: '123-432-5555'
	}

	const { container } = render(<Person name={person.name} number={person.number} />)

	const div = container.querySelector('.person')
	expect(div).toHaveTextContent('Nikki Breadsticks -- 123-432-5555')

	const testName = screen.getByText('Nikki Breadsticks -- 123-432-5555')
	expect(testName).toBeDefined()

	const testNumber = screen.getByText(/123-432-5555/)
	expect(testNumber).toBeDefined()
})

test('clicking button calls event handler once', async () => {
	const person = {
		name: 'Nikki Breadsticks',
		number: '123-432-5555'
	}

	const mockHandler = jest.fn()

	render(<Person name={person.name} number={person.number} deletePerson={mockHandler} />)

	const user = userEvent.setup()
	const button = screen.getByText('delete')
	await user.click(button)

	expect(mockHandler.mock.calls).toHaveLength(1)
})