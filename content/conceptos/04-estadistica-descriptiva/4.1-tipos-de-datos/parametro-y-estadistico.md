---
id: parametro-y-estadistico
titulo: Parámetro y estadístico
titulo_en: Parameter and statistic
alias:
  - parámetro poblacional
  - estadístico muestral
  - estadígrafo
modulo: 4
submodulo: '4.1'
orden: 2
nivel: basico
prerrequisitos:
  - poblacion-y-muestra
  - funciones
etiquetas:
  - parámetro
  - estadístico
  - variabilidad muestral
  - notación
resumen: >
  Un parámetro es un número fijo que describe a toda la población; un estadístico es un número
  calculado con la muestra, que cambia de una muestra a otra y sirve para estimar al parámetro.
formula: '\mu = \frac{1}{N}\sum_{j=1}^{N} y_j \quad\text{frente a}\quad \bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i'
visualizacion:
  componente: DataTypesViz
  parametros:
    modo: poblacion
    enfoque: parametro
    tamano: 300
    n: 25
    forma: bernoulli
    centro: 0.42
    estadistico: proporcion
    unidad: votante
    variable: Apoya la propuesta
    exito: sí
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: wasserman
publicado: true
---

## Intuición

Un termómetro de cocina clavado en distintas partes de un pastel da lecturas un poco diferentes, aunque la temperatura media real del pastel es una sola. Esa temperatura media real es un **parámetro**: existe, está fija, pero no se ve directamente. Cada lectura, o el promedio de varias lecturas, es un **estadístico**: se calcula con lo que se observó y cambia si se pincha en otros lugares.

La estadística vive de esa diferencia. El parámetro es lo que se quiere saber, por ejemplo la proporción de todos los votantes de un municipio que apoya una propuesta. El estadístico es lo que se puede calcular, como la proporción entre 25 votantes entrevistados. Como la muestra es una entre muchas posibles, el estadístico hereda el azar de la selección: repetir la encuesta daría otro número. Entender cuánto varía el estadístico de una muestra a otra es lo que después permite decir qué tan lejos puede estar del parámetro.

## Definición

:::definicion[Parámetro y estadístico]
Un **parámetro** es una característica numérica de la población, calculada, al menos en principio, con los valores $y_1, \dots, y_N$ de todas sus unidades. Es un número fijo, generalmente desconocido.

Un **estadístico** es cualquier función $T = t(x_1, \dots, x_n)$ de los valores observados en la muestra que no depende de parámetros desconocidos. Su valor se conoce en cuanto se tiene la muestra y varía de una muestra a otra.
:::

Por convención, los parámetros se escriben con letras griegas ($\mu$ para la media, $\sigma$ para la desviación estándar, $p$ o $\pi$ para una proporción) y los estadísticos con letras latinas o con gorro ($\bar{x}$, $s$, $\hat{p}$). Cuando un estadístico se usa para aproximar un parámetro se llama **estimador** de ese parámetro.

| Característica | Parámetro | Estadístico |
| --- | --- | --- |
| Media | $\mu$ | $\bar{x}$ |
| Desviación estándar | $\sigma$ | $s$ |
| Proporción | $p$ | $\hat{p}$ |
| Tamaño | $N$ | $n$ |

