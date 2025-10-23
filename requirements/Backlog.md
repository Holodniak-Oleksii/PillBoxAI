# 📋 PillBoxAI - План спринтів (Scrum)

## Загальна інформація

**Тривалість спринту:** 1 тиждень (20-30 годин)  
**Загальна кількість спринтів:** 10  
**Методологія:** Scrum  
**Команда:** 2 розробники (Backend + Frontend)

---

## Sprint 0: Підготовка та узгодження (Тиждень 1)
**Мета:** Фіналізація документації та підготовка інфраструктури

### Завдання Backend (12-15 годин):
- [ ] **[INFRA-1]** Налаштування проекту Spring Boot (3 год)
  - Ініціалізація проекту з Gradle
  - Налаштування структури пакетів
  - Конфігурація application.yml
- [ ] **[INFRA-2]** Налаштування PostgreSQL та Docker (3 год)
  - Docker Compose конфігурація
  - Створення БД схеми
  - Налаштування Flyway міграцій
- [ ] **[DOC-1]** Створення OpenAPI/Swagger специфікації (4 год)
  - Опис всіх endpoints
  - Моделі даних
  - Схеми запитів/відповідей
- [ ] **[INFRA-3]** Налаштування CI/CD pipeline (2-3 год)
  - GitHub Actions або GitLab CI
  - Автоматичні тести
  - Build та deploy скрипти

### Завдання Frontend (12-15 годин):
- [ ] **[INFRA-4]** Ініціалізація React проекту (2 год)
  - Create React App з TypeScript
  - Налаштування Chakra UI
  - Конфігурація Zustand
- [ ] **[INFRA-5]** Налаштування структури проекту (2 год)
  - Організація папок (components, pages, stores, utils)
  - Налаштування роутингу
  - Конфігурація Axios
- [ ] **[DOC-2]** Створення UI/UX макетів у Figma (6 год)
  - Wireframes основних сторінок
  - Дизайн-система (кольори, шрифти, компоненти)
  - Адаптивні макети
- [ ] **[INFRA-6]** Налаштування локалізації (i18n) (3 год)
  - Інтеграція react-i18next
  - Створення файлів перекладів (uk, en, pl)
  - Налаштування переключення мов

### Definition of Done:
- ✅ Проекти налаштовані та запускаються локально
- ✅ Docker контейнери працюють
- ✅ API документація створена
- ✅ UI макети затверджені
- ✅ CI/CD pipeline налаштований

---

## Sprint 1: Система авторизації - Backend (Тиждень 2)
**Мета:** Реалізація backend частини авторизації та реєстрації

### Завдання (20-25 годин):
- [ ] **[AUTH-1]** Створення User entity та репозиторію (3 год)
  - User model (id, email, password, firstName, lastName, role, createdAt)
  - JPA репозиторій
  - Flyway міграція для таблиці users
- [ ] **[AUTH-2]** Імплементація Spring Security (5 год)
  - SecurityConfig налаштування
  - JWT filter
  - CORS конфігурація
  - Захист endpoints
- [ ] **[AUTH-3]** JWT токен генерація та валідація (4 год)
  - JwtTokenProvider сервіс
  - Access та Refresh токени
  - Token expiration handling
- [ ] **[AUTH-4]** Password hashing з BCrypt (2 год)
  - PasswordEncoder конфігурація
  - Безпечне зберігання паролів
- [ ] **[AUTH-5]** Реєстрація користувачів (4 год)
  - POST /api/auth/register endpoint
  - Валідація даних (email, password strength)
  - Перевірка унікальності email
- [ ] **[AUTH-6]** Авторізація користувачів (3 год)
  - POST /api/auth/login endpoint
  - Генерація JWT токенів
  - Обробка помилок (invalid credentials)
- [ ] **[AUTH-7]** Юніт та інтеграційні тести (4 год)
  - Тести для AuthController
  - Тести для JwtTokenProvider
  - Тести для UserService

### Definition of Done:
- ✅ Користувач може зареєструватися через API
- ✅ Користувач може авторизуватися та отримати JWT
- ✅ Паролі зберігаються у хешованому вигляді
- ✅ Всі тести проходять успішно
- ✅ API документація оновлена

