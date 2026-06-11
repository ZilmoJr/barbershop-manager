package models

import "time"

type Agendamento struct {
	ID         int     		`json:"id"`
	ClienteID  int     		`json:"clienteId"`
	BarbeiroID int     		`json:"barbeiroId"`
	DataHora   time.Time	`json:"dataHora"`
	Status     string  		`json:"status"`
}