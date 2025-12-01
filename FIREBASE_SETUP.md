# Firebase 设置指南

本指南将帮助你配置 Firebase，以便使用 Blog-JobGen 的管理员功能。

## 📋 前置要求

- Google 账号
- Node.js 和 npm 已安装

## 🚀 步骤 1: 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "添加项目"
3. 输入项目名称（例如：blog-jobgen）
4. 按照提示完成项目创建

## 🔧 步骤 2: 启用 Firebase 服务

### 2.1 启用 Authentication（认证）

1. 在 Firebase Console 左侧菜单，点击 "Authentication"
2. 点击 "Get Started"
3. 在 "Sign-in method" 标签下，启用 "Email/Password"
4. 点击 "添加新用户" 创建管理员账号
   - 输入管理员邮箱（例如：admin@yourdomain.com）
   - 输入密码
   - 点击 "添加用户"

### 2.2 启用 Firestore Database（数据库）

1. 在左侧菜单点击 "Firestore Database"
2. 点击 "Create database"
3. 选择 "Start in production mode"（生产模式）
4. 选择数据库位置（推荐选择离你最近的区域）
5. 点击 "Enable"

### 2.3 设置 Firestore 安全规则

在 "Firestore Database" → "Rules" 中，设置以下规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 只允许认证用户读写
    match /{document=**} {
      allow read: if true;  // 公开读取
      allow write: if request.auth != null;  // 仅认证用户可写
    }
  }
}
```

点击 "发布" 保存规则。

### 2.4 启用 Storage（存储）

1. 在左侧菜单点击 "Storage"
2. 点击 "Get started"
3. 使用默认安全规则
4. 选择存储位置
5. 点击 "Done"

### 2.5 设置 Storage 安全规则

在 "Storage" → "Rules" 中，设置以下规则：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;  // 公开读取
      allow write: if request.auth != null;  // 仅认证用户可写
    }
  }
}
```

## 🔑 步骤 3: 获取 Firebase 配置

1. 在 Firebase Console，点击项目设置（齿轮图标）
2. 滚动到 "Your apps" 部分
3. 点击 "Web" 图标（</>）添加 Web 应用
4. 输入应用昵称（例如：blog-jobgen-web）
5. 不需要勾选 "Firebase Hosting"
6. 点击 "Register app"
7. 复制显示的配置对象

配置对象类似于：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## 📝 步骤 4: 配置应用

1. 打开 `src/firebase/config.js`
2. 将你的 Firebase 配置替换到文件中：

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📊 步骤 5: 初始化数据（可选）

如果你想从现有的 JSON 数据迁移到 Firebase，可以使用以下脚本：

创建 `scripts/migrate-to-firebase.js`：

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import blogData from '../src/data/blogData.json' assert { type: 'json' };
import firebaseConfig from '../src/firebase/config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
  try {
    // 迁移文章
    for (const article of blogData.articles) {
      await setDoc(doc(db, 'articles', article.id), article);
      console.log(`Migrated article: ${article.id}`);
    }

    // 迁移分类
    for (const category of blogData.categories) {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`Migrated category: ${category.id}`);
    }

    // 迁移 timeline
    for (const phase of blogData.timeline) {
      await setDoc(doc(db, 'timeline', phase.id), phase);
      console.log(`Migrated timeline phase: ${phase.id}`);
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
```

运行迁移脚本：

```bash
node scripts/migrate-to-firebase.js
```

## 🎯 步骤 6: 测试管理员功能

1. 启动开发服务器：

```bash
npm run dev
```

2. 访问管理员登录页面：

```
http://localhost:5173/admin/login
```

3. 使用你在步骤 2.1 创建的管理员账号登录

4. 你应该能看到管理员仪表板，可以：
   - 查看所有文章
   - 创建新文章
   - 编辑现有文章
   - 删除文章
   - 上传图片

## 🔒 安全建议

1. **不要将 Firebase 配置文件提交到公开仓库**
   - 将 `src/firebase/config.js` 添加到 `.gitignore`
   - 使用环境变量存储敏感信息

2. **使用强密码**
   - 为管理员账号设置复杂密码

3. **定期检查 Firestore 规则**
   - 确保只有认证用户可以写入数据

4. **启用 App Check**（高级）
   - 防止滥用 API

## 🌐 生产环境部署

### 使用环境变量

1. 创建 `.env` 文件：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. 更新 `src/firebase/config.js`：

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

3. 在部署平台（Vercel, Netlify 等）设置相同的环境变量

## 📚 管理员功能说明

### 文章管理
- **查看文章**：在仪表板中查看所有文章列表
- **搜索文章**：根据标题、分类或作者搜索
- **创建文章**：点击 "新建文章" 按钮
- **编辑文章**：点击文章行的编辑图标
- **删除文章**：点击删除图标，确认后删除

### 图片上传
- 在文章编辑器中点击 "上传图片"
- 选择图片文件（最大 5MB）
- 图片将自动上传到 Firebase Storage
- Markdown 图片代码会自动插入到内容中

### 内容编辑
- 使用 Markdown 格式编写内容
- 支持多个段落/章节
- 每个段落独立编辑

## ❓ 常见问题

### Q: 登录时提示 "网络错误"
A: 检查 Firebase 配置是否正确，确保已启用 Email/Password 认证。

### Q: 无法上传图片
A: 确保已启用 Firebase Storage，并设置了正确的安全规则。

### Q: 文章保存失败
A: 检查 Firestore 安全规则，确保认证用户有写入权限。

### Q: 图片无法显示
A: 检查 Storage 安全规则，确保允许公开读取。

## 📞 获取帮助

如有问题，请：
1. 查看 [Firebase 文档](https://firebase.google.com/docs)
2. 检查浏览器控制台的错误信息
3. 提交 GitHub Issue

---

祝你使用愉快！🎉
