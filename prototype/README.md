# 微信小程序 · HTML 交互原型（V2）

本目录与 **`miniprogram/`** 同级，专门放**浏览器可打开**的界面原型，**不会**被打进小程序包（微信开发者工具只编译 `miniprogram/` 内页面）。

| 文件 | 说明 |
|------|------|
| **`index.html`** | **UI 总览**，入口指向 V2 全链路 |
| **`v2/flow.html`** | **唯一主原型**：对齐 **`app.json`** 路由（栈式返回 + 暖纸/青黛） |
| **`v2/app.css`** | 页面与组件样式（树、文化 Tab、捐献、动态、绑定、toast 等） |
| **`shared-styles.css`** | **设计变量 + 手机帧布局**（`:root`、`html.proto-mp-root`、`phone-stage`、`bottom-nav` 等） |

旧版 **`flow/full-miniprogram.html`**、**`variants/*.html`** 已移除；请以 **`v2/flow.html`** 为准。

## 预览

```bash
open prototype/index.html
open prototype/v2/flow.html
```

## 管理后台原型

后端/运营用的 **`admin.html`** 仍在 **`genealogy`** 仓库的 `prototype/` 下。若本地将 `genealogy` 与 `genealogy-miniapp` 放在同一父目录（例如 `Vibe-Coding-Projects/`），可从本页顶部链接直接打开；否则请手动打开 `genealogy/prototype/admin.html`。

## 捐献榜单（原型）

「家族文化 → 捐献榜单」按 **活动/项目** 分组（项目名、日期、总额 + 宗亲明细），与 `genealogy-design.md` **§13.5.2** 一致。

## 微信绑定谱员（原型）

「家族文化」Tab 内有绑定示意卡片；族谱树为垂直世系，已绑定用户节点可显示 **「我」** 角标（后端字段就绪后对接）。接口与数据模型见设计文档 **§3.2b**；管理端核对界面见 `genealogy/prototype/admin.html` → **谱员与微信**。

## 家族活动动态（原型）

「家族文化 → **家族活动**」为类朋友圈时间线：管理员发图配文；**点赞、留言**需已绑定谱员（与 §3.2b 一致）。见 **`genealogy-design.md` §13.5.5** 与后台 **`admin.html`** 中「家族活动动态」卡片。

交互：**发布活动**打开底部半屏编辑（示意）；首条动态的 **赞** 可点击切换「已赞」与计数。

## 流程约定

先确认本目录 HTML，再改 `miniprogram/` 下的 WXML/WXSS/JS。详见主设计文档 `genealogy/genealogy-design.md` §14.3。
