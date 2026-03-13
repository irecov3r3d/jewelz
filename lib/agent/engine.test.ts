import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseRepairResponse } from './engine.ts';

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
