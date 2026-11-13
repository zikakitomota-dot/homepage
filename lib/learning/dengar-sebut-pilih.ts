import data from './dengar-sebut-pilih-audio.json';
import { seededRandom, shuffled, type SoundDifficulty } from './detektif-bunyi';
export type SpeechKind='letter'|'syllable'|'word'|'utterance'|'intonation'|'chant';
export type SpeechItem={id:string;kind:SpeechKind;text:string;spokenText:string;path:string;duration:number;format:string;sourceKind:string;sourceUrl:string;sourceRevision:string;modelLicence:string;licenceNotice:string;voice:string;approval:'pending'|'approved'|'rejected';reviewer:string|null;reviewedAt:string|null;notes:string;intent?:string;contrastId?:string;componentIds?:string[]};
export const speechItems=data as SpeechItem[];
export const speechById=Object.fromEntries(speechItems.map(item=>[item.id,item])) as Record<string,SpeechItem>;
export type SpeechMission='letters'|'syllables'|'utterances';
export const missionLabels:Record<SpeechMission,string>={letters:'Dengar Abjad',syllables:'Dengar Suku Kata',utterances:'Dengar Perkataan dan Ujaran'};
export type SpeechChoice={id:string;text:string};
export type SpeechQuestion={id:string;mission:SpeechMission;audioId:string;prompt:string;choices:SpeechChoice[];correctId:string;explanation:string;mechanic:'identify'|'rhythm'|'intonation'};
const pool=(kind:SpeechKind)=>speechItems.filter(item=>item.kind===kind);
function choose(item:SpeechItem,mission:SpeechMission,mode:SoundDifficulty,random:()=>number,mechanic:SpeechQuestion['mechanic']='identify'):SpeechQuestion{
 let alternatives=pool(item.kind).filter(other=>other.id!==item.id);
 if(item.kind==='letter'){
  const close=['B','C','D','E','G','I','P'];
  alternatives=mode==='beginner'?shuffled(alternatives.filter(other=>!close.includes(item.text)||!close.includes(other.text)),random):shuffled(alternatives,random).sort((a,b)=>Number(close.includes(b.text)===close.includes(item.text))-Number(close.includes(a.text)===close.includes(item.text)));
 }else if(item.kind==='syllable'){
  alternatives=shuffled(alternatives,random);
  if(mode!=='beginner')alternatives.sort((a,b)=>Number(b.text[0]===item.text[0]||b.text[1]===item.text[1])-Number(a.text[0]===item.text[0]||a.text[1]===item.text[1]));
 }else alternatives=shuffled(alternatives,random);
 const choices=shuffled([item,...alternatives.slice(0,mode==='beginner'?2:3)],random).map(choice=>({id:choice.id,text:choice.text}));
 return {id:mission+':'+item.id,mission,audioId:item.id,choices,correctId:item.id,mechanic,
  prompt:mission==='letters'?'Dengar nama huruf. Pilih huruf yang disebut.':mission==='syllables'?'Dengar suku kata. Pilih tulisan yang sepadan.':'Dengar hingga selesai. Pilih perkataan atau ujaran yang disebut.',
  explanation:mission==='letters'?'Nama huruf yang didengar ialah '+item.text+'. Nama huruf berbeza daripada bunyi huruf dalam perkataan.':'Audio menyebut “'+item.text+'”. Dengarkan semula jika mahu.'};
}
export function createSpeechSession(mode:SoundDifficulty,seed:string):SpeechQuestion[]{
 const random=seededRandom(seed),count=mode==='beginner'?3:4;
 const letters=shuffled(pool('letter'),random).slice(0,3).map(item=>choose(item,'letters',mode,random));
 const syllables=shuffled(pool('syllable'),random).slice(0,2).map(item=>choose(item,'syllables',mode,random));
 const chant:SpeechQuestion={id:'syllables:chant',mission:'syllables',audioId:'chant-ba-bi-bu',prompt:'Dengar rentak asal. Pilih urutan suku kata yang disebut.',mechanic:'rhythm',correctId:'ba-bi-bu-ma-mi-mu',
  choices:shuffled([{id:'ba-bi-bu-ma-mi-mu',text:'ba, bi, bu; ma, mi, mu'},{id:'bu-bi-ba-mu-mi-ma',text:'bu, bi, ba; mu, mi, ma'},{id:'ma-mi-mu-ba-bi-bu',text:'ma, mi, mu; ba, bi, bu'},...(count===4?[{id:'ba-bu-bi-ma-mu-mi',text:'ba, bu, bi; ma, mu, mi'}]:[])],random),
  explanation:'Rentaknya ialah ba, bi, bu; kemudian ma, mi, mu. Ini suku kata, bukan nama huruf.'};
 const words=shuffled(pool('word'),random);
 const utterances=shuffled(pool('utterance').filter(item=>mode==='beginner'||!['utterance-buku-biru','utterance-ini-buku-saya'].includes(item.id)),random);
 const third=[choose(words[0],'utterances',mode,random),choose(utterances[0],'utterances',mode,random)];
 if(mode!=='beginner'){
  if(mode==='intermediate')third.push(choose(words[1],'utterances',mode,random));
  const comparisons=shuffled(pool('intonation'),random).slice(0,mode==='challenge'?2:1);
  for(const comparison of comparisons){
   const neutral=speechById[comparison.contrastId!];
   const item=random()<0.5?neutral:comparison;
   const neutralText=neutral.text[0].toUpperCase()+neutral.text.slice(1)+(neutral.text.endsWith('.')?'':'.');
   third.push({id:'intonation:'+item.id,mission:'utterances',audioId:item.id,prompt:'Dengar intonasi. Pilih tulisan dan tanda baca yang sepadan.',mechanic:'intonation',correctId:item.id,
    choices:shuffled([{id:comparison.id,text:comparison.text},{id:neutral.id,text:neutralText},{id:'other-question',text:'Di mana ibu?'},{id:'other-statement',text:'Sila duduk.'}],random),
    explanation:'Dalam model ini, “'+(item.id===comparison.id?comparison.text:neutralText)+'” '+(item.id===comparison.id?'meminta kepastian.':'memberi maklumat.')+' Perkataan yang sama boleh digunakan dengan intonasi yang berbeza. Pendamping boleh membincangkan konteks; sebutan murid tidak dinilai secara automatik.'});
  }
 }
 return [...letters,...syllables,chant,...third];
}
export function speakingPrompts(questions:readonly SpeechQuestion[]):string[]{
 return [questions.find(q=>q.mission==='letters')!.audioId,'chant-ba-bi-bu',questions.find(q=>speechById[q.audioId].kind==='word')!.audioId,questions.find(q=>speechById[q.audioId].kind==='utterance')!.audioId];
}
export function speechReleaseGate(items:readonly SpeechItem[]=speechItems){
 const pending=items.filter(item=>item.approval!=='approved'||!item.reviewer||!item.reviewedAt);
 return {ready:pending.length===0,pendingAudioIds:pending.map(item=>item.id)};
}
