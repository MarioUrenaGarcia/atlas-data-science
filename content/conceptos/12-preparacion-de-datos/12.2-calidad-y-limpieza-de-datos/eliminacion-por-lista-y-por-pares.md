---
id: eliminacion-por-lista-y-por-pares
titulo: Eliminación por lista y por pares
titulo_en: Listwise and pairwise deletion
alias:
  - análisis de casos completos
  - listwise deletion
  - pairwise deletion
  - casos disponibles
modulo: 12
submodulo: '12.2'
orden: 6
nivel: basico
prerrequisitos:
  - mecanismos-de-datos-faltantes
  - matriz-de-correlacion
etiquetas:
  - datos faltantes
  - casos completos
  - correlación
  - tamaño de muestra
resumen: >
  La eliminación por lista descarta toda fila con algún faltante; la eliminación por pares usa, para cada
  par de variables, las filas donde ambas están presentes. Ambas son insesgadas solo si los faltantes son MCAR.
formula: 'n_{jk} = \sum_{i=1}^{n} (1 - M_{ij})(1 - M_{ik})'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: eliminacion
    metodo: lista
    tasa: 0.1
referencias:
  - clave: gelman-bda
  - clave: james-isl
publicado: true
---

## Intuición

La manera más sencilla de lidiar con celdas vacías es ignorarlas. Hay dos formas de hacerlo. La primera, **eliminación por lista**, quita del análisis cualquier fila que tenga al menos un hueco: lo que queda es una tabla completa y todos los cálculos se hacen sobre las mismas filas. La segunda, **eliminación por pares**, es menos drástica: para calcular la correlación entre ingreso y gasto usa todas las filas que tienen ingreso y gasto, aunque les falte la edad; para la correlación entre edad y ahorro usa otras filas.

La primera desperdicia datos, y mucho: si cada una de cuatro variables pierde el 10 % de sus valores al azar, cerca de un tercio de las filas tiene algún hueco y se descarta completa. La segunda aprovecha más información, pero cada número de la tabla final se calcula con un grupo distinto de personas, lo que puede producir resultados que no encajan entre sí. Ninguna de las dos corrige el sesgo si los faltantes no son completamente al azar.

## Definición

Sea $M_{ij} = 1$ si falta el valor de la fila $i$ en la variable $j$, con $i = 1, \dots, n$ y $j = 1, \dots, p$.

:::definicion[Eliminación por lista y por pares]
- **Eliminación por lista** (análisis de casos completos): se conservan las filas $\{ i : M_{ij} = 0 \text{ para toda } j\}$, y todos los estadísticos se calculan sobre ellas. Su número es $n_{\text{lista}} = \sum_{i} \prod_{j} (1 - M_{ij})$.
- **Eliminación por pares** (casos disponibles): cada estadístico que involucra a las variables $j$ y $k$ se calcula con las filas donde ambas se observan, que son $n_{jk} = \sum_{i} (1 - M_{ij})(1 - M_{ik})$.
:::

Si cada celda falta de forma independiente con probabilidad $q$ (MCAR), la proporción esperada de filas completas es

$$
P(\text{fila completa}) = (1 - q)^{p}.
$$

:::nota[Qué significa cada símbolo]
- $n$: número de filas; $p$: número de variables.
- $M_{ij}$: indicadora de que falta el valor de la fila $i$ en la variable $j$.
- $1 - M_{ij}$: vale $1$ si el valor se observa.
- $\prod_j$: producto sobre las variables; vale $1$ solo si todas se observan.
- $n_{\text{lista}}$: filas que usa la eliminación por lista.
- $n_{jk}$: filas que usa la eliminación por pares para el par de variables $j$ y $k$.
- $q$: probabilidad de que una celda falte.
:::

## Cómo usar la visualización

El mapa de faltantes tiene una fila por persona y una columna por variable; las celdas oscuras faltan. Con eliminación por lista, la animación recorre las filas y atenúa cada fila incompleta. Con eliminación por pares, recorre los seis pares de variables y resalta en naranja las celdas usadas para ese par. La tabla de la derecha compara cuántas filas usa cada método por par y la correlación que obtiene.

Experimentos sugeridos: subir la proporción de faltantes a 0.2 y ver cuántas filas completas quedan de 30; cambiar a eliminación por pares y comparar el número de filas por par.

## Ejemplo

Cinco personas tienen tres variables, con faltantes marcados como NA:

| Fila | $X_1$ | $X_2$ | $X_3$ |
| --- | --- | --- | --- |
| 1 | 2 | 5 | NA |
| 2 | 4 | NA | 7 |
| 3 | 6 | 9 | 8 |
| 4 | 8 | 11 | 12 |
| 5 | NA | 13 | 14 |

