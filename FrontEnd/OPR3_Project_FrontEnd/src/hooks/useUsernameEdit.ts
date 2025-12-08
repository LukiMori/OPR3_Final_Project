import { useState } from 'react'
import { api } from '../services/api'
import type { UserProfile, AuthResponse } from '../types/types'

export const useUsernameEdit = (
  profile: UserProfile | null,
  onSuccess: (authResponse: AuthResponse, newUsername: string) => void
) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newUsername, setNewUsername] = useState(profile?.username || '')
  const [error, setError] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const startEdit = () => {
    setNewUsername(profile?.username || '')
    setIsEditing(true)
    setError('')
  }

  const cancelEdit = () => {
    setNewUsername(profile?.username || '')
    setIsEditing(false)
    setError('')
  }

  const saveUsername = async () => {
    if (newUsername.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    if (newUsername === profile?.username) {
      setIsEditing(false)
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      const authResponse = await api.updateUsername(newUsername)
      onSuccess(authResponse, newUsername)
      setIsEditing(false)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update username')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    isEditing,
    newUsername,
    error,
    isUpdating,
    setNewUsername,
    startEdit,
    cancelEdit,
    saveUsername
  }
}
