"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { TaskStatus } from "@/lib/types"
import styles from "@/styles/form.module.css"

interface CreateTaskFormProps {
  onSubmit: (task: {
    user_id: number
    title: string
    description: string
    status: TaskStatus
  }) => Promise<void>
  defaultUserId?: string
}

export function CreateTaskForm({ onSubmit, defaultUserId }: CreateTaskFormProps) {
  const [userId, setUserId] = useState(defaultUserId || "1")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<TaskStatus>("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (defaultUserId) {
      setUserId(defaultUserId)
    }
  }, [defaultUserId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        user_id: Number.parseInt(userId),
        title,
        description,
        status,
      })
      setTitle("")
      setDescription("")
      setStatus("pending")
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <span>➕</span>
          Create New Task
        </h2>
        <p className={styles.cardDescription}>Add a new task to your list</p>
      </div>
      <div className={styles.cardContent}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="userId" className={styles.label}>
                User ID
              </label>
              <input
                id="userId"
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                min="1"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.label}>
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={styles.select}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              required
              className={styles.textarea}
            />
          </div>
          <button type="submit" disabled={isSubmitting} className={styles.button}>
            <span>➕</span>
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  )
}
