---
id: imputacion-simple
titulo: Imputación simple (media, mediana, moda)
titulo_en: Simple imputation (mean, median, mode)
alias:
  - imputación por la media
  - imputación por la mediana
  - imputación por la moda
  - relleno de faltantes
modulo: 12
submodulo: '12.2'
orden: 7
nivel: basico
prerrequisitos:
  - mecanismos-de-datos-faltantes
  - moda
etiquetas:
  - datos faltantes
  - imputación
  - varianza
  - correlación
resumen: >
  La imputación simple reemplaza cada faltante de una variable por un solo valor calculado con los datos
  observados (media, mediana o moda). Conserva las filas, pero reduce la varianza y debilita las correlaciones.
formula: '\tilde{y}_i = \begin{cases} y_i & M_i = 0 \\ c & M_i = 1 \end{cases}'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: imputacion
    metodo: media
    mecanismo: MCAR
    tasa: 0.3
referencias:
  - clave: gelman-bda
  - clave: james-isl
publicado: true
---

## Intuición

Si al 30 % de las personas de una encuesta les falta el ingreso, una salida rápida es escribir en cada hueco el ingreso promedio de los que sí respondieron. La tabla queda completa, ningún programa se queja y el promedio no cambia. El problema está en lo que no se ve a simple vista: decenas de personas quedan con exactamente el mismo ingreso, como si todas ganaran lo mismo.

Ese relleno tiene tres consecuencias. El histograma desarrolla un pico artificial en el valor imputado. La dispersión baja, porque los valores imputados están todos en el centro. Y la relación con otras variables se debilita: en un diagrama de edad contra ingreso, los imputados forman una línea horizontal que no sigue la tendencia de los demás. La imputación por la mediana o por la moda tiene los mismos defectos con otro valor de relleno. Es útil como paso rápido cuando faltan pocos datos, pero cualquier análisis de variabilidad o de asociación hecho después debe tomarlo en cuenta.

## Definición

:::definicion[Imputación simple]
Sean $y_1, \dots, y_n$ los valores de una variable y $M_i$ la indicadora de que $y_i$ falta. La **imputación simple** reemplaza cada faltante por una constante $c$ calculada con los $n_{\text{obs}}$ valores observados:

$$
\tilde{y}_i = \begin{cases} y_i & \text{si } M_i = 0, \\ c & \text{si } M_i = 1, \end{cases} \qquad c \in \{\bar{y}_{\text{obs}},\ \operatorname{mediana}(y_{\text{obs}}),\ \operatorname{moda}(y_{\text{obs}})\}.
$$
:::

Con imputación por la media, la varianza de los datos completados es

$$
s^2_{\tilde{y}} = \frac{n_{\text{obs}} - 1}{n - 1}\, s^2_{\text{obs}} ,
$$

menor que la de los observados porque los $n - n_{\text{obs}}$ valores imputados no aportan ninguna desviación.

:::nota[Qué significa cada símbolo]
- $y_i$: valor de la variable en la fila $i$.
- $M_i$: indicadora de faltante; $1$ si $y_i$ falta.
- $\tilde{y}_i$: valor después de imputar.
- $c$: valor de relleno, común a todos los faltantes.
- $y_{\text{obs}}$: conjunto de valores observados; $n_{\text{obs}}$, su número.
- $\bar{y}_{\text{obs}}$: media de los observados.
- $n$: número total de filas.
- $s^2_{\text{obs}}$: varianza muestral de los observados; $s^2_{\tilde{y}}$, la de la columna completada.
:::

## Cómo usar la visualización

A la izquierda, el histograma de los ingresos observados (azul) recibe, uno por uno, los valores imputados (rojo), que caen todos en la misma barra. A la derecha, el diagrama de edad contra ingreso muestra los imputados como puntos rojos sobre una línea horizontal. Las lecturas comparan la media, la desviación estándar y la correlación con la edad antes y después de imputar.

Experimentos sugeridos: cambiar el valor de relleno a la mediana y a la moda; cambiar el mecanismo a MNAR y comparar la media real con la imputada; subir la proporción de faltantes y observar cuánto baja la desviación estándar.

## Ejemplo

Diez hogares reportan gasto semanal en transporte; faltan dos valores. Los observados son 200, 250, 300, 300, 350, 400, 450 y 550 pesos.

1. Media observada: $\bar{y}_{\text{obs}} = 2800/8 = 350$; mediana: $(300 + 350)/2 = 325$; moda: $300$.
2. Con la media, la columna queda con dos valores de 350. La media no cambia: $(2800 + 700)/10 = 350$.
3. Varianza de los observados: la suma de cuadrados de las desviaciones es $10^4\,(2.25 + 1 + 0.25 + 0.25 + 0 + 0.25 + 1 + 4) = 90000$, así que $s^2_{\text{obs}} = 90000/7 = 12857$.
4. Varianza tras imputar: los dos valores nuevos no agregan desviaciones, así que $s^2_{\tilde{y}} = 90000/9 = 10000 = \frac{7}{9}\, s^2_{\text{obs}}$. La desviación estándar baja de 113.4 a 100.

