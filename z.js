const PlastikDB = {
    dbName: "toko",
    storeName: "grup",
    db: null,
    defaultData: [
        'PP Neo (0,3)', 'PP Neo (0,5)', 'PP STP (standing pouch)', 'PP Wayang', 'PP +', 'OPP',
        'PE Tomat', 'PE Andalan', 'PE Klip', 'THINWALL', 'CUP', 'MIKA', 'PIRING', 'MANGKOK',
        'FOAM', 'KERTAS', 'TISU', 'DUS', 'RICEBOWL', 'BUBBLE WRAP'
    ].map(category => ({ category, items: [] })),

    openDB() {
        const request = indexedDB.open(this.dbName, 1);
        request.onerror = function(event) {
            console.error("Database error: " + event.target.error);
        };
        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            if (!this.db.objectStoreNames.contains(this.storeName)) {
                const store = this.db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                store.createIndex("by_category", "category", { unique: false });
            }
        };
        request.onsuccess = (event) => {
            this.db = event.target.result;
            this.loadDataFromDB();
        };
    },

    saveItemToDB(categoryIndex, itemIndex) {
        const item = this.defaultData[categoryIndex].items[itemIndex];
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.put(item);

        transaction.oncomplete = function() {
            console.log("Item saved to IndexedDB.");
        };

        transaction.onerror = function(event) {
            console.error("Error saving to IndexedDB:", event.target.error);
        };
    },

    loadDataFromDB() {
        const transaction = this.db.transaction([this.storeName], "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            const items = event.target.result;
            items.forEach(item => {
                const category = this.defaultData.find(c => c.category === item.category);
                if (category) {
                    category.items.push(item);
                } else {
                    this.defaultData.push({ category: item.category, items: [item] });
                }
            });
            this.loadTableFromHtml();
        };

        request.onerror = function(event) {
            console.error("Error loading data from IndexedDB:", event.target.error);
        };
    },

    deleteItemFromDB(categoryIndex, itemIndex) {
        const itemId = this.defaultData[categoryIndex].items[itemIndex].id;
        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        store.delete(itemId);

        transaction.oncomplete = () => {
            console.log("Item deleted from IndexedDB.");
            this.loadDataFromDB();
        };

        transaction.onerror = function(event) {
            console.error("Error deleting from IndexedDB:", event.target.error);
        };
    },

    saveItem(categoryIndex, itemIndex) {
        const item = this.defaultData[categoryIndex].items[itemIndex];
        const updatedCells = document.querySelectorAll(`[data-category="${categoryIndex}"][data-item="${itemIndex}"]`);

        updatedCells.forEach(cell => {
            const columnName = cell.cellIndex;
            switch (columnName) {
                case 0: item.NO = cell.textContent; break;
                case 1: item.BARANG = cell.textContent; break;
                case 2: item.KODE_TOKO = cell.textContent; break;
                case 3: item.KODE_GUDANG = cell.textContent; break;
                case 4: item.HARGA["DUS/BALL"] = cell.textContent; break;
                case 5: item.HARGA["1 PACK"] = cell.textContent; break;
                case 6: item.HARGA["1 PCS"] = cell.textContent; break;
                case 7: item.HARGA["1000 GRAM"] = cell.textContent; break;
                case 8: item.HARGA["500 GRAM"] = cell.textContent; break;
                case 9: item.HARGA["250 GRAM"] = cell.textContent; break;
                case 10: item.HARGA["100 GRAM"] = cell.textContent; break;
                case 11: item.HARGA["50 GRAM"] = cell.textContent; break;
                case 12: item.STOK.GUDANG = cell.textContent; break;
                case 13: item.STOK.TOKO = cell.textContent; break;
            }
        });
        this.saveItemToDB(categoryIndex, itemIndex);

        // Sembunyikan tombol save setelah menyimpan
        const saveButton = document.querySelector(`[data-category="${categoryIndex}"][data-item="${itemIndex}"] .save-button`);
        if (saveButton) {
            saveButton.style.display = 'none';
        }
    },

    deleteItem(categoryIndex, itemIndex) {
        this.deleteItemFromDB(categoryIndex, itemIndex);
        this.defaultData[categoryIndex].items.splice(itemIndex, 1);
        this.loadTableFromHtml();
    },

    updateDate(categoryIndex, itemIndex, dateType, value) {
        const item = this.defaultData[categoryIndex].items[itemIndex];
        item.TANGGAL[dateType] = value;

        // Tampilkan tombol save saat tanggal diubah
        const saveButton = document.querySelector(`[data-category="${categoryIndex}"][data-item="${itemIndex}"] .save-button`);
        if (saveButton) {
            saveButton.style.display = 'inline'; // Tampilkan tombol save
        }
    },

    loadTableFromHtml() {
        const tbody = document.querySelector("#dataTablePlastik tbody");
        tbody.innerHTML = '';

        this.defaultData.forEach((category, categoryIndex) => {
            const subTitleRow = document.createElement("tr");
            subTitleRow.classList.add("sub-title");
            subTitleRow.innerHTML = `<td colspan="18">
                                        ${category.category}
                                        <button onclick="PlastikDB.addItem(${categoryIndex})">+</button>
                                      </td>`;
            tbody.appendChild(subTitleRow);

            category.items.forEach((item, itemIndex) => {
                const row = document.createElement("tr");
                row.classList.add("data-row");
                row.dataset.category = categoryIndex;
                row.dataset.item = itemIndex;
                const today = new Date().toISOString().split('T')[0]; // Mendapatkan tanggal saat ini dalam format YYYY-MM-DD
                row.innerHTML = `
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.NO}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.BARANG}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.KODE_TOKO}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.KODE_GUDANG}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["DUS/BALL"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["1 PACK"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["1 PCS"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["1000 GRAM"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["500 GRAM"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["250 GRAM"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["100 GRAM"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.HARGA["50 GRAM"]}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.STOK.GUDANG}</td>
                    <td contenteditable="true" data-category="${categoryIndex}" data-item="${itemIndex}">${item.STOK.TOKO}</td>
                    <td>
                        <input type="date" class="date-input" value="${item.TANGGAL.MASUK || today}" 
                            oninput="PlastikDB.updateDate(${categoryIndex}, ${itemIndex}, 'MASUK', this.value)">
                    </td>
                    <td>
                        <input type="date" class="date-input" value="${item.TANGGAL.KELUAR || today}" 
                            oninput="PlastikDB.updateDate(${categoryIndex}, ${itemIndex}, 'KELUAR', this.value)">
                    </td>
                    <td>
                        <button class="save-button" onclick="PlastikDB.saveItem(${categoryIndex}, ${itemIndex})" style="display:none;">&#9729;</button>
                    </td>
                    <td><button class="delete-button" onclick="PlastikDB.deleteItem(${categoryIndex}, ${itemIndex})">&#128465;</button></td>
                `;
                tbody.appendChild(row);

                // Menambahkan event listener untuk menampilkan tombol save
                const editableCells = row.querySelectorAll('[contenteditable="true"]');
                editableCells.forEach(cell => {
                    cell.addEventListener('input', () => {
                        const saveButton = row.querySelector('.save-button');
                        saveButton.style.display = 'inline'; // Tampilkan tombol save
                    });
                });
            });
        });
    },

    addItem(categoryIndex) {
        const category = this.defaultData[categoryIndex];
        const newItem = {
            NO: category.items.length + 1,
            BARANG: '',
            KODE_TOKO: '',
            KODE_GUDANG: '',
            HARGA: { "DUS/BALL": '', "1 PACK": '', "1 PCS": '', "1000 GRAM": '', "500 GRAM": '', "250 GRAM": '', "100 GRAM": '', "50 GRAM": '' },
            STOK: { GUDANG: '', TOKO: '' },
            TANGGAL: { EXPAYER: '', MASUK: '', KELUAR: '' },
            category: category.category
        };
        category.items.push(newItem);
        this.loadTableFromHtml();
    }
};
