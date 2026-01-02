exports.handler = async function (event, context) {
  // Cấu hình CORS để trình duyệt không chặn
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

    // ⚠️ QUAN TRỌNG: Cụ xóa dòng chữ bên dưới và dán KEY MỚI của cụ vào giữa 2 dấu ngoặc kép ""
    const apiKey = "AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g";

    // Kiểm tra xem cụ đã dán key chưa
    if (apiKey === "AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g") {
      throw new Error("Cụ ơi, cụ quên dán Key vào code rồi!");
    }

    // Dùng bản 1.5 Flash (Bản này miễn phí và ổn định nhất)
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
                  "Bạn là trợ lý ảo K12A1. Trả lời ngắn gọn: " + userMessage,
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
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
