// KISS: простий централізований логер замість console.log, розкиданого по коду.
// SRP: єдина відповідальність — форматування й вивід логів.
type LogLevel = 'INFO' | 'WARN' | 'ERROR';

function log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] [${level}] ${message}`);
}

export const logger = {
    info: (message: string) => log('INFO', message),
    warn: (message: string) => log('WARN', message),
    error: (message: string) => log('ERROR', message),
};