1. Por lista, solo las filas 3 y 4 están completas: $n_{\text{lista}} = 2$. Con dos puntos, cualquier correlación vale $\pm 1$, así que el análisis no informa nada.
2. Por pares: $(X_1, X_2)$ usa las filas 1, 3 y 4; $(X_1, X_3)$ las filas 2, 3 y 4; $(X_2, X_3)$ las filas 3, 4 y 5. Cada par tiene $n_{jk} = 3$, pero ningún par usa el mismo grupo de filas.
3. Con 4 variables y $q = 0.1$, la proporción esperada de filas completas es $0.9^4 = 0.656$: se pierde un tercio de la muestra.

:::figura[Eliminación por pares con 10 % de faltantes: cada correlación usa más filas que las completas, y un grupo distinto en cada par.]{componente="DataQualityTable"}
```yaml
modo: eliminacion
metodo: pares
tasa: 0.1
```
:::

## Propiedades

- **La pérdida por lista crece con el número de variables.** Con $p = 20$ variables y $q = 0.05$, solo $0.95^{20} = 0.36$ de las filas está completa.

:::figura[Con 20 % de celdas faltantes en cuatro variables, la eliminación por lista conserva alrededor de la mitad de las 30 filas, como predice 0.8 elevado a 4, que es 0.41.]{componente="DataQualityTable"}
```yaml
modo: eliminacion
metodo: lista
tasa: 0.2
```
:::

- **Bajo MCAR ambas son insesgadas.** Las filas que quedan son una muestra al azar; solo se pierde precisión.
- **La matriz por pares puede no ser una matriz de correlación válida.** Como cada entrada viene de otro grupo de filas, la matriz puede dejar de ser semidefinida positiva, y entonces métodos como la regresión o el análisis de componentes fallan.

## Errores comunes

- **Usar casos completos con faltantes MAR o MNAR sin revisar qué se estima.** Si faltan más los ingresos altos, la media y la varianza de las filas completas quedan sesgadas. No todo se sesga: una regresión de $Y$ sobre $X$ con casos completos sigue siendo insesgada si la probabilidad de que falte $Y$ depende solo de $X$; lo que importa es si la falta depende de la variable respuesta dado lo que entra en el modelo.
- **Reportar un tamaño de muestra único con eliminación por pares.** Cada resultado tiene su propio $n_{jk}$; reportar el $n$ total exagera la precisión.
- **No contar cuántas filas se pierden.** Muchos programas eliminan por lista sin avisar; conviene comparar el $n$ del modelo con el de la tabla original.

:::figura[Error de no contar las filas perdidas: con 30 % de celdas faltantes en cuatro variables, la eliminación por lista descarta la mayoría de las filas.]{componente="DataQualityTable"}
```yaml
modo: eliminacion
metodo: lista
tasa: 0.3
```
:::

## Conexiones

La validez de ambos métodos depende de los [[mecanismos-de-datos-faltantes]]: solo MCAR garantiza que no haya sesgo. La eliminación por pares produce una [[matriz-de-correlacion]] cuyas entradas son [[coeficiente-de-correlacion-de-pearson|correlaciones de Pearson]] calculadas con grupos distintos, y su posible falta de definición positiva se entiende con las [[matrices-definidas-positivas-y-semidefinidas]]. Las alternativas que conservan todas las filas son la [[imputacion-simple]] y la [[imputacion-multiple]]. La pérdida esperada de filas es una [[distribucion-binomial|probabilidad binomial]] de cero faltantes en $p$ intentos.

## Formulario

:::formula[Filas usadas por lista]
$$
n_{\text{lista}} = \sum_{i=1}^{n} \prod_{j=1}^{p} (1 - M_{ij})
$$

- $M_{ij}$: indicadora de faltante en la fila $i$ y la variable $j$.
- $n$, $p$: número de filas y de variables.
:::

:::formula[Filas usadas por pares]
$$
n_{jk} = \sum_{i=1}^{n} (1 - M_{ij})(1 - M_{ik})
$$

- $j$, $k$: par de variables.
- $M_{ij}$, $M_{ik}$: indicadoras de faltante de la fila $i$ en las variables $j$ y $k$.
- $n$: número de filas.
- $n_{jk}$: filas donde ambas se observan.
:::

:::formula[Proporción esperada de filas completas bajo MCAR]
$$
P(\text{fila completa}) = (1 - q)^{p}
$$

- $q$: probabilidad de que falte cada celda, independiente entre celdas.
- $p$: número de variables.
:::
