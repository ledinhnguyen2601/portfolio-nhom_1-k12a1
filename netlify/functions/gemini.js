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

    // -----------------------------------------------------------
    // ⚠️ QUAN TRỌNG: CỤ DÁN KEY MỚI VÀO GIỮA 2 DẤU NGOẶC KÉP DƯỚI ĐÂY
    // -----------------------------------------------------------
    const apiKey = "AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g";

    // Kiểm tra Key
    if (!apiKey || apiKey.includes("AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g")) {
      throw new Error("Cụ ơi, cụ chưa dán Key vào code rồi! (Dòng 19)");
    }

    // Kiểm tra Server Netlify có hỗ trợ fetch không
    if (typeof fetch === "undefined") {
      throw new Error(
        "Lỗi Server Netlify: Phiên bản Node quá cũ (fetch is undefined). Cụ cần thêm biến NODE_VERSION = 20 trên web Netlify."
      );
    }

    // Cấu hình gọi Google
    const model = "gemini-1.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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

    // Nếu Google báo lỗi (ví dụ Key hỏng, Model sai)
    if (data.error) {
      throw new Error(
        `Lỗi từ Google (${data.error.code}): ${data.error.message}`
      );
    }

    // Trả về kết quả thành công
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // 🚑 CẤP CỨU: Biến lỗi thành tin nhắn chat để cụ nhìn thấy ngay
    const errorReply = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: `❌ TÌM RA BỆNH RỒI CỤ ƠI:\n\n${error.message}\n\n(Cụ chụp cái này gửi cho mình nhé)`,
              },
            ],
          },
        },
      ],
    };

    return {
      statusCode: 200, // Trả về 200 để frontend hiển thị được tin nhắn lỗi
      headers,
      body: JSON.stringify(errorReply),
    };
  }
};
