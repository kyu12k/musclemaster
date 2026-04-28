import { useStore } from "../store/useStore";
import { muscles } from "../data/muscles";

const PROGRESS_OPACITY = { unseen: 0.32, learning: 0.7, done: 0.85 };
const PROGRESS_COLOR   = { unseen: null, learning: "#f59e0b", done: "#10b981" };

// Anatomically-approximate SVG paths on a 400×700 viewBox
// front-body center = x:200, back-body center = x:200
const MUSCLE_PATHS = {
  // ── FRONT ────────────────────────────────────────────────
  abdomen_center: "M185,270 L185,355 Q190,362 200,362 Q210,362 215,355 L215,270 Q210,265 200,265 Q190,265 185,270 Z",
  abdomen_deep:   "M180,278 L180,350 Q190,358 200,358 Q210,358 220,350 L220,278 Q210,272 200,272 Q190,272 180,278 Z",
  abdomen_lateral:"M148,255 Q138,270 140,310 Q143,330 158,335 L180,275 Q165,255 148,255 Z M220,275 L242,335 Q257,330 260,310 Q262,270 252,255 Q235,255 220,275 Z",
  hip_deep:       "M178,355 Q165,358 160,375 Q158,392 168,405 Q178,412 190,408 L195,360 Q187,355 178,355 Z M205,360 L210,408 Q222,412 232,405 Q242,392 240,375 Q235,358 222,355 Q213,355 205,360 Z",
  inner_thigh:    "M168,405 Q155,420 155,455 Q157,480 168,492 Q178,498 185,490 L190,408 Q178,412 168,405 Z M210,408 L215,490 Q222,498 232,492 Q243,480 245,455 Q245,420 232,405 Q222,412 210,408 Z",
  ribcage_lateral:"M145,195 Q132,210 133,245 Q136,262 150,268 L168,235 Q163,205 145,195 Z M255,195 Q268,205 232,235 L250,268 Q264,262 267,245 Q268,210 255,195 Z",
  // ── BACK ─────────────────────────────────────────────────
  glutes:         "M152,358 Q138,370 138,400 Q140,422 158,432 Q175,438 190,428 L195,365 Q173,355 152,358 Z M205,365 L210,428 Q225,438 242,432 Q260,422 262,400 Q262,370 248,358 Q227,355 205,365 Z",
  glutes_lateral: "M140,355 Q130,365 132,390 Q135,408 150,415 Q162,418 172,410 L175,362 Q157,352 140,355 Z M225,362 L228,410 Q238,418 250,415 Q265,408 268,390 Q270,365 260,355 Q243,352 225,362 Z",
  upper_back_center:"M182,195 Q178,210 180,240 Q183,255 192,258 L208,258 Q217,255 220,240 Q222,210 218,195 Q210,190 200,190 Q190,190 182,195 Z",
  upper_back_lower: "M175,250 Q168,265 170,295 Q174,312 188,316 L212,316 Q226,312 230,295 Q232,265 225,250 Q213,244 200,244 Q187,244 175,250 Z",
  spine_deep:     "M193,195 Q189,230 189,310 Q190,348 193,368 L207,368 Q210,348 211,310 Q211,230 207,195 Q203,192 200,192 Q197,192 193,195 Z",
  spine_paravertebral:"M180,190 Q174,230 174,310 Q175,352 179,372 L190,372 Q188,348 188,310 Q188,230 192,190 Z M208,190 L212,310 Q212,348 210,372 L221,372 Q225,352 226,310 Q226,230 220,190 Z",
  lumbar_lateral: "M162,318 Q152,328 154,348 Q157,362 170,366 L188,342 Q180,322 162,318 Z M212,342 L230,366 Q243,362 246,348 Q248,328 238,318 Q220,322 212,342 Z",
  posterior_thigh:"M158,432 Q148,450 150,490 Q153,518 165,528 Q176,534 183,524 L188,428 Q175,438 158,432 Z M212,428 L217,524 Q224,534 235,528 Q247,518 250,490 Q252,450 242,432 Q225,438 212,428 Z",
};

