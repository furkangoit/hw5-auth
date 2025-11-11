// backend/schemas/authSchemas.js (veya users.js) DOSYASININ DOĞRU İÇERİĞİ

import Joi from "joi";

// --- MEVCUT ŞEMALARINIZ ---
// Eğer bu dosyada zaten registerSchema, loginSchema gibi şemalarınız varsa
// ONLARI BURADA BIRAKIN. Onları silmeyin.
// Örnek:
// export const registerSchema = Joi.object({ ... });
// export const loginSchema = Joi.object({ ... });
// --- MEVCUT ŞEMALARINIZIN SONU ---


// Adım 3 için: E-posta gönderme
export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Adım 4 için: Şifreyi sıfırlama
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(), // Veya sizin şifre kuralınız neyse
});
// ... (Mevcut Joi import'unuz ve diğer şemalarınız)

// Yeni contact eklemek için (POST)
export const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

// Mevcut contact'ı güncellemek için (PATCH)
// (Hiçbir alan zorunlu değil, en az biri olmalı)
export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).min(1);

// Sadece 'favorite' alanını güncellemek için (PATCH .../favorite)
export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});