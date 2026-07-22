const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ftn0192",
  database: "lab_assets"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// Add Asset API
app.post("/addAsset", (req, res) => {
  const { asset_id, equipment_type, lab, status } = req.body;

  const sql = "INSERT INTO assets (asset_id, equipment_type, lab, status) VALUES (?, ?, ?, ?)";
  db.query(sql, [asset_id, equipment_type, lab, status], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error adding asset");
    } else {
      res.send("Asset added successfully");
    }
  });
});

// Get All Assets API
app.get("/getAssets", (req, res) => {
  db.query("SELECT * FROM assets", (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error fetching assets");
    } else {
      res.json(result);
    }
  });
});

// Delete Asset API
app.delete("/deleteAsset/:id", (req, res) => {
  const assetId = req.params.id;

  db.query("DELETE FROM assets WHERE asset_id = ?", [assetId], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error deleting asset");
    } else {
      res.send("Asset deleted successfully");
    }
  });
});

// Update Asset API
app.put("/updateAsset/:id", (req, res) => {
  const id = req.params.id;
  const { equipment_type, lab, status } = req.body;

  const sql = "UPDATE assets SET equipment_type=?, lab=?, status=? WHERE asset_id=?";
  db.query(sql, [equipment_type, lab, status, id], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error updating asset");
    } else {
      res.send("Asset updated successfully");
    }
  });
});

// Get Single Asset by ID
app.get("/asset/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM assets WHERE asset_id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.send("Error fetching asset");
    } else if (result.length === 0) {
      res.send("Asset not found");
    } else {
      res.json(result[0]);
    }
  });
});

// Dashboard API
app.get("/dashboard", (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) AS total,
            SUM(status = 'Working') AS working,
            SUM(status = 'Under Repair') AS under_repair,
            SUM(status = 'Not Working') AS not_working
        FROM assets
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send("Error fetching dashboard data");
        } else {
            res.json(result[0]);
        }
    });
});

// Serve Frontend
app.use(express.static(path.join(__dirname, "public")));

// Start Server (ALWAYS LAST)
app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
