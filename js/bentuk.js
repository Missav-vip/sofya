let kueData;
let plastikData;

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
        const githubUrl = "https://raw.githubusercontent.com/<username>/<repository>/main"; // URL GitHub Anda
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
            kueData = await (await fetch(kueUrl)).json();
            plastikData = await (await fetch(plastikUrl)).json();
        } catch (error) {
            console.error("Failed to fetch from Ngrok or Vercel. Falling back to GitHub:", error);
            kueData = await (await fetch(`${githubUrl}/k.json`)).json();
            plastikData = await (await fetch(`${githubUrl}/p.json`)).json();
        }

        generateItemRows(kueData.Kue, "kueBody");
        generateItemRows(plastikData.Plastik, "plastikBody");
        enableEditing();
    }
    fetchData();
}

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

function getFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}
