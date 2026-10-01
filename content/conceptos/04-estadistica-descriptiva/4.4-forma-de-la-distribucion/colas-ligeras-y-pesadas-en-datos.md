---
id: colas-ligeras-y-pesadas-en-datos
titulo: Colas ligeras y pesadas en datos
titulo_en: Light and heavy tails in data
alias:
  - colas gruesas
  - eventos extremos
  - heavy tails
modulo: 4
submodulo: '4.4'
orden: 4
nivel: basico
prerrequisitos:
  - curtosis-muestral-y-exceso-de-curtosis
  - puntuaciones-z-muestrales
etiquetas:
  - forma de la distribución
  - colas
  - valores extremos
  - riesgo
resumen: >
  Las colas describen con qué frecuencia aparecen valores lejanos al centro. En datos de colas pesadas
  los extremos son mucho más frecuentes que en una normal con la misma desviación estándar.
formula: '\hat{p}_k = \frac{1}{n}\,\#\{i : |x_i - \bar{x}| > k\,s\}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: forma
    enfoque: colas
    forma: colas-pesadas
    parametro: 3
    n: 1000
    centro: 0
    escala: 1
    variable: Rendimiento diario de una acción
    unidad: '%'
referencias:
  - clave: tsay
    capitulo: '1'
  - clave: coles
publicado: true
---

## Intuición

Si los rendimientos diarios de una acción siguieran una distribución normal, una caída de más de tres desviaciones estándar ocurriría en un día de cada 370, aproximadamente una vez cada año y medio de operaciones. En los mercados reales esas caídas aparecen varias veces al año. Los datos financieros tienen **colas pesadas**: los valores muy alejados del centro son mucho más frecuentes de lo que sugiere la normal.

Las colas de una distribución son las zonas lejanas al centro, y su "peso" es la probabilidad que acumulan. Una variable con **colas ligeras**, como el error de redondeo o la estatura, casi nunca produce valores extremos. Una con colas pesadas, como los rendimientos financieros, las pérdidas por siniestros o el tamaño de las ciudades, produce de vez en cuando valores enormes. Para muchas decisiones, como calcular reservas de un seguro o el riesgo de una inversión, lo que más importa no es el centro de los datos sino justamente sus colas.

## Definición

:::definicion[Peso de las colas en datos]
Para un umbral $k > 0$, la **fracción en las colas** de una muestra es
$$
\hat{p}_k = \frac{1}{n}\,\#\{i : |x_i - \bar{x}| > k\,s\}.
$$
Los datos tienen **colas pesadas** respecto a la normal si $\hat{p}_k$ es claramente mayor que la probabilidad normal $2\big(1 - \Phi(k)\big)$ para $k$ grandes (por ejemplo, $k = 3$, donde la normal da 0.27 %), y **colas ligeras** si es claramente menor.
:::

Otros indicadores son el exceso de curtosis (positivo con colas pesadas), los gráficos Q-Q (los puntos se alejan de la recta en los extremos) y los cuantiles extremos comparados con los de una normal. En teoría de probabilidad, una distribución de colas pesadas en sentido estricto es aquella cuya cola decae más lentamente que cualquier exponencial.

