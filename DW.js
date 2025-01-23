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

            // Extract data for download
            let csvContent = "NO,BARANG,KODE_TOKO,KODE_GUDANG,HARGA_DUS,BALL_1000G,BALL_500G,BALL_250G,BALL_100G,BALL_50G,STOK_GUDANG,STOK_TOKO,TANGGAL_EXPAYER,TANGGAL_MASUK,TANGGAL_KELUAR\n";

            data.forEach((item) => {
                const row = [
                    item.NO || "",
                    item.BARANG || "",
                    item.KODE_TOKO || "",
                    item.KODE_GUDANG || "",
                    item.HARGA?.["DUS / BALL"] || "",
                    item.HARGA?.["1000 GRAM"] || "",
                    item.HARGA?.["500 GRAM"] || "",
                    item.HARGA?.["250 GRAM"] || "",
                    item.HARGA?.["100 GRAM"] || "",
                    item.HARGA?.["50 GRAM"] || "",
                    item.STOK?.GUDANG || "",
                    item.STOK?.TOKO || "",
                    item.TANGGAL?.EXPAYER || "",
                    item.TANGGAL?.MASUK || "",
                    item.TANGGAL?.KELUAR || "",
                ].join(",");
                csvContent += row + "\n";
            });

            // Create a blob and download the file
            const blob = new Blob([csvContent], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "kue_data.csv";
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
