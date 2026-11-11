# Product Management System (MERN Stack)

A modern, responsive **Product Management System** built with **React**, **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 🌟 Key Features

1. **Grid Layout**: Responsive product grid (1 to 4 columns depending on screen size) displaying product card with image, category badge, brand, SKU, title, star ratings, inventory count, price, and actions.
2. **Add Products to MongoDB**: Modal form to add new products with instant field validation, category selection, price, stock, brand, SKU auto-generation, preset high-res image selectors or custom URL, and description.
3. **Search Products by Name**: Real-time debounced search bar matching product name, brand, SKU, and description with live match counters and one-click clear button.
4. **Filter Products by Category & More**:
   - Filter by categories (*Electronics, Clothing, Home & Kitchen, Sports & Outdoors, Books & Stationery, etc.*) with item count badges.
   - Horizontal category pills bar + left sidebar filter.
   - Price range filters (Min and Max price).
   - In-Stock Only filter.
5. **Sort Products by Price**:
   - Price: Low to High
   - Price: High to Low
   - Highest Rated
   - Newest First
   - Alphabetical (A-Z, Z-A)
6. **View Product Details**: Modal drawer with high-resolution image preview, price tag, in/out-of-stock badge, star rating, full description, brand, SKU, tags, and timestamps.
7. **Responsive & Modern UI**: Built with Tailwind CSS, Lucide icons, smooth animations, skeleton loaders, and interactive toast notifications.
8. **Edit & Delete Operations**: Full CRUD support with confirmation dialogs and error handling.
9. **Zero-Config Database Support**: Automatic fallback to In-Memory MongoDB (`mongodb-memory-server`) if a local MongoDB instance is not detected, or seamless connection to any local/remote MongoDB Atlas cluster via `MONGODB_URI`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, Mongoose, CORS, Dotenv, MongoMemoryServer (automatic fallback)
- **Database**: MongoDB (Local or MongoDB Atlas)

---

## 🚀 Quick Start

### 1. Install Dependencies

Open a terminal in the root directory:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment (Optional)

In `backend/.env`, configure your MongoDB connection string if you have a local MongoDB daemon or MongoDB Atlas:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/product_management
```
*(Note: If no MongoDB instance is detected at `MONGODB_URI`, the server will automatically boot an in-memory MongoDB instance with realistic seed data so everything works seamlessly out of the box!)*

### 3. Run the Backend Server

```bash
cd backend
npm start
# or npm run dev
```
Backend API will start at: `http://localhost:5000`

### 4. Run the React Frontend

In another terminal window:

```bash
cd frontend
npm run dev
```
Vite dev server will start at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get products with search, category, price range, and sort query parameters |
| `GET` | `/api/products/:id` | Get single product details |
| `POST` | `/api/products` | Create a new product in MongoDB |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete a product from MongoDB |
| `GET` | `/api/products/categories` | Get all product categories with count |
| `GET` | `/api/products/stats` | Get inventory summary metrics |
| `POST` | `/api/products/seed` | Seed catalog with 12 realistic sample products |
| `GET` | `/api/health` | Health check endpoint |

---

## 🧪 Testing Search, Filter & Sort

- **Search**: Type `Sony`, `Nike`, or `MacBook` into the search bar.
- **Filter**: Click on `Electronics`, `Clothing`, or `Sports & Outdoors` in the category bar.
- **Sort**: Select `Price: Low to High` or `Price: High to Low` in the sort dropdown.
- **Add Product**: Click `+ Add Product`, fill in the form, and click `Add to MongoDB`.
- **View Details**: Click on any product card or the `Quick View` button.
- **Reset Data**: Click `Reset Sample Data` at any time to re-populate standard demo products.
