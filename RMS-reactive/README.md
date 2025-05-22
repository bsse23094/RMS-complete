# Restaurant Management System API

This is the backend API for a Restaurant Management System. It provides endpoints for managing menu items, reservations, orders, and user authentication.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/restaurant_db
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   - For development: `npm run dev`
   - For production: `npm start`

## API Endpoints

### Menu Items

| Method | Endpoint                     | Description                         |
| ------ | ---------------------------- | ----------------------------------- |
| GET    | /api/menu                    | Get all menu items                  |
| GET    | /api/menu/:id                | Get a single menu item by ID        |
| GET    | /api/menu/category/:category | Get menu items by category          |
| POST   | /api/menu                    | Create a new menu item (admin only) |
| PUT    | /api/menu/:id                | Update a menu item (admin only)     |
| DELETE | /api/menu/:id                | Delete a menu item (admin only)     |

### Reservations

| Method | Endpoint                     | Description                               |
| ------ | ---------------------------- | ----------------------------------------- |
| GET    | /api/reservations            | Get all reservations (auth required)      |
| GET    | /api/reservations/:id        | Get a single reservation (auth required)  |
| POST   | /api/reservations            | Create a new reservation                  |
| PUT    | /api/reservations/:id        | Update a reservation (auth required)      |
| DELETE | /api/reservations/:id        | Delete a reservation (admin only)         |
| PATCH  | /api/reservations/:id/status | Update reservation status (auth required) |

### Orders

| Method | Endpoint               | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| GET    | /api/orders            | Get all orders (auth required)      |
| GET    | /api/orders/:id        | Get a single order (auth required)  |
| POST   | /api/orders            | Create a new order                  |
| PUT    | /api/orders/:id        | Update an order (auth required)     |
| DELETE | /api/orders/:id        | Delete an order (admin only)        |
| PATCH  | /api/orders/:id/status | Update order status (auth required) |

### Users

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| POST   | /api/users/register | Register a new user                 |
| POST   | /api/users/login    | Login user                          |
| GET    | /api/users/profile  | Get user profile (auth required)    |
| PUT    | /api/users/profile  | Update user profile (auth required) |
| GET    | /api/users          | Get all users (admin only)          |

## Authentication

Most API endpoints require authentication. To authenticate, include an `Authorization` header with a Bearer token:

```
Authorization: Bearer <your_token>
```

The token is obtained from the login or register endpoint.

## Role-Based Access Control

- `customer`: Regular user (default)
- `staff`: Restaurant staff with access to orders and reservations
- `admin`: Administrator with full access to all endpoints

## Models

### MenuItem

- `name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: String (required) - One of: 'appetizer', 'main course', 'dessert', 'beverage'
- `image`: String
- `featured`: Boolean
- `isAvailable`: Boolean
- `createdAt`: Date

### Reservation

- `customerName`: String (required)
- `email`: String (required)
- `phone`: String (required)
- `date`: Date (required)
- `time`: String (required)
- `partySize`: Number (required)
- `tableNumber`: Number
- `specialRequests`: String
- `status`: String - One of: 'pending', 'confirmed', 'cancelled', 'completed'
- `createdAt`: Date

### Order

- `customer`: Object
  - `name`: String (required)
  - `email`: String (required)
  - `phone`: String (required)
- `items`: Array
  - `menuItem`: ObjectId (reference to MenuItem)
  - `name`: String
  - `price`: Number
  - `quantity`: Number
- `totalAmount`: Number (required)
- `orderType`: String (required) - One of: 'dine-in', 'takeout', 'delivery'
- `tableNumber`: Number
- `deliveryAddress`: Object
  - `street`: String
  - `city`: String
  - `state`: String
  - `zipCode`: String
- `status`: String - One of: 'pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'
- `paymentStatus`: String - One of: 'pending', 'paid', 'failed'
- `paymentMethod`: String - One of: 'cash', 'card', 'online'
- `createdAt`: Date

### User

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required)
- `role`: String - One of: 'customer', 'staff', 'admin'
- `phone`: String
- `address`: Object
  - `street`: String
  - `city`: String
  - `state`: String
  - `zipCode`: String
- `createdAt`: Date
