# 微信小程序 · HTML 交互原型

本目录与 **`miniprogram/`** 同级，专门放**浏览器可打开**的界面原型，**不会**被打进小程序包（微信开发者工具只编译 `miniprogram/` 内页面）。

| 文件 | 说明 |
|------|------|
| **`index.html`** | 小程序 UI v2：首页、族谱树、家族文化、创建家族 |
| **`shared-styles.css`** | 色板与圆角变量，实现 WXSS 时可对照 |

## 预览

```bash
# 本仓库根目录下
open prototype/index.html
```

## 管理后台原型

后端/运营用的 **`admin.html`** 仍在 **`genealogy`** 仓库的 `prototype/` 下。若本地将 `genealogy` 与 `genealogy-miniapp` 放在同一父目录（例如 `Vibe-Coding-Projects/`），可从本页顶部链接直接打开；否则请手动打开 `genealogy/prototype/admin.html`。

## 流程约定

先确认本目录 HTML，再改 `miniprogram/` 下的 WXML/WXSS/JS。详见主设计文档 `genealogy/genealogy-design.md` §14.3。
