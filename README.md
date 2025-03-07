# LeetBase BE 0.1.1 
Not for English users 😔. I will update the English version soon.

## Giới thiệu 
LeetBase là một sản phẩm clone của Leetcode, được xây dựng bằng ReactJS và NodeJS. 

Sản phẩm này được sử dụng với mục đích học tập và đánh giá bài tập lớn học phần IT4409 - Công nghệ Web và dịch vụ trực tuyến.

## Cài đặt 

```
git clone https://github.com/Zeann3th/leetclone-be.git 
cd leetclone-be
npm install
```

Trước khi chạy, bạn cần phải tạo một file `.env` trong thư mục gốc của project với nội dung sau:

```
PORT=5000
MONGO_URI=<MONGO_URI> # Lấy từ MongoDB Atlas hoặc local
MONGO_DB_NAME=<DB_NAME> # Tên database
TOKEN_SECRET=<TOKEN_SECRET> # Chuỗi bí mật để tạo access token
REFRESH_TOKEN_SECRET=<REFRESH_TOKEN_SECRET> # Chuỗi bí mật để tạo refresh token 
SMTP_HOST=<SMTP_HOST> # SMTP host để gửi email
SMTP_EMAIL=<SMTP_EMAIL> # Email relay để gửi email đến người dùng
SMTP_SENDER=<SMTP_SENDER> # Email gốc của người gửi
SMTP_PASSWORD=<SMTP_PASSWORD> # Mật khẩu email để gửi email
REDIS_URL=<REDIS_URL> # URL của Redis (có thể lấy ở Render, Upstash hay local)
RAPIDAPI_KEY=<RAPIDAPI_KEY> # API key của RapidAPI để sử dụng API của các bên thứ 3, ở đây dùng Judge0 để thực thi code trên cloud
```

Sau đó, chạy lệnh sau để khởi động server:

```
npm start
```

## APIs

Hướng dẫn API ở đường link [này](https://qqg9tn1jsi.apidog.io)

## Những đầu việc cần làm 

- [] Kiểm thử hộp trắng, đen cho các API đã có
- [] Thiết kế luồng upload file template (dùng để thực thi code và chứa test case) và lấy file template
- [] (Tùy chọn) Thêm Oauth2 để đăng nhập bằng Google, Github 
- [] (Tùy chọn) Thêm chức năng bảng xếp hạng tùy vào số bài đã làm, vào độ khó của bài tập 


