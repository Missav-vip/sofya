function downloadTable() {
    const data = PlastikDB.defaultData.map(category => {
        return {
            category: category.category,
            items: category.items.map(item => ({
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

    // Konversi data ke JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Membuat Blob dan URL untuk file JSON
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Membuat elemen anchor untuk mendownload file
    const a = document.createElement("a");
    a.href = url;
    a.download = "DataPlastik.json"; // Nama file JSON
    a.click();

    // Membersihkan URL objek
    URL.revokeObjectURL(url);
}
