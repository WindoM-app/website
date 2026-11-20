import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { clip, githubAnchor, parseChangelog, SUMMARY_MAX } from './changelog.ts';
import { formatDate, postsOf } from './updates.ts';

/** Plain `node --test`; see search.test.ts. */

const SAMPLE = `# Changelog

## [Unreleased]

- Not shipped yet.

---

## [1.5.1] - 2026-10-26

A fix release. Signing in with **Google** succeeded and then undid
itself, which also took \`Spotify\` with it.

### Fixed
- Something.

---

## [1.0.0] - 2026-03-19

### Added
- New tab dashboard with [glassmorphism](https://example.com) design,
  continued on a second line
- Clock
`;

describe('parseChangelog (#374)', () => {
  const releases = parseChangelog(SAMPLE);

  it('reads every dated release, newest first, and skips Unreleased', () => {
    assert.deepEqual(
      releases.map((r) => [r.version, r.date]),
      [
        ['1.5.1', '2026-10-26'],
        ['1.0.0', '2026-03-19'],
      ],
    );
  });

  it('summarises with the intro paragraph as plain text', () => {
    assert.equal(
      releases[0]?.summary,
      'A fix release. Signing in with Google succeeded and then undid itself, which also took Spotify with it.',
    );
  });

  it('falls back to the first entry, continuation lines included, when there is no intro', () => {
    assert.equal(releases[1]?.summary, 'New tab dashboard with glassmorphism design, continued on a second line');
  });

  it("produces GitHub's anchor for the heading", () => {
    assert.equal(releases[0]?.anchor, '151---2026-10-26');
    assert.equal(githubAnchor('[1.4.0] - 2026-04-25'), '140---2026-04-25');
  });

  it('parses the real CHANGELOG.md into releases that all have a summary', (t) => {
    const product = resolve(process.env.PRODUCT_DIR ?? 'product');
    if (!existsSync(resolve(product, 'CHANGELOG.md')))
      return t.skip('product checkout absent - run scripts/fetch-product.sh');
    const real = parseChangelog(readFileSync(resolve(product, 'CHANGELOG.md'), 'utf8'));
    assert.ok(real.length >= 8, `only ${real.length} releases parsed`);
    assert.equal(
      real[0]?.version,
      (JSON.parse(readFileSync(resolve(product, 'web/manifest.json'), 'utf8')) as { version: string }).version,
    );
    for (const r of real) {
      assert.ok(r.summary.length > 0, `${r.version} has no summary`);
      assert.ok(r.summary.length <= SUMMARY_MAX + 1, `${r.version} summary is ${r.summary.length} chars`);
    }
  });
});

describe('clip', () => {
  it('leaves short text alone', () => {
    assert.equal(clip('Short.'), 'Short.');
  });

  it('cuts back to a whole sentence when one fits', () => {
    const text = `${'a'.repeat(100)}. ${'b'.repeat(200)}`;
    assert.equal(clip(text), `${'a'.repeat(100)}.`);
  });

  it('otherwise cuts at a word boundary with an ellipsis', () => {
    const out = clip('word '.repeat(100));
    assert.ok(out.endsWith('word…'));
    assert.ok(out.length <= SUMMARY_MAX + 1);
  });
});

describe('postsOf: the blog API response shape (#374)', () => {
  it('reads { items } - what the live API returns', () => {
    assert.deepEqual(postsOf({ ok: true, items: [1, 2] }), [1, 2]);
  });

  it('still reads a bare array and { posts }', () => {
    assert.deepEqual(postsOf([1]), [1]);
    assert.deepEqual(postsOf({ posts: [2] }), [2]);
  });

  it('rejects anything else', () => {
    assert.equal(postsOf({ ok: false, error: 'x' }), null);
    assert.equal(postsOf(null), null);
    assert.equal(postsOf('items'), null);
  });
});

describe('formatDate', () => {
  it('shows a bare date as that day in every time zone', () => {
    assert.equal(formatDate('2026-10-26'), '26 Oct 2026');
  });
});
