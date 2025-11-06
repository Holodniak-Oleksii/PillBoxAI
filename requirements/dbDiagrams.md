# PillBoxAI Database Diagram

## Overview
This document contains the database schema for the PillBoxAI application - a web application for managing home medicine kits with reminders and AI photo recognition capabilities.

## Database Schema (dbdiagram.io format)

```dbml
// PillBoxAI Database Schema
// Generated for PostgreSQL

Project PillBoxAI {
  database_type: 'PostgreSQL'
  Note: 'Home medicine kit management system with AI recognition and reminders'
}

// ==================== USERS & AUTHENTICATION ====================

Table users {
  id bigserial [pk, increment]
  email varchar(255) [unique, not null]
  username varchar(100) [unique, not null]
  password_hash varchar(255) [not null]
  first_name varchar(100)
  last_name varchar(100)
  phone_number varchar(20)
  locale varchar(5) [default: 'uk', note: 'uk/en']
  timezone varchar(50) [default: 'Europe/Kiev']
  is_active boolean [default: true]
  is_verified boolean [default: false]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  last_login_at timestamp
  
  indexes {
    email
    username
    is_active
  }
}

Table user_tokens {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, not null]
  token_type varchar(20) [not null, note: 'JWT_REFRESH/VERIFICATION/PASSWORD_RESET']
  token_hash varchar(255) [not null]
  expires_at timestamp [not null]
  is_used boolean [default: false]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    token_hash
    user_id
    expires_at
  }
}

// ==================== AID KITS ====================

Table aid_kits {
  id bigserial [pk, increment]
  owner_id bigint [ref: > users.id, not null]
  name varchar(100) [not null]
  description text
  location varchar(255) [note: 'Physical location of the kit']
  is_primary boolean [default: false]
  color varchar(7) [note: 'Hex color for UI']
  icon varchar(50) [note: 'Icon identifier for UI']
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    owner_id
    is_primary
  }
}

Table aid_kit_members {
  id bigserial [pk, increment]
  aid_kit_id bigint [ref: > aid_kits.id, not null]
  user_id bigint [ref: > users.id, not null]
  role varchar(20) [not null, note: 'OWNER/ADMIN/MEMBER/VIEWER']
  can_edit boolean [default: false]
  can_delete boolean [default: false]
  joined_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    (aid_kit_id, user_id) [unique]
    user_id
  }
}

// ==================== PILLS & MEDICINES ====================

Table pills {
  id bigserial [pk, increment]
  aid_kit_id bigint [ref: > aid_kits.id, not null]
  name varchar(255) [not null]
  brand varchar(100)
  active_substance varchar(255)
  dosage varchar(100) [note: 'e.g., 500mg, 10ml']
  form varchar(50) [note: 'tablet/capsule/syrup/injection/cream/drops']
  manufacturer varchar(255)
  barcode varchar(50)
  registration_number varchar(100)
  description text
  usage_instructions text
  side_effects text
  contraindications text
  storage_conditions varchar(255)
  prescription_required boolean [default: false]
  created_by bigint [ref: > users.id]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    aid_kit_id
    name
    barcode
    active_substance
  }
}

Table pill_inventory {
  id bigserial [pk, increment]
  pill_id bigint [ref: > pills.id, not null]
  quantity decimal(10,2) [not null]
  unit varchar(20) [not null, note: 'pieces/ml/mg/g']
  expiry_date date [not null]
  batch_number varchar(50)
  purchase_date date
  purchase_price decimal(10,2)
  purchase_location varchar(255)
  opened_date date
  is_expired boolean [default: false]
  is_running_low boolean [default: false]
  min_quantity decimal(10,2) [note: 'Minimum quantity threshold']
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    pill_id
    expiry_date
    is_expired
    is_running_low
  }
}

Table pill_categories {
  id bigserial [pk, increment]
  name varchar(100) [unique, not null]
  parent_id bigint [ref: > pill_categories.id]
  icon varchar(50)
  color varchar(7)
  sort_order int [default: 0]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    parent_id
    sort_order
  }
}

Table pill_category_mappings {
  pill_id bigint [ref: > pills.id, not null]
  category_id bigint [ref: > pill_categories.id, not null]
  
  indexes {
    (pill_id, category_id) [unique]
  }
}

// ==================== REMINDERS ====================

Table reminders {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, not null]
  pill_id bigint [ref: > pills.id, not null]
  type varchar(20) [not null, note: 'EXPIRY/RUNNING_LOW/INTAKE']
  title varchar(255) [not null]
  message text
  remind_at timestamp [not null]
  remind_before_days int [note: '30/7/1 for expiry reminders']
  frequency varchar(20) [note: 'ONCE/DAILY/WEEKLY/MONTHLY']
  is_active boolean [default: true]
  is_sent boolean [default: false]
  sent_at timestamp
  is_acknowledged boolean [default: false]
  acknowledged_at timestamp
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    user_id
    pill_id
    remind_at
    is_active
    is_sent
  }
}

Table reminder_schedules {
  id bigserial [pk, increment]
  reminder_id bigint [ref: > reminders.id, not null]
  day_of_week int [note: '0-6 for Sunday-Saturday']
  time_of_day time [not null]
  dosage varchar(100)
  notes text
  
  indexes {
    reminder_id
    day_of_week
  }
}

// ==================== AI RECOGNITION ====================

Table ai_recognition_logs {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, not null]
  aid_kit_id bigint [ref: > aid_kits.id]
  image_url text [not null]
  image_hash varchar(64) [note: 'SHA-256 hash for deduplication']
  recognition_status varchar(20) [not null, note: 'PENDING/PROCESSING/SUCCESS/FAILED']
  recognition_result jsonb [note: 'JSON with recognized pills and confidence']
  confidence_score decimal(5,2) [note: 'Overall confidence percentage']
  processing_time_ms int
  error_message text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  processed_at timestamp
  
  indexes {
    user_id
    recognition_status
    created_at
    image_hash
  }
}

Table recognized_pills {
  id bigserial [pk, increment]
  recognition_log_id bigint [ref: > ai_recognition_logs.id, not null]
  pill_id bigint [ref: > pills.id]
  recognized_name varchar(255)
  confidence_score decimal(5,2) [not null]
  bounding_box jsonb [note: 'Coordinates in image']
  matched boolean [default: false]
  user_confirmed boolean
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    recognition_log_id
    pill_id
    confidence_score
  }
}

// ==================== USAGE TRACKING ====================

Table usage_logs {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, not null]
  pill_id bigint [ref: > pills.id, not null]
  inventory_id bigint [ref: > pill_inventory.id]
  quantity_used decimal(10,2) [not null]
  unit varchar(20) [not null]
  usage_date timestamp [not null]
  purpose varchar(255)
  notes text
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    user_id
    pill_id
    usage_date
  }
}

// ==================== NOTIFICATIONS ====================

Table notification_preferences {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, unique, not null]
  email_enabled boolean [default: true]
  push_enabled boolean [default: false]
  sms_enabled boolean [default: false]
  expiry_reminder_30d boolean [default: true]
  expiry_reminder_7d boolean [default: true]
  expiry_reminder_1d boolean [default: true]
  low_stock_reminder boolean [default: true]
  intake_reminder boolean [default: true]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  updated_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    user_id
  }
}

Table notification_queue {
  id bigserial [pk, increment]
  user_id bigint [ref: > users.id, not null]
  type varchar(20) [not null, note: 'EMAIL/PUSH/SMS']
  subject varchar(255)
  body text [not null]
  metadata jsonb
  status varchar(20) [default: 'PENDING', note: 'PENDING/SENT/FAILED']
  scheduled_for timestamp
  sent_at timestamp
  error_message text
  retry_count int [default: 0]
  created_at timestamp [default: 'CURRENT_TIMESTAMP']
  
  indexes {
    user_id
    status
    scheduled_for
  }
}
```

