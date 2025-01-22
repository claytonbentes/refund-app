//seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// caputa o evento de input para formatar o valor
amount.oninput = () => {
    //obtem o valor atual do input e remove os caracteres nao numericos
    let value = amount.value.replace(/\D/g, "")
    
    value = Number(value)/100
    
    // atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    //formata o valor no padrao BRL
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return value
}

form.onsubmit = (event) => {
    event.preventDefault()
    
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)

}

// adiciona novo item na lista
function expenseAdd(newExpense){
    try{
        
        //cria o elemento para adicionar o item(li) na lista(ul)
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        //cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria a info da despesa.
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // adiciona nome e categoria na div das informaçoes da depesa
        expenseInfo.append(expenseName, expenseCategory)

        // cria o valor da despesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$","")}`

        //cria icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        //adiciona as informaçoes no item.
        expenseItem.append(expenseIcon, expenseInfo,expenseAmount, removeIcon)
        //adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulario
        formClear()

        //atualiza os totais
        updateTotals()

    } catch(error){
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

// atualiza os totais
function updateTotals(){
    try{
        //recupera todos os itens (li) da lista (ul)
        const items = expenseList.children

        //atualiza a quantidade de itens da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //variavel para incrementar o total
        let total = 0
        for(let item = 0; item< items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")
            
            //remover caracteres nao numericos e substituir virgula por ponto
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            
            // converte o valor para float
            value = parseFloat(value)

            //verifica se é um numero valido
            if(isNaN(value)){
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }

            //incrementar o valor total
            total += Number(value)
        }
        
        // cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"


        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expensesTotal.innerHTML = ""

        expensesTotal.append(symbolBRL, total)

    } catch(error){
        console.log(error)
        alert("Não foi possível atualizar os totais.")
    }
}

//evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
    // verificar se o elemento clicado é o icone de X
    if(event.target.classList.contains("remove-icon")){
        // obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")
        item.remove()
    
    }

    updateTotals()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""
    
    expense.focus()
}