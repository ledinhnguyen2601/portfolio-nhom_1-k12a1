exports.handler = async function (event, context) {
  // 1. Chỉ nhận lệnh POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Hello";

    // 2. Lấy chìa khóa
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Chưa nhập API Key trên Netlify" }),
      };
    }

    // 3. Cấu hình gọi Google AI (Dùng model chuẩn: gemini-1.5-flash)
    // Lưu ý: Tôi đã viết thẳng tên model vào đây
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 4. Gọi API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Bạn là trợ lý ảo của nhóm K12A1. Hãy trả lời ngắn gọn câu hỏi: " +
                  userMessage,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // 5. Kiểm tra lỗi từ Google (nếu có)
    if (data.error) {
      console.log("Lỗi Google:", data.error);
      // Trả về lỗi chi tiết để bạn dễ sửa
      return { statusCode: 400, body: JSON.stringify(data) };
    }

    // 6. Thành công
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Lỗi Server:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
