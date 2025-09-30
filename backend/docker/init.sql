-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuários padrão
INSERT INTO users (username, password_hash)
VALUES
  ('admin', '$2b$10$EXEMPLODEHASHDEBSALTED'),
  ('user1', '$2b$10$EXEMPLODEHASHDEBSALTED1'),
  ('user2', '$2b$10$EXEMPLODEHASHDEBSALTED2');



-- Tabela de tokens CSRF
CREATE TABLE IF NOT EXISTS csrf_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tarefas iniciais para admin (user_id = 1)
-- Tarefas iniciais para todos os usuários
INSERT INTO tasks (user_id, title, description, status)
VALUES
  -- Admin (user_id = 1)
  (1, 'Admin Task 1', 'Primeira tarefa do admin', 'pending'),
  (1, 'Admin Task 2', 'Segunda tarefa do admin', 'in_progress'),
  (1, 'Admin Task 3', 'Terceira tarefa do admin', 'completed'),
  -- user1 (user_id = 2)
  (2, 'User1 Task 1', 'Primeira tarefa do user1', 'pending'),
  (2, 'User1 Task 2', 'Segunda tarefa do user1', 'in_progress'),
  (2, 'User1 Task 3', 'Terceira tarefa do user1', 'completed'),
  -- user2 (user_id = 3)
  (3, 'User2 Task 1', 'Primeira tarefa do user2', 'pending'),
  (3, 'User2 Task 2', 'Segunda tarefa do user2', 'in_progress'),
  (3, 'User2 Task 3', 'Terceira tarefa do user2', 'completed');



-- Índices
CREATE INDEX IF NOT EXISTS idx_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_status ON tasks(status);
