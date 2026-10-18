---
id: metodologia-crisp-dm
titulo: Metodología CRISP-DM
titulo_en: CRISP-DM methodology
alias:
  - CRISP-DM
  - proceso estándar para minería de datos
  - ciclo de vida de un proyecto de datos
modulo: 12
submodulo: '12.1'
orden: 1
nivel: basico
prerrequisitos:
  - unidad-de-observacion-y-datos-ordenados
etiquetas:
  - proceso
  - ciclo de vida
  - gestión de proyectos
  - metodología
resumen: >
  CRISP-DM organiza un proyecto de datos en seis fases (negocio, datos, preparación, modelado,
  evaluación y despliegue) que se recorren en ciclo, con regresos entre fases cuando el trabajo revela un problema.
formula: 'T = \sum_{k=1}^{K} t_k,\qquad f_j = \frac{1}{T}\sum_{k:\,\phi_k = j} t_k'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: crisp
    caso: abandono
referencias:
  - clave: kohavi
  - clave: james-isl
publicado: true
---

## Intuición

Una empresa de telefonía pide "anticipar qué clientes se van a ir". Sería tentador abrir los datos y ajustar un modelo de inmediato, pero antes hay que saber qué decisión se tomará, qué significa "irse" cuando no existe un campo de cancelación y si los datos alcanzan para responder. Muchas veces, al explorar los datos, aparece una pregunta que obliga a volver con el área de negocio; al modelar, se descubre que falta una variable y hay que regresar a preparar los datos.

**CRISP-DM** (Cross Industry Standard Process for Data Mining) es un mapa de ese recorrido. Divide el trabajo en seis fases y reconoce que no se recorren una sola vez en línea recta: el proyecto avanza, regresa cuando encuentra un obstáculo y, después del despliegue, puede empezar un ciclo nuevo con lo aprendido. Su utilidad no está en seguir un formulario, sino en recordar qué preguntas deben responderse en cada etapa y qué entregable debe salir de ella antes de seguir.

## Definición

:::definicion[Metodología CRISP-DM]
CRISP-DM es un modelo de proceso para proyectos de análisis de datos formado por seis fases:

1. **Comprensión del negocio:** objetivos, criterio de éxito, recursos y restricciones; traducción a una meta analítica.
2. **Comprensión de los datos:** recolección, descripción, exploración y verificación de calidad.
3. **Preparación de los datos:** selección, limpieza, construcción de variables, integración y formato.
4. **Modelado:** elección de técnicas, diseño de la prueba, ajuste y evaluación técnica.
5. **Evaluación:** contraste de los resultados con el objetivo del negocio y revisión del proceso.
6. **Despliegue:** puesta en uso, plan de monitoreo y mantenimiento, informe final.

El flujo principal recorre las fases en ese orden y regresa del despliegue al negocio. Además se admiten tres regresos: de los datos al negocio, del modelado a la preparación y de la evaluación al negocio.
:::

Si el proyecto da $K$ pasos y el paso $k$ ocurre en la fase $\phi_k$ y dura $t_k$ semanas, la duración total y la fracción del esfuerzo dedicada a la fase $j$ son

$$
T = \sum_{k=1}^{K} t_k, \qquad f_j = \frac{1}{T}\sum_{k:\,\phi_k = j} t_k .
$$

:::nota[Qué significa cada símbolo]
- $K$: número de pasos del recorrido, contando cada visita a una fase como un paso.
- $k$: índice del paso, de $1$ a $K$.
- $\phi_k$: fase en la que ocurre el paso $k$, un valor entre las seis fases.
- $t_k$: duración del paso $k$, en semanas.
- $T$: duración total del proyecto.
- $j$: una de las seis fases.
- $f_j$: fracción del tiempo total dedicada a la fase $j$; las seis fracciones suman $1$.
:::

## Cómo usar la visualización

Las seis fases forman un ciclo alrededor de los datos. Las flechas continuas son el flujo principal y las punteadas, los tres regresos posibles. El punto naranja es el caso de estudio: en cada paso se mueve a la fase en la que ocurre la actividad, la flecha recorrida se resalta y la tarjeta muestra la actividad y su entregable. El número sobre cada fase cuenta sus visitas y la tira inferior guarda el recorrido completo.

Al hacer clic en una fase se listan sus tareas genéricas. Conviene observar en qué pasos el caso regresa: en el ejemplo de telefonía, la exploración de los datos obliga a definir qué es "abandonar" antes de seguir. La lectura "Regresos a fases anteriores" cuenta esas vueltas.

## Ejemplo

Una cadena de farmacias quiere reducir los días sin existencias de sus productos. El recorrido real del proyecto, con duraciones en semanas, fue:

