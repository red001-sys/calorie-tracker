import { useState, useRef } from "react";
import { Globe, User, Mail, Users, Target, Calendar, Ruler, Weight, Flag, ChevronRight, ChevronLeft } from "lucide-react";

type Props = { onComplete: () => void };
type Data = {
  language: string; name: string; email: string; gender: string; goal: string;
  dob_day: string; dob_month: string; dob_year: string;
  height: string; weight: string; target: string;
};

function calcAge(day: number, m: number, y: number): number {
  const t = new Date(); let a = t.getFullYear()-y;
  if(t.getMonth()+1<m||(t.getMonth()+1===m&&t.getDate()<day))a--;
  return a;
}

function calcCal(h: number, w: number, goal: string, age: number, gen: string): number {
  let b=gen==="masculino"?10*w+6.25*h-5*age+5:gen==="feminino"?10*w+6.25*h-5*age-161:10*w+6.25*h-5*age-78;
  const t=b*1.4;
  if(goal==="lose")return Math.round(t-500);
  if(goal==="gain")return Math.round(t+400);
  return Math.round(t);
}

function expandYear(raw: string): number {
  const n = parseInt(raw, 10);
  if(raw.length <= 2) return n <= 24 ? 2000+n : 1900+n;
  return n;
}

const STEPS=[
  {icon:Globe,title:"Idioma",subtitle:"Escolha o idioma do app"},
  {icon:User,title:"Nome",subtitle:"Como podemos te chamar?"},
  {icon:Mail,title:"E-mail",subtitle:"Qual e o seu e-mail?"},
  {icon:Users,title:"Genero",subtitle:"Como voce se identifica?"},
  {icon:Target,title:"Objetivo",subtitle:"Qual e o seu objetivo?"},
  {icon:Calendar,title:"Data de nascimento",subtitle:"Quando voce nasceu?"},
  {icon:Ruler,title:"Altura",subtitle:"Qual e a sua altura?"},
  {icon:Weight,title:"Peso atual",subtitle:"Quanto voce pesa?"},
  {icon:Flag,title:"Peso meta",subtitle:"Qual e o seu peso ideal?"},
];

const LANGS=[
  {v:"pt-br", f:"🇧🇷", l:"Portugues (PT-BR)"},
  {v:"en", f:"🇺🇸", l:"English (EN)"},
  {v:"es", f:"🇪🇸", l:"Espanol (ES)"},
  {v:"fr", f:"🇫🇷", l:"Francais (FR)"},
  {v:"de", f:"🇩🇪", l:"Deutsch (DE)"},
  {v:"it", f:"🇮🇹", l:"Italiano (IT)"},
  {v:"ja", f:"🇯🇵", l:"Japones (JA)"},
  {v:"zh", f:"🇨🇳", l:"Chines (ZH)"},
  {v:"ko", f:"🇰🇷", l:"Coreano (KO)"},
  {v:"ar", f:"🇸🇦", l:"Arabico (AR)"},
];

