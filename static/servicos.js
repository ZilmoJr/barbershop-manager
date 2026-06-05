let todosServicos = []

async function carregarServicos() {
    document.getElementById("loadingServico").innerText = 
    "Carregando serviços..."

    const resposta  = await fetch("/servicos")
    const servicos  = await resposta.json()
    todosServicos = servicos
    document.getElementById("totalServicos").innerText = 
        servicos.length
    document.getElementById("servicosEncontrados").innerText = 
        servicos.length
    console.log(servicos)
    renderizarServicos(servicos)
    document.getElementById("loadingServico").innerText = ""    
}
carregarServicos()

/*document.getElementById("nome").addEventListener("input", function(){
    this.classList.remove("input-erro")
})
document.getElementById("telefone").addEventListener("input", function(){
    this.classList.remove("input-erro")
})*/

function renderizarServicos(servicos) {
    const lista = document.getElementById("lista-servicos")
    lista.innerHTML = ""
    document.getElementById("totalServicos").innerText = todosServicos.length
    document.getElementById("servicosEncontrados").innerText = servicos.length
    if (servicos.length === 0) {
        lista.innerHTML = ` 
            <tr>
                <td colspan="4">
                    Nenhum serviço encontrado
                </td>
            </tr>
        `
        return
    }
    document.getElementById("servicosEncontrados").innerText = servicos.length
    servicos.forEach(servicos => {
        const data = new Date(servicos.dataCadastro)
        const dataFormatada = data.toLocaleDateString("pt-BR") + 
        " às " + data.toLocaleTimeString("pt-BR")
        lista.innerHTML += `
        <tr>
            <td>${servicos.id}</td>
            <td>${servicos.descricao}</td>                
            <td>${servicos.valor}</td>
            <td>${dataFormatada}</td>
            <td>
                <button onclick="editarServico(${servicos.id}, '${servicos.descricao}', '${servicos.valor}')">
                    Editar
                </button>

                <button onclick="deletarServico(${servicos.id})">
                    Excluir
                </button>
            </td>
            
        </tr>    
    `
    })
}

