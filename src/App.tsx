import { useMemo, useState } from "react";

type Language = "ru" | "kz";
type Tab = "dashboard" | "courses" | "students" | "schedule" | "chat" | "settings";
type DatasetRow = { textbook: string; score: number };

// --- LOCALIZATION DICTIONARY ---
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
    btnUpload: "Загрузить CSV",
    btnReset: "Демо данные",
    btnExportCsv: "Экспорт CSV",
    btnPrintReport: "Печать отчета (PDF)",
    lblTargetScore: "Целевой балл:",
    lblLambda: "Степень перераспределения (λ):",
    lblActiveDataset: "Записи в базе данных:",
    totalSchools: "Школ в РК",
    pisaRank: "PISA-2025 Рейтинг",
    teachersCount: "Педагогов",
    avgScore: "Средний балл",
    weeklyActivity: "Активность успеваемости",
    topCourses: "Популярные курсы",
    upcomingTasks: "Предстоящие задачи",
    statusGreen: "🟢 В норме",
    statusYellow: "🟡 Ниже цели",
    statusRed: "🔴 Критично",
    pisaModuleTitle: "Модуль PISA-2025",
    pisaModuleSub: "Национальный мониторинг образования",
    userRole: "Главный методист",
    viewProgress: "Посмотреть успеваемость →",
    planHours: "Планировать часы",
    calendarMonth: "Июнь 2026",
    calendarTitle: "Календарь",
    pisaReportDate: "Дата отчета PISA:",
    pisaDateVal: "20 Июня",
    covFull: "100% охват",
    in91Countries: "из 91 страны",
    weeklySub: "Динамика успеваемости за прошлую неделю",
    viewAll: "Посмотреть все →",
    coursesTitle: "Мониторинг УМК (8 класс)",
    coursesSub: "План обновления до 1 апреля 2027 года",
    grade8: "8 класс",
    activeStatus: "🟢 Активен",
    viewAnalytics: "Смотреть аналитику",
    olsTitle: "Чистая эффективность учебников (OLS модель)",
    rawMeanScore: "Сырой средний балл",
    adjCleanEffect: "Текстовый чистый эффект",
    studentsTitle: "Аналитика студентов и тем",
    studentsSub: "Сложные темы и отставание от целевого балла",
    topicsTableTitle: "Статус тем",
    thTopic: "Тема",
    thMean: "Средний балл",
    thFail: "Доля риска (<50 б), %",
    thGap: "Отставание",
    thStatus: "Статус",
    scheduleTitle: "Симулятор оптимизации часов",
    scheduleSub: "Повышение эффективности через Ламбда (λ)",
    hourEffectLabel: "Эффект 1 часа:",
    projAvgGain: "Прогнозный средний прирост:",
    hoursPlanTitle: "План перераспределения часов",
    baseHoursLabel: "Текущие часы",
    recHoursLabel: "Рекомендуемые часы",
    kbPromptsTitle: "База знаний и запросы",
    kbPromptsSub: "Быстрые вопросы по PISA-2025 и УМК:",
    aiAssistantTitle: "AI Ассистент методиста",
    chatPlaceholder: "Введите ваш вопрос...",
    sendBtn: "Отправить"
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
    btnUpload: "CSV жүктеу",
    btnReset: "Демо деректер",
    btnExportCsv: "CSV Экспорт",
    btnPrintReport: "Есепті басып шығару (PDF)",
    lblTargetScore: "Мақсатты балл:",
    lblLambda: "Қайта бөлу дәрежесі (λ):",
    lblActiveDataset: "Деректер базасындағы жазбалар:",
    totalSchools: "ҚР мектептері",
    pisaRank: "PISA-2025 Рейтингі",
    teachersCount: "Педагогтар",
    avgScore: "Орташа балл",
    weeklyActivity: "Үлгерім белсенділігі",
    topCourses: "Танымал курстар",
    upcomingTasks: "Алдағы тапсырмалар",
    statusGreen: "🟢 Қалыпты",
    statusYellow: "🟡 Төмен",
    statusRed: "🔴 Қиын",
    pisaModuleTitle: "PISA-2025 Модулі",
    pisaModuleSub: "Ұлттық білім мониторингі",
    userRole: "Бас әдіскер",
    viewProgress: "Үлгерімді қарау →",
    planHours: "Сағаттарды жоспарлау",
    calendarMonth: "Маусым 2026",
    calendarTitle: "Күнтізбе",
    pisaReportDate: "PISA Есебі:",
    pisaDateVal: "20 Маусым",
    covFull: "100% қамту",
    in91Countries: "91 елдің ішінде",
    weeklySub: "Өткен апта бойынша үлгерім динамикасы",
    viewAll: "Барлығын көру →",
    coursesTitle: "8-сынып ОӘК Мониторингі",
    coursesSub: "2027 жылдың 1 сәуіріне дейінгі жаңарту жоспары",
    grade8: "8-сынып",
    activeStatus: "🟢 Белсенді",
    viewAnalytics: "Аналитиканы көру",
    olsTitle: "Оқулықтардың таза тиімділігі (OLS модель)",
    rawMeanScore: "Шикі орташа балл",
    adjCleanEffect: "Түзетілген таза эффект",
    studentsTitle: "Студенттер & Тақырыптар аналитикасы",
    studentsSub: "Қиын тақырыптар мен мақсатты баллдан алшақтық",
    topicsTableTitle: "Тақырыптар мәртебесі",
    thTopic: "Тақырып",
    thMean: "Орташа балл",
    thFail: "Қауіп үлесі (<50 б), %",
    thGap: "Алшақтық",
    thStatus: "Мәртебе",
    scheduleTitle: "Сағаттарды оңтайландыру симуляторы",
    scheduleSub: "Ламбда (λ) арқылы нәтижелілікті арттыру",
    hourEffectLabel: "1 сағаттың эффектісі:",
    projAvgGain: "Болжамды орташа өсім:",
    hoursPlanTitle: "Сағаттарды қайта бөлу жоспары",
    baseHoursLabel: "Қазіргі сағат",
    recHoursLabel: "Ұсынылатын сағат",
    kbPromptsTitle: "Білім базасы & Сұраныстар",
    kbPromptsSub: "PISA-2025 және ОӘК бойынша жылдам сұрақтар:",
    aiAssistantTitle: "AI Әдіскер Көмекшісі",
    chatPlaceholder: "Сұрағыңызды жазыңыз...",
    sendBtn: "Жіберу"
  }
};

