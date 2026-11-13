// Additive curriculum namespace: never rewrites general-game Journey data.
import { curriculumActivities, detektifBunyi, dengarSebutPilih } from './curriculum';
export const CURRICULUM_STORAGE_KEY = 'zalea-curriculum-progress-v1';
export const CURRICULUM_EVENT = 'zalea-curriculum-progress-changed';
export type CurriculumSession = {
  sessionId: string; activityId: string; countryCode: string; curriculumVersion: string; mode: string;
  listeningAttempted: number; listeningCorrect: number; speakingPractised: number; adultObserved: number;
  completedAt: string;
  listeningMissions?: { id: string; attempted: number; correct: number }[];
};
export type CurriculumProgress = { version: 1; sessions: CurriculumSession[] };
type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const emptyCurriculumProgress = (): CurriculumProgress => ({ version: 1, sessions: [] });
const isCount = (n: unknown, max: number): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n <= max;
function validSession(value: unknown): value is CurriculumSession {
  if (!value || typeof value !== 'object') return false;
  const v = value as CurriculumSession;
  const activity=curriculumActivities.find(item=>item.activityId===v.activityId);
  if(!activity)return false;
  if(v.activityId===dengarSebutPilih.activityId){
    if(!Array.isArray(v.listeningMissions)||v.listeningMissions.length!==3)return false;
    const ids=['letters','syllables','utterances'];
    if(v.listeningMissions.some((mission,index)=>mission?.id!==ids[index]||mission.attempted!==(index<2?3:v.mode==='beginner'?2:4)||!isCount(mission.correct,mission.attempted)))return false;
    if(v.listeningMissions.reduce((sum,mission)=>sum+mission.correct,0)!==v.listeningCorrect)return false;
  }else if(v.activityId===detektifBunyi.activityId&&v.listeningMissions!==undefined)return false;
  return typeof v.sessionId === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(v.sessionId) &&
    v.countryCode === activity.countryCode && v.curriculumVersion === activity.curriculumVersion && ['beginner','intermediate','challenge'].includes(v.mode) &&
    isCount(v.listeningAttempted,10) && v.listeningAttempted === (v.mode === 'beginner' ? 8 : 10) &&
    isCount(v.listeningCorrect,v.listeningAttempted) && v.speakingPractised === 4 &&
    isCount(v.adultObserved,v.speakingPractised) && typeof v.completedAt === 'string' && Number.isFinite(Date.parse(v.completedAt));
}
export function parseCurriculumProgress(text: string): CurriculumProgress {
  if (text.length > 256 * 1024) throw Error('Fail terlalu besar.');
  const raw = JSON.parse(text);
  if (raw?.version !== 1 || !Array.isArray(raw.sessions) || raw.sessions.length > 250 || !raw.sessions.every(validSession)) throw Error('Fail kemajuan kurikulum tidak sah.');
  // Whitelist fields: do not preserve arbitrary imported personal data.
  const sessions: CurriculumSession[] = raw.sessions.map((v: CurriculumSession) => ({
    sessionId:v.sessionId,activityId:v.activityId,countryCode:v.countryCode,curriculumVersion:v.curriculumVersion,mode:v.mode,
    listeningAttempted:v.listeningAttempted,listeningCorrect:v.listeningCorrect,speakingPractised:v.speakingPractised,adultObserved:v.adultObserved,completedAt:new Date(v.completedAt).toISOString(),
    ...(v.listeningMissions?{listeningMissions:v.listeningMissions.map(mission=>({id:mission.id,attempted:mission.attempted,correct:mission.correct}))}:{}),
  }));
  return { version:1, sessions:sessions.filter((v,i) => sessions.findIndex(other=>other.sessionId===v.sessionId)===i) };
}
function storage(target?: StorageLike): StorageLike | null {
  if (target) return target; try { return typeof window !== 'undefined' ? window.localStorage : null; } catch { return null; }
}
export function readCurriculumProgress(target?: StorageLike): CurriculumProgress {
  try { return parseCurriculumProgress(storage(target)?.getItem(CURRICULUM_STORAGE_KEY) ?? '{"version":1,"sessions":[]}'); } catch { return emptyCurriculumProgress(); }
}
function write(value: CurriculumProgress, target?: StorageLike) {
  try {
    const area=storage(target); if(!area)return false; area.setItem(CURRICULUM_STORAGE_KEY,JSON.stringify(value));
    if(typeof window!=='undefined')window.dispatchEvent(new Event(CURRICULUM_EVENT));return true;
  } catch { return false; }
}
export function recordCurriculumSession(session: CurriculumSession,target?: StorageLike) {
  if(!validSession(session))return false;
  const progress=readCurriculumProgress(target);
  if(progress.sessions.some(old=>old.sessionId===session.sessionId))return true;
  return write({version:1,sessions:[...progress.sessions,session].slice(-250)},target);
}
export function importCurriculumProgress(text: string,target?: StorageLike) {
  const incoming=parseCurriculumProgress(text);const current=readCurriculumProgress(target);
  const merged=[...current.sessions,...incoming.sessions].filter((v,i,all)=>all.findIndex(other=>other.sessionId===v.sessionId)===i).slice(-250);
  return write({version:1,sessions:merged},target);
}
export function clearCurriculumProgress(target?: StorageLike) { return write(emptyCurriculumProgress(),target); }
