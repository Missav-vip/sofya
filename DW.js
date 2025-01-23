function downloadTable() {
    const dbName = "VIP";
    const storeName = "GRUP";

    const request = indexedDB.open(dbName, 1);

    request.onerror = function (event) {
        console.error("Database error: " + event.target.error);
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            if (data.length === 0) {
                alert("No data available to download.");
                return;
            }

            // Filter data to include only relevant fields
            const filteredData = data.map(item => ({
                NO: item.NO || "",
                BARANG: item.BARANG || "",
                KODE_TOKO: item.KODE_TOKO || "",
                KODE_GUDANG: item.KODE_GUDANG || "",
                HARGA: {
                    "DUS / BALL": item.HARGA?.["DUS / BALL"] || "",
                    "1000 GRAM": item.HARGA?.["1000 GRAM"] || "",
                    "500 GRAM": item.HARGA?.["500 GRAM"] || "",
                    "250 GRAM": item.HARGA?.["250 GRAM"] || "",
                    "100 GRAM": item.HARGA?.["100 GRAM"] || "",
                    "50 GRAM": item.HARGA?.["50 GRAM"] || "",
                },
                STOK: {
                    GUDANG: item.STOK?.GUDANG || "",
                    TOKO: item.STOK?.TOKO || "",
                },
                TANGGAL: {
                    EXPAYER: item.TANGGAL?.EXPAYER || "",
                    MASUK: item.TANGGAL?.MASUK || "",
                    KELUAR: item.TANGGAL?.KELUAR || "",
                },
            }));

            // Convert to JSON
            const jsonContent = JSON.stringify(filteredData, null, 2);

            // Create a blob and download the file
            const blob = new Blob([jsonContent], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "kue_data.json";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        getAllRequest.onerror = function (event) {
            console.error("Error retrieving data from IndexedDB: ", event.target.error);
        };
    };
}
