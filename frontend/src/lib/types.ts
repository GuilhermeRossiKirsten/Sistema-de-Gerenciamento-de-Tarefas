export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  user_id: number;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}
