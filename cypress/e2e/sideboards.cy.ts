describe('In the sideboards view', () => {
  it('visit the page', () => {
    cy.sideboards()
    cy.contains('div', 'Sideboards')
    cy.contains('table', 'Name')
    cy.get('[data-test="dialog-activator"]').first().click()
    cy.get('[data-test="card-title"]').should('include.text', 'sideboard cheatsheets')
    cy.get('[data-test="archetype-chip"]').should('exist')
    cy.get('[data-test="close-btn"]').click()
  })

  it('filters by list name and opponent decks', () => {
    cy.sideboards()
    const listName = 'Jund Wildfire'
    cy.get('[data-test="filter-by-name"]').type(listName)
    cy.get('[data-test="filter-by-name"]').type('{downArrow}{enter}')
    cy.get('[data-test="dialog-activator"]').click()
    cy.get('[data-test="filter-by-name"]').get('.mdi-close-circle')
    cy.get('[data-test="dialog-activator"]').should('have.length.above', 0)
  })
})
