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

const Transaction = {
    all: [
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
    ],

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0

        Transaction.all.forEach( transaction => {
            if(transaction.amount > 0){
                income += transaction.amount
            }
        })
        
        return income
    },

    expenses() {
        let expensive = 0

        Transaction.all.forEach( transaction => {
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
    },

    clearTransactions(){
        DOM.TransactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

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

const App = {
    init(){
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()        
    },

    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        const { description, amount, date } = Form.getValues()

        if( description.trim() === "" ||
            amount.trim() === "" || 
            date.trim() === ""){
                throw new Error("Por favor, preencha todos os campos")
            }
    },

    formatValues(){
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const newTransaction = Form.formatValues()
            Transaction.add(newTransaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

App.init()
