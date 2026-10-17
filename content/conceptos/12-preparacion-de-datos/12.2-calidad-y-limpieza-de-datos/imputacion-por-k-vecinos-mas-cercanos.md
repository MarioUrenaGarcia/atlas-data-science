---
id: imputacion-por-k-vecinos-mas-cercanos
titulo: Imputación por k vecinos más cercanos
titulo_en: k-nearest neighbors imputation
alias:
  - imputación kNN
  - KNN imputation
  - imputación por vecinos
modulo: 12
submodulo: '12.2'
orden: 8
nivel: basico
prerrequisitos:
  - imputacion-simple
  - distancias
etiquetas:
  - datos faltantes
  - imputación
  - vecinos más cercanos
  - distancia
resumen: >
  Cada faltante se reemplaza por el promedio del valor en las k filas completas más parecidas según las
  variables observadas. Respeta la relación con esas variables, a diferencia de la imputación por la media.
formula: '\hat{y}_i = \frac{1}{k}\sum_{j \in N_k(i)} y_j'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: knn
    k: 5
    mecanismo: MAR
    tasa: 0.3
referencias:
  - clave: hastie-esl
  - clave: james-isl
publicado: true
---

## Intuición

Si falta el ingreso de una persona de 41 años, el promedio de todos los ingresos no es la mejor apuesta: entre los encuestados, las personas cercanas a esa edad tienden a ganar parecido entre sí y distinto de los muy jóvenes o los muy mayores. Una apuesta más informada es buscar a las personas más parecidas a ella en lo que sí se sabe (aquí, la edad) y promediar sus ingresos.

Eso es la **imputación por k vecinos más cercanos**: para cada fila con un hueco, se buscan las $k$ filas completas más próximas según una distancia calculada con las variables observadas, y el hueco se llena con el promedio de esas $k$ filas (o con la categoría más frecuente, si la variable es categórica). Los valores imputados siguen la tendencia de los datos en lugar de amontonarse en un solo número. El precio es elegir $k$ y la distancia: con $k$ muy pequeño, el valor imputado depende de una sola persona; con $k$ muy grande, se parece al promedio general.

## Definición

:::definicion[Imputación por k vecinos más cercanos]
Sea $\mathbf{x}_i$ el vector de variables observadas de la fila $i$ y $y_i$ el valor faltante. Con una distancia $d$, se define el conjunto $N_k(i)$ de las $k$ filas completas $j$ con menor $d(\mathbf{x}_i, \mathbf{x}_j)$, y se imputa

$$
\hat{y}_i = \frac{1}{k}\sum_{j \in N_k(i)} y_j .
$$

Con varias variables observadas, lo usual es la distancia euclidiana sobre variables estandarizadas: $d(\mathbf{x}_i, \mathbf{x}_j) = \sqrt{\sum_{l} (z_{il} - z_{jl})^2}$.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{x}_i$: vector con las variables observadas de la fila $i$ (en la visualización, solo la edad).
- $y_i$: valor faltante que se quiere imputar; $y_j$, valor observado de un vecino.
- $d(\mathbf{x}_i, \mathbf{x}_j)$: distancia entre las filas $i$ y $j$.
- $k$: número de vecinos.
- $N_k(i)$: conjunto de los $k$ vecinos completos más cercanos a la fila $i$.
- $\hat{y}_i$: valor imputado.
- $z_{il}$: variable $l$ de la fila $i$ estandarizada, para que ninguna domine la distancia por su escala.
:::

## Cómo usar la visualización

Los puntos azules tienen edad e ingreso observados; las marcas rojas sobre el eje son personas cuyo ingreso falta. Al reproducir, cada faltante se resuelve a la vez: sus $k$ vecinos más cercanos en edad se marcan con anillos naranjas unidos por líneas, y el punto rojo aparece a la altura de su promedio. El encabezado muestra la suma de los ingresos de los vecinos. Las lecturas comparan el error contra los valores ocultos, que solo se conocen por ser datos simulados, con el error de imputar la media.

Experimentos sugeridos: poner $k = 1$ y observar que los imputados copian a un solo vecino; subir $k$ a 20 y ver que se aplanan hacia el promedio.

## Ejemplo

Falta el ingreso de una persona de 41 años. Las filas completas más cercanas en edad son: 40 años con 19 mil pesos, 42 con 21, 38 con 17 y 45 con 24.

