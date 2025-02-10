describe('template spec', () => {
  it('passes', () => {
    cy.visit('/drivers')
    cy.get('button').contains('Ajouter un livreur').click()
    cy.get('input#nom') 
      .type('Wayne');

    cy.get('input#prenom')
      .type('Bruce');

    cy.get('button#select').click()
    cy.get('li#headlessui-listbox-option-10').click();

    cy.get('input#ville')
      .type('Gotham');
    
    cy.get('input#localisation')
      .type('La grande tour la t sais meme ya des vitre et tout là  ');
    
    cy.get('button[type="submit"]').click();
    })
})