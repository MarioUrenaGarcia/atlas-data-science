---
id: seleccion-de-caracteristicas-por-filtro
titulo: Selección de características por filtro
titulo_en: Filter feature selection
alias:
  - métodos de filtro
  - selección univariada
  - filter methods
modulo: 12
submodulo: '12.3'
orden: 22
nivel: basico
prerrequisitos:
  - maldicion-de-la-dimensionalidad
  - coeficiente-de-correlacion-de-pearson
etiquetas:
  - selección de características
  - correlación
  - preprocesamiento
  - alta dimensión
resumen: >
  Los métodos de filtro califican cada variable por separado con una medida de asociación con la respuesta
  (correlación, información mutua, una prueba estadística) y conservan las mejores, sin ajustar el modelo final.
formula: 'S_k = \{\, j : s_j \text{ está entre los } k \text{ mayores} \,\}, \qquad s_j = |r(x_j, y)|'
visualizacion:
  componente: FeatureSelectionViz
  parametros:
    modo: filtro
    k: 3
referencias:
  - clave: hastie-esl
  - clave: james-isl
publicado: true
---

## Intuición

Un agrónomo tiene ocho variables candidatas para predecir el rendimiento de un cultivo: lluvia, fertilizante, horas de sol, temperatura, una segunda medición de la lluvia hecha por satélite y tres códigos administrativos (número de parcela, letra del lote, código del vendedor). Antes de construir cualquier modelo, una forma rápida de ordenar las candidatas es preguntar, una por una, qué tanto se asocia cada variable con el rendimiento, y quedarse con las que más.

Eso es un **método de filtro**: un puntaje por variable, calculado sin modelo, y un corte. Es rápido, sirve con miles de variables y no depende de qué modelo se use después. Pero al mirar las variables de una en una, tiene dos puntos ciegos. No detecta redundancia: la lluvia y la lluvia por satélite tienen puntajes casi iguales y ambas pasan el filtro, aunque la segunda no agrega nada. Y depende de la medida elegida: la temperatura influye mucho en el rendimiento, pero con un óptimo intermedio (forma de U invertida), así que su correlación lineal con el rendimiento es casi cero y el filtro la descarta.

## Definición

:::definicion[Selección por filtro]
Para cada variable $x_j$, $j = 1, \dots, p$, se calcula un **puntaje univariado** $s_j$ que mide su asociación con la respuesta $y$, por ejemplo $s_j = |r(x_j, y)|$, el valor absoluto de la correlación de Pearson. Se conservan las $k$ variables con mayor puntaje:

$$
S_k = \{\, j : s_j \text{ está entre los } k \text{ mayores} \,\},
$$

o las que superan un umbral $s_j \ge c$. El puntaje se calcula solo con los datos de entrenamiento.
:::

:::nota[Qué significa cada símbolo]
- $p$: número de variables candidatas.
- $x_j$: variable $j$; $y$: respuesta.
- $r(x_j, y)$: correlación de Pearson entre la variable y la respuesta.
- $s_j$: puntaje de la variable $j$.
- $k$: número de variables que se conservan.
- $S_k$: conjunto de índices seleccionados.
- $c$: umbral alternativo de puntaje.
:::

## Cómo usar la visualización

Las barras muestran la correlación absoluta de cada variable con el rendimiento; al reproducir se calculan una a una. Al terminar, las $k$ mejores se colorean como seleccionadas. Las lecturas comparan el error de validación de un modelo lineal con las variables seleccionadas contra el de un modelo con todas. La tabla de datos al pie indica el papel real de cada variable en la simulación.

Experimentos sugeridos: con $k = 2$, observar que el filtro elige la lluvia y su copia por satélite, que dicen lo mismo; subir $k$ y ver en qué lugar queda la temperatura.

## Ejemplo

Con las 120 parcelas de entrenamiento de la visualización principal, las correlaciones absolutas con el rendimiento son:

| Variable | $\lvert r \rvert$ |
| --- | --- |
| Lluvia | 0.71 |
| Lluvia por satélite | 0.69 |
| Fertilizante | 0.42 |
| Horas de sol | 0.28 |
| Letra del lote | 0.17 |
| Número de parcela | 0.15 |
| Temperatura | 0.12 |
| Código del vendedor | 0.03 |

1. Con $k = 3$ se conservan lluvia, lluvia por satélite y fertilizante.
2. La segunda variable es redundante: dice lo mismo que la primera.
3. Las horas de sol, que sí influyen, quedan apenas por encima de dos códigos sin relación. Con 120 parcelas, una correlación cuyo valor absoluto no pase de $2/\sqrt{120} = 0.18$ es compatible con el azar, y los dos códigos están justo en ese rango.
4. La temperatura, con efecto fuerte pero no lineal, queda en séptimo lugar, por debajo de los dos códigos.

:::figura[Con k igual a 2, el filtro elige la lluvia y su copia por satélite, y descarta el fertilizante, que sí aporta información nueva.]{componente="FeatureSelectionViz"}
```yaml
modo: filtro
k: 2
```
:::

## Propiedades

- **Es independiente del modelo y muy rápido.** Cuesta un puntaje por variable, así que escala a miles de candidatas.
- **Ignora la redundancia.** Dos variables casi idénticas reciben puntajes casi iguales y ambas pasan.
- **Ignora las interacciones y las relaciones no lineales** si el puntaje no las detecta; la información mutua corrige lo segundo, no lo primero.

:::figura[Con k igual a 5, el filtro incluye ya un código administrativo sin relación con el rendimiento, mientras la temperatura sigue fuera.]{componente="FeatureSelectionViz"}
```yaml
modo: filtro
k: 5
semilla: 5
```
:::

## Errores comunes

- **Filtrar con todos los datos antes de validar.** Si las variables se eligen viendo la respuesta de la prueba, la evaluación queda optimista; con muchas variables de ruido, alguna parecerá útil por azar.
- **Interpretar un puntaje bajo como irrelevancia.** Una correlación cercana a cero solo descarta una relación lineal.
- **Conservar todas las variables que superan el umbral sin revisar redundancias.** Varias versiones de la misma medición inflan el modelo sin mejorarlo.

:::figura[Error de interpretar un puntaje bajo como irrelevancia: con esta muestra, la temperatura, que tiene un efecto fuerte en forma de U invertida, obtiene una correlación de apenas 0.06 y queda fuera de las tres elegidas.]{componente="FeatureSelectionViz"}
```yaml
modo: filtro
k: 3
semilla: 5
```
:::

## Conexiones

El puntaje más común es el [[coeficiente-de-correlacion-de-pearson]]; para relaciones no lineales se usa la [[seleccion-por-informacion-mutua]]. Su motivación es la [[maldicion-de-la-dimensionalidad]]. A diferencia de la [[seleccion-de-caracteristicas-por-envoltura]], no ajusta el modelo para cada subconjunto, y a diferencia de la [[seleccion-de-caracteristicas-embebida]], no selecciona mientras ajusta. La redundancia entre variables se ve en la [[matriz-de-correlacion]].

## Formulario

:::formula[Puntaje por correlación]
$$
s_j = |r(x_j, y)|
$$

- $x_j$: variable candidata; $y$: respuesta.
- $r$: coeficiente de correlación de Pearson.
:::

:::formula[Conjunto seleccionado]
$$
S_k = \{\, j : s_j \text{ está entre los } k \text{ mayores} \,\}
$$

- $k$: número de variables conservadas.
- $s_j$: puntaje de la variable $j$.
:::
