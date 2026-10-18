---
id: teorema-de-cochran
titulo: Teorema de Cochran
titulo_en: Cochran's theorem
alias:
  - descomposición de sumas de cuadrados
  - independencia de media y varianza muestrales
modulo: 6
submodulo: '6.1'
orden: 5
nivel: avanzado
prerrequisitos:
  - distribucion-de-la-varianza-muestral
  - distribucion-de-la-media-muestral
etiquetas:
  - inferencia
  - sumas de cuadrados
  - chi cuadrada
  - independencia
resumen: >
  Si una suma de cuadrados de normales estándar se descompone en formas cuadráticas cuyos rangos suman n,
  las partes son chi cuadradas independientes. Así, media y varianza muestrales normales son independientes.
formula: '\sum_{i=1}^{n} \frac{(X_i - \mu)^2}{\sigma^2} = \underbrace{\frac{(n - 1)S^2}{\sigma^2}}_{\chi^2_{n-1}} + \underbrace{\frac{n(\bar{X} - \mu)^2}{\sigma^2}}_{\chi^2_1}'
visualizacion:
  componente: SamplingLab
  parametros:
    modo: cochran
    poblacion: normal
    n: 8
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: hastie-esl
publicado: true
---

## Intuición

La variación de una muestra alrededor del verdadero valor medio puede contarse de dos maneras. Una parte se debe a que los datos se dispersan entre sí, alrededor de su propia media. La otra se debe a que esa media muestral no cayó exactamente en el valor verdadero. Las dos partes suman el total, como las piezas de un rompecabezas: es solo álgebra.

Lo notable ocurre cuando los datos son normales. Entonces las dos piezas no solo suman el total: son independientes, y cada una tiene una distribución chi cuadrada conocida, con tantos grados de libertad como dimensiones ocupa. La consecuencia más usada es que, en una muestra normal, saber cuánto vale la media no dice nada sobre cuánto vale la varianza muestral. Esa independencia es la que permite construir la distribución t y todo el análisis de varianza. Con poblaciones asimétricas falla: muestras con media alta tienden a tener varianza alta.

## Definición

:::teorema[Teorema de Cochran]
Sean $Z_1, \dots, Z_n$ independientes $\mathcal{N}(0, 1)$, $\mathbf{z} = (Z_1, \dots, Z_n)^\top$, y supongamos que
$$
\mathbf{z}^\top\mathbf{z} = \sum_{i=1}^{n} Z_i^2 = Q_1 + \dots + Q_k,\qquad Q_j = \mathbf{z}^\top \mathbf{A}_j \mathbf{z},
$$
con $\mathbf{A}_j$ matrices simétricas semidefinidas positivas de rangos $r_j$. Si $r_1 + \dots + r_k = n$, entonces $Q_1, \dots, Q_k$ son independientes y $Q_j \sim \chi^2_{r_j}$.
:::

Caso de una muestra: con $X_i \sim \mathcal{N}(\mu, \sigma^2)$ y $Z_i = (X_i - \mu)/\sigma$,
$$
\sum_{i=1}^{n} \frac{(X_i - \mu)^2}{\sigma^2} = \frac{(n - 1)S^2}{\sigma^2} + \frac{n(\bar{X} - \mu)^2}{\sigma^2},
$$
donde las formas tienen rangos $n - 1$ y $1$. Por lo tanto $(n - 1)S^2/\sigma^2 \sim \chi^2_{n-1}$, $n(\bar{X} - \mu)^2/\sigma^2 \sim \chi^2_1$, y $\bar{X}$ y $S^2$ son independientes.

:::nota[Qué significa cada símbolo]
- $Z_i$: normales estándar independientes; $\mathbf{z}$: el vector que las agrupa; $\top$: transpuesta.
- $Q_j$: formas cuadráticas; $\mathbf{A}_j$: sus matrices simétricas; $r_j$: rango de $\mathbf{A}_j$; $k$: número de partes.
- $\chi^2_{r}$: chi cuadrada con $r$ grados de libertad.
- $X_i$: observaciones normales con media $\mu$ y varianza $\sigma^2$; $\bar{X}$: media muestral; $S^2$: varianza muestral; $n$: tamaño.
:::

## Cómo usar la visualización

Cada muestra agrega un punto con su media en el eje horizontal y su varianza en el vertical. A la derecha, la suma total de cuadrados de la última muestra se compara con sus dos partes apiladas; el encabezado muestra la igualdad con los números.

Controles: **Forma de la población** y **Tamaño de cada muestra**.

Experimentos sugeridos:

