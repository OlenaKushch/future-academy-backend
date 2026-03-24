# 🎓 Future Academy Backend

Бекенд-частина платформи для онлайн-академії. Реалізована на NestJS з використанням Prisma ORM та SQLite.

## 🚀 Функціонал

* **Auth**: Реєстрація та логін за допомогою JWT (паспортна стратегія).
* **Courses**: Отримання списку всіх курсів, детальна інформація про курс.
* **Enrollment**: Система запису користувачів на курси (Many-to-Many).
* **Profile**: Отримання особистого профілю та списку обраних курсів.

## 🛠 Технологічний стек

* **Framework**: [NestJS]
* **Database**: [SQLite]
* **ORM**: [Prisma]
* **Language**: TypeScript
* **Security**: Passport.js, JWT, Bcrypt

## 📦 Встановлення та запуск

1. **Клонуйте репозиторій:**
```bash
git clone https://github.com/your-username/future-academy-backend.git
cd future-academy-backend

```


2. **Встановіть залежності:**
```bash
npm install

```


3. **Налаштуйте середовище:**
Створіть файл `.env` у корені проєкту та додайте посилання на вашу базу даних:
```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_very_secret_key"

```


4. **Налаштування бази даних (Prisma):**
```bash
npx prisma migrate dev --name init
npx prisma generate

```


5. **Наповнення бази тестовими даними (Seed):**
```bash
npx prisma migrate reset

```


*(Ця команда очистить базу та запустить скрипт `prisma/seed.ts`, який додасть 30 курсів та тестового адміна).*
6. **Запуск сервера:**
```bash
npm run start:dev

```

## 📡 Основні API Ендпоінти

| Метод | Шлях | Опис | Доступ |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Отримання JWT токена | Public |
| `GET` | `/api/v1/courses` | Список усіх курсів | Public |
| `GET` | `/api/v1/courses/:id` | Деталі курсу | Public |
| `POST` | `/api/v1/leads` | Створення заявки на курс | Public |
| `GET` | `/api/v1/admin/leads` | Список заявок | Admin |
| `GET` | `/api/v1/admin/leads/:id` | Деталі заявки | Admin |
| `PATCH` | `/api/v1/admin/leads/:id` | Оновлення статусу/нотаток заявки | Admin |
| `DELETE` | `/api/v1/admin/leads/:id` | Видалення заявки | Admin |
| `GET` | `/api/v1/users` | Список користувачів | Private |
| `POST` | `/api/v1/users` | Створення користувача | Private |
| `GET` | `/api/v1/users/profile` | Профіль поточного користувача | Private |

---


