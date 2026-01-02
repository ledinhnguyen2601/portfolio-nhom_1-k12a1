exports.handler = async function (event, context) {
  // Thêm header để tránh lỗi CORS khi gọi từ trình duyệt
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Xử lý request OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Chưa cấu hình GEMINI_API_KEY trong Netlify");
    }

    // --- SỬA LỖI QUAN TRỌNG: Đã đổi dấu ngoặc đơn ' thành dấu huyền ` ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Bạn là trợ lý ảo Nhóm-1 K12A1. Trả lời ngắn gọn: " +
                  userMessage,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers, // Trả về headers CORS
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers, // Trả về headers CORS ngay cả khi lỗi
      body: JSON.stringify({ error: error.message }),
    };
  }
};
