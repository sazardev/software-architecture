import { acoplamientoCohesion } from './designs/acoplamiento-cohesion';
import { adr } from './designs/adr';
import { adrCicloDeVida } from './designs/adr-ciclo-de-vida';
import { antesDeEscalarLaCuenta } from './designs/antes-de-escalar-la-cuenta';
import { arquitecturaAgentesLlm } from './designs/arquitectura-agentes-llm';
import { arquitecturaEnCapasCleanOnion } from './designs/arquitectura-en-capas-clean-onion';
import { arquitecturaHexagonal } from './designs/arquitectura-hexagonal';
import { atributosDeCalidad } from './designs/atributos-de-calidad';
import { autonomiaDeLaIa } from './designs/autonomia-de-la-ia';
import { c4Model } from './designs/c4-model';
import { cachingColasStreaming } from './designs/caching-colas-streaming';
import { capPacelc } from './designs/cap-pacelc';
import { capPorOperacion } from './designs/cap-por-operacion';
import { capasNoSonArquitectura } from './designs/capas-no-son-arquitectura';
import { casadoAUnProveedor } from './designs/casado-a-un-proveedor';
import { cleanCode } from './designs/clean-code';
import { complejidadAccidentalDeHerramientas } from './designs/complejidad-accidental-de-herramientas';
import { complejidadEsencialYAccidental } from './designs/complejidad-esencial-y-accidental';
import { controlarLaIaGobiernoYAutonomia } from './designs/controlar-la-ia-gobierno-y-autonomia';
import { coordinarServiciosSin2pc } from './designs/coordinar-servicios-sin-2pc';
import { datosAcidYAislamiento } from './designs/datos-acid-y-aislamiento';
import { deudaTecnicaEvolucion } from './designs/deuda-tecnica-evolucion';
import { devopsCultura } from './designs/devops-cultura';
import { diagramasComoCodigo } from './designs/diagramas-como-codigo';
import { disenarFlujosConAgentes } from './designs/disenar-flujos-con-agentes';
import { disenoDeApis } from './designs/diseno-de-apis';
import { domainDrivenDesign } from './designs/domain-driven-design';
import { escalabilidadCasosClasicos } from './designs/escalabilidad-casos-clasicos';
import { estilosArquitectonicos } from './designs/estilos-arquitectonicos';
import { eventDrivenCqrsEventSourcing } from './designs/event-driven-cqrs-event-sourcing';
import { finopsCostoComoAtributo } from './designs/finops-costo-como-atributo';
import { fitnessEnElCi } from './designs/fitness-en-el-ci';
import { fitnessFunctions } from './designs/fitness-functions';
import { flujoDeValorYCuellosDeBotella } from './designs/flujo-de-valor-y-cuellos-de-botella';
import { gettingStarted } from './designs/getting-started';
import { harnessEngineeringClaudeCode } from './designs/harness-engineering-claude-code';
import { herramientasParaDecidirYDocumentar } from './designs/herramientas-para-decidir-y-documentar';
import { iaParaDecidirNegocio } from './designs/ia-para-decidir-negocio';
import { lenguajesEraIa } from './designs/lenguajes-era-ia';
import { leyDeConwayTeamTopologies } from './designs/ley-de-conway-team-topologies';
import { marcosDeDecisionEstrategica } from './designs/marcos-de-decision-estrategica';
import { marcosDePriorizacion } from './designs/marcos-de-priorizacion';
import { medirDecisionesOkrKpi } from './designs/medir-decisiones-okr-kpi';
import { mejoraContinuaYExperimentos } from './designs/mejora-continua-y-experimentos';
import { modelosDeDespliegueNube } from './designs/modelos-de-despliegue-nube';
import { monolitoModularPrimero } from './designs/monolito-modular-primero';
import { monolitoVsMicroservicios } from './designs/monolito-vs-microservicios';
import { multiTenancy } from './designs/multi-tenancy';
import { multinubeCuandoTieneSentido } from './designs/multinube-cuando-tiene-sentido';
import { nubeHibridaEnDetalle } from './designs/nube-hibrida-en-detalle';
import { numerosYLeyesDeRendimiento } from './designs/numeros-y-leyes-de-rendimiento';
import { organigramaYSistema } from './designs/organigrama-y-sistema';
import { patronesDeDiseno } from './designs/patrones-de-diseno';
import { pensamientoSistemicoYSesgos } from './designs/pensamiento-sistemico-y-sesgos';
import { presentarIdeasYPropuestas } from './designs/presentar-ideas-y-propuestas';
import { principiosDeDisenoBasicos } from './designs/principios-de-diseno-basicos';
import { redesIdentidadSeguridadNube } from './designs/redes-identidad-seguridad-nube';
import { regionesZonasYRecuperacion } from './designs/regiones-zonas-y-recuperacion';
import { reintentosConJitter } from './designs/reintentos-con-jitter';
import { resilienciaSistemasDistribuidos } from './designs/resiliencia-sistemas-distribuidos';
import { sagasOutboxIdempotencia } from './designs/sagas-outbox-idempotencia';
import { salidaDeLaNube } from './designs/salida-de-la-nube';
import { seguridadPorDiseno } from './designs/seguridad-por-diseno';
import { serverlessYComputacionGestionada } from './designs/serverless-y-computacion-gestionada';
import { serviciosNubeParaArquitectos } from './designs/servicios-nube-para-arquitectos';
import { solid } from './designs/solid';
import { tradeOffsYDecisiones } from './designs/trade-offs-y-decisiones';
import type { Figure, FigureBuilder } from './figure-types';

