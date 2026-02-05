# Portfolio Frontend

Ushbu repozitoriy Portfolio loyihasining foydalanuvchi interfeysi (Frontend) qismi bo'lib, React, Vite va Tailwind CSS yordamida yaratilgan. Loyiha zamonaviy dizayn (Glassmorphism), animatsiyalar va to'liq javobgar (responsive) interfeysga ega.

## 🚀 Xususiyatlar

### 🌟 Asosiy Sahifa (Portfolio)
*   **Hero Section:** Yozuv mashinkasi (Typing) effekti va zamonaviy CTA tugmalari.
*   **Haqimda (About):** Interaktiv "Manga" uslubidagi hikoya bo'limi.
*   **Ko'nikmalar (Skills):** Categoriyalar bo'yicha filtrlanadigan va vizual progress barlari bilan ko'rsatiladigan mahoratlar.
*   **Loyihalar (Projects):** Grid ko'rinishidagi loyihalar ro'yxati, hover effektlari va batafsil ma'lumotlar.
*   **Tajriba (Experience):** Interaktiv vaqt shkalasi (Timeline).
*   **Aloqa (Contact):** Validatsiya qilingan va backendga yuboriladigan aloqa formasi.

### ⚙️ Admin Panel
*   **Dashboard:** Umumiy statistika va ko'rsatkichlar.
*   **Boshqaruv (CRUD):** Loyihalar, Ko'nikmalar va Tajribalarni qo'shish, o'zgartirish va o'chirish imkoniyati.
*   **Sozlamalar:** Saytning asosiy rangini (Primary Color), Ijtimoiy tarmoq havolalarini va Kontakt ma'lumotlarini o'zgartirish.
*   **Mavzu (Theme):** Tungi (Dark) va Kunduzgi (Light) rejimlarni boshqarish.
*   **Ko'p tillilik (i18n):** O'zbek, Ingliz va Rus tillarini qo'llab-quvvatlash.

## 🛠️ Texnologiyalar

*   **Core:** React.js, Vite
*   **Styling:** Tailwind CSS, Vanilla CSS (Variables)
*   **State Management:** React Context API
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios
*   **Icons:** Lucide React, Simple Icons
*   **Notifications:** React Hot Toast
*   **Multilingual:** i18next

## 📦 O'rnatish va Ishga Tushirish

1.  **Repozitoriyni klonlash:**
    ```bash
    git clone https://github.com/mamarizayev-mashrab/portfolio-frontend.git
    cd frontend
    ```

2.  **Kutubxonalarni o'rnatish:**
    ```bash
    npm install
    ```

3.  **Muhit o'zgaruvchilarini sozlash:**
    `.env` faylini yarating va backend manzilini ko'rsating:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    *(Agar backend Render yoki boshqa joyda bo'lsa, o'sha URLni qo'ying)*

4.  **Loyihani ishga tushirish:**
    ```bash
    npm run dev
    ```
    Loyiha `http://localhost:5173` manzilida ochiladi.

## 🚀 Deploy (Vercel)

1.  GitHub ga push qiling.
2.  **Vercel** ga kiring va "Add New Project" tugmasini bosing.
3.  Repozitoriyni tanlang.
4.  **Build Settings:**
    *   Framework Preset: Vite
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  **Environment Variables:**
    *   `VITE_API_URL`: Backend URL manzili (masalan: `https://my-portfolio-api.onrender.com/api`)
6.  "Deploy" tugmasini bosing.

## 🎨 Dizayn Tizimi

*   **Ranglar:** Tizim `var(--primary)` CSS o'zgaruvchisi orqali dinamik ranglarni qo'llab-quvvatlaydi. Admin paneldan istalgan rangni tanlash mumkin.
*   **Shriftlar:** `Inter` (asosiy matn) va `JetBrains Mono` (kod va sarlavhalar uchun).
*   **Rejimlar:** Dark (standart) va Light rejimlari mavjud.

## 📄 Litsenziya

MIT
