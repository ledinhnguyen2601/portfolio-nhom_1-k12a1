// --- 1. DỮ LIỆU THÀNH VIÊN ĐẦY ĐỦ (Full Info) ---
const members = [
  {
    id: "nguyen",
    name: "Lê Đình Nguyên",
    role: "Web Dev & Security",
    dob: "26/01/2007",
    from: "Vạn An, Nghệ An",
    hobby: "Manga, ảnh chụp phong cảnh, tìm hiểu công nghệ",
    hate: "Lợi dụng, boy phố ngầu, nói dối",
    pros: "Ai cũng là bạn",
    cons: "Nhác, chưa thực sự nỗ lực, đôi lúc chỉ nhìn vấn đề 1 mặt",
    exp: "Hiện chưa cập nhật chi tiết (Đang tập trung học Web/Security)",
    goal: "Là một lập trình viên web và an ninh mạng. Kiếm tiền nuôi bố mẹ. Mong muốn làm việc tại Viettel.",
    avatar: "images/nguyen.jpg",
  },
  {
    id: "hung",
    name: "Nguyễn Tiến Hưng",
    role: "Lớp trưởng - App Dev",
    dob: "19/06/2007",
    from: "Lam Thành, Nghệ An",
    hobby: "Chơi game, bóng chuyền, âm nhạc (nghe, hát)",
    hate: "Giả tạo, boy phố",
    pros: "Hòa đồng, vui tính, tự tin",
    cons: "Nhác, chưa thực sự nỗ lực, người mau cảm xúc",
    exp: "2020-2022: Trưởng sao đỏ. 2023-2024: Bí thư đoàn trường. Nay: Bí thư chi đoàn địa phương.",
    goal: "Có công việc ổn định, kiếm tiền nuôi bố mẹ. Mong muốn lập trình ứng dụng tại công ty công nghệ uy tín.",
    avatar: "images/hung.jpg",
  },
  {
    id: "vietanh",
    name: "Hoàng Thái Việt Anh",
    role: "Inspirer (Người truyền tin)",
    dob: "17/01/2007",
    from: "Xã Quỳnh Anh, Nghệ An",
    hobby: "Đá bóng, chơi game, tập gym, nghe nhạc",
    hate: "Sự im lặng, không gian kín, ngoài mặt vui tươi trong lòng ghét bỏ",
    pros: "Hướng ngoại, nói nhiều, tự tin",
    cons: "Trì hoãn công việc, chưa tập trung, dễ khóc",
    exp: "Việc gì cũng làm (Bí thư, lớp trưởng, sao đỏ, tổ trưởng, xứ đoàn phó)",
    goal: "Không để mẹ phải khóc nữa. Ước mơ: Được nhìn thấy bố một lần nữa, là người loan truyền tin mừng.",
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
    pros: "Hướng ngoại, nói nhiều",
    cons: "Trì hoãn công việc, chưa tập trung",
    exp: "Thành tích tốt trong các hoạt động thể thao và phong trào.",
    goal: "Sự nghiệp ổn định, cố gắng hơn từng ngày, thành công theo ngành đã chọn. Làm ở các tập đoàn lớn uy tín.",
    avatar: "images/tien.jpg",
  },
];

// --- 2. KHỞI TẠO ---
document.addEventListener("DOMContentLoaded", () => {
  // Render Avatar Navbar
  const navContainer = document.getElementById("nav-members");
  if (navContainer) {
    members.forEach((mem) => {
      const img = document.createElement("img");
      img.src = mem.avatar;
      img.classList.add("nav-avatar");
      img.title = "Xem: " + mem.name;
      img.onclick = () => loadProfile(mem); // Sự kiện click
      navContainer.appendChild(img);
    });
  }

  // Sự kiện Nút Logo -> Về trang chủ
  const logoBtn = document.getElementById("logo-btn");
  if (logoBtn) logoBtn.onclick = goHome;

  // Sự kiện Nút Đóng (X) trong Profile -> Về trang chủ
  const backBtn = document.getElementById("back-home-btn");
  if (backBtn) backBtn.onclick = goHome;
});

// --- 3. HÀM CHUYỂN ĐỔI GIAO DIỆN ---
function loadProfile(member) {
  // Ẩn Hero, Hiện Detail
  document.getElementById("hero-section").classList.remove("active");
  document.getElementById("hero-section").classList.add("hidden");

  const detailSection = document.getElementById("profile-detail");
  detailSection.classList.remove("hidden");
  detailSection.classList.add("active");

  // Đổ dữ liệu chi tiết
  document.getElementById("p-avatar").src = member.avatar;
  document.getElementById("p-name").textContent = member.name;
  document.getElementById("p-role").textContent = member.role;
  document.getElementById("p-dob").textContent = member.dob;
  document.getElementById("p-from").textContent = member.from;

  // Đổ dữ liệu text dài
  document.getElementById("p-hobby").textContent = member.hobby;
  document.getElementById("p-hate").textContent = member.hate;
  document.getElementById("p-pros").textContent = member.pros;
  document.getElementById("p-cons").textContent = member.cons;
  document.getElementById("p-exp").textContent = member.exp;
  document.getElementById("p-goal").textContent = member.goal;
}

function goHome() {
  // Ẩn Detail, Hiện Hero
  document.getElementById("profile-detail").classList.remove("active");
  document.getElementById("profile-detail").classList.add("hidden");

  document.getElementById("hero-section").classList.remove("hidden");
  document.getElementById("hero-section").classList.add("active");
}

// --- 4. CÁC CHỨC NĂNG PHỤ (Darkmode, Chatbot, Upload ảnh) ---

// Dark Mode
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const body = document.body;
  const icon = themeToggle.querySelector("i");
  if (body.getAttribute("data-theme") === "dark") {
    body.removeAttribute("data-theme");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  } else {
    body.setAttribute("data-theme", "dark");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});

// Upload Ảnh (Review local)
const fileInput = document.getElementById("avatar-upload");
const avatarImg = document.getElementById("p-avatar");
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => (avatarImg.src = e.target.result);
    reader.readAsDataURL(file);
  }
});

// Nút Dự án
document.getElementById("project-btn").onclick = () => {
  alert("HIỆN CHƯA CÓ DỰ ÁN NÀO!\n(Vui lòng quay lại sau)");
};

// --- CHATBOT LOGIC (Giữ nguyên kết nối Netlify) ---
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const chatContent = document.getElementById("chat-content");

document.getElementById("chat-toggle-btn").onclick = () =>
  chatWindow.classList.remove("hidden");
document.getElementById("close-chat").onclick = () =>
  chatWindow.classList.add("hidden");
document.getElementById("send-btn").onclick = handleChat;
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleChat();
});

async function handleChat() {
  const text = userInput.value.trim();
  if (!text) return;

  addMsg(
    text,
    "user-message",
    "text-align: right; background: #dbeafe; padding: 8px; border-radius: 5px; margin: 5px 0; margin-left: auto; width: fit-content;"
  );
  userInput.value = "";

  const reply = await callGemini(text);
  addMsg(
    reply,
    "bot-message",
    "background: #eee; padding: 8px; border-radius: 5px; margin: 5px 0; width: fit-content;"
  );
}

function addMsg(text, className, style) {
  const div = document.createElement("div");
  div.className = className;
  div.style = style;
  div.textContent = text;
  chatContent.appendChild(div);
  chatContent.scrollTop = chatContent.scrollHeight;
}

// Gọi API
async function callGemini(message) {
  try {
    const response = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    });
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI đang bận, thử lại sau nhé."
    );
  } catch (e) {
    return "Lỗi kết nối Server.";
  }
}
