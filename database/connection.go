package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
)

func ConnectDB() (*pgx.Conn, error) {

	connStr := "host=localhost port=5432 user=postgres password=123456 dbname=barbershop_db sslmode=disable"

	conn, err := pgx.Connect(context.Background(), connStr)

	if err != nil {
		return nil, err
	}

	fmt.Println("Banco conectado com sucesso")

	return conn, nil

}
