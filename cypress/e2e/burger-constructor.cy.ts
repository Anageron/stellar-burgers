// cypress/e2e/burger-constructor.cy.ts

const BUN_ID = '643d69a5c3f7b9001cfa093c'; // Краторная булка
const MAIN_ID = '643d69a5c3f7b9001cfa093e'; // Биокотлета
const SAUCE_ID = '643d69a5c3f7b9001cfa093f'; // Соус Spicy-X
const INGREDIENT_TYPE = 'main';

const setupBaseMocks = () => {
  cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.visit('/');
  cy.wait('@getIngredients');
};

describe('Тесты Stellar Burger', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Конструктор бургера', () => {
    beforeEach(setupBaseMocks);

    it('должен добавить булку в конструктор (верх и низ)', () => {
      cy.addIngredient(BUN_ID);
      cy.get('[data-cy="constructor-bun-top"]').should('contain', '(верх)');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', '(низ)');
    });

    it('должен добавить котлету в конструктор', () => {
      cy.addIngredient(MAIN_ID);
      cy.get(`[data-cy="constructor-filling-${MAIN_ID}"]`).should('exist');
    });

    it('должен добавить соус в конструктор', () => {
      cy.addIngredient(SAUCE_ID);
      cy.get(`[data-cy="constructor-filling-${SAUCE_ID}"]`).should('exist');
    });

    it('должен добавить булку, котлету и соус одновременно', () => {
      cy.addIngredient(BUN_ID);
      cy.addIngredient(MAIN_ID);
      cy.addIngredient(SAUCE_ID);

      cy.get('[data-cy="constructor-bun-top"]').should('contain', '(верх)');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', '(низ)');
      cy.get(`[data-cy="constructor-filling-${MAIN_ID}"]`).should('exist');
      cy.get(`[data-cy="constructor-filling-${SAUCE_ID}"]`).should('exist');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    beforeEach(setupBaseMocks);

    it('должен открывать модальное окно по клику на ингредиент', () => {
      cy.openIngredientModal(INGREDIENT_TYPE, MAIN_ID);
    });

    it('должен отображать информацию о выбранном ингредиенте в модальном окне', () => {
      cy.fixture('ingredients.json').then((fixture) => {
        const target = fixture.data.find((ing: any) => ing._id === MAIN_ID);
        if (!target) {
          throw new Error(`Ингредиент с ID ${MAIN_ID} не найден в фикстуре`);
        }
        cy.openIngredientModal(INGREDIENT_TYPE, MAIN_ID);
        cy.get('[data-cy="ingredient-modal"] h3').should(
          'contain.text',
          target.name
        );
      });
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.openIngredientModal(INGREDIENT_TYPE, MAIN_ID);
      cy.closeIngredientModal();
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.openIngredientModal(INGREDIENT_TYPE, MAIN_ID);
      cy.get('[data-cy="modal-overlay"]:last').click({ force: true });
      cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', '**/auth/token', { fixture: 'refresh-token.json' });
      cy.intercept('POST', '**/orders', { fixture: 'order-response.json' }).as(
        'createOrder'
      );

      cy.setCookie('accessToken', 'test-access-token');
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      cy.addIngredient(BUN_ID);
      cy.addIngredient(MAIN_ID);

      cy.get('[data-cy="order-button"]').as('orderBtn');
      cy.get('@orderBtn').should('not.be.disabled').click();

      cy.wait('@createOrder');

      cy.get('[data-cy="order-modal"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('contain', '12345');

      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="constructor"]').should('contain', 'Выберите булки');
      cy.get('[data-cy="constructor"]').should('contain', 'Выберите начинку');
    });
  });
});
