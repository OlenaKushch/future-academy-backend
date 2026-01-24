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
      avatar: 'https://ui-avatars.com/api/?name=Test+Admin&background=0D8ABC&color=fff',
    },
  });

  const levels = ['Новачок', 'Користувач', 'Профі', 'Читер'];
  const types = ['Курс', 'Професія'];

  // Дані курсів з усіма необхідними полями
  const coursesRaw = [
    // 8-14 років (Діти)
    {
      title: 'Minecraft: Програмування на Python',
      description: 'Вчимося будувати замки та автоматизувати світ кодом.',
      price: 45,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    },
    {
      title: 'Roblox Game Dev',
      description: 'Створи свою першу гру та запроси друзів пограти.',
      price: 50,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1605897482354-884591b93818?w=800&q=80',
    },
    {
      title: 'Юний YouTube Блогер',
      description: 'Зйомка, світло та монтаж відео на телефоні.',
      price: 35,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    },
    {
      title: 'Цифровий Арт у Procreate',
      description: 'Малювання персонажів аніме та коміксів на планшеті.',
      price: 40,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1561998338-13ad7883b10f?w=800&q=80',
    },
    {
      title: 'Майстерня Штучного Інтелекту',
      description: 'Малювання в Midjourney та казки з ChatGPT.',
      price: 30,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    },
    {
      title: 'Розробка мобільних додатків',
      description: 'Створення корисних програм для смартфона.',
      price: 55,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    },
    {
      title: 'Основи Кібербезпеки',
      description: 'Захист акаунтів та безпечний інтернет.',
      price: 25,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    },
    {
      title: 'Космічна 3D-моделювання',
      description: 'Моделі ракет та планет для 3D-друку.',
      price: 45,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    },
    {
      title: 'Етичний Хакінг (Рівень 1)',
      description: 'Як працюють мережі та пошук помилок у програмах.',
      price: 60,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    },
    {
      title: 'Створення власного веб-сайту',
      description: 'Стильні сторінки на HTML та CSS.',
      price: 40,
      min: 8,
      max: 14,
      image:
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
    },

    // 14-18 років (Підлітки)
    {
      title: 'Створення чат-ботів для Telegram',
      description: 'Бот, який відповідає на питання або шукає фільми.',
      price: 40,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1527430253228-e92688e15891?w=800&q=80',
    },
    {
      title: 'Монтаж відео для TikTok та Reels',
      description: 'Трендові переходи та ефекти як у профі.',
      price: 35,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1536243298747-ea8874136d64?w=800&q=80',
    },
    {
      title: 'Запуск свого інтернет-магазину',
      description: 'Сайт для продажу мерчу або своїх товарів.',
      price: 50,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80',
    },
    {
      title: '3D-моделювання персонажів ігор',
      description: 'Ліпимо героїв у стилі Fortnite у Blender.',
      price: 45,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1615110571065-b1e8a3902991?w=800&q=80',
    },
    {
      title: 'Магія Photoshop: від мемів до арту',
      description: 'Обробка фото та круті колажі.',
      price: 30,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1572044162444-ad60f128bde7?w=800&q=80',
    },
    {
      title: 'Основи програмування на Python',
      description: 'Код, який вирішує домашку з математики.',
      price: 45,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    },
    {
      title: 'Дизайн одягу та принтів',
      description: 'Дизайн для футболок чи худі.',
      price: 40,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    },
    {
      title: 'Стрімінг на Twitch: від нуля до Pro',
      description: 'Налаштування OBS та залучення глядачів.',
      price: 25,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    },
    {
      title: 'Побудова комп’ютера своєї мрії',
      description: 'Збірка ПК: від деталей до запуску.',
      price: 30,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    },
    {
      title: 'Цифровий маркетинг для соцмереж',
      description: 'Розкрутка бренду без великих бюджетів.',
      price: 40,
      min: 14,
      max: 18,
      image:
        'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    },

    // 18-99 років (Дорослі)
    {
      title: 'Створення сайтів на No-Code',
      description: 'Збірка сайтів на Tilda/Webflow без коду.',
      price: 60,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1581291518655-951832b0f4c8?w=800&q=80',
    },
    {
      title: 'SMM: Просування в Instagram',
      description: 'Бізнес-профілі, реклама та клієнти.',
      price: 50,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    },
    {
      title: 'Копірайтинг та Нейромережі',
      description: 'Тексти для блогів за допомогою ChatGPT.',
      price: 45,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    },
    {
      title: 'Візуальний дизайн у Canva/Figma',
      description: 'Презентації, лого та банери швидко і стильно.',
      price: 40,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=800&q=80',
    },
    {
      title: 'IT-рекрутинг: як шукати програмістів',
      description: 'Посередництво між IT-компаніями та фахівцями.',
      price: 70,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    },
    {
      title: 'Вступ до криптосвіту',
      description: 'Біткоїн, гаманці та безпека в крипто.',
      price: 35,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80',
    },
    {
      title: 'Excel та Google Таблиці для бізнесу',
      description: 'Автоматизація підрахунків та графіки.',
      price: 30,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
    },
    {
      title: 'Основи фотографії на смартфон',
      description: 'Професійні кадри для особистого бренду.',
      price: 40,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    },
    {
      title: 'Психологія спілкування з клієнтами',
      description: 'Мистецтво переговорів про вищу ціну.',
      price: 45,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80',
    },
    {
      title: 'Таргетована реклама (Facebook/Ads)',
      description: 'Запуск реклами, що приносить продажі.',
      price: 65,
      min: 18,
      max: 99,
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
  ];

  const coursesArray = coursesRaw.map(c => ({
    title: c.title,
    description: c.description,
    image: c.image,
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
