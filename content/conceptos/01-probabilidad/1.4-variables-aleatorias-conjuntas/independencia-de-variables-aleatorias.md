---
id: independencia-de-variables-aleatorias
titulo: Independencia de variables aleatorias
titulo_en: Independence of random variables
alias:
  - variables independientes
  - factorización de la conjunta
  - independencia estocástica
modulo: 1
submodulo: '1.4'
orden: 4
nivel: intermedio
prerrequisitos:
  - distribuciones-marginales
  - independencia-de-eventos
relaciones:
  - tipo: generaliza
    id: independencia-de-eventos
  - tipo: contrasta
    id: correlacion-cero-no-implica-independencia
etiquetas:
  - independencia
  - factorización
  - producto de marginales
  - muestras independientes
resumen: >
  Dos variables aleatorias son independientes si su distribución conjunta es el producto de sus
  marginales: conocer el valor de una no cambia la distribución de la otra. Es el supuesto básico
  de las muestras aleatorias.
formula: 'p(x, y) = p_X(x)\, p_Y(y) \ \text{o} \ f(x, y) = f_X(x)\, f_Y(y) \quad \text{para todos } x, y'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: independencia
    experimento: dos-dados
    variable: primero
    segunda: segundo
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.1'
  - clave: ross-probabilidad
    capitulo: '6.2'
publicado: true
---

## Intuición

Dos dados lanzados por separado no se comunican: lo que salga en uno no cambia las probabilidades del otro. Por eso la probabilidad de cada par es el producto de las probabilidades individuales, $1/6 \cdot 1/6 = 1/36$. Esa es la idea de **independencia** de variables aleatorias: cualquier información sobre una deja intacta la distribución de la otra.

Para eventos, la independencia pide $P(A \cap B) = P(A)\,P(B)$ para un par de eventos. Para variables pide lo mismo para **todos** los eventos que se pueden formar con ellas, lo cual equivale a que cada casilla de la tabla conjunta sea el producto de sus dos marginales. Basta una casilla que no cumpla para que las variables sean dependientes.

## Definición

:::definicion[Variables aleatorias independientes]
Las variables $X$ y $Y$ son **independientes** si
$$
P(X \in A,\ Y \in B) = P(X \in A)\, P(Y \in B)
$$
para todos los conjuntos $A$ y $B$. Equivalentemente, $F_{X,Y}(x, y) = F_X(x)\, F_Y(y)$ para todos $x$, $y$; en el caso discreto, $p(x, y) = p_X(x)\, p_Y(y)$, y en el continuo, $f(x, y) = f_X(x)\, f_Y(y)$.
:::

Las variables $X_1, \dots, X_n$ son **mutuamente independientes** si la conjunta de todas es el producto de sus $n$ marginales. Una **muestra aleatoria** es una sucesión de variables independientes con la misma distribución.

