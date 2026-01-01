exports.handler = async function (event, context) {
  // Chỉ chấp nhận method POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Lấy API Key từ Netlify
    const apiKey = process.env.GEMINI_API_KEY;

    // --- SỬA LỖI TẠI ĐÂY: Đổi sang model 'gemini-1.5-flash' ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `Bạn là trợ lý ảo của nhóm K12A1. Trả lời ngắn gọn, thân thiện, vui tính.`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  systemInstruction +
                  "\nCâu hỏi của người dùng: " +
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
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Lỗi Server: " + error.message }),
    };
  }
};
