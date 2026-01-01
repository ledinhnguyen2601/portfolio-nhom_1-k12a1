// --- 1. DỮ LIỆU THÀNH VIÊN ---
const members = [
  {
    id: "nguyen",
    name: "Lê Đình Nguyên",
    role: "Web Dev & Security",
    dob: "26/01/2007",
    from: "Vạn An, Nghệ An",
    hobby: "Manga, chụp ảnh phong cảnh, công nghệ",
    hate: "Lợi dụng, boy phố ngầu, nói dối",
    goal: "Lập trình viên Web/Security tại Viettel",
    avatar: "images/nguyen.jpg",
  },
  {
    id: "hung",
    name: "Nguyễn Tiến Hưng",
    role: "Lớp trưởng - App Dev",
    dob: "19/06/2007",
    from: "Lam Thành, Nghệ An",
    hobby: "Game, bóng chuyền, âm nhạc",
    hate: "Giả tạo, boy phố",
    goal: "Làm việc tại công ty công nghệ uy tín",
    avatar: "images/hung.jpg",
  },
  {
    id: "vietanh",
    name: "Hoàng Thái Việt Anh",
    role: "Inspirer (Người truyền tin)",
    dob: "17/01/2007",
    from: "Xã Quỳnh Anh, Nghệ An",
    hobby: "Đá bóng, chơi game, tập gym",
    hate: "Im lặng, không gian kín",
    goal: "Loan truyền tin mừng, gia đình hạnh phúc",
    avatar: "images/vietanh.jpg",
  },
  {
    id: "tien",
    name: "Sầm Kim Tiến",
    role: "Chuyên viên Tập đoàn",
    dob: "25/01/2007",
    from: "Mường Quàng, Nghệ An",
    hobby: "Bóng chuyền, tập gym, thể thao",
    hate: "Ngoài mặt vui tươi trong lòng ghét bỏ",
    goal: "Sự nghiệp ổn định ở tập đoàn lớn",
    avatar: "images/tien.jpg",
  },
];

// --- 2. KHỞI TẠO WEBSITE & AVATAR ---
document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-members");
  if (!navContainer) return; // Kiểm tra lỗi nếu không tìm thấy thẻ

  members.forEach((mem) => {
    const img = document.createElement("img");
    img.src = mem.avatar;
    img.classList.add("nav-avatar");
    img.title = mem.name;
    img.addEventListener("click", () => loadProfile(mem));
    navContainer.appendChild(img);
  });
});

// --- 3. HIỂN THỊ PROFILE ---
function loadProfile(member) {
  document.getElementById("hero-section").classList.remove("active");
  document.getElementById("hero-section").classList.add("hidden");

  const detailSection = document.getElementById("profile-detail");
  detailSection.classList.remove("hidden");
  detailSection.classList.add("active");

  // Đổ dữ liệu
  document.getElementById("p-avatar").src = member.avatar;
  document.getElementById("p-name").textContent = member.name;
  document.getElementById("p-role").textContent = member.role;
  document.getElementById("p-dob").textContent = member.dob;
  document.getElementById("p-from").textContent = member.from;
  document.getElementById("p-hobby").textContent = member.hobby;
  document.getElementById("p-hate").textContent = member.hate;
  document.getElementById("p-goal").textContent = member.goal;
}

// --- 4. CÁC NÚT CHỨC NĂNG KHÁC ---
// Nút dự án
const projectBtn = document.getElementById("project-btn");
if (projectBtn) {
  projectBtn.addEventListener("click", () => {
    alert("HIỆN CHƯA CÓ DỰ ÁN NÀO!\n(Vui lòng quay lại sau)");
  });
}

// Thay Avatar (FileReader)
const fileInput = document.getElementById("avatar-upload");
const avatarImg = document.getElementById("p-avatar");
if (fileInput) {
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        avatarImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// Chế độ Sáng/Tối
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const body = document.body;
    if (body.getAttribute("data-theme") === "dark") {
      body.removeAttribute("data-theme");
    } else {
      body.setAttribute("data-theme", "dark");
    }
  });
}

// --- 5. CHATBOT (NETLIFY FUNCTION) ---
const chatToggle = document.getElementById("chat-toggle-btn");
const chatWindow = document.getElementById("chat-window");
const closeChat = document.getElementById("close-chat");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatContent = document.getElementById("chat-content");

if (chatToggle)
  chatToggle.addEventListener("click", () =>
    chatWindow.classList.remove("hidden")
  );
if (closeChat)
  closeChat.addEventListener("click", () => chatWindow.classList.add("hidden"));

if (sendBtn) sendBtn.addEventListener("click", handleChat);
if (userInput)
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
  });

async function handleChat() {
  const text = userInput.value.trim();
  if (!text) return;

  addMsg(text, "user-message");
  userInput.value = "";

  // Gọi hàm AI
  const reply = await callGemini(text);
  addMsg(reply, "bot-message");
}

function addMsg(text, className) {
  const div = document.createElement("div");
  div.classList.add(className);
  div.textContent = text;
  chatContent.appendChild(div);
  chatContent.scrollTop = chatContent.scrollHeight;
}

// HÀM GỌI API (ĐÃ SỬA BẢO MẬT)
async function callGemini(message) {
  const API_URL = "/.netlify/functions/gemini";
  console.log("Đang gọi AI...");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "AI đang suy nghĩ, bạn thử lại chút nhé.";
    }
  } catch (error) {
    console.error("Lỗi:", error);
    return "Lỗi kết nối server (Kiểm tra xem đã deploy hàm Netlify chưa).";
  }
}
