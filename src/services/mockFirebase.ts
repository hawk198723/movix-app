// 模拟Firebase服务，用于演示模式
import type { UserProfile, Comment, CreateCommentData } from '../types'

// 本地存储键
const STORAGE_KEYS = {
  FAVORITES: 'movix_favorites',
  COMMENTS: 'movix_comments',
  USER_PROFILE: 'movix_user_profile'
}

export class MockFirebaseService {
  // 用户相关操作
  static async createUserProfile(userId: string, email: string, displayName?: string): Promise<UserProfile> {
    const userProfile: UserProfile = {
      uid: userId,
      email,
      displayName,
      favorites: [],
      watchLater: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`, JSON.stringify(userProfile))
    return userProfile
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const stored = localStorage.getItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`)
    if (stored) {
      const profile = JSON.parse(stored)
      return {
        ...profile,
        createdAt: new Date(profile.createdAt),
        updatedAt: new Date(profile.updatedAt)
      }
    }
    return null
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const existing = await this.getUserProfile(userId)
    if (existing) {
      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date()
      }
      localStorage.setItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`, JSON.stringify(updated))
    }
  }

  // 收藏功能
  static async addToFavorites(userId: string, movieId: number): Promise<void> {
    const favorites = await this.getFavorites(userId)
    if (!favorites.includes(movieId)) {
      favorites.push(movieId)
      localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${userId}`, JSON.stringify(favorites))
    }
  }

  static async removeFromFavorites(userId: string, movieId: number): Promise<void> {
    const favorites = await this.getFavorites(userId)
    const updated = favorites.filter(id => id !== movieId)
    localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${userId}`, JSON.stringify(updated))
  }

  static async isFavorite(userId: string, movieId: number): Promise<boolean> {
    const favorites = await this.getFavorites(userId)
    return favorites.includes(movieId)
  }

  static async getFavorites(userId: string): Promise<number[]> {
    const stored = localStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${userId}`)
    return stored ? JSON.parse(stored) : []
  }

  // 评论功能
  static async addComment(userId: string, userEmail: string, commentData: CreateCommentData, userDisplayName?: string): Promise<Comment> {
    const comments = this.getAllComments()
    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      movieId: commentData.movieId,
      userId,
      userEmail,
      userDisplayName,
      content: commentData.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    comments.push(newComment)
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
    return newComment
  }

  static async getCommentsForMovie(movieId: number): Promise<Comment[]> {
    const comments = this.getAllComments()
    return comments
      .filter(comment => comment.movieId === movieId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static async updateComment(commentId: string, content: string): Promise<void> {
    const comments = this.getAllComments()
    const index = comments.findIndex(c => c.id === commentId)
    if (index !== -1) {
      comments[index] = {
        ...comments[index],
        content,
        updatedAt: new Date()
      }
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))
    }
  }

  static async deleteComment(commentId: string): Promise<void> {
    const comments = this.getAllComments()
    const filtered = comments.filter(c => c.id !== commentId)
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(filtered))
  }

  static async getUserComments(userId: string): Promise<Comment[]> {
    const comments = this.getAllComments()
    return comments
      .filter(comment => comment.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  private static getAllComments(): Comment[] {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS)
    if (!stored) return []
    
    const comments = JSON.parse(stored)
    return comments.map((comment: any) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt)
    }))
  }
}
