---
id: codificacion-por-objetivo
titulo: Codificación por objetivo (target encoding)
titulo_en: Target encoding
alias:
  - target encoding
  - codificación por la media del objetivo
  - mean encoding
  - codificación de impacto
modulo: 12
submodulo: '12.3'
orden: 9
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - media-ponderada
etiquetas:
  - variables categóricas
  - codificación
  - suavizamiento
  - fuga de información
resumen: >
  La codificación por objetivo reemplaza cada categoría por la media de la variable objetivo en esa categoría,
  suavizada hacia la media global. Debe calcularse fuera de pliegue para no filtrar el objetivo de cada fila.
formula: '\tilde{x}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m}'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: objetivo
    caso: colonias
    m: 10
referencias:
  - clave: hastie-esl
  - clave: murphy
publicado: true
---

## Intuición

Un modelo de precios de vivienda tiene la colonia como variable, con cientos de colonias distintas. La codificación one-hot crearía cientos de columnas, la mayoría con muy pocas casas. Una idea compacta es usar una sola columna: para cada colonia, el precio promedio por metro cuadrado de las casas de esa colonia. Esa columna resume justamente lo que interesa de la colonia.

El problema aparece en las colonias pequeñas. Si una colonia tiene una sola casa, su "promedio" es el precio de esa casa: el modelo verá una variable que coincide con la respuesta y le dará una importancia que no merece. La **codificación por objetivo** corrige esto de dos formas. Primero, suaviza: mezcla el promedio de la colonia con el promedio general, dando más peso al general cuanto menos casas tiene la colonia, como si se agregaran $m$ casas ficticias con el precio típico. Segundo, calcula la codificación de cada casa sin usar esa misma casa, con datos de otros pliegues, para que la respuesta de una fila nunca entre en su propia variable.

## Definición

:::definicion[Codificación por objetivo suavizada]
Sea $c$ una categoría con $n_c$ filas y media de la variable objetivo $\bar{y}_c$, y sea $\bar{y}$ la media global. El **valor codificado** es

$$
\tilde{x}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m} = w_c\,\bar{y}_c + (1 - w_c)\,\bar{y}, \qquad w_c = \frac{n_c}{n_c + m}.
$$

En la versión **fuera de pliegue**, los datos se dividen en $F$ pliegues y cada fila se codifica con $\bar{y}_c$ y $\bar{y}$ calculados solo con los otros $F - 1$ pliegues.
:::

:::nota[Qué significa cada símbolo]
- $c$: categoría, por ejemplo una colonia.
- $n_c$: número de filas de la categoría $c$.
- $\bar{y}_c$: media de la variable objetivo en la categoría $c$.
- $\bar{y}$: media global de la variable objetivo.
- $m$: fuerza del suavizamiento, como un número de observaciones ficticias con la media global.
- $w_c$: peso que recibe la media de la categoría; tiende a 1 cuando $n_c$ es grande.
- $\tilde{x}_c$: valor que sustituye a la categoría.
- $F$: número de pliegues.
:::

## Cómo usar la visualización

Cada barra es una colonia con su número de casas debajo. La raya gris es la media cruda de la colonia y la barra, el valor codificado; la línea punteada naranja es la media global. Al reproducir, las barras pasan de la media cruda al valor suavizado: las colonias grandes casi no se mueven y las de una o dos casas se acercan mucho a la media global. Las lecturas comparan la correlación entre la variable codificada y el precio dentro de la muestra y fuera de pliegue.

Experimentos sugeridos: poner $m = 0$ y ver que la correlación dentro de la muestra es alta por las colonias pequeñas; activar el cálculo fuera de pliegue y comparar.

## Ejemplo

La media global del precio es 38 mil pesos por metro cuadrado y $m = 10$.

1. Centro tiene 60 casas con media 32: $\tilde{x} = (60 \cdot 32 + 10 \cdot 38)/70 = 2300/70 = 32.86$. Casi no cambia: $w = 60/70 = 0.86$.
2. Altavista tiene una casa de 52: $\tilde{x} = (1 \cdot 52 + 10 \cdot 38)/11 = 432/11 = 39.27$. Queda cerca de la media global: $w = 1/11 = 0.09$.
3. Sin suavizar, Altavista valdría 52, exactamente el precio de su única casa: una fuga perfecta de la respuesta.
4. Fuera de pliegue, la casa de Altavista no tiene vecinos de su colonia en los otros pliegues, así que recibe la media global de esos pliegues.

:::figura[Colonias sin suavizamiento: las de una o dos casas conservan su media cruda, que es casi la respuesta misma.]{componente="FeatureEngineeringViz"}
```yaml
modo: objetivo
caso: colonias
m: 0
```
:::

## Propiedades

- **Es una media ponderada entre lo local y lo global.** Las categorías grandes confían en su propia media; las pequeñas, en la global.
- **Produce una sola columna** por variable categórica, sin importar cuántas categorías haya.

:::figura[Marcas de autos con suavizamiento fuerte, m igual a 30: incluso las marcas medianas se acercan a la media global.]{componente="FeatureEngineeringViz"}
```yaml
modo: objetivo
caso: marcas
m: 30
```
:::

- **Dentro de la muestra sobreestima la utilidad de la variable.** La correlación con el objetivo es mayor dentro de la muestra que fuera de pliegue, y la diferencia crece cuanto menor es $m$ y más categorías pequeñas hay.

:::figura[Cálculo fuera de pliegue: cada fila se codifica sin su propio precio, y la correlación de la variable con el objetivo baja a un valor realista.]{componente="FeatureEngineeringViz"}
```yaml
modo: objetivo
caso: colonias
m: 0
fueraDePliegue: true
```
:::

## Errores comunes

- **Codificar con todos los datos antes de separar entrenamiento y prueba.** La media de cada categoría incluye las respuestas de la prueba y la evaluación queda optimista.
- **No suavizar.** Las categorías con una sola fila reciben como valor su propia respuesta, y el modelo aprende a copiarla.
- **Usarla con un objetivo que cambia en el tiempo.** Si los precios suben, una media calculada con años anteriores queda desactualizada para las predicciones nuevas.

## Conexiones

El valor codificado es una [[media-ponderada]] entre la media de la categoría y la [[media-aritmetica]] global, la misma idea de contracción que aparece en la estadística bayesiana. Es una alternativa compacta a la [[codificacion-one-hot]] y comparte con la [[codificacion-por-frecuencia]] la ventaja de usar una sola columna. Calcularla con los datos de prueba es una forma de fuga de información que se estudia en el submódulo de problemas del conjunto de datos.

## Formulario

:::formula[Codificación suavizada]
$$
\tilde{x}_c = \frac{n_c\,\bar{y}_c + m\,\bar{y}}{n_c + m}
$$

- $n_c$: filas de la categoría; $\bar{y}_c$: su media del objetivo.
- $\bar{y}$: media global; $m$: fuerza del suavizamiento.
:::

:::formula[Peso de la media de la categoría]
$$
w_c = \frac{n_c}{n_c + m}
$$

- $w_c$: fracción del valor codificado que viene de la propia categoría.
:::
