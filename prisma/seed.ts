import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Очищення бази даних...');
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Створення або оновлення адміна
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Test Admin',
    },
  });

  const levels = ['Новичок', 'Пользователь', 'Профессионал', 'Читер'];
  const types = ['Курс', 'Профессия'];

  // Дані твоїх курсів з усіма необхідними полями
  const coursesRaw = [
    // 8-14 років (Діти)
    {
      title: 'Minecraft: Програмування на Python',
      desc: 'Вчимося будувати замки та автоматизувати світ кодом.',
      price: 45,
      min: 8,
      max: 14,
    },
    {
      title: 'Roblox Game Dev',
      desc: 'Створи свою першу гру та запроси друзів пограти.',
      price: 50,
      min: 8,
      max: 14,
    },
    {
      title: 'Юний YouTube Блогер',
      desc: 'Зйомка, світло та монтаж відео на телефоні.',
      price: 35,
      min: 8,
      max: 14,
    },
    {
      title: 'Цифровий Арт у Procreate',
      desc: 'Малювання персонажів аніме та коміксів на планшеті.',
      price: 40,
      min: 8,
      max: 14,
    },
    {
      title: 'Майстерня Штучного Інтелекту',
      desc: 'Малювання в Midjourney та казки з ChatGPT.',
      price: 30,
      min: 8,
      max: 14,
    },
    {
      title: 'Розробка мобільних додатків',
      desc: 'Створення корисних програм для смартфона.',
      price: 55,
      min: 8,
      max: 14,
    },
    {
      title: 'Основи Кібербезпеки',
      desc: 'Захист акаунтів та безпечний інтернет.',
      price: 25,
      min: 8,
      max: 14,
    },
    {
      title: 'Космічна 3D-моделювання',
      desc: 'Моделі ракет та планет для 3D-друку.',
      price: 45,
      min: 8,
      max: 14,
    },
    {
      title: 'Етичний Хакінг (Рівень 1)',
      desc: 'Як працюють мережі та пошук помилок у програмах.',
      price: 60,
      min: 8,
      max: 14,
    },
    {
      title: 'Створення власного веб-сайту',
      desc: 'Стильні сторінки на HTML та CSS.',
      price: 40,
      min: 8,
      max: 14,
    },

    // 14-18 років (Підлітки)
    {
      title: 'Створення чат-ботів для Telegram',
      desc: 'Бот, який відповідає на питання або шукає фільми.',
      price: 40,
      min: 14,
      max: 18,
    },
    {
      title: 'Монтаж відео для TikTok та Reels',
      desc: 'Трендові переходи та ефекти як у профі.',
      price: 35,
      min: 14,
      max: 18,
    },
    {
      title: 'Запуск свого інтернет-магазину',
      desc: 'Сайт для продажу мерчу або своїх товарів.',
      price: 50,
      min: 14,
      max: 18,
    },
    {
      title: '3D-моделювання персонажів ігор',
      desc: 'Ліпимо героїв у стилі Fortnite у Blender.',
      price: 45,
      min: 14,
      max: 18,
    },
    {
      title: 'Магія Photoshop: від мемів до арту',
      desc: 'Обробка фото та круті колажі.',
      price: 30,
      min: 14,
      max: 18,
    },
    {
      title: 'Основи програмування на Python',
      desc: 'Код, який вирішує домашку з математики.',
      price: 45,
      min: 14,
      max: 18,
    },
    {
      title: 'Дизайн одягу та принтів',
      desc: 'Дизайн для футболок чи худі.',
      price: 40,
      min: 14,
      max: 18,
    },
    {
      title: 'Стрімінг на Twitch: від нуля до Pro',
      desc: 'Налаштування OBS та залучення глядачів.',
      price: 25,
      min: 14,
      max: 18,
    },
    {
      title: 'Побудова комп’ютера своєї мрії',
      desc: 'Збірка ПК: від деталей до запуску.',
      price: 30,
      min: 14,
      max: 18,
    },
    {
      title: 'Цифровий маркетинг для соцмереж',
      desc: 'Розкрутка бренду без великих бюджетів.',
      price: 40,
      min: 14,
      max: 18,
    },

    // 18+ років (Дорослі)
    {
      title: 'Створення сайтів на No-Code',
      desc: 'Збірка сайтів на Tilda/Webflow без коду.',
      price: 60,
      min: 18,
      max: 99,
    },
    {
      title: 'SMM: Просування в Instagram',
      desc: 'Бізнес-профілі, реклама та клієнти.',
      price: 50,
      min: 18,
      max: 99,
    },
    {
      title: 'Копірайтинг та Нейромережі',
      desc: 'Тексти для блогів за допомогою ChatGPT.',
      price: 45,
      min: 18,
      max: 99,
    },
    {
      title: 'Візуальний дизайн у Canva/Figma',
      desc: 'Презентації, лого та банери швидко і стильно.',
      price: 40,
      min: 18,
      max: 99,
    },
    {
      title: 'IT-рекрутинг: як шукати програмістів',
      desc: 'Посередництво між IT-компаніями та фахівцями.',
      price: 70,
      min: 18,
      max: 99,
    },
    {
      title: 'Вступ до криптосвіту',
      desc: 'Біткоїн, гаманці та безпека в крипто.',
      price: 35,
      min: 18,
      max: 99,
    },
    {
      title: 'Excel та Google Таблиці для бізнесу',
      desc: 'Автоматизація підрахунків та графіки.',
      price: 30,
      min: 18,
      max: 99,
    },
    {
      title: 'Основи фотографії на смартфон',
      desc: 'Професійні кадри для особистого бренду.',
      price: 40,
      min: 18,
      max: 99,
    },
    {
      title: 'Психологія спілкування з клієнтами',
      desc: 'Мистецтво переговорів про вищу ціну.',
      price: 45,
      min: 18,
      max: 99,
    },
    {
      title: 'Таргетована реклама (Facebook/Ads)',
      desc: 'Запуск реклами, що приносить продажі.',
      price: 65,
      min: 18,
      max: 99,
    },
  ];

  // Перетворюємо в формат, який розуміє Prisma
  const coursesArray = coursesRaw.map(c => ({
    title: c.title,
    description: c.desc,
    content: `<h3>Програма курсу: ${c.title}</h3><p>Детальний план навчання для вікової категорії ${c.min}-${c.max} років.</p><ul><li>Основи</li><li>Практика</li><li>Проект</li></ul>`,
    price: c.price,
    minAge: c.min,
    maxAge: c.max,
    level: levels[Math.floor(Math.random() * levels.length)],
    type: types[Math.floor(Math.random() * types.length)],
    duration: Math.floor(Math.random() * 12) + 1,
  }));

  console.log('Додавання курсів у базу...');
  await prisma.course.createMany({
    data: coursesArray,
  });

  console.log('✅ Базу успішно наповнено! 30 курсів готові.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
