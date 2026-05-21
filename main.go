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
	http.HandleFunc("/", indexHandler)
	fmt.Println("Servidor rodandona porta 8080")
	http.ListenAndServe(":8080", nil)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "templates/index.html")
}