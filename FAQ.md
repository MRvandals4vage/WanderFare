# ❓ WanderFare - Frequently Asked Questions

## 🔐 Authentication & Logout Issues

### **Q: I can't logout - What's wrong?**

**FIXED!** I've updated the logout functionality to properly clear all user data and redirect to home page.

**What was changed:**
1. **Navbar** (`components/navbar.tsx`):
   - Added `window.location.href = "/"` after logout
   - This forces a full page reload, clearing all React state

2. **API Client** (`lib/api.ts`):
   - Added `localStorage.clear()` to remove ALL stored data
   - Ensures no leftover authentication tokens

**How to test:**
1. Login with any account
2. Click your profile icon (top right)
3. Click "Log out"
4. You should be redirected to home page
5. Try accessing protected pages - should require login

**If logout still doesn't work:**
```javascript
// Manual logout from browser console:
localStorage.clear()
window.location.href = "/"
```

---

## 💾 Database Persistence

### **Q: Will the database work even after closing the whole instance?**

**YES! ✅** Your database data is **permanently stored** and will persist across restarts.

### **What Gets Saved:**
- ✅ **All user accounts** (customers, vendors, admins)
- ✅ **All vendor information** (business names, addresses, cuisine types)
- ✅ **All menu items**
- ✅ **All orders** (past and present)
- ✅ **All relationships** between entities

### **MySQL Database Storage Location:**
Your data is stored in MySQL's data directory on your computer:
- **macOS (Homebrew)**: `/opt/homebrew/var/mysql/`
- **Linux**: `/var/lib/mysql/`
- **Windows**: `C:\ProgramData\MySQL\MySQL Server X.X\Data\`

### **What Happens When You:**

#### **Close Terminal/Stop Backend:**
- ❌ Backend API stops (can't make requests)
- ✅ **Database keeps ALL data**
- ✅ **MySQL service continues running**

#### **Restart Your Computer:**
- ✅ **Database keeps ALL data**
- ⚠️ MySQL service may need to restart:
  ```bash
  brew services start mysql  # macOS
  ```

#### **Stop MySQL Service:**
```bash
brew services stop mysql
```
- ❌ Can't connect to database
- ✅ **Data remains safely stored on disk**
- ✅ Restart and all data is back:
  ```bash
  brew services start mysql
  ```

### **How to Verify Data Persists:**

1. **Check your current data:**
   ```bash
   mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT * FROM users;"
   ```

2. **Close everything** (backend, frontend, terminal)

3. **Restart MySQL** (if needed):
   ```bash
   brew services start mysql
   ```

4. **Check data again** - same command:
   ```bash
   mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT * FROM users;"
   ```

5. **Result**: You'll see the **exact same data**! ✅

---

## 🔄 Application Lifecycle

### **Daily Development Workflow:**

#### **Morning (Starting Work):**
```bash
# 1. Start MySQL (if not running)
brew services start mysql

# 2. Start Backend
cd backend
mvn spring-boot:run

# 3. Start Frontend (new terminal)
npm run dev
```

#### **Evening (Stopping Work):**
```bash
# 1. Stop Frontend: Ctrl+C in terminal
# 2. Stop Backend: Ctrl+C in backend terminal
# 3. MySQL can keep running (it's a service)
```

**Your data is safe!** When you return:
- ✅ All users still exist
- ✅ All vendors still exist
- ✅ All orders still exist
- Just restart backend and frontend

---

## 🗄️ Database Backup (Recommended!)

### **Create Regular Backups:**
```bash
# Backup entire database
mysqldump -u wanderfare_user -pwanderfare_password123 wanderfare > backup_$(date +%Y%m%d).sql

# Example: Creates backup_20251007.sql
```

### **Restore from Backup:**
```bash
mysql -u wanderfare_user -pwanderfare_password123 wanderfare < backup_20251007.sql
```

---

## 🔧 Common Scenarios

### **Scenario 1: "I closed my laptop and came back"**
- ✅ Database: All data intact
- Action: Just restart backend and frontend

### **Scenario 2: "My computer crashed/restarted"**
- ✅ Database: All data intact
- Action: Start MySQL, then backend, then frontend

### **Scenario 3: "I want to start fresh with empty database"**
```bash
mysql -u root -p < backend/mysql/reset_database.sql
# Then restart backend - tables will be recreated empty
```

### **Scenario 4: "I want sample data for testing"**
```bash
mysql -u wanderfare_user -pwanderfare_password123 wanderfare < backend/mysql/sample_data.sql
```

---

## 📊 Check Database Status Anytime

### **Is MySQL Running?**
```bash
brew services list | grep mysql
# Should show: mysql started
```

### **View All Data:**
```bash
# All users
mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT email, first_name, role FROM users;"

# All vendors
mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "SELECT business_name, city, is_approved FROM vendors;"

# Count everything
mysql -u wanderfare_user -pwanderfare_password123 wanderfare -e "
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM vendors) as total_vendors,
  (SELECT COUNT(*) FROM orders) as total_orders;
"
```

---

## 🎯 Key Takeaways

1. **Database = Permanent Storage** ✅
   - Data persists across all restarts
   - Stored on your hard drive
   - Only lost if you manually delete it

2. **Backend = Temporary Process** ⏱️
   - Runs only when you start it
   - Connects to the permanent database
   - Can stop and start anytime

3. **Frontend = Browser Application** 🌐
   - Runs in development mode with `npm run dev`
   - Talks to backend API
   - No data storage (except localStorage for auth)

4. **MySQL Service = Background Process** 🔄
   - Usually runs all the time
   - Can be stopped/started
   - Guards your database files

---

## ✅ You're Safe!

Your WanderFare database is **production-grade persistent storage**. Unless you explicitly delete data or drop the database, everything is **permanently saved**! 🎉

**Test it yourself:**
1. Register a new user
2. Close everything
3. Restart
4. Login with that user - it works! ✅
