import { useMemo, useState } from "react";

type Language = "ru" | "kz";
type Tab =
  | "dashboard"
  | "courses"
  | "students"
  | "schedule"
  | "chat"
  | "settings";

type DatasetRow = {
  textbook: string;
  score: number;
};

const I18N = {
  ru: {
    dashboard: "Дашборд",
    courses: "Мои курсы",
    students: "Студенты и Успеваемость",
    schedule: "Расписание и Часы",
    chat: "AI Ассистент",
    settings: "Настройки",
    upgrade: "Обновить до Pro",

    welcomeTitle: "Привет, Мартин!",
    welcomeSub: "Как дела в учебе сегодня?",
    searchPlaceholder: "Поиск курсов, тем, отчетов...",

    totalSchools: "Школ в РК",
    pisaRank: "PISA-2025 Рейтинг",
    teachersCount: "Педагогов",
    avgScore: "Средний балл",

    weeklyActivity: "Активность успеваемости",
    weeklySub: "Динамика успеваемости за прошлую неделю",

    calendarMonth: "Июнь 2026",
    calendarTitle: "Календарь",
    pisaReportDate: "Дата отчета PISA:",
    pisaDateVal: "20 Июня",

    covFull: "100% охват",
    in91Countries: "из 91 страны",

    userRole: "Главный методист",

    viewProgress: "Посмотреть успеваемость →",
    planHours: "Планировать часы",

    pisaModuleTitle: "Модуль PISA-2025",
    pisaModuleSub: "Национальный мониторинг образования",

    coursesTitle: "Мониторинг УМК (8 класс)",
    coursesSub: "План обновления до 1 апреля 2027 года",

    studentsTitle: "Аналитика студентов и тем",
    studentsSub: "Сложные темы и отставание от целевого балла",

    scheduleTitle: "Симулятор оптимизации часов",
    scheduleSub: "Повышение эффективности через Ламбда (λ)",

    chatTitle: "AI Ассистент методиста",
    chatSub: "Анализ успеваемости, PISA-2025 и учебных материалов",

    settingsSub: "Настройки интерфейса и рабочего пространства",

    lblLambda: "Степень перераспределения (λ):",
    hourEffectLabel: "Эффект 1 часа:",
    projAvgGain: "Прогнозный средний прирост:",

    hoursPlanTitle: "План перераспределения часов",
    baseHoursLabel: "Текущие часы",
    recHoursLabel: "Рекомендуемые часы",

    kbPromptsTitle: "База знаний и запросы",
    kbPromptsSub: "Быстрые вопросы по PISA-2025 и УМК:",

    chatPlaceholder: "Введите ваш вопрос...",
    sendBtn: "Отправить",

    profile: "Профиль",
    interface: "Интерфейс",
    language: "Язык",
    role: "Роль",
    darkTheme: "Тёмная тема",
    darkThemeSub: "Изменить внешний вид платформы",
    notifications: "Уведомления",
    notificationsSub: "Получать уведомления об аналитике",
    compactMode: "Компактный режим",
    compactModeSub: "Уменьшить расстояния между элементами",

    subject: "Предмет",
    change: "Изменение",
    status: "Статус",
    optimal: "Оптимально",

    minRedistribution: "Минимальное перераспределение",
    maxRedistribution: "Максимальное",
    pointsPerHour: "балла за дополнительный час",
    predictedGrowth: "прогнозируемый рост среднего балла",

    activeDataset: "Dataset активен",
    online: "● Онлайн",

    studentAnalytics: "Статистика успеваемости",
    average: "Средний балл",
    riskStudents: "В зоне риска",
    improving: "Показывают рост",
    topicStatus: "Статус тем",
    topic: "Тема",
    mean: "Средний балл",
    risk: "Риск",
    gap: "Отставание",

    normal: "В норме",
    belowTarget: "Ниже цели",
    critical: "Критично",

    algebra: "Алгебра",
    geometry: "Геометрия",
    functions: "Функции и графики",
    statistics: "Статистика",
    probability: "Теория вероятностей",
    equations: "Уравнения",

    publishers: "Издательство",
    rating: "Рейтинг",
    progress: "Прогресс",

    noMessages: "Пока нет сообщений",
  },

  kz: {
    dashboard: "Басқару панелі",
    courses: "Курстарым",
    students: "Оқушылар & Үлгерім",
    schedule: "Кесте мен Сағаттар",
    chat: "AI Ассистент",
    settings: "Баптаулар",
    upgrade: "Pro Жаңарту",

    welcomeTitle: "Сәлем, Мартин!",
    welcomeSub: "Бүгінгі оқу аналитикасы қалай?",
    searchPlaceholder: "Курстарды, тақырыптарды іздеу...",

    totalSchools: "ҚР мектептері",
    pisaRank: "PISA-2025 Рейтингі",
    teachersCount: "Педагогтар",
    avgScore: "Орташа балл",

    weeklyActivity: "Үлгерім белсенділігі",
    weeklySub: "Өткен апта бойынша үлгерім динамикасы",

    calendarMonth: "Маусым 2026",
    calendarTitle: "Күнтізбе",
    pisaReportDate: "PISA Есебі:",
    pisaDateVal: "20 Маусым",

    covFull: "100% қамту",
    in91Countries: "91 елдің ішінде",

    userRole: "Бас әдіскер",

    viewProgress: "Үлгерімді қарау →",
    planHours: "Сағаттарды жоспарлау",

    pisaModuleTitle: "PISA-2025 Модулі",
    pisaModuleSub: "Ұлттық білім мониторингі",

    coursesTitle: "8-сынып ОӘК Мониторингі",
    coursesSub: "2027 жылдың 1 сәуіріне дейінгі жаңарту жоспары",

    studentsTitle: "Оқушылар & Тақырыптар аналитикасы",
    studentsSub: "Қиын тақырыптар мен мақсатты баллдан алшақтық",

    scheduleTitle: "Сағаттарды оңтайландыру симуляторы",
    scheduleSub: "Ламбда (λ) арқылы нәтижелілікті арттыру",

    chatTitle: "AI Әдіскер Көмекшісі",
    chatSub: "Үлгерім, PISA-2025 және оқу материалдарын талдау",

    settingsSub: "Интерфейс пен жұмыс кеңістігінің баптаулары",

    lblLambda: "Қайта бөлу дәрежесі (λ):",
    hourEffectLabel: "1 сағаттың эффектісі:",
    projAvgGain: "Болжамды орташа өсім:",

    hoursPlanTitle: "Сағаттарды қайта бөлу жоспары",
    baseHoursLabel: "Қазіргі сағат",
    recHoursLabel: "Ұсынылатын сағат",

    kbPromptsTitle: "Білім базасы & Сұраныстар",
    kbPromptsSub: "PISA-2025 және ОӘК бойынша жылдам сұрақтар:",

    chatPlaceholder: "Сұрағыңызды жазыңыз...",
    sendBtn: "Жіберу",

    profile: "Профиль",
    interface: "Интерфейс",
    language: "Тіл",
    role: "Рөл",
    darkTheme: "Қараңғы тақырып",
    darkThemeSub: "Платформаның сыртқы түрін өзгерту",
    notifications: "Хабарламалар",
    notificationsSub: "Аналитика туралы хабарламалар алу",
    compactMode: "Ықшам режим",
    compactModeSub: "Элементтер арасындағы қашықтықты азайту",

    subject: "Пән",
    change: "Өзгеріс",
    status: "Мәртебе",
    optimal: "Оңтайлы",

    minRedistribution: "Минималды қайта бөлу",
    maxRedistribution: "Максималды",
    pointsPerHour: "қосымша сағат үшін балл",
    predictedGrowth: "орташа баллдың болжамды өсімі",

    activeDataset: "Dataset белсенді",
    online: "● Онлайн",

    studentAnalytics: "Үлгерім статистикасы",
    average: "Орташа балл",
    riskStudents: "Қауіп тобында",
    improving: "Өсім көрсетуде",
    topicStatus: "Тақырыптар мәртебесі",
    topic: "Тақырып",
    mean: "Орташа балл",
    risk: "Қауіп",
    gap: "Алшақтық",

    normal: "Қалыпты",
    belowTarget: "Төмен",
    critical: "Қиын",

    algebra: "Алгебра",
    geometry: "Геометрия",
    functions: "Функциялар мен графиктер",
    statistics: "Статистика",
    probability: "Ықтималдық теориясы",
    equations: "Теңдеулер",

    publishers: "Баспа",
    rating: "Рейтинг",
    progress: "Үлгерім",

    noMessages: "Әзірге хабарламалар жоқ",
  },
};

