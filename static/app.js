
    console.log("APP JS CARREGOU")
    document.getElementById("clienteForm").addEventListener("submit", async function (e) {
        e.preventDefault()
        const clienteId = document.getElementById("clienteId").value 
        const cliente = {
            id: parseInt(clienteId),
            nome: document.getElementById("nome").value,
            telefone: document.getElementById("telefone").value

        }
        const resposta = await fetch("http://localhost:8080/clientes", {
            method: clienteId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        })
        const texto = await resposta.text()
        alert(texto)
        carregarClientes()

        document.getElementById("nome").value = ""         
        document.getElementById("telefone").value = ""
    })
        async function carregarClientes() {

        const resposta = await fetch("/clientes")

        const clientes = await resposta.json()

        const lista = document.getElementById("lista-clientes")

        lista.innerHTML = ""

        clientes.forEach(cliente => {

            lista.innerHTML += `
                <li>
                    ${cliente.nome} - ${cliente.telefone}
                    <button onclick="editarCliente(${cliente.id}, '${cliente.nome}', '${cliente.telefone}')">
                        Editar
                    </button>
                    <button onclick="deletarCliente(${cliente.id})">
                        Excluir
                    </button>
                </li>
            `
        })

    }    
    carregarClientes()
    async function deletarCliente(id) {
        const resposta = await fetch (`/clientes?id=${id}`,{
            method: "DELETE"
        })
        const texto = await resposta.text()
        alert(texto)
        carregarClientes()        
    }

    function editarCliente(id, nome, telefone) {
        document.getElementById("clienteId").value = id
        document.getElementById("nome").value = nome
        document.getElementById("telefone").value = telefone
    }
    
   