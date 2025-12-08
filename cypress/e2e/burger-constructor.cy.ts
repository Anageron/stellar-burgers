const BUN_ID = '643d69a5c3f7b9001cfa093c'; // Краторная булка
const MAIN_ID = '643d69a5c3f7b9001cfa093e'; // Биокотлета
const SAUCE_ID = '643d69a5c3f7b9001cfa093f'; // Соус Spicy-X
const INGREDIENT_TYPE = 'main';

describe('Тесты Stellar Burger', () => {
  describe('Конструктор бургера', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('/');
      cy.wait('@getIngredients');
    });
    it('должен добавить булку в конструктор (верх и низ)', () => {
      cy.get(`[data-cy="add-ingredient-${BUN_ID}"]`).click();

      cy.get('[data-cy="constructor-bun-top"]').should('contain', '(верх)');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', '(низ)');
    });

    it('должен добавить котлету в конструктор', () => {
      cy.get(`[data-cy="add-ingredient-${MAIN_ID}"]`).click();
      cy.get(`[data-cy="constructor-filling-${MAIN_ID}"]`).should('exist');
    });

    it('должен добавить соус в конструктор', () => {
      cy.get(`[data-cy="add-ingredient-${SAUCE_ID}"]`).click();
      cy.get(`[data-cy="constructor-filling-${SAUCE_ID}"]`).should('exist');
    });

    it('должен добавить булку, котлету и соус одновременно', () => {
      cy.get(`[data-cy="add-ingredient-${BUN_ID}"]`).click();
      cy.get(`[data-cy="add-ingredient-${MAIN_ID}"]`).click();
      cy.get(`[data-cy="add-ingredient-${SAUCE_ID}"]`).click();

      cy.get('[data-cy="constructor-bun-top"]').should('contain', '(верх)');
      cy.get('[data-cy="constructor-bun-bottom"]').should('contain', '(низ)');
      cy.get(`[data-cy="constructor-filling-${MAIN_ID}"]`).should('exist');
      cy.get(`[data-cy="constructor-filling-${SAUCE_ID}"]`).should('exist');
    });
  });

  describe('Модальные окна ингредиентов', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.visit('/');
      cy.wait('@getIngredients');
    });
    it('должен открывать модальное окно по клику на ингредиент', () => {
      cy.get(`[data-cy="ingredient-${INGREDIENT_TYPE}-${MAIN_ID}"]`).click();
      cy.get('[data-cy="ingredient-modal"]').should('be.visible');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get(`[data-cy="ingredient-${INGREDIENT_TYPE}-${MAIN_ID}"]`).click();
      cy.get('[data-cy="ingredient-modal"]').should('be.visible');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get(`[data-cy="ingredient-${INGREDIENT_TYPE}-${MAIN_ID}"]`).click();
      cy.get('[data-cy="ingredient-modal"]').should('be.visible');
      cy.get('[data-cy="modal-overlay"]:last').click({ force: true });
      cy.get('[data-cy="ingredient-modal"]').should('not.exist');
    });
  });
  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
        'getIngredients'
      );
      cy.intercept('GET', '**/auth/user', {
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      }).as('getUser');
      cy.intercept('POST', '**/auth/token', {
        statusCode: 200,
        body: {
          success: true,
          refreshToken: 'new-refresh-token',
          accessToken: 'new-access-token'
        }
      }).as('refreshToken');
      cy.intercept('POST', '**/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Краторный бургер',
          order: {
            _id: '64e8d45e82e277001bfaabc6',
            ingredients: [
              '643d69a5c3f7b9001cfa093c',
              '643d69a5c3f7b9001cfa0941',
              '643d69a5c3f7b9001cfa093c'
            ],
            status: 'done',
            name: 'Краторный бургер',
            createdAt: '2025-12-11T14:00:00.000Z',
            updatedAt: '2025-12-11T14:00:00.000Z',
            number: 12345
          }
        }
      }).as('createOrder');
      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });
      cy.setCookie('accessToken', 'test-access-token');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      cy.clearCookies();
    });

    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa093c"]').click();
      cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa093e"]').click();
      cy.get('[data-cy="order-button"]').should('not.be.disabled').click();
      cy.url().should('not.include', '/login');
      cy.get('[data-cy="order-modal"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('contain', '12345');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="constructor"]').should('contain', 'Выберите булки');
      cy.get(`[data-cy='constructor']`).should('contain', 'Выберите начинку');
    });
  });
});