:::figura[Parámetro y estadístico para la mediana del ingreso mensual de 250 hogares. La línea continua es la mediana de todos los hogares; la discontinua, la de los hogares de la muestra. Cada muestra completa deja un punto en la franja inferior.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: parametro
tamano: 250
n: 15
forma: sesgada
centro: 14000
estadistico: mediana
unidad: hogar
variable: Ingreso mensual (pesos)
```
:::

:::nota[Qué significa cada símbolo]
- $\mu$: media poblacional, un parámetro.
- $y_j$: valor de la variable en la unidad $j$ de la población, con $j = 1, \dots, N$.
- $N$: tamaño de la población.
- $\bar{x}$: media muestral, un estadístico.
- $x_i$: valor observado en la unidad $i$ de la muestra, con $i = 1, \dots, n$.
- $n$: tamaño de la muestra.
- $T = t(x_1, \dots, x_n)$: un estadístico cualquiera, resultado de aplicar la función $t$ a la muestra.
- $\sigma$ y $s$: desviación estándar poblacional y muestral.
- $p$ y $\hat{p}$: proporción poblacional y muestral.
:::

## Cómo usar la visualización

La rejilla es una población de 300 votantes; los círculos claros apoyan la propuesta. La línea continua de la franja inferior es el parámetro $p$, la proporción de apoyo en toda la población. La reproducción arma una primera muestra votante por votante y después extrae muestras completas una tras otra: cada muestra deja un punto con su proporción $\hat{p}$.

La línea continua nunca se mueve y los puntos se dispersan alrededor de ella: el parámetro es uno, los estadísticos son muchos. Al reducir el tamaño de muestra a 5, la nube de puntos se ensancha; con 60 se concentra cerca de $p$. Con la selección sesgada la nube completa se desplaza hacia un lado del parámetro.

## Ejemplo

Un vivero tiene solo cinco plantas de una variedad nueva, con alturas de 12, 15, 9, 14 y 10 cm. Aquí la población es pequeña y el parámetro se puede calcular: $\mu = (12 + 15 + 9 + 14 + 10)/5 = 60/5 = 12$ cm.

Si solo se miden dos plantas elegidas al azar, hay $\binom{5}{2} = 10$ muestras posibles:

| Muestra | Alturas | $\bar{x}$ |
| --- | --- | --- |
| 1 | 12, 15 | 13.5 |
| 2 | 12, 9 | 10.5 |
| 3 | 12, 14 | 13 |
| 4 | 12, 10 | 11 |
| 5 | 15, 9 | 12 |
| 6 | 15, 14 | 14.5 |
| 7 | 15, 10 | 12.5 |
| 8 | 9, 14 | 11.5 |
| 9 | 9, 10 | 9.5 |
| 10 | 14, 10 | 12 |

1. El parámetro vale 12 y no cambia.
2. El estadístico $\bar{x}$ toma valores entre 9.5 y 14.5 según la muestra que toque.
3. El promedio de los diez valores posibles de $\bar{x}$ es $120/10 = 12$: la media muestral acierta en promedio, aunque casi ninguna muestra concreta dé exactamente 12.

:::figura[Las cinco plantas del ejemplo y sus 10 muestras posibles de tamaño 2, recorridas una por una. Cada muestra deja su media en la franja inferior; al terminar, el panel muestra que el promedio de las 10 medias es exactamente 12, el valor del parámetro.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: parametro
tamano: 5
valores: [12, 15, 9, 14, 10]
n: 2
enumerar: true
forma: normal
centro: 12
decimales: 0
estadistico: media
unidad: planta
variable: Altura (cm)
```
:::

## Propiedades

- **El parámetro es constante; el estadístico es variable.** Antes de tomar la muestra, un estadístico es una cantidad aleatoria con su propia distribución, llamada distribución muestral.
- **Un estadístico no puede depender de lo desconocido.** $\bar{x} - \mu$ no es un estadístico porque requiere conocer $\mu$.
- **No todo estadístico se centra en su parámetro.** La media muestral acierta en promedio, pero el máximo de la muestra nunca supera el máximo de la población y, en promedio, queda por debajo de él.

:::figura[Propiedad: el máximo muestral subestima el máximo poblacional. Con muestras de 10 piezas, todos los puntos caen a la izquierda de la línea del parámetro o sobre ella.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: parametro
tamano: 200
n: 10
forma: normal
centro: 50
dispersion: 0.4
decimales: 2
estadistico: maximo
unidad: pieza
variable: Diámetro (mm)
```
:::

## Errores comunes

- **Reportar un estadístico como si fuera el parámetro.** "El 42 % apoya la propuesta" es, en una encuesta, el valor de $\hat{p}$ en una muestra; el valor de $p$ en la población es otro número cercano pero desconocido.
- **Mezclar la notación.** Escribir $\mu = 6.67$ para una media calculada con 6 personas confunde lo observado con lo que se quiere estimar; lo correcto es $\bar{x} = 6.67$.
- **Pensar que una sola muestra dice cuánto puede fallar.** Una muestra da un solo valor del estadístico; la variabilidad se conoce por teoría o por remuestreo, no mirando un único número.

:::figura[Con muestras de solo 3 votantes, el estadístico puede quedar muy lejos del parámetro: hay muestras con 0 % y otras con 100 % de apoyo, aunque el parámetro es 42 %.]{componente="DataTypesViz"}
```yaml
modo: poblacion
enfoque: parametro
tamano: 300
n: 3
forma: bernoulli
centro: 0.42
estadistico: proporcion
unidad: votante
variable: Apoya la propuesta
exito: sí
```
:::

## Conexiones

La distinción supone clara la diferencia entre [[poblacion-y-muestra]]. Un estadístico es una [[funciones|función]] de los datos; en inferencia se le trata como variable aleatoria y su comportamiento de muestra en muestra es la distribución muestral. Los estadísticos más usados se estudian en el resto del módulo: la [[media-aritmetica]], la [[mediana]], la varianza muestral y los cuantiles. El tipo de variable, [[datos-cualitativos-y-cuantitativos|cualitativa o cuantitativa]], determina qué parámetros tienen sentido: para una variable cualitativa se estudian proporciones, no medias.

## Formulario

:::formula[Media poblacional (parámetro)]
$$
\mu = \frac{1}{N}\sum_{j=1}^{N} y_j
$$

- $\mu$: media de toda la población.
- $y_j$: valor de la unidad $j$ de la población.
- $N$: tamaño de la población.
:::

:::formula[Media muestral (estadístico)]
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

- $\bar{x}$: media de la muestra.
- $x_i$: valor de la unidad $i$ de la muestra.
- $n$: tamaño de la muestra.
:::

:::formula[Proporción muestral]
$$
\hat{p} = \frac{\text{número de éxitos en la muestra}}{n}
$$

- $\hat{p}$: estadístico que estima la proporción poblacional $p$.
- $n$: tamaño de la muestra.
:::

:::formula[Estadístico general]
$$
T = t(x_1, \dots, x_n)
$$

- $T$: valor del estadístico.
- $t$: función que se aplica a los datos, sin parámetros desconocidos.
- $x_1, \dots, x_n$: valores observados en la muestra.
:::
