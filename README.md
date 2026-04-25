# HostelHub - Smart Hostel Discovery & Management System

A production-ready frontend web application built with React and Bootstrap for discovering hostels, viewing them on maps, filtering by preferences, booking rooms, and managing listings/bookings through role-based admin tools.

## Features

- Role-based authentication (`User` and `Admin`) with token + role stored in cookies
- Protected routes with automatic redirect to login when session expires
- Hostel listing page with responsive cards, pagination, search, filters, and sorting
- Interactive map integration using Leaflet with hostel markers and directions links
- Hostel details page with gallery, amenities, reviews, and booking workflow
- Booking management flow with confirmation details and booking status tracking
- Ratings and reviews section with average rating calculation
- Skeleton loaders for pages, cards, and map/content placeholders
- Admin dashboard with analytics cards and chart visualizations
- Admin hostel management (add, edit, delete) and booking management (status/cancel)
- Centralized API service layer with fallback data source (`src/data/hostels.json`)
- Performance optimizations: lazy-loaded routes, debounced search, memoized components

## Tech Stack

- React (latest)
- JavaScript (ES6+)
- React Router
- Context API
- Axios
- Bootstrap 5
- js-cookie
- Leaflet + React Leaflet
- Recharts

## API Integrations

- Auth API: `https://dummyjson.com/auth/login`
- Hostel list seed source (mapped to hostel model): `https://dummyjson.com/products/category/smartphones?limit=20`
- Fallback hostels data if API fails: `src/data/hostels.json`

## Project Structure

```text
src/
  components/
    Navbar/Navbar.jsx
    Sidebar/Sidebar.jsx
    HostelCard/HostelCard.jsx
    MapView/MapView.jsx
    Pagination/Pagination.jsx
    SkeletonLoader/SkeletonLoader.jsx
    SearchBar/SearchBar.jsx
    FilterPanel/FilterPanel.jsx
    ReviewSection/ReviewSection.jsx
    BookingForm/BookingForm.jsx
  pages/
    Home/Home.jsx
    Login/Login.jsx
    Hostels/Hostels.jsx
    HostelDetails/HostelDetails.jsx
    Bookings/Bookings.jsx
  admin/
    AdminDashboard/AdminDashboard.jsx
    AdminHostels/AdminHostels.jsx
    AdminBookings/AdminBookings.jsx
    AddHostel/AddHostel.jsx
  context/
    AuthContext.jsx
    BookingContext.jsx
  services/
    api.js
  data/
    hostels.json
  styles/
    global.css
  App.jsx
  main.jsx
```

## Routes

### Public

- `/` - Home
- `/login` - Login

### User/Admin Protected

- `/hostels` - Hostel listings
- `/hostel/:id` - Hostel details
- `/bookings` - My bookings

### Admin Protected

- `/admin/dashboard`
- `/admin/hostels`
- `/admin/bookings`
- `/admin/add-hostel`

## Installation & Run

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

This project is deployment-ready for both:

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

Build command: `npm run build`  
Publish directory: `dist`

## Demo Credentials (DummyJSON)

Example user:

- Username: `emilys`
- Password: `emilyspass`

Use an account with `role: admin` from DummyJSON to access admin routes.

## Screenshots

Add screenshots here after running the app:

- Home page
- Hostel listings + filters
- Hostel details + map
- Booking confirmation
- Admin dashboard

## Future Improvements

- Real backend integration for hostels/bookings/reviews
- Payment gateway support
- Advanced map routing with live path rendering
- Image upload and media management for admin
- Unit/integration tests and E2E automation
- Internationalization and accessibility enhancements
