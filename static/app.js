
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
        const telefone = document.getElementById("telefone").value

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
        limparFormulario()
    })

        let todosClientes = []
        async function carregarClientes() {
            document.getElementById("loadingClientes").innerText = "Carregando Clientes..."

            const resposta = await fetch("/clientes")

            const clientes = await resposta.json()
            todosClientes = clientes

            const lista = document.getElementById("lista-clientes")

            lista.innerHTML = ""
            renderizarClientes(clientes)
            document.getElementById("loadingClientes").innerText = ""
        
    }    
    
    carregarClientes()
    
    function renderizarClientes(clientes) {
        const lista = document.getElementById("lista-clientes")
        lista.innerHTML = ""
        document.getElementById("totalClientes").innerText = `Total Clientes: ${todosClientes.length}`
        document.getElementById("clientesEncontrados").innerText = `Clientes encontrados: ${clientes.length}`
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
        clientes.forEach(cliente => {
            lista.innerHTML += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
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
    }

   