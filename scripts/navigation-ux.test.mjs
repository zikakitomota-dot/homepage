import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const output = mkdtempSync(join(tmpdir(), 'zalea-navigation-'));
const compiled = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc','lib/resources/history.ts','lib/worksheets/intent.ts','--module','commonjs','--target','es2022','--outDir',output,'--skipLibCheck'], { encoding:'utf8' });
if(compiled.status) throw Error(compiled.stdout + compiled.stderr);
const require = createRequire(import.meta.url);
const { finderHistoryKey:key, readFinderSnapshot, withFinderSnapshot } = require(join(output,'resources/history.js'));
const { worksheetIntent } = require(join(output,'worksheets/intent.js'));
process.on('exit',()=>rmSync(output,{recursive:true,force:true}));
test('Finder round-trip retains combined filters and scroll without losing router data',()=>{
  const router={__NA:true,__PRIVATE_NEXTJS_INTERNALS_TREE:{tree:['root']}};
  const snapshot={filters:{query:'subtraction',type:'game',category:'mathematics',sort:'title'},scrollY:1234};
  const state=withFinderSnapshot(router,snapshot);
  assert.deepEqual(readFinderSnapshot(state),snapshot);
  assert.equal(state.__PRIVATE_NEXTJS_INTERNALS_TREE,router.__PRIVATE_NEXTJS_INTERNALS_TREE);
  assert.equal(router[key],undefined);
});
test('malformed history is bounded and cannot inject arbitrary filters',()=>{
  for(const invalid of [null,42,'string',{[key]:null}]) assert.deepEqual(readFinderSnapshot(invalid).filters,{query:'',type:'all',category:'all',sort:'relevance'});
  const result=readFinderSnapshot({[key]:{filters:{query:'x'.repeat(999),type:'__proto__',category:'constructor',sort:'script'},scrollY:Infinity}});
  assert.equal(result.filters.query.length,120);
  assert.deepEqual({...result.filters,query:''},{query:'',type:'all',category:'all',sort:'relevance'});
  assert.equal(result.scrollY,0);
});
test('worksheet intent allowlists subjects and operations and rejects duplicates',()=>{
  const intent=q=>worksheetIntent(new URLSearchParams(q));
  assert.deepEqual(intent('subject=english'),{subject:'english',topic:'addition'});
  assert.deepEqual(intent('subject=mathematics&operation=subtraction'),{subject:'mathematics',topic:'subtraction'});
  assert.deepEqual(intent('subject=mathematics&operation=mixed'),{subject:'mathematics',topic:'mixed'});
  for(const q of ['subject=bogus&operation=delete','subject=english&subject=mathematics&operation=mixed&operation=subtraction','subject=%3Cscript%3E&seed=secret'])assert.deepEqual(intent(q),{subject:'mathematics',topic:'addition'});
});
test('Model C is shallow, has no future links and retains Health',()=>{
  const nav=JSON.parse(readFileSync('lib/navigation.json','utf8'));
  assert.deepEqual(nav.primary.map(x=>x.label),['Home','Tools','Search','Games','Worksheets','Learning','Freebies','Shop']);
  assert.deepEqual(nav.learning.map(x=>x.href),['/games/missions','/games/my-learning-journey','/learning/malaysia/curriculum']);
  assert.ok(nav.tools.some(x=>x.href==='/health'));
  assert.ok(!JSON.stringify(nav).includes('/learning/malaysia-curriculum'));
  assert.ok(!readFileSync('components/site-header.tsx','utf8').includes('Explore Health Calculators'));
  assert.ok(readFileSync('health/src/components/Header.astro','utf8').includes('lib/navigation'));
});
