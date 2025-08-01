# Merchant Order App

A self-order application built using Next.js (App Router) based on the provided wireframe. This project smartly switches between real API and mock data based on token availability.

---

##  Features

- Fully responsive (mobile-first)
- Product listing from API or mock
- Create, view, and delete order
- Order summary and calculations
- Quantity handling with confirmation dialog
- Token-based API integration with fallback
- LocalStorage persistence

---

## Tech Stack

- **Next.js** (App Router)
- **React Hook Form** + **Zod** for form validation
- **Tailwind CSS** for styling
- **LocalStorage** for order persistence
- **Mock & Real API switching** via `.env`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
npm install --legacy-peer-deps
```

### 2. Configure API Token (Optional)
```bash
cp .env.local.example .env.local
```
Fill in the token:
```env
NEXT_PUBLIC_API_TOKEN=your_token_here
```

If token is not provided, the app uses mock data.

### 3. Run App Locally
```bash
npm run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Test Scope & Behavior

### Page 1: Order List
- Displays:
  - **Thumbnail**, **name**, **description** per product
  - **Editable quantity**
  - **Unit price** from API
  - **Subtotal** = quantity × price
- Total price displayed at bottom
- **+ button** increases quantity (disabled at stock max)
- **- button**:
  - If quantity = 1 → triggers **Delete popup**
- **Delete popup**
  - "Cancel" closes dialog
  - "Delete" removes order
- **Add Order** navigates to Add page

### Page 2: Add Order
- Dropdown to select product
- Auto-fills:
  - Description
  - Unit Price
- Input for quantity:
  - Must be numeric
  - Max = stock
- Calculates and displays **total**
- Save button adds to order list and redirects
- Back button returns to order list

---

## API Integration

### Endpoint
```
GET https://recruitment-spe.vercel.app/api/v1/products
```

### Headers
```http
Authorization: Bearer YOUR_TOKEN
Accept: application/json
Content-Type: application/json
```

### Example cURL
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/json" \
     https://recruitment-spe.vercel.app/api/v1/products
```

### Fallback Logic
- No token or fetch error → fallback to mock data
- Status indicator:
  - 🟢 Connected to real API
  - 🟡 Using mock data

---

## Data Handling

- **Orders** stored in `localStorage`
- **Products** from API or fallback mock

---

## Submission Instructions

1. Push code to a **Private GitHub repo**
2. Invite `spe.laboratory@gmail.com` as **collaborator**
3. Ensure **multiple commits** exist (not a single bulk commit)
4. Send the **GitHub repo link** via email


---

## 📎 Links
- 🧪 [Live Demo](https://merchant-order.vercel.app)
- 💻 [GitHub Repo](https://github.com/Aul-rhmn/merchant-order)
