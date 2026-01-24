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
| `POST` | `/auth/register` | Реєстрація нового юзера | Public |
| `POST` | `/auth/login` | Отримання JWT токена | Public |
| `GET` | `/courses` | Список усіх курсів | Public |
| `GET` | `/courses/:id` | Деталі курсу + статус запису | Private |
| `POST` | `/courses/:id/enroll` | Записатися на курс | Private |
| `GET` | `/users/profile/courses` | Курси, на які підписаний юзер | Private |

---


