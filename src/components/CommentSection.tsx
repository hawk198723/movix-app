import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, Trash2, Edit2, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { FirebaseService } from '../services/firebase'
import { Button } from './ui/Button'
import { Loading } from './ui/Loading'
import type { Comment } from '../types'

interface CommentSectionProps {
  movieId: number
}

export function CommentSection({ movieId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [movieId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const commentsData = await FirebaseService.getCommentsForMovie(movieId)
      setComments(commentsData)
    } catch (err) {
      console.error('Failed to load comments:', err)
      setError('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    try {
      const comment = await FirebaseService.addComment(
        user.uid,
        user.email,
        { movieId, content: newComment.trim() },
        user.displayName
      )
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
      setError('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      await FirebaseService.updateComment(commentId, editContent.trim())
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editContent.trim(), updatedAt: new Date() }
            : comment
        )
      )
      setEditingComment(null)
      setEditContent('')
    } catch (err) {
      console.error('Failed to update comment:', err)
      setError('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await FirebaseService.deleteComment(commentId)
      setComments(prev => prev.filter(comment => comment.id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
      setError('Failed to delete comment')
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-netflix-red" />
        <h3 className="text-2xl font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {/* 添加评论表单 */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this movie..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <div className="text-right text-gray-400 text-sm mt-1">
                {newComment.length}/500
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="h-full"
              >
                {submitting ? (
                  <Loading size="sm" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-400">
            Please <a href="/login" className="text-netflix-red hover:underline">sign in</a> to leave a comment
          </p>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-md p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* 评论列表 */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loading size="md" text="Loading comments..." />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-netflix-red rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {comment.userDisplayName || comment.userEmail}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {formatDate(comment.createdAt)}
                      {comment.updatedAt > comment.createdAt && ' (edited)'}
                    </p>
                  </div>
                </div>

                {/* 用户操作按钮 */}
                {user && user.uid === comment.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 评论内容 */}
              {editingComment === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditComment(comment.id)}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {comment.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
