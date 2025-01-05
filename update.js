import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const { type, updatedData } = req.body;
    const kueFilePath = path.join(process.cwd(), "scc/k/kue.json");
    const plastikFilePath = path.join(process.cwd(), "css/p/plastik.json");

    if (req.method === "POST") {
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
    } else {
        res.status(405).send("Method tidak diperbolehkan.");
    }
}
