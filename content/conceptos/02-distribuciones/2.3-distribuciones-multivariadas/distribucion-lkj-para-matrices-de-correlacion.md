---
id: distribucion-lkj-para-matrices-de-correlacion
titulo: Distribución LKJ para matrices de correlación
titulo_en: LKJ distribution for correlation matrices
alias:
  - LKJ
  - prior LKJ
  - distribución de Lewandowski, Kurowicka y Joe
modulo: 2
submodulo: '2.3'
orden: 10
nivel: avanzado
prerrequisitos:
  - distribucion-beta
  - distribucion-de-wishart-inversa
relaciones:
  - tipo: contrasta
    id: distribucion-de-wishart-inversa
etiquetas:
  - matrices de correlación
  - estadística bayesiana
  - prior
  - beta
  - modelos jerárquicos
resumen: >
  Distribución sobre matrices de correlación con densidad proporcional a una potencia del determinante.
  Un solo parámetro de concentración controla qué tan cerca de la identidad están las correlaciones.
formula: 'p(\mathbf{R} \mid \eta) \propto \det(\mathbf{R})^{\eta - 1}, \qquad \frac{r_{ij} + 1}{2} \sim \operatorname{Beta}\!\left(\eta - 1 + \tfrac{d}{2},\ \eta - 1 + \tfrac{d}{2}\right)'
visualizacion:
  componente: MultivariateExplorer
  parametros:
    modo: lkj
    valores:
      d: 3
      eta: 2
    casos:
      - nombre: 'Prior escéptico'
        descripcion: 'd = 3 y η = 2: favorece correlaciones moderadas; solo una de cada cuatro tiene magnitud mayor que 0.5.'
        valores: {d: 3, eta: 2}
      - nombre: 'Uniforme en dos variables'
        descripcion: 'd = 2 y η = 1: la única correlación es uniforme entre -1 y 1.'
        valores: {d: 2, eta: 1}
      - nombre: 'Correlaciones fuertes'
        descripcion: 'd = 2 y η = 0.4: la masa se acumula cerca de -1 y de 1; las elipses salen como agujas.'
        valores: {d: 2, eta: 0.4}
referencias:
  - clave: mcelreath
  - clave: gelman-bda
publicado: true
---

## Intuición

En un modelo jerárquico de salud, cada hospital tiene su propio nivel de atención y su propia mejora con un programa nuevo, y esos dos efectos pueden estar correlacionados. La correlación es desconocida y hace falta una distribución previa sobre ella. Con dos efectos es un número entre $-1$ y 1; con más efectos es una matriz de correlación completa, con unos en la diagonal, que además tiene que ser definida positiva. Asignar una distribución a cada entrada por separado puede producir matrices imposibles.

La distribución LKJ resuelve el problema poniendo la distribución sobre la matriz entera. Su densidad es proporcional a una potencia del determinante, que mide qué tan "independientes" son las variables: vale uno en la identidad y se acerca a cero cuando alguna correlación se vuelve extrema. Con el exponente positivo la distribución premia las matrices cercanas a la identidad, es decir, correlaciones chicas; con exponente negativo premia las correlaciones fuertes.

Un solo parámetro, la concentración, mueve esa preferencia. Y hay un efecto de la dimensión: con muchas variables, cada correlación individual queda naturalmente más cerca de cero, porque todas tienen que encajar juntas en una matriz válida.

## Definición

:::definicion[Distribución LKJ]
Sea $\mathbf{R}$ una matriz de correlación de $d \times d$: simétrica, definida positiva y con unos en la diagonal. La **distribución LKJ** con concentración $\eta > 0$ tiene densidad
$$
p(\mathbf{R} \mid \eta) = c_d(\eta)\,\det(\mathbf{R})^{\eta - 1}.
$$
Cada correlación $r_{ij}$ tiene la misma marginal: $(r_{ij} + 1)/2 \sim \operatorname{Beta}(b, b)$ con $b = \eta - 1 + d/2$.
:::

Se simula con el método de la vid C: se sortean correlaciones parciales independientes, cada una $2B - 1$ con $B$ beta simétrica, y se transforman en correlaciones con una recursión que garantiza una matriz válida.

