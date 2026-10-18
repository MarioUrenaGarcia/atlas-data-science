---
id: planteamiento-del-problema
titulo: Planteamiento del problema
titulo_en: Problem framing
alias:
  - formulación del problema
  - definición del problema
  - problem statement
modulo: 12
submodulo: '12.1'
orden: 2
nivel: basico
prerrequisitos:
  - metodologia-crisp-dm
etiquetas:
  - proceso
  - variable objetivo
  - horizonte de predicción
  - criterio de éxito
resumen: >
  Plantear el problema es fijar, antes de analizar datos, qué decisión se apoya, sobre qué unidad,
  qué se predice o estima, en qué ventana de tiempo, con qué datos y cómo se medirá el éxito.
formula: '\Delta_{\text{rel}} = \frac{m_0 - m_1}{m_0}'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: planteamiento
    caso: abandono
referencias:
  - clave: kohavi
publicado: true
---

## Intuición

Una solicitud como "queremos que los clientes no se vayan" describe un deseo, no un problema que los datos puedan resolver. Para convertirla en un proyecto hay que contestar preguntas muy concretas: qué se hará con el resultado (llamar a ciertos clientes), quién lo hará, qué cuenta exactamente como "irse", cuándo se hace la predicción y cuánto tiempo hacia adelante mira, qué información existe en ese momento y qué número dirá, al final, si el proyecto funcionó.

Un buen planteamiento se parece a la ficha técnica de una obra antes de construirla. Cada campo vacío se llenará después de todos modos, pero de forma implícita, y con frecuencia de la manera más cómoda para el análisis en lugar de la más útil para la decisión. Los errores de planteamiento son caros porque no se ven en las métricas: un modelo puede tener un error pequeño y responder una pregunta que nadie hizo, o usar información que no existirá cuando haya que tomar la decisión.

## Definición

:::definicion[Planteamiento del problema]
Plantear un problema de datos es especificar, antes del análisis:

1. la **decisión** que se apoyará y **quién** la toma;
2. la **unidad de análisis**, es decir, a qué corresponde cada fila;
3. la **variable objetivo** con una definición operativa medible;
4. el **momento de la predicción** $t_0$, la **ventana de observación** y la **ventana del resultado**;
5. la **métrica de éxito** y su **línea base**;
6. las **restricciones** (capacidad, presupuesto, reglas legales);
7. los **datos disponibles** en el momento $t_0$.
:::

Las ventanas de tiempo se escriben respecto a $t_0$:

$$
\text{observación} = [t_0 - h_o,\ t_0), \qquad \text{resultado} = [t_0 + g,\ t_0 + g + h_r).
$$

El éxito se compara con la línea base mediante la mejora relativa $\Delta_{\text{rel}} = (m_0 - m_1)/m_0$ cuando la métrica es algo que se quiere reducir.

:::nota[Qué significa cada símbolo]
- $t_0$: momento en que se hace la predicción y se toma la decisión.
- $h_o$: longitud de la ventana de observación; solo los datos de ese intervalo pueden usarse como entradas.
- $g$: espera entre la predicción y el inicio de la ventana del resultado (puede ser $0$).
- $h_r$: longitud de la ventana en la que se mide la variable objetivo.
- $m_0$: valor de la métrica de éxito en la línea base, sin el proyecto.
- $m_1$: valor de la métrica con el proyecto en marcha.
- $\Delta_{\text{rel}}$: mejora relativa; por ejemplo, $0.10$ es una reducción de 10 %.
:::

## Cómo usar la visualización

Arriba aparece la solicitud tal como llegó. Al reproducir, los ocho campos del planteamiento se llenan uno por uno y el campo activo se resalta. Cuando se define el horizonte aparece la línea de tiempo con la ventana de observación, el momento de la predicción y la ventana del resultado (dibujada sin escala para que las ventanas cortas sean legibles). Al final aparece el enunciado completo.

El interruptor "Mostrar el planteamiento deficiente" agrega, bajo cada campo, la versión vaga o equivocada de la misma solicitud. Conviene comparar el campo "Datos disponibles al decidir": en la versión deficiente suele incluir información posterior a $t_0$.

## Ejemplo

Una universidad quiere "saber qué estudiantes van a desertar". El planteamiento queda así:

