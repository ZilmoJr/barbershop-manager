package models
import "time"

type Servico struct {
	ID				int			`json:"id"`
	Descricao		string		`json:"descricao"`
	Valor			float64	 	`json:"valor"`
	DataCadastro	time.Time	`json:"dataCadastro"`
}