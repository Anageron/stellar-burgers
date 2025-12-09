/// <reference types="cypress" />

Cypress.Commands.add('addIngredient', (ingredientId: string) => {
  cy.get(`[data-cy="add-ingredient-${ingredientId}"]`).click();
});

Cypress.Commands.add('openIngredientModal', (type: string, id: string) => {
  cy.get(`[data-cy="ingredient-${type}-${id}"]`).click();
  cy.get('[data-cy="ingredient-modal"]').should('be.visible');
});

Cypress.Commands.add('closeIngredientModal', () => {
  cy.get('[data-cy="modal-close"]').click();
  cy.get('[data-cy="ingredient-modal"]').should('not.exist');
});
