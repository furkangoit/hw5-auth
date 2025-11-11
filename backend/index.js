// backend/index.js

// Import necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// YENİ EKLENENLER: Contact modeli
import { Contact } from "./models/contact.js";

// YENİ EKLENENLER: ID doğrulama middleware'i
import isValidId from "./middlewares/isValidId.js";

// MEVCUT OLMALI: HW5-AUTH'tan gelen kimlik doğrulama middleware'i
import authenticate from "./middlewares/authenticate.js"; // (Lütfen bu dosyanın 'middlewares' klasöründe olduğundan emin olun)

// Upload middleware
import upload from "./middlewares/upload.js";

// YENİ EKLENENLER: 'schemas/users.js' dosyasından contact şemaları
import {
  addContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "./schemas/users.js"; // (sendResetEmailSchema vb. import ettiğiniz yerden)

// Validation middleware helper
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createHttpError(400, error.message));
    }
    next();
  };
};

// ===============================================
// BAŞLANGIÇ: TEMEL CONTACTS API ROTLARI
// ===============================================

// Tüm contact'ları getir
app.get("/contacts", authenticate, async (req, res, next) => {
  try {
    // Sadece giriş yapmış kullanıcının contact'larını bul
    const contacts = await Contact.find({ owner: req.user._id });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// Yeni bir contact ekle (Adım 6'da bunu değiştireceğiz)
// --- YENİ KOD (POST) - Adım 6 Güncellemesi ---
app.post(
  "/contacts",
  authenticate,
  upload.single("photo"), // <-- 1. DEĞİŞİKLİK: 'photo' adıyla bir dosya bekle
  validateBody(addContactSchema),
  async (req, res, next) => {
    try {
      // 2. DEĞİŞİKLİK: Cloudinary URL'sini al
      const photoUrl = req.file ? req.file.path : null;

      const newContact = await Contact.create({
        ...req.body,
        photo: photoUrl, // <-- 3. DEĞİŞİKLİK: Fotoğraf URL'sini kaydet
        owner: req.user._id,
      });
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  }
);

// Bir contact'ı güncelle (Adım 6'da bunu da değiştireceğiz)
// --- YENİ KOD (PATCH) - Adım 6 Güncellemesi ---
app.patch(
  "/contacts/:contactId",
  authenticate,
  isValidId,
  upload.single("photo"), // <-- 1. DEĞİŞİKLİK: 'photo' adıyla bir dosya bekle
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;

      // 2. DEĞİŞİKLİK: Güncellenecek veriyi dinamik oluştur
      const updateData = { ...req.body };
      if (req.file) {
        // Eğer yeni bir dosya yüklendiyse, photo URL'sini güncelle
        updateData.photo = req.file.path;
      }

      const updatedContact = await Contact.findOneAndUpdate(
        { _id: contactId, owner: req.user._id },
        updateData, // <-- 3. DEĞİŞİKLİK: updateData'yı kullan
        { new: true }
      );

      if (!updatedContact) {
        throw createHttpError(404, "Contact not found");
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  }
);

// Sadece 'favorite' alanını güncelle
app.patch(
  "/contacts/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const { favorite } = req.body;
      const updatedContact = await Contact.findOneAndUpdate(
        { _id: contactId, owner: req.user._id },
        { favorite },
        { new: true }
      );

      if (!updatedContact) {
        throw createHttpError(404, "Contact not found");
      }
      res.json(updatedContact);
    } catch (error) {
      next(error);
    }
  }
);

// ===============================================
// BİTİŞ: TEMEL CONTACTS API ROTLARI
// ===============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
