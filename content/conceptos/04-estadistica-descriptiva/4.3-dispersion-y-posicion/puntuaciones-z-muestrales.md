---
id: puntuaciones-z-muestrales
titulo: Puntuaciones z muestrales
titulo_en: Sample z-scores
alias:
  - estandarización
  - puntuación estándar
  - valores tipificados
modulo: 4
submodulo: '4.3'
orden: 11
nivel: basico
prerrequisitos:
  - desviacion-estandar-muestral
etiquetas:
  - posición relativa
  - estandarización
  - puntuación z
  - comparación entre escalas
resumen: >
  La puntuación z de un dato es su distancia a la media medida en desviaciones estándar. Permite
  comparar posiciones relativas en variables con unidades o escalas distintas.
formula: 'z_i = \frac{x_i - \bar{x}}{s}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: estandarizar
    grupos:
      - datos: [62, 70, 75, 81, 85, 68, 73]
        variable: Examen de matemáticas
        unidad: puntos
        resaltar: 4
      - datos: [55, 60, 58, 72, 65, 63, 61]
        variable: Examen de física
        unidad: puntos
        resaltar: 3
    decimales: 0
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Una estudiante sacó 85 en matemáticas y 72 en física. ¿En cuál le fue mejor? La calificación más alta es la de matemáticas, pero quizá ese examen fue más fácil para todos. Lo que importa es dónde quedó respecto a su grupo: en matemáticas el promedio fue 73 y las calificaciones variaron unos 8 puntos; en física el promedio fue 62 y variaron unos 5.5. Sus 85 puntos están a 1.5 "variaciones típicas" por encima del promedio; sus 72 en física, a 1.8.

La **puntuación z** hace esa traducción: resta la media para saber si un dato está arriba o abajo del centro, y divide entre la desviación estándar para medir esa distancia en una unidad común. Así, datos con escalas distintas se vuelven comparables. Una z de 0 es justo el promedio; una z de 2 está dos desviaciones estándar por encima, algo poco común en datos con forma de campana.

## Definición

:::definicion[Puntuación z muestral]
Para datos con media $\bar{x}$ y desviación estándar $s > 0$, la **puntuación z** de la observación $x_i$ es
$$
z_i = \frac{x_i - \bar{x}}{s}.
$$
:::

La transformación se llama **estandarización**: resta la media (centra los datos) y divide entre la desviación estándar (los escala). La puntuación z no tiene unidades. Su signo indica si el dato está por encima o por debajo de la media, y su valor absoluto, a cuántas desviaciones estándar.

:::figura[Estandarización de los tiempos de recuperación de ocho pacientes tras una cirugía. Primero se marca la media y la banda de una desviación estándar; luego cada paciente se proyecta a la escala z.]{componente="DataStrip"}
```yaml
modo: estandarizar
grupos:
  - datos: [4.1, 3.8, 4.5, 5.2, 3.9, 4.4, 4.7, 6.8]
    variable: Días de recuperación
    unidad: días
    resaltar: 7
decimales: 1
```
:::

:::nota[Qué significa cada símbolo]
- $z_i$: puntuación z de la observación $i$, sin unidades.
- $x_i$: valor de la observación $i$.
- $\bar{x}$: media de los datos.
- $s$: desviación estándar muestral.
- $x_i - \bar{x}$: desviación de la observación respecto a la media, en unidades de la variable.
:::

## Cómo usar la visualización

Las dos filas superiores son las calificaciones de los exámenes, cada una en su propia escala; los círculos resaltados son las dos calificaciones de la estudiante. En la primera etapa se marcan la media y la banda de una desviación estándar de cada examen; en la segunda, el encabezado calcula la distancia a la media; en la tercera, todos los datos bajan a una escala z común.

En la escala común se ve que la calificación de física, 72, queda más a la derecha que la de matemáticas, 85: relativamente fue un mejor resultado. Las dos nubes de puntos se superponen en la escala z, centradas en cero, aunque en su escala original estén en lugares distintos.

## Ejemplo

Calificaciones de matemáticas: 62, 70, 75, 81, 85, 68, 73. Calificaciones de física: 55, 60, 58, 72, 65, 63, 61.

