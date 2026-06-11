
package handlers

import (
	"barbershop-manager/database"
	"barbershop-manager/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func CriarAgendamento(w http.ResponseWriter, r *http.Request) {

	var agendamento models.Agendamento

	err := json.NewDecoder(r.Body).Decode(&agendamento)

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
		"INSERT INTO agendamentos (cliente_id, barbeiro_id, data_hora, status) VALUES ($1, $2, $3, $4)",
		agendamento.ClienteID,
		agendamento.BarbeiroID,
		agendamento.DataHora,
		agendamento.Status,
	)

	if err != nil {
		http.Error(w, "Erro ao salvar agendamento", http.StatusInternalServerError)
		return
	}

	fmt.Println("Agendamento salvo com sucesso")
	w.Write([]byte("Agendamento salvo com sucesso"))
	
}

func ListarAgendamentos(w http.ResponseWriter, r *http.Request) {

	conn, err := database.ConnectDB()

	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}

	defer conn.Close(context.Background())

	rows, err := conn.Query(
		context.Background(),
		"SELECT id, cliente_id,	barbeiro_id, data_hora, status FROM agendamentos ORDER BY id ASC",
	)

	if err != nil {
		http.Error(w, "Erro ao buscar agendamento", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var agendamentos []models.Agendamento

	for rows.Next() {

		var agendamento models.Agendamento
		
		err := rows.Scan(&agendamento.ID,
    					&agendamento.ClienteID,
						&agendamento.BarbeiroID,
						&agendamento.DataHora,
						&agendamento.Status,)
		if err != nil {
			http.Error(w, "Erro ao ler agendamento", http.StatusInternalServerError)
			return
		}

		agendamentos = append(agendamentos, agendamento)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(agendamentos)

}

func AtualizarAgendamento(w http.ResponseWriter, r *http.Request) {

	var agendamento models.Agendamento
	err := json.NewDecoder(r.Body).Decode(&agendamento)

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
		"UPDATE agendamentos SET cliente_id=$1, barbeiro_id=$2, data_hora=$3, status=$4 WHERE id=$5",
		agendamento.ClienteID,
		agendamento.BarbeiroID,
		agendamento.DataHora,
		agendamento.Status,
		agendamento.ID,
		
	)
	if err != nil {
		http.Error(w, "Erro ao atualizar serviços", http.StatusInternalServerError)
		return
	}

	fmt.Println("Agendamento atualizado com sucesso")
	w.Write([]byte("Agendamento atualizado com sucesso"))
	

}

func DeletarAgendamento(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	conn, err := database.ConnectDB()
	if err != nil {
		http.Error(w, "Erro ao conectar banco", http.StatusInternalServerError)
		return
	}
	defer conn.Close(context.Background())

	_, err = conn.Exec(
		context.Background(),
		"DELETE FROM agendamentos WHERE id=$1",
		id,
	)
	if err != nil {
		http.Error(w, "Erro ao deletar Agendamento", http.StatusInternalServerError)
		return
	}
	fmt.Println("Agendamento deletado com sucesso")
	w.Write([]byte("Agendamento deletado com sucesso"))
}
