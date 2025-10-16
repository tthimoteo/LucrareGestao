-- Script SQL para criar a tabela Comments
-- Baseado na especificação: ClienteID, ComentarioId, texto do comentário, Criado por, data da criação

CREATE TABLE Comments (
    ComentarioId INTEGER PRIMARY KEY AUTOINCREMENT,
    ClienteId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    Texto TEXT NOT NULL,
    CriadoPor TEXT NOT NULL,
    DataCriacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ClienteId) REFERENCES Customers(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE RESTRICT
);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS IX_Comments_ClienteId ON Comments(ClienteId);
CREATE INDEX IF NOT EXISTS IX_Comments_UserId ON Comments(UserId);
CREATE INDEX IF NOT EXISTS IX_Comments_DataCriacao ON Comments(DataCriacao);