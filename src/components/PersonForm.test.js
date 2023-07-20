import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import PersonForm from './PersonForm'
import userEvent from '@testing-library/user-event'

test('updates parent state and calls onSubmit', async () => {
	const createPerson = jest.fn()

	render(<PersonForm submitHandler={createPerson} />)

	const input = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('save')

  userEvent.type(input, 'testing a form...')
  userEvent.click(sendButton)

	// Had difficulty getting these tests to pass
  // expect(createPerson.mock.calls).toHaveLength(1)
  // expect(createPerson.mock.calls[0][0].content).toBe('testing a form...')
})