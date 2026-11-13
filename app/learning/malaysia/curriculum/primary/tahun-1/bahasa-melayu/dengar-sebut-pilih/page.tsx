import { DengarSebutPilihPage } from '@/components/learning/dengar-sebut-pilih-page';
import { createEducationalMetadata } from '@/lib/seo';
import { dengarSebutPilih } from '@/lib/learning/curriculum';
export const metadata=createEducationalMetadata({title:'Dengar, Sebut dan Pilih | Bahasa Melayu Tahun 1 (SK) | Zalea Studio',description:'Latihan mendengar nama huruf, suku kata, perkataan dan ujaran, dengan rentak asal dan latihan sebutan semula. Penjajaran KP2027 sementara; latihan mendengar dan bertutur berasingan.',path:dengarSebutPilih.route,image:null});
export default function Page(){return <DengarSebutPilihPage />;}
