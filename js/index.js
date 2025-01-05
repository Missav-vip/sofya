<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stok</title>
    <link rel="stylesheet" href="daftarbarang.css">
    <link rel="stylesheet" href="z.css">
</head>
<body>
    <div class="search-container"><input type="text" id="searchInput" placeholder="Cari barang..."/></div>
    <h2>Kue</h2>
    <div class="table-container">
        <table id="tableKue">
            <thead>
                <tr><th rowspan="3">No</th><th colspan="3">Detail Kode Barang</th><th colspan="4">Harga</th><th colspan="2">Stok</th><th colspan="2">Tanggal</th></tr>
                <tr><th>Nama Barang</th><th>Kode Gudang</th><th>Kode Toko</th><th>Harga 1 Dus</th><th>1000 Gram</th><th>500 Gram</th><th>250 Gram</th><th>Gudang</th><th>Toko</th><th>Masuk</th><th>Keluar</th></tr>
            </thead>
            <tbody id="kueBody"></tbody>
        </table>
    </div>

    <h2>Plastik</h2>
    <div class="table-container">
        <table id="tablePlastik">
            <thead>
                <tr><th rowspan="3">No</th><th colspan="3">Detail Kode Barang</th><th colspan="7">Harga</th><th colspan="2">Stok</th><th colspan="2">Tanggal</th></tr>
                <tr><th>Ukuran</th><th>Kode Gudang</th><th>Kode Toko</th><th>Harga 1 Dus</th><th>Harga 1 Pak</th><th>Harga 1 Pis</th><th>Harga 1 Ons</th><th>1000 Gram</th><th>500 Gram</th><th>250 Gram</th><th>Gudang</th><th>Toko</th><th>Masuk</th><th>Keluar</th></tr>
            </thead>
            <tbody id="plastikBody"></tbody>
        </table>
    </div>
  
    <script src="logika.js"></script>
</body>
</html>
