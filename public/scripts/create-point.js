
function populateUFs() {
    const ufSelect = document .querySelector("select[name=uf]")

    const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    fetch(url)
    .then( (res) => { return res.json() } )
    .then ( (states) => {
        for ( state of states ) {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}-${state.sigla}</option>`
        }
    })
}
populateUFs()

function getCities (event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value
    stateInput.value = event.target.options[event.target.selectedIndex].text
    
    citySelect.innerHTML = `<option value>Selecione a cidade</option>`
    citySelect.disabled = true

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    fetch(url)
    .then( (res) => { return res.json() } )
    .then ( (cities) => {
        for ( city of cities ) {
        citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
    })
    citySelect.disabled = false

}

//ouvidor de eventos
document 
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)


//Ítens de coleta
//pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}


const colletctedItems = document.querySelector("input[name=items")
let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target
    //add ou remover uma classe com javaScript
    itemLi.classList.toggle("selected")
    
    const itemId = itemLi.dataset.id
    
    //verificar se existem itens selecionados, se sim - pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex((item) => {
        return item == itemId
    })
    //se já estiver selecionado, tirar da seleção
    if(alreadySelected >= 0) {
        const filteredItems = selectedItems.filter((item) => {
            return item != itemId
        })
        selectedItems = filteredItems

    
    } else { //se não estiver selecionado, add à seleção
         selectedItems.push(itemId)
    }
    console.log(selectedItems)
    //atualizar o campo escondido (input hidden) com os itens selecionados
    colletctedItems.value = selectedItems
}