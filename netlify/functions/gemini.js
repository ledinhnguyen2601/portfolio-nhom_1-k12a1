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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("Thieu API Key");

    // Danh sách các model để thử lần lượt (Cái này tạch thì tự nhảy sang cái kia)
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-001",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-1.0-pro",
    ];

    let lastError = null;

    // Vòng lặp thử từng model
    for (const model of modelsToTry) {
      console.log(`Dang thu model: ${model}...`); // Ghi log để theo dõi

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

      // Nếu thành công (không có lỗi) -> Trả về ngay
      if (!data.error) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      }

      // Nếu lỗi -> Lưu lỗi lại và thử model tiếp theo
      console.log(`Model ${model} bi loi: ${data.error.message}`);
      lastError = data.error.message;
    }

    // Nếu thử hết danh sách mà vẫn lỗi
    throw new Error(
      `Da thu tat ca model deu that bai. Loi cuoi cung: ${lastError}`
    );
  } catch (error) {
    console.error("Loi Server:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
