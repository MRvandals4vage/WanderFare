#!/bin/bash

# WanderFare Vendor Approval Script
# Usage: ./approve_vendor.sh [vendor_user_id]
# Or run without arguments to see all pending vendors

DB_USER="wanderfare_user"
DB_PASS="wanderfare_password123"
DB_NAME="wanderfare"

if [ -z "$1" ]; then
  echo "=== Pending Vendors ==="
  echo ""
  mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
    SELECT 
      v.user_id,
      u.email,
      v.business_name,
      v.city,
      v.cuisine_type,
      CASE WHEN v.is_approved = 1 THEN 'Approved' ELSE 'Pending' END as status
    FROM vendors v
    JOIN users u ON v.user_id = u.id
    ORDER BY v.user_id;
  "
  echo ""
  echo "To approve a vendor, run: ./approve_vendor.sh <user_id>"
else
  VENDOR_ID=$1
  echo "Approving vendor with user_id: $VENDOR_ID"
  
  mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "UPDATE vendors SET is_approved = 1 WHERE user_id = $VENDOR_ID;"
  
  if [ $? -eq 0 ]; then
    echo "✅ Vendor approved successfully!"
    echo ""
    echo "Updated vendor details:"
    mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
      SELECT 
        v.user_id,
        u.email,
        v.business_name,
        CASE WHEN v.is_approved = 1 THEN 'Approved' ELSE 'Pending' END as status
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      WHERE v.user_id = $VENDOR_ID;
    "
  else
    echo "❌ Failed to approve vendor"
  fi
fi
