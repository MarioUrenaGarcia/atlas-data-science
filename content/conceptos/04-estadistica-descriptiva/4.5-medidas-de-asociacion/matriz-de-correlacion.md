---
id: matriz-de-correlacion
titulo: Matriz de correlación
titulo_en: Correlation matrix
alias:
  - matriz de correlaciones
  - R
modulo: 4
submodulo: '4.5'
orden: 7
nivel: basico
prerrequisitos:
  - coeficiente-de-correlacion-de-pearson
  - matrices-y-operaciones-con-matrices
etiquetas:
  - asociación
  - correlación
  - matrices
  - análisis multivariado
resumen: >
  La matriz de correlación reúne las correlaciones de todas las parejas de variables de una tabla.
  Es simétrica, tiene unos en la diagonal y es semidefinida positiva.
formula: '\mathbf{R} = (r_{jk}), \qquad r_{jk} = \frac{s_{jk}}{s_j\,s_k}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: matriz
    variables:
      - nombre: Sueño
        valores: [7, 6, 8, 5, 7, 6, 9, 5, 8, 6]
      - nombre: Café
        valores: [1, 2, 0, 3, 1, 2, 0, 4, 1, 3]
      - nombre: Estrés
        valores: [4, 6, 3, 8, 5, 6, 2, 9, 3, 7]
      - nombre: Estudio
        valores: [10, 12, 8, 6, 14, 11, 9, 5, 12, 10]
      - nombre: Calificación
        valores: [8.1, 7.6, 8.4, 6.2, 8.8, 7.9, 8.0, 5.9, 8.9, 7.0]
referencias:
  - clave: james-isl
  - clave: strang
publicado: true
---

## Intuición

Una encuesta a diez estudiantes registra cinco variables: horas de sueño, tazas de café, nivel de estrés, horas de estudio y calificación. Con cinco variables hay diez parejas posibles, y revisar diez diagramas de dispersión uno por uno es lento. Una tabla de cinco por cinco con la correlación de cada pareja permite ver de un golpe qué variables se mueven juntas: el sueño y el estrés van en sentidos opuestos, el café acompaña al estrés, y la calificación se relaciona con casi todo.

Esa tabla es la **matriz de correlación**. Cada fila y cada columna corresponden a una variable, y la celda de la fila $j$ y la columna $k$ es la correlación entre ambas. La diagonal vale 1 porque cada variable está perfectamente correlacionada consigo misma, y la matriz es simétrica porque la correlación de $j$ con $k$ es la misma que la de $k$ con $j$. Es el punto de partida de casi cualquier análisis con muchas variables, aunque solo resume relaciones lineales entre parejas.

## Definición

:::definicion[Matriz de correlación]
Para $p$ variables con covarianzas $s_{jk}$ y desviaciones estándar $s_j$, la **matriz de correlación** es la matriz $\mathbf{R}$ de tamaño $p \times p$ con entradas
$$
r_{jk} = \frac{s_{jk}}{s_j\,s_k}, \qquad j, k = 1, \dots, p.
$$
Si $\mathbf{S}$ es la matriz de covarianza y $\mathbf{D} = \operatorname{diag}(s_1, \dots, s_p)$, entonces $\mathbf{R} = \mathbf{D}^{-1}\mathbf{S}\,\mathbf{D}^{-1}$.
:::

Equivalentemente, es la matriz de covarianza de los datos estandarizados: si $\mathbf{Z}$ es la matriz de datos con cada columna convertida en puntuaciones z, $\mathbf{R} = \frac{1}{n-1}\mathbf{Z}^\top\mathbf{Z}$.

:::figura[Matriz de correlación de cuatro variables del clima en siete ciudades. Los tonos azules indican correlación positiva y los naranjas negativa; seleccionar una celda muestra su diagrama de dispersión.]{componente="AssociationViz"}
```yaml
modo: matriz
variables:
  - nombre: Altitud
    valores: [10, 500, 1500, 2200, 2600, 1800, 40]
  - nombre: Temperatura
    valores: [28, 26, 21, 17, 14, 19, 27]
  - nombre: Lluvia
    valores: [1200, 900, 700, 800, 950, 600, 1500]
  - nombre: Humedad
    valores: [78, 70, 55, 58, 62, 50, 82]
```
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{R}$: matriz de correlación, $p \times p$.
- $r_{jk}$: correlación entre las variables $j$ y $k$.
- $s_{jk}$: covarianza entre las variables $j$ y $k$; $s_j$: desviación estándar de la variable $j$.
- $p$: número de variables; $n$: número de observaciones.
- $\mathbf{S}$: matriz de covarianza.
- $\mathbf{D} = \operatorname{diag}(s_1, \dots, s_p)$: matriz diagonal con las desviaciones estándar.
- $\mathbf{Z}$: matriz de datos estandarizados, $n \times p$; $\mathbf{Z}^\top$: su transpuesta.
:::

## Cómo usar la visualización

La reproducción calcula las diez celdas de la mitad superior una por una; la mitad inferior se llena por simetría. Cada vez que se calcula una celda, el diagrama de la derecha muestra la dispersión de esa pareja. También se puede seleccionar cualquier celda para ver su diagrama.

Las celdas más intensas, como sueño y estrés ($-0.97$), corresponden a nubes casi alineadas; las más pálidas, como sueño y estudio ($0.36$), a nubes dispersas. La columna de calificación tiene correlaciones fuertes con casi todo, pero eso no indica qué variable influye en cuál.