:::nota[Qué es X]
$X$ = una matriz de correlación aleatoria $\mathbf{R}$, por ejemplo la que relaciona el nivel de atención y la mejora de cada hospital en un modelo jerárquico.
:::

:::nota[Qué hace cada parámetro]
- **$\eta$, concentración:** la preferencia por correlaciones chicas. Si aumenta, las matrices se acercan a la identidad y las elipses de correlación se vuelven círculos; con $\eta = 1$ todas las matrices de correlación tienen la misma densidad; con $\eta < 1$ se favorecen correlaciones fuertes.
- **$d$, dimensión:** cuántas variables hay. Si aumenta con $\eta$ fijo, cada correlación individual se concentra más cerca de cero.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{R}$: matriz de correlación; $r_{ij}$: correlación entre las variables $i$ y $j$.
- $d$: dimensión; $\eta$: concentración.
- $\det(\mathbf{R})$: determinante de $\mathbf{R}$, entre 0 y 1.
- $c_d(\eta)$: constante de normalización.
- $b$: forma de la beta marginal; $B$: variable beta usada en la simulación.
:::

## Cómo usar la visualización

A la izquierda está el histograma de la correlación $r_{12}$ de las matrices simuladas junto con su densidad marginal exacta; a la derecha, la elipse de correlación de las últimas matrices, que es un círculo si $r_{12} = 0$ y una aguja si $r_{12}$ se acerca a $\pm 1$. Debajo aparece la última matriz simulada con sus entradas sombreadas. Los controles fijan $d$ y $\eta$; el panel compara la varianza teórica de $r_{12}$, $1/(2b + 1)$, con la simulada.

Con $d = 2$ y $\eta = 1$ simula y observa un histograma plano. Sube $\eta$ a 10 y observa elipses casi circulares. Con $\eta = 1$ fija, sube $d$ de 2 a 8 y observa que el histograma se angosta.

## Ejemplo

En un modelo jerárquico con tres efectos por grupo se usa el prior LKJ con $\eta = 2$ para su matriz de correlación.

1. Forma marginal: $b = \eta - 1 + d/2 = 2 - 1 + 1.5 = 2.5$.
2. Cada correlación cumple $(r + 1)/2 \sim \operatorname{Beta}(2.5, 2.5)$: es simétrica alrededor de cero.
3. Varianza: $\operatorname{Var}(r) = \frac{1}{2b + 1} = \frac{1}{6} \approx 0.167$, con desviación $\approx 0.41$.
4. Probabilidad de una correlación fuerte: $P(|r| > 0.5) = 2P(B > 0.75) \approx 0.253$ con $B \sim \operatorname{Beta}(2.5, 2.5)$.
5. Con $\eta = 1$ en la misma dimensión, $b = 1.5$ y la probabilidad sube a 0.391; con $\eta = 10$, $b = 10.5$ y baja a 0.015.

:::figura[Prior escéptico: con d = 3 y η = 2 el histograma de r₁₂ sigue la beta de forma 2.5 reescalada a (-1, 1), y una de cada cuatro correlaciones supera 0.5 en magnitud.]{componente="MultivariateExplorer"}
```yaml
modo: lkj
valores:
  d: 3
  eta: 2
```
:::

## Propiedades

- **Densidad:** proporcional a $\det(\mathbf{R})^{\eta - 1}$; el máximo está en la identidad si $\eta > 1$.
- **Uniformidad:** con $\eta = 1$ es uniforme sobre las matrices de correlación de dimensión $d$.
- **Marginal:** $(r_{ij} + 1)/2 \sim \operatorname{Beta}(\eta - 1 + d/2,\ \eta - 1 + d/2)$, con media 0 y varianza $1/(2\eta + d - 1)$.
- **Efecto de la dimensión:** con $\eta = 1$, $b = d/2$; en dimensión 8, $P(|r_{ij}| > 0.5) \approx 0.141$, frente a 0.5 en dimensión 2.
- **Separación de escalas:** se combina con distribuciones independientes para las desviaciones, $\boldsymbol{\Sigma} = \operatorname{diag}(\boldsymbol{\sigma})\,\mathbf{R}\,\operatorname{diag}(\boldsymbol{\sigma})$, de modo que varianzas y correlaciones no quedan acopladas.

