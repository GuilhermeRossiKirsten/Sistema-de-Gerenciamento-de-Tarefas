import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksResponse,
} from "./types";

const API_BASE_URL = "http://127.0.0.1:3001";

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export async function generateCsrfToken(userId: number): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/csrf-token/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to generate CSRF token");
  }
  const data = await response.json();
  setCsrfToken(data.csrfToken);
  return data.csrfToken;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  return headers;
}

export async function getTasks(userId?: number): Promise<TasksResponse> {
  const url = new URL(`${API_BASE_URL}/tasks`);
  if (userId) {
    url.searchParams.append("user_id", userId.toString());
  }

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

export async function createTask(task: CreateTaskRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/task`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create task");
  }
}

export async function updateTask(
  id: number,
  updates: UpdateTaskRequest
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/task/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update task");
  }
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/task/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete task");
  }
}