## Relationships Summary

### Core Relationships
- **Users** own **Aid Kits** (1:N)
- **Aid Kits** contain **Pills** (1:N)
- **Pills** have **Inventory** records (1:N)
- **Users** can be **Members** of multiple Aid Kits (N:M through aid_kit_members)
- **Pills** belong to **Categories** (N:M through pill_category_mappings)

### Feature Relationships
- **Users** have **Reminders** for **Pills** (1:N)
- **Reminders** have **Schedules** (1:N)
- **Users** create **AI Recognition Logs** (1:N)
- **Recognition Logs** identify **Pills** (1:N through recognized_pills)
- **Users** track **Usage** of **Pills** (1:N)

### Supporting Relationships
- **Users** have **Notification Preferences** (1:1)
- **Users** receive **Notifications** (1:N)
- **All entities** generate **Activity Logs** (polymorphic)
- **Users** generate **Tokens** for authentication (1:N)

## Key Features Supported

1. **Multi-user Aid Kit Management**: Users can create and share aid kits with role-based permissions
2. **Comprehensive Medicine Tracking**: Detailed pill information with inventory management
3. **Smart Reminders**: Configurable reminders for expiry (30/7/1 days), low stock, and intake schedules
4. **AI Photo Recognition**: Track recognition attempts with confidence scores and user confirmation
5. **Usage Analytics**: Monitor medicine consumption patterns
6. **Multi-language Support**: Built-in localization for uk/en
7. **Audit Trail**: Complete activity logging for security and compliance
8. **Flexible Notifications**: Multiple channels (email/push/SMS) with user preferences

## Performance Considerations

- Indexed fields for common queries (search, filter, sort operations)
- JSONB fields for flexible data storage (recognition results, metadata)
- Timestamp fields for temporal queries and reminder scheduling
- Proper foreign key constraints for data integrity

## Security Features

- Password hashing (password_hash field)
- JWT token management (user_tokens table)
- IP tracking for audit (activity_logs)
- Role-based access control (aid_kit_members.role)
- Token expiration and usage tracking