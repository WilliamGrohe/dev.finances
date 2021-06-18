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

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.fincances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.fincances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

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
        tr.dataset.index = index
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

        DOM.TransactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) { 
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const formatedAmount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${formatedAmount}</td>
            <td>${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
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

        
        return Math.round(value)
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
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
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
