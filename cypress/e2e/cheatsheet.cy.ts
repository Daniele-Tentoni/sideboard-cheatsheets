describe('In the cheatsheet view', () => {
  it('visit the page', () => {
    cy.intercept('https://api.scryfall.com/cards/named?fuzzy=*', {
      fixture: 'scryfall/eviscerators_insight_fuzzy.json',
    })
    cy.visit('/sideboard/Jund%20Wildfire')
    cy.get('[data-test="card-title"]').should('include.text', 'Jund Wildfire sideboard cheatsheets')
  })
})
