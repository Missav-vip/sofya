function downloadTable() {
    const tableData = PlastikDB.defaultData.map(category => {
        return {
            category: category.category,
            items: category.items.map(item => ({
                NO: item.NO || "",
                BARANG: item.BARANG || "",
                KODE_TOKO: item.KODE_TOKO || "",
                KODE_GUDANG: item.KODE_GUDANG || "",
                HARGA: {
                    "DUS/BALL": item.HARGA["DUS/BALL"] || "",
                    "1 PACK": item.HARGA["1 PACK"] || "",
                    "1 PCS": item.HARGA["1 PCS"] || "",
                    "1000 GRAM": item.HARGA["1000 GRAM"] || "",
                    "500 GRAM": item.HARGA["500 GRAM"] || "",
                    "250 GRAM": item.HARGA["250 GRAM"] || "",
                    "100 GRAM": item.HARGA["100 GRAM"] || "",
                    "50 GRAM": item.HARGA["50 GRAM"] || ""
                },
                STOK: {
                    GUDANG: item.STOK.GUDANG || "",
                    TOKO: item.STOK.TOKO || ""
                },
                TANGGAL: {
                    MASUK: item.TANGGAL.MASUK || "",
                    KELUAR: item.TANGGAL.KELUAR || ""
                }
            }))
        };
    });

    // Convert data to JSON
    const jsonString = JSON.stringify(tableData, null, 4);

    // Create a Blob from the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "PlastikData.json";

    // Trigger the download
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(link.href);
}
