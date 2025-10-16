-- OPÇÃO 1: Script para corrigir a tabela Comments
-- Execute este script no SQLite para corrigir as foreign keys

-- 1. Primeiro, backup dos dados existentes (se houver)
CREATE TABLE Comments_backup AS SELECT * FROM Comments;

-- 2. Dropar a tabela atual
DROP TABLE Comments;

-- 3. Criar a tabela com foreign keys corretas
CREATE TABLE "Comments" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"CustomerID"	INTEGER NOT NULL,
	"UserID"	INTEGER NOT NULL,
	"Comment"	BLOB,
	"CriadoPor"	TEXT,
	"DataCriacao"	TEXT,
	PRIMARY KEY("ID" AUTOINCREMENT),
	FOREIGN KEY("CustomerID") REFERENCES "Customers"("Id"),
	FOREIGN KEY("UserID") REFERENCES "Users"("Id")
);

-- 4. Restaurar dados (se houver backup)
-- INSERT INTO Comments SELECT * FROM Comments_backup;

-- 5. Remover backup
-- DROP TABLE Comments_backup;