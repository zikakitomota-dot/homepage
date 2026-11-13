import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdtempSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const out=mkdtempSync(join(tmpdir(),'zalea-curriculum-'));
const compiled=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','lib/learning/detektif-bunyi.ts','lib/learning/progress.ts','lib/resources/catalogue.ts','lib/resources/search.ts','lib/games/learning-journey.ts','lib/games/missions.ts','lib/navigation.ts','--module','commonjs','--moduleResolution','node','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--outDir',out],{encoding:'utf8'});
if(compiled.status)throw Error(compiled.stdout+compiled.stderr);
const require=createRequire(import.meta.url);
const g=require(join(out,'learning/detektif-bunyi.js'));
const c=require(join(out,'learning/curriculum.js'));
const p=require(join(out,'learning/progress.js'));
const j=require(join(out,'games/learning-journey.js'));
const {missions}=require(join(out,'games/missions.js'));
const {gameRegistry}=require(join(out,'games/registry.js'));
const {resourceCatalogue,validateResourceCatalogue}=require(join(out,'resources/catalogue.js'));
const {searchResources}=require(join(out,'resources/search.js'));
const {activeNavigationKey}=require(join(out,'navigation.js'));
process.on('exit',()=>rmSync(out,{recursive:true,force:true}));
class Storage {values=new Map();getItem(k){return this.values.get(k)??null;}setItem(k,v){this.values.set(k,v);}removeItem(k){this.values.delete(k);}}
const record={sessionId:'test-session-1',activityId:c.detektifBunyi.activityId,countryCode:'MY',curriculumVersion:'KP2027',mode:'beginner',listeningAttempted:8,listeningCorrect:5,speakingPractised:4,adultObserved:2,completedAt:'2026-11-11T00:00:00.000Z'};
test('original seven country routes remain within the expanded eight-route curriculum',()=>{
 assert.equal(c.curriculumRoutes.length,8);assert.equal(new Set(c.curriculumRoutes).size,8);
 for(const route of c.curriculumRoutes){const source=readFileSync('app'+route+'/page.tsx','utf8');assert.ok(source.includes('createEducationalMetadata'));assert.equal(activeNavigationKey(route),'learning');}
 assert.ok(!existsSync('app/learning/malaysia-curriculum'));assert.ok(!existsSync('app/learning/singapore'));
 assert.ok(readFileSync('app/sitemap.ts','utf8').includes('...curriculumRoutes.map'));
});
test('provisional SK Tahun 1 references do not invent exact official wording',()=>{
 const activity=c.detektifBunyi;
 assert.equal(activity.alignmentStatus,'provisional');assert.equal(activity.schoolYear,'Tahun 1');assert.match(activity.schoolType,/SK/);
 assert.deepEqual(activity.learningStandards.map(s=>s.code),['SP 1.1.1','SP 2.1.1']);
 assert.ok(activity.learningStandards.every(s=>s.wordingVerified===false));assert.equal(activity.sourceReferences.length,2);
 assert.match(activity.verificationNotes,/masih belum selesai/);assert.ok(!activity.activityId.includes('2027'));
});
test('ten locally decodable real clips have licence, provenance, duration, icons and non-silent PCM',()=>{
 assert.equal(g.sounds.length,10);
 for(const sound of g.sounds){
  for(const key of ['sourceUrl','creator','licence','licenceUrl','attribution','changes','verification','ambiguity','description'])assert.ok(sound[key],sound.id+':'+key);
  assert.ok(['CC BY 3.0','Public Domain'].includes(sound.licence));
  assert.ok(existsSync('public/images/learning/sounds/'+sound.icon+'.svg'));
  const data=readFileSync('public'+sound.path);
  assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');
  assert.equal(data.readUInt16LE(22),1);assert.equal(data.readUInt32LE(24),22050);assert.equal(data.readUInt16LE(34),16);
  assert.ok(sound.duration>=1&&sound.duration<=6);assert.ok(data.length<250000);
  let peak=0;for(let i=44;i<data.length;i+=2)peak=Math.max(peak,Math.abs(data.readInt16LE(i)));
  assert.ok(peak>100&&peak<12000);
 }
});
test('600 seeded sessions per mode: unique, deterministic, varied, valid source-answer relationship and balanced categories',()=>{
 for(const mode of g.difficulties){
  const seen=new Set(),positions=new Set(),sounds=new Set();
  for(let seed=0;seed<600;seed++){
   const session=g.createSoundSession(mode,'qa-'+seed);
   assert.deepEqual(session,g.createSoundSession(mode,'qa-'+seed));assert.equal(session.length,mode==='beginner'?8:10);
   assert.equal(new Set(session.map(q=>q.id)).size,session.length);
   assert.equal(session.filter(q=>q.kind==='sequence').length,mode==='challenge'?4:0);
   seen.add(session.map(q=>q.id+q.choices.join()).join('|'));
   assert.equal(new Set(session.map(q=>g.soundById[q.correctId].category)).size,3);
   for(const q of session){
    sounds.add(q.correctId);assert.ok(q.soundIds.every(id=>g.soundById[id]));
    assert.equal(q.choices.length,mode==='beginner'?3:4);assert.equal(new Set(q.choices).size,q.choices.length);
    assert.equal(q.choices.filter(id=>id===q.correctId).length,1);positions.add(q.choices.indexOf(q.correctId));
    if(q.kind==='single')assert.deepEqual(q.soundIds,[q.correctId]);
    else assert.equal(q.soundIds[q.prompt.includes('pertama')?0:1],q.correctId);
    if(mode==='beginner')assert.ok(q.choices.filter(id=>id!==q.correctId).every(id=>g.soundById[id].category!==g.soundById[q.correctId].category));
   }
  }
  assert.equal(seen.size,600);assert.equal(positions.size,mode==='beginner'?3:4);assert.equal(sounds.size,mode==='beginner'?8:10);
 }
});
test('listening scores reflect attempts independently of speaking practice',()=>{
 assert.deepEqual(g.scoreListening([true,false,true]),{attempted:3,correct:2,incorrect:1,percentage:67});
 assert.equal(g.scoreListening([]).percentage,0);
});
test('completion is validated, deduplicated and survives reload without changing general progress',()=>{
 const area=new Storage();area.setItem('zalea-learning-journey-v1','legacy-sentinel');
 assert.ok(p.recordCurriculumSession(record,area));assert.ok(p.recordCurriculumSession(record,area));
 assert.equal(p.readCurriculumProgress(area).sessions.length,1);assert.equal(area.getItem('zalea-learning-journey-v1'),'legacy-sentinel');
 assert.equal(p.readCurriculumProgress(area).sessions[0].adultObserved,2);
 assert.equal(p.recordCurriculumSession({...record,speakingPractised:0},area),false);
 assert.equal(p.recordCurriculumSession({...record,listeningCorrect:99},area),false);
});
test('export/import merges curriculum sessions and strips unknown personal properties',()=>{
 const a=new Storage(),b=new Storage();p.recordCurriculumSession(record,a);
 const exported=JSON.stringify(p.readCurriculumProgress(a));assert.ok(p.importCurriculumProgress(exported,b));
 assert.deepEqual(p.readCurriculumProgress(b),p.readCurriculumProgress(a));p.importCurriculumProgress(exported,b);assert.equal(p.readCurriculumProgress(b).sessions.length,1);
 const raw=JSON.stringify({version:1,sessions:[{...record,childName:'never-preserved'}]});
 assert.ok(!JSON.stringify(p.parseCurriculumProgress(raw)).includes('never-preserved'));
});
test('invalid/corrupt/oversized imports fail atomically; unavailable storage does not prevent play',()=>{
 const area=new Storage();p.recordCurriculumSession(record,area);const before=area.getItem(p.CURRICULUM_STORAGE_KEY);
 for(const text of ['{',JSON.stringify({version:2,sessions:[]}),JSON.stringify({version:1,sessions:[{...record,adultObserved:9}]}),'x'.repeat(300000)])assert.throws(()=>p.importCurriculumProgress(text,area));
 assert.equal(area.getItem(p.CURRICULUM_STORAGE_KEY),before);
 assert.equal(p.recordCurriculumSession(record,{getItem(){throw Error();},setItem(){throw Error();}}),false);
 assert.ok(p.clearCurriculumProgress(area));assert.equal(p.readCurriculumProgress(area).sessions.length,0);
});
test('legacy general Journey exports, game registry, achievements and Missions remain independent',()=>{
 const area=new Storage();const old=j.createEmptyJourney();const exported=j.exportLearningJourney(old);
 p.recordCurriculumSession(record,area);assert.deepEqual(j.parseLearningJourneyImport(exported),old);
 assert.ok(!gameRegistry.some(game=>game.gameId===c.detektifBunyi.activityId));
 assert.ok(missions.every(m=>m.activities.every(a=>a.gameId!==c.detektifBunyi.activityId)));assert.equal(missions.length,4);
});
test('Finder discovers a single curriculum activity, including its companion without duplicate canonical entries',()=>{
 assert.deepEqual(validateResourceCatalogue(resourceCatalogue),[]);
 assert.equal(resourceCatalogue.filter(r=>r.href===c.detektifBunyi.route).length,1);
 for(const query of ['Detektif Bunyi','Bahasa Melayu','Tahun 1','KP2027','Malaysia','SK','bunyi persekitaran','mendengar','bertutur','haiwan']){
  assert.ok(searchResources(resourceCatalogue,{query,type:'game',category:'bahasa-melayu',sort:'relevance'}).some(r=>r.href===c.detektifBunyi.route),query);
 }
});
test('browser controls guard audio errors, cancellation, duplication and separate practice claims',()=>{
 const source=readFileSync('components/learning/detektif-bunyi-game.tsx','utf8');
 for(const term of ['audio.onerror=fail','audio.play().catch(fail)','token.current','audio.pause()','if(!heard||locked.current','if(!heard||spokenLock.current','audio.onended','audio.onplaying','role="status"'])assert.ok(source.includes(term),term);
 assert.ok(!/getUserMedia|MediaRecorder|SpeechRecognition|fetch\(|trackEvent|gtag/.test(source));
 assert.ok(source.includes('Ketepatan sebutan tidak dinilai secara automatik'));
 const panel=readFileSync('components/learning/progress-panel.tsx','utf8');assert.ok(panel.includes("addEventListener('storage'"));assert.ok(panel.includes('window.confirm'));
});
test('six-page A4 companion has complete answers and honest assessment distinctions',()=>{
 const pdf=readFileSync('public/downloads/detektif-bunyi-aktiviti.pdf');assert.equal(pdf.toString('ascii',0,4),'%PDF');assert.ok(pdf.length>20000&&pdf.length<300000);
 const text=readFileSync('test/fixtures/curriculum/detektif-printable.txt','utf8').replace(/\s+/g,' ');
 for(const term of ['1-E Kucing','6-C Hujan','SP 1.1.1','SP 2.1.1','Pengecaman melalui audio','Padanan visual','masih belum selesai'])assert.ok(text.includes(term),term);
});
test('protected infrastructure, old progress and analytics sources remain byte-identical',()=>{
 const crypto=require('node:crypto');const before=JSON.parse(readFileSync('test/fixtures/curriculum/infrastructure-sha256.json'));
 for(const [path,hash]of Object.entries(before))assert.equal(crypto.createHash('sha256').update(readFileSync(path,'utf8').replaceAll('\r\n','\n')).digest('hex'),hash,path);
 const ads=readFileSync('lib/adsense.ts','utf8');assert.ok(!ads.includes('/learning'));
});
