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
    // --- DÁN KEY CỦA CỤ VÀO ĐÂY ---
    const apiKey = "AIzaSyDcvVTo0pGD2411hybEdTpaJRJdqZqQI9g";

    // Thay vì chat, mình gọi hàm lấy danh sách Model
    console.log("Dang kiem tra danh sach model...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    // Cấu trúc lại dữ liệu để in ra màn hình chat cho cụ đọc
    let replyText = "";

    if (data.error) {
      replyText = `❌ LỖI NGHIÊM TRỌNG: Key này bị hỏng rồi cụ ơi!\nLý do: ${data.error.message}`;
    } else if (data.models) {
      // Lọc ra mấy cái model chat
      const chatModels = data.models
        .filter((m) => m.supportedGenerationMethods.includes("generateContent"))
        .map((m) => m.name.replace("models/", "")) // Lấy tên ngắn gọn
        .join("\n- ");

      replyText = `✅ KẾT NỐI THÀNH CÔNG! Key này dùng được các model sau:\n- ${chatModels}`;
    } else {
      replyText = "⚠️ Lạ quá, Google không trả về danh sách model nào cả.";
    }

    // Giả lập tin nhắn trả về để hiển thị lên web
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        candidates: [
          {
            content: { parts: [{ text: replyText }] },
          },
        ],
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        candidates: [
          {
            content: { parts: [{ text: `Lỗi code: ${error.message}` }] },
          },
        ],
      }),
    };
  }
};
