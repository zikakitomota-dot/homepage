import { soundById } from '@/lib/learning/detektif-bunyi';
import Image from 'next/image';
export function SoundPicture({id}:{id:string}) { return <Image src={'/images/learning/sounds/'+soundById[id].icon+'.svg'} alt="" width={64} height={64} className="h-16 w-16 shrink-0" unoptimized aria-hidden="true" />; }
