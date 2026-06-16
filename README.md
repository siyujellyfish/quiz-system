# 刷題系統

這是一個以 Next.js 建立的本機刷題系統，目前內建 CSA v2 與 CTIA 兩份題庫。系統支援題庫切換、練習模式、錯題模式與模擬測驗，並會在每輪練習中隨機排序題目與選項。

## 功能

- 題庫切換：目前提供 `CSA v2 全題庫` 與 `CTIA 全題庫`。
- 練習模式：逐題作答、即時判分、顯示正確/錯誤/未作答與正確率。
- 錯題模式：答錯題目會保存到瀏覽器 `localStorage`，可集中複習。
- 模擬測驗：整份題庫作答完成後提交，顯示分數、錯題與正解。
- 暗色模式：預設跟隨系統偏好，手動切換後會保存到瀏覽器。
- 題庫重建：可從 Google Forms 匯出的 HTML 重新抽取題庫 JSON。

## 環境需求

- `mise`
- Node.js 24
- `pnpm`

本專案包含 `.mise.toml`，可用 mise 載入 Node 24：

```bash
mise install
mise trust
```

## 安裝與啟動

```bash
pnpm install
pnpm dev
```

啟動後開啟：

```text
http://localhost:3000
```

## 常用指令

```bash
pnpm extract:questions
pnpm test
pnpm lint
pnpm build
pnpm start
```

用途：

- `pnpm extract:questions`：從題庫 HTML 重新產生 JSON。
- `pnpm test`：執行 Vitest 測試。
- `pnpm lint`：執行 ESLint。
- `pnpm build`：建立 production build。
- `pnpm start`：啟動 production server。

## 題庫資料

來源 HTML：

- `CSA v2 題庫.html`
- `CTIA 全題庫測驗（順序隨機，每次不同）.html`

產出 JSON：

- `src/data/csa-v2-questions.json`
- `src/data/ctia-questions.json`

題庫抽取邏輯位於 `scripts/extract-questions.mts` 與 `src/lib/quiz/parser.ts`。Parser 會讀取 Google Forms 的 `FB_PUBLIC_LOAD_DATA_`，並從 score page 的題目區塊中擷取正解。

## 專案結構

```text
src/app/                 Next.js app router 頁面
src/components/quiz/     刷題系統 UI
src/components/ui/       基礎 UI 元件
src/data/                題庫 JSON
src/lib/quiz/            題庫、練習、錯題、測驗與 parser 邏輯
scripts/                 題庫抽取腳本
backlog/                 Backlog 任務紀錄
```

## Release

0.1 beta 使用以下版本與 tag：

```text
package version: 0.1.0-beta.1
git tag: v0.1.0-beta.1
release title: 0.1 beta
```

本專案保留 `private: true`，不發布到 npm。Release 目標是 GitHub repository 與 GitHub release source package。