---

## Sprint 2: Система авторизації - Frontend (Тиждень 3)
**Мета:** Реалізація UI для авторизації та реєстрації

### Завдання (20-25 годин):
- [ ] **[AUTH-8]** Створення Zustand store для аутентифікації (3 год)
  - authStore (user, token, isAuthenticated)
  - Actions (login, logout, register, refreshToken)
  - Persist store у localStorage
- [ ] **[AUTH-9]** Axios interceptors для JWT (3 год)
  - Автоматичне додавання токену до headers
  - Refresh token logic
  - Обробка 401 помилок
- [ ] **[AUTH-10]** Форма реєстрації (5 год)
  - UI компонент з Chakra UI
  - Валідація форми (email, password, confirm password)
  - Обробка помилок
  - Локалізація (uk, en, pl)
- [ ] **[AUTH-11]** Форма авторизації (4 год)
  - UI компонент з Chakra UI
  - Remember me функціонал
  - Forgot password link
  - Локалізація
- [ ] **[AUTH-12]** Protected routes (3 год)
  - PrivateRoute компонент
  - Redirect на login для неавторизованих
  - Автоматичний редірект після login
- [ ] **[AUTH-13]** Responsive дизайн (3 год)
  - Адаптація під мобільні пристрої
  - Tablet та desktop версії
- [ ] **[AUTH-14]** E2E тестування (4 год)
  - Тести реєстрації
  - Тести авторизації
  - Тести protected routes

### Definition of Done:
- ✅ Користувач може зареєструватися через UI
- ✅ Користувач може увійти та вийти
- ✅ JWT токени зберігаються та використовуються
- ✅ Інтерфейс адаптивний
- ✅ Підтримка 3 мов (uk, en, pl)
- ✅ E2E тести проходять

---

## Sprint 3: Кабінет користувача - Backend (Тиждень 4)
**Мета:** Розробка API для особистого кабінету

### Завдання (20-25 годин):
- [ ] **[PROFILE-1]** Розширення User entity (3 год)
  - Додаткові поля (phone, dateOfBirth, avatar, language, timezone)
  - Flyway міграція
  - Оновлення репозиторію
- [ ] **[PROFILE-2]** UserPreferences entity (4 год)
  - Модель налаштувань (notificationEnabled, reminderDays, theme)
  - OneToOne зв'язок з User
  - Репозиторій та сервіс
- [ ] **[PROFILE-3]** Profile management API (5 год)
  - GET /api/profile - отримання профілю
  - PUT /api/profile - оновлення профілю
  - PATCH /api/profile/avatar - завантаження аватару
  - DELETE /api/profile/avatar - видалення аватару
- [ ] **[PROFILE-4]** Preferences API (4 год)
  - GET /api/profile/preferences
  - PUT /api/profile/preferences
  - Валідація налаштувань
- [ ] **[PROFILE-5]** File upload сервіс (4 год)
  - Збереження файлів (локально або S3)
  - Image processing (resize, crop)
  - Валідація типів файлів
- [ ] **[PROFILE-6]** Тестування (5 год)
  - Юніт тести для сервісів
  - Інтеграційні тести для API
  - Тести file upload

### Definition of Done:
- ✅ API для управління профілем працює
- ✅ Можливість завантаження аватару
- ✅ Налаштування зберігаються
- ✅ Всі тести проходять
- ✅ API документація оновлена

---

## Sprint 4: Кабінет користувача - Frontend (Тиждень 5)
**Мета:** Розробка UI особистого кабінету та дашборду

### Завдання (20-25 годин):
- [ ] **[PROFILE-7]** Profile store у Zustand (2 год)
  - profileStore (profile, preferences)
  - Actions (fetchProfile, updateProfile, uploadAvatar)
- [ ] **[PROFILE-8]** Сторінка профілю (6 год)
  - Відображення інформації користувача
  - Форма редагування профілю
  - Avatar upload компонент з crop
  - Валідація та обробка помилок
- [ ] **[PROFILE-9]** Сторінка налаштувань (5 год)
  - Notification settings
  - Language selector
  - Theme switcher (light/dark)
  - Timezone selector
