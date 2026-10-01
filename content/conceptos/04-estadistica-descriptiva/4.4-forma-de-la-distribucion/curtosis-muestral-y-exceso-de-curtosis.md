---
id: curtosis-muestral-y-exceso-de-curtosis
titulo: Curtosis muestral y exceso de curtosis
titulo_en: Sample kurtosis and excess kurtosis
alias:
  - curtosis
  - apuntamiento
  - kurtosis
modulo: 4
submodulo: '4.4'
orden: 2
nivel: basico
prerrequisitos:
  - asimetria-muestral
etiquetas:
  - forma de la distribución
  - curtosis
  - colas
  - cuarto momento
resumen: >
  La curtosis mide el peso de las colas de los datos en relación con su dispersión. El exceso de curtosis
  la compara con la normal: positivo indica colas más pesadas y negativo, colas más ligeras.
formula: 'g_2 = \frac{m_4}{m_2^{2}} - 3'
visualizacion:
  componente: DataStrip
  parametros:
    modo: forma
    enfoque: curtosis
    forma: laplace
    formas: [normal, uniforme, laplace]
    n: 600
    centro: 0
    escala: 2
    variable: Error de un sensor de posición
    unidad: mm
referencias:
  - clave: degroot
  - clave: wasserman
publicado: true
---

## Intuición

Dos sensores de posición tienen el mismo error medio, cero, y la misma desviación estándar, 2 mm. Aun así no se comportan igual. Uno comete errores siempre moderados, repartidos de manera pareja; el otro casi siempre acierta con gran precisión, pero de vez en cuando se equivoca por 8 o 10 mm. La desviación estándar no los distingue: en el segundo, los errores grandes y raros compensan los muchos errores pequeños.

La **curtosis** capta esa diferencia. Eleva las desviaciones a la cuarta potencia, con lo que los valores alejados del centro pesan muchísimo más que los cercanos, y divide entre el cuadrado de la varianza para no depender de la escala. Una normal tiene curtosis 3, así que se usa el **exceso de curtosis**, que le resta 3: es positivo cuando los datos tienen más valores extremos que una normal con la misma desviación estándar y negativo cuando tienen menos. Aunque suele describirse como "apuntamiento", lo que mide sobre todo es el peso de las colas.

## Definición

:::definicion[Curtosis y exceso de curtosis]
Con los momentos centrales $m_k = \frac{1}{n}\sum (x_i - \bar{x})^k$, la **curtosis muestral** es $b_2 = m_4 / m_2^2$ y el **exceso de curtosis** es
$$
g_2 = \frac{m_4}{m_2^{2}} - 3.
$$
La versión ajustada que reportan la mayoría de los programas es
$$
G_2 = \frac{n-1}{(n-2)(n-3)}\big((n+1)\,g_2 + 6\big), \qquad n \ge 4.
$$
:::

Se clasifica la forma como **mesocúrtica** si el exceso es cercano a cero (como la normal), **leptocúrtica** si es positivo (colas pesadas) y **platicúrtica** si es negativo (colas ligeras). El exceso de curtosis no puede ser menor que $-2$.

