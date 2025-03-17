describe('In the sideboards view', () => {
  it('visit the page', () => {
    cy.visit('sideboards')
    cy.contains('div', 'Sideboards')
    cy.contains('table', 'Name')
    cy.get('[data-test="dialog-activator"]').first().click()
    cy.get('[data-test="card-title"]').should('include.text', 'sideboard cheatsheets')
    cy.get('[data-test="chip-link"]').should('exist')
    cy.get('[data-test="close-btn"]').click()
  })
})
