const express = require('express');
const axios = require('axios');
const app = express();

// Tự động nhận cổng từ Render, nếu chạy local sẽ dùng port 3000
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Trang chủ kiểm tra trạng thái server
app.get('/', (req, res) => {
    res.send('API Proxy MoMo (Túi Thần Tài) đang hoạt động mượt mà!');
});

// Endpoint lấy lịch sử giao dịch
app.all('/api/momo/history', async (req, res) => {
    try {
        const momoUrl = 'https://api.momo.vn/transhis/api/transhis/golden-pocket/trans/browse';

        // Hệ thống sẽ ưu tiên đọc các mã khóa từ biến môi trường (Render Env)
        // Nếu không có biến môi trường, nó sẽ dùng giá trị mặc định (nhưng dễ hết hạn)
        const headers = {
            'Host': 'api.momo.vn',
            'sessionKey': process.env.MOMO_SESSION_KEY || '81c9be05-cfb3-4314-b15c-26f6019a06e5',
            'app_code': '5.10.1',
            'userId': '01682962182',
            'user_phone': '01682962182',
            'User-Agent': 'MoMoPlatform Store/5.10.1.51001 CFNetwork/1410.1 Darwin/22.6.0 (iPhone X iOS/16.7.11) AgentID/110335164',
            'lang': 'vi',
            'device_performance': 'low-end',
            'app_version': '51001',
            'wbmky': process.env.MOMO_WBMKY || 'EhNgeYxWWeOB7YKNuL3aFvJ3Jb5uUDL2D2U/i2tPfA01bwUfD0qa9O2sNFwa2SKks+A4SG6My6jNRk/9/pbDzFyvqzDWekaAW8yuuXtbLJpMFyHbe6uyu0nFWMXnrDLYj2BD+P5DJcGl840f6+H45mOR2prOgfLz/7N4evGkylu8y6C4qy1haClaz125gqJvL3083NWEzkAZ2PgKf5oh+ku4DHSQz1R+QoPJ12jdS8hCGRYEszXoJhoFteklqvVH1zoGUeYXVaSUCnRPdwMyHtnHt8vXzbhu8Z7xnc3qgzFIlmlWvh3fb8TUX7xIndtgDLPRcnrxIoEzjwzNTh3otQ==',
            'Accept-Language': 'vi-VN,vi;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'channel': 'APP',
            'wbmtd': process.env.MOMO_WBMTD || '6n3cNiN4wDbBIPhf497+pZ0XwV7djM3QdLm6ugMtlNe+S6hKsL0pY0OGk+sakeAaOo0VWA099aBwcimn8FVGX+Z27A4H+iwS0EoM5EGcc5kO5W/n850wM0NE0BB/a+aJrNoIq3Vnshk5j4FN7AAoNFLm72EodmDCGNSMNVELXV22wBZueMwhp9qavTQBS6MsxgM1J/ekjb8Sup587sXHw7qIvRpVcEp44U90gdUw64yokvtNNFJeyZEHwdymqRv3MNqP0HuKAe81Lk5NLSkVnjx8un5141NmYeABXz5bRGC8FR9l5IKRwx7ISoonnWPz0O8sgK3sNAuPuK6NaWp7sGxtX4wfOSCxxNl9Jt7SnV+d+HYyFBi1Oz7fdIUZCdeQQpIKnj0BSnJW9Qq8VQJu8Ci/mpu0zNfZi0ercTm6V/YU6cLdSn55Gd3m3ubgoNI31cCFuYFifN7tnSUuej1BsSRm4KJtouHWYN5DSMYiPKjphcNhOLLTX/WOs+CBAx+60ealYJ5AzqHZluNuFq6Rq33jXL7u+f1T2msRlcXQwHrc887egpSyJzHGfp+d9R4k6srAi1nqtDVZz3yhNNZ7r3Mp/v330sTY0WpNCkZCZj+axfKoWZCdNiR9ZQ30Y5T5DFH0yuBNInYwNXGKNzg9yNDfmCd55yhScuivlFCStWOSwCj2CVVXjPCvPhiyT7Nu6p0Y7d+CLUDVUx6Rxzit/jItr/Y2xxHucSSZsLJkLgJJXt2uqpqNKBs0Ic+YU/reREfu9eYNYq9xmv2w2/CgH+v1iagteLjXES/Q5VqItAPyPgTYMJNYJz5CRKSFTe6tNe/Idogh4fZiSfQ3gK+FxVrYHUEBsxUsjkPJzwDZPqY2pdhyV5C05tDQVCW4mFURcKKTnW1S1BytfxHzvyfW2r9ULXUjin1xVO1M38eONryk0lLN4/v33aMG52+mmm2Kc8cN3Z/NQ21faZIbCQWdtgBRiiWS6bl10LNFqum+MqOZTYVhdQyMv8hZK3yn7YyQMHTawQrdB2cv0x6x48CK2U85hiXiQIlDNFckRh5b6t9KQZuVVOzwUVb+sdfxVqbU5RB8ctRy5pswts2HsJky/gut1O3m6yqPraIx4w9khy2fq4d77JIHlo0vdrECrJ/N851R9ceac7DJ8yJBMZwmxvtetyfrCyOYM7pv7mljP8R5e1tWB6Mh4bIceiggGZSzQGjz9KpLxhE0EOcvBnCT1EAoaAwEKFk1lJRBdPVeYarMBOWqy43OQd8je3IGC/aRpScV2yqeTcuVlLEJe0GHKVqTjYGpNZmQHQR+9ndnlzFabXPRdiP/l+MK/rsIMoUyIhAqREIkUpMZaHYUwRdFPVXiAUC7NaoT4kdGVEobWCcHh0t407XwL+OGa9neQXVK',
            'momo-session-key-tracking': 'C0212588-1719-4018-B7C6-C7C3DEB834CF',
            'wbCode': '0&1782452655534',
            'baggage': 'sentry-environment=PRODUCTION,sentry-public_key=6e80c9f01f2440c9be5b37606028f996,sentry-release=vn.momo.platform.ios%405.10.1%2B51001,sentry-trace_id=eab62ce34816421ab45d54e745a896d7',
            'Authorization': process.env.MOMO_AUTH_TOKEN || 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyIjoiMDE2ODI5NjIxODIiLCJpbWVpIjoiNTAxMDMtMGUyYjQ4NTRkNzdhNTAyMWYzYTQ0N2JlN2ZkOTY1NGYwMDQ2ZDZjNDVkZWI0YWI5YzhiNjQwYjUwNzgxN2VlZiIsImhJbWVpIjoiQmV4RjYvbnliOW9mNlUySGVJZVBwQnBOdlY5dk1TZE1wRXZuMTdrVkY3bnpxWW1Sdis3dTRCMnVmTmFFLzV0TkswdTd0eEJKRG40S280bWRnVkRQV05wTVF4d01CZ3NvYUc1M3gzeGc3REU9IiwiTUFQX1NBQ09NX0NBUkQiOjAsIk5BTUUiOiJUcuG6p24gTmjhuq10IEhvw6BuZyIsIkRFVklDRV9PUyI6ImlvcyIsIkFQUF9WRVIiOjUxMDAxLCJhZ2VudF9idSI6MTEwMzM1MTY0LCJzZXNzaW9uS2V5IjoiNUVSd2lyc0k2VE5GNXpoUjJrOVZXVmlWc0h3N1lRZWUrNVZoWTJicHQwZE9GbFBIcjZDNDV3PT0iLCJ1c2VyX3R5cGUiOjEsImtleSI6Im1vbW8iLCJyYXBpZF9pZCI6Ikw0Y3Q5TEJONEtkQlpHdGZBekRkamdpbW02WU43a0kweVVCRXlaQnFIeWdwUS9vVkg4V3lBZmNYa3dReHlsWSt5R1pjaGlCTlp3MD0iLCJ1aWQiOiIwMzgyOTYyMTgyIiwiZXhwIjoxNzgyNDU4MDMxfQ.GoXYObpFVHA33E9RNhp-6Pc6GFnsP0nxjH53emrCy0vUop_D4mwuBTSt1VjK1OnbmNnrf5ISGdjXuFUc6fBVLC85wHiiF1XrOIA0-IXtzqPC7Uq_k33oxgTSWo_qO2nXGuH77oGuRmxgPgleR8OcMnuyk2gYW2rC8vNZ5cuVU-upmGKhPH8Jbit28Je2EZBf5fzCOR86BrvABJ7IpkBJdfL7VIB7kX1O_6gBq13krW9Stmn6kafJPPv_umktMuJkLj-P4TGy2Jz2GpP9hgWHJP03jvgji_sMOL9dYVMFIJ0-NVQNXeqyjZPrD0lmWfbR2zQc_YbmN_ghTrMN33Z1FQ',
            'env': 'production',
            'app_type': 'production',
            'device_os': 'IOS',
            'http-process-timestamp': '1782452655534',
            'timezone': 'Asia/Ho_Chi_Minh',
            'Accept-Charset': 'UTF-8',
            'Accept': 'application/json',
            'agent_id': '110335164',
            'Content-Type': 'application/json',
            'sentry-trace': 'eab62ce34816421ab45d54e745a896d7-808ad62f72b14766-0',
            'wbSign': process.env.MOMO_WBSIGN || '1B6ofYJSG3BxCKro5jTjvjJwEbmR/0Qg146m9Rk0y0ATclQjplbFfLh0oaGeATqOVXH2TTSm++2GkoNWLDUslC2Cpd8KMZInRS/9NMuGvWntiA==',
            'platform-timestamp': '1782452655535'
        };

        // Nhận body từ request bạn gửi lên proxy (nếu có), nếu không có sẽ tự tạo body mặc định
        const requestBody = req.body && Object.keys(req.body).length > 0 ? req.body : {
            "offset": 0,
            "limit": 20
        };

        // Thực hiện request gọi trực tiếp lên máy chủ MoMo
        const response = await axios.post(momoUrl, requestBody, { headers });

        // Trả kết quả thành công về cho thiết bị của bạn
        res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error("Lỗi kết nối MoMo API:", error.message);
        
        // Trả về chi tiết lỗi từ MoMo để bạn biết chính xác cần đổi mã gì
        res.status(error.response ? error.response.status : 500).json({
            success: false,
            message: "Không thể lấy dữ liệu từ MoMo",
            error: error.response ? error.response.data : error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server đã được sửa lỗi hoàn chỉnh và đang chạy tại cổng ${PORT}`);
});
