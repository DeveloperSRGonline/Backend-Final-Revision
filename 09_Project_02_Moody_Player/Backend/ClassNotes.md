# Database aur Security Notes

## Security
- Database connection string directly GitHub pe push nahi karna
- `.env` file mein rakhna aur usko `.gitignore` mein add karna
- `process.env.VARIABLE_NAME` se access karna

## Storage Options
### Local Storage
- Locally use kar sakte ho
- Storage limitation hai

### Cloud Storage
- Free tier: 512MB tak
- Large data (images, songs) ke liye
- ImageKit/Cloudinary use karo

## Production Setup
### Configuration
- Routes alag folder mein banana (`routes/`)
- `app.js` mein sab kuchh nahi likhna

### Server Setup
```javascript
require('dotenv').config()
```
```javascript
process.env.MONGO_URI
```

## File Upload
### Postman
- Raw format nahi chalega
- **form-data** use karna
- Key type: **File** select karna

## Important Points
1. `.env` → GitHub ✗
2. `process.env` → Access ✓
3. Database → Small data
4. Cloud storage → Large data
5. Production → Separate routes folder
6. Postman → form-data for files