:::figura[Imputación por la media con faltantes completamente al azar: la media casi no cambia, pero aparece un pico en el histograma y la desviación estándar baja.]{componente="DataQualityTable"}
```yaml
modo: imputacion
metodo: media
mecanismo: MCAR
tasa: 0.3
```
:::

## Propiedades

- **Conserva la media (si $c$ es la media), no la varianza.** La varianza se reduce por el factor $(n_{\text{obs}} - 1)/(n - 1)$.
- **Atenúa las covarianzas.** Los imputados no varían junto con las otras variables. Con faltantes MCAR, la covarianza se multiplica aproximadamente por $(n_{\text{obs}} - 1)/(n - 1)$ y la desviación estándar por la raíz de ese factor, así que la correlación queda multiplicada por $\sqrt{(n_{\text{obs}} - 1)/(n - 1)}$.

:::figura[En el diagrama de dispersión, los ingresos imputados forman una línea horizontal y la correlación con la edad baja respecto de la observada.]{componente="DataQualityTable"}
```yaml
modo: imputacion
metodo: mediana
mecanismo: MCAR
tasa: 0.4
```
:::

- **No corrige el sesgo de MAR ni de MNAR.** Si los faltantes son los ingresos altos, la media de los observados ya es baja, y rellenar con ella perpetúa el error.

:::figura[Con faltantes MNAR, la media observada es baja y la imputación la repite en todos los huecos: la media de la columna completada sigue sesgada.]{componente="DataQualityTable"}
```yaml
modo: imputacion
metodo: media
mecanismo: MNAR
tasa: 0.3
```
:::

## Errores comunes

- **Usar los datos imputados como si fueran observados.** Los errores estándar calculados después son demasiado pequeños: la muestra parece más homogénea y más grande en información de lo que es.
- **Imputar antes de separar entrenamiento y prueba.** Si la media se calcula con toda la tabla, la información de la prueba se filtra al entrenamiento; el valor de relleno debe calcularse solo con el entrenamiento.
- **Usar la moda en variables continuas.** En una variable con decimales casi no hay valores repetidos y la moda depende del redondeo; para continuas se usa la media o la mediana.

:::figura[Error de usar la moda en una variable continua: la moda solo existe después de redondear los ingresos a enteros, y el valor de relleno depende de ese redondeo y no de los datos.]{componente="DataQualityTable"}
```yaml
modo: imputacion
metodo: moda
mecanismo: MCAR
tasa: 0.3
```
:::

## Conexiones

El valor de relleno es la [[media-aritmetica]], la [[mediana]] o la [[moda]] de los observados, y la reducción de la [[varianza-muestral]] se ve en la [[desviacion-estandar-muestral]]. Su validez depende de los [[mecanismos-de-datos-faltantes]]. La [[imputacion-por-k-vecinos-mas-cercanos]] y la [[imputacion-multiple]] mejoran este método usando las otras variables y la incertidumbre; el [[indicador-de-valor-faltante]] conserva la información de que el valor faltaba. La atenuación de la correlación se mide con el [[coeficiente-de-correlacion-de-pearson]].

## Formulario

:::formula[Imputación simple]
$$
\tilde{y}_i = \begin{cases} y_i & \text{si } M_i = 0 \\ c & \text{si } M_i = 1 \end{cases}
$$

- $y_i$: valor original; $\tilde{y}_i$: valor imputado.
- $M_i$: indicadora de faltante.
- $c$: media, mediana o moda de los observados.
:::

:::formula[Varianza tras imputar por la media]
$$
s^2_{\tilde{y}} = \frac{n_{\text{obs}} - 1}{n - 1}\, s^2_{\text{obs}}
$$

- $n_{\text{obs}}$: valores observados; $n$: total de filas.
- $s^2_{\text{obs}}$: varianza muestral de los observados.
- $s^2_{\tilde{y}}$: varianza muestral de la columna completada.
:::

:::formula[Media observada]
$$
\bar{y}_{\text{obs}} = \frac{1}{n_{\text{obs}}}\sum_{i:\,M_i = 0} y_i
$$

- $\bar{y}_{\text{obs}}$: media de los valores observados.
- $n_{\text{obs}}$: número de valores observados.
- $y_i$: valor de la fila $i$.
- $M_i$: indicadora de faltante; la suma recorre solo las filas con $M_i = 0$.
:::