1. Matemáticas: $\bar{x} \approx 73.43$, $s \approx 7.81$. Puntuación de 85: $z = (85 - 73.43)/7.81 \approx 1.48$.
2. Física: $\bar{x} = 62$, $s \approx 5.48$. Puntuación de 72: $z = (72 - 62)/5.48 \approx 1.83$.
3. Conclusión: respecto a su grupo, el resultado de física fue mejor, aunque la calificación sea menor en puntos.

:::figura[Solo el examen de física: la calificación de 72 tiene puntuación z de 1.83.]{componente="DataStrip"}
```yaml
modo: estandarizar
grupos:
  - datos: [55, 60, 58, 72, 65, 63, 61]
    variable: Examen de física
    unidad: puntos
    resaltar: 3
decimales: 0
```
:::

## Propiedades

- **Media cero y desviación estándar uno:** las puntuaciones z de un conjunto de datos siempre tienen media 0 y desviación estándar 1.
- **Conservan la forma:** estandarizar es una transformación lineal; no cambia la asimetría ni el orden de los datos, ni convierte datos sesgados en normales.
- **Invariancia de escala:** las puntuaciones z no cambian si los datos se miden en otras unidades o se les suma una constante.
- **Interpretación en campana:** en datos aproximadamente normales, $|z| > 2$ ocurre en cerca de 5 % de los casos y $|z| > 3$ en cerca de 0.3 %.

:::figura[Propiedad de la forma: tiempos de una tarea con cola larga. En la escala z los datos conservan la misma asimetría; la tarea de 25 minutos sigue muy separada del resto.]{componente="DataStrip"}
```yaml
modo: estandarizar
grupos:
  - datos: [2, 3, 3, 4, 5, 6, 8, 12, 25]
    variable: Duración de la tarea
    unidad: min
    resaltar: 8
decimales: 0
```
:::

## Errores comunes

- **Creer que estandarizar vuelve normales los datos.** La forma no cambia; la regla del 95 % entre $-2$ y $2$ solo vale si los datos ya tenían forma de campana.
- **Usar z con valores atípicos que inflan $s$.** Un atípico muy grande aumenta la desviación estándar y puede ocultarse a sí mismo con una z moderada; la puntuación z modificada, que usa la mediana y la MAD, evita ese problema.
- **Comparar z de grupos muy distintos.** Que dos z coincidan dice que ocupan la misma posición relativa, no que sean igual de valiosas.

:::figura[Un atípico que se esconde: con la z usual, la tarea de 25 minutos tiene puntuación 2.41; con la versión robusta, que usa mediana y MAD, su puntuación es mucho mayor y supera claramente el umbral de 3.5.]{componente="DataStrip"}
```yaml
modo: estandarizar
grupos:
  - datos: [2, 3, 3, 4, 5, 6, 8, 12, 25]
    variable: Duración de la tarea
    unidad: min
    resaltar: 8
robusta: true
umbral: 3.5
decimales: 0
```
:::

## Conexiones

La puntuación z expresa una desviación respecto a la [[media-aritmetica]] en unidades de [[desviacion-estandar-muestral|desviación estándar]]. Su versión robusta usa la [[mediana]] y la [[desviacion-absoluta-mediana]]. Es la misma transformación que convierte una variable aleatoria normal en normal estándar, y es el preprocesamiento habitual antes de comparar variables o de aplicar métodos sensibles a la escala, como el análisis de componentes principales.

## Formulario

:::formula[Puntuación z]
$$
z_i = \frac{x_i - \bar{x}}{s}
$$

- $x_i$: dato; $\bar{x}$: media; $s$: desviación estándar.
:::

:::formula[Regreso a la escala original]
$$
x_i = \bar{x} + z_i\,s
$$

- Permite convertir una posición relativa en un valor de la variable.
:::

:::formula[Media y desviación estándar de las puntuaciones]
$$
\bar{z} = 0, \qquad s_z = 1
$$

- $\bar{z}$: media de las puntuaciones z; $s_z$: su desviación estándar.
:::

:::formula[Puntuación z modificada]
$$
z_i^{*} = \frac{0.6745\,(x_i - \tilde{x})}{\mathrm{MAD}}
$$

- $\tilde{x}$: mediana; $\mathrm{MAD}$: desviación absoluta mediana.
:::
