import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const approval=JSON.parse(await fs.readFile('lib/learning/audio-approval.json','utf8'));
assert.equal(approval.approvedAudio.length,73);assert.ok(approval.reviewer&&approval.reviewedAt&&approval.declaration);
const keys=new Set();
for(const[game,file]of [['detektif-bunyi','lib/learning/sounds.json'],['dengar-sebut-pilih','lib/learning/dengar-sebut-pilih-audio.json']]){
 const clips=JSON.parse(await fs.readFile(file,'utf8'));
 for(const clip of clips){const key=game+':'+clip.id;assert.ok(!keys.has(key));keys.add(key);assert.equal(clip.approval,'approved',key);assert.equal(clip.reviewer,approval.reviewer,key);assert.equal(clip.reviewedAt,approval.reviewedAt,key);const record=approval.approvedAudio.find(r=>r.game===game&&r.id===clip.id);assert.ok(record,key);assert.equal(record.path,clip.path,key);assert.equal(crypto.createHash('sha256').update(await fs.readFile('public'+clip.path)).digest('hex'),record.sha256,key+' changed since owner approval');}
}assert.equal(keys.size,73);console.log('Curriculum release gate: 73 owner-approved recordings; all hashes match the reviewed files.');
