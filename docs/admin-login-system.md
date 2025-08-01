# Admin Login System - Database Documentation

## Overview
Sistem login admin telah diupgrade untuk menggunakan database MongoDB dengan collection `admin_users` yang lebih aman dan fleksibel.

## Database Schema

### Collection: `admin_users`
```javascript
{
  _id: ObjectId,
  username: String,      // Username unik untuk login
  password: String,      // Password yang di-hash dengan bcrypt
  email: String,         // Email admin (optional)
  role: String,          // 'admin' atau 'superadmin'
  isActive: Boolean,     // Status aktif/nonaktif
  createdAt: Date,       // Tanggal pembuatan
  updatedAt: Date,       // Tanggal update terakhir
  lastLoginAt: Date      // Tanggal login terakhir (optional)
}
```

## Features

### 1. **Secure Password Hashing**
- Password di-hash menggunakan bcrypt dengan salt rounds 12
- Password asli tidak pernah disimpan di database

### 2. **User Status Management**
- Field `isActive` untuk enable/disable user
- User yang tidak aktif tidak bisa login

### 3. **Login Tracking**
- `lastLoginAt` diupdate setiap kali user berhasil login
- Berguna untuk audit dan monitoring

### 4. **Role-based Access**
- Support untuk multiple role (admin, superadmin)
- Siap untuk implementasi authorization di masa depan

## Commands

### Membuat Admin User Baru
```bash
npm run create-admin
```

### Melihat Daftar Admin Users
```bash
node scripts/list-admin-users.js
```

## Login Credentials (Default)
- **Username**: `admin`
- **Password**: `admin`
- **URL**: `http://localhost:3000/admin/login`

## Security Features

### 1. **Session Management**
- JWT-based session dengan expiry 7 hari
- HttpOnly cookies untuk keamanan
- Secure cookies di production

### 2. **Password Validation**
- Minimum 1 karakter untuk username dan password
- bcrypt comparison untuk verifikasi password

### 3. **Error Handling**
- Generic error messages untuk mencegah user enumeration
- Proper error logging untuk debugging

## API Endpoints

### Login (Server Action)
- **Path**: `/admin/login` (form submission)
- **Method**: POST (via form action)
- **Body**: FormData dengan `username` dan `password`
- **Success**: Redirect ke `/admin/dashboard`
- **Error**: Redirect ke `/admin/login?error=message`

## Database Functions

### `getAdminUser(username: string)`
Mengambil admin user berdasarkan username (hanya yang aktif)

### `createAdminUser(userData: AdminUser)`
Membuat admin user baru

### `updateAdminUserLastLogin(username: string)`
Update waktu login terakhir

## Environment Variables Required
```
MONGODB_URI=mongodb://...
JWT_SECRET_KEY=your-secret-key
```

## Migration Notes
- Sistem lama menggunakan hardcoded credentials telah dihapus
- Semua login sekarang menggunakan database validation
- Backward compatibility tidak dijaga untuk keamanan

## Future Enhancements
1. Password complexity requirements
2. Account lockout after failed attempts
3. Two-factor authentication
4. Role-based dashboard access
5. Admin user management UI