- [ ] **[PROFILE-10]** Dashboard компонент (7 год)
  - Статистика (кількість ліків, що спливають)
  - Швидкі дії (додати ліки, переглянути нагадування)
  - Графіки та charts (recharts)
  - Останні додані ліки
- [ ] **[PROFILE-11]** Responsive дизайн (3 год)
  - Адаптація під різні екрани
  - Mobile-first підхід
- [ ] **[PROFILE-12]** Тестування (2 год)
  - Component тести
  - Integration тести

### Definition of Done:
- ✅ Користувач може редагувати профіль
- ✅ Аватар завантажується та відображається
- ✅ Налаштування працюють
- ✅ Dashboard показує актуальну інформацію
- ✅ Інтерфейс адаптивний

---

## Sprint 5: Управління аптечками - Backend (Тиждень 6)
**Мета:** Реалізація CRUD для аптечок та категорій

### Завдання (22-28 годин):
- [ ] **[MED-1]** MedicineBox entity (4 год)
  - Модель (id, name, description, userId, createdAt, updatedAt)
  - ManyToOne зв'язок з User
  - Репозиторій та сервіс
  - Flyway міграція
- [ ] **[MED-2]** Category entity (3 год)
  - Модель (id, name, icon, color)
  - Репозиторій
  - Seed дані (базові категорії)
- [ ] **[MED-3]** MedicineBox CRUD API (8 год)
  - POST /api/boxes - створення аптечки
  - GET /api/boxes - список аптечок користувача
  - GET /api/boxes/{id} - деталі аптечки
  - PUT /api/boxes/{id} - оновлення
  - DELETE /api/boxes/{id} - видалення
  - Валідація та авторизація
- [ ] **[MED-4]** Category API (3 год)
  - GET /api/categories - список категорій
  - POST /api/categories - створення (admin)
  - PUT /api/categories/{id} - оновлення (admin)
- [ ] **[MED-5]** Pagination та сортування (4 год)
  - Pageable для списків
  - Сортування за різними полями
  - Filtering
- [ ] **[MED-6]** Тестування (6 год)
  - Юніт тести
  - Інтеграційні тести
  - Тести авторизації

### Definition of Done:
- ✅ CRUD для аптечок працює
- ✅ Категорії доступні через API
- ✅ Pagination та сортування реалізовані
- ✅ Тести проходять
- ✅ API документація оновлена

---

## Sprint 6: Управління ліками - Backend (Тиждень 7)
**Мета:** Реалізація CRUD для ліків та пошуку

### Завдання (24-30 годин):
- [ ] **[MED-7]** Medicine entity (5 год)
  - Модель (id, name, dosage, quantity, expiryDate, categoryId, boxId, notes, barcode)
  - ManyToOne зв'язки
  - Репозиторій та сервіс
  - Flyway міграція
- [ ] **[MED-8]** Medicine CRUD API (10 год)
  - POST /api/medicines - додавання ліків
  - GET /api/medicines - список з фільтрами
  - GET /api/medicines/{id} - деталі
  - PUT /api/medicines/{id} - оновлення
  - DELETE /api/medicines/{id} - видалення
  - PATCH /api/medicines/{id}/quantity - оновлення кількості
- [ ] **[MED-9]** Пошук та фільтрація (6 год)
  - Full-text search (PostgreSQL FTS)
  - Фільтри (category, expiryDate, boxId, quantity)
  - Сортування (name, expiryDate, quantity)
  - Пагінація
- [ ] **[MED-10]** Batch operations (4 год)
  - POST /api/medicines/batch - додавання кількох ліків
  - DELETE /api/medicines/batch - видалення кількох
  - PUT /api/medicines/batch - оновлення кількох
- [ ] **[MED-11]** Тестування (5 год)
  - Юніт тести
  - Інтеграційні тести
  - Тести пошуку та фільтрації

### Definition of Done:
- ✅ CRUD для ліків працює
- ✅ Пошук знаходить релевантні результати
- ✅ Фільтрація та сортування працюють
- ✅ Batch operations реалізовані
- ✅ Час відгуку ≤ 5 секунд

---

