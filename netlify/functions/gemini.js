exports.handler = async function (event, context) {
  // Chỉ chấp nhận method POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Xin chào";

    // Lấy API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Thiếu API Key trên Netlify" }),
      };
    }

    // --- SỬA LỖI TẠI ĐÂY: Dùng model 'gemini-1.5-flash-latest' ---
    // Đây là phiên bản ổn định nhất hiện nay
    const modelName = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Bạn là trợ lý ảo K12A1. Hãy trả lời ngắn gọn: " +
                  userMessage,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // Kiểm tra nếu Google báo lỗi
    if (data.error) {
      console.log("Lỗi từ Google:", data.error);
      return { statusCode: 400, body: JSON.stringify(data) }; // Trả về lỗi gốc để dễ debug
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Lỗi Server:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Lỗi Server: " + error.message }),
    };
  }
};
