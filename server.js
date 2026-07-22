const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 🔥 IMPORTANT (fix for your error)
app.use(express.static(path.join(__dirname, "../public")));

/* ADD ASSET */
app.post("/add-asset", (req, res) => {
    const { asset_id, name, lab, status, rfid_uid } = req.body;

    const sql = "INSERT INTO assets (asset_id, name, lab, status, rfid_uid) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [asset_id, name, lab, status, rfid_uid], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error adding asset");
        }
        res.send("Asset Added Successfully");
    });
});

/* GET ALL ASSETS */
app.get("/assets", (req, res) => {
    db.query("SELECT * FROM assets", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

/* SEARCH ASSET */
app.get("/asset/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM assets WHERE asset_id = ?", [id], (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

/* UPDATE LOCATION (ESP32 later) */
app.post("/update-location", (req, res) => {
    const { rfid_uid, lab } = req.body;

    const sql = "UPDATE assets SET lab = ? WHERE rfid_uid = ?";
    db.query(sql, [lab, rfid_uid], (err, result) => {
        if (err) return res.send(err);
        res.send("Location Updated");
    });
});

/* START SERVER */
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
/* DASHBOARD DATA */
app.get("/dashboard", (req, res) => {
    const totalQuery = "SELECT COUNT(*) AS total FROM assets";
    const workingQuery = "SELECT COUNT(*) AS working FROM assets WHERE status='Working'";
    const faultyQuery = "SELECT COUNT(*) AS faulty FROM assets WHERE status='Faulty'";

    db.query(totalQuery, (err, totalResult) => {
        if (err) return res.send(err);

        db.query(workingQuery, (err, workingResult) => {
            if (err) return res.send(err);

            db.query(faultyQuery, (err, faultyResult) => {
                if (err) return res.send(err);

                res.json({
                    total: totalResult[0].total,
                    working: workingResult[0].working,
                    faulty: faultyResult[0].faulty
                });
            });
        });
    });
});
/* DELETE ASSET */
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM assets WHERE id = ?", [id], (err, result) => {
        if (err) return res.send(err);
        res.send("Asset Deleted");
    });
});
/* UPDATE ASSET */
app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, lab, status } = req.body;

    const sql = "UPDATE assets SET name=?, lab=?, status=? WHERE id=?";
    db.query(sql, [name, lab, status, id], (err, result) => {
        if (err) return res.send(err);
        res.send("Asset Updated");
    });
});