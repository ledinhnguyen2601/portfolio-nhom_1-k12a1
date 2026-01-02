exports.handler = async function (event, context) {
  // 1. Cấu hình CORS (Để trình duyệt không chặn)
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

    // 2. LẤY KEY TỪ BIẾN MÔI TRƯỜNG (BẢO MẬT)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "Lỗi Server: Chưa cấu hình biến GEMINI_API_KEY trên Netlify."
      );
    }

    // 3. CẤU HÌNH MODEL CHUẨN (Lấy từ danh sách cụ vừa check)
    const model = "gemini-2.5-flash";

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 4. GỌI GOOGLE
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

    // 5. KIỂM TRA LỖI
    if (data.error) {
      console.error("Google Error:", JSON.stringify(data.error));
      throw new Error(`Lỗi từ Google: ${data.error.message}`);
    }

    // 6. TRẢ VỀ KẾT QUẢ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Lỗi:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