export default function Onboarding({onComplete}:Props){
  const [step,setStep]=useState(0);
  const [d,setD]=useState<Data>({
    language:"",name:"",email:"",gender:"",goal:"",
    dob_day:"",dob_month:"",dob_year:"",
    height:"",weight:"",target:""
  });

  const refMonth = useRef<HTMLInputElement>(null);
  const refYear  = useRef<HTMLInputElement>(null);

  const ok=():boolean=>{switch(step){
    case 0:return !!d.language;
    case 1:return d.name.trim().length>=2;
    case 2:return d.email.includes("@")&&d.email.includes(".");
    case 3:return !!d.gender;
    case 4:return !!d.goal;
    case 5:{
      const day=+d.dob_day, mon=+d.dob_month, yr=expandYear(d.dob_year);
      if(!d.dob_day||!d.dob_month||!d.dob_year) return false;
      if(day<1||day>31||mon<1||mon>12) return false;
      if(yr<1900||yr>new Date().getFullYear()) return false;
      const age=calcAge(day,mon,yr);
      return age>=13;
    }
    case 6:return +d.height>0;
    case 7:return +d.weight>0;
    case 8:return +d.target>0;
    default:return false;
  }};

  const finish=()=>{
    const h=+d.height, w=+d.weight;
    const day=+d.dob_day, mon=+d.dob_month, yr=expandYear(d.dob_year);
    const age=calcAge(day,mon,yr);
    const dob=yr+"-"+String(mon).padStart(2,"0")+"-"+String(day).padStart(2,"0");
    const cal=calcCal(h,w,d.goal,age,d.gender);

    localStorage.setItem("userName",d.name.trim());
    localStorage.setItem("userEmail",d.email.trim());
    localStorage.setItem("userLanguage",d.language);
    localStorage.setItem("userGender",d.gender);
    localStorage.setItem("userGoal",d.goal);
    localStorage.setItem("userDOB",dob);
    localStorage.setItem("userHeight",String(h));
    localStorage.setItem("userWeight",String(w));
    localStorage.setItem("userTargetWeight",String(+d.target));
    localStorage.setItem("userCalorieGoal",String(cal));
    localStorage.setItem("userProteinGoal",String(Math.round((cal*0.25)/4)));
    localStorage.setItem("userFatGoal",String(Math.round((cal*0.25)/9)));
    localStorage.setItem("userCarbsGoal",String(Math.round((cal*0.50)/4)));

    if("Notification" in window&&Notification.permission==="default"){
      Notification.requestPermission().then(r=>localStorage.setItem("notificationPermission",r));
    }

    onComplete();
  };

  const next=()=>{if(ok()){if(step<STEPS.length-1)setStep(s=>s+1);else finish();}};
  const back=()=>setStep(s=>s-1);
  const handleEnter=(e:React.KeyboardEvent)=>{ if(e.key==="Enter") next(); };

  const opt=(v:string,label:string,sel:string,fn:(x:string)=>void)=>(
    <button key={v} onClick={()=>fn(v)}
      className={"w-full h-14 pl-5 pr-5 rounded-2xl border-2 text-left font-medium transition-all flex items-center "
        +(sel===v?"border-green-500 bg-green-500/15 text-green-400":"border-white/20 bg-white/5 text-white hover:border-white/40")}>
      {label}
    </button>
  );

  const inputCls = "w-full text-center text-xl h-14 rounded-2xl border-2 border-white/20 bg-white/5 text-white placeholder-white/25 focus:outline-none focus:border-green-500 px-4";

  const content=()=>{switch(step){

    case 0:return(
      <div className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden" style={{maxHeight:"48vh",overflowY:"auto"}}>
        {LANGS.map(({v,f,l},i)=>(
          <button key={v} onClick={()=>setD({...d,language:v})}
            className={"w-full h-14 text-left font-medium transition-all flex items-center gap-3 "
              +(d.language===v?"bg-green-500/15 text-green-400":"text-white hover:bg-white/5")
              +(i<LANGS.length-1?" border-b border-white/10":"")}>
            <span style={{paddingLeft:"20px"}} className="text-2xl leading-none shrink-0">{f}</span>
            <span className="flex-1 pl-2">{l}</span>
            {d.language===v&&<span className="text-green-400 font-bold pr-5">✓</span>}
          </button>
        ))}
      </div>
    );

    case 1:return(
      <input type="text" placeholder="Seu nome" value={d.name}
        onChange={e=>setD({...d,name:e.target.value})}
        onKeyDown={handleEnter}
        autoFocus maxLength={60}
        className={inputCls}
      />
    );

    case 2:return(
      <input type="email" placeholder="seu@email.com" value={d.email}
        onChange={e=>setD({...d,email:e.target.value})}
        onKeyDown={handleEnter}
        autoFocus maxLength={120}
        className={inputCls}
      />
    );

    case 5:return(
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm text-white/40 mb-2 block text-center">Dia</label>
          <input
            type="tel" placeholder="DD"
            value={d.dob_day} maxLength={2}
            onKeyDown={handleEnter}
            onChange={e=>{
              const val=e.target.value.replace(/\D/g,"").slice(0,2);
              setD({...d,dob_day:val});
              if(val.length===2) refMonth.current?.focus();
            }}
            className="w-full text-center text-xl h-14 rounded-2xl border-2 border-white/20 bg-white/5 text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex-1">
          <label className="text-sm text-white/40 mb-2 block text-center">Mes</label>
          <input
            ref={refMonth}
            type="tel" placeholder="MM"
            value={d.dob_month} maxLength={2}
            onKeyDown={handleEnter}
            onChange={e=>{
              const val=e.target.value.replace(/\D/g,"").slice(0,2);
              setD({...d,dob_month:val});
              if(val.length===2) refYear.current?.focus();
            }}
            className="w-full text-center text-xl h-14 rounded-2xl border-2 border-white/20 bg-white/5 text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex-[1.5]">
          <label className="text-sm text-white/40 mb-2 block text-center">Ano</label>
          <input
            ref={refYear}
            type="tel" placeholder="AA ou AAAA"
            value={d.dob_year} maxLength={4}
            onKeyDown={handleEnter}
            onChange={e=>{
              const val=e.target.value.replace(/\D/g,"").slice(0,4);
              setD({...d,dob_year:val});
            }}
            className="w-full text-center text-lg h-14 rounded-2xl border-2 border-white/20 bg-white/5 text-white focus:outline-none focus:border-green-500"
          />
        </div>
      </div>
    );

    default:return null;
  }};

  const SI=STEPS[step].icon;

  return(
    <div className="min-h-screen bg-black text-white flex flex-col">

      <div className="px-4 pt-5 pb-2 shrink-0">
        <div className="flex gap-1.5">
          {STEPS.map((_,i)=>(
            <div key={i} className={"h-1.5 flex-1 rounded-full "+(i<=step?"bg-green-500":"bg-white/20")}/>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 pt-10 pb-6">

        <div className="flex flex-col items-center text-center mb-8 shrink-0">
          <div className="w-16 h-16 bg-green-900/70 rounded-2xl flex items-center justify-center mb-5">
            <SI className="w-8 h-8 text-green-500"/>
          </div>
          <h1 className="text-2xl font-bold">{STEPS[step].title}</h1>
          <p className="text-white/40 mt-2 text-base">{STEPS[step].subtitle}</p>
        </div>

        <div className="shrink-0 mb-6">
          {content()}
        </div>

        <div className="flex-1"/>

        <div className="flex gap-3 pt-8 shrink-0">
          {step>0&&(
            <button onClick={back}
              className="flex-1 h-14 rounded-2xl border-2 border-white/25 bg-transparent text-white font-semibold flex items-center justify-center gap-1 active:bg-white/10 transition-colors">
              <ChevronLeft className="w-4 h-4"/> Voltar
            </button>
          )}
          <button onClick={next} disabled={!ok()}
            className={"flex-1 h-14 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all "
              +(ok()
                ?"bg-green-500 text-black active:bg-green-400 shadow-lg shadow-green-500/20"
                :"bg-white/10 text-white/25 cursor-not-allowed")}>
            {step===STEPS.length-1?"Concluir":"Proximo"}
            {step<STEPS.length-1&&<ChevronRight className="w-4 h-4"/>}
          </button>
        </div>

      </div>
    </div>
  );
}
