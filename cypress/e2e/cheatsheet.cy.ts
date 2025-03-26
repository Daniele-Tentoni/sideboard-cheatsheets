describe('In the cheatsheet view', () => {
  const cheatsheetTitle = 'Jund Wildfire'

  it('visit the page', () => {
    cy.sideboard(cheatsheetTitle)
    cy.get('[data-test="card-title"]').should(
      'include.text',
      `${cheatsheetTitle} sideboard cheatsheets`,
    )
  })

  it('change visualization of the sideboards', () => {
    cy.sideboard(cheatsheetTitle)
    cy.get('[data-test="view-menu-button"]').click()
    cy.get('[data-test="view-menu-table-button"]').click()
    cy.get('[data-test="opponentsTable"]').should('exist').screenshot()
    cy.get('[data-test="view-menu-button"]').click()
    cy.get('[data-test="view-menu-cards-button"]').click()
    cy.get('[data-test="opponentsCard"]').should('exist').first().screenshot()
    cy.get('[data-test="use-images-selector"] > input').check()
    cy.get('[data-test="archetype-art"]').should('exist')
    cy.get('[data-test="use-images-selector"] > input').uncheck()
    cy.get('[data-test="archetype-art"]').should('not.exist')
    cy.get('[data-test="use-shortnames-selector"] > input').check()
    cy.get('[data-test="use-shortnames-selector"] > input').uncheck()
  })
})
