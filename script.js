document.addEventListener("DOMContentLoaded", () => {
  // --- Tab Switching ---
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Ẩn tất cả tab
      tabContents.forEach(tab => tab.style.display = "none");
      // Bỏ active
      tabButtons.forEach(b => b.classList.remove("active"));

      // Hiển thị tab được chọn
      const targetId = btn.dataset.tab;
      document.getElementById(targetId).style.display = "block";
      btn.classList.add("active");
    });
  });

  // Mặc định mở tab Fruits
  document.getElementById("fruits").style.display = "block";

  // Lưu tên vật phẩm (Tab Cài Đặt)
  let savedData = { fruits: [], account: [], gamepass: [] };
  const savedJSON = localStorage.getItem("savedData");
  if (savedJSON) {
    savedData = JSON.parse(savedJSON);
  }

  function updateDropdowns() {
    // Fruits
    const fruitSelect = document.getElementById("fruit-name");
    fruitSelect.innerHTML = "";
    savedData.fruits.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      fruitSelect.appendChild(opt);
    });
    // Account
    const accountSelect = document.getElementById("account-name");
    accountSelect.innerHTML = "";
    savedData.account.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      accountSelect.appendChild(opt);
    });
    // Gamepass
    const gpSelect = document.getElementById("gamepass-name");
    gpSelect.innerHTML = "";
    savedData.gamepass.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      gpSelect.appendChild(opt);
    });
  }

  function updateSavedItemsUI() {
    const ul = document.getElementById("saved-items");
    ul.innerHTML = "";
    Object.keys(savedData).forEach(type => {
      savedData[type].forEach(item => {
        let li = document.createElement("li");
        li.textContent = `[${type}] ${item}`;
        ul.appendChild(li);
      });
    });
  }

  updateDropdowns();
  updateSavedItemsUI();

  document.getElementById("save-item").addEventListener("click", () => {
    const type = document.getElementById("save-type").value;
    const name = document.getElementById("new-item-name").value.trim();
    if (!name) {
      alert("Vui lòng nhập tên vật phẩm!");
      return;
    }
    if (!savedData[type].includes(name)) {
      savedData[type].push(name);
      localStorage.setItem("savedData", JSON.stringify(savedData));
      updateDropdowns();
      updateSavedItemsUI();
      document.getElementById("new-item-name").value = "";
    } else {
      alert("Vật phẩm này đã tồn tại!");
    }
  });

  // Thêm item cho Fruits/Account/Gamepass
  document.getElementById("fruit-add").addEventListener("click", () => addItem("fruit"));
  document.getElementById("account-add").addEventListener("click", () => addItem("account"));
  document.getElementById("gamepass-add").addEventListener("click", () => addItem("gamepass"));

  function addItem(prefix) {
    const name = document.getElementById(`${prefix}-name`).value;
    const buy = parseFloat(document.getElementById(`${prefix}-buy`).value);
    const sell = parseFloat(document.getElementById(`${prefix}-sell`).value);
    const qty = parseInt(document.getElementById(`${prefix}-qty`).value);

    if (!name || isNaN(buy) || isNaN(sell) || isNaN(qty) || qty <= 0) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    const profit = (sell - buy) * qty;
    const table = document.getElementById(`${prefix}-table`);
    table.classList.remove("hidden");
    const tbody = table.querySelector("tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${buy}</td>
      <td>${sell}</td>
      <td>${qty}</td>
      <td>${profit}</td>
      <td class="action-cell">
        <button class="arrow-btn">></button>
        <div class="hidden-action">
          <button class="del-btn">Xóa</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);

    updateTotalProfit(prefix);

    // Reset
    document.getElementById(`${prefix}-buy`).value = "";
    document.getElementById(`${prefix}-sell`).value = "";
    document.getElementById(`${prefix}-qty`).value = "";
  }

  // Xóa (Fruits, Account, Gamepass)
  document.addEventListener("click", e => {
    // Mở/Tắt action
    if (e.target.classList.contains("arrow-btn")) {
      const hiddenAction = e.target.parentElement.querySelector(".hidden-action");
      hiddenAction.style.display = (hiddenAction.style.display === "block") ? "none" : "block";
    }

    // Xóa
    if (e.target.classList.contains("del-btn")) {
      const tr = e.target.closest("tr");
      const tableId = tr.closest("table").id;
      const prefix = tableId.split("-")[0]; // fruit, account, gamepass
      tr.remove();
      updateTotalProfit(prefix);
    }
  });

  function updateTotalProfit(prefix) {
    const table = document.getElementById(`${prefix}-table`);
    const rows = table.querySelectorAll("tbody tr");
    let sum = 0;
    rows.forEach(r => {
      sum += parseFloat(r.cells[4].textContent);
    });
    document.getElementById(`${prefix}-total`).textContent = `Tổng Tiền Lời: ${sum}`;
  }

  // Tab Fruits Hiện Có
  document.getElementById("fruits-stock-add").addEventListener("click", () => {
    const name = document.getElementById("fruits-stock-name").value.trim();
    const qty = parseInt(document.getElementById("fruits-stock-qty").value);
    const buy = parseFloat(document.getElementById("fruits-stock-buy").value);
    if (!name || isNaN(qty) || qty <= 0 || isNaN(buy) || buy <= 0) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    const table = document.getElementById("fruits-stock-table");
    table.classList.remove("hidden");
    const tbody = table.querySelector("tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${qty}</td>
      <td>${buy}</td>
      <td class="action-cell">
        <button class="arrow-btn">></button>
        <div class="hidden-action">
          <button class="del-stock">Xóa</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);

    // Reset
    document.getElementById("fruits-stock-name").value = "";
    document.getElementById("fruits-stock-qty").value = "";
    document.getElementById("fruits-stock-buy").value = "";
  });

  // Tab Account Hiện Có
  document.getElementById("account-stock-add").addEventListener("click", () => {
    const name = document.getElementById("account-stock-name").value.trim();
    const qty = parseInt(document.getElementById("account-stock-qty").value);
    const buy = parseFloat(document.getElementById("account-stock-buy").value);
    if (!name || isNaN(qty) || qty <= 0 || isNaN(buy) || buy <= 0) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    const table = document.getElementById("account-stock-table");
    table.classList.remove("hidden");
    const tbody = table.querySelector("tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${qty}</td>
      <td>${buy}</td>
      <td class="action-cell">
        <button class="arrow-btn">></button>
        <div class="hidden-action">
          <button class="del-stock">Xóa</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);

    // Reset
    document.getElementById("account-stock-name").value = "";
    document.getElementById("account-stock-qty").value = "";
    document.getElementById("account-stock-buy").value = "";
  });

  // Xử lý Xóa cho "Hiện Có"
  document.addEventListener("click", e => {
    // Mở/Tắt action
    if (e.target.classList.contains("arrow-btn")) {
      const hiddenAction = e.target.parentElement.querySelector(".hidden-action");
      hiddenAction.style.display = (hiddenAction.style.display === "block") ? "none" : "block";
    }

    // Xóa
    if (e.target.classList.contains("del-stock")) {
      e.target.closest("tr").remove();
    }
  });
});
