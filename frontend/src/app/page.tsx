"use client";

import { useEffect, useState } from "react";
import { CreateTaskForm } from "@/components/create-task-form";
import { TaskCard } from "@/components/task-card";
import { Toast } from "@/components/toast";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  generateCsrfToken,
} from "@/lib/api";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/lib/types";
import styles from "@/styles/app.module.css";
import sharedStyles from "@/styles/shared.module.css";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);

  const [csrfUserId, setCsrfUserId] = useState("");
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleGenerateToken = async () => {
    if (!csrfUserId) {
      showToast("Please enter a User ID", "error");
      return;
    }

    setIsGeneratingToken(true);
    try {
      await generateCsrfToken(Number.parseInt(csrfUserId));
      setHasToken(true);
      showToast("CSRF token generated successfully", "success");
    } catch (error) {
      showToast("Failed to generate CSRF token", "error");
      setHasToken(false);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const userId = userIdFilter ? Number.parseInt(userIdFilter) : undefined;
      const response = await getTasks(userId);
      setTasks(response.tasks);
      setFilteredTasks(response.tasks);
    } catch (error) {
      showToast("Failed to load tasks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [userIdFilter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  }, [searchQuery, tasks]);

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      await createTask(taskData);
      showToast("Task created successfully", "success");
      await loadTasks();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to create task",
        "error"
      );
      throw error;
    }
  };

  const handleUpdateTask = async (id: number, updates: UpdateTaskRequest) => {
    try {
      await updateTask(id, updates);
      showToast("Task updated successfully", "success");
      await loadTasks();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to update task",
        "error"
      );
      throw error;
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);
      showToast("Task deleted successfully", "success");
      await loadTasks();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Failed to delete task",
        "error"
      );
      throw error;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIcon}>📋</div>
            <h1>Task Manager</h1>
          </div>
          <p className={styles.headerSubtitle}>
            Organize and track your tasks efficiently
          </p>
        </div>

        <div className={styles.csrfSection}>
          <div className={styles.csrfTitle}>
            <span>🔐</span>
            <span>Security Configuration</span>
          </div>

          <div className={styles.csrfForm}>
            <div className={styles.csrfInputGroup}>
              <input
                type="number"
                placeholder="Enter User ID"
                value={csrfUserId}
                onChange={(e) => setCsrfUserId(e.target.value)}
                className={sharedStyles.input}
                style={{ flex: 1, minWidth: "150px" }}
              />
              <button
                onClick={handleGenerateToken}
                disabled={isGeneratingToken}
                className={`${sharedStyles.button} ${sharedStyles.buttonPrimary}`}
                style={{ whiteSpace: "nowrap" }}
              >
                {isGeneratingToken ? "Generating..." : "Generate CSRF Token"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                width: "100%",
              }}
            >
              <div className={styles.csrfWarning}>
                <span className={styles.csrfWarningIcon}>⚠️</span>
                <span>
                  CSRF token expires in 5 minutes. Generate a new token if
                  operations fail.
                </span>
              </div>

              {hasToken && (
                <div className={styles.csrfStatus}>
                  <span className={styles.csrfStatusIcon}>✅</span>
                  <span>CSRF token active and ready for use</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <CreateTaskForm onSubmit={handleCreateTask} />

        {/* Filters and Search */}
        <div className={styles.filtersSection}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${sharedStyles.input} ${sharedStyles.inputWithIcon}`}
            />
          </div>
          <div className={styles.filterActions}>
            <input
              type="number"
              placeholder="Filter by User ID"
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className={sharedStyles.input}
              style={{ width: "160px" }}
            />
            <button
              onClick={loadTasks}
              className={`${sharedStyles.button} ${sharedStyles.iconButton}`}
            >
              <span
                style={{
                  animation: isLoading ? "spin 1s linear infinite" : "none",
                }}
              >
                🔄
              </span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div>
          <div className={styles.tasksHeader}>
            <h2>
              Tasks {filteredTasks.length > 0 && `(${filteredTasks.length})`}
            </h2>
          </div>

          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📋</div>
              <p className={styles.emptyTitle}>No tasks found</p>
              <p className={styles.emptyDescription}>
                {searchQuery || userIdFilter
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
            </div>
          ) : (
            <div className={styles.tasksGrid}>
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
