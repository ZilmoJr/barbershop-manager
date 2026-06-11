package main

import (
	"barbershop-manager/database"
	"barbershop-manager/handlers"
	"fmt"
	"net/http"
)

func main() {
	_, err := database.ConnectDB()

	if err != nil {
		fmt.Println("Erro ao Conectar banco")
		return
	}

	http.HandleFunc("/clientes", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" {
			handlers.ListarClientes(w, r)
			return
		}

		if r.Method == "POST" {
			handlers.CriarCliente(w, r)
			return
		}

		if r.Method == "PUT" {
			handlers.AtualizarCliente(w, r)
			return
		}

		if r.Method == "DELETE" {
			handlers.DeletarCliente(w, r)
			return
		}

		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/servicos", func(w http.ResponseWriter, r *http.Request) {

		if r.Method == "GET" {
			handlers.ListarServicos(w, r)
			return
		}

		if r.Method == "POST" {
			handlers.CriarServico(w, r)
			return
		}

		if r.Method == "PUT" {
			handlers.AtualizarServico(w, r)
			return
		}

		if r.Method == "DELETE" {
			handlers.DeletarServico(w, r)
			return
		}

		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	})

	http.HandleFunc("/agendamentos", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			handlers.ListarAgendamentos(w, r)
			return
		}

		if r.Method == "POST" {
			handlers.CriarAgendamento(w, r)
			return
		}

		if r.Method == "PUT" {
			handlers.AtualizarAgendamento(w, r)
			return
		}

		if r.Method == "DELETE" {
			handlers.DeletarAgendamento(w, r)
			return
		}
	})

	http.HandleFunc("/agendamentos-page", agendamentosHandler)
	http.HandleFunc("/servicos-page", servicosHandler)
	http.HandleFunc("/", indexHandler)
	fmt.Println("Servidor rodandona porta 8080")
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.ListenAndServe(":8080", nil)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/index.html")
}

func servicosHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/servicos.html")
}

func agendamentosHandler(w http.ResponseWriter, r *http.Request){
	http.ServeFile(w, r, "templates/agendamentos.html")
}