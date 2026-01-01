// netlify/functions/gemini.js
exports.handler = async function(event, context) {
  // Chỉ chấp nhận method POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Lấy câu hỏi từ frontend gửi lên
    const body = JSON.parse(event.body);
    const userMessage = body.message;

    // Lấy API Key từ biến môi trường Netlify (đã cài ở Bước 1)
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Cấu hình URL gọi sang Google
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // Tạo ngữ cảnh cho AI (Prompt Engineering)
    // Bạn có thể copy lại phần membersData ở đây hoặc rút gọn
    const systemInstruction = `Bạn là trợ lý ảo của nhóm K12A1. Trả lời ngắn gọn, thân thiện.`;

    // Gọi sang Google
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
            parts: [{ text: systemInstruction + "\nCâu hỏi: " + userMessage }] 
        }]
      })
    });

    const data = await response.json();

    // Trả kết quả về cho frontend
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Lỗi Server hoặc API Key" })
    };
  }
};