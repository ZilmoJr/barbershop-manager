
package handlers

import (
	"barbershop-manager/database"
	"barbershop-manager/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func CriarServico(w http.ResponseWriter, r *http.Request) {

	var servico models.Servico

	err := json.NewDecoder(r.Body).Decode(&servico)

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
		"INSERT INTO servicos (descricao, valor) VALUES ($1, $2)",
		servico.Descricao,
		servico.Valor,
	)

	if err != nil {
		http.Error(w, "Erro ao salvar cliente", http.StatusInternalServerError)
		return
	}

	fmt.Println("Serviço salvo com sucesso")
	w.Write([]byte("Serviço salvo com sucesso"))
	
}

func ListarServicos(w http.ResponseWriter, r *http.Request) {

	conn, err := database.ConnectDB()

	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}

	defer conn.Close(context.Background())

	rows, err := conn.Query(
		context.Background(),
		"SELECT id, descricao, valor, data_cadastro FROM servicos ORDER BY id ASC",
	)

	if err != nil {
		http.Error(w, "Erro ao buscar serviços", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var servicos []models.Servico

	for rows.Next() {

		var servico models.Servico

		rows.Scan(
			&servico.ID,
			&servico.Descricao,
			&servico.Valor,
			&servico.DataCadastro,
			
		)

		servicos = append(servicos, servico)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(servicos)

}

func AtualizarServico(w http.ResponseWriter, r *http.Request) {

	var servico models.Servico
	err := json.NewDecoder(r.Body).Decode(&servico)

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
		"UPDATE servicos SET descricao=$1, valor=$2 WHERE id=$3",
		servico.Descricao,
		servico.Valor,
		servico.ID,
		
	)
	if err != nil {
		http.Error(w, "Erro ao atualizar serviços", http.StatusInternalServerError)
		return
	}

	fmt.Println("Serviço atualizado com sucesso")
	w.Write([]byte("Serviço atualizado com sucesso"))
	

}

func DeletarServico(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	conn, err := database.ConnectDB()
	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}
	defer conn.Close(context.Background())

	_, err = conn.Exec(
		context.Background(),
		"DELETE FROM servicos WHERE id=$1",
		id,
	)
	if err != nil {
		http.Error(w, "Erro ao deletar Serviço", http.StatusInternalServerError)
		return
	}
	fmt.Println("Serviço deletado com sucesso")
	w.Write([]byte("Serviço deletado com sucesso"))
}