const CHAT_PROMPTS = [
  { labelRu: "📊 Результаты PISA-2025", labelKz: "📊 PISA-2025 нәтижелері", query: "PISA-2025 нәтижелері" },
  { labelRu: "📖 УМК 8 класс 2027", labelKz: "📖 8-сынып ОӘК 2027", query: "8 класс учебники 2027" },
  { labelRu: "👩‍🏫 Этика диалога с учителем", labelKz: "👩‍🏫 Мұғаліммен диалог этикасы", query: "этика диалога с учителем" }
];

export default function App() {
  const [lang, setLang] = useState<Language>("ru");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [targetScore] = useState(80);
  const [dataset] = useState<DatasetRow[]>([
    { textbook: "A Атамұра", score: 72 },
    { textbook: "B Алматыкітап", score: 78 },
    { textbook: "C Арман-ПВ", score: 69 },
  ]);

  const t = I18N[lang];

  const weeklyActivityData = useMemo(() => [
    { name: lang === 'kz' ? 'Дүй' : 'Пн', score: 64 },
    { name: lang === 'kz' ? 'Сей' : 'Вт', score: 68 },
    { name: lang === 'kz' ? 'Сәр' : 'Ср', score: 66 },
    { name: lang === 'kz' ? 'Бей' : 'Чт', score: 75 },
    { name: lang === 'kz' ? 'Жұм' : 'Пт', score: 72 },
    { name: lang === 'kz' ? 'Сен' : 'Сб', score: 80 },
    { name: lang === 'kz' ? 'Жек' : 'Вс', score: 77 },
  ], [lang]);

  const textbooksData = useMemo(() => {
    const map: Record<string, number[]> = {};
    dataset.forEach((r: DatasetRow) => {
      if (!map[r.textbook]) map[r.textbook] = [];
      map[r.textbook].push(r.score);
    });
    const books = Object.keys(map).sort();
    const naive = books.map(b => {
      const arr = map[b];
      let name = b.split(' ')[1] || b;
      if (lang === 'ru') {
        name = name.replace('Атамұра', 'Атамура').replace('Алматыкітап', 'Алматыкитап');
      }
      return { book: name, mean: Math.round((arr.reduce((x, y) => x + y, 0) / arr.length) * 10) / 10 };
    });

    const adjusted = [
      { book: lang === 'kz' ? "A (Атамұра)" : "A (Атамура)", effect: 0.0 },
      { book: lang === 'kz' ? "B (Алматыкітап)" : "B (Алматыкитап)", effect: 4.2 },
      { book: "C (Арман-ПВ)", effect: -3.1 }
    ];

    return { naive, adjusted };
  }, [dataset, lang]);

  const coursesList = useMemo(() => [
    { 
      title: lang === 'kz' ? "Алгебра - 8 сынып" : "Алгебра - 8 класс", 
      author: lang === 'kz' ? "Атамұра баспасы" : "Издательство Атамура", 
      rating: "4.8", bg: "from-emerald-500 to-teal-600" 
    },
    { 
      title: lang === 'kz' ? "Геометрия негіздері" : "Основы геометрии", 
      author: lang === 'kz' ? "Алматыкітап баспасы" : "Издательство Алматыкитап", 
      rating: "4.9", bg: "from-blue-500 to-indigo-600" 
    },
    { 
      title: lang === 'kz' ? "Математикалық сауаттылық" : "Математическая грамотность", 
      author: "Арман-ПВ", 
      rating: "4.6", bg: "from-purple-500 to-pink-600" 
    },
    { 
      title: lang === 'kz' ? "Функциялар мен Графиктер" : "Функции и Графики", 
      author: lang === 'kz' ? "Мектеп баспасы" : "Издательство Мектеп", 
      rating: "4.7", bg: "from-amber-500 to-orange-600" 
    },
    { 
      title: lang === 'kz' ? "Тригонометрия" : "Тригонометрия", 
      author: lang === 'kz' ? "Атамұра баспасы" : "Издательство Атамура", 
      rating: "4.8", bg: "from-rose-500 to-red-600" 
    },
    { 
      title: lang === 'kz' ? "Статистика" : "Статистика", 
      author: "Арман-ПВ", 
      rating: "4.5", bg: "from-cyan-500 to-blue-600" 
    },
  ], [lang]);

  const navigation: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: t.dashboard, icon: "📊" },
    { id: "courses", label: t.courses, icon: "📚" },
    { id: "students", label: t.students, icon: "👩‍🎓" },
    { id: "schedule", label: t.schedule, icon: "🗓️" },
    { id: "chat", label: t.chat, icon: "🤖" },
    { id: "settings", label: t.settings, icon: "⚙️" },
  ];

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-slate-50 dark:bg-[#0d141b] text-slate-900 dark:text-white flex`}>
      <aside className="w-64 shrink-0 bg-white dark:bg-[#141b22] border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black">Ұ</div>
            <div>
              <div className="font-extrabold text-sm">Ұстаз-Аналитика</div>
              <div className="text-[10px] text-slate-400">EDUCATION PLATFORM</div>
            </div>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs font-bold transition-all ${activeTab === item.id ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <span>{item.icon}</span><span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* PRO CARD AT BOTTOM */}
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center space-y-2">
            <div className="w-9 h-9 mx-auto rounded-full bg-white dark:bg-slate-800 text-emerald-600 flex items-center justify-center shadow-sm text-base">
              🎓
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.pisaModuleTitle}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.pisaModuleSub}</p>
            <button onClick={() => setActiveTab('schedule')} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm">
              {t.upgrade}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#141b22]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <span className="text-slate-400">🔍</span>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100 dark:bg-slate-800/60 border-none rounded-2xl px-4 py-2 text-xs focus:ring-2 focus:ring-emerald-500/30 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* LANGUAGE SWITCH */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex text-xs font-bold border border-slate-200/60 dark:border-slate-700">
              <button onClick={() => setLang('ru')} className={`px-3 py-1.5 rounded-xl transition-all ${lang === 'ru' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>RU</button>
              <button onClick={() => setLang('kz')} className={`px-3 py-1.5 rounded-xl transition-all ${lang === 'kz' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>ҚАЗ</button>
            </div>

            {/* THEME TOGGLE */}
            <button onClick={() => setDarkMode(!darkMode)} className="w-9 h-9 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* USER PROFILE */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                M
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold block leading-tight">Мартин Рай</span>
                <span className="text-[10px] text-slate-400 block">{t.userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTAINER */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 flex-1 w-full">

          {/* TAB 0: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* GREEN HERO BANNER (REF STYLE) */}
                <div className="lg:col-span-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-7 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="relative z-10 space-y-2">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                      Ұстаз-Аналитика РК
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-2">{t.welcomeTitle}</h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">{t.welcomeSub}</p>
                  </div>

                  <div className="relative z-10 flex flex-wrap gap-3 pt-4">
                    <button onClick={() => setActiveTab('students')} className="px-5 py-2.5 bg-white text-emerald-700 rounded-2xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition-all">
                      {t.viewProgress}
                    </button>
                    <button onClick={() => setActiveTab('schedule')} className="px-5 py-2.5 bg-emerald-700/50 hover:bg-emerald-700/70 border border-white/20 text-white rounded-2xl text-xs font-bold transition-all">
                      {t.planHours}
                    </button>
                  </div>
                </div>

                {/* CALENDAR & TASKS WIDGET */}
                <div className="lg:col-span-4 bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">{t.calendarMonth}</h3>
                    <span className="text-xs font-bold text-emerald-600">{t.calendarTitle}</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs py-3">
                    {(lang === 'kz' ? ['Д', 'С', 'С', 'Б', 'Ж', 'С', 'Ж'] : ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']).map((d, i) => (
                      <span key={i} className="text-slate-400 text-[10px] font-bold">{d}</span>
                    ))}
                    {[...Array(28)].map((_, i) => {
                      const day = i + 1;
                      const isToday = day === 15;
                      return (
                        <div
                          key={i}
                          className={`py-1 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                            isToday ? 'bg-emerald-500 text-white font-bold shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t.pisaReportDate}</span>
                    <span className="font-bold text-emerald-600">{t.pisaDateVal}</span>
                  </div>
                </div>

              </div>

              {/* STAT CARDS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: t.totalSchools, val: "8,048", sub: t.covFull, icon: "🏫" },
                  { label: t.pisaRank, val: lang === 'kz' ? "53-орын" : "53 место", sub: t.in91Countries, icon: "📊" },
                  { label: t.teachersCount, val: "415.5k", sub: t.teachersCount, icon: "👩‍🏫" },
                  { label: t.avgScore, val: "68.4", sub: `${t.lblTargetScore} ${targetScore}`, icon: "🎯" }
                ].map((st, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#141b22] rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-xl shrink-0 font-bold">
                      {st.icon}
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">{st.label}</span>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white block">{st.val}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{st.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">{t.weeklyActivity}</h3>
                  <span className="text-xs text-slate-400">{t.weeklySub}</span>
                </div>
                <div className="grid grid-cols-7 gap-3 items-end h-32">
                  {weeklyActivityData.map((item) => (
                    <div key={item.name} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="w-full rounded-t-lg bg-emerald-500" style={{ height: `${item.score}%` }} title={`${item.score}%`} />
                      <span className="text-[10px] text-slate-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.coursesTitle}</h2>
                <p className="text-xs text-slate-400">{t.coursesSub}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {coursesList.map((course) => (
                  <article key={course.title} className="bg-white dark:bg-[#141b22] rounded-2xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${course.bg} mb-4`} />
                    <h3 className="font-bold text-sm mb-2">{course.title}</h3>
                    <p className="text-xs text-slate-400">{course.author}</p>
                    <p className="text-xs text-amber-500 mt-3">★ {course.rating}</p>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.studentsTitle}</h2>
                <p className="text-xs text-slate-400">{t.studentsSub}</p>
              </div>
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm mb-4">{t.olsTitle}</h3>
                <div className="space-y-3">
                  {textbooksData.naive.map((book) => (
                    <div key={book.book} className="flex items-center justify-between gap-4 text-sm">
                      <span>{book.book}</span>
                      <span className="font-bold text-emerald-600">{book.mean}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 mt-4 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 mb-3">{t.adjCleanEffect}</h4>
                  {textbooksData.adjusted.map((book) => (
                    <div key={book.book} className="flex items-center justify-between gap-4 text-sm py-1">
                      <span>{book.book}</span>
                      <span className={book.effect >= 0 ? "text-emerald-600" : "text-rose-500"}>{book.effect > 0 ? "+" : ""}{book.effect}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.scheduleTitle}</h2>
                <p className="text-xs text-slate-400">{t.scheduleSub}</p>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.aiAssistantTitle}</h2>
              </div>
              <section className="bg-white dark:bg-[#141b22] rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-sm mb-4">{t.kbPromptsTitle}</h3>
                <p className="text-xs text-slate-400 mb-4">{t.kbPromptsSub}</p>
                <div className="flex flex-wrap gap-2">
                  {CHAT_PROMPTS.map((prompt) => (
                    <button key={prompt.query} type="button" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950">
                      {lang === "kz" ? prompt.labelKz : prompt.labelRu}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}