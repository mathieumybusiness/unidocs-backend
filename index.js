import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
const upload = multer();

// 🔐 Clé Mindee depuis Railway
const MINDEE_API_KEY = process.env.MINDEE_API_KEY;

if (!MINDEE_API_KEY) {
  console.error("❌ MINDEE_API_KEY is missing");
}

// 📤 Endpoint scan invoice
app.post("/scan-invoice", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append(
      "document",
      req.file.buffer,
      req.file.originalname
    );

    const response = await axios.post(
      "https://api.mindee.net/v1/products/mindee/invoices/v4/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Token ${MINDEE_API_KEY}`,
        },
        maxBodyLength: Infinity, // ⚠️ OBLIGATOIRE POUR LES PDF
      }
    );

    // ✅ Réponse Mindee OK
    res.json(response.data);

  } catch (err) {
    // 🔍 Affiche la vraie erreur Mindee
    console.error("❌ Mindee error:", err.response?.data || err.message);

    res.status(500).json(
      err.response?.data || { error: "Mindee request failed" }
    );
  }
});

// ✅ Route test
app.get("/", (req, res) => {
  res.send("Unidocs backend is running 🚀");
});

// 🚀 Lancement serveur (Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