:::figura[Casos con contexto (prior escéptico, uniforme en dos variables, correlaciones fuertes): cada botón carga d y η, y una frase explica la forma del histograma.]{componente="MultivariateExplorer"}
```yaml
modo: lkj
valores:
  d: 2
  eta: 1
casos:
  - nombre: 'Prior escéptico'
    descripcion: 'd = 3 y η = 2: beta de forma 2.5.'
    valores: {d: 3, eta: 2}
  - nombre: 'Uniforme en dos variables'
    descripcion: 'd = 2 y η = 1: histograma plano.'
    valores: {d: 2, eta: 1}
  - nombre: 'Correlaciones fuertes'
    descripcion: 'd = 2 y η = 0.4: forma de U.'
    valores: {d: 2, eta: 0.4}
```
:::

:::figura[Efecto de la dimensión: con η = 1 y d = 8 la marginal es Beta(4, 4) reescalada y las correlaciones se agrupan cerca de cero, aunque el prior sea uniforme sobre las matrices.]{componente="MultivariateExplorer"}
```yaml
modo: lkj
valores:
  d: 8
  eta: 1
```
:::

## Errores comunes

- **Creer que $\eta = 1$ da correlaciones uniformes en cualquier dimensión.** Es uniforme sobre las matrices, pero cada correlación individual solo es uniforme si $d = 2$.
- **Asignar priors independientes a cada correlación.** La matriz resultante puede no ser definida positiva; la LKJ evita ese problema.
- **Usar $\eta < 1$ como prior neutro.** Con $\eta < 1$ se favorecen correlaciones cercanas a $\pm 1$.
- **Aplicar la LKJ a la covarianza.** La LKJ es para la matriz de correlación; las varianzas se modelan aparte.

:::figura[η menor que 1 no es neutro: con d = 2 y η = 0.4 el histograma tiene forma de U y la mayoría de las elipses son agujas.]{componente="MultivariateExplorer"}
```yaml
modo: lkj
valores:
  d: 2
  eta: 0.4
```
:::

## Conexiones

Sus marginales son de la [[distribucion-beta]] reescalada, y sus valores son [[matrices-definidas-positivas-y-semidefinidas]] con unos en la diagonal. Es la alternativa a la [[distribucion-de-wishart-inversa]] cuando se quiere separar varianzas de correlaciones en un prior de covarianza para la [[distribucion-normal-multivariada]]. Es el prior por omisión para correlaciones en modelos jerárquicos bayesianos. El [[mapa-de-relaciones-entre-distribuciones]] reúne las distribuciones del módulo.

## Formulario

:::formula[Densidad]
$$
p(\mathbf{R} \mid \eta) = c_d(\eta)\,\det(\mathbf{R})^{\eta - 1}
$$

- $\mathbf{R}$: matriz de correlación; $\eta$: concentración; $c_d(\eta)$: constante de normalización.
:::

:::formula[Marginal de una correlación]
$$
\frac{r_{ij} + 1}{2} \sim \operatorname{Beta}(b, b), \qquad b = \eta - 1 + \frac{d}{2}
$$

- $r_{ij}$: correlación; $d$: dimensión.
:::

:::formula[Varianza de una correlación]
$$
\operatorname{Var}(r_{ij}) = \frac{1}{2b + 1} = \frac{1}{2\eta + d - 1}
$$

- $b$: forma de la marginal.
:::

:::formula[Covarianza a partir de la correlación]
$$
\boldsymbol{\Sigma} = \operatorname{diag}(\boldsymbol{\sigma})\,\mathbf{R}\,\operatorname{diag}(\boldsymbol{\sigma})
$$

- $\boldsymbol{\sigma}$: vector de desviaciones; $\operatorname{diag}(\boldsymbol{\sigma})$: matriz diagonal con ellas.
:::