1. Negocio (1): objetivo de faltantes por debajo de 3 %.
2. Datos (2): ventas diarias de 3 años, con huecos por cierres.
3. Preparación (2) y modelado (2): series semanales y un pronóstico con estacionalidad.
4. Evaluación (1): el error es de 40 % en productos de temporada, así que el criterio no se cumple.
5. Regreso al negocio (1): los productos de temporada se planearán aparte.
6. Datos (1), preparación (1), modelado (2) y evaluación (1): el criterio se cumple.
7. Despliegue (2).

La duración total es $T = 1+2+2+2+1+1+1+1+2+1+2 = 16$ semanas. A preparación se dedicaron $2 + 1 = 3$ semanas, así que $f_{\text{prep}} = 3/16 = 0.1875$, y a modelado $f_{\text{mod}} = 4/16 = 0.25$. El regreso de la evaluación al negocio costó 6 semanas adicionales, pero evitó desplegar un pronóstico que fallaba justo en los productos más difíciles.

:::figura[El caso de la cadena de farmacias recorre el ciclo con un regreso de la evaluación al negocio. La tira inferior muestra las 11 visitas y el contador final suma 16 semanas.]{componente="DataProjectViz"}
```yaml
modo: crisp
caso: inventario
```
:::

## Propiedades

- **Es iterativo.** El recorrido típico visita varias veces las fases intermedias. El número de regresos no indica un mal proyecto: indica que se descubrió algo que cambió el planteamiento.
- **Cada fase deja un entregable.** Una definición operativa, un informe de calidad, una tabla de modelado, un modelo evaluado. Si una fase termina sin entregable, la siguiente se apoya en supuestos no revisados.
- **La evaluación es de negocio, no solo técnica.** La fase de modelado evalúa errores y métricas; la fase de evaluación pregunta si el resultado cumple el objetivo acordado al inicio.

:::figura[Propiedad de la evaluación de negocio: en el caso de mantenimiento, el modelo detecta 80 % de las fallas, pero genera 9 alarmas semanales para un equipo que atiende 2. La evaluación regresa al negocio para fijar esa restricción.]{componente="DataProjectViz"}
```yaml
modo: crisp
caso: mantenimiento
```
:::

- **El ciclo no termina en el despliegue.** El modelo en uso cambia el entorno y genera datos nuevos; la revisión después del despliegue suele iniciar otro ciclo.

:::figura[En el caso de readmisión hospitalaria, después del despliegue se revisa el efecto de las llamadas de seguimiento y el recorrido vuelve a la comprensión del negocio.]{componente="DataProjectViz"}
```yaml
modo: crisp
caso: readmision
```
:::

## Errores comunes

- **Empezar por el modelado.** Ajustar modelos antes de definir la decisión y la variable objetivo produce resultados técnicamente correctos que no responden a nada. En el caso de telefonía, sin la definición de abandono a 60 días no existe ni siquiera la etiqueta.
- **Tratar las fases como una cascada.** Planear cada fase una sola vez, con fechas fijas, oculta que la exploración y el modelado suelen revelar problemas que obligan a regresar. Un plan realista reserva tiempo para esas vueltas.
- **Omitir el monitoreo en el despliegue.** Un modelo que se entrega sin plan de seguimiento se degrada sin que nadie lo note cuando cambian los datos.

:::figura[Error de empezar por el modelado: en el caso de telefonía, el tercer paso regresa al negocio porque los datos no tienen un campo de cancelación. Avanzar paso a paso muestra que la etiqueta solo existe después de ese regreso.]{componente="DataProjectViz"}
```yaml
modo: crisp
caso: abandono
```
:::

## Conexiones

La primera fase se detalla en [[planteamiento-del-problema]] y en [[de-la-pregunta-de-negocio-a-la-pregunta-analitica]]; la evaluación de negocio, en [[metricas-de-negocio-vs-metricas-del-modelo]]. La preparación de los datos produce tablas con una fila por [[unidad-de-observacion-y-datos-ordenados|unidad de observación]] y la fase de comprensión de los datos se apoya en la descripción de la [[poblacion-y-muestra|población y la muestra]]. Para que cada vuelta del ciclo sea comparable con la anterior, el trabajo debe cumplir con la [[reproducibilidad]].

## Formulario

:::formula[Duración total del proyecto]
$$
T = \sum_{k=1}^{K} t_k
$$

- $T$: duración total, en semanas.
- $K$: número de pasos del recorrido, incluidos los regresos.
- $t_k$: duración del paso $k$.
:::

:::formula[Fracción del esfuerzo en una fase]
$$
f_j = \frac{1}{T}\sum_{k:\,\phi_k = j} t_k
$$

- $f_j$: fracción del tiempo dedicada a la fase $j$.
- $\phi_k$: fase del paso $k$; la suma recorre solo los pasos que ocurren en la fase $j$.
- $t_k$: duración del paso $k$.
- $T$: duración total.
:::
