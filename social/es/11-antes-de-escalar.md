# 11 · Antes de escalar, haz la cuenta

Artículos de referencia: `/es/docs/numeros-y-leyes-de-rendimiento`, `/es/docs/escalabilidad-casos-clasicos`

---

Tu sistema no necesita 50 servidores. Necesita una estimación de orden de magnitud.

Antes de escalar, haz la cuenta:

- **Ley de Little:** concurrencia = caudal × tiempo de respuesta. Con 200 peticiones por segundo y 0,5 s de latencia, hay unas 100 peticiones en vuelo.
- **Ley de Amdahl:** si el 10 % del trabajo es secuencial, por muchos núcleos que añadas la mejora no supera 10×.
- **Colas:** al acercarte al 100 % de utilización, la latencia se dispara.

Luego, el método: requisitos, estimación, particiones y réplicas. Lo aplicamos a tres casos clásicos: un acortador de URLs, un limitador de tasa y un feed de noticias.

Y una regla sencilla: no optimices lo que no mediste. Mira percentiles, no solo medias.

¿Tienes escrita en algún sitio una estimación de tu carga pico?