1. Con la población normal, observar que la nube no tiene inclinación: la correlación entre media y varianza es cercana a cero.
2. Cambiar a la población exponencial: la nube se inclina hacia arriba a la derecha; muestras con media alta tienen varianza alta.
3. En cualquier población, comprobar en las barras que las dos partes suman exactamente el total: la descomposición es algebraica.

## Ejemplo

Muestra de $n = 4$ observaciones, 3, 7, 8 y 2, con $\mu = 4$ supuesto conocido.

1. Media muestral: $\bar{x} = 20/4 = 5$.
2. Total: $\sum (x_i - 4)^2 = 1 + 9 + 16 + 4 = 30$.
3. Dentro: $\sum (x_i - 5)^2 = 4 + 4 + 9 + 9 = 26$, con $n - 1 = 3$ grados de libertad.
4. Media: $n(\bar{x} - \mu)^2 = 4 \cdot 1 = 4$, con 1 grado de libertad.
5. $26 + 4 = 30$. Si los datos vinieran de $\mathcal{N}(4, \sigma^2)$, $26/\sigma^2$ y $4/\sigma^2$ serían chi cuadradas independientes con 3 y 1 grados de libertad.

:::figura[La descomposición para muestras de 4 normales: las barras de la derecha muestran la parte dentro de la muestra y la parte de la media.]{componente="SamplingLab"}
```yaml
modo: cochran
poblacion: normal
n: 4
```
:::

## Propiedades

- **La identidad es algebraica,** válida para cualquier dato; la independencia y las distribuciones chi cuadrada requieren normalidad.
- **Los grados de libertad son rangos:** la parte dentro de la muestra vive en un subespacio de dimensión $n - 1$ (los desvíos suman cero) y la de la media en uno de dimensión 1.
- **Caracteriza a la normal:** la independencia de $\bar{X}$ y $S^2$ ocurre solo si la población es normal.
- **Fundamento del análisis de varianza,** donde la suma total se reparte en sumas entre grupos y dentro de grupos.

:::figura[Población uniforme, simétrica pero no normal: la correlación entre media y varianza es cercana a cero, aunque la nube muestra dependencia en su forma de arco.]{componente="SamplingLab"}
```yaml
modo: cochran
poblacion: uniforme
n: 5
```
:::

## Errores comunes

- **Creer que la independencia vale siempre.** Con poblaciones asimétricas, la media y la varianza muestrales están correlacionadas.
- **Confundir correlación cero con independencia.** En poblaciones simétricas no normales la correlación puede ser cero y aun así haber dependencia.
- **Contar mal los grados de libertad.** Al estimar $\mu$ con $\bar{X}$ se pierde un grado: la parte dentro de la muestra tiene $n - 1$, no $n$.

:::figura[Población lognormal, muy asimétrica: media y varianza muestrales suben juntas.]{componente="SamplingLab"}
```yaml
modo: cochran
poblacion: lognormal
n: 8
```
:::

## Conexiones

El teorema explica por qué la [[distribucion-de-la-varianza-muestral]] es chi cuadrada y por qué es independiente de la [[distribucion-de-la-media-muestral]]. Usa la [[distribucion-chi-cuadrada]] y la descomposición de sumas de cuadrados; esa independencia produce la [[distribucion-t-de-student]] del [[estadistico-pivote]] y es la base del análisis de varianza.

## Formulario

:::formula[Teorema de Cochran]
$$
\mathbf{z}^\top\mathbf{z} = \sum_{j=1}^{k} \mathbf{z}^\top\mathbf{A}_j\mathbf{z},\quad \sum_{j=1}^{k} r_j = n \Longrightarrow Q_j \sim \chi^2_{r_j}\ \text{independientes}
$$

- $\mathbf{z}$: vector de normales estándar independientes; $\mathbf{A}_j$: matrices simétricas; $r_j$: sus rangos; $Q_j = \mathbf{z}^\top\mathbf{A}_j\mathbf{z}$.
:::

:::formula[Descomposición de una muestra]
$$
\sum_{i=1}^{n} (X_i - \mu)^2 = \sum_{i=1}^{n} (X_i - \bar{X})^2 + n(\bar{X} - \mu)^2
$$

- $X_i$: observaciones; $\mu$: media de la población; $\bar{X}$: media muestral; $n$: tamaño.
:::

:::formula[Consecuencias bajo normalidad]
$$
\frac{(n - 1)S^2}{\sigma^2} \sim \chi^2_{n-1},\qquad \frac{n(\bar{X} - \mu)^2}{\sigma^2} \sim \chi^2_1,\qquad \bar{X} \perp S^2
$$

- $S^2$: varianza muestral; $\sigma^2$: varianza de la población; $\perp$: independencia.
:::
