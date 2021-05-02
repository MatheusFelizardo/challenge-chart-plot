/* eslint-disable no-undef */

describe('Chart Plot UI test',()=> {

    it("Checking if the name is showing correctly", ()=> {
        cy.visit("/")
        cy.get("[data-cy=header-text-title]").should('to.have.length', 1)
    })

    it('Checking if the textarea is updating the value', ()=> {
        cy.visit("/")
        cy.get("[data-cy=textarea]")
            .should(($item) => {
                expect($item).to.have.length(1)
                expect($item).to.have.value('')  
            })
            .type('O value está sendo atualizado.') 
            .contains('O value está sendo atualizado.')
    })

    it('Checking if the aplication is running when insert right format of text.', ()=> {
        const data = `{type: 'start', timestamp: 1519862400000, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']},
        {type: 'span', timestamp: 1519862400000, begin: 1519862400000, end: 1519862460000},
        {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.3},
        {type: 'data', timestamp: 1519862400000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.0},
        {type: 'stop', timestamp: 1519862460000}`

        cy.visit("/")
        cy.get("[data-cy=textarea]").type(data, { parseSpecialCharSequences: false }) 
        cy.get("[data-cy=button-chart]").click()
        cy.get("[data-cy=chart-wrapper]").children()
    })

    it('Checking if the aplication is giving error when insert invalid format of text.', ()=> {
        const data = `Invalid data`

        cy.visit("/")
        cy.get("[data-cy=textarea]").type(data, { parseSpecialCharSequences: false }) 
        cy.get("[data-cy=button-chart]").click()
        cy.get("[data-cy=chart-wrapper]").children()
    })
})