:::figura[Colas pesadas: rendimientos diarios simulados con una t de Student de 5 grados de libertad, cuyo exceso de curtosis poblacional es 6. El histograma supera a la normal en el centro y en las colas.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: curtosis
forma: colas-pesadas
parametro: 5
n: 800
centro: 0
escala: 1
variable: Rendimiento diario
unidad: '%'
```
:::

:::nota[Qué significa cada símbolo]
- $b_2$: curtosis muestral; vale cerca de 3 en datos normales.
- $g_2$: exceso de curtosis, $b_2 - 3$.
- $G_2$: exceso de curtosis ajustado por tamaño de muestra.
- $m_4$: promedio de las desviaciones a la cuarta potencia.
- $m_2$: varianza con denominador $n$.
- $n$: número de datos; $x_i$: observaciones; $\bar{x}$: su media.
:::

## Cómo usar la visualización

La muestra de errores del sensor crece hasta 600 observaciones y se compara con una normal de la misma media y desviación estándar. El encabezado calcula el exceso de curtosis con los momentos de la muestra. El selector cambia la forma de la población entre normal, uniforme y Laplace, las tres con desviación estándar de 2 mm.

Con Laplace, el histograma es más alto que la normal en el centro y más alto también en las colas, y menos alto en los "hombros": el exceso de curtosis se acerca a 3. Con la uniforme, el histograma es plano y sin colas, y el exceso es negativo, cerca de $-1.2$. Con la normal, oscila alrededor de 0.

## Ejemplo

Los tiempos, en segundos, que nueve usuarios tardaron en llenar un formulario fueron 10, 12, 12, 13, 13, 14, 14, 15 y 30.

1. Media: $\bar{x} = 133/9 \approx 14.78$.
2. Momentos: $m_2 \approx 30.84$ y $m_4 \approx 6039$. El usuario de 30 segundos aporta $(30 - 14.78)^4 \approx 53{,}692$ de los $54{,}353$ que suman las cuartas potencias.
3. Exceso de curtosis: $g_2 = 6039 / 30.84^2 - 3 \approx 6.35 - 3 = 3.35$.
4. Ajustado: $G_2 = \frac{8}{7 \cdot 6}\big(10 \cdot 3.35 + 6\big) \approx 7.52$. Las colas son mucho más pesadas que las de una normal, y prácticamente todo se debe a un solo dato.

:::figura[Los nueve tiempos del ejemplo con su desviación estándar: casi toda la variabilidad, y casi toda la curtosis, viene del usuario de 30 segundos.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [10, 12, 12, 13, 13, 14, 14, 15, 30]
medida: desviacion
lecturas: [desviacion, rango]
cuadrados: true
variable: Tiempo de llenado
unidad: s
decimales: 0
```
:::

## Propiedades

- **Valores de referencia:** el exceso de curtosis es 0 en la normal, $-1.2$ en la uniforme, 3 en la Laplace y $6/(\nu - 4)$ en la t de Student con $\nu > 4$ grados de libertad.
- **Cota inferior:** $g_2 \ge g_1^2 - 2$; en particular, nunca es menor que $-2$.
- **Invariante ante cambios de escala y de origen**, como la asimetría.
- **Dominada por las colas:** al elevar a la cuarta potencia, los datos alejados del centro determinan casi todo el valor.
- **Muy variable en muestras pequeñas:** bajo normalidad, su error estándar es cercano a $\sqrt{24/n}$; con 50 datos, unos 0.7.

:::figura[Propiedad de colas ligeras: errores uniformes entre -3.5 y 3.5 mm. El histograma es plano, no hay datos en las colas de la normal y el exceso de curtosis es negativo.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: curtosis
forma: uniforme
n: 600
centro: 0
escala: 2
variable: Error de redondeo
unidad: mm
```
:::

## Errores comunes

- **Decir que la curtosis mide qué tan puntiaguda es la distribución.** Dos distribuciones pueden tener el mismo pico y distinta curtosis por sus colas, y viceversa. Lo que domina son las colas.
- **Confundir curtosis con exceso de curtosis.** Algunos programas reportan $b_2$, que vale 3 para la normal, y otros $g_2$ o $G_2$, que valen 0. Hay que revisar cuál se usa antes de comparar.
- **Leer como curtosis la presencia de dos grupos.** Una mezcla de dos grupos bien separados tiene exceso negativo, aunque su histograma tenga dos picos marcados.

:::figura[Error de interpretar la curtosis como picos: una mezcla de dos grupos separados por 3 desviaciones estándar tiene dos picos, pero su exceso de curtosis poblacional es cercano a -0.96.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: curtosis
forma: mezcla
parametro: 3
n: 800
centro: 50
escala: 5
variable: Calificación
unidad: puntos
```
:::

## Conexiones

La curtosis es el momento de cuarto orden, como la [[asimetria-muestral]] es el de tercer orden, y se escala con la [[varianza-muestral]]. Su interpretación correcta está en las [[colas-ligeras-y-pesadas-en-datos]]. En finanzas, el exceso de curtosis de los rendimientos explica por qué las pérdidas extremas son más frecuentes de lo que predice una normal.

## Formulario

:::formula[Curtosis muestral]
$$
b_2 = \frac{m_4}{m_2^{2}}
$$

- $m_4$: cuarto momento central; $m_2$: segundo momento central.
:::

:::formula[Exceso de curtosis]
$$
g_2 = \frac{m_4}{m_2^{2}} - 3
$$

- $3$: curtosis de la distribución normal.
:::

:::formula[Exceso ajustado]
$$
G_2 = \frac{n-1}{(n-2)(n-3)}\big((n+1)\,g_2 + 6\big)
$$

- $n$: número de datos, al menos 4.
:::

:::formula[Cota inferior]
$$
g_2 \ge g_1^2 - 2
$$

- $g_1$: coeficiente de asimetría.
:::

:::formula[Exceso de curtosis de la t de Student]
$$
\gamma_2 = \frac{6}{\nu - 4}, \qquad \nu > 4
$$

- $\nu$: grados de libertad.
- $\gamma_2$: exceso de curtosis de la población.
:::
