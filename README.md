# yinian_card 一念測驗卡

GitHub Pages：https://csky8888.github.io/yinian_card/

| 頁面 | 檔案 | 說明 |
| --- | --- | --- |
| 入口 | `index.html` | 兩張測驗卡的入口（含 GA4） |
| 一念 · 形象與心智覺察測驗（8 題＋領取名單） | `yinian_fengshui.html` | 名單送 Apps Script → Google Sheets＋Gmail 通知 |
| 108 · 此刻真言（6 題） | `index1.html` | GA4 事件版 |
| 舊連結相容轉址 | `yinian.html` | 自動轉到 `yinian_fengshui.html` |

## 線上設定

- GA4 串流：`一念測驗卡`，`https://csky8888.github.io/yinian_card/`，評估 ID `G-TWPS612TK0`
  （三個 html 檔都已內嵌 gtag.js；事件：`start_quiz` / `complete_quiz` / `generate_lead` / `share`）
- Apps Script Web App：`https://script.google.com/macros/s/AKfycbzdsz450B7XhwQyTJDpdZtR4hDgP9sMdmhkFVg_BB8e8UU6klJH6JAZ6GqkApGD7ZCh/exec`
- 通知信箱：`csky8888@gmail.com`（由 Apps Script 端寄出，前端只送資料過去）

前端送出的 JSON（`Content-Type: text/plain`，避免 CORS 預檢）：

```json
{ "contact": "LINE ID 或 Email", "type": "self_worth", "page": "yinian_fengshui",
  "url": "https://…", "ua": "…", "date": "2026-09-04T…" }
```

## Apps Script 對照實作

`apps_script.example.gs` 是可直接貼上部署的範例（第一次部署選「執行身分：我」、
「具有存取權的使用者：所有人」）。它會：

1. `doPost` 把每一筆寫進試算表（欄位：時間 / contact / type / page / url / ua）
2. 寄通知信到 `csky8888@gmail.com`
3. `doGet` 回傳 `{"ok":true}`，方便驗證部署是否成功

## 上線後驗證（照順序）

1. 開 `https://csky8888.github.io/yinian_card/`，入口頁正常、點得進兩張卡
2. GA4 即時報表（報表 → 即時）看得到自己；完整走完一次測驗，`complete_quiz` 帶 `result_type`
3. 在結果頁送出 Email／LINE ID → 試算表多一列 → 信箱收到通知信
4. 若試算表沒增列：到 Apps Script「執行作業」看錯誤；最常見是「試算表 ID 沒換」或
   「部署後改了程式卻沒按『管理部署作業 → 新版本』」
