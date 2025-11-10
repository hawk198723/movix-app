# 🎬 Movix - Movie Streaming App

一个基于 React + TypeScript 构建的现代化电影流媒体应用，采用 Netflix 风格的用户界面设计。

![Movix App](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.10-blue?style=flat-square&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=flat-square&logo=vite)

## ✨ 功能特性

### 🔐 用户认证
- 用户注册和登录
- Firebase Authentication 集成
- 受保护的路由
- 个人资料管理

### 🎭 电影浏览
- 热门电影展示
- 分类浏览（动作、喜剧、恐怖等）
- 高评分电影推荐
- Netflix 风格的无限循环轮播
- 按住箭头连续滑动功能
- 响应式电影卡片

### 🎬 电影详情
- 详细的电影信息展示
- 预告片播放功能（YouTube 集成）
- 评分和评论系统
- 相似电影推荐
- 制作信息和演职人员

### 🔍 搜索功能
- 实时电影搜索
- TMDb API 集成
- 搜索结果分页
- 优化的搜索界面

### 📱 用户体验
- 🌓 **深色/浅色主题切换**
- 现代化 Netflix 风格 UI
- 完全响应式设计（移动端/平板/桌面）
- 流畅的动画效果
- 优化的加载状态
- 错误边界处理
- 视频背景支持

### 💾 个人收藏
- 添加/移除收藏电影
- 个人收藏列表
- 实时同步到 Firebase
- Hover 显示详细信息

### 🎨 高级 UI 特性
- **智能 Hover 效果**：
  - 播放按钮居中显示
  - 动态评分圆环（根据分数变色）
  - 电影信息底部展示
- **无限轮播**：
  - 三倍复制数组实现无缝循环
  - 按住箭头持续滚动
  - 平滑的 60fps 滚动体验
- **主题系统**：
  - localStorage 持久化
  - 平滑过渡动画
  - 全局主题切换

## 🛠️ 技术栈

### 前端框架
- **React 18** - 现代化的 UI 库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **React Router** - 客户端路由

### 样式和 UI
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **Class Variance Authority** - 条件样式管理
- **clsx** - 条件类名工具
- **YouTube IFrame API** - 视频播放集成

### 状态管理和数据
- **React Context** - 全局状态管理（Auth & Theme）
- **Axios** - HTTP 客户端
- **Firebase** - 后端服务和认证
- **localStorage** - 主题持久化

### 开发工具
- **ESLint** - 代码质量检查
- **TypeScript ESLint** - TypeScript 专用规则
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - CSS 浏览器兼容性

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- TMDb API 密钥
- Firebase 项目配置

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/movix-app.git
   cd movix-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   创建 `.env.local` 文件并添加以下配置：
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:5173`

## 📱 API 集成

### TMDb API
本应用使用 [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) 获取电影数据：

- 热门电影
- 分类电影
- 电影搜索
- 电影详情
- 相似电影推荐

### Firebase Services
- **Authentication**: 用户注册、登录、登出
- **Firestore**: 用户数据和收藏列表存储
- **Hosting**: 应用部署（可选）

## 🏗️ 项目结构

```
movix-app/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── ui/            # 通用 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── LoadingBar.tsx
│   │   ├── CommentSection.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Header.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── MovieCard.tsx
│   │   ├── MovieCarousel.tsx
│   │   └── VideoBackground.tsx
│   ├── context/           # React Context
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/             # 自定义 Hooks
│   ├── lib/               # 工具库和配置
│   │   ├── firebase.ts
│   │   └── utils.ts
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MovieDetails.tsx
│   │   ├── MyList.tsx
│   │   ├── Register.tsx
│   │   └── Search.tsx
│   ├── services/          # API 服务
│   │   ├── firebase.ts
│   │   ├── mockFirebase.ts
│   │   └── tmdb.ts
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── package.json
├── tailwind.config.js     # Tailwind 配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 🎨 设计特色

### Netflix 风格界面
- 深色/浅色双主题支持
- 红色品牌色调 (#E50914)
- 现代化卡片布局
- 流畅的悬停效果
- 视频背景 Hero Banner

### 响应式设计
- 移动优先的设计理念
- 平板和桌面设备完美适配
- 灵活的网格布局
- 优化的触摸交互
- 响应式导航栏

### 用户体验优化
- 渐进式加载动画
- 红色进度条加载指示
- 平滑的页面过渡
- 直观的导航设计
- 智能 Hover 信息展示
- 评分圆环动态颜色
- 无限循环轮播体验

### 高级交互
- **按住滑动**：按住箭头连续滚动电影列表
- **主题切换**：一键切换深色/浅色模式
- **视频预告**：点击播放按钮观看 YouTube 预告片
- **评分系统**：Conic gradient 显示评分进度

## 🧪 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码质量检查
npm run lint

# 预览生产构建
npm run preview
```

## 📦 构建和部署

### 本地构建
```bash
npm run build
```

构建文件将生成在 `dist/` 目录下。

### 部署选项

#### Bluehost（共享主机 / cPanel）

1) 手动部署（最快）

- 运行 `npm run build`，得到 `dist/` 目录
- 登录 cPanel → File Manager → 进入 `public_html/`
- 上传 `dist/` 内的所有文件到 `public_html/`
- 确保把仓库中的 `public/.htaccess` 一并上传到根目录（`public_html/.htaccess`），用于 SPA 路由
- 若显示 404/刷新白屏，多半是缺 `.htaccess`

2) GitHub Actions 自动部署（推荐）

- 在 GitHub 仓库中添加 Secrets：`FTP_HOST`、`FTP_USERNAME`、`FTP_PASSWORD`
- 默认部署到 `public_html/`，可在 `.github/workflows/deploy-bluehost.yml` 中调整
- 推送到 `main` 分支即自动构建并通过 FTPS 同步 `dist/`

注意：若你的 Bluehost 仅支持 FTP（不支持 FTPS），可将 `protocol: ftps` 改为 `ftp`。

#### Vercel 部署
```bash
npm i -g vercel
vercel
```

#### Netlify 部署
```bash
npm run build
# 将 dist 目录拖拽到 Netlify
```

#### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔧 自定义配置

### Tailwind CSS 主题
在 `tailwind.config.js` 中自定义颜色和样式：

```javascript
theme: {
  extend: {
    colors: {
      netflix: {
        red: '#E50914',
        black: '#141414',
        gray: '#2A2A2A',
        lightGray: '#B3B3B3',
      }
    }
  }
}
```

### Firebase 配置
在 `src/lib/firebase.ts` 中配置 Firebase 服务：

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...其他配置
}
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。查看 [LICENSE](LICENSE) 文件了解更多详情。

## 🙏 致谢

- [The Movie Database (TMDb)](https://www.themoviedb.org/) - 提供电影数据 API
- [Firebase](https://firebase.google.com/) - 后端服务和认证
- [React](https://reactjs.org/) - 前端框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-username/movix-app/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对您有帮助，请给它一个星标！