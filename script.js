const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close() {
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50005,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Criação de Site',
        amount: 500005,
        date: '15/01/2021'
    },
    {
        id: 3,
        description: 'Aluguel',
        amount: -150000,
        date: '30/01/2021'
    },
]

const Transaction = {
    incomes() {
        let income = 0

        transactions.forEach( transaction => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })
        
        return income
    },
    expenses() {
        let expensive = 0

        transactions.forEach( transaction => {
            if(transaction.amount < 0){
                expensive += transaction.amount
            }
        })
        
        return expensive
    },
    total() {
        let total = Transaction.incomes() + Transaction.expenses()
        
        return total
    }
}

const DOM = {
    TransactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.TransactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) { 
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const formatedAmount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${formatedAmount}</td>
            <td>${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },
    
    updateBalance() {
        document
            .getElementById('displayIncome')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('displayExpense')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('displayTotal')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value){
        const signal = Number(value) < 0 ? "- " : ""

        value = String(value).replace(/\D/g,"")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

transactions.forEach(function(transaction){
    DOM.addTransaction(transaction)
})

DOM.updateBalance()