const CHAT_PROMPTS = [
  {
    labelRu: "📊 Результаты PISA-2025",
    labelKz: "📊 PISA-2025 нәтижелері",
    query: "PISA-2025 результаты",
  },
  {
    labelRu: "📖 УМК 8 класс 2027",
    labelKz: "📖 8-сынып ОӘК 2027",
    query: "8 класс учебники 2027",
  },
  {
    labelRu: "👩‍🏫 Этика диалога с учителем",
    labelKz: "👩‍🏫 Мұғаліммен диалог этикасы",
    query: "этика диалога с учителем",
  },
];

export default function App() {
  const [lang, setLang] = useState<Language>("ru");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  const [targetScore] = useState(80);

  const [lambda, setLambda] = useState(0.6);
  const [chatInput, setChatInput] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const [dataset] = useState<DatasetRow[]>([
    {
      textbook: "A Атамұра",
      score: 72,
    },
    {
      textbook: "B Алматыкітап",
      score: 78,
    },
    {
      textbook: "C Арман-ПВ",
      score: 69,
    },
  ]);

  const [chatMessages, setChatMessages] = useState<
    {
      role: "user" | "ai";
      text: string;
    }[]
  >([
    {
      role: "ai",
      text:
        "Здравствуйте! Я AI-ассистент по образовательной аналитике. Задайте свой вопрос.",
    },
  ]);

  const t = I18N[lang];

  const weeklyActivityData = useMemo(
    () => [
      {
        name: lang === "kz" ? "Дүй" : "Пн",
        score: 64,
      },
      {
        name: lang === "kz" ? "Сей" : "Вт",
        score: 68,
      },
      {
        name: lang === "kz" ? "Сәр" : "Ср",
        score: 66,
      },
      {
        name: lang === "kz" ? "Бей" : "Чт",
        score: 75,
      },
      {
        name: lang === "kz" ? "Жұм" : "Пт",
        score: 72,
      },
      {
        name: lang === "kz" ? "Сен" : "Сб",
        score: 80,
      },
      {
        name: lang === "kz" ? "Жек" : "Вс",
        score: 77,
      },
    ],
    [lang]
  );

  const textbooksData = useMemo(() => {
    const map: Record<string, number[]> = {};

    dataset.forEach((row) => {
      if (!map[row.textbook]) {
        map[row.textbook] = [];
      }

      map[row.textbook].push(row.score);
    });

    const books = Object.keys(map).sort();

    const naive = books.map((book) => {
      const scores = map[book];

      let name = book.split(" ")[1] || book;

      if (lang === "ru") {
        name = name
          .replace("Атамұра", "Атамура")
          .replace("Алматыкітап", "Алматыкитап");
      }

      const mean =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return {
        book: name,
        mean: Math.round(mean * 10) / 10,
      };
    });

    const adjusted = [
      {
        book: lang === "kz" ? "A (Атамұра)" : "A (Атамура)",
        effect: 0,
      },
      {
        book:
          lang === "kz"
            ? "B (Алматыкітап)"
            : "B (Алматыкитап)",
        effect: 4.2,
      },
      {
        book: "C (Арман-ПВ)",
        effect: -3.1,
      },
    ];

    return {
      naive,
      adjusted,
    };
  }, [dataset, lang]);

  const coursesList = useMemo(
    () => [
      {
        title:
          lang === "kz"
            ? "Алгебра - 8 сынып"
            : "Алгебра - 8 класс",
        author:
          lang === "kz"
            ? "Атамұра баспасы"
            : "Издательство Атамура",
        rating: "4.8",
        progress: 87,
        bg: "from-emerald-500 to-teal-600",
        icon: "∑",
      },
      {
        title:
          lang === "kz"
            ? "Геометрия негіздері"
            : "Основы геометрии",
        author:
          lang === "kz"
            ? "Алматыкітап баспасы"
            : "Издательство Алматыкитап",
        rating: "4.9",
        progress: 74,
        bg: "from-blue-500 to-indigo-600",
        icon: "△",
      },
      {
        title:
          lang === "kz"
            ? "Математикалық сауаттылық"
            : "Математическая грамотность",
        author: "Арман-ПВ",
        rating: "4.6",
        progress: 68,
        bg: "from-purple-500 to-pink-600",
        icon: "%",
      },
      {
        title:
          lang === "kz"
            ? "Функциялар мен Графиктер"
            : "Функции и Графики",
        author:
          lang === "kz"
            ? "Мектеп баспасы"
            : "Издательство Мектеп",
        rating: "4.7",
        progress: 81,
        bg: "from-amber-500 to-orange-600",
        icon: "ƒ",
      },
      {
        title: "Тригонометрия",
        author:
          lang === "kz"
            ? "Атамұра баспасы"
            : "Издательство Атамура",
        rating: "4.8",
        progress: 59,
        bg: "from-rose-500 to-red-600",
        icon: "sin",
      },
      {
        title: "Статистика",
        author: "Арман-ПВ",
        rating: "4.5",
        progress: 72,
        bg: "from-cyan-500 to-blue-600",
        icon: "σ",
      },
    ],
    [lang]
  );

  const topicData = [
    {
      topic: t.algebra,
      mean: 78,
      risk: 12,
      gap: 2,
      status: t.normal,
    },
    {
      topic: t.geometry,
      mean: 73,
      risk: 19,
      gap: 7,
      status: t.belowTarget,
    },
    {
      topic: t.functions,
      mean: 67,
      risk: 28,
      gap: 13,
      status: t.belowTarget,
    },
    {
      topic: t.statistics,
      mean: 82,
      risk: 8,
      gap: 0,
      status: t.normal,
    },
    {
      topic: t.probability,
      mean: 61,
      risk: 34,
      gap: 19,
      status: t.critical,
    },
    {
      topic: t.equations,
      mean: 76,
      risk: 16,
      gap: 4,
      status: t.belowTarget,
    },
  ];

  const navigation: {
    id: Tab;
    label: string;
    icon: string;
  }[] = [
    {
      id: "dashboard",
      label: t.dashboard,
      icon: "📊",
    },
    {
      id: "courses",
      label: t.courses,
      icon: "📚",
    },
    {
      id: "students",
      label: t.students,
      icon: "👩‍🎓",
    },
    {
      id: "schedule",
      label: t.schedule,
      icon: "🗓️",
    },
    {
      id: "chat",
      label: t.chat,
      icon: "🤖",
    },
    {
      id: "settings",
      label: t.settings,
      icon: "⚙️",
    },
  ];

  const sendChatMessage = (text?: string) => {
    const question = (text ?? chatInput).trim();

    if (!question) {
      return;
    }

    setChatMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: question,
      },
      {
        role: "ai",
        text:
          lang === "kz"
            ? "Сұрағыңыз қабылданды. Қазіргі деректер жиынтығы негізінде негізгі көрсеткіштерді талдауға болады."
            : "Запрос принят. На основе текущего набора данных можно проанализировать основные показатели и динамику.",
      },
    ]);

    setChatInput("");
  };

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-slate-50 dark:bg-[#0d141b] text-slate-900 dark:text-white flex`}
    >
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 bg-white dark:bg-[#141b22] border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">
              Ұ
            </div>

            <div>
              <div className="font-extrabold text-sm">
                Ұстаз-Аналитика
              </div>

              <div className="text-[10px] text-slate-400">
                EDUCATION PLATFORM
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center space-y-2">
            <div className="w-9 h-9 mx-auto rounded-full bg-white dark:bg-slate-800 text-emerald-600 flex items-center justify-center shadow-sm text-base">
              🎓
            </div>

            <h4 className="font-bold text-xs text-slate-900 dark:text-white">
              {t.pisaModuleTitle}
            </h4>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.pisaModuleSub}
            </p>

            <button
              onClick={() => setActiveTab("schedule")}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm"
            >
              {t.upgrade}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#141b22]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-slate-400">🔍</span>

            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100 dark:bg-slate-800/60 border-none rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex text-xs font-bold border border-slate-200/60 dark:border-slate-700">
              <button
                onClick={() => setLang("ru")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  lang === "ru"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                RU
              </button>

              <button
                onClick={() => setLang("kz")}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  lang === "kz"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                ҚАЗ
              </button>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                M
              </div>

              <div className="hidden md:block text-left">
                <span className="text-xs font-bold block leading-tight">
                  Мартин Рай
                </span>

                <span className="text-[10px] text-slate-400 block">
                  {t.userRole}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main
          className={`max-w-7xl mx-auto px-6 ${
            compactMode ? "py-4" : "py-8"
          } space-y-8 flex-1 w-full`}
        >
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-7 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />
                  <div className="absolute right-20 bottom-[-80px] w-48 h-48 rounded-full bg-white/10" />

                  <div className="relative z-10 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                      Ұстаз-Аналитика РК
                    </span>

                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-2 text-white">
                      {t.welcomeTitle}
                    </h2>

                    <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
                      {t.welcomeSub}
                    </p>
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => setActiveTab("students")}
                      className="px-5 py-2.5 bg-white text-emerald-700 rounded-2xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition-all"
                    >
                      {t.viewProgress}
                    </button>

                    <button
                      onClick={() => setActiveTab("schedule")}
                      className="px-5 py-2.5 bg-emerald-700/50 hover:bg-emerald-700/70 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all"
                    >
                      {t.planHours}
                    </button>
                  </div>
                </div>

                {/* CALENDAR */}
                <div className="lg:col-span-4 bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      {t.calendarMonth}
                    </h3>

                    <span className="text-xs font-bold text-emerald-600">
                      {t.calendarTitle}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs py-3">
                    {(lang === "kz"
                      ? ["Д", "С", "С", "Б", "Ж", "С", "Ж"]
                      : ["П", "В", "С", "Ч", "П", "С", "В"]
                    ).map((day, index) => (
                      <span
                        key={index}
                        className="text-slate-400 text-[10px] font-bold"
                      >
                        {day}
                      </span>
                    ))}

                    {[...Array(28)].map((_, index) => {
                      const day = index + 1;
                      const isToday = day === 15;

                      return (
                        <div
                          key={index}
                          className={`py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            isToday
                              ? "bg-emerald-500 text-white font-bold shadow-sm"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {t.pisaReportDate}
                    </span>

                    <span className="font-bold text-emerald-600">
                      {t.pisaDateVal}
                    </span>
                  </div>
                </div>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    label: t.totalSchools,
                    val: "8,048",
                    sub: t.covFull,
                    icon: "🏫",
                  },
                  {
                    label: t.pisaRank,
                    val: lang === "kz" ? "53-орын" : "53 место",
                    sub: t.in91Countries,
                    icon: "📊",
                  },
                  {
                    label: t.teachersCount,
                    val: "415.5k",
                    sub: t.teachersCount,
                    icon: "👩‍🏫",
                  },
                  {
                    label: t.avgScore,
                    val: "68.4",
                    sub: `${t.avgScore}: ${targetScore}`,
                    icon: "🎯",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xl shrink-0 font-bold">
                      {stat.icon}
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">
                        {stat.label}
                      </span>

                      <span className="text-xl font-extrabold text-slate-900 dark:text-white block">
                        {stat.val}
                      </span>

                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {stat.sub}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIVITY */}
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">
                    {t.weeklyActivity}
                  </h3>

                  <span className="text-xs text-slate-400">
                    {t.weeklySub}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-3 items-end h-32">
                  {weeklyActivityData.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col items-center gap-2 h-full justify-end"
                    >
                      <div
                        className="w-full max-w-16 rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400"
                        style={{
                          height: `${item.score}%`,
                        }}
                        title={`${item.score}%`}
                      />

                      <span className="text-[10px] text-slate-400">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.coursesTitle}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t.coursesSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {coursesList.map((course) => (
                  <article
                    key={course.title}
                    className="bg-white dark:bg-[#141b22] rounded-3xl overflow-hidden border border-slate-200/70 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div
                      className={`h-32 bg-gradient-to-br ${course.bg} p-5 relative overflow-hidden`}
                    >
                      <div className="absolute -right-5 -bottom-10 text-8xl font-black text-white/10">
                        {course.icon}
                      </div>

                      <div className="relative z-10">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                          {t.courses}
                        </span>

                        <div className="text-4xl font-black text-white mt-2">
                          {course.icon}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-sm">
                        {course.title}
                      </h3>

                      <p className="text-xs text-slate-400 mt-2">
                        {course.author}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-amber-500 font-bold">
                          ★ {course.rating}
                        </span>

                        <span className="text-[10px] font-bold text-emerald-600">
                          {course.progress}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${course.bg}`}
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        className="w-full mt-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-all"
                      >
                        {lang === "kz"
                          ? "Курсты ашу"
                          : "Открыть курс"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.studentsTitle}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t.studentsSub}
                </p>
              </div>

              {/* STUDENT STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.average}
                  </span>

                  <div className="text-3xl font-black mt-2">
                    72.8
                  </div>

                  <span className="text-[10px] text-emerald-600">
                    +4.2% за месяц
                  </span>
                </div>

                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.riskStudents}
                  </span>

                  <div className="text-3xl font-black mt-2 text-rose-500">
                    18%
                  </div>

                  <span className="text-[10px] text-slate-400">
                    24 ученика
                  </span>
                </div>

                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.improving}
                  </span>

                  <div className="text-3xl font-black mt-2 text-emerald-600">
                    64%
                  </div>

                  <span className="text-[10px] text-emerald-600">
                    положительная динамика
                  </span>
                </div>
              </div>

              {/* TOPICS */}
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-sm">
                      {t.topicStatus}
                    </h3>

                    <p className="text-[10px] text-slate-400 mt-1">
                      Анализ по ключевым темам
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-600">
                    Target: {targetScore}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                        <th className="py-3 pr-4">
                          {t.topic}
                        </th>

                        <th className="py-3 pr-4">
                          {t.mean}
                        </th>

                        <th className="py-3 pr-4">
                          {t.risk}
                        </th>

                        <th className="py-3 pr-4">
                          {t.gap}
                        </th>

                        <th className="py-3">
                          {t.status}
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {topicData.map((row) => (
                        <tr
                          key={row.topic}
                          className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <td className="py-4 pr-4 font-bold">
                            {row.topic}
                          </td>

                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold">
                                {row.mean}
                              </span>

                              <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    row.mean >= targetScore
                                      ? "bg-emerald-500"
                                      : row.mean >= 70
                                      ? "bg-amber-500"
                                      : "bg-rose-500"
                                  }`}
                                  style={{
                                    width: `${row.mean}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={
                                row.risk >= 30
                                  ? "text-rose-500 font-bold"
                                  : row.risk >= 20
                                  ? "text-amber-500 font-bold"
                                  : "text-emerald-600 font-bold"
                              }
                            >
                              {row.risk}%
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-slate-500">
                            {row.gap === 0
                              ? "—"
                              : `-${row.gap}`}
                          </td>

                          <td className="py-4">
                            <span
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                row.status === t.normal
                                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
                                  : row.status === t.belowTarget
                                  ? "bg-amber-50 dark:bg-amber-950 text-amber-600"
                                  : "bg-rose-50 dark:bg-rose-950 text-rose-600"
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* TEXTBOOK ANALYSIS */}
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm mb-5">
                  Эффективность учебников
                </h3>

                <div className="space-y-4">
                  {textbooksData.naive.map((book) => (
                    <div key={book.book}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">
                          {book.book}
                        </span>

                        <span className="text-xs font-bold text-emerald-600">
                          {book.mean}
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{
                            width: `${book.mean}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-5">
                  <h4 className="text-xs font-bold text-slate-400 mb-3">
                    OLS adjusted effect
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {textbooksData.adjusted.map((book) => (
                      <div
                        key={book.book}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60"
                      >
                        <span className="text-xs font-bold">
                          {book.book}
                        </span>

                        <div
                          className={`text-xl font-black mt-2 ${
                            book.effect >= 0
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }`}
                        >
                          {book.effect > 0 ? "+" : ""}
                          {book.effect}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SCHEDULE */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.scheduleTitle}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t.scheduleSub}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.hourEffectLabel}
                  </span>

                  <div className="text-2xl font-extrabold mt-2 text-emerald-600">
                    +{(0.42 + lambda * 0.3).toFixed(2)}
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.pointsPerHour}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.projAvgGain}
                  </span>

                  <div className="text-2xl font-extrabold mt-2 text-blue-600">
                    +{(3.2 + lambda * 2.1).toFixed(1)}
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1">
                    {t.predictedGrowth}
                  </p>
                </div>

                <div className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <span className="text-xs text-slate-400">
                    {t.activeDataset}
                  </span>

                  <div className="text-2xl font-extrabold mt-2">
                    {dataset.length}
                  </div>

                  <p className="text-[10px] text-emerald-600 mt-1">
                    ● Dataset active
                  </p>
                </div>
              </div>

              {/* LAMBDA */}
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-sm">
                      {t.lblLambda}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Настройте степень перераспределения учебных часов
                    </p>
                  </div>

                  <div className="w-14 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-extrabold">
                    {lambda.toFixed(1)}
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={lambda}
                  onChange={(event) =>
                    setLambda(Number(event.target.value))
                  }
                  className="w-full accent-emerald-600"
                />

                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                  <span>{t.minRedistribution}</span>
                  <span>{t.maxRedistribution}</span>
                </div>
              </section>

              {/* HOURS TABLE */}
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">
                    {t.hoursPlanTitle}
                  </h3>

                  <span className="text-xs text-emerald-600 font-bold">
                    λ = {lambda.toFixed(1)}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                        <th className="py-3">{t.subject}</th>
                        <th className="py-3">
                          {t.baseHoursLabel}
                        </th>
                        <th className="py-3">
                          {t.recHoursLabel}
                        </th>
                        <th className="py-3">{t.change}</th>
                        <th className="py-3">{t.status}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[
                        ["Алгебра", 68, Math.round(68 + lambda * 6)],
                        ["Геометрия", 54, Math.round(54 + lambda * 3)],
                        [
                          "Математическая грамотность",
                          34,
                          Math.round(34 + lambda * 5),
                        ],
                        [
                          "Статистика",
                          20,
                          Math.round(20 + lambda * 2),
                        ],
                      ].map(([subject, base, recommended]) => {
                        const change =
                          Number(recommended) - Number(base);

                        return (
                          <tr
                            key={String(subject)}
                            className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                          >
                            <td className="py-4 font-bold">
                              {subject}
                            </td>

                            <td className="py-4 text-slate-500">
                              {base}
                            </td>

                            <td className="py-4 font-bold text-emerald-600">
                              {recommended}
                            </td>

                            <td className="py-4">
                              <span className="text-emerald-600 font-bold">
                                +{change}
                              </span>
                            </td>

                            <td className="py-4">
                              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                                {t.optimal}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* CHAT */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.chatTitle}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t.chatSub}
                </p>
              </div>

              <section className="bg-white dark:bg-[#141b22] rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-lg">
                    🤖
                  </div>

                  <div>
                    <div className="font-bold text-sm">
                      AI Методист
                    </div>

                    <div className="text-[10px] text-emerald-600">
                      {t.online}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4 min-h-[280px] max-h-[400px] overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                          message.role === "user"
                            ? "bg-emerald-600 text-white rounded-br-md"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 pb-4">
                  <p className="text-[10px] font-bold text-slate-400 mb-2">
                    {t.kbPromptsTitle}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {CHAT_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.query}
                        type="button"
                        onClick={() =>
                          sendChatMessage(prompt.query)
                        }
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-all"
                      >
                        {lang === "kz"
                          ? prompt.labelKz
                          : prompt.labelRu}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(event) =>
                        setChatInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          sendChatMessage();
                        }
                      }}
                      placeholder={t.chatPlaceholder}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />

                    <button
                      type="button"
                      onClick={() => sendChatMessage()}
                      className="px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                    >
                      {t.sendBtn}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.settings}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {t.settingsSub}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* PROFILE */}
                <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <h3 className="font-bold text-sm mb-5">
                    {t.profile}
                  </h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl font-black">
                      M
                    </div>

                    <div>
                      <div className="font-bold">
                        Мартин Рай
                      </div>

                      <div className="text-xs text-slate-400">
                        {t.userRole}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">
                        {t.language}
                      </div>

                      <div className="font-bold text-sm mt-1">
                        {lang === "ru"
                          ? "Русский"
                          : "Қазақша"}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">
                        {t.role}
                      </div>

                      <div className="font-bold text-sm mt-1">
                        {t.userRole}
                      </div>
                    </div>
                  </div>
                </section>

                {/* INTERFACE */}
                <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                  <h3 className="font-bold text-sm mb-5">
                    {t.interface}
                  </h3>

                  <div className="space-y-4">
                    {/* DARK */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <div>
                        <div className="text-xs font-bold">
                          {t.darkTheme}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {t.darkThemeSub}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-7 rounded-full transition-all ${
                          darkMode
                            ? "bg-emerald-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                            darkMode ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <div>
                        <div className="text-xs font-bold">
                          {t.notifications}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {t.notificationsSub}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setNotifications(!notifications)
                        }
                        className={`w-12 h-7 rounded-full transition-all ${
                          notifications
                            ? "bg-emerald-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                            notifications
                              ? "translate-x-5"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* COMPACT */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                      <div>
                        <div className="text-xs font-bold">
                          {t.compactMode}
                        </div>

                        <div className="text-[10px] text-slate-400">
                          {t.compactModeSub}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCompactMode(!compactMode)
                        }
                        className={`w-12 h-7 rounded-full transition-all ${
                          compactMode
                            ? "bg-emerald-600"
                            : "bg-slate-300 dark:bg-slate-700"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform mx-1 ${
                            compactMode
                              ? "translate-x-5"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}