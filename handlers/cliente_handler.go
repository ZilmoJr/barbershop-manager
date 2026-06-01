/*esta função serve para....*/
package handlers

import (
	"barbershop-manager/database"
	"barbershop-manager/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func CriarCliente(w http.ResponseWriter, r *http.Request) {

	var cliente models.Cliente

	err := json.NewDecoder(r.Body).Decode(&cliente)

	if err != nil {
		http.Error(w, "Erro ao ler JSON", http.StatusBadRequest)
		return
	}

	conn, err := database.ConnectDB()

	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}

	defer conn.Close(context.Background())

	_, err = conn.Exec(
		context.Background(),
		"INSERT INTO clientes (nome, telefone) VALUES ($1, $2)",
		cliente.Nome,
		cliente.Telefone,
	)

	if err != nil {
		http.Error(w, "Erro ao salvar cliente", http.StatusInternalServerError)
		return
	}

	fmt.Println("Cliente salvo com sucesso")
	w.Write([]byte("Cliente salvo com sucesso"))

	//w.Header().Set("Content-Type", "application/json")

	//json.NewEncoder(w).Encode(cliente)
}

func ListarClientes(w http.ResponseWriter, r *http.Request) {

	conn, err := database.ConnectDB()

	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}

	defer conn.Close(context.Background())

	rows, err := conn.Query(
		context.Background(),
		"SELECT id, nome, telefone, data_cadastro FROM clientes ORDER BY id ASC",
	)

	if err != nil {
		http.Error(w, "Erro ao buscar clientes", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var clientes []models.Cliente

	for rows.Next() {

		var cliente models.Cliente

		rows.Scan(
			&cliente.ID,
			&cliente.Nome,
			&cliente.Telefone,
			&cliente.DataCadastro,
		)

		clientes = append(clientes, cliente)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clientes)

}

func AtualizarCliente(w http.ResponseWriter, r *http.Request) {

	var cliente models.Cliente
	err := json.NewDecoder(r.Body).Decode(&cliente)

	if err != nil {
		http.Error(w, "Erro ao ler JSON", http.StatusBadRequest)
		return
	}
	conn, err := database.ConnectDB()

	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}

	defer conn.Close(context.Background())
	//fmt.Println(cliente.ID)
	//fmt.Println(cliente.Nome)
	//fmt.Println(cliente.Telefone)

	_, err = conn.Exec(
		context.Background(),
		"UPDATE clientes SET nome=$1, telefone=$2 WHERE id=$3",
		cliente.Nome,
		cliente.Telefone,
		cliente.ID,
	)
	if err != nil {
		http.Error(w, "Erro ao atualizar clientes", http.StatusInternalServerError)
		return
	}

	fmt.Println("Cliente atualizado com sucesso")
	w.Write([]byte("Cliente atualizado com sucesso"))
	//json.NewEncoder(w).Encode(cliente)

}

func DeletarCliente(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	conn, err := database.ConnectDB()
	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}
	defer conn.Close(context.Background())

	_, err = conn.Exec(
		context.Background(),
		"DELETE FROM clientes WHERE id=$1",
		id,
	)
	if err != nil {
		http.Error(w, "Erro ao deletar Cliente", http.StatusInternalServerError)
		return
	}
	fmt.Println("Cliente deletado com sucesso")
	w.Write([]byte("Cliente deletado com sucesso"))
}