:::figura[La densidad $4xy$ sobre el cuadrado unitario se factoriza como $2x \cdot 2y$: la conjunta coincide con el producto de sus marginales en cada celda y el panel de diferencias queda vacío.]{componente="JointDistribution2D"}
```yaml
modo: independencia
modelo: producto-xy
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $A$, $B$: conjuntos de valores.
- $F_{X,Y}$, $F_X$, $F_Y$: funciones de distribución conjunta y marginales.
- $p(x, y)$, $f(x, y)$: masa o densidad conjunta.
- $p_X$, $p_Y$, $f_X$, $f_Y$: marginales.
- $g$, $h$: funciones de cada variable.
- $X_1$, $S$: primer dado y suma de dos dados.
:::

## Cómo usar la visualización

Los tres paneles muestran la tabla conjunta de los dos dados, la tabla que se obtendría multiplicando sus marginales y la diferencia entre ambas. La animación las revela en ese orden y el encabezado compara una casilla de cada una. Con dos dados separados las dos primeras tablas son idénticas, todas las celdas valen 1/36, y la diferencia es 0 en todas partes: las variables son independientes.

Comparar con la figura del primer dado y la suma muestra el caso contrario: la conjunta tiene celdas vacías donde el producto de marginales pone probabilidad, y el panel de diferencias se llena de valores positivos y negativos.

## Ejemplo

Sean $X_1$ el primer dado y $S$ la suma de los dos dados.

1. $P(X_1 = 1) = 1/6$ y $P(S = 2) = 1/36$, así que el producto es $1/216$.
2. Pero $P(X_1 = 1,\ S = 2) = P(\text{ambos dados son } 1) = 1/36$.
3. Como $1/36 \ne 1/216$, $X_1$ y $S$ son dependientes.
4. Otra casilla lo confirma: $P(X_1 = 1,\ S = 12) = 0$, mientras que $P(X_1 = 1)\,P(S = 12) = 1/216 > 0$.

:::figura[El primer dado y la suma: la conjunta solo usa 36 de las 66 celdas, mientras que el producto de marginales reparte probabilidad por todas. Las diferencias son positivas en la banda que usa la conjunta, salvo en la suma 7, donde valen 0, y negativas fuera de ella.]{componente="JointDistribution2D"}
```yaml
modo: independencia
experimento: dos-dados
variable: primero
segunda: suma
```
:::

## Propiedades

- **Condicionales:** si son independientes, $p_{Y \mid X}(y \mid x) = p_Y(y)$ para todo $x$ con $p_X(x) > 0$.
- **Funciones:** si $X$ y $Y$ son independientes, también lo son $g(X)$ y $h(Y)$ para funciones cualesquiera.
- **Esperanza del producto:** $\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y]$, de donde $\operatorname{Cov}(X, Y) = 0$ y $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)$.
- **Soporte rectangular:** si el conjunto de pares con densidad positiva no es un producto de intervalos, las variables no pueden ser independientes.
- **Sumas:** la distribución de la suma de independientes es la convolución de las marginales.

:::figura[La densidad $x + y$ sobre el mismo cuadrado unitario no se factoriza: las celdas de las esquinas difieren del producto de marginales, aunque el soporte sea un rectángulo.]{componente="JointDistribution2D"}
```yaml
modo: independencia
modelo: suma-xy
```
:::

## Errores comunes

- **Confundir independencia con correlación cero.** La independencia implica covarianza cero, pero no al revés.
- **Confundir independencia con excluyentes.** Para variables, valores que "no pueden ocurrir juntos" son una forma fuerte de dependencia.
- **Revisar solo algunas casillas.** La factorización debe cumplirse en todos los pares; una tabla puede cumplirla en varias celdas y fallar en otras.

:::figura[Covarianza cero sin independencia: con $X$ uniforme en $\{-1, 0, 1\}$ y $Y = X^2$, la covarianza es 0, pero la conjunta difiere del producto de marginales en todas las celdas.]{componente="JointDistribution2D"}
```yaml
modo: independencia
valoresX: [-1, 0, 1]
valoresY: [0, 1]
probabilidades:
  - [0, 1]
  - [1, 0]
  - [0, 1]
simboloY: Y
```
:::

## Conexiones

La independencia de variables extiende la [[independencia-de-eventos]] a todos los eventos que se forman con ellas, y se verifica comparando la [[distribucion-conjunta]] con el producto de las [[distribuciones-marginales]]. Implica [[covarianza]] cero, pero la [[correlacion-cero-no-implica-independencia]]. Bajo independencia, la suma de variables aleatorias se calcula con la convolución de distribuciones y las varianzas se suman, como en [[propiedades-de-la-varianza]]. Las muestras independientes son la base de la [[ley-debil-de-los-grandes-numeros]] y de la [[ley-0-1-de-kolmogorov]].

## Formulario

:::formula[Definición]
$$
P(X \in A,\ Y \in B) = P(X \in A)\, P(Y \in B)
$$

- Para todos los conjuntos $A$ y $B$.
:::

:::formula[Factorización]
$$
p(x, y) = p_X(x)\, p_Y(y), \qquad f(x, y) = f_X(x)\, f_Y(y)
$$

- En todos los pares $(x, y)$.
:::

:::formula[Consecuencias]
$$
\mathbb{E}[XY] = \mathbb{E}[X]\,\mathbb{E}[Y], \qquad \operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)
$$

- Valen bajo independencia.
:::
