exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Hello";

    // Lấy Key từ Netlify
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Chưa có API Key. Cụ nhớ thêm vào Environment Variables trên Netlify nhé!"
      );
    }

    // --- CẬP NHẬT MỚI NHẤT 2026: Dùng bản 2.5 Flash ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Bạn là trợ lý ảo K12A1. Trả lời ngắn gọn, thân thiện: " +
                  userMessage,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // Kiểm tra xem Google có báo lỗi không
    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Lỗi:", error.message); // Ghi log để dễ check
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
