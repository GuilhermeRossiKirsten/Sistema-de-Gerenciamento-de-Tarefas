"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import styles from "@/styles/task-card.module.css";

interface TaskCardProps {
  task: Task;
  onUpdate: (
    id: number,
    updates: { title?: string; description?: string; status?: TaskStatus }
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const statusConfig = {
  pending: { label: "Pending", className: styles.badgePending },
  in_progress: { label: "In Progress", className: styles.badgeInProgress },
  completed: { label: "Completed", className: styles.badgeCompleted },
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const handleSave = async () => {
    try {
      await onUpdate(task.id, { title, description, status });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className={`${styles.input} ${styles.inputTitle}`}
          />
        </div>
        <div className={styles.cardContent}>
          <div className={styles.editForm}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
              className={styles.textarea}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className={styles.select}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleSave}
                className={`${styles.button} ${styles.buttonPrimary}`}
                style={{ flex: 1 }}
              >
                <span>✓</span>
                Save
              </button>
              <button
                onClick={handleCancel}
                className={styles.button}
                style={{ flex: 1 }}
              >
                <span>✕</span>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderContent}>
          <div className={styles.cardTitleWrapper}>
            <h3 className={styles.cardTitle}>{task.title}</h3>
            <p className={styles.cardMeta}>
              User ID: {task.user_id} • Created{" "}
              {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`${styles.badge} ${statusConfig[task.status].className}`}
          >
            {statusConfig[task.status].label}
          </span>
        </div>
      </div>
      <div className={styles.cardContent}>
        <p className={styles.description}>{task.description}</p>
        <div className={styles.actions}>
          <button onClick={() => setIsEditing(true)} className={styles.button}>
            <span>✏️</span>
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`${styles.button} ${styles.buttonDelete}`}
          >
            <span>🗑️</span>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
