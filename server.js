const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

// Lokasi file JSON
const kueFilePath = path.join(__dirname, "scc/k/kue.json");
const plastikFilePath = path.join(__dirname, "css/p/plastik.json");

// API untuk mendapatkan data kue
app.get("/data/kue", (req, res) => {
    try {
        const kueData = JSON.parse(fs.readFileSync(kueFilePath, "utf-8"));
        res.json(kueData);
    } catch (error) {
        console.error("Error reading kue.json:", error);
        res.status(500).send("Gagal membaca data kue.");
    }
});

// API untuk mendapatkan data plastik
app.get("/data/plastik", (req, res) => {
    try {
        const plastikData = JSON.parse(fs.readFileSync(plastikFilePath, "utf-8"));
        res.json(plastikData);
    } catch (error) {
        console.error("Error reading plastik.json:", error);
        res.status(500).send("Gagal membaca data plastik.");
    }
});

// API untuk memperbarui data
app.post("/data/update", (req, res) => {
    const { type, updatedData } = req.body;

    try {
        if (type === "Kue") {
            fs.writeFileSync(kueFilePath, JSON.stringify(updatedData, null, 2));
        } else if (type === "Plastik") {
            fs.writeFileSync(plastikFilePath, JSON.stringify(updatedData, null, 2));
        } else {
            return res.status(400).send("Tipe data tidak valid.");
        }

        res.status(200).send("Data berhasil diperbarui.");
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).send("Gagal memperbarui data.");
    }
});

// Start server
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
