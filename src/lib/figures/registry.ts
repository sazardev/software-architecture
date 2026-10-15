import { acoplamientoCohesion } from './designs/acoplamiento-cohesion';
import { adr } from './designs/adr';
import { adrCicloDeVida } from './designs/adr-ciclo-de-vida';
import { agentesQueUsanInterfaces } from './designs/agentes-que-usan-interfaces';
import { antesDeEscalarLaCuenta } from './designs/antes-de-escalar-la-cuenta';
import { arquitectoComoFacilitador } from './designs/arquitecto-como-facilitador';
import { arquitecturaAgentesLlm } from './designs/arquitectura-agentes-llm';
import { arquitecturaDeArchivosReposGrandes } from './designs/arquitectura-de-archivos-repos-grandes';
import { arquitecturaDeDatosLakehouse } from './designs/arquitectura-de-datos-lakehouse';
import { arquitecturaEnCapasCleanOnion } from './designs/arquitectura-en-capas-clean-onion';
import { arquitecturaExtensiblePlugins } from './designs/arquitectura-extensible-plugins';
import { arquitecturaHexagonal } from './designs/arquitectura-hexagonal';
import { atributosDeCalidad } from './designs/atributos-de-calidad';
import { autonomiaDeLaIa } from './designs/autonomia-de-la-ia';
import { autorizacionRbacAbacRebac } from './designs/autorizacion-rbac-abac-rebac';
import { busquedaEnAplicacion } from './designs/busqueda-en-aplicacion';
import { c4Model } from './designs/c4-model';
import { cachingColasStreaming } from './designs/caching-colas-streaming';
import { cadenaDeSuministroSoftware } from './designs/cadena-de-suministro-software';
import { calidadDatosParaIa } from './designs/calidad-datos-para-ia';
import { capPacelc } from './designs/cap-pacelc';
import { capPorOperacion } from './designs/cap-por-operacion';
import { capacidadYPruebasDeCarga } from './designs/capacidad-y-pruebas-de-carga';
import { capasNoSonArquitectura } from './designs/capas-no-son-arquitectura';
import { casadoAUnProveedor } from './designs/casado-a-un-proveedor';
import { casoEstudioSistemaCompleto } from './designs/caso-estudio-sistema-completo';
import { catalogoServiciosGobiernoApis } from './designs/catalogo-servicios-gobierno-apis';
import { chaosEngineeringGameDays } from './designs/chaos-engineering-game-days';
import { cleanCode } from './designs/clean-code';
import { codigoGeneradoPorIa } from './designs/codigo-generado-por-ia';
import { complejidadAccidentalDeHerramientas } from './designs/complejidad-accidental-de-herramientas';
import { complejidadEsencialYAccidental } from './designs/complejidad-esencial-y-accidental';
import { contextEngineeringYMemoria } from './designs/context-engineering-y-memoria-de-agentes';
import { contratosDeEventosVersionados } from './designs/contratos-de-eventos-versionados';
import { controlarLaIaGobiernoYAutonomia } from './designs/controlar-la-ia-gobierno-y-autonomia';
import { coordinarServiciosSin2pc } from './designs/coordinar-servicios-sin-2pc';
import { costesPorEquipoYFuncionalidad } from './designs/costes-por-equipo-y-funcionalidad';
import { costoDeInferencia } from './designs/costo-de-inferencia';
import { datosAcidYAislamiento } from './designs/datos-acid-y-aislamiento';
import { deudaTecnicaEvolucion } from './designs/deuda-tecnica-evolucion';
import { devopsCultura } from './designs/devops-cultura';
import { diagramasComoCodigo } from './designs/diagramas-como-codigo';
import { disenarFlujosConAgentes } from './designs/disenar-flujos-con-agentes';
import { disenarParaBorrar } from './designs/disenar-para-borrar';
import { disenoDeApis } from './designs/diseno-de-apis';
import { documentarArquitecturaUtil } from './designs/documentar-arquitectura-util';
import { domainDrivenDesign } from './designs/domain-driven-design';
import { edgeComputingCdn } from './designs/edge-computing-cdn';
import { entregaProgresivaFlagsCanary } from './designs/entrega-progresiva-flags-canary';
import { escalabilidadCasosClasicos } from './designs/escalabilidad-casos-clasicos';
import { estilosArquitectonicos } from './designs/estilos-arquitectonicos';
import { estrategiaDePruebasContratos } from './designs/estrategia-de-pruebas-contratos';
import { evaluarAgentesTrayectorias } from './designs/evaluar-agentes-trayectorias';
import { eventDrivenCqrsEventSourcing } from './designs/event-driven-cqrs-event-sourcing';
import { finopsCostoComoAtributo } from './designs/finops-costo-como-atributo';
import { fitnessEnElCi } from './designs/fitness-en-el-ci';
import { fitnessFunctions } from './designs/fitness-functions';
import { flujoDeValorYCuellosDeBotella } from './designs/flujo-de-valor-y-cuellos-de-botella';
import { futuroArquitecturaConIa } from './designs/futuro-arquitectura-con-ia';
import { gestionIncidentesPostmortems } from './designs/gestion-incidentes-postmortems';
import { gestionSecretosClaves } from './designs/gestion-secretos-claves';
import { gettingStarted } from './designs/getting-started';
import { harnessEngineeringClaudeCode } from './designs/harness-engineering-claude-code';
import { herramientasParaDecidirYDocumentar } from './designs/herramientas-para-decidir-y-documentar';
import { iaParaDecidirNegocio } from './designs/ia-para-decidir-negocio';
import { identidadYPermisosDeAgentes } from './designs/identidad-y-permisos-de-agentes';
import { infraestructuraComoCodigoGitops } from './designs/infraestructura-como-codigo-gitops';
import { kubernetesCuandoSiCuandoNo } from './designs/kubernetes-cuando-si-cuando-no';
import { legadoStranglerAnticorrupcion } from './designs/legado-strangler-anticorrupcion';
import { lenguajesEraIa } from './designs/lenguajes-era-ia';
import { leyDeConwayTeamTopologies } from './designs/ley-de-conway-team-topologies';
import { libreriasInternasSinInfiernoDeVersiones } from './designs/librerias-internas-sin-infierno-versiones';
import { marcosDeDecisionEstrategica } from './designs/marcos-de-decision-estrategica';
import { marcosDePriorizacion } from './designs/marcos-de-priorizacion';
import { mcpYA2a } from './designs/mcp-y-a2a-integracion-de-herramientas';
import { medirDecisionesOkrKpi } from './designs/medir-decisiones-okr-kpi';
import { mejoraContinuaYExperimentos } from './designs/mejora-continua-y-experimentos';
import { microFrontendsYBff } from './designs/micro-frontends-y-bff';
import { migracionNube6r } from './designs/migracion-nube-6r';
import { migracionesBdSinDowntime } from './designs/migraciones-bd-sin-downtime';
import { mlopsModeloAProduccion } from './designs/mlops-modelo-a-produccion';
import { modeladoDeAmenazasStride } from './designs/modelado-de-amenazas-stride';
import { modeladoDeDatosNormalizacion } from './designs/modelado-de-datos-normalizacion';
import { modelosDeDespliegueNube } from './designs/modelos-de-despliegue-nube';
import { modelosPequenosOnDevice } from './designs/modelos-pequenos-on-device-soberania';
import { monolitoModularPrimero } from './designs/monolito-modular-primero';
import { monolitoVsMicroservicios } from './designs/monolito-vs-microservicios';
import { monorepoOPolirepo } from './designs/monorepo-o-polirepo';
import { movilOfflineFirstSincronizacion } from './designs/movil-offline-first-sincronizacion';
import { multiTenancy } from './designs/multi-tenancy';
import { multiagenteCuandoUnAgenteBasta } from './designs/multiagente-cuando-un-agente-basta';
import { multinubeCuandoTieneSentido } from './designs/multinube-cuando-tiene-sentido';
import { notificacionesPushCorreoSms } from './designs/notificaciones-push-correo-sms';
import { nubeHibridaEnDetalle } from './designs/nube-hibrida-en-detalle';
import { numerosYLeyesDeRendimiento } from './designs/numeros-y-leyes-de-rendimiento';
import { observabilidadSloPresupuestoError } from './designs/observabilidad-slo-presupuesto-error';
import { organigramaYSistema } from './designs/organigrama-y-sistema';
import { pagosLibroMayorLedger } from './designs/pagos-libro-mayor-ledger';
import { patronesDeDiseno } from './designs/patrones-de-diseno';
import { pensamientoSistemicoYSesgos } from './designs/pensamiento-sistemico-y-sesgos';
import { persistenciaPoliglotaElegirBd } from './designs/persistencia-politica-elegir-bd';
import { plataformaInternaIdp } from './designs/plataforma-interna-idp';
import { presentarIdeasYPropuestas } from './designs/presentar-ideas-y-propuestas';
import { principiosDeDisenoBasicos } from './designs/principios-de-diseno-basicos';
import { privacidadPorDisenoGdpr } from './designs/privacidad-por-diseno-gdpr';
import { ragYEvaluacionContinua } from './designs/rag-y-evaluacion-continua';
import { ramasYEntregaContinua } from './designs/ramas-y-entrega-continua';
import { redesIdentidadSeguridadNube } from './designs/redes-identidad-seguridad-nube';
import { regionesZonasYRecuperacion } from './designs/regiones-zonas-y-recuperacion';
import { reintentosConJitter } from './designs/reintentos-con-jitter';
import { renderizadoWebSsrSsgIslands } from './designs/renderizado-web-ssr-ssg-islands';
import { resilienciaSistemasDistribuidos } from './designs/resiliencia-sistemas-distribuidos';
import { rfcYRevisionesDeArquitectura } from './designs/rfc-y-revisiones-de-arquitectura';
import { sagasOutboxIdempotencia } from './designs/sagas-outbox-idempotencia';
import { salidaDeLaNube } from './designs/salida-de-la-nube';
import { seguridadPorDiseno } from './designs/seguridad-por-diseno';
import { serverlessYComputacionGestionada } from './designs/serverless-y-computacion-gestionada';
import { serviciosNubeParaArquitectos } from './designs/servicios-nube-para-arquitectos';
import { sesionesTokensSso } from './designs/sesiones-tokens-sso';
import { softwareSostenibleCarbono } from './designs/software-sostenible-carbono';
import { solid } from './designs/solid';
import { tiempoRealWebsocketsSse } from './designs/tiempo-real-websockets-sse';
import { trabajoDelArquitectoConAgentes } from './designs/trabajo-del-arquitecto-con-agentes';
import { tradeOffsYDecisiones } from './designs/trade-offs-y-decisiones';
import { trazasDistribuidasOpentelemetry } from './designs/trazas-distribuidas-opentelemetry';
import type { Figure, FigureBuilder, FigureLocale } from './figure-types';

