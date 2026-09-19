// KISS + DRY: одна generic-функція retry замість дублювання спроб
// у різних тестах/клієнтах для нестабільних (flaky) операцій.
export async function retry<T>(
    fn: () => Promise<T>,
    attempts = 3,
    delayMs = 500,
): Promise<T> {
    let lastError: unknown;

    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < attempts - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }
    }

    throw lastError;
}
