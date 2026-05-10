# 微信小程序 · HTML 交互原型

本目录与 **`miniprogram/`** 同级，专门放**浏览器可打开**的界面原型，**不会**被打进小程序包（微信开发者工具只编译 `miniprogram/` 内页面）。

| 文件 | 说明 |
|------|------|
| **`index.html`** | **UI 方案总览**：三选一进入完整手机框原型 |
| **`variants/v1-warm-paper.html`** | 方案一：暖纸墨线（褐红主色，树 Tab 为占位） |
| **`variants/v2-celadon.html`** | 方案二：青黛文博（冷绿主色） |
| **`variants/v3-vertical-tree.html`** | 方案三：暖纸 + **垂直世系树**组件 |
| **`shared-styles.css`** | 色板与圆角变量，实现 WXSS 时可对照 |

## 预览

```bash
open prototype/index.html
# 再点击方案卡片，或直达：
open prototype/variants/v3-vertical-tree.html
```

## 管理后台原型

后端/运营用的 **`admin.html`** 仍在 **`genealogy`** 仓库的 `prototype/` 下。若本地将 `genealogy` 与 `genealogy-miniapp` 放在同一父目录（例如 `Vibe-Coding-Projects/`），可从本页顶部链接直接打开；否则请手动打开 `genealogy/prototype/admin.html`。

## 捐献榜单（原型）

「家族文化 → 捐献榜单」按 **活动/项目** 分组（项目名、日期、总额 + 宗亲明细），与 `genealogy-design.md` **§13.5.2** 一致。

## 流程约定

先确认本目录 HTML，再改 `miniprogram/` 下的 WXML/WXSS/JS。详见主设计文档 `genealogy/genealogy-design.md` §14.3。
