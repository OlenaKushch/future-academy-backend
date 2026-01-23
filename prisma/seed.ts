import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.course.deleteMany();
  console.log('Попередні курси видалено.');

  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Test Admin',
    },
  });

  const allCourses = [
    // 8-14 років
    {
      title: 'Minecraft: Програмування на Python',
      description: 'Вчимося будувати замки та автоматизувати світ кодом.',
      price: 45,
    },
    {
      title: 'Roblox Game Dev',
      description: 'Створи свою першу гру та запроси друзів пограти.',
      price: 50,
    },
    {
      title: 'Юний YouTube Блогер',
      description: 'Зйомка, світло та монтаж відео на телефоні.',
      price: 35,
    },
    {
      title: 'Цифровий Арт у Procreate',
      description: 'Малювання персонажів аніме та коміксів на планшеті.',
      price: 40,
    },
    {
      title: 'Майстерня Штучного Інтелекту',
      description: 'Малювання в Midjourney та казки з ChatGPT.',
      price: 30,
    },
    {
      title: 'Розробка мобільних додатків',
      description: 'Створення корисних програм для смартфона.',
      price: 55,
    },
    {
      title: 'Основи Кібербезпеки',
      description: 'Захист акаунтів та безпечний інтернет.',
      price: 25,
    },
    {
      title: 'Космічна 3D-моделювання',
      description: 'Моделі ракет та планет для 3D-друку.',
      price: 45,
    },
    {
      title: 'Етичний Хакінг (Рівень 1)',
      description: 'Як працюють мережі та пошук помилок у програмах.',
      price: 60,
    },
    {
      title: 'Створення власного веб-сайту',
      description: 'Стильні сторінки на HTML та CSS.',
      price: 40,
    },

    // 14-18 років
    {
      title: 'Створення чат-ботів для Telegram',
      description: 'Бот, який відповідає на питання або шукає фільми.',
      price: 40,
    },
    {
      title: 'Монтаж відео для TikTok та Reels',
      description: 'Трендові переходи та ефекти як у профі.',
      price: 35,
    },
    {
      title: 'Запуск свого інтернет-магазину',
      description: 'Сайт для продажу мерчу або своїх товарів.',
      price: 50,
    },
    {
      title: '3D-моделювання персонажів ігор',
      description: 'Ліпимо героїв у стилі Fortnite у Blender.',
      price: 45,
    },
    {
      title: 'Магія Photoshop: від мемів до арту',
      description: 'Обробка фото та круті колажі.',
      price: 30,
    },
    {
      title: 'Основи програмування на Python',
      description: 'Код, який вирішує домашку з математики.',
      price: 45,
    },
    {
      title: 'Дизайн одягу та принтів',
      description: 'Дизайн для футболок чи худі.',
      price: 40,
    },
    {
      title: 'Стрімінг на Twitch: від нуля до Pro',
      description: 'Налаштування OBS та залучення глядачів.',
      price: 25,
    },
    {
      title: 'Побудова комп’ютера своєї мрії',
      description: 'Збірка ПК: від деталей до запуску.',
      price: 30,
    },
    {
      title: 'Цифровий маркетинг для соцмереж',
      description: 'Розкрутка бренду без великих бюджетів.',
      price: 40,
    },

    // 18+ років
    {
      title: 'Створення сайтів на No-Code',
      description: 'Збірка сайтів на Tilda/Webflow без коду.',
      price: 60,
    },
    {
      title: 'SMM: Просування в Instagram',
      description: 'Бізнес-профілі, реклама та клієнти.',
      price: 50,
    },
    {
      title: 'Копірайтинг та Нейромережі',
      description: 'Тексти для блогів за допомогою ChatGPT.',
      price: 45,
    },
    {
      title: 'Візуальний дизайн у Canva/Figma',
      description: 'Презентації, лого та банери швидко і стильно.',
      price: 40,
    },
    {
      title: 'IT-рекрутинг: як шукати програмістів',
      description: 'Посередництво між IT-компаніями та фахівцями.',
      price: 70,
    },
    {
      title: 'Вступ до криптосвіту',
      description: 'Біткоїн, гаманці та безпека в крипто.',
      price: 35,
    },
    {
      title: 'Excel та Google Таблиці для бізнесу',
      description: 'Автоматизація підрахунків та графіки.',
      price: 30,
    },
    {
      title: 'Основи фотографії на смартфон',
      description: 'Професійні кадри для особистого бренду.',
      price: 40,
    },
    {
      title: 'Психологія спілкування з клієнтами',
      description: 'Мистецтво переговорів про вищу ціну.',
      price: 45,
    },
    {
      title: 'Таргетована реклама (Facebook/Ads)',
      description: 'Запуск реклами, що приносить продажі.',
      price: 65,
    },
  ];

  console.log('Починаємо заповнення бази даних...');

  await prisma.course.createMany({
    data: allCourses,
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
