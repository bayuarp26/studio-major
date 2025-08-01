# Sistem Single Session Admin

## Deskripsi
Sistem keamanan untuk memastikan hanya satu admin yang dapat login pada satu waktu. Jika ada admin lain yang login, session yang lama akan otomatis di-logout.

## Fitur

### 1. Single Session Enforcement
- Hanya satu session aktif per admin
- Login baru akan membatalkan session yang lama
- Session divalidasi setiap 30 detik

### 2. Real-time Session Monitoring
- Komponen `SessionChecker` memantau status session
- Notifikasi toast ketika session dibatalkan
- Auto-redirect ke halaman login

### 3. Database Session Tracking
- Field `activeSessionId` di tabel AdminUser
- Session ID unik untuk setiap login
- Validasi session di database dan JWT

## Komponen

### SessionChecker Component
```tsx
// Komponen yang memantau session secara real-time
<SessionChecker />
```

### API Endpoints

#### 1. Check Session Status
```
GET /api/admin/check-session
```
- Memeriksa validitas session saat ini
- Return 401 jika session tidak valid

#### 2. Force Logout All Sessions
```
POST /api/admin/force-logout-all
```
- Membatalkan semua session admin aktif
- Berguna untuk emergency atau testing

## Cara Kerja

### 1. Login Process
1. Admin melakukan login
2. System generate unique `sessionId` menggunakan `randomUUID()`
3. Session ID disimpan di database (`activeSessionId`)
4. JWT token dibuat dengan session ID
5. Session lama (jika ada) otomatis dibatalkan

### 2. Session Validation
1. Middleware memeriksa JWT token basic validation
2. `getSession()` function memeriksa:
   - JWT token validity
   - Token expiration
   - Session ID match dengan database
3. Jika tidak match, session dibatalkan

### 3. Real-time Monitoring
1. `SessionChecker` component berjalan setiap 30 detik
2. Memanggil `/api/admin/check-session`
3. Jika session invalid, tampilkan notifikasi dan redirect

## File yang Dimodifikasi

### 1. Types (`src/lib/types.ts`)
- Tambah `activeSessionId` di `AdminUser`
- Tambah `sessionId` di `SessionPayload`

### 2. Authentication (`src/lib/auth.ts`)
- Update `createSession()` untuk generate session ID
- Update `getSession()` untuk validasi session ID
- Update `logout()` untuk clear active session

### 3. Database (`src/lib/data.ts`)
- `updateAdminUserActiveSession()`
- `clearAdminUserActiveSession()`
- `clearAllAdminActiveSessions()`

### 4. Middleware (`src/middleware.ts`)
- Enhanced session validation
- Clear invalid sessions

### 5. Components
- `SessionChecker.tsx` - Real-time monitoring
- Update dashboard untuk include SessionChecker

### 6. API Routes
- `/api/admin/check-session` - Session validation
- `/api/admin/force-logout-all` - Emergency logout

## Testing

### Test Single Session
1. Login sebagai admin di browser 1
2. Login sebagai admin yang sama di browser 2
3. Browser 1 harus otomatis logout dalam 30 detik

### Test Force Logout
```javascript
// Call API untuk force logout semua session
fetch('/api/admin/force-logout-all', { 
  method: 'POST',
  credentials: 'include' 
})
```

## Security Features

### 1. Session Hijacking Prevention
- Unique session ID per login
- Database validation
- Regular session checks

### 2. Concurrent Login Protection
- Only one active session per admin
- Automatic session termination

### 3. Session Expiration
- JWT expiration (7 days)
- Database session tracking
- Regular validation

## Configuration

### Environment Variables
```env
JWT_SECRET_KEY=your-super-secret-key-that-is-long-and-secure
```

### Session Check Interval
```javascript
// Ubah interval di SessionChecker.tsx
const checkInterval = 30000; // 30 seconds (default)
```

## Monitoring & Logging

### Session Events
- Login events dengan session ID
- Session termination logging
- Invalid session attempts

### Database Queries
- Session validation queries
- Active session cleanup
- Audit trail untuk admin sessions

## Troubleshooting

### Problem: Session tidak ter-invalidate
**Solution**: Periksa koneksi database dan pastikan `activeSessionId` ter-update

### Problem: SessionChecker tidak berfungsi
**Solution**: Pastikan komponen di-import dan toast hook tersedia

### Problem: Multiple session masih bisa aktif
**Solution**: Periksa JWT secret key dan validasi session ID di database

## Best Practices

1. **Regular Session Cleanup**
   - Jalankan cleanup untuk expired sessions
   - Monitor database untuk orphaned sessions

2. **Error Handling**
   - Handle network errors gracefully
   - Provide fallback untuk session validation

3. **User Experience**
   - Informative notifications
   - Smooth redirect experience
   - Clear error messages

4. **Security**
   - Strong JWT secret
   - HTTPS untuk production
   - Regular security audits
