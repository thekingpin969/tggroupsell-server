import prompts, { PromptType } from 'prompts';

interface QuestionOptions<T extends string> {
    type: PromptType;
    name: T;
    message: string;
}

export async function ask<T extends string>(
    options: QuestionOptions<T>
): Promise<string | number | boolean | null> {
    const response = await prompts({
        type: options.type,
        name: options.name,
        message: options.message,
    });

    return response[options.name] ?? null;
}
