---
id: distribucion-muestral
titulo: Distribución muestral
titulo_en: Sampling distribution
alias:
  - distribución en el muestreo
  - distribución de un estadístico
modulo: 6
submodulo: '6.1'
orden: 1
nivel: basico
prerrequisitos:
  - parametro-y-estadistico
relaciones:
  - tipo: relacionado
    id: teorema-central-del-limite
etiquetas:
  - inferencia
  - estadísticos
  - muestreo repetido
  - variabilidad
resumen: >
  La distribución muestral de un estadístico es la distribución de los valores que toma al calcularlo en
  todas las muestras posibles de un mismo tamaño. Describe cuánto varía de muestra en muestra y es la base
  de toda la inferencia.
formula: 'T = t(X_1, \dots, X_n),\qquad F_T(u) = P\big(t(X_1, \dots, X_n) \le u\big)'
visualizacion:
  componente: SamplingSimulator
  parametros:
    poblacion:
      distribucion: exponencial
      valores:
        lambda: 0.5
    estadistico: media
    estadisticos: [media, mediana, maximo]
    n: 10
    poblacionEditable: false
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: wasserman
    capitulo: '5'
publicado: true
---

## Intuición

Una central telefónica mide el tiempo entre llamadas. Un analista toma 10 tiempos y calcula su promedio: 1.8 minutos. Otro analista toma otros 10 tiempos y obtiene 2.3. Un tercero, 2.1. Cada muestra da un promedio distinto, aunque todas vienen del mismo proceso. Si se repitiera el muestreo miles de veces y se anotaran todos los promedios, se obtendría una distribución: la **distribución muestral** del promedio.

Esa distribución no describe los tiempos entre llamadas, sino los promedios de 10 tiempos. Es más angosta que la de los datos, porque al promediar los valores grandes y pequeños se compensan, y tiende a parecerse a una campana aunque los tiempos individuales sean muy asimétricos. Lo mismo puede hacerse con cualquier estadístico: la mediana, el máximo, la varianza. La distribución muestral responde la pregunta central de la inferencia: si la muestra hubiera sido otra, ¿cuánto habría cambiado el resultado?

## Definición

:::definicion[Distribución muestral]
Sea $X_1, \dots, X_n$ una muestra aleatoria de una población con distribución $F$ y sea $T = t(X_1, \dots, X_n)$ un estadístico, es decir, una función de la muestra que no depende de parámetros desconocidos. La **distribución muestral** de $T$ es su distribución de probabilidad:
$$
F_T(u) = P\big(t(X_1, \dots, X_n) \le u\big),
$$
calculada bajo el supuesto de que las $X_i$ son independientes y siguen $F$.
:::

Interpretación frecuentista: es la distribución de los valores de $T$ que se obtendrían al repetir indefinidamente el muestreo con el mismo tamaño $n$. Depende de la población $F$, del estadístico $t$ y del tamaño $n$.

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: muestra aleatoria; $n$: tamaño de la muestra.
- $F$: distribución de la población.
- $t$: la regla de cálculo del estadístico; $T$: el estadístico como variable aleatoria.
- $F_T(u)$: función de distribución del estadístico, probabilidad de que $T$ no supere $u$.
- $P(\cdot)$: probabilidad.
:::

## Cómo usar la visualización

Arriba se ve la población, una exponencial con media de 2 minutos, y los 10 valores de la muestra más reciente. Cada muestra agrega su estadístico al histograma de abajo, que se construye en vivo; la curva es la distribución teórica o su aproximación cuando se conoce.

Controles: **Tamaño de cada muestra** y **Estadístico** (media, mediana o máximo).

Experimentos sugeridos:

1. Con la media, comparar la forma del histograma con la población: es mucho más simétrica y angosta.
2. Cambiar a la mediana: su distribución también se concentra, pero alrededor de 1.39 minutos, la mediana de la población, no alrededor de 2.
3. Elegir el máximo y aumentar n: su distribución se desplaza hacia la derecha en lugar de concentrarse.

