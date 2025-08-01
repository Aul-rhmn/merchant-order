# Merchant Order Management System

A responsive order management system that automatically switches between real API data and mock data based on token availability.

## Features

- ✅ **Smart API Fallback**: Automatically uses mock data when API token is unavailable
- ✅ **Real API Integration**: Fetches from `https://recruitment-spe.vercel.app/api/v1/products`
- ✅ **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ✅ **Order Management**: Create, view, and delete orders
- ✅ **Stock Validation**: Prevents over-ordering
- ✅ **Real-time Calculations**: Automatic price calculations
- ✅ **Local Storage**: Orders persist in browser storage

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure API Token (Optional)

**Option A: With API Token**
1. Copy the environment file:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`
2. Edit `.env.local` and add your token:
   \`\`\`env
   NEXT_PUBLIC_API_TOKEN=your_actual_token_here
   \`\`\`

**Option B: Without API Token**
- Skip the environment setup
- The app will automatically use mock data

### 3. Run the Application
\`\`\`bash
npm run dev
\`\`\`

### 4. Open in Browser
Navigate to `http://localhost:3000`

## How It Works

### API Fallback Logic
1. **Check Token**: If `NEXT_PUBLIC_API_TOKEN` is not set → Use mock data
2. **Test Connection**: Try to connect to the API endpoint
3. **Handle Errors**: If API fails → Fallback to mock data
4. **Success**: If API works → Use real data

### Data Sources
- **Real API**: Products from `https://recruitment-spe.vercel.app/api/v1/products`
- **Mock Data**: 5 sample products with realistic data
- **Orders**: Stored in browser localStorage (both modes)

### Status Indicator
- 🟢 **Green Badge**: Connected to real API
- 🟡 **Yellow Badge**: Using mock data
- 🔄 **Refresh Button**: Check API status again

## Development vs Production

### Development (No Token)
- Uses mock data automatically
- Perfect for local development
- No external dependencies
- Fast and reliable

### Production (With Token)
- Connects to real API
- Falls back to mock data if API fails
- Handles network errors gracefully
- Shows connection status to users

## File Structure

\`\`\`
├── app/
│   ├── page.tsx              # Home page
│   ├── orders/
│   │   ├── page.tsx          # Order list
│   │   └── add/page.tsx      # Add order
│   └── layout.tsx            # Root layout
├── components/
│   ├── api-status-indicator.tsx  # API status display
│   └── delete-order-dialog.tsx   # Delete confirmation
├── lib/
│   └── api.ts                # API logic with fallback
└── .env.local.example        # Environment template
\`\`\`

## API Integration

### Headers Required
\`\`\`javascript
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
\`\`\`

### Endpoint
\`\`\`
GET https://recruitment-spe.vercel.app/api/v1/products
\`\`\`

### Response Format
The app handles various response formats:
- Direct array: `[{product1}, {product2}]`
- Nested in data: `{data: [{product1}, {product2}]}`
- Nested in products: `{products: [{product1}, {product2}]}`

## Troubleshooting

### Mock Data Always Shows
- Check if `.env.local` exists and has the correct token
- Verify the token is valid by testing the API manually
- Check browser console for connection errors

### API Connection Issues
- Verify internet connection
- Check if the API endpoint is accessible
- Confirm the token hasn't expired
- Look for CORS issues in browser console

### Orders Not Persisting
- Orders are stored in localStorage
- Clear browser data will remove orders
- Use browser dev tools → Application → Local Storage to inspect

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both mock and real API data
5. Submit a pull request