1. Decisión: a quién asignar una de 300 tutorías. Decide la coordinación de tutorías.
2. Unidad: estudiante de primer ingreso en un semestre.
3. Variable objetivo: no inscribirse al semestre siguiente.
4. Momento: semana 6 del semestre. Ventana de observación: semanas 1 a 6, es decir $h_o = 42$ días. Espera hasta la inscripción: $g = 90$ días. Ventana del resultado: $h_r = 14$ días de inscripción.
5. Métrica: deserción de primer año; línea base $m_0 = 18\,\%$, meta $m_1 = 15\,\%$.

La mejora relativa buscada es $\Delta_{\text{rel}} = (0.18 - 0.15)/0.18 = 0.1\overline{6}$, una reducción de casi 17 % de la deserción. Las calificaciones finales del semestre quedan excluidas: se conocen después de $t_0$.

:::figura[El caso de becas y tutorías completo, con la versión deficiente visible: predecir al final del semestre deja sin tiempo para actuar.]{componente="DataProjectViz"}
```yaml
modo: planteamiento
caso: becas
comparar: true
```
:::

## Propiedades

- **El planteamiento fija la unidad de la tabla.** "Línea por semana" y "cliente por mes" producen tablas, etiquetas y tamaños de muestra distintos a partir de los mismos registros.
- **Las ventanas determinan qué datos son legítimos.** Toda entrada del modelo debe pertenecer a $[t_0 - h_o, t_0)$; lo que ocurre después es parte del resultado o es información que no existirá al decidir.

:::figura[Ventanas en el pronóstico de farmacias: un año de historial, 4 días entre el pedido del jueves y el inicio de la semana pronosticada, y 7 días de resultado.]{componente="DataProjectViz"}
```yaml
modo: planteamiento
caso: inventario
```
:::

- **Las restricciones cambian la métrica.** Si solo se pueden revisar 2 bombas por semana, lo que importa es acertar entre las 2 primeras de la lista, no el desempeño promedio del modelo en todas las bombas.

:::figura[Planteamiento del mantenimiento de bombas con la versión deficiente: la capacidad de 2 revisiones semanales define la métrica útil.]{componente="DataProjectViz"}
```yaml
modo: planteamiento
caso: mantenimiento
comparar: true
```
:::

## Errores comunes

- **Definir la variable objetivo de manera vaga.** "Que se vaya" o "comportamiento anormal" no pueden calcularse. Sin definición operativa, cada analista construye una etiqueta distinta y los resultados no son comparables.
- **Usar datos posteriores al momento de la predicción.** En la versión deficiente del caso de telefonía se usan "todos los datos del cliente", incluidos los del periodo de abandono. El modelo parece excelente en la evaluación y falla en el uso real.
- **Medir el éxito con una métrica del modelo.** "Que el modelo sea preciso" no dice si la campaña redujo las cancelaciones; el criterio de éxito debe estar en las unidades de la decisión.

:::figura[Los tres errores en el caso de telefonía: la versión deficiente deja vaga la variable objetivo, usa datos posteriores al lunes de la predicción y mide el éxito con la precisión del modelo.]{componente="DataProjectViz"}
```yaml
modo: planteamiento
caso: abandono
comparar: true
```
:::

## Conexiones

El planteamiento es el entregable principal de la primera fase de la [[metodologia-crisp-dm]]. La traducción de la pregunta en términos medibles se desarrolla en [[de-la-pregunta-de-negocio-a-la-pregunta-analitica]] y la elección de la métrica de éxito, en [[metricas-de-negocio-vs-metricas-del-modelo]]. La unidad de análisis es la [[unidad-de-observacion-y-datos-ordenados|unidad de observación]] de la tabla final, y la distinción entre lo que se observa y lo que se quiere conocer retoma la de [[poblacion-y-muestra|población y muestra]]. Las decisiones sobre qué datos usar tienen consecuencias que se discuten en [[etica-de-datos]].

## Formulario

:::formula[Ventanas de tiempo de una predicción]
$$
\text{observación} = [t_0 - h_o,\ t_0), \qquad \text{resultado} = [t_0 + g,\ t_0 + g + h_r)
$$

- $t_0$: momento de la predicción.
- $h_o$: longitud de la ventana de observación.
- $g$: espera entre la predicción y el inicio de la ventana del resultado.
- $h_r$: longitud de la ventana del resultado.
:::

:::formula[Mejora relativa respecto a la línea base]
$$
\Delta_{\text{rel}} = \frac{m_0 - m_1}{m_0}
$$

- $m_0$: métrica de éxito en la línea base.
- $m_1$: métrica de éxito con el proyecto.
- $\Delta_{\text{rel}}$: reducción relativa; positiva cuando la métrica baja.
:::
