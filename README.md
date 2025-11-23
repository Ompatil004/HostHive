# HostHive

HostHive is a fully-featured accommodation booking platform that allows users to discover, list, and book unique places to stay around the world. Built with Node.js, Express, MongoDB, and Cloudinary, it provides a seamless experience for both property owners and travelers.

## 🌐 Live Demo
Check out the live application: [https://hosthive-6tcw.onrender.com](https://hosthive-6tcw.onrender.com)

## 🚀 Features

### User Features
- **Browse Listings**: Discover a variety of properties across different categories
- **Search & Filter**: Filter by location, category, or specific criteria
- **Detailed Property Info**: View comprehensive property details and photos
- **User Reviews**: Leave and read reviews for properties
- **User Authentication**: Secure sign up and login functionality

### Property Owner Features
- **Add New Listings**: Easily add new properties with images and details
- **Manage Listings**: Edit or delete your property listings
- **View Reviews**: See feedback from guests

### Admin Features
- **User Management**: Manage user accounts
- **Content Moderation**: Moderate listings and reviews

## 🛠️ Tech Stack

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Passport.js**: Authentication middleware

### Frontend
- **EJS**: Embedded JavaScript templating
- **Bootstrap**: CSS framework for responsive design
- **HTML5 & CSS3**: Markup and styling
- **JavaScript**: Client-side functionality

### Services
- **Cloudinary**: Cloud-based image and video management
- **MongoDB Atlas**: Cloud-hosted MongoDB database

### Other Tools
- **Multer**: Middleware for handling multipart/form-data (file uploads)
- **Method-Override**: Allow HTML forms to send PUT and DELETE requests
- **Dotenv**: Environment variable management
- **Joi**: Object schema validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB (local instance or MongoDB Atlas account)
- Cloudinary account for image management

## 🚀 Getting Started

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/hosthive.git
cd hosthive
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the project root and add the following:

```
# Database connection URL for MongoDB Atlas
ATLASDB_URL=your_mongodb_connection_string

# Session secret for security
SECRET=your_session_secret

# Cloudinary credentials
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# JWT Secret
JWT_SECRET=your_jwt_secret

# Port number
PORT=5000
```

4. **Run the application**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📂 Project Structure

```
hostHive/
├── app.js                 # Main application file
├── cloudconfig.js         # Cloudinary configuration
├── middleware.js          # Custom middleware functions
├── schema.js              # Validation schemas
├── package.json           # Project dependencies
├── controllers/           # Request handlers
├── models/                # Mongoose models
├── routes/                # Route definitions
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   └── uploads/           # Image uploads
├── utils/                 # Utility functions
└── views/                 # EJS templates
```

## 🔐 Environment Variables

The application requires the following environment variables:

- `ATLASDB_URL`: MongoDB connection string
- `SECRET`: Session secret for security
- `CLOUD_NAME`: Cloudinary cloud name
- `API_KEY`: Cloudinary API key
- `API_SECRET`: Cloudinary API secret
- `JWT_SECRET`: JWT token secret

## 📷 Image Management

HostHive uses Cloudinary for image storage and management. When users upload images for their listings, they are automatically stored in your Cloudinary account and delivered via CDN for optimal performance.

## 🚢 Deployment

The application is deployed on Render:

- **Frontend**: [https://hosthive-6tcw.onrender.com](https://hosthive-6tcw.onrender.com)

To deploy your own version:
1. Push your code to a GitHub repository
2. Connect your repository to Render
3. Configure the environment variables in Render dashboard
4. Deploy and enjoy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues or have feature requests, please open an issue in the [GitHub repository](https://github.com/your-username/hosthive/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Your Name - [your-email@example.com](mailto:your-email@example.com)

Project Link: [https://github.com/your-username/hosthive](https://github.com/your-username/hosthive)

---

<div align="center">
  <p>Made with ❤️ by Your Name</p>
</div>