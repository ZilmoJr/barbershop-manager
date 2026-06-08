let todosServicos = []

async function carregarServicos() {
    document.getElementById("loadingServico").innerText = 
    "Carregando serviços..."
    document.getElementById("loadingServico").innerText = ""
    let resposta
    try{
        resposta  = await fetch("/servicos")
    } catch(error){
        alert("Erro ao conectar com servidor")
        return
    }
        
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

document.getElementById("servicoForm")
.addEventListener("submit", async function (e) {
    e.preventDefault()
    const descricao = 
        document.getElementById("descricao").value
    const valor = 
        parseFloat(document.getElementById("valor").value)
    if(descricao === ""){
        alert("Informe a descrição")
        return
    }
    if(!valor || valor <= 0){
        alert("Informe um valor válido")
        return
    }
    const servico = {
        descricao: descricao,
        valor: valor
    }
    const resposta = await fetch("/servicos",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(servico)
    })
    //console.log("Status:", resposta.status)
    const texto = await resposta.text()
    //console.log("Resposta:", texto)

    alert(texto)
    carregarServicos()
    document.getElementById("descricao").value = ""
    document.getElementById("valor").value = ""
    
})

document.getElementById("buscarServico")
.addEventListener("input",function(){
    const textoBusca = this.value.toLowerCase()
    const servicosFiltrados = 
        todosServicos.filter(servico =>
            servico.descricao
            .toLowerCase()
            .includes(textoBusca)            
        )
    renderizarServicos(servicosFiltrados)

})


let ordemDescricaoCrescente = true
function ordenarServicos(){
    if(ordemDescricaoCrescente){
        todosServicos.sort((a,b)=>
            a.descricao.localeCompare(b.descricao)
        )
        document.getElementById("colunaDescricao")
            .innerText = "Descrição ▲"
    } else {
        todosServicos.sort((a,b)=>
            b.descricao.localeCompare(a.descricao)
        )
        document.getElementById("colunaDescricao")
            .innerText =  "Descrição ▼"
    }
    ordemDescricaoCrescente = 
        !ordemDescricaoCrescente
    renderizarServicos(todosServicos)
}

let ordemDataCrescente = true
function ordenarPorData() {
    if(ordemDataCrescente) {
        todosServicos.sort((a,b)=>
            new Date(a.dataCadastro) -
            new Date(b.dataCadastro)            
        )
        document.getElementById("colunaData").innerText = 
        "Data Cadastro ▲"
    } else {
        todosServicos.sort((a,b)=>
            new Date(b.dataCadastro) - 
            new Date(a.dataCadastro)
        )
        document.getElementById("colunaData").innerText = 
        "Data Cadastro ▼" 
    }
    ordemDataCrescente = !ordemDataCrescente
    renderizarServicos(todosServicos)

}
async function deletarServico(id) {
    const confirmado = 
        confirm("Deseja excluir este serviço?")
    if(!confirmado){
        return
    }
    const resposta = 
        await fetch(`/servicos?id=${id}`,{
            method:"DELETE"
        })
    const texto = await resposta.text()
    alert(texto)
    carregarServicos()
}

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
    servicos.forEach(servico => {
        const data = new Date(servico.dataCadastro)
        const dataFormatada = data.toLocaleDateString("pt-BR") + 
        " às " + data.toLocaleTimeString("pt-BR")
        lista.innerHTML += `
        <tr>
            <td>${servico.id}</td>
            <td>${servico.descricao}</td>                
            <td>R$ ${(servico.valor || 0).toFixed(2)}</td>
            <td>${dataFormatada}</td>
            <td>
                <button onclick="editarServico(${servico.id}, '${servico.descricao}', '${servico.valor}')">
                    Editar
                </button>

                <button onclick="deletarServico(${servico.id})">
                    Excluir
                </button>
            </td>
            
        </tr>    
    `
    })
}

