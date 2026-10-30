import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, rmSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output=mkdtempSync(join(tmpdir(),'zalea-resources-'));
const compiled=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','lib/resources/catalogue.ts','lib/resources/search.ts','--module','commonjs','--target','es2022','--outDir',output,'--esModuleInterop','--skipLibCheck'],{encoding:'utf8'});
if(compiled.status!==0)throw Error(compiled.stdout+compiled.stderr);
const require=createRequire(import.meta.url);
const {resourceCatalogue:resources,validateResourceCatalogue}=require(join(output,'resources/catalogue.js'));
const {searchResources,normaliseResourceQuery}=require(join(output,'resources/search.js'));
const {initialResourceFilters:initial}=require(join(output,'resources/types.js'));
process.on('exit',()=>rmSync(output,{recursive:true,force:true}));
const search=(query,other={})=>searchResources(resources,{...initial,query,...other});
const ids=entries=>entries.map(entry=>entry.id);

test('published free inventory is complete, unique and valid',()=>{
  assert.deepEqual(validateResourceCatalogue(resources),[]);
  assert.equal(resources.length,72);
  assert.deepEqual(Object.fromEntries(['game','mission','worksheet','freebie','guide','calculator'].map(type=>[type,resources.filter(r=>r.type===type).length])),{game:22,mission:4,worksheet:1,freebie:13,guide:4,calculator:28});
  assert.ok(resources.every(r=>r.access==='free'&&r.status==='available'));
  assert.ok(resources.every(r=>!r.href.includes('academy')&&!r.href.startsWith('/shop')));
  assert.equal(resources.filter(r=>r.href==='/worksheets').length,1);
});
test('validator rejects duplicated, incomplete, paid, unavailable and invalid entries',()=>{
  assert.ok(validateResourceCatalogue([...resources,resources[0]]).some(e=>e.includes('Duplicate')));
  for(const changed of [{title:''},{keywords:[]},{status:'coming-soon'},{access:'paid'},{href:'/worksheets?seed=123'},{categories:['invented']}]) assert.ok(validateResourceCatalogue([{...resources[0],...changed}]).length);
});
test('every catalogue destination resolves to a real published source route',()=>{
  for(const resource of resources){
    let exists=existsSync(join('app',resource.href,'page.tsx'));
    if(resource.href.startsWith('/games/english/')&&resource.type==='game')exists=existsSync('app/games/english/[slug]/page.tsx');
    if(resource.type==='mission')exists=existsSync('app/games/missions/[missionId]/page.tsx');
    if(resource.type==='freebie')exists=existsSync('app/freebies/[slug]/page.tsx');
    if(resource.href.startsWith('/health/'))exists=existsSync(join('public',resource.href,'index.html'));
    assert.ok(exists,resource.href);
  }
});
test('subtraction ranks the game and includes its worksheet and mission without unrelated games',()=>{
  const results=search('subtraction');
  assert.equal(results[0].id,'game:subtraction-level-1');
  assert.ok(ids(results).includes('worksheet:studio'));
  assert.ok(ids(results).includes('mission:maths-explorer'));
  assert.ok(!results.some(r=>r.categories.includes('geography')||r.categories.includes('english')&&r.type==='game'));
});
test('grammar, geography and holidays find genuinely relevant resources',()=>{
  assert.equal(search('grammar',{type:'game'}).length,10);
  assert.ok(ids(search('grammar')).includes('worksheet:studio'));
  assert.ok(ids(search('geography')).includes('mission:world-explorer'));
  assert.equal(search('geography',{type:'game'}).length,4);
  assert.deepEqual(ids(search('holidays')),['calculator:work-time:business-days-calculator']);
  assert.equal(search('holidays',{type:'game'}).length,0);
});
test('normalisation, synonyms, partial words and all-term matching work',()=>{
  assert.equal(normaliseResourceQuery('  GRÁMMAR   Practice! '),'grammar practice');
  assert.deepEqual(ids(search('  SUBTRACTION  ')),ids(search('subtraction')));
  assert.deepEqual(ids(search('minus')),ids(search('subtraction')));
  assert.ok(ids(search('subtr')).includes('game:subtraction-level-1'));
  assert.ok(ids(search('maths')).includes('worksheet:studio'));
  assert.deepEqual(ids(search('public holidays')),['calculator:work-time:business-days-calculator']);
  assert.equal(search('geography cashback').length,0);
});

test('English topic searches find games behind learner-friendly titles',()=>{
  for (const [query, gameIds] of Object.entries({pronouns:['he-she-it','who-is-it'],possessives:['whose-is-it'],prepositions:['where-is-it'],articles:['a-or-an'],verbs:['is-am-are','can-or-cant','has-or-have'],demonstratives:['this-that-these-those']})) {
    const results=search(query,{type:'game',category:'english'});
    assert.deepEqual(ids(results).sort(),gameIds.map(id=>'game:'+id).sort(),query);
    assert.deepEqual(ids(search(query)),ids(search(query.slice(0,-1))),query+' singular equivalence');
  }
  assert.deepEqual(ids(search('business days')),['calculator:work-time:business-days-calculator']);
  assert.equal(search('budget').length,3);
  assert.equal(search('worksheets')[0].id,'worksheet:studio');
});
test('combined filters, deterministic sorting, clearing and zero results',()=>{
  const geography=search('',{type:'game',category:'geography'});assert.equal(geography.length,4);
  assert.equal(search('grammar',{type:'worksheet',category:'english'}).length,1);
  assert.equal(search('unmatched-zxy123').length,0);
  assert.equal(search('   ').length,resources.length);
  const alpha=search('',{sort:'title'}).map(r=>r.title);
  assert.deepEqual(alpha,[...alpha].sort((a,b)=>a.localeCompare(b,'en')));
  assert.deepEqual(search(''),search(''));
  assert.equal(search('',{category:'finance'}).filter(r=>r.type==='calculator').length,6);
});
test('time and clock searches find the Life Skills game without unrelated calculators',()=>{
  for(const query of ['time detective','clock','analogue','quarter past','minutes']) {
    const results=search(query,{type:'game',category:'life-skills'});
    assert.deepEqual(ids(results),['game:time-detective'],query);
  }
});
test('money and currency searches find Money Match within Life Skills',()=>{
  for(const query of ['money match','coins','banknotes','ringgit','MYR','dollars','USD','exact payment','change']) {
    const results=search(query,{type:'game',category:'life-skills'});
    assert.equal(results[0]?.id,'game:money-match',query);
  }
});
test('Finder keeps raw searches out of storage, URL state, network and analytics',()=>{
  const source=readFileSync('components/resources/resource-finder.tsx','utf8');
  assert.ok(!/localStorage|sessionStorage|fetch\(|URLSearchParams|history\./.test(source));
  for(const line of source.split('\n').filter(line=>line.includes('trackEvent('))) assert.ok(!/filters\.query|query:|search_term|searchTerms/.test(line));
  assert.ok(source.includes('prefetch={false}'));
  assert.ok(!readFileSync('lib/adsense.ts','utf8').includes("'/resources'"));
});

if(process.env.RESOURCE_QA_EXPORT){mkdirSync('qa/resource-finder-20261027',{recursive:true});writeFileSync('qa/resource-finder-20261027/catalogue.json',JSON.stringify(resources,null,2));}
