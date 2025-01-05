let kueData;
let plastikData;

// Mengambil data dari localStorage atau GitHub
kueData = getFromLocalStorage('kueData');
plastikData = getFromLocalStorage('plastikData');

if (kueData && plastikData) {
    generateItemRows(kueData.Kue, "kueBody");
    generateItemRows(plastikData.Plastik, "plastikBody");
    enableEditing();
} else {
    async function fetchData() {
        const useNgrok = true; // Ganti ke false jika ingin menggunakan jalur GitHub/Vercel
        const ngrokUrl = "https://<your-ngrok-url>.ngrok.io"; // URL Ngrok Anda
        const githubUrl = "https://raw.githubusercontent.com/Missav-vip/P/refs/heads/main"; // URL GitHub Anda
        const vercelUrl = "https://<your-vercel-app>.vercel.app/api"; // URL Vercel Anda

        let kueUrl, plastikUrl;

        if (useNgrok) {
            kueUrl = `${ngrokUrl}/k.json`;
            plastikUrl = `${ngrokUrl}/p.json`;
        } else {
            kueUrl = `${vercelUrl}/k.json`;
            plastikUrl = `${vercelUrl}/p.json`;
        }

        try {
            // Mengambil data dari URL yang dipilih (Ngrok atau Vercel)
            kueData = await (await fetch(kueUrl)).json();
            plastikData = await (await fetch(plastikUrl)).json();
        } catch (error) {
            console.error("Failed to fetch from Ngrok or Vercel. Falling back to GitHub:", error);
            // Jika gagal, fallback ke GitHub
            kueData = await (await fetch(`${githubUrl}/k.json`)).json();
            plastikData = await (await fetch(`${githubUrl}/p.json`)).json();
        }

        // Menampilkan data dalam tabel
        generateItemRows(kueData.Kue, "kueBody");
        generateItemRows(plastikData.Plastik, "plastikBody");

        // Mengaktifkan fitur edit data
        enableEditing();
    }
    fetchData();
}

// Fungsi untuk menghasilkan baris item dalam tabel
function generateItemRows(data, tableId) {
    const tbody = document.getElementById(tableId);
    data.forEach(group => {
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

// Fungsi untuk mengaktifkan pengeditan data di sel tabel
function enableEditing() {
    document.querySelectorAll(".editable").forEach(cell => {
        cell.addEventListener("click", function () {
            const newValue = prompt("Edit Value:", cell.innerText);
            if (newValue !== null) {
                cell.innerText = newValue;
                updateDataObjects(cell, newValue);
            }
        });
    });
}

// Fungsi untuk memperbarui objek data saat ada perubahan
function updateDataObjects(cell, newValue) {
    const row = cell.closest('tr');
    const tableId = row.closest('table').id;
    const itemIndex = Array.from(row.parentElement.children).indexOf(row) - 1;

    if (tableId === "plastikBody") {
        const item = plastikData.Plastik[itemIndex];
        if (cell.cellIndex === 4) item.harga_dus = newValue;
        if (cell.cellIndex === 5) item.harga_1_pak = newValue;
        if (cell.cellIndex === 6) item.harga_1_pis = newValue;
        if (cell.cellIndex === 7) item.harga_1_ons = newValue;
        if (cell.cellIndex === 8) item.harga_1000_gram = newValue;
        if (cell.cellIndex === 9) item.harga_500_gram = newValue;
        if (cell.cellIndex === 10) item.harga_250_gram = newValue;
    } else {
        const item = kueData.Kue[itemIndex];
        if (cell.cellIndex === 4) item.harga_dus = newValue;
        if (cell.cellIndex === 5) item.harga_1000_gram = newValue;
        if (cell.cellIndex === 6) item.harga_500_gram = newValue;
        if (cell.cellIndex === 7) item.harga_250_gram = newValue;
    }
}

// Fungsi untuk mengambil data dari localStorage
function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Fungsi untuk menghapus data dari localStorage
function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}
