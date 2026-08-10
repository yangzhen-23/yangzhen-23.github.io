# YangZhen 的个人主页与博客

这是 `https://yangzhen-23.github.io/` 的源码仓库。网站使用 Astro 生成静态页面，包含个人主页、公开项目、Markdown 博客、分类、标签、归档、搜索和 RSS。

## 第一次在本地运行

需要安装 [Node.js 24](https://nodejs.org/) 和 Git。进入项目目录后执行：

```powershell
npm install
npm run dev
```

终端会显示本地地址，通常是 `http://localhost:4321/`。按 `Ctrl+C` 可以停止本地服务。

## 发布前检查

```powershell
npm run validate
```

这个命令会依次完成：

1. Astro 和 TypeScript 检查；
2. 单元测试；
3. 生产构建；
4. 必要页面、失效路径和错误链接检查。

全部通过后，构建结果位于 `dist/`。它由程序自动生成，不需要手动修改或提交。

## 写一篇新文章

在 `src/content/blog/` 中新建英文小写文件，例如：

```text
src/content/blog/my-first-project.md
```

文件开头使用以下模板：

```yaml
---
title: "文章标题"
description: "一两句话说明文章解决什么问题"
publishedAt: "2026-08-11T09:00:00+08:00"
category: "项目实践"
tags:
  - "Python"
  - "计算机视觉"
cover: "/images/my-first-project/cover.png"
draft: true
---
```

然后在第二个 `---` 下方写 Markdown 正文。常用语法：

````markdown
## 二级标题

普通段落，使用 **加粗** 标出重点。

![图片说明](/images/my-first-project/example.png)

```python
print("代码块")
```

行间公式：

$$
E = mc^2
$$
````

图片放在 `public/images/文章目录名/`，正文路径从 `/images/` 开始。图片必须写清楚替代文字；论文图片还要在附近标注来源。

写作期间保持 `draft: true`，文章不会进入公开页面。完成后改为 `draft: false`，运行 `npm run validate`，确认无误再提交。

## 网站内容位置

| 内容 | 文件位置 |
| --- | --- |
| 个人名称、邮箱、GitHub、ORCID | `src/lib/site.ts` |
| 项目卡片 | `src/data/projects.ts` |
| 博客文章 | `src/content/blog/` |
| 文章图片 | `public/images/` |
| 全站颜色和排版 | `src/styles/global.css` |

## GitHub Pages 首次发布

远程仓库名称必须是：

```text
yangzhen-23.github.io
```

代码第一次推送到 `main` 后，在 GitHub 打开：

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

之后每次推送到 `main`，`.github/workflows/deploy.yml` 都会自动检查、构建并发布网站。部署完成后访问：

```text
https://yangzhen-23.github.io/
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 本地写作和预览 |
| `npm run check` | 检查 Astro、内容字段和 TypeScript |
| `npm test` | 运行单元测试 |
| `npm run build` | 生成生产网站 |
| `npm run verify` | 检查构建产物 |
| `npm run validate` | 运行全部发布前检查 |
