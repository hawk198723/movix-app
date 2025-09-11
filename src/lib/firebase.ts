import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase配置 - 演示配置，请替换为你的实际配置
const firebaseConfig = {
  apiKey: "AIzaSyDemo_APIKey_ForMovixClone_Replace_With_Real",
  authDomain: "movix-demo.firebaseapp.com",
  projectId: "movix-demo",
  storageBucket: "movix-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo_app_id_replace_with_real"
}

// 注意：这是演示配置，不会真正连接到Firebase
// 请按照README.md中的说明设置你自己的Firebase项目

// 初始化Firebase
const app = initializeApp(firebaseConfig)

// 导出认证和数据库实例
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
