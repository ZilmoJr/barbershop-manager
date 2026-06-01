
    //console.log("APP JS CARREGOU")
    document.getElementById("clienteForm").addEventListener("submit", async function (e) {
        e.preventDefault()
        const botao = document.getElementById("botaoSalvar")
        botao.disabled = true
        document.getElementById("nome").disabled = true
        document.getElementById("telefone").disabled = true
        botao.innerText = "Processando..."
        
        const clienteId = document.getElementById("clienteId").value 
        const nome = document.getElementById("nome").value
        const telefone = document.getElementById("telefone").value.replace(/\D/g,"")
        document.getElementById("nome").classList.remove("input-erro")
        document.getElementById("telefone").classList.remove("input-erro")
        if(nome.length < 3){
            mostrarMensagem("Nome deve ter no minimo 3 letras", "red")
            document.getElementById("nome").classList.add("input-erro")
            botao.disabled = false
            document.getElementById("nome").disabled = false
            document.getElementById("telefone").disabled = false
            botao.innerText = "Salvar Cliente"
            return
        }
        if(telefone.length < 10){
            mostrarMensagem("Telefone inválido", "red")
            document.getElementById("telefone").classList.add("input-erro")
            botao.disabled = false
            document.getElementById("nome").disabled = false
            document.getElementById("telefone").disabled = false
            botao.innerText = "Salvar Cliente"
            return
        }
        if(nome === "" || telefone === "") {
            mostrarMensagem("Preencha todos os campos", "red")
            botao.disabled = false
            document.getElementById("nome").disabled = false
            document.getElementById("telefone").disabled = false
            botao.innerText = "Salvar Cliente"
            return
        }
        const cliente = {
            id: parseInt(clienteId),
            nome: nome,
            telefone: telefone

        }
        let resposta
        try {
            resposta = await fetch("http://localhost:8080/clientes", {
            method: clienteId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
                 },
                 body: JSON.stringify(cliente)
            })

        } catch(error){
            mostrarMensagem("Erro ao processar requisição","red")
            return
        }
        
        const texto = await resposta.text()
        mostrarMensagem(texto, "green")
        carregarClientes()
        
        botao.disabled = false
        document.getElementById("nome").disabled = false
        document.getElementById("telefone").disabled = false
        botao.innerText = "Salvar Cliente"
        document.getElementById("nome").classList.remove("input-erro")
        limparFormulario()
    })//Fim submit

        let todosClientes = []
        async function carregarClientes() {
            document.getElementById("loadingClientes").innerText = "Carregando Clientes..."

            const resposta = await fetch("/clientes")

            const clientes = await resposta.json()
            todosClientes = clientes
            document.getElementById("totalClientes").innerText = clientes.length

            const lista = document.getElementById("lista-clientes")

            lista.innerHTML = ""
            renderizarClientes(clientes)
            document.getElementById("loadingClientes").innerText = ""
        
    }

    carregarClientes()
    document.getElementById("nome").addEventListener("input", function(){
        this.classList.remove("input-erro")
    })
    document.getElementById("telefone").addEventListener("input", function(){
        this.classList.remove("input-erro")
    })
    
    function renderizarClientes(clientes) {
        const lista = document.getElementById("lista-clientes")
        lista.innerHTML = ""
        document.getElementById("totalClientes").innerText = todosClientes.length
        document.getElementById("clientesEncontrados").innerText = clientes.length
        if (clientes.length === 0) {
            lista.innerHTML = ` 
                <tr>
                    <td colspan="4">
                        Nenhum cliente encontrado
                    </td>
                </tr>
            `
            return
        }
        document.getElementById("clientesEncontrados").innerText = clientes.length
        clientes.forEach(cliente => {
            const data = new Date(cliente.dataCadastro)
            const dataFormatada = data.toLocaleDateString("pt-BR") + 
            " às " + data.toLocaleTimeString("pt-BR")
            lista.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>                
                <td>${formatarTelefone(cliente.telefone)}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button onclick="editarCliente(${cliente.id}, '${cliente.nome}', '${cliente.telefone}')">
                        Editar
                    </button>

                    <button onclick="deletarCliente(${cliente.id})">
                        Excluir
                    </button>
                </td>
                
            </tr>    
        `
        })
    }

    async function deletarCliente(id) {
        const confirmado = confirm("Tem certeza que deseja excluir?")
        if (!confirmado) {
            return
        }
        const resposta = await fetch (`/clientes?id=${id}`,{
            method: "DELETE"
        })
        const texto = await resposta.text()
        mostrarMensagem(texto, "green")
        document.getElementById("buscarCliente").value = ""
        carregarClientes()
    }

    function editarCliente(id, nome, telefone) {
        document.getElementById("modalClienteId").value = id
        document.getElementById("modalNome").value = nome
        document.getElementById("modalTelefone").value = telefone
        document.getElementById("modalEditar").style.display = "flex"
        document.getElementById("botaoCancelar").style.display = "inline-block"
        
    }
    
    function mostrarMensagem(texto, cor) {
        document.getElementById("mensagem").innerText = texto
        document.getElementById("mensagem").style.color = cor
        setTimeout(() => {
            document.getElementById("mensagem").innerText = ""
        }, 3000)

    }
    document.getElementById("buscarCliente").addEventListener("input", function () {
        const textoBusca = this.value.toLowerCase()

        const clientesFiltrados = todosClientes.filter(cliente =>
            cliente.nome.toLowerCase().includes(textoBusca)
        )

        renderizarClientes(clientesFiltrados)

    })
    function fecharModal(){
        document.getElementById("modalEditar").style.display = "none"
        limparModal()
    }
    async function salvarEdicao() {
        const botao = document.getElementById("botaoSalvarEdicao")
        const nome = document.getElementById("modalNome").value
        const telefone = document.getElementById("modalTelefone").value.replace(/\D/g,"")
        if(nome.length < 3){
            mostrarMensagemModal("Nome deve ter no minimo 3 letras.","red")
            document.getElementById("modalNome").classList.add("input-erro")
            return
        }
        if(telefone.length < 10){
            mostrarMensagemModal("Telefone invalido","red")
            document.getElementById("modalTelefone").classList.add("input-erro")
            return
        }    
        botao.disabled = true
        botao.innerText = "Salvando..."
        const cliente = {
            id: parseInt(document.getElementById("modalClienteId").value),
            nome: document.getElementById("modalNome").value,
            telefone: document.getElementById("modalTelefone").value
        }
        const resposta = await fetch("/clientes",{
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(cliente)
        })
        const texto = await resposta.text()
        mostrarMensagem(texto, "green")
        botao.disabled = false
        botao.innerText = "Salvar Alterações"
        
        fecharModal()
        carregarClientes()
    }

    function cancelarEdicao() {
        limparFormulario()
        document.getElementById("botaoCancelar").style.display = "none"
    }
    
    window.onclick = function(event){
        const modal = document.getElementById("modalEditar")
        if(event.target == modal){
            fecharModal()
        }
    }
    function limparFormulario() {
        document.getElementById("nome").value = ""
        document.getElementById("telefone").value = ""
        document.getElementById("clienteId").value = ""
        document.getElementById("botaoSalvar").innerText = "Salvar Cliente"
        document.getElementById("botaoCancelar").style.display = "none"
    }

    function limparModal() {
        document.getElementById("modalClienteId").value = ""
        document.getElementById("modalNome").value = ""
        document.getElementById("modalTelefone").value = ""
        document.getElementById("modalNome").classList.remove("input-erro")
        document.getElementById("modalTelefone").classList.remove("input-erro")
    }
    function mostrarMensagemModal(texto,cor){
        document.getElementById("mensagemModal").innerText = texto
        document.getElementById("mensagemModal").style.color = cor
        setTimeout(() => {
            document.getElementById("mensagemModal").innerText = ""


        },3000)
    }
    document.getElementById("telefone").addEventListener("input", function () {
        let valor = this.value.replace(/\D/g,"")
        if (valor.length > 11) {
            valor = valor.slice(0,11)
        }
        if (valor.length > 6) {
            valor = valor.replace(
                /^(\d{2})(\d{5})(\d+)/,
                "($1) $2-$3"
            )
        } else if (valor.length > 2) {
            valor = valor.replace(
                 /^(\d{2})(\d+)/,
                "($1) $2"
            )
        }
        this.value = valor
    })

document.getElementById("modalTelefone").addEventListener("input", function () {
        let valor = this.value.replace(/\D/g,"")
        if (valor.length > 11) {
            valor = valor.slice(0,11)
        }
        if (valor.length > 6) {
            valor = valor.replace(
                /^(\d{2})(\d{5})(\d+)/,
                "($1) $2-$3"
            )
        } else if (valor.length > 2) {
            valor = valor.replace(
                 /^(\d{2})(\d+)/,
                "($1) $2"
            )
        }
        this.value = valor
    })
function formatarTelefone(telefone){
    telefone = telefone.replace(/\D/g, "")
    if (telefone.length === 11){ 
        return telefone.replace(
             /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        )
    }
    return telefone    
}