## Ejemplo

Una población de cuatro valores, 2, 4, 6 y 8, con media $\mu = 5$. Se toman muestras de tamaño 2 con reemplazo: hay $4^2 = 16$ muestras igualmente probables.

1. Medias posibles: 2 (una muestra), 3 (dos), 4 (tres), 5 (cuatro), 6 (tres), 7 (dos), 8 (una).
2. Distribución muestral de $\bar{X}$: $P(\bar{X} = 5) = 4/16 = 0.25$, $P(\bar{X} = 4) = P(\bar{X} = 6) = 3/16$, y así sucesivamente.
3. Media de la distribución muestral: $\sum \bar{x}\,P(\bar{X} = \bar{x}) = 5 = \mu$.
4. Varianza: la población tiene $\sigma^2 = 5$, y la de las medias es $5/2 = 2.5$, la mitad, porque $n = 2$.

:::figura[Las 16 muestras del ejemplo: frecuencia de cada valor de la media muestral, una distribución triangular centrada en 5.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: ['2', '3', '4', '5', '6', '7', '8']
valores: [1, 2, 3, 4, 3, 2, 1]
variable: Número de muestras
vista: barras
```
:::

## Propiedades

- **Depende de tres cosas:** la población, el estadístico y el tamaño de muestra.
- **Su dispersión es el error estándar** del estadístico, la medida de su precisión.
- **Cambia con n:** para la media se concentra como $1/\sqrt{n}$; para otros estadísticos, de otras maneras.
- **Rara vez se conoce exacta:** se obtiene por cálculo cuando la población es normal, por aproximación con el teorema central del límite, o por simulación.

:::figura[Una población normal: la distribución muestral de la media es exactamente normal para cualquier n.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: normal
  valores:
    mu: 0
    sigma: 2
estadistico: media
n: 5
poblacionEditable: false
```
:::

## Errores comunes

- **Confundirla con la distribución de los datos.** Los datos varían alrededor de $\mu$ con desviación $\sigma$; la media muestral varía mucho menos.
- **Creer que basta una muestra para verla.** Con una muestra se observa un solo valor del estadístico; su distribución muestral es una construcción teórica o de simulación.
- **Suponer que todos los estadísticos se vuelven normales.** El máximo, por ejemplo, no se acerca a una normal al crecer n.

:::figura[El máximo de muestras de una población uniforme: su distribución muestral se acumula junto al extremo superior y no tiene forma de campana.]{componente="SamplingSimulator"}
```yaml
poblacion:
  distribucion: uniforme
  valores:
    a: 0
    b: 4
estadistico: maximo
n: 8
poblacionEditable: false
teoria: false
```
:::

## Conexiones

La distribución muestral es la de un [[parametro-y-estadistico|estadístico]] calculado sobre una muestra de una [[poblacion-y-muestra|población]]. Su desviación es el [[error-estandar]]. Los casos más importantes son la [[distribucion-de-la-media-muestral]], la [[distribucion-de-la-varianza-muestral]] y la [[distribucion-muestral-de-una-proporcion]]. El [[teorema-central-del-limite]] da su forma aproximada para la media, y los [[estadistico-pivote|estadísticos pivote]] permiten usarla para construir intervalos y pruebas.

## Formulario

:::formula[Estadístico]
$$
T = t(X_1, \dots, X_n)
$$

- $t$: función de la muestra que no depende de parámetros desconocidos; $X_1, \dots, X_n$: muestra aleatoria.
:::

:::formula[Distribución muestral]
$$
F_T(u) = P\big(t(X_1, \dots, X_n) \le u\big)
$$

- $F_T$: función de distribución del estadístico; $u$: un valor cualquiera.
:::

:::formula[Media y varianza de la media muestral]
$$
\mathbb{E}[\bar{X}] = \mu,\qquad \operatorname{Var}(\bar{X}) = \frac{\sigma^2}{n}
$$

- $\mu$, $\sigma^2$: media y varianza de la población; $n$: tamaño de muestra; observaciones independientes.
:::
