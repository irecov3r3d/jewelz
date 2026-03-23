import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseRepairResponse } from './engine.ts';
import esmock from 'esmock';

describe('parseRepairResponse', () => {
    it('should strip markdown code blocks (bash)', () => {
        const input = '```bash\nls -la\n```';
        const expected = 'ls -la';
        assert.strictEqual(parseRepairResponse(input), expected);
    });

    it('should strip markdown code blocks (no language)', () => {
        const input = '```\nrm -rf /\n```';
        const expected = 'rm -rf /';
        assert.strictEqual(parseRepairResponse(input), expected);
    });

    it('should trim leading and trailing whitespace', () => {
        const input = '   \n  echo "hello"  \n   ';
        const expected = 'echo "hello"';
        assert.strictEqual(parseRepairResponse(input), expected);
    });

    it('should handle just the command without blocks', () => {
        const input = 'mkdir -p /tmp/test';
        const expected = 'mkdir -p /tmp/test';
        assert.strictEqual(parseRepairResponse(input), expected);
    });

    it('should preserve formatting inside the block', () => {
        const input = '```bash\nfor i in {1..5}; do\n  echo $i\ndone\n```';
        const expected = 'for i in {1..5}; do\n  echo $i\ndone';
        assert.strictEqual(parseRepairResponse(input), expected);
    });
});

describe('generateRepairPrompt', () => {
    it('should generate a prompt and return the parsed response', async () => {
        let capturedPrompt: string | undefined;

        const engine = await esmock('./engine.ts', {
            '@google/generative-ai': {
                GoogleGenerativeAI: class {
                    getGenerativeModel() {
                        return {
                            generateContent: async (prompt: string) => {
                                capturedPrompt = prompt;
                                return {
                                    response: {
                                        text: () => '```bash\nfixed_command_from_llm\n```'
                                    }
                                };
                            }
                        };
                    }
                }
            }
        });

        const failedCommand = 'bad_command --foo';
        const errorMsg = 'Error: foo is not defined';
        const result = await engine.generateRepairPrompt(failedCommand, errorMsg);

        const expectedPrompt = `The command '${failedCommand}' failed with the following error:\n\n${errorMsg}\n\nProvide ONLY the fixed bash command or file changes required to fix this issue. If it's a bash command, provide only the command as text without markdown blocks.`;

        assert.strictEqual(capturedPrompt, expectedPrompt);
        assert.strictEqual(result, 'fixed_command_from_llm');
    });
});
