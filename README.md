# WanderLust 🌍✈️

**WanderLust** is a full-stack travel listing web application where users can explore, book, and manage accommodations worldwide. Built with **Node.js, Express, MongoDB Atlas, EJS templating, and Bootstrap**, it includes **maps, payments, authentication, image optimization, middlewares, Joi validation, and full CRUD functionality**.

**Live Demo:** [WanderLust on Render](https://airbnb-etgh.onrender.com/listings)

---

## **Demo Account**

To try the application without signing up, use the following credentials:

```
Username: demo
Password: demo@1234
```

> You can browse listings, add reviews, and test most features using this account.

---

## **Features**

* **User Authentication & Sessions**

  * Sign up, log in, and log out with **Passport.js**
  * Flash messages for notifications
  * Secure session management

* **Listings & Reviews (CRUD)**

  * Add, edit, delete listings and reviews
  * Listings include title, description, location, country, price, images, and category

* **Joi Schema Validation**

  * Validates input data for listings and reviews
  * Ensures required fields, types, and value constraints

* **Categories**

  * Automatic category detection via keywords or manual selection
  * Categories: trending, rooms, amazing views, iconic cities, amazing pools, beach, cabins, OMG, farms, camping, castles

* **Search Functionality**

  * Search listings by keyword, location, or category

* **Maps & Geolocation**

  * **Geoapify API** + **Leaflet.js**
  * Forward geocoding, interactive markers, popups

* **Payment Integration**

  * Secure payments with **Stripe**

* **Image Optimization**

  * Images handled by **Cloudinary**, automatically resized for faster loading

* **Responsive Design**

  * Fully responsive UI using **Bootstrap**

* **Routing & Middlewares**

  * Organized with **Express Routers** for modular route management:

    * `/listings` → Listing routes
    * `/reviews` → Review routes
    * `/auth` → Authentication routes
  * **Middlewares** used for:

    * Authentication checks (protect routes)
    * Error handling
    * Flash messages
    * Session management

* **Templating**

  * **EJS** used for server-side rendering of dynamic HTML pages

---

## **Technologies Used**

* **Frontend:** HTML, CSS, JavaScript, Bootstrap, **EJS**
* **Backend:** Node.js, Express.js (with routers, middlewares)
* **Database:** MongoDB Atlas
* **Authentication:** Passport.js
* **Data Validation:** Joi
* **Maps & Geolocation:** Geoapify API, Leaflet.js
* **Payments:** Stripe
* **Image Hosting/Optimization:** Cloudinary
* **Deployment:** Render
* **Architecture:** MVC (Model-View-Controller)

---

## **Project Structure**

```
WanderLust/
│
├── models/        # MongoDB schemas: Listings, Reviews, Users
├── routes/        # Express Routers: listings.js, reviews.js, auth.js
├── controllers/   # Business logic for listings, reviews, auth
├── middlewares/   # Custom middlewares for auth, error handling, flash messages, Joi validation
├── views/         # EJS templates for dynamic pages
├── public/        # CSS, JS, images
├── app.js         # Main server file
├── package.json   # Dependencies
└── README.md
```

---

## **Environment Variables**

Create a `.env` file in the root folder and add your keys:

```env
# MongoDB Atlas
ATLASDB_URL=<Your MongoDB Atlas Connection URI>

# Cloudinary
CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUD_API_KEY=<Your Cloudinary API Key>
CLOUD_API_SECRET=<Your Cloudinary API Secret>

# Geoapify Maps
MAP_TOKEN=<Your Geoapify API Key / Map Token>

# Stripe Payments
STRIPE_PUBLIC_KEY=<Your Stripe Publishable Key>
STRIPE_SECRET_KEY=<Your Stripe Secret Key>

# Session Secret
SECRET=<Your Session Secret>
```

---

## **Setup & Installation**

1. Clone the repository:

```bash
git clone <your-repo-link>
cd WanderLust
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with your keys (see above).

4. Run the app locally:

```bash
npm run dev
```

5. Open in browser: `http://localhost:3000`

---

## **Usage**

* Browse listings and view details on interactive maps
* Sign up/log in (or use demo account) to add listings or leave reviews
* Input validated automatically with **Joi**
* Upload images (optimized automatically via Cloudinary)
* Make secure payments via Stripe
* Search listings by category, location, or keywords

---

## **Future Enhancements**

* Real-time booking availability updates
* User profile dashboards
* Advanced filtering (price range, amenities, ratings)
* Enhanced map features (routes, distance calculations)

---

**WanderLust** combines modern web technologies, **EJS templating**, **Express middlewares**, **Joi validation**, maps, secure payments, image optimization, and modular routing to deliver a **full-featured travel listing platform**, perfect for showcasing **full-stack development skills** and **deployment on Render**.

---
