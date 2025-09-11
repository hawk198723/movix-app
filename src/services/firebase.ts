import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { MockFirebaseService } from './mockFirebase'
import type { UserProfile, Comment, CreateCommentData } from '../types'

// 检查是否为演示模式（Firebase配置包含"demo"）
const isDemoMode = window.location.hostname === 'localhost' || 
                   window.location.hostname.includes('demo') ||
                   process.env.NODE_ENV === 'development'

export class FirebaseService {
  // 用户相关操作
  static async createUserProfile(userId: string, email: string, displayName?: string): Promise<UserProfile> {
    if (isDemoMode) {
      return MockFirebaseService.createUserProfile(userId, email, displayName)
    }

    const userProfile: UserProfile = {
      uid: userId,
      email,
      displayName,
      favorites: [],
      watchLater: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(doc(db, 'users', userId), userProfile)
    return userProfile
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (isDemoMode) {
      return MockFirebaseService.getUserProfile(userId)
    }

    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile
    }
    return null
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (isDemoMode) {
      return MockFirebaseService.updateUserProfile(userId, updates)
    }

    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date()
    })
  }

  // 收藏功能
  static async addToFavorites(userId: string, movieId: number): Promise<void> {
    if (isDemoMode) {
      return MockFirebaseService.addToFavorites(userId, movieId)
    }

    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      favorites: arrayUnion(movieId),
      updatedAt: new Date()
    })
  }

  static async removeFromFavorites(userId: string, movieId: number): Promise<void> {
    if (isDemoMode) {
      return MockFirebaseService.removeFromFavorites(userId, movieId)
    }

    const docRef = doc(db, 'users', userId)
    await updateDoc(docRef, {
      favorites: arrayRemove(movieId),
      updatedAt: new Date()
    })
  }

  static async isFavorite(userId: string, movieId: number): Promise<boolean> {
    if (isDemoMode) {
      return MockFirebaseService.isFavorite(userId, movieId)
    }

    const profile = await this.getUserProfile(userId)
    return profile?.favorites.includes(movieId) || false
  }

  static async getFavorites(userId: string): Promise<number[]> {
    if (isDemoMode) {
      return MockFirebaseService.getFavorites(userId)
    }

    const profile = await this.getUserProfile(userId)
    return profile?.favorites || []
  }

  // 评论功能
  static async addComment(userId: string, userEmail: string, commentData: CreateCommentData, userDisplayName?: string): Promise<Comment> {
    if (isDemoMode) {
      return MockFirebaseService.addComment(userId, userEmail, commentData, userDisplayName)
    }

    const comment = {
      movieId: commentData.movieId,
      userId,
      userEmail,
      userDisplayName,
      content: commentData.content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'comments'), comment)
    
    return {
      id: docRef.id,
      ...comment
    }
  }

  static async getCommentsForMovie(movieId: number): Promise<Comment[]> {
    if (isDemoMode) {
      return MockFirebaseService.getCommentsForMovie(movieId)
    }

    const q = query(
      collection(db, 'comments'),
      where('movieId', '==', movieId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment))
  }

  static async updateComment(commentId: string, content: string): Promise<void> {
    if (isDemoMode) {
      return MockFirebaseService.updateComment(commentId, content)
    }

    const docRef = doc(db, 'comments', commentId)
    await updateDoc(docRef, {
      content,
      updatedAt: new Date()
    })
  }

  static async deleteComment(commentId: string): Promise<void> {
    if (isDemoMode) {
      return MockFirebaseService.deleteComment(commentId)
    }

    const docRef = doc(db, 'comments', commentId)
    await deleteDoc(docRef)
  }

  static async getUserComments(userId: string): Promise<Comment[]> {
    if (isDemoMode) {
      return MockFirebaseService.getUserComments(userId)
    }

    const q = query(
      collection(db, 'comments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment))
  }
}
