import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

// Cloudinary'yi .env dosyasındaki bilgilerle yapılandır
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Gelen dosyaları doğrudan Cloudinary'ye yüklemek için bir depolama motoru oluştur
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // Cloudinary hesabınızda resimlerin yükleneceği klasör
    folder: "contact_photos",
    // İzin verilen formatlar
    allowed_formats: ["jpg", "jpeg", "png"],
    // (İsteğe bağlı) Yüklerken resme otomatik dönüşüm uygula
    // Örneğin, tüm resimleri 350x350 boyutuna getir ve kırp:
    transformation: [{ width: 350, height: 350, crop: "fill" }],
  },
});

// Multer'ı bu Cloudinary depolama motorunu kullanacak şekilde yapılandır
const upload = multer({
  storage: storage,
});

export default upload;