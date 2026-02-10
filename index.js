import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
const upload = multer();

const MINDEE_API_KEY = process.env.MINDEE_API_KEY;

app.post("/scan-invoice", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("document", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "https://api.mindee.net/v1/products/mindee/invoices/v4/predict",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Token ${MINDEE_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Mindee error" });
  }
});

app.get("/", (req, res) => {
  res.send("Unidocs backend is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
