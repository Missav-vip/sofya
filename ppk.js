function downloadTable() {
    // Buka database IndexedDB
    const request = indexedDB.open(PlastikDB.dbName, 1);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction([PlastikDB.storeName], "readonly");
        const store = transaction.objectStore(PlastikDB.storeName);

        // Ambil semua data dari database
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;

            // Format data hanya untuk bagian barang hingga tanggal
            const formattedData = data.map((item) => ({
                category: item.category,
                NO: item.NO,
                BARANG: item.BARANG,
                KODE_TOKO: item.KODE_TOKO,
                KODE_GUDANG: item.KODE_GUDANG,
                HARGA: item.HARGA,
                STOK: item.STOK,
                TANGGAL: item.TANGGAL,
            }));

            // Konversi data menjadi JSON string
            const jsonString = JSON.stringify(formattedData, null, 2);

            // Buat file JSON dan unduh
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "asoy.json"; // Nama file yang diunduh
            a.click();
            URL.revokeObjectURL(url);
        };

        getAllRequest.onerror = function (event) {
            console.error("Error reading data from IndexedDB:", event.target.error);
        };
    };

    request.onerror = function (event) {
        console.error("Database error:", event.target.error);
    };
}