/**
Una figura por artículo, indexada por slug. Un artículo sin entrada aquí falla la auditoría
(E-FIGURE-MISSING): dibuja la figura en `designs/<slug>.ts` y regístrala.
*/
const entries: readonly (readonly [slug: string, build: FigureBuilder])[] = [
  ['acoplamiento-cohesion', acoplamientoCohesion],
  ['adr', adr],
  ['arquitectura-agentes-llm', arquitecturaAgentesLlm],
  ['arquitectura-en-capas-clean-onion', arquitecturaEnCapasCleanOnion],
  ['arquitectura-hexagonal', arquitecturaHexagonal],
  ['atributos-de-calidad', atributosDeCalidad],
  ['c4-model', c4Model],
  ['cap-pacelc', capPacelc],
  ['clean-code', cleanCode],
  ['deuda-tecnica-evolucion', deudaTecnicaEvolucion],
  ['devops-cultura', devopsCultura],
  ['diagramas-como-codigo', diagramasComoCodigo],
  ['domain-driven-design', domainDrivenDesign],
  ['fitness-functions', fitnessFunctions],
  ['getting-started', gettingStarted],
  ['harness-engineering-claude-code', harnessEngineeringClaudeCode],
  ['lenguajes-era-ia', lenguajesEraIa],
  ['monolito-vs-microservicios', monolitoVsMicroservicios],
  ['patrones-de-diseno', patronesDeDiseno],
  ['solid', solid],
  ['trade-offs-y-decisiones', tradeOffsYDecisiones],
  ['event-driven-cqrs-event-sourcing', eventDrivenCqrsEventSourcing],
  ['sagas-outbox-idempotencia', sagasOutboxIdempotencia],
  ['diseno-de-apis', disenoDeApis],
  ['resiliencia-sistemas-distribuidos', resilienciaSistemasDistribuidos],
  ['caching-colas-streaming', cachingColasStreaming],
  ['escalabilidad-casos-clasicos', escalabilidadCasosClasicos],
  ['multi-tenancy', multiTenancy],
  ['principios-de-diseno-basicos', principiosDeDisenoBasicos],
  ['complejidad-esencial-y-accidental', complejidadEsencialYAccidental],
  ['ley-de-conway-team-topologies', leyDeConwayTeamTopologies],
  ['datos-acid-y-aislamiento', datosAcidYAislamiento],
  ['numeros-y-leyes-de-rendimiento', numerosYLeyesDeRendimiento],
  ['estilos-arquitectonicos', estilosArquitectonicos],
  ['seguridad-por-diseno', seguridadPorDiseno],
  ['servicios-nube-para-arquitectos', serviciosNubeParaArquitectos],
  ['modelos-de-despliegue-nube', modelosDeDespliegueNube],
  ['nube-hibrida-en-detalle', nubeHibridaEnDetalle],
  ['casado-a-un-proveedor', casadoAUnProveedor],
  ['multinube-cuando-tiene-sentido', multinubeCuandoTieneSentido],
  ['serverless-y-computacion-gestionada', serverlessYComputacionGestionada],
  ['redes-identidad-seguridad-nube', redesIdentidadSeguridadNube],
  ['regiones-zonas-y-recuperacion', regionesZonasYRecuperacion],
  ['finops-costo-como-atributo', finopsCostoComoAtributo],
  ['marcos-de-priorizacion', marcosDePriorizacion],
  ['marcos-de-decision-estrategica', marcosDeDecisionEstrategica],
  ['presentar-ideas-y-propuestas', presentarIdeasYPropuestas],
  ['flujo-de-valor-y-cuellos-de-botella', flujoDeValorYCuellosDeBotella],
  ['mejora-continua-y-experimentos', mejoraContinuaYExperimentos],
  ['medir-decisiones-okr-kpi', medirDecisionesOkrKpi],
  ['ia-para-decidir-negocio', iaParaDecidirNegocio],
  ['controlar-la-ia-gobierno-y-autonomia', controlarLaIaGobiernoYAutonomia],
  ['disenar-flujos-con-agentes', disenarFlujosConAgentes],
  ['herramientas-para-decidir-y-documentar', herramientasParaDecidirYDocumentar],
  ['pensamiento-sistemico-y-sesgos', pensamientoSistemicoYSesgos],
  ['capas-no-son-arquitectura', capasNoSonArquitectura],
  ['fitness-en-el-ci', fitnessEnElCi],
  ['monolito-modular-primero', monolitoModularPrimero],
  ['organigrama-y-sistema', organigramaYSistema],
  ['coordinar-servicios-sin-2pc', coordinarServiciosSin2pc],
  ['cap-por-operacion', capPorOperacion],
  ['salida-de-la-nube', salidaDeLaNube],
  ['reintentos-con-jitter', reintentosConJitter],
  ['adr-ciclo-de-vida', adrCicloDeVida],
  ['autonomia-de-la-ia', autonomiaDeLaIa],
  ['antes-de-escalar-la-cuenta', antesDeEscalarLaCuenta],
  ['complejidad-accidental-de-herramientas', complejidadAccidentalDeHerramientas],
];

const builders = new Map<string, FigureBuilder>(entries);

export const figureSlugs: readonly string[] = entries.map(([slug]) => slug);

export function hasFigure(slug: string): boolean {
  return builders.has(slug);
}

export function getFigure(slug: string): Figure | undefined {
  return builders.get(slug)?.();
}
