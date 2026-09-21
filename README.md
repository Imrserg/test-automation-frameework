# Test Automation Framework — API + Web UI + Mobile

Monorepo на **TypeScript**: **Playwright** (API + Web UI) + **WebdriverIO/Appium** (iOS/Android).

## Структура

```
packages/
├── core/           → спільні типи, дата-білдери, конфіг, інтерфейси, утиліти
├── api-tests/      → Playwright API-тести (BaseApiClient, IUserApiClient)
├── web-tests/      → Playwright UI-тести (Page Object + Component Object)
└── mobile-tests/   → WebdriverIO + Appium (Screen Object)
```

## Застосовані принципи

| Принцип           | Де саме                                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SRP**           | Page/Screen Object містять лише дії користувача, жодних `expect()` — див. ESLint-правило в `.eslintrc.json`                                               |
| **OCP**           | `BaseApiClient`, `BasePage`, `BaseScreen` — розширюються через успадкування без зміни базового класу                                                      |
| **LSP**           | `LoginPage` (web) і `LoginScreen` (mobile) обидва реалізують `ILoginable` з `@framework/core` — взаємозамінні там, де очікується "щось, що вміє логінити" |
| **ISP**           | `IUserApiClient` — вузький інтерфейс лише під потреби роботи з users, а не "товстий" інтерфейс на всі ендпоінти                                           |
| **DIP**           | Playwright fixtures та Screen Object залежать від інтерфейсів (`IUserApiClient`, `ILoginable`), а не від конкретних класів                                |
| **DRY**           | `UserBuilder`, `platformLocator()`, `BaseApiClient` — усунення дублювання даних/локаторів/HTTP-логіки                                                     |
| **KISS**          | Прості методи-дії, без зайвих фабрик/стратегій там, де немає реальної варіативності                                                                       |
| **Page Object**   | `packages/web-tests/src/pages/*` + `HeaderComponent` для повторюваних блоків                                                                              |
| **Screen Object** | `packages/mobile-tests/src/screens/*` + окремий шар локаторів                                                                                             |

## Встановлення

```bash
npm install
```

## Запуск тестів

```bash
npm run test:api        # Playwright API
npm run test:web        # Playwright UI (потрібен запущений веб-застосунок)
npm run test:android    # WebdriverIO + Appium, потрібен емулятор Android
npm run test:ios        # WebdriverIO + Appium, потрібен симулятор iOS (тільки macOS)
```

Перед мобільними тестами запусти Appium-сервер окремо (або довірся `@wdio/appium-service`,
який робить це автоматично):

```bash
npm install -g appium
appium driver install uiautomator2   # для Android
appium driver install xcuitest       # для iOS
```

## Конфігурація середовища

Створи `.env` в корені (або в кожному пакеті окремо):

```
API_BASE_URL=https://api.staging.example.com
WEB_BASE_URL=https://staging.example.com
ANDROID_APP_PATH=./apps/android/app-debug.apk
IOS_APP_PATH=./apps/ios/app.zip
```

## Форматування коду

Стиль коду форматується автоматично через **Prettier** (конфіг — `.prettierrc.json`),
конфлікти з ESLint вимкнені через `eslint-config-prettier`.

```bash
npm run format        # відформатувати всі файли
npm run format:check  # лише перевірити, без змін (для CI)
```

Pre-commit hook (**husky** + **lint-staged**) автоматично форматує лише staged-файли
перед кожним комітом — вручну запускати `npm run format` для нових змін не обов'язково.

## Звітність

Playwright і WDIO пишуть у Allure-сумісному форматі. Об'єднаний звіт:

```bash
npm run report:combined
```

## CI/CD

`.github/workflows/ci.yml` — lint → api-tests + web-tests на кожен PR;
android/ios-tests — за ручним запуском (`workflow_dispatch`)

## Claude Code скіли

`.claude/skills/` містить скіли, що знають конвенції саме цього репо — Claude Code
підхоплює їх автоматично в цій директорії:

| Скіл                                                                                       | Призначення                                                                                                                                     |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `new-test`                                                                                 | Створення нового API/Web/Mobile тесту за наявними патернами (Page/Screen Object, Builder, Zod-схеми, Allure `step()`)                           |
| `mobile-env-doctor`                                                                        | Діагностика локального iOS Simulator/Android Emulator + Appium (пристрій не знайдено, конфлікт версій, збій драйвера, нестабільність емулятора) |
| `allure-report-local`                                                                      | Генерація та перегляд об'єднаного Allure-звіту локально — з прогону або з завантажених артефактів CI                                            |
| `ci-triage`                                                                                | Розбір причини падіння GitHub Actions рану через `gh` CLI замість ручного вставляння логів                                                      |
| `playwright-cli` ([microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)) | Локальне керування браузером через CLI — корисно звірити реальні `data-testid` перед написанням Page Object                                     |

Встановити ще один зовнішній скіл:

```bash
npx -y skills add <owner>/<repo> --skill <skill-name> --agent claude-code
```

## Наступні кроки для розширення

- Розглянути Nx/Turborepo, якщо кількість пакетів і час збірки зростуть
