import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('AppModule static asset serving', () => {
  it('serves uploaded assets with long-lived immutable cache headers', () => {
    const source = readFileSync(join(__dirname, 'app.module.ts'), 'utf8');

    expect(source).toContain('serveStaticOptions');
    expect(source).toContain('Cache-Control');
    expect(source).toContain('max-age=31536000');
    expect(source).toContain('immutable');
  });
});
