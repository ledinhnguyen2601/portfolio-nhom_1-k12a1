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

    // --- KEY CỦA CỤ ĐÂY (Mình lấy từ ảnh cụ gửi) ---
    const apiKey = "AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g";

    // Cấu hình gọi Google (Gemini 1.5 Flash)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Bạn là trợ lý ảo NHOM 1 K12A1. Trả lời ngắn gọn: " +
                  userMessage,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500, // Trả lỗi về để cụ biết nếu có
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
