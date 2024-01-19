# 餐廳論壇 

## 介紹
-製作一個餐廳論壇網站，介面區分為前台使用者及後台管理者 

## 網站功能
-前台功能: 
* 使用者可以註冊/登入/登出網站 
* 使用者可以透過Facebook登入此網站 
* 使用者可以瀏覽所有餐廳與個別餐廳詳細資料 
* 使用者可以在瀏覽所有餐廳資料時，可以用分類篩選餐廳 
* 使用者可以對餐廳留下評論 
* 使用者可以收藏/取消收藏餐廳 
* 使用者可以點讚/取消點讚餐廳 
* 使用者可以查看最新上架的 10 筆餐廳 
* 使用者可以查看最新的 10 筆評論 
* 使用者可以編輯自己的個人資料 
* 使用者可以查看自己評論過、收藏過的餐廳 
* 使用者可以追蹤/取消追蹤其他的使用者 

後台功能: 
* 只有管理者可以進去管理後台 
* 管理者擁有一般使用者全部在餐廳論台上的操作功能 
* 管理者可以新增/修改/刪除一家餐廳 
* 管理者可以刪除餐廳的評論 
* 管理者可以瀏覽全部已註冊使用者清單 
* root管理員帳號可設定/取消其他使用者帳號的管理者權限，root管理員帳號本身管理者權限不可修改 
* 管理者可以新增/修改/刪除餐廳分類 

## 啟動專案
1. 確認已經安裝node.js以及npm 
2. 使用終端機將專案複製到本地 
```
$ git clone https://github.com/vicky160671014/forum-express-grading-github-actions.git
``` 
3. 進入專案資料夾
```
$ cd forum-express-grading-github-actions
```
4. 安裝相關套件
```
$ npm install
```
5. 使用MySQL server，建立資料庫: 
```
CREATE DATABASE `forum`
```
6. 於終端機透過sequelize-cli執行migration，建立資料表:
```
$ npx sequelize db:migrate 
```
7. 建立種子資料，請輸入以下指令:
```
$ npx sequelize db:seed:all
```
8. 於根目錄下建立upload和temp資料夾
```
$ mkdir upload 
```
```
$ mkdir temp 
```
9. 啟動專案
```
$ npm run start
```
成功時，終端機會顯示以下訊息，請打開瀏覽器進入網址(http://localhost:3000):
```
Example app listening on port 3000!
```
10. 若要暫停使用，則在終端機輸入:
```
ctrl + c
```

## 試用帳號
```
管理者帳號:
帳號: root@example.com
密碼: 12345678

使用者帳號:
帳號: user1@example.com
密碼: 12345678
帳號: user2@example.com
密碼: 12345678
```