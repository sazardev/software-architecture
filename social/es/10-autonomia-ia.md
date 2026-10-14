# 10 · Cuánta autonomía darle a tu sistema con IA

Artículos de referencia: `/es/docs/disenar-flujos-con-agentes`, `/es/docs/controlar-la-ia-gobierno-y-autonomia`

---

¿Cuánta autonomía le das a tu sistema con IA?

Un agente es un sistema probabilístico que actúa. Eso cambia las reglas de arquitectura.

Primero, decide paso a paso: ¿qué hace el código determinista y qué hace el modelo? Validar un JSON no necesita un LLM.

Segundo, pon puntos de control:

- **Validar:** esquemas y reglas antes de actuar.
- **Aprobar:** humano en el bucle para acciones costosas o irreversibles.
- **Parar:** límites de pasos, costo y tiempo.

Tercero, traza todo: qué decidió, con qué datos, cuánto costó, y si un reintento puede duplicar un pago. La idempotencia sigue siendo responsabilidad tuya.

Cuarto, define niveles de autonomía. No todo agente debe actuar sin supervisión. Por ejemplo, un agente de soporte puede sugerir respuestas, emitir reembolsos hasta cierto importe y escalar el resto.

Marcos como el NIST AI RMF, el EU AI Act y OWASP para LLM dan una base común para hablarlo con legal y seguridad.

¿Qué acción de tu sistema con IA ejecutaría sin preguntar a nadie? ¿Debería?