1. Distancias en edad: $|41 - 40| = 1$, $|41 - 42| = 1$, $|41 - 38| = 3$, $|41 - 45| = 4$.
2. Con $k = 3$, los vecinos son los de 40, 42 y 38 años.
3. $\hat{y} = (19 + 21 + 17)/3 = 19$ mil pesos.
4. Con $k = 1$ habría un empate entre los de 40 y 42 años; la regla de desempate (por ejemplo, el primero en la tabla) decide entre 19 y 21.

Si el promedio general fuera 18 mil pesos, la imputación por la media daría 18 sin importar la edad; la de vecinos da 19 para esta persona y valores más altos para personas mayores.

:::figura[Imputación con cinco vecinos y faltantes MAR: los ingresos imputados siguen la tendencia con la edad y el error es menor que el de imputar la media.]{componente="DataQualityTable"}
```yaml
modo: knn
k: 5
mecanismo: MAR
tasa: 0.3
```
:::

## Propiedades

- **Preserva la relación con las variables usadas en la distancia.** Por eso es apropiada cuando los faltantes son MAR respecto de esas variables.
- **$k$ regula sesgo y variabilidad.** Con $k = 1$, cada imputación copia el ruido de un vecino; con $k$ grande, todas se acercan a la media.

:::figura[Con un solo vecino, cada ingreso imputado copia el de la persona de edad más cercana, incluido su ruido.]{componente="DataQualityTable"}
```yaml
modo: knn
k: 1
mecanismo: MAR
tasa: 0.3
```
:::

:::figura[Con 20 vecinos, los imputados se suavizan y se acercan a la tendencia promedio; la dispersión de la columna completada baja.]{componente="DataQualityTable"}
```yaml
modo: knn
k: 20
mecanismo: MAR
tasa: 0.3
```
:::

- **Costo de cálculo.** Cada imputación compara la fila con todas las completas; con millones de filas se usan estructuras de búsqueda o se limita la búsqueda a bloques.

## Errores comunes

- **No estandarizar antes de medir distancias.** Si una variable se mide en pesos y otra en años, la distancia queda dominada por la de mayor escala y la edad deja de importar.
- **Tratar los imputados como observados.** Aunque son mejores que la media, siguen siendo un solo valor por hueco; los errores estándar posteriores no reflejan la incertidumbre de la imputación.
- **Usar vecinos cuando la variable que explica el faltante no está en la distancia.** Si el faltante depende del propio ingreso (MNAR), ningún vecino por edad corrige el sesgo.

:::figura[Error de usar vecinos con faltantes MNAR: los imputados siguen la tendencia de los observados, que ya es baja, y no recuperan los ingresos altos ocultos.]{componente="DataQualityTable"}
```yaml
modo: knn
k: 5
mecanismo: MNAR
tasa: 0.3
```
:::

## Conexiones

Es una mejora de la [[imputacion-simple]] que usa la estructura de los datos. La cercanía se mide con alguna de las [[distancias]] entre vectores, normalmente sobre [[puntuaciones-z-muestrales|variables estandarizadas]], y el valor imputado es una [[media-aritmetica]] local. Su validez depende de los [[mecanismos-de-datos-faltantes]]; la [[imputacion-multiple]] agrega la incertidumbre que este método ignora.

## Formulario

:::formula[Valor imputado]
$$
\hat{y}_i = \frac{1}{k}\sum_{j \in N_k(i)} y_j
$$

- $N_k(i)$: los $k$ vecinos completos más cercanos a la fila $i$.
- $y_j$: valor observado del vecino $j$.
- $k$: número de vecinos.
:::

:::formula[Distancia euclidiana estandarizada]
$$
d(\mathbf{x}_i, \mathbf{x}_j) = \sqrt{\sum_{l=1}^{q} (z_{il} - z_{jl})^2}
$$

- $q$: número de variables observadas usadas en la distancia.
- $z_{il}$: valor estandarizado de la variable $l$ en la fila $i$.
:::

:::formula[Raíz del error cuadrático medio de imputación]
$$
\mathrm{RECM} = \sqrt{\frac{1}{m}\sum_{i=1}^{m} (\hat{y}_i - y_i)^2}
$$

- $m$: número de valores imputados.
- $\hat{y}_i$: valor imputado; $y_i$: valor verdadero (conocido solo en simulaciones o en pruebas con faltantes artificiales).
:::
