import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const output=mkdtempSync(join(tmpdir(),'zalea-header-active-'));
const compiled=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','lib/navigation.ts','--module','commonjs','--moduleResolution','node','--target','es2022','--resolveJsonModule','--esModuleInterop','--outDir',output,'--skipLibCheck'],{encoding:'utf8'});
if(compiled.status)throw Error(compiled.stdout+compiled.stderr);
const require=createRequire(import.meta.url);
const {activeNavigationKey:active,currentNavigationValue:current,navigation}=require(join(output,'navigation.js'));
process.on('exit',()=>rmSync(output,{recursive:true,force:true}));

test('all existing primary destinations and nested game pages select their section',()=>{
  for(const [path,key] of [['/','/'],['/games','/games'],['/games/english/a-or-an','/games'],['/games/science/animal-habitats','/games'],['/games/english/academy','/games'],['/resources','/resources'],['/worksheets?subject=english','/worksheets'],['/freebies/grade-tracker','/freebies'],['/shop/little-money-master-volume-1','/shop']])assert.equal(active(path),key,path);
});
test('guided Learning routes win over their Games ancestor',()=>{
  for(const path of ['/games/missions','/games/missions/maths-explorer','/games/missions/','/games/my-learning-journey'])assert.equal(active(path),'learning',path);
  assert.equal(active('/games/missions-extra'),'/games');
});
test('Tools includes every configured calculator family and detail route',()=>{
  for(const item of navigation.tools){assert.equal(active(item.href),'tools');assert.equal(active(item.href+'/example-calculator'),'tools');}
});
test('path boundaries do not select unrelated sections through substrings',()=>{
  for(const path of ['/about','/contact','/guides','/english-games-for-kids','/grammar-games-for-kids','/gamesmanship','/resources-old','/healthcare','/maths','/work-timer'])assert.equal(active(path),null,path);
});
test('current-page and ancestor semantics stay distinct and ignore query/hash/trailing slash',()=>{
  assert.equal(current('/games','/games'),'page');
  assert.equal(current('/games/english','/games'),'location');
  assert.equal(current('/resources/?anything=1#results','/resources'),'page');
  assert.equal(current('/worksheets?subject=english','/worksheets'),'page');
  assert.equal(current('/gamesmanship','/games'),undefined);
  assert.equal(current('/games','/'),undefined);
});
test('visual label change preserves group identity and every destination',()=>{
  assert.equal(navigation.primary.find(item=>item.group==='learning').label,'Learning');
  assert.deepEqual(navigation.learning.map(x=>x.href),['/games/missions','/games/my-learning-journey','/learning/malaysia/curriculum']);
  assert.equal(navigation.tools.length,5);
});
