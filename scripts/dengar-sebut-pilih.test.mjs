import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire}from'node:module';
import {mkdtempSync,readFileSync,existsSync,rmSync}from'node:fs';
import {join}from'node:path';
import {tmpdir}from'node:os';
import {spawnSync}from'node:child_process';
const out=mkdtempSync(join(tmpdir(),'zalea-dengar-'));
const compile=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','lib/learning/dengar-sebut-pilih.ts','lib/learning/progress.ts','lib/resources/catalogue.ts','lib/resources/search.ts','lib/games/learning-journey.ts','lib/games/missions.ts','--module','commonjs','--moduleResolution','node','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck','--outDir',out],{encoding:'utf8'});
if(compile.status)throw Error(compile.stdout+compile.stderr);
const require=createRequire(import.meta.url),g=require(join(out,'learning/dengar-sebut-pilih.js')),c=require(join(out,'learning/curriculum.js')),p=require(join(out,'learning/progress.js'));
const {resourceCatalogue,validateResourceCatalogue}=require(join(out,'resources/catalogue.js')),{searchResources}=require(join(out,'resources/search.js'));
const {gameRegistry}=require(join(out,'games/registry.js')),{missions}=require(join(out,'games/missions.js')),j=require(join(out,'games/learning-journey.js'));
process.on('exit',()=>rmSync(out,{recursive:true,force:true}));
class Storage{map=new Map();getItem(k){return this.map.get(k)??null;}setItem(k,v){this.map.set(k,v);}removeItem(k){this.map.delete(k);}}
const legacy={sessionId:'legacy-detektif',activityId:c.detektifBunyi.activityId,countryCode:'MY',curriculumVersion:'KP2027',mode:'beginner',listeningAttempted:8,listeningCorrect:6,speakingPractised:4,adultObserved:1,completedAt:'2026-11-11T00:00:00.000Z'};
const current={...legacy,sessionId:'new-dengar',activityId:c.dengarSebutPilih.activityId,listeningCorrect:5,listeningMissions:[{id:'letters',attempted:3,correct:2},{id:'syllables',attempted:3,correct:2},{id:'utterances',attempted:2,correct:1}]};
test('all 60 required seed items and three explicit supplemental recordings are unique',()=>{
 assert.equal(g.speechItems.length,63);assert.equal(new Set(g.speechItems.map(item=>item.id)).size,63);
 assert.deepEqual(Object.fromEntries(['letter','syllable','word','utterance','intonation','chant'].map(kind=>[kind,g.speechItems.filter(item=>item.kind===kind).length])),{letter:15,syllable:20,word:15,utterance:10,intonation:2,chant:1});
 assert.deepEqual(g.speechItems.filter(item=>item.kind==='letter').map(item=>item.text),['A','B','C','D','E','G','I','K','M','N','O','P','R','S','U']);
 for(const item of g.speechItems){for(const field of ['text','spokenText','path','sourceUrl','sourceRevision','modelLicence','notes'])assert.ok(item[field],item.id+field);assert.ok(item.path.startsWith('/audio/dengar-sebut-pilih/'));assert.ok(item.approval==='approved');}
});
test('four standards remain provisional without altering Detektif mapping',()=>{
 assert.equal(c.dengarSebutPilih.alignmentStatus,'provisional');assert.equal(c.dengarSebutPilih.schoolYear,'Tahun 1');assert.match(c.dengarSebutPilih.schoolType,/SK/);
 assert.deepEqual(c.dengarSebutPilih.learningStandards.map(s=>s.code),['SP 1.1.2','SP 1.1.3','SP 2.1.2','SP 2.1.3']);assert.ok(c.dengarSebutPilih.learningStandards.every(s=>!s.wordingVerified));
 assert.deepEqual(c.detektifBunyi.learningStandards.map(s=>s.code),['SP 1.1.1','SP 2.1.1']);assert.ok(c.curriculumRoutes.includes(c.dengarSebutPilih.route));assert.equal(c.curriculumRoutes.length,8);
 assert.ok(!c.dengarSebutPilih.activityId.includes('2027'));assert.ok(!c.dengarSebutPilih.route.includes('2027'));
});
test('2400 seeded sessions have correct counts, four missions, one correct answer, varying content and fair progression',()=>{
 const covered=new Set();
 for(const mode of ['beginner','intermediate','challenge']){
  const sequences=new Set(),positions=new Set();
  for(let seed=0;seed<800;seed++){
   const questions=g.createSpeechSession(mode,'dengar-'+seed);assert.deepEqual(questions,g.createSpeechSession(mode,'dengar-'+seed));
   assert.equal(questions.length,mode==='beginner'?8:10);assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
   assert.deepEqual(['letters','syllables','utterances'].map(m=>questions.filter(q=>q.mission===m).length),[3,3,mode==='beginner'?2:4]);
   assert.equal(questions.filter(q=>q.mechanic==='rhythm').length,1);assert.equal(questions.filter(q=>q.mechanic==='intonation').length,mode==='beginner'?0:mode==='intermediate'?1:2);
   for(const q of questions){covered.add(q.audioId);assert.ok(g.speechById[q.audioId]);assert.equal(q.choices.length,mode==='beginner'?3:4);assert.equal(new Set(q.choices.map(a=>a.id)).size,q.choices.length);assert.equal(new Set(q.choices.map(a=>a.text)).size,q.choices.length);assert.equal(q.choices.filter(a=>a.id===q.correctId).length,1);positions.add(q.choices.findIndex(a=>a.id===q.correctId));assert.ok(q.explanation.length>25);}
   const speaking=g.speakingPrompts(questions);assert.deepEqual(speaking.map(id=>g.speechById[id].kind),['letter','chant','word','utterance']);
   sequences.add(JSON.stringify(questions.map(q=>[q.id,q.choices])));
  }assert.equal(sequences.size,800);assert.equal(positions.size,mode==='beginner'?3:4);
 }
 // Neutral contrasts are included in the word/utterance bank at beginner level.
 assert.equal(covered.size,63);
});
test('rhythm is an original assembly of six valid local syllable recordings',()=>{
 const chant=g.speechById['chant-ba-bi-bu'];assert.equal(chant.sourceKind,'original-assembly');assert.deepEqual(chant.componentIds,['syllable-ba','syllable-bi','syllable-bu','syllable-ma','syllable-mi','syllable-mu']);
 assert.ok(chant.componentIds.every(id=>g.speechById[id]?.kind==='syllable'));
});
test('legacy and new curriculum records persist, deduplicate and round trip together',()=>{
 const area=new Storage();area.setItem(j.LEARNING_JOURNEY_STORAGE_KEY,'general-game-sentinel');
 assert.ok(p.recordCurriculumSession(legacy,area));const before=p.readCurriculumProgress(area).sessions[0];
 assert.ok(p.recordCurriculumSession(current,area));assert.ok(p.recordCurriculumSession(current,area));
 const saved=p.readCurriculumProgress(area);assert.equal(saved.sessions.length,2);assert.deepEqual(saved.sessions[0],before);
 assert.equal(saved.sessions[1].listeningMissions[1].correct,2);assert.equal(saved.sessions[1].adultObserved,1);
 const recovered=new Storage();p.importCurriculumProgress(JSON.stringify(saved),recovered);assert.deepEqual(p.readCurriculumProgress(recovered),saved);
 p.importCurriculumProgress(JSON.stringify({version:1,sessions:[legacy]}),recovered);assert.equal(p.readCurriculumProgress(recovered).sessions.length,2);
 assert.equal(area.getItem(j.LEARNING_JOURNEY_STORAGE_KEY),'general-game-sentinel');
});
test('mission aggregates are validated atomically; corrupt imports cannot damage old progress',()=>{
 const area=new Storage();p.recordCurriculumSession(legacy,area);const before=area.getItem(p.CURRICULUM_STORAGE_KEY);
 for(const bad of [{...current,listeningCorrect:6},{...current,listeningMissions:[]},{...current,listeningMissions:[null]},{...current,speakingPractised:3},{...current,adultObserved:5},{...current,activityId:'unknown'}])assert.throws(()=>p.importCurriculumProgress(JSON.stringify({version:1,sessions:[bad]}),area));
 for(const bad of ['{','x'.repeat(300000)])assert.throws(()=>p.importCurriculumProgress(bad,area));assert.equal(area.getItem(p.CURRICULUM_STORAGE_KEY),before);
 const personal={...current,name:'must-not-survive',listeningMissions:current.listeningMissions.map(m=>({...m,childName:'must-not-survive'}))};assert.ok(!JSON.stringify(p.parseCurriculumProgress(JSON.stringify({version:1,sessions:[personal]}))).includes('must-not-survive'));
});
test('general registry, Missions and achievements stay independent',()=>{
 assert.equal(gameRegistry.filter(g=>g.status==='available').length, 23);assert.ok(!gameRegistry.some(g=>g.gameId===c.dengarSebutPilih.activityId));assert.equal(missions.length,4);
 assert.ok(missions.every(m=>m.activities.every(a=>a.gameId!==c.dengarSebutPilih.activityId)));
 const empty=j.createEmptyJourney();assert.deepEqual(j.parseLearningJourneyImport(j.exportLearningJourney(empty)),empty);
});
test('Finder adds exactly one truthful curriculum entry and finds relevant Malay search terms',()=>{
 assert.deepEqual(validateResourceCatalogue(resourceCatalogue),[]);assert.equal(resourceCatalogue.length, 75);assert.equal(resourceCatalogue.filter(r=>r.href===c.dengarSebutPilih.route).length,1);
 for(const query of ['Dengar Sebut Pilih','abjad','suku kata','intonasi','ujaran','rentak','KP2027'])assert.ok(searchResources(resourceCatalogue,{query,type:'game',category:'bahasa-melayu',sort:'relevance'}).some(r=>r.href===c.dengarSebutPilih.route),query);
});
test('owner-approved audio passes while absent human review still blocks release',()=>{
 const result=g.speechReleaseGate();assert.equal(result.ready,true);assert.equal(result.pendingAudioIds.length,0);
 for(const change of [{approval:'pending'},{reviewer:null},{reviewedAt:null}])assert.equal(g.speechReleaseGate([{...g.speechItems[0],...change}]).ready,false);
 const source=readFileSync('components/learning/dengar-sebut-pilih-game.tsx','utf8');assert.match(source,/Audio sintetik draf belum/);
 assert.ok(!/speechSynthesis|getUserMedia|MediaRecorder|SpeechRecognition|fetch\(|gtag|trackEvent/.test(source));
 for(const marker of ['player.onerror=fail','player.play().catch(fail)','locked.current','player.pause()','role="status"','preload="none"'])assert.ok(source.includes(marker),marker);
});
test('new route, metadata, printable and keyboard-friendly controls exist',()=>{
 const source=readFileSync('app'+c.dengarSebutPilih.route+'/page.tsx','utf8');assert.match(source,/createEducationalMetadata/);
 const ui=readFileSync('components/learning/dengar-sebut-pilih-game.tsx','utf8');assert.match(ui,/aria-current/);assert.match(ui,/focus-visible:outline/);assert.match(ui,/scroll-mt-24/);assert.match(ui,/min-h-\[48px\]/);
 assert.ok(existsSync('public/downloads/dengar-sebut-pilih-aktiviti.pdf'));
 const text=readFileSync('test/fixtures/curriculum/dengar-printable.txt','utf8').replace(/\s+/g,' ');
 for(const token of ['1-C','2-A','3-B','SP 1.1.2','SP 1.1.3','SP 2.1.2','SP 2.1.3','masih belum selesai'])assert.ok(text.includes(token),token);
});
test('production infrastructure and unrelated progress configuration remain protected',()=>{
 const crypto=require('node:crypto');const protectedFiles=JSON.parse(readFileSync('test/fixtures/curriculum/infrastructure-sha256.json'));
 for(const[file,hash]of Object.entries(protectedFiles))assert.equal(crypto.createHash('sha256').update(readFileSync(file,'utf8').replaceAll('\r\n','\n')).digest('hex'),hash,file);

});
test('every approved audio file exists and decodes as bounded local PCM',()=>{
 for(const item of g.speechItems){
  const wav=readFileSync('public'+item.path);assert.equal(wav.toString('ascii',0,4),'RIFF',item.id);assert.equal(wav.readUInt16LE(22),1);assert.equal(wav.readUInt32LE(24),24000);
  assert.ok(item.duration>0&&item.duration<45,item.id);let peak=0;for(let i=44;i<wav.length;i+=2)peak=Math.max(peak,Math.abs(wav.readInt16LE(i)));assert.ok(peak>100&&peak<9000,item.id);assert.equal(item.approval,'approved');assert.ok(item.reviewer&&item.reviewedAt);
 }assert.match(readFileSync('public/audio/dengar-sebut-pilih/NOTICE.txt','utf8'),/MIT License/);
});
