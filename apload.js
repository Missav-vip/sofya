<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload and Download</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            width: 100%;
            max-width: 600px;
            padding: 20px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .upload-section, .download-section {
            margin-bottom: 20px;
        }
        .upload-section input[type="file"] {
            display: none;
        }
        .upload-section label {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
        }
        .download-section a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: #fff;
            border-radius: 5px;
            text-decoration: none;
        }
        .download-section a:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Upload and Download Files</h1>
        <div class="upload-section">
            <input type="file" id="file-upload" onchange="handleFileUpload(event)">
            <label for="file-upload"><i class="fas fa-upload"></i> Choose File</label>
        </div>
        <div class="download-section">
            <a href="#" id="download-link" download="data.json"><i class="fas fa-download"></i> Download Data</a>
        </div>
    </div>

    <script>
        // Namespace untuk Kue
        const KueDB = {
            dbName: "kueDB",
            storeName: "items",
            db: null,
            defaultData: [
                { category: 'Tepung', items: [] },
                { category: 'Mesis', items: [] },
                { category: 'Selai', items: [] },
                { category: 'Susu', items: [] },
                { category: 'Gula', items: [] },
                { category: 'Agar', items: [] },
                { category: 'Puding', items: [] },
                { category: 'Nutrijel', items: [] },
                { category: 'Pewarna', items: [] },
                { category: 'Minuman', items: [] },
                { category: 'Margarine', items: [] },
                { category: 'Coklat bubuk', items: [] },
                { category: 'Chocolate chip', items: [] },
                { category: 'Bahan pengemulsi', items: [] },
                { category: 'Bahan pengembang', items: [] }
            ],

            openDB: function() {
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

            saveItemToDB: function(categoryIndex, itemIndex) {
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

            loadDataFromDB: function() {
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
                };

                request.onerror = function(event) {
                    console.error("Error loading data from IndexedDB:", event.target.error);
                };
            },

            deleteItemFromDB: function(categoryIndex, itemIndex) {
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

            saveItem: function(categoryIndex, itemIndex) {
                const item = this.defaultData[categoryIndex].items[itemIndex];
                const updatedCells = document.querySelectorAll(`[data-category="${categoryIndex}"][data-item="${itemIndex}"]`);

                updatedCells.forEach(cell => {
                    const columnName = cell.cellIndex;
                    switch (columnName) {
                        case 0: item.NO = cell.textContent; break;
                        case 1: item.BARANG = cell.textContent; break;
                        case 2: item.KODE_TOKO = cell.textContent; break;
                        case 3: item.KODE_GUDANG = cell.textContent; break;
                        case 4: item.HARGA["DUS / BALL"] = cell.textContent; break;
                        case 5: item.HARGA["1000 GRAM"] = cell.textContent; break;
                        case 6: item.HARGA["500 GRAM"] = cell.textContent; break;
                        case 7: item.HARGA["250 GRAM"] = cell.textContent; break;
                        case 8: item.HARGA["100 GRAM"] = cell.textContent; break;
                        case 9: item.HARGA["50 GRAM"] = cell.textContent; break;
                        case 10: item.STOK.GUDANG = cell.textContent; break;
                        case 11: item.STOK.TOKO = cell.textContent; break;
                    }
                });
                this.saveItemToDB(categoryIndex, itemIndex);

                // Sembunyikan tombol save setelah menyimpan
                const saveButton = document.querySelector(`[data-category="${categoryIndex}"][data-item="${itemIndex}"] .save-button`);
                if (saveButton) {
                    saveButton.style.display = 'none';
                }
            },

            deleteItem: function(categoryIndex, itemIndex) {
                this.deleteItemFromDB(categoryIndex, itemIndex);
                this.defaultData[categoryIndex].items.splice(itemIndex, 1);
            },

            updateDate: function(categoryIndex, itemIndex, dateType, value) {
                const item = this.defaultData[categoryIndex].items[itemIndex];
                item.TANGGAL[dateType] = value;

                // Tampilkan tombol save saat tanggal diubah
                const saveButton = document.querySelector(`[data-category="${categoryIndex}"][data-item="${itemIndex}"] .save-button`);
                if (saveButton) {
                    saveButton.style.display = 'inline'; // Tampilkan tombol save
                }
            },

            addItem: function(categoryIndex) {
                const category = this.defaultData[categoryIndex];
                const newItem = {
                    NO: category.items.length + 1,
                    BARANG: '',
                    KODE_TOKO: '',
                    KODE_GUDANG: '',
                    HARGA: { "DUS / BALL": '', "1000 GRAM": '', "500 GRAM": '', "250 GRAM": '', "100 GRAM": '', "50 GRAM": '' },
                    STOK: { GUDANG: '', TOKO: '' },
                    TANGGAL: { EXPAYER: '', MASUK: '', KELUAR: '' },
                    category: category.category
                };
                category.items.push(newItem);
            }
        };

        // Namespace untuk Plastik
        const PlastikDB = {
            dbName: "plastikDB",
            storeName: "items",
            db: null,
            defaultData: [
                { category: 'PP Neo (0,3)', items: [] },
                { category: 'PP Neo (0,5)', items: [] },
                { category: 'PP STP (standing pouch)', items: [] },
                { category: 'PP Wayang', items: [] },
                { category: 'PP +', items: [] },
                { category: 'PP +', items: [] },
                { category: 'OPP', items: [] },
                { category: 'PE Tomat', items: [] },
                { category: 'PE Andalan', items: [] },
                { category: 'PE Klip', items: [] },
                { category: 'PE +', items: [] },
                { category: 'PE +', items: [] },
                { category: 'THINWALL', items: [] },
                { category: 'CUP', items: [] },
                { category: 'MIKA', items: [] },
                { category: 'PIRING', items: [] },
                { category: 'MANGKOK', items: [] },
                { category: 'FOAM', items: [] },
                { category: 'KERTAS', items: [] },
                { category: 'TISU', items: [] },
                { category: 'DUS', items: [] },
                { category: 'RICEBOWL', items: [] },
                { category: 'BUBBLE WRAP', items: [] }
            ],

            openDB: function() {
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

            saveItemToDB: function(categoryIndex, itemIndex) {
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

            loadDataFromDB: function() {
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
                };

                request.onerror = function(event) {
                    console.error("Error loading data from IndexedDB:", event.target.error);
                };
            },

            deleteItemFromDB: function(categoryIndex, itemIndex) {
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

            saveItem: function(categoryIndex, itemIndex) {
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

            deleteItem: function(categoryIndex, itemIndex) {
                this.deleteItemFromDB(categoryIndex, itemIndex);
                this.defaultData[categoryIndex].items.splice(itemIndex, 1);
            },

            updateDate: function(categoryIndex, itemIndex, dateType, value) {
                const item = this.defaultData[categoryIndex].items[itemIndex];
                item.TANGGAL[dateType] = value;

                // Tampilkan tombol save saat tanggal diubah
                const saveButton = document.querySelector(`[data-category="${categoryIndex}"][data-item="${itemIndex}"] .save-button`);
                if (saveButton) {
                    saveButton.style.display = 'inline'; // Tampilkan tombol save
                }
            },

            addItem: function(categoryIndex) {
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
            }
        };

        // Fungsi untuk menangani unggahan file
        function handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const data = JSON.parse(e.target.result);
                    // Simpan data ke IndexedDB
                    data.forEach(item => {
                        if (item.dbName === "kueDB") {
                            KueDB.defaultData = item.defaultData;
                            KueDB.loadDataFromDB();
                        } else if (item.dbName === "plastikDB") {
                            PlastikDB.defaultData = item.defaultData;
                            PlastikDB.loadDataFromDB();
                        }
                    });
                };
                reader.readAsText(file);
            }
        }

        // Fungsi untuk mengunduh data dari IndexedDB
        function downloadData() {
            const data = [
                { dbName: "kueDB", defaultData: KueDB.defaultData },
                { dbName: "plastikDB", defaultData: PlastikDB.defaultData }
            ];
            const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.getElementById("download-link");
            downloadLink.href = url;
        }

        // Memanggil fungsi untuk membuka database
        KueDB.openDB();
        PlastikDB.openDB();

        // Tambahkan event listener untuk mengunduh data
        document.getElementById("download-link").addEventListener("click", downloadData);
    </script>
</body>
</html>
