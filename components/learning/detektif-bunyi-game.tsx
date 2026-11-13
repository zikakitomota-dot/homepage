'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createSoundSession, difficulties, difficultyLabels, scoreListening, soundById, sounds, type SoundDifficulty } from '@/lib/learning/detektif-bunyi';
import { bahasaMelayuPath, detektifBunyi } from '@/lib/learning/curriculum';
import { recordCurriculumSession } from '@/lib/learning/progress';
import { CurriculumProgressPanel } from './progress-panel';
import { SoundPicture } from './sound-picture';

type Stage = 'welcome' | 'listening' | 'speaking' | 'results' | 'visual';
type AudioState = 'idle' | 'loading' | 'playing' | 'done' | 'error';
export function DetektifBunyiGame() {
  const [mode,setMode]=useState<SoundDifficulty>('beginner');
  const [stage,setStage]=useState<Stage>('welcome');
  const [questions,setQuestions]=useState<ReturnType<typeof createSoundSession>>([]);
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<boolean[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [speaking,setSpeaking]=useState<string[]>([]);
  const [spoken,setSpoken]=useState(0);
  const [observed,setObserved]=useState(0);
  const [adult,setAdult]=useState(false);
  const [audioState,setAudioState]=useState<AudioState>('idle');
  const [heard,setHeard]=useState(false);
  const [saved,setSaved]=useState<boolean|null>(null);
  const [volume,setVolume]=useState(0.65);
  const player=useRef<HTMLAudioElement|null>(null);
  const token=useRef(0); const session=useRef(''); const locked=useRef(false); const spokenLock=useRef(false);
  const heading=useRef<HTMLHeadingElement>(null); const firstRender=useRef(true);
  const question=questions[index];
  const cancel=() => { token.current++; const audio=player.current; if(audio){audio.pause();audio.removeAttribute('src');audio.load();} player.current=null; };
  useEffect(()=>()=>{token.current++;player.current?.pause();},[]);
  useEffect(()=>{
    if(firstRender.current){firstRender.current=false;return;}
    heading.current?.focus();
  },[stage,index,spoken]);
  useEffect(()=>{
    if(stage!=='results')return;
    const score=scoreListening(answers);
    setSaved(recordCurriculumSession({sessionId:session.current,activityId:detektifBunyi.activityId,countryCode:detektifBunyi.countryCode,curriculumVersion:detektifBunyi.curriculumVersion,mode,
      listeningAttempted:score.attempted,listeningCorrect:score.correct,speakingPractised:spoken,adultObserved:observed,completedAt:new Date().toISOString()}));
  },[stage,answers,mode,spoken,observed]);
  const resetPlayback=()=>{cancel();setAudioState('idle');setHeard(false);};
  const start=()=>{
    resetPlayback();session.current=crypto.randomUUID();
    const generated=createSoundSession(mode,session.current);
    setQuestions(generated);setSpeaking(generated.filter(q=>q.kind==='single').slice(0,4).map(q=>q.correctId));
    setAnswers([]);setIndex(0);setSelected(null);setSpoken(0);setObserved(0);setAdult(false);setSaved(null);
    locked.current=false;spokenLock.current=false;setStage('listening');
  };
  const play=(ids:string[])=>{
    cancel(); const playToken=token.current;setAudioState('loading');setHeard(false);
    const audio=new Audio();audio.volume=volume;player.current=audio; let position=0;
    const fail=()=>{if(token.current===playToken){setAudioState('error');setHeard(false);audio.pause();}};
    const next=()=>{
      if(token.current!==playToken)return;
      const sound=soundById[ids[position]];
      if(!sound){fail();return;}
      audio.onplaying=()=>{if(token.current===playToken)setAudioState('playing');};
      audio.onerror=fail;
      audio.onended=()=>{if(token.current!==playToken)return;position++;if(position<ids.length)next();else{setAudioState('done');setHeard(true);}};
      audio.src=sound.path;
      audio.play().catch(fail);
    };next();
  };
  const answer=(id:string)=>{
    if(!heard||locked.current||selected!==null||!question)return;
    locked.current=true;cancel();setAudioState('done');setSelected(id);setAnswers(old=>[...old,id===question.correctId]);
  };
  const nextQuestion=()=>{
    resetPlayback();setSelected(null);locked.current=false;
    if(index+1<questions.length)setIndex(old=>old+1);else setStage('speaking');
  };
  const practise=()=>{
    if(!heard||spokenLock.current)return;
    spokenLock.current=true;resetPlayback();const count=spoken+1;setSpoken(count);setObserved(old=>old+(adult?1:0));setAdult(false);
    if(count===speaking.length)setStage('results');else spokenLock.current=false;
  };
  const leave=()=>{resetPlayback();setStage('welcome');};
  const sound=stage==='speaking'?soundById[speaking[spoken]]:null;
  const score=scoreListening(answers);
  const busy=audioState==='playing'||audioState==='loading';
  const playback=(ids:string[])=><div className="space-y-3">
    <div className="flex flex-wrap items-center gap-3"><Button type="button" size="lg" onClick={()=>play(ids)} disabled={busy} className="min-h-[48px] whitespace-normal">{busy?'Sedang dimainkan…':audioState==='idle'?'▶ Dengar bunyi':'↻ Dengar semula'}</Button>{busy&&<Button variant="outline" onClick={()=>{cancel();setAudioState('idle');setHeard(false);}}>Hentikan bunyi</Button>}</div>
    <p role="status" className={'text-sm '+(audioState==='error'?'font-semibold text-red-800':'text-slate-600')}>{audioState==='loading'?'Memuatkan audio…':audioState==='playing'?'Sedang memainkan bunyi. Dengar hingga selesai.':audioState==='done'?'Audio selesai. Kamu boleh mendengar semula.':audioState==='error'?'Audio tidak dapat dimainkan. Semak sambungan dan tekan Dengar semula. Tiada jawapan direkodkan.':'Tekan Dengar bunyi apabila kamu bersedia.'}</p>
  </div>;
  return <div lang="ms" className="mx-auto max-w-4xl space-y-7">
    <section className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-8" aria-label="Permainan Detektif Bunyi">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-5"><span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-950">⌕ Kelab Detektif Bunyi</span><label className="flex items-center gap-2 text-sm">Kelantangan<input aria-label="Kelantangan audio" type="range" min="0.1" max="1" step="0.05" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);if(player.current)player.current.volume=v;}} className="h-11 w-24 accent-blue-700" /></label></div>
      {stage==='welcome'&&<><h2 tabIndex={-1} ref={heading} className="text-3xl font-bold">Selamat datang, Detektif Bunyi!</h2><p className="mt-4 text-lg leading-8">Pasang telinga. Cari sumber bunyi. Kemudian, cuba tiru bunyi itu!</p>
        <ol className="my-6 grid list-inside list-decimal gap-3 rounded-2xl bg-blue-50 p-5 sm:grid-cols-3"><li>Dengar hingga selesai.</li><li>Pilih satu gambar.</li><li>Cuba tiru empat bunyi.</li></ol>
        <fieldset><legend className="mb-3 font-bold">Pilih tahap permainan</legend><div className="grid gap-3 sm:grid-cols-3">{difficulties.map(level=><label key={level} className={'cursor-pointer rounded-2xl border-2 p-4 '+(mode===level?'border-blue-700 bg-blue-50':'border-slate-200')}><input type="radio" name="sound-difficulty" checked={mode===level} onChange={()=>setMode(level)} className="mr-2 accent-blue-700" /><strong>{difficultyLabels[level]}</strong><span className="mt-2 block text-sm leading-6">{level==='beginner'?'8 bunyi biasa, 3 pilihan bergambar.':level==='intermediate'?'10 bunyi, termasuk tekstur alam yang hampir serupa.': '6 bunyi tunggal dan 4 urutan dua bunyi. Dengar susunannya.'}</span></label>)}</div></fieldset>
        <p className="mt-4 text-sm leading-6 text-slate-600">Tiada pemasa. Ulang audio sebanyak yang kamu mahu. Mulakan dengan kelantangan yang selesa. Tahap ini bukan gred KPM.</p><Button size="lg" className="mt-6 min-h-[48px]" onClick={start}>Mulakan misi mendengar →</Button>
        <div className="mt-6 border-t pt-5"><button type="button" className="min-h-[44px] text-left font-semibold text-blue-800 underline" onClick={()=>setStage('visual')}>Aktiviti alternatif tanpa audio: teroka kad gambar</button><p className="text-sm text-slate-600">Padanan visual sahaja. Aktiviti ini tidak dinilai sebagai kemahiran mendengar.</p></div></>}
      {stage==='listening'&&question&&<><p className="text-sm font-bold uppercase tracking-wide text-blue-800">Misi 1 · Mendengar · {difficultyLabels[mode]}</p><p className="mt-2 text-sm">Soalan {index+1} daripada {questions.length}</p><progress className="mt-3 h-3 w-full accent-blue-700" max={questions.length+4} value={index} aria-label="Kemajuan misi" /><h2 tabIndex={-1} ref={heading} className="my-6 text-2xl font-bold">{question.prompt}</h2>{playback(question.soundIds)}
        <fieldset className="mt-6" disabled={!heard||selected!==null}><legend className="mb-3 font-semibold">Pilih sumber bunyi{question.kind==='sequence'?' mengikut urutan yang diminta':''}.</legend><div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">{question.choices.map(id=><button key={id} type="button" aria-pressed={selected===id} onClick={()=>answer(id)} className={'flex min-h-[100px] items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 disabled:opacity-70 '+(selected===id?'border-blue-700 bg-blue-50':'border-slate-200 hover:border-blue-500')}><SoundPicture id={id} /><span>{soundById[id].label}</span></button>)}</div></fieldset>
        {selected!==null&&<div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5"><p role="status" className="leading-7"><strong>{selected===question.correctId?'Bagus!':'Terima kasih kerana mencuba.'}</strong> {question.explanation}</p><Button onClick={nextQuestion} className="mt-4">{index+1===questions.length?'Teruskan ke misi bertutur':'Soalan seterusnya'} →</Button></div>}
        <button className="mt-6 min-h-[44px] text-sm text-slate-700 underline" onClick={leave}>Kembali ke pilihan misi</button></>}
      {stage==='speaking'&&sound&&<><p className="text-sm font-bold uppercase tracking-wide text-blue-800">Misi 2 · Bertutur · {spoken+1} daripada {speaking.length}</p><progress className="mt-3 h-3 w-full accent-blue-700" max={questions.length+4} value={questions.length+spoken} aria-label="Kemajuan misi" /><h2 tabIndex={-1} ref={heading} className="my-6 text-2xl font-bold">Dengar dan tiru bunyi ini.</h2><div className="mb-5 flex items-center gap-4"><SoundPicture id={sound.id} /><strong className="text-xl">{sound.name}</strong></div>{playback([sound.id])}<p className="my-5 leading-7">Sekarang, cuba tiru bunyi itu dengan suara yang selesa. Tidak perlu kuat. Sebutan kamu tidak dirakam atau dinilai oleh laman ini.</p><p className="text-sm font-semibold">Status: Belum dicuba</p><label className="mt-4 flex min-h-[48px] items-start gap-3 rounded-xl border p-4"><input type="checkbox" checked={adult} onChange={e=>setAdult(e.target.checked)} className="mt-1 h-5 w-5" /><span><strong>Pilihan untuk pendamping:</strong> Saya telah memerhati latihan ini.<span className="mt-1 block text-sm">Disahkan oleh pendamping ialah catatan latihan, bukan pensijilan sebutan.</span></span></label><Button size="lg" className="mt-5 min-h-[48px]" onClick={practise} disabled={!heard}>Saya sudah berlatih →</Button></>}
      {stage==='results'&&<><p className="text-sm font-bold text-blue-800">Lencana misi · Latihan selesai</p><h2 tabIndex={-1} ref={heading} className="mt-3 text-3xl font-bold">Hebat! Misi selesai!</h2><div className="my-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border bg-blue-50 p-5"><h3 className="text-xl font-bold">Mendengar</h3><p className="mt-3 text-3xl font-extrabold">{score.correct} / {score.attempted}</p><p className="mt-2">{score.percentage}% jawapan betul · {score.incorrect} belum tepat</p><p className="mt-3 text-sm leading-6">Semua {score.attempted} soalan telah dijawab. Skor ini untuk misi ini sahaja.</p></div><div className="rounded-2xl border bg-amber-50 p-5"><h3 className="text-xl font-bold">Bertutur</h3><p className="mt-3 text-3xl font-extrabold">{spoken} sudah berlatih</p><p className="mt-2">{observed} disahkan oleh pendamping</p><p className="mt-3 text-sm leading-6">Catatan latihan sahaja. Ketepatan sebutan tidak dinilai secara automatik.</p></div></div><p className="leading-7">Keputusan ini bukan Tahap Penguasaan rasmi atau bukti penguasaan keseluruhan Bahasa Melayu.</p><p role="status" className="mt-3 text-sm">{saved===null?'Menyimpan kemajuan…':saved?'Kemajuan disimpan pada pelayar ini sahaja.':'Kemajuan tidak dapat disimpan. Kamu masih boleh bermain.'}</p><div className="mt-6 flex flex-wrap gap-3"><Button onClick={start}>Misi baharu</Button><Button variant="outline" onClick={leave}>Tukar tahap</Button><Button variant="outline" asChild><Link href={bahasaMelayuPath}>Kembali ke Bahasa Melayu</Link></Button></div></>}
      {stage==='visual'&&<><h2 ref={heading} tabIndex={-1} className="text-2xl font-bold">Teroka kad gambar</h2><p className="my-4 leading-7">Namakan gambar dan bincangkan bunyi yang mungkin dihasilkannya bersama pendamping. Ini aktiviti visual tanpa skor mendengar; tiada kemajuan misi direkodkan.</p><div className="grid gap-3 min-[360px]:grid-cols-2">{sounds.map(item=><div className="flex items-center gap-3 rounded-xl border p-4" key={item.id}><SoundPicture id={item.id} /><span>{item.name}</span></div>)}</div><Button variant="outline" className="mt-6" onClick={leave}>Kembali</Button></>}
    </section><CurriculumProgressPanel />
  </div>;
}
