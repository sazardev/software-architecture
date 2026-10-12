import type { Messages } from '@/lib/i18n/messages';

import { ArrowDefs, Box, Decision, Edge, Tag } from './DiagramParts';

type AgentSystemDiagramProps = Readonly<{
  labels: Messages['home']['cta']['diagram'];
}>;

const STEP_X = [266, 342, 418] as const;

/**
Plano de un sistema de agentes en producción: entrada, orquestación, decisiones de riesgo,
herramientas, validación con evals y bucle de reintento, todo bajo observabilidad.
Coordenadas en un viewBox fijo de 1200×610; el contenedor decide el scroll en móvil.
*/
export function AgentSystemDiagram({ labels }: AgentSystemDiagramProps) {
  const { gate, observability, orchestrator, verify } = labels;

  return (
    <svg
      aria-label={labels.aria}
      className="h-auto w-full min-w-[860px]"
      role="img"
      viewBox="0 0 1200 610"
    >
      <ArrowDefs />

      {/* Telemetría: líneas punteadas hacia la banda de observabilidad. */}
      <Edge arrow={false} d="M440 330V524" dashed />
      <Edge arrow={false} d="M845 376V524" dashed />

      {/* Camino principal. */}
      <Edge d="M174 228H248" flow />
      <Edge d="M174 300H248" />
      <Edge d="M375 88V194" />
      <Tag text={labels.contextEdge} x={385} y={146} />
      <Edge d="M500 263H528" flow />
      <Edge d="M690 263H738" flow />
      <Tag text={gate.low} x={694} y={254} />
      <Edge d="M722 263V177H738" />
      <Edge d="M722 263V349H738" />
      <Edge arrow={false} d="M950 177H972V263" />
      <Edge arrow={false} d="M950 349H972V263" />
      <Edge d="M950 263H988" flow />
      <Edge accent d="M1070 201V142" flow />
      <Tag accent text={verify.yes} x={1080} y={176} />

      {/* Riesgo alto: pasa por una persona antes de tocar herramientas. */}
      <Edge accent d="M610 327V396" />
      <Tag accent text={gate.high} x={620} y={366} />
      <Edge accent arrow={false} d="M690 425H722V352" />
      <Tag accent text={labels.human.approved} x={696} y={444} />

      {/* Bucle de reintento con feedback de las evals. */}
      <Edge accent d="M1070 325V478H375V332" dashed />
      <Tag accent anchor="end" text={labels.retry} x={1056} y={470} />

      {/* Nodos. */}
      <Box body={labels.task.body} h={56} title={labels.task.title} w={150} x={24} y={200} />
      <Box body={labels.event.body} h={56} title={labels.event.title} w={150} x={24} y={272} />
      <Box body={labels.context.body} h={64} title={labels.context.title} w={250} x={250} y={24} />

      <g>
        <rect
          className="fill-accent-300/10 stroke-accent-300"
          height="134"
          rx="3"
          strokeWidth="1.6"
          width="250"
          x="250"
          y="196"
        />
        <text
          className="fill-white font-display text-[17px] font-medium"
          textAnchor="middle"
          x="375"
          y="228"
        >
          {orchestrator.title}
        </text>
        <text
          className="fill-neutral-300 font-mono text-[10.5px] tracking-[0.04em]"
          textAnchor="middle"
          x="375"
          y="248"
        >
          {orchestrator.body}
        </text>
        {orchestrator.steps.map((step, index) => (
          <g key={step}>
            <rect
              className="fill-white/10 stroke-white/30"
              height="28"
              rx="14"
              width="68"
              x={STEP_X[index]}
              y="268"
            />
            <text
              className="fill-white font-sans text-[11px]"
              textAnchor="middle"
              x={(STEP_X[index] ?? 0) + 34}
              y="286"
            >
              {step}
            </text>
          </g>
        ))}
      </g>

      <Decision
        cx={610}
        cy={263}
        halfH={64}
        halfW={80}
        question={gate.question}
        title={gate.title}
      />
      <Box
        body={labels.human.body}
        className="stroke-accent-300/70"
        h={54}
        title={labels.human.title}
        w={160}
        x={530}
        y={398}
      />

      <Box
        body={labels.subagents.body}
        h={54}
        title={labels.subagents.title}
        w={210}
        x={740}
        y={150}
      />
      <Box body={labels.tools.body} h={54} title={labels.tools.title} w={210} x={740} y={236} />
      <Box body={labels.sandbox.body} h={54} title={labels.sandbox.title} w={210} x={740} y={322} />

      <Decision
        cx={1070}
        cy={263}
        halfH={62}
        halfW={78}
        question={verify.question}
        title={verify.title}
      />
      <Box
        body={labels.result.body}
        className="fill-accent-300/15 stroke-accent-300"
        h={58}
        title={labels.result.title}
        w={160}
        x={990}
        y={84}
      />

      {/* Banda de observabilidad. */}
      <rect
        className="fill-white/5 stroke-white/30"
        height="62"
        rx="3"
        strokeDasharray="4 4"
        strokeWidth="1.2"
        width="1152"
        x="24"
        y="524"
      />
      <Tag accent text={observability.title} x={48} y={550} />
      <text className="fill-neutral-200 font-sans text-[13px]" x="48" y="570">
        {observability.body}
      </text>
      {observability.tags.map((tag, index) => (
        <g key={tag}>
          <rect
            className="fill-white/10 stroke-white/30"
            height="24"
            rx="12"
            width="84"
            x={780 + index * 94}
            y="543"
          />
          <Tag anchor="middle" text={tag} x={822 + index * 94} y={559} />
        </g>
      ))}
    </svg>
  );
}
