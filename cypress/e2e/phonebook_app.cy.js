Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedPhonebookUser', JSON.stringify(body))
    cy.visit('')
  })
})

// Cypress.Commands.add('logout', ({ name, number }) => {
//   // cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
//   //   username, password
//   // }).then(({ body }) => {
//   //   localStorage.setItem('loggedPhonebookUser', JSON.stringify(body))
//   //   cy.visit('')
//   // })
// })

Cypress.Commands.add('createPerson', ({ name, number }) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('BACKEND')}/persons`,
    body: { name, number },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedPhonebookUser')).token}`
    }
  })

  cy.visit('')
})

describe('Phonebook app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'testUser',
      username: 'testUsername',
      password: 'password'
    }
    cy.request('POST', '/api/users/', user)
    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Phonebook')
    cy.contains('filter shown with')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
  })

  describe('login', function() {
    it('user can log in', function() {
      cy.contains('log in').click()
      cy.get('#username').type('testUsername')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('logged in as testUsername')
    })

    it('login fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('testUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'logged in as testUsername')
      // alternative syntax
      cy.contains('logged in as testUsername').should('not.exist')
    })

    it('login error displays flash message in red', function() {
      cy.contains('log in').click()
      cy.get('#username').type('testUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()

      cy.get('#error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'testUsername',
        password: 'password'
      })
      cy.createPerson({ name: 'Chris Brum', number: '111-111-1111' })
      cy.createPerson({ name: 'Adrienne Jacob', number: '222-222-2222' })
      cy.createPerson({ name: 'Beemo the Cat', number: '333-333-3333' })
    })

    it('a new contact can be created', function() {
      cy.contains('new contact').click()
      cy.get('#name').type('Mike Milligan')
      cy.get('#number').type('333-444-5555')
      cy.get('#create-contact-button').click()

      cy.contains('Mike Milligan has been created')
    })

    describe('and a contact exists', function() {
      beforeEach(function() {
        cy.createPerson({
          name: 'Mike Milligan',
          number: '333-444-5555'
        })
      })

      it('their number can be updated', function() {
        cy.contains('Chris Brum -- 111-111-1111')
        cy.contains('Adrienne Jacob -- 222-222-2222')
        cy.contains('Beemo the Cat -- 333-333-3333')
        cy.contains('Mike Milligan -- 333-444-5555')
        cy.contains('new contact').click()

        cy.get('#name').type('Mike Milligan')
        cy.get('#number').type('999-999-9999')
        cy.get('#create-contact-button').click()

        cy.contains('Chris Brum -- 111-111-1111')
        cy.contains('Adrienne Jacob -- 222-222-2222')
        cy.contains('Beemo the Cat -- 333-333-3333')
        cy.contains('Mike Milligan -- 999-999-9999')
        cy.contains('Mike Milligan has been updated')
      })

      it('it can be deleted', function() {
        cy.contains('Mike Milligan')
          .parent()
          .contains('delete')
          .click()

        cy.contains('Chris Brum -- 111-111-1111')
        cy.contains('Adrienne Jacob -- 222-222-2222')
        cy.contains('Beemo the Cat -- 333-333-3333')

        cy.get('html').should('not.contain', 'Mike Milligan -- 333-444-5555')
        cy.contains('Mike Milligan has been deleted')
      })
    })
  })

  describe('when not logged in', function() {
    it('the create contact form is not displayed', function() {
      window.localStorage.removeItem('loggedPhonebookUser')
      cy.contains('login')
      cy.get('html').should('not.contain', 'create contact')
      cy.get('html').should('not.contain', 'Chris Brum -- 111-111-1111')
    })
  })
})