## Sprint 7: Управління аптечками та ліками - Frontend (Тиждень 8)
**Мета:** Розробка UI для управління аптечками та ліками

### Завдання (25-30 годин):
- [ ] **[MED-12]** Zustand stores (4 год)
  - boxStore (boxes, currentBox)
  - medicineStore (medicines, filters, pagination)
  - categoryStore (categories)
- [ ] **[MED-13]** Список аптечок (5 год)
  - Grid/List view
  - Створення нової аптечки (modal)
  - Редагування та видалення
  - Drag & drop для сортування
- [ ] **[MED-14]** Список ліків (8 год)
  - Table view з сортуванням
  - Фільтри (sidebar)
  - Пошук (debounced)
  - Pagination
  - Bulk actions (select multiple, delete)
- [ ] **[MED-15]** Форма додавання/редагування ліків (6 год)
  - Modal або окрема сторінка
  - Всі поля (name, dosage, quantity, expiry, category)
  - Barcode scanner (опціонально)
  - Валідація
- [ ] **[MED-16]** Деталі ліків (3 год)
  - Повна інформація
  - Історія змін
  - Швидке редагування
- [ ] **[MED-17]** Тестування (4 год)
  - Component тести
  - Integration тести
  - E2E тести

### Definition of Done:
- ✅ Користувач може створювати аптечки
- ✅ Користувач може додавати/редагувати/видаляти ліки
- ✅ Пошук та фільтрація працюють
- ✅ Інтерфейс зручний та інтуїтивний
- ✅ Responsive дизайн

---

## Sprint 8: Система нагадувань (Тиждень 9)
**Мета:** Реалізація автоматичних нагадувань про терміни придатності

### Завдання Backend (12-15 годин):
- [ ] **[NOTIF-1]** Notification entity (3 год)
  - Модель (id, userId, medicineId, type, message, sentAt, readAt)
  - Репозиторій та сервіс
  - Flyway міграція
- [ ] **[NOTIF-2]** Notification scheduler (5 год)
  - Spring @Scheduled task
  - Перевірка термінів придатності (30/7/1 день)
  - Генерація нагадувань
  - Cron expression налаштування
- [ ] **[NOTIF-3]** Notification API (3 год)
  - GET /api/notifications - список нагадувань
  - PATCH /api/notifications/{id}/read - позначити прочитаним
  - DELETE /api/notifications/{id} - видалити
- [ ] **[NOTIF-4]** Тестування (4 год)
  - Тести scheduler
  - Тести API
  - Інтеграційні тести

### Завдання Frontend (10-12 годин):
- [ ] **[NOTIF-5]** Notification store (2 год)
  - notificationStore (notifications, unreadCount)
  - Actions (fetch, markAsRead, delete)
- [ ] **[NOTIF-6]** Notification bell компонент (4 год)
  - Badge з кількістю непрочитаних
  - Dropdown з списком
  - Real-time updates (polling або WebSocket)
- [ ] **[NOTIF-7]** Сторінка нагадувань (3 год)
  - Список всіх нагадувань
  - Фільтри (read/unread, type)
  - Bulk actions
- [ ] **[NOTIF-8]** Тестування (3 год)
  - Component тести
  - Integration тести

### Definition of Done:
- ✅ Нагадування генеруються автоматично
- ✅ Користувач бачить нагадування в UI
- ✅ Можливість позначити прочитаним
- ✅ Нагадування за 30/7/1 день працюють

---

## Sprint 9: AI розпізнавання (Тиждень 10)
**Мета:** Інтеграція AI для розпізнавання ліків з фото

### Завдання Backend (15-18 годин):
- [ ] **[AI-1]** AI service інтеграція (5 год)
  - Вибір AI сервісу (Google Vision API, Tesseract OCR, custom model)
  - Налаштування API ключів
  - Wrapper сервіс
- [ ] **[AI-2]** Image processing pipeline (4 год)
  - Image upload та валідація
  - Preprocessing (resize, enhance, denoise)
  - OCR extraction
- [ ] **[AI-3]** AI recognition API (4 год)
  - POST /api/ai/recognize - розпізнавання з фото
  - Parsing результатів (name, dosage, expiry)
  - Confidence scoring
