exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const userMessage = body.message || "Hello";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Chưa nhập API Key" }),
      };
    }

    // --- QUAY VỀ BẢN CŨ MÀ CHẮC: gemini-pro ---
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Bạn là trợ lý ảo nhóm K12A1. Trả lời: " + userMessage },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 400, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
