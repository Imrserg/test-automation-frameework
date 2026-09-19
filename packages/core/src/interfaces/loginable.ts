// SOLID (I, D): вузький спільний контракт для будь-якого екрана/сторінки,
// що вміє логінити користувача — незалежно від того, Web це чи Mobile.
// Дозволяє писати generic-хелпери в core, що працюють з обома шарами,
// не залежачи від конкретної реалізації (Playwright Page vs WDIO Screen).

export interface ILoginable {
    login(email: string, password: string): Promise<void>;
}