## Ejemplo

Tres variables medidas en cuatro observaciones: $a = (2, 4, 6, 8)$, $b = (1, 3, 2, 6)$ y $c = (5, 4, 2, 1)$.

1. Desviaciones: $a$: $-3, -1, 1, 3$; $b$: $-2, 0, -1, 3$; $c$: $2, 1, -1, -2$.
2. Sumas de cuadrados: $\sum a^2 = 20$, $\sum b^2 = 14$, $\sum c^2 = 10$ (de las desviaciones).
3. $r_{ab} = \frac{6 + 0 - 1 + 9}{\sqrt{20 \cdot 14}} = \frac{14}{16.73} \approx 0.837$.
4. $r_{ac} = \frac{-6 - 1 - 1 - 6}{\sqrt{20 \cdot 10}} = \frac{-14}{14.14} \approx -0.990$.
5. $r_{bc} = \frac{-4 + 0 + 1 - 6}{\sqrt{14 \cdot 10}} = \frac{-9}{11.83} \approx -0.761$.

$$
\mathbf{R} = \begin{pmatrix} 1 & 0.837 & -0.990 \\ 0.837 & 1 & -0.761 \\ -0.990 & -0.761 & 1 \end{pmatrix}
$$

:::figura[La matriz del ejemplo, calculada celda por celda.]{componente="AssociationViz"}
```yaml
modo: matriz
variables:
  - nombre: a
    valores: [2, 4, 6, 8]
  - nombre: b
    valores: [1, 3, 2, 6]
  - nombre: c
    valores: [5, 4, 2, 1]
```
:::

## Propiedades

- **Simétrica con diagonal unitaria:** $r_{jk} = r_{kj}$ y $r_{jj} = 1$.
- **Semidefinida positiva:** $\mathbf{v}^\top\mathbf{R}\,\mathbf{v} \ge 0$ para todo vector $\mathbf{v}$, porque es la matriz de covarianza de datos estandarizados. Por eso no cualquier tabla simétrica con unos en la diagonal es una matriz de correlación válida.
- **Restricciones entre celdas:** si dos variables están muy correlacionadas con una tercera en el mismo sentido, no pueden estar muy correlacionadas en sentido opuesto entre sí.
- **Base de métodos multivariados:** los componentes principales de datos estandarizados son los vectores propios de $\mathbf{R}$.

:::figura[Restricciones entre celdas en el ejemplo: como a y c casi son opuestas, la correlación de b con c tiene que parecerse a la de b con a cambiada de signo.]{componente="AssociationViz"}
```yaml
modo: matriz
variables:
  - nombre: a
    valores: [2, 4, 6, 8]
  - nombre: c
    valores: [5, 4, 2, 1]
  - nombre: b
    valores: [1, 3, 2, 6]
```
:::

## Errores comunes

- **Leer una correlación cercana a cero como ausencia de relación.** La matriz solo resume relaciones lineales; una relación en forma de U aparece como una celda pálida.
- **Buscar "las variables importantes" en la matriz.** Una correlación alta con la variable de interés puede deberse a una causa común; para efectos de una variable controlando las demás se necesitan otros métodos.
- **Ignorar el tamaño de muestra.** Con diez observaciones, una correlación de 0.4 puede aparecer por azar.

:::figura[Relación oculta: temperatura media y consumo de electricidad en siete meses. La celda marca una correlación casi nula, pero el diagrama muestra una U: el consumo sube con el frío y con el calor.]{componente="AssociationViz"}
```yaml
modo: matriz
variables:
  - nombre: Temperatura
    valores: [10, 14, 18, 22, 26, 30, 34]
  - nombre: Consumo
    valores: [60, 42, 32, 30, 34, 44, 62]
  - nombre: Mes
    valores: [1, 2, 3, 4, 5, 6, 7]
```
:::

## Conexiones

Cada entrada es un [[coeficiente-de-correlacion-de-pearson]], y la matriz completa se maneja con las herramientas de [[matrices-y-operaciones-con-matrices]]. Es la matriz de covarianza de los datos estandarizados, y su inversa da las [[correlacion-parcial|correlaciones parciales]]. Sus valores y vectores propios son la base del análisis de componentes principales.

## Formulario

:::formula[Entrada de la matriz]
$$
r_{jk} = \frac{s_{jk}}{s_j\,s_k}
$$

- $s_{jk}$: covarianza entre $j$ y $k$; $s_j, s_k$: desviaciones estándar.
:::

:::formula[Forma matricial]
$$
\mathbf{R} = \mathbf{D}^{-1}\mathbf{S}\,\mathbf{D}^{-1}
$$

- $\mathbf{S}$: matriz de covarianza; $\mathbf{D}$: diagonal de desviaciones estándar.
:::

:::formula[Con datos estandarizados]
$$
\mathbf{R} = \frac{1}{n-1}\,\mathbf{Z}^\top\mathbf{Z}
$$

- $\mathbf{Z}$: datos en puntuaciones z; $n$: número de observaciones.
:::

:::formula[Semidefinida positiva]
$$
\mathbf{v}^\top\mathbf{R}\,\mathbf{v} \ge 0 \quad \text{para todo } \mathbf{v} \in \mathbb{R}^p
$$

- $\mathbf{v}$: vector de $p$ componentes.
:::
