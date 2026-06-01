package models

import "time"

type Cliente struct {
	ID           int       `json:"id"`
	Nome         string    `json:"nome"`
	Telefone     string    `json:"telefone"`
	DataCadastro time.Time `json:"dataCadastro"`
}