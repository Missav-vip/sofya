import kueData from "/css/k.json";
import plastikData from "/css/P.json";

let localKueData = kueData; // Data Kue
let localPlastikData = plastikData; // Data Plastik

// Fetch data from local files and populate the tables
fetchDataFromLocal();

function fetchDataFromLocal() {
    try {
        // Populate tables
        generateItemRows(localKueData.Kue, "kueBody");
        generateItemRows(localPlastikData.Plastik, "plastikBody");
        enableEditing();

        console.log("Data berhasil dimuat dari local file.");
    } catch (error) {
        console.error("Error fetching data from local storage:", error);
        alert("Gagal memuat data. Silakan coba lagi nanti.");
    }
}

// Generate table rows
function generateItemRows(data, tableId) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = ""; // Clear the table body

    data.forEach(group => {
        // Add a row for the group name
        const groupRow = document.createElement("tr");
        groupRow.classList.add("table-subtitle");
        groupRow.innerHTML = `<td colspan="4"></td><td colspan="4">${group.group}</td><td colspan="3"></td>`;
        tbody.appendChild(groupRow);

        group.items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = tableId === "plastikBody" ? `
                <td>${item.no}</td><td>${item.ukuran}</td><td>${item.kode_gudang}</td><td>${item.kode_toko}</td>
                <td class="money editable">${item.harga_dus}</td><td class="money editable">${item.harga_1_pak}</td><td class="money editable">${item.harga_1_pis}</td>
                <td class="money editable">${item.harga_1_ons}</td><td class="money editable">${item.harga_1000_gram}</td><td class="money editable">${item.harga_500_gram}</td>
                <td class="money editable">${item.harga_250_gram}</td><td class="editable">${item.stok_gudang}</td><td class="editable">${item.stok_toko}</td>
                <td class="editable">${item.masuk}</td><td class="editable">${item.keluar}</td>
            ` : `
                <td>${item.no}</td><td>${item.nama_barang}</td><td>${item.kode_gudang}</td><td>${item.kode_toko}</td>
                <td class="money editable">${item.harga_dus}</td><td class="money editable">${item.harga_1000_gram}</td><td class="money editable">${item.harga_500_gram}</td>
                <td class="money editable">${item.harga_250_gram}</td><td class="editable">${item.stok_gudang}</td><td class="editable">${item.stok_toko}</td>
                <td class="editable">${item.masuk}</td><td class="editable">${item.keluar}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Enable editing for editable cells
function enableEditing() {
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("click", function () {
            const newValue = prompt("Edit Value:", cell.innerText);
            if (newValue !== null) {
                cell.innerText = newValue;
                updateLocalData(cell, newValue); // Update changes in local data
            }
        });
    });
}

// Update data in local storage
function updateLocalData(cell, newValue) {
    try {
        const row = cell.closest('tr');
        const tableId = row.closest('table').id;
        const itemIndex = Array.from(row.parentElement.children).indexOf(row) - 1;

        if (tableId === "plastikBody") {
            const groupIndex = Math.floor(itemIndex / localPlastikData.Plastik[0].items.length);
            const group = localPlastikData.Plastik[groupIndex];
            const item = group.items[itemIndex % group.items.length];

            // Update values based on column index
            if (cell.cellIndex === 4) item.harga_dus = newValue;
            if (cell.cellIndex === 5) item.harga_1_pak = newValue;
            if (cell.cellIndex === 6) item.harga_1_pis = newValue;
            if (cell.cellIndex === 7) item.harga_1_ons = newValue;
            if (cell.cellIndex === 8) item.harga_1000_gram = newValue;
            if (cell.cellIndex === 9) item.harga_500_gram = newValue;
            if (cell.cellIndex === 10) item.harga_250_gram = newValue;

            saveToLocalStorage("Plastik", localPlastikData);
        } else {
            const groupIndex = Math.floor(itemIndex / localKueData.Kue[0].items.length);
            const group = localKueData.Kue[groupIndex];
            const item = group.items[itemIndex % group.items.length];

            // Update values based on column index
            if (cell.cellIndex === 4) item.harga_dus = newValue;
            if (cell.cellIndex === 5) item.harga_1000_gram = newValue;
            if (cell.cellIndex === 6) item.harga_500_gram = newValue;
            if (cell.cellIndex === 7) item.harga_250_gram = newValue;

            saveToLocalStorage("Kue", localKueData);
        }
    } catch (error) {
        console.error("Error updating data locally:", error);
        alert("Gagal memperbarui data. Silakan coba lagi.");
    }
}

// Save data to localStorage
function saveToLocalStorage(category, data) {
    localStorage.setItem(category, JSON.stringify(data));
    console.log(`${category} data has been saved to localStorage.`);
}

// Load data from localStorage
function loadFromLocalStorage() {
    const kueData = JSON.parse(localStorage.getItem("Kue"));
    const plastikData = JSON.parse(localStorage.getItem("Plastik"));

    if (kueData) localKueData = kueData;
    if (plastikData) localPlastikData = plastikData;

    fetchDataFromLocal();
}

// Call this function when the page loads
loadFromLocalStorage();