export default function BodyMap({ side }) {
  const { selectMuscle, getProgress } = useStore();
  const visibleMuscles = muscles.filter((m) => m.side === side);

  return (
    <div className="relative w-full flex justify-center">
      <svg
        viewBox="0 0 400 700"
        className="w-full max-w-[280px]"
        style={{ filter: "drop-shadow(0 0 24px rgba(168,85,247,0.15))" }}
      >
        {side === "front" ? <FrontBody /> : <BackBody />}

        {visibleMuscles.map((m) => {
          const d = MUSCLE_PATHS[m.svgRegion];
          if (!d) return null;
          const prog = getProgress(m.id);
          const fill = PROGRESS_COLOR[prog] ?? m.color;
          const opacity = PROGRESS_OPACITY[prog];

          return (
            <g key={m.id} onClick={() => selectMuscle(m.id)} className="cursor-pointer">
              <path
                d={d}
                fill={fill}
                fillOpacity={opacity}
                stroke={fill}
                strokeWidth={1}
                strokeOpacity={0.6}
                className="transition-all duration-200 hover:fill-opacity-90"
              />
              <title>{m.name}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FrontBody() {
  return (
    <g fill="#1e1e2e" stroke="#4a4a6a" strokeWidth="1.5">
      <ellipse cx="200" cy="60" rx="35" ry="45" />
      <rect x="185" y="100" width="30" height="30" rx="5" />
      <path d="M140,130 Q120,160 125,280 Q135,300 165,310 L200,315 L235,310 Q265,300 275,280 Q280,160 260,130 Z" />
      <path d="M140,135 Q110,145 100,200 Q95,240 105,290 Q112,310 122,305 Q130,280 128,240 Q130,195 145,165 Z" />
      <path d="M260,135 Q290,145 300,200 Q305,240 295,290 Q288,310 278,305 Q270,280 272,240 Q270,195 255,165 Z" />
      <ellipse cx="200" cy="330" rx="55" ry="28" />
      <path d="M148,345 Q135,380 138,450 Q140,490 155,510 Q168,515 175,505 Q178,465 172,420 Q168,380 168,345 Z" />
      <path d="M252,345 Q265,380 262,450 Q260,490 245,510 Q232,515 225,505 Q222,465 228,420 Q232,380 232,345 Z" />
      <path d="M155,510 Q148,540 150,590 Q152,620 162,630 Q172,632 176,620 Q178,590 175,555 Q175,525 175,505 Z" />
      <path d="M245,510 Q252,540 250,590 Q248,620 238,630 Q228,632 224,620 Q222,590 225,555 Q225,525 225,505 Z" />
      <ellipse cx="160" cy="638" rx="22" ry="10" />
      <ellipse cx="240" cy="638" rx="22" ry="10" />
    </g>
  );
}

function BackBody() {
  return (
    <g fill="#1e1e2e" stroke="#4a4a6a" strokeWidth="1.5">
      <ellipse cx="200" cy="60" rx="35" ry="45" />
      <rect x="185" y="100" width="30" height="30" rx="5" />
      <path d="M140,130 Q118,160 122,280 Q132,302 165,312 L200,317 L235,312 Q268,302 278,280 Q282,160 260,130 Z" />
      <path d="M140,135 Q110,145 98,202 Q93,242 103,292 Q110,312 120,307 Q128,282 126,242 Q128,197 143,167 Z" />
      <path d="M260,135 Q290,145 302,202 Q307,242 297,292 Q290,312 280,307 Q272,282 274,242 Q272,197 257,167 Z" />
      <ellipse cx="200" cy="330" rx="57" ry="30" />
      <path d="M147,347 Q134,382 137,452 Q139,492 154,512 Q167,517 174,507 Q177,467 171,422 Q167,382 167,347 Z" />
      <path d="M253,347 Q266,382 263,452 Q261,492 246,512 Q233,517 226,507 Q223,467 229,422 Q233,382 233,347 Z" />
      <path d="M154,512 Q147,542 149,592 Q151,622 161,632 Q171,634 175,622 Q177,592 174,557 Q174,527 174,507 Z" />
      <path d="M246,512 Q253,542 251,592 Q249,622 239,632 Q229,634 225,622 Q223,592 226,557 Q226,527 226,507 Z" />
      <ellipse cx="160" cy="638" rx="22" ry="10" />
      <ellipse cx="240" cy="638" rx="22" ry="10" />
    </g>
  );
}
