async function carregarAgendamentos(){

    const resposta =
        await fetch("/agendamentos")

    const agendamentos =
        await resposta.json()

    console.log(agendamentos)

    const lista =
        document.getElementById("lista-agendamentos")

    lista.innerHTML = ""

    agendamentos.forEach(agendamento => {

        const data = new Date(agendamento.dataHora)

        const dataFormatada =
            data.toLocaleDateString("pt-BR") +
            " às " +
            data.toLocaleTimeString("pt-BR")

        lista.innerHTML += `
            <tr>
                <td>${agendamento.id}</td>
                <td>${agendamento.clienteId}</td>
                <td>${agendamento.barbeiroId}</td>
                <td>${dataFormatada}</td>
                <td>${agendamento.status}</td>
            </tr>
        `
    })
}

carregarAgendamentos()