/**
Una figura por artículo, indexada por slug. Un artículo sin entrada aquí falla la auditoría
(E-FIGURE-MISSING): dibuja la figura en `designs/<slug>.ts` y regístrala.
*/
const entries: readonly (readonly [slug: string, build: FigureBuilder])[] = [
  ['acoplamiento-cohesion', acoplamientoCohesion],
  ['adr', adr],
  ['adr-ciclo-de-vida', adrCicloDeVida],
  ['agentes-que-usan-interfaces', agentesQueUsanInterfaces],
  ['antes-de-escalar-la-cuenta', antesDeEscalarLaCuenta],
  ['arquitecto-como-facilitador', arquitectoComoFacilitador],
  ['arquitectura-agentes-llm', arquitecturaAgentesLlm],
  ['arquitectura-de-archivos-repos-grandes', arquitecturaDeArchivosReposGrandes],
  ['arquitectura-de-datos-lakehouse', arquitecturaDeDatosLakehouse],
  ['arquitectura-en-capas-clean-onion', arquitecturaEnCapasCleanOnion],
  ['arquitectura-extensible-plugins', arquitecturaExtensiblePlugins],
  ['arquitectura-hexagonal', arquitecturaHexagonal],
  ['atributos-de-calidad', atributosDeCalidad],
  ['autonomia-de-la-ia', autonomiaDeLaIa],
  ['autorizacion-rbac-abac-rebac', autorizacionRbacAbacRebac],
  ['busqueda-en-aplicacion', busquedaEnAplicacion],
  ['c4-model', c4Model],
  ['caching-colas-streaming', cachingColasStreaming],
  ['cadena-de-suministro-software', cadenaDeSuministroSoftware],
  ['calidad-datos-para-ia', calidadDatosParaIa],
  ['cap-pacelc', capPacelc],
  ['cap-por-operacion', capPorOperacion],
  ['capacidad-y-pruebas-de-carga', capacidadYPruebasDeCarga],
  ['capas-no-son-arquitectura', capasNoSonArquitectura],
  ['casado-a-un-proveedor', casadoAUnProveedor],
  ['caso-estudio-sistema-completo', casoEstudioSistemaCompleto],
  ['catalogo-servicios-gobierno-apis', catalogoServiciosGobiernoApis],
  ['chaos-engineering-game-days', chaosEngineeringGameDays],
  ['clean-code', cleanCode],
  ['codigo-generado-por-ia', codigoGeneradoPorIa],
  ['complejidad-accidental-de-herramientas', complejidadAccidentalDeHerramientas],
  ['complejidad-esencial-y-accidental', complejidadEsencialYAccidental],
  ['context-engineering-y-memoria-de-agentes', contextEngineeringYMemoria],
  ['contratos-de-eventos-versionados', contratosDeEventosVersionados],
  ['controlar-la-ia-gobierno-y-autonomia', controlarLaIaGobiernoYAutonomia],
  ['coordinar-servicios-sin-2pc', coordinarServiciosSin2pc],
  ['costes-por-equipo-y-funcionalidad', costesPorEquipoYFuncionalidad],
  ['costo-de-inferencia', costoDeInferencia],
  ['datos-acid-y-aislamiento', datosAcidYAislamiento],
  ['deuda-tecnica-evolucion', deudaTecnicaEvolucion],
  ['devops-cultura', devopsCultura],
  ['diagramas-como-codigo', diagramasComoCodigo],
  ['disenar-flujos-con-agentes', disenarFlujosConAgentes],
  ['disenar-para-borrar', disenarParaBorrar],
  ['diseno-de-apis', disenoDeApis],
  ['documentar-arquitectura-util', documentarArquitecturaUtil],
  ['domain-driven-design', domainDrivenDesign],
  ['edge-computing-cdn', edgeComputingCdn],
  ['entrega-progresiva-flags-canary', entregaProgresivaFlagsCanary],
  ['escalabilidad-casos-clasicos', escalabilidadCasosClasicos],
  ['estilos-arquitectonicos', estilosArquitectonicos],
  ['estrategia-de-pruebas-contratos', estrategiaDePruebasContratos],
  ['evaluar-agentes-trayectorias', evaluarAgentesTrayectorias],
  ['event-driven-cqrs-event-sourcing', eventDrivenCqrsEventSourcing],
  ['finops-costo-como-atributo', finopsCostoComoAtributo],
  ['fitness-en-el-ci', fitnessEnElCi],
  ['fitness-functions', fitnessFunctions],
  ['flujo-de-valor-y-cuellos-de-botella', flujoDeValorYCuellosDeBotella],
  ['futuro-arquitectura-con-ia', futuroArquitecturaConIa],
  ['gestion-incidentes-postmortems', gestionIncidentesPostmortems],
  ['gestion-secretos-claves', gestionSecretosClaves],
  ['getting-started', gettingStarted],
  ['harness-engineering-claude-code', harnessEngineeringClaudeCode],
  ['herramientas-para-decidir-y-documentar', herramientasParaDecidirYDocumentar],
  ['ia-para-decidir-negocio', iaParaDecidirNegocio],
  ['identidad-y-permisos-de-agentes', identidadYPermisosDeAgentes],
  ['infraestructura-como-codigo-gitops', infraestructuraComoCodigoGitops],
  ['kubernetes-cuando-si-cuando-no', kubernetesCuandoSiCuandoNo],
  ['legado-strangler-anticorrupcion', legadoStranglerAnticorrupcion],
  ['lenguajes-era-ia', lenguajesEraIa],
  ['ley-de-conway-team-topologies', leyDeConwayTeamTopologies],
  ['librerias-internas-sin-infierno-versiones', libreriasInternasSinInfiernoDeVersiones],
  ['marcos-de-decision-estrategica', marcosDeDecisionEstrategica],
  ['marcos-de-priorizacion', marcosDePriorizacion],
  ['mcp-y-a2a-integracion-de-herramientas', mcpYA2a],
  ['medir-decisiones-okr-kpi', medirDecisionesOkrKpi],
  ['mejora-continua-y-experimentos', mejoraContinuaYExperimentos],
  ['micro-frontends-y-bff', microFrontendsYBff],
  ['migracion-nube-6r', migracionNube6r],
  ['migraciones-bd-sin-downtime', migracionesBdSinDowntime],
  ['mlops-modelo-a-produccion', mlopsModeloAProduccion],
  ['modelado-de-amenazas-stride', modeladoDeAmenazasStride],
  ['modelado-de-datos-normalizacion', modeladoDeDatosNormalizacion],
  ['modelos-de-despliegue-nube', modelosDeDespliegueNube],
  ['modelos-pequenos-on-device-soberania', modelosPequenosOnDevice],
  ['monolito-modular-primero', monolitoModularPrimero],
  ['monolito-vs-microservicios', monolitoVsMicroservicios],
  ['monorepo-o-polirepo', monorepoOPolirepo],
  ['movil-offline-first-sincronizacion', movilOfflineFirstSincronizacion],
  ['multi-tenancy', multiTenancy],
  ['multiagente-cuando-un-agente-basta', multiagenteCuandoUnAgenteBasta],
  ['multinube-cuando-tiene-sentido', multinubeCuandoTieneSentido],
  ['notificaciones-push-correo-sms', notificacionesPushCorreoSms],
  ['nube-hibrida-en-detalle', nubeHibridaEnDetalle],
  ['numeros-y-leyes-de-rendimiento', numerosYLeyesDeRendimiento],
  ['observabilidad-slo-presupuesto-error', observabilidadSloPresupuestoError],
  ['organigrama-y-sistema', organigramaYSistema],
  ['pagos-libro-mayor-ledger', pagosLibroMayorLedger],
  ['patrones-de-diseno', patronesDeDiseno],
  ['pensamiento-sistemico-y-sesgos', pensamientoSistemicoYSesgos],
  ['persistencia-politica-elegir-bd', persistenciaPoliglotaElegirBd],
  ['plataforma-interna-idp', plataformaInternaIdp],
  ['presentar-ideas-y-propuestas', presentarIdeasYPropuestas],
  ['principios-de-diseno-basicos', principiosDeDisenoBasicos],
  ['privacidad-por-diseno-gdpr', privacidadPorDisenoGdpr],
  ['rag-y-evaluacion-continua', ragYEvaluacionContinua],
  ['ramas-y-entrega-continua', ramasYEntregaContinua],
  ['redes-identidad-seguridad-nube', redesIdentidadSeguridadNube],
  ['regiones-zonas-y-recuperacion', regionesZonasYRecuperacion],
  ['reintentos-con-jitter', reintentosConJitter],
  ['renderizado-web-ssr-ssg-islands', renderizadoWebSsrSsgIslands],
  ['resiliencia-sistemas-distribuidos', resilienciaSistemasDistribuidos],
  ['rfc-y-revisiones-de-arquitectura', rfcYRevisionesDeArquitectura],
  ['sagas-outbox-idempotencia', sagasOutboxIdempotencia],
  ['salida-de-la-nube', salidaDeLaNube],
  ['seguridad-por-diseno', seguridadPorDiseno],
  ['serverless-y-computacion-gestionada', serverlessYComputacionGestionada],
  ['servicios-nube-para-arquitectos', serviciosNubeParaArquitectos],
  ['sesiones-tokens-sso', sesionesTokensSso],
  ['software-sostenible-carbono', softwareSostenibleCarbono],
  ['solid', solid],
  ['tiempo-real-websockets-sse', tiempoRealWebsocketsSse],
  ['trabajo-del-arquitecto-con-agentes', trabajoDelArquitectoConAgentes],
  ['trade-offs-y-decisiones', tradeOffsYDecisiones],
  ['trazas-distribuidas-opentelemetry', trazasDistribuidasOpentelemetry],
];

const builders = new Map<string, FigureBuilder>(entries);

export const figureSlugs: readonly string[] = entries.map(([slug]) => slug);

export function hasFigure(slug: string): boolean {
  return builders.has(slug);
}

export function getFigure(slug: string, locale: FigureLocale = 'es'): Figure | undefined {
  return builders.get(slug)?.(locale);
}
