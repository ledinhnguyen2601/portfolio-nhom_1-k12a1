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

    // --- CỤ DÁN TRỰC TIẾP KEY VÀO ĐÂY ĐỂ TEST ---
    // (Thay dòng chữ AIza... bên dưới bằng mã thật của cụ)
    const apiKey = "AIzaSyBwVq-hBCQuYd9_AvrMsoXoornau5fYzMI";

    // Dùng bản 1.5 Flash (Bản này nhẹ, dễ chịu nhất với Key mới)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    console.log("Dang goi API voi key truc tiep...");

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
      console.log("Loi Google:", JSON.stringify(data.error));
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
