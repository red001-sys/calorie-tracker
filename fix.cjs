const fs = require("fs");

const file = "./src/pages/Onboarding.tsx";
let code = fs.readFileSync(file, "utf8");

const start = code.indexOf("case 0:");
const end = code.indexOf("case 1:");

if (start === -1 || end === -1) {
  console.log("❌ Não encontrou os cases");
  process.exit(1);
}

const before = code.slice(0, start);
const after = code.slice(end);

const newCase = `
case 0:
return (
  <div className="px-1">
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 space-y-3">
      {LANGS.map(({ v, f, l }) => (
        <button
          key={v}
          onClick={() => setD({ ...d, language: v })}
          className={
            "w-full flex items-center gap-4 px-4 h-14 rounded-xl border transition-all text-base font-medium " +
            (d.language === v
              ? "border-green-500 bg-green-500/10 text-green-400"
              : "border-white/10 bg-transparent text-white")
          }
        >
          <span className="text-lg">{getFlagEmoji(f)}</span>
          <span className="flex-1 text-left">{l}</span>
        </button>
      ))}
    </div>
  </div>
);
`;

const final = before + newCase + after;

fs.writeFileSync(file, final);

console.log("✅ STEP 0 atualizado corretamente");