- [ ] **[AI-4]** Оптимізація та кешування (3 год)
  - Кешування результатів
  - Async processing
  - Queue для batch processing
- [ ] **[AI-5]** Тестування (4 год)
  - Тести з різними зображеннями
  - Перевірка точності
  - Performance тести

### Завдання Frontend (10-12 годин):
- [ ] **[AI-6]** AI store (2 год)
  - aiStore (recognitionResult, isProcessing)
  - Actions (uploadImage, confirmResult)
- [ ] **[AI-7]** Photo upload компонент (4 год)
  - Drag & drop
  - Camera capture (mobile)
  - Preview
  - Progress indicator
- [ ] **[AI-8]** Результати розпізнавання (4 год)
  - Відображення розпізнаних даних
  - Confidence indicators
  - Manual correction форма
  - Підтвердження та збереження
- [ ] **[AI-9]** Тестування (2 год)
  - Component тести
  - E2E тести

### Definition of Done:
- ✅ AI розпізнає ліки з фото
- ✅ Час обробки ≤ 15 секунд
- ✅ Точність ≥ 85%
- ✅ Користувач може виправити результати
- ✅ Інтеграція з формою додавання ліків

---

## Sprint 10: Інтеграція Google Sheets та фінальне тестування (Тиждень 11)
**Мета:** Підключення Google Sheets API та підготовка до релізу

### Завдання Backend (12-15 годин):
- [ ] **[INT-1]** Google Sheets API інтеграція (5 год)
  - OAuth 2.0 налаштування
  - Google API client
  - Credentials management
- [ ] **[INT-2]** Sync service (5 год)
  - Export даних до Google Sheets
  - Import даних з Google Sheets
  - Data mapping та transformation
  - Conflict resolution
- [ ] **[INT-3]** Sync API (3 год)
  - POST /api/sync/export - експорт
  - POST /api/sync/import - імпорт
  - GET /api/sync/status - статус синхронізації
- [ ] **[INT-4]** Тестування інтеграції (4 год)

### Завдання Frontend (8-10 годин):
- [ ] **[INT-5]** Sync UI (4 год)
  - Google OAuth flow
  - Sync settings
  - Manual sync buttons
  - Sync status indicator
- [ ] **[INT-6]** Export/Import UI (3 год)
  - Export to CSV/Excel
  - Import from file
  - Data preview
- [ ] **[INT-7]** Тестування (3 год)

### Фінальне тестування (8-10 годин):
- [ ] **[TEST-1]** Security audit (3 год)
  - Penetration testing
  - Vulnerability scanning
  - OWASP Top 10 перевірка
- [ ] **[TEST-2]** Performance testing (3 год)
  - Load testing
  - Stress testing
  - Оптимізація bottlenecks
- [ ] **[TEST-3]** UAT (User Acceptance Testing) (2 год)
  - Тестування з реальними користувачами
  - Збір feedback
- [ ] **[TEST-4]** Bug fixing та polish (4 год)

### Definition of Done:
- ✅ Google Sheets синхронізація працює
- ✅ Export/Import функціонує
- ✅ Всі критичні баги виправлені
- ✅ Performance вимоги виконані
- ✅ Security audit пройдений
- ✅ Додаток готовий до релізу

---

## Додаткові спринти (за потреби)

### Sprint 11: Поліпшення та додаткові функції
**Можливі завдання:**
- Email notifications
- Push notifications (PWA)
- Barcode scanner
- Статистика та аналітика
- Експорт звітів
- Темна тема
- Accessibility improvements

---

## Метрики успіху

### Velocity
- Відстежування кількості виконаних story points за спринт
- Цільова velocity: стабілізація після 2-3 спринтів

### Quality metrics
- Code coverage: ≥ 80%
- Bug rate: ≤ 5 критичних багів на спринт
- Technical debt: ≤ 10% часу спринту

### Performance metrics
- API response time: ≤ 5 секунд
- AI processing: ≤ 15 секунд
- Page load time: ≤ 3 секунди

---

**Загальна тривалість:** 10-11 тижнів  
**Дата початку:** Жовтень 2025 
**Планова дата завершення:** Грудень 2025
