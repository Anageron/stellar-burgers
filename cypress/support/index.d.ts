declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientId: string): Chainable<void>;
    openIngredientModal(type: string, id: string): Chainable<void>;
    closeIngredientModal(): Chainable<void>;
  }
}
