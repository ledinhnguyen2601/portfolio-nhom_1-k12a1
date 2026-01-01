// --- 1. CƠ SỞ DỮ LIỆU THÀNH VIÊN (DATA OBJECT) ---
const membersData = [
  {
    id: "nguyen",
    name: "Lê Đình Nguyên",
    role: "Web Developer & Security",
    dob: "26/01/2007",
    from: "Vạn An, Nghệ An",
    hobby: "Manga, chụp ảnh phong cảnh, công nghệ",
    hate: "Lợi dụng, giả ngầu, nói dối",
    goal: "Làm việc tại tập đoàn Viettel, nuôi gia đình",
    avatar: "images/nguyen.jpg", // Đặt ảnh vào thư mục images
  },
  {
    id: "hung",
    name: "Nguyễn Tiến Hưng",
    role: "Lớp trưởng - App Developer",
    dob: "19/06/2007",
    from: "Lam Thành, Nghệ An",
    hobby: "Game, bóng chuyền, âm nhạc",
    hate: "Giả tạo, boy phố",
    goal: "Lập trình viên ứng dụng tại công ty uy tín",
    avatar: "images/hung.jpg",
  },
  {
    id: "vietanh",
    name: "Hoàng Thái Việt Anh",
    role: "Thành viên - Người truyền cảm hứng",
    dob: "17/01/2007",
    from: "Xã Quỳnh Anh, Nghệ An",
    hobby: "Đá bóng, chơi game, tập gym",
    hate: "Sự im lặng, không gian kín",
    goal: "Không để mẹ phải khóc nữa, loan truyền tin mừng",
    avatar: "images/vietanh.jpg",
  },
  {
    id: "tien",
    name: "Sầm Kim Tiến",
    role: "Thành viên - Chuyên viên tương lai",
    dob: "25/01/2007",
    from: "Mường Quàng, Nghệ An",
    hobby: "Bóng chuyền, tập gym, thể thao",
    hate: "Ngoài mặt vui tươi trong lòng ghét bỏ",
    goal: "Sự nghiệp ổn định tại các tập đoàn lớn",
    avatar: "images/tien.jpg",
  },
];

// --- 2. KHỞI TẠO WEBSITE ---
document.addEventListener("DOMContentLoaded", () => {
  const navMembers = document.getElementById("nav-members");

  // Tạo avatar trên navbar động từ dữ liệu
  membersData.forEach((member) => {
    const img = document.createElement("img");
    img.src = member.avatar;
    img.alt = member.name;
    img.classList.add("nav-avatar");
    img.title = "Xem hồ sơ: " + member.name;

    // Sự kiện: Bấm vào avatar -> Bung nội dung thành viên
    img.addEventListener("click", () => showProfile(member));
    navMembers.appendChild(img);
  });
});

// --- 3. CHỨC NĂNG HIỂN THỊ PROFILE ---
function showProfile(member) {
  // Ẩn trang chủ, hiện profile
  document.getElementById("hero-section").classList.remove("active");
  document.getElementById("hero-section").classList.add("hidden");

  const profileSection = document.getElementById("profile-detail");
  profileSection.classList.remove("hidden");
  profileSection.classList.add("active");

  // Đổ dữ liệu vào HTML (DOM Manipulation)
  document.getElementById("p-avatar").src = member.avatar;
  document.getElementById("p-name").textContent = member.name;
  document.getElementById("p-role").textContent = member.role;
  document.getElementById("p-dob").textContent = member.dob;
  document.getElementById("p-from").textContent = member.from;
  document.getElementById("p-hobby").textContent = member.hobby;
  document.getElementById("p-hate").textContent = member.hate;
  document.getElementById("p-goal").textContent = member.goal;
}

// --- 4. SỰ KIỆN NÚT DỰ ÁN (POPUP ALERT) ---
document.getElementById("project-btn").addEventListener("click", () => {
  alert("HIỆN CHƯA CÓ DỰ ÁN NÀO ! \n(Sẽ cập nhật trong tương lai)");
});

// --- 5. CHẾ ĐỘ SÁNG / TỐI ---
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  if (body.hasAttribute("data-theme")) {
    body.removeAttribute("data-theme");
    icon.classList.replace("fa-sun", "fa-moon");
  } else {
    body.setAttribute("data-theme", "dark");
    icon.classList.replace("fa-moon", "fa-sun");
  }
});

// --- 6. AI CHATBOT (TÍCH HỢP GEMINI API) ---
const chatToggle = document.getElementById("chat-toggle-btn");
const chatWindow = document.getElementById("chat-window");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatContent = document.getElementById("chat-content");

// Mở/Đóng Chat
chatToggle.addEventListener("click", () =>
  chatWindow.classList.toggle("hidden")
);
closeChat.addEventListener("click", () => chatWindow.classList.add("hidden"));

// Hàm gọi Google Gemini API
async function callGemini(message) {
  const API_KEY = "YOUR_API_KEY_HERE"; // *** BẠN HÃY DÁN API KEY VÀO ĐÂY ***
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  // Tạo ngữ cảnh cho AI về nhóm K12A1
  const context = `Bạn là trợ lý ảo của nhóm sinh viên K12A1 Đại học Nghệ An. 
    Dữ liệu nhóm: ${JSON.stringify(membersData)}. 
    Hãy trả lời ngắn gọn, thân thiện. Câu hỏi của người dùng là: ${message}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: context }] }],
      }),
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    return reply;
  } catch (error) {
    console.error("Lỗi API:", error);
    return "Xin lỗi, hệ thống AI đang bảo trì (hoặc chưa nhập API Key).";
  }
}

// Xử lý gửi tin nhắn
sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleChat();
});

async function handleChat() {
  const text = userInput.value.trim();
  if (!text) return;

  // Hiện tin nhắn người dùng
  addMsg(text, "user-message");
  userInput.value = "";

  // Hiện thông báo đang gõ...
  const loadingId = addMsg("Đang suy nghĩ...", "bot-message");

  // Gọi API
  const reply = await callGemini(text);

  // Xóa loading, hiện câu trả lời thật
  document.getElementById(loadingId).remove();
  addMsg(reply, "bot-message");
}

function addMsg(text, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.textContent = text;
  div.id = "msg-" + Date.now();
  chatContent.appendChild(div);
  chatContent.scrollTop = chatContent.scrollHeight;
  return div.id;
}