:::figura[Colas ligeras: un error de redondeo uniforme. Ningún dato llega a tres desviaciones estándar de la media; la fracción en las colas es 0 %, menor que el 0.27 % de la normal.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: colas
forma: uniforme
n: 1000
centro: 0
escala: 0.29
variable: Error de redondeo
unidad: cm
```
:::

:::nota[Qué significa cada símbolo]
- $\hat{p}_k$: fracción de datos a más de $k$ desviaciones estándar de la media.
- $k$: umbral, en desviaciones estándar.
- $x_i$: observaciones; $\bar{x}$: media; $s$: desviación estándar; $n$: número de datos.
- $\#\{\cdot\}$: número de observaciones que cumplen la condición.
- $\Phi$: función de distribución de la normal estándar.
:::

## Cómo usar la visualización

La muestra de 1000 rendimientos diarios proviene de una t de Student con 3 grados de libertad, un modelo frecuente para rendimientos. Las líneas verticales punteadas están a tres desviaciones estándar de la media; el encabezado compara la fracción de datos fuera de ellas con la de una normal, y el panel muestra cuántos datos quedan fuera del eje.

La fracción observada ronda 1.4 %, unas cinco veces el 0.27 % normal. Al subir los grados de libertad a 30, la t se parece a la normal y la fracción baja hacia 0.3 %. Al bajarlos a 2, aparecen valores tan extremos que algunos quedan fuera del eje.

## Ejemplo

Una aseguradora modela el rendimiento diario de su portafolio, con desviación estándar de 1 %.

1. Con un modelo normal, la probabilidad de un movimiento de más de 3 % en un día es $2(1 - \Phi(3)) \approx 0.0027$; en 250 días hábiles se esperan $250 \cdot 0.0027 \approx 0.7$ días así, menos de uno al año.
2. Con una t de 3 grados de libertad reescalada para tener la misma desviación estándar, la misma probabilidad es cercana a $0.0138$; en 250 días se esperan unos $3.5$ días.
3. La diferencia, unas cinco veces más días extremos, cambia el capital que debe reservarse para cubrir pérdidas, aunque ambos modelos tengan la misma media y la misma desviación estándar.

:::figura[El modelo del ejemplo: rendimientos de una t de 3 grados de libertad. El panel compara la fracción de días a más de 3 desviaciones estándar con el 0.27 % normal.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: colas
forma: colas-pesadas
parametro: 3
n: 2000
centro: 0
escala: 0.58
variable: Rendimiento del portafolio
unidad: '%'
semilla: 77
```
:::

## Propiedades

- **La desviación estándar no basta:** dos variables con la misma desviación estándar pueden tener frecuencias de valores extremos muy distintas.
- **Momentos infinitos:** en distribuciones de colas muy pesadas, como la t con 4 o menos grados de libertad, la curtosis poblacional es infinita; con 2 o menos, incluso la varianza lo es, y la desviación estándar muestral no se estabiliza al crecer $n$.
- **Los extremos dominan sumas y promedios:** con colas pesadas, unos cuantos valores explican buena parte del total, como ocurre con las pérdidas por catástrofes.
- **Cuantiles extremos lejanos:** el percentil 99.9 de datos con colas pesadas está mucho más lejos del centro que el de una normal con la misma dispersión.

:::figura[Propiedad de los momentos infinitos: con 2 grados de libertad, la t no tiene varianza finita. Al reiniciar con otras semillas, la desviación estándar muestral cambia mucho y aparecen datos fuera del eje.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: colas
forma: colas-pesadas
parametro: 2
n: 1000
centro: 0
escala: 1
variable: Rendimiento diario
unidad: '%'
```
:::

## Errores comunes

- **Suponer normalidad para estimar el riesgo.** Subestima sistemáticamente la frecuencia de pérdidas grandes en datos financieros, de seguros o de fallas.
- **Eliminar los extremos como si fueran errores.** En datos de colas pesadas, los valores extremos son parte legítima del fenómeno; quitarlos esconde justo lo que más importa.
- **Confundir colas pesadas con asimetría.** Una distribución puede ser simétrica y tener colas pesadas en ambos lados, como la t de Student o la Laplace.

:::figura[Colas pesadas y simétricas: errores de Laplace. Hay más datos que en la normal a más de tres desviaciones estándar en ambos lados, aunque la asimetría es casi cero.]{componente="DataStrip"}
```yaml
modo: forma
enfoque: colas
forma: laplace
n: 1500
centro: 0
escala: 1
variable: Error de pronóstico
unidad: grados
```
:::

## Conexiones

El peso de las colas es lo que mide en el fondo la [[curtosis-muestral-y-exceso-de-curtosis|curtosis]], y se detecta con las [[puntuaciones-z-muestrales]] de los valores extremos. Contrasta con la [[asimetria-muestral]], que mide el desequilibrio entre las dos colas. La teoría de valores extremos estudia el comportamiento de las colas y el máximo de muestras grandes.

## Formulario

:::formula[Fracción en las colas]
$$
\hat{p}_k = \frac{1}{n}\,\#\{i : |x_i - \bar{x}| > k\,s\}
$$

- $k$: umbral en desviaciones estándar.
- $\bar{x}$, $s$: media y desviación estándar de los datos.
:::

:::formula[Referencia normal]
$$
P(|Z| > k) = 2\big(1 - \Phi(k)\big), \qquad P(|Z| > 3) \approx 0.0027
$$

- $Z$: variable normal estándar.
- $\Phi$: su función de distribución.
:::

:::formula[Días extremos esperados]
$$
\text{días esperados} = N_{\text{días}} \cdot p
$$

- $N_{\text{días}}$: número de días del periodo.
- $p$: probabilidad diaria de un movimiento extremo.
:::
