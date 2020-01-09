
describe('Blog App login page', function(){
  it('login page can be opened', function(){
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
  })
})

describe('Blog App', function() {
  beforeEach(function(){
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Kukkarossa',
      username: 'testimasa',
      password: 'tsalasana'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)

    cy.visit('http://localhost:3000')
    cy.get('#username')
      .type('testimasa')
    cy.get('#password')
      .type('tsalasana')
    cy.contains('Login')
      .click()
    cy.contains('Matti Kukkarossa logged in')
  })

  it('user can login and logout', function(){
    cy.contains('Matti Kukkarossa logged in')
    cy.contains('logout')
      .click()
    cy.contains('Log in to application')
  })

  it('a new blog can be created', function(){
    cy.contains('new blog')
      .click()
    cy.get('#title')
      .type('a blog created by cypress')
    cy.get('#author')
      .type('Cypres Test')
    cy.get('#url')
      .type('http://fake/url/for/this/test.com')
    cy.contains('create')
      .click()
    cy.contains('Cypres Test')
  })
  it('a comment can be added', function(){
    cy.contains('new blog')
      .click()
    cy.get('#title')
      .type('a blog created by cypress')
    cy.get('#author')
      .type('Cypres Test')
    cy.get('#url')
      .type('http://fake/url/for/this/test.com')
    cy.contains('create')
      .click()
    cy.contains('Cypres Test')

    cy.visit('http://localhost:3000/blogs')
    cy.get('td:first')
      .click()
    cy.contains('a blog created by cypress')
      .click()
    cy.get('#comment')
      .type('test comment')
    cy.contains('add comment')
      .click()
    cy.contains('test comment')
  })
})