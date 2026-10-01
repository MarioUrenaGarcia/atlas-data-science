---
id: distribucion-multinomial
titulo: Distribución multinomial
titulo_en: Multinomial distribution
alias:
  - multinomial
  - conteos por categoría
  - Mult(n, p)
modulo: 2
submodulo: '2.1'
orden: 9
nivel: basico
prerrequisitos:
  - distribucion-categorica
  - distribucion-binomial
  - coeficiente-multinomial
relaciones:
  - tipo: generaliza
    id: distribucion-binomial
etiquetas:
  - distribución discreta
  - vector aleatorio
  - conteos por categoría
  - covarianza negativa
resumen: >
  Da la probabilidad de los conteos de cada categoría en n repeticiones independientes de un experimento
  categórico. Generaliza la binomial a más de dos resultados; sus conteos están correlacionados.
formula: 'P(X_1 = x_1, \dots, X_k = x_k) = \frac{n!}{x_1! \cdots x_k!}\, p_1^{x_1} \cdots p_k^{x_k}'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: bolas-en-cajas
    valores:
      n: 10
    categorias:
      - etiqueta: Gana
        probabilidad: 0.5
      - etiqueta: Empata
        probabilidad: 0.25
      - etiqueta: Pierde
        probabilidad: 0.25
referencias:
  - clave: blitzstein-hwang
    capitulo: '7'
  - clave: agresti
publicado: true
---

## Intuición

Un equipo de futbol juega 10 partidos y en cada uno gana con probabilidad 0.5, empata con 0.25 y pierde con 0.25, sin que un resultado influya en el siguiente. Al final de la temporada interesa el registro completo: cuántos ganó, cuántos empató y cuántos perdió. Ese registro es un vector de tres conteos que suman 10, y la distribución multinomial da la probabilidad de cada registro posible.

La lógica es la misma que en la binomial, solo que con más casillas. Una secuencia concreta de resultados, por ejemplo cinco victorias, tres empates y dos derrotas en un orden determinado, tiene probabilidad igual al producto de las probabilidades de cada partido. Muchas secuencias producen el mismo registro, tantas como formas de repartir los 10 partidos en tres grupos de tamaños 5, 3 y 2. La probabilidad del registro es ese número de repartos por la probabilidad de cada secuencia.

Los conteos no son independientes: como siempre suman 10, cada victoria de más deja un partido menos para empatar o perder. Por eso, en una temporada con muchas victorias tiende a haber pocos empates, y la covarianza entre dos conteos distintos es negativa.

## Definición

:::definicion[Distribución multinomial]
Se repite $n$ veces, de forma independiente, un experimento categórico con probabilidades $\mathbf{p} = (p_1, \dots, p_k)$. Sea $X_j$ el número de veces que sale la categoría $j$. El vector $\mathbf{X} = (X_1, \dots, X_k)$ tiene **distribución multinomial**, $\mathbf{X} \sim \operatorname{Mult}(n, \mathbf{p})$, con
$$
P(X_1 = x_1, \dots, X_k = x_k) = \frac{n!}{x_1!\, x_2! \cdots x_k!}\, p_1^{x_1} p_2^{x_2} \cdots p_k^{x_k}
$$
para enteros $x_j \ge 0$ con $x_1 + \dots + x_k = n$, y probabilidad cero en otro caso.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{X}$: vector de conteos por categoría.
- $X_j$: número de repeticiones con resultado $j$.
- $n$: número de repeticiones, fijo.
- $k$: número de categorías.
- $p_j$: probabilidad de la categoría $j$ en cada repetición, con $\sum_j p_j = 1$.
- $x_j$: valor particular del conteo $j$.
- $\frac{n!}{x_1! \cdots x_k!}$: coeficiente multinomial, número de órdenes que producen esos conteos.
:::

## Cómo usar la visualización

Cada experimento es una temporada: las bolas caen una por una en la caja del resultado de cada partido, y los números sobre las cajas son los conteos. El histograma inferior muestra la distribución del conteo de la caja elegida en el selector, que es binomial. La pestaña "Conteos conjuntos" dibuja una rejilla triangular con los pares (victorias, empates): los círculos son las probabilidades teóricas y el relleno, la frecuencia observada.

En la rejilla la nube se inclina hacia abajo a la derecha: más victorias van con menos empates. El panel compara la covarianza teórica $-np_1p_2 = -1.25$ con la observada. Al cambiar la caja graficada a "Empata", la media del histograma pasa de 5 a 2.5.

## Ejemplo

En un cruce de dos plantas heterocigotas Aa, cada descendiente es AA con probabilidad 0.25, Aa con 0.5 y aa con 0.25. Con 8 descendientes, sea $\mathbf{X} = (X_{AA}, X_{Aa}, X_{aa}) \sim \operatorname{Mult}(8, (0.25, 0.5, 0.25))$.

1. Probabilidad de obtener exactamente las proporciones mendelianas 2, 4, 2: $\frac{8!}{2!\,4!\,2!}(0.25)^{2}(0.5)^{4}(0.25)^{2} = 420 \cdot 0.000244 \approx 0.1025$.
2. Aunque es el vector más probable, ocurre solo una de cada diez veces.
3. Conteo esperado de heterocigotas: $8 \cdot 0.5 = 4$, con varianza $8 \cdot 0.5 \cdot 0.5 = 2$.
4. Covarianza entre homocigotas dominantes y recesivas: $-8 \cdot 0.25 \cdot 0.25 = -0.5$.

:::figura[Los 8 descendientes del cruce caen en tres cajas. El encabezado muestra al final la probabilidad multinomial del vector obtenido, con su coeficiente y sus potencias.]{componente="DistributionGenesis"}
```yaml
proceso: bolas-en-cajas
valores:
  n: 8
categorias:
  - etiqueta: AA
    probabilidad: 0.25
  - etiqueta: Aa
    probabilidad: 0.5
  - etiqueta: aa
    probabilidad: 0.25
```
:::

## Propiedades

- **Marginales binomiales:** cada conteo cumple $X_j \sim \operatorname{Bin}(n, p_j)$, así que $\mathbb{E}[X_j] = np_j$ y $\operatorname{Var}(X_j) = np_j(1 - p_j)$.
- **Covarianza negativa:** para $i \ne j$, $\operatorname{Cov}(X_i, X_j) = -np_ip_j$.
- **Agrupación:** sumar conteos de categorías produce otra multinomial con las probabilidades sumadas.
- **Caso $k = 2$:** $(X_1, n - X_1)$ con $X_1 \sim \operatorname{Bin}(n, p_1)$.
- **Caso $n = 1$:** el vector de conteos es la codificación one-hot de una categórica.
- **Suma de categóricas:** $\mathbf{X}$ es la suma de $n$ vectores one-hot independientes, de donde salen su media $n\mathbf{p}$ y su matriz de covarianza $n(\operatorname{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^\top)$.

:::figura[Rejilla de pares (victorias, empates) en 10 partidos. Los círculos teóricos forman una nube que baja hacia la derecha: la covarianza es -10 · 0.5 · 0.25 = -1.25.]{componente="DistributionGenesis"}
```yaml
proceso: bolas-en-cajas
valores:
  n: 10
categorias:
  - etiqueta: Gana
    probabilidad: 0.5
  - etiqueta: Empata
    probabilidad: 0.25
  - etiqueta: Pierde
    probabilidad: 0.25
vista: conjunta
```
:::

:::figura[Con dos cajas la multinomial es una binomial: 12 lanzamientos de tiro libre repartidos entre "Encesta" y "Falla", con 0.7 y 0.3.]{componente="DistributionGenesis"}
```yaml
proceso: bolas-en-cajas
valores:
  n: 12
categorias:
  - etiqueta: Encesta
    probabilidad: 0.7
  - etiqueta: Falla
    probabilidad: 0.3
```
:::

:::demostracion
Escribimos $\mathbf{X} = \sum_{m=1}^{n} \mathbf{e}^{(m)}$ con vectores one-hot independientes. Para cada uno, $\mathbb{E}[e_i e_j] = 0$ si $i \ne j$, porque no pueden salir dos categorías a la vez; así $\operatorname{Cov}(e_i, e_j) = -p_ip_j$. Sumando las $n$ repeticiones independientes, $\operatorname{Cov}(X_i, X_j) = -np_ip_j$. La marginal es binomial porque $X_j$ cuenta las repeticiones con resultado $j$ frente a todas las demás.
:::

## Errores comunes

- **Tratar los conteos como independientes.** Multiplicar $P(X_1 = 5)\,P(X_2 = 3)\,P(X_3 = 2)$ no da la probabilidad conjunta, porque los conteos están atados por su suma.
- **Olvidar la restricción de la suma.** $P(X_1 = 6, X_2 = 3, X_3 = 2) = 0$ con $n = 10$: los conteos deben sumar exactamente $n$.
- **Confundirla con la categórica.** La categórica describe una sola observación; la multinomial describe los conteos de $n$ observaciones.
- **Usarla sin reemplazo.** Al extraer sin devolver de una población finita, el modelo es la hipergeométrica multivariada.

:::figura[Los conteos no son independientes: en la vista conjunta con n = 6 y tres categorías iguales, solo las casillas con x1 + x2 ≤ 6 tienen círculo, y su forma triangular es la huella de la restricción.]{componente="DistributionGenesis"}
```yaml
proceso: bolas-en-cajas
valores:
  n: 6
categorias:
  - etiqueta: A
    probabilidad: 1
  - etiqueta: B
    probabilidad: 1
  - etiqueta: C
    probabilidad: 1
vista: conjunta
```
:::

## Conexiones

La multinomial es la suma de repeticiones de la [[distribucion-categorica]] y generaliza la [[distribucion-binomial]], que es su marginal. Su coeficiente es el [[coeficiente-multinomial]]. Sin reemplazo se convierte en la hipergeométrica multivariada, extensión de la [[distribucion-hipergeometrica]]. Es la base de la prueba ji cuadrada de bondad de ajuste y de los modelos de tablas de contingencia. Cuando las probabilidades varían según una distribución de Dirichlet se obtiene la Dirichlet-multinomial, análoga a la [[distribucion-beta-binomial]].

## Formulario

:::formula[Función de masa]
$$
P(\mathbf{X} = \mathbf{x}) = \frac{n!}{x_1! \cdots x_k!}\, p_1^{x_1} \cdots p_k^{x_k}, \qquad \sum_{j} x_j = n
$$

- $\mathbf{x} = (x_1, \dots, x_k)$: conteos por categoría.
- $n$: repeticiones.
- $p_j$: probabilidad de la categoría $j$.
:::

:::formula[Marginal]
$$
X_j \sim \operatorname{Bin}(n, p_j), \qquad \mathbb{E}[X_j] = np_j, \qquad \operatorname{Var}(X_j) = np_j(1 - p_j)
$$

- $X_j$: conteo de una sola categoría frente a todas las demás.
:::

:::formula[Covarianza]
$$
\operatorname{Cov}(X_i, X_j) = -np_ip_j, \qquad i \ne j
$$

- $i$, $j$: dos categorías distintas.
- El signo negativo refleja que los conteos compiten por las $n$ repeticiones.
:::

:::formula[Matriz de covarianza]
$$
\operatorname{Cov}(\mathbf{X}) = n\left(\operatorname{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^\top\right)
$$

- $\operatorname{diag}(\mathbf{p})$: matriz diagonal con las $p_j$.
- $\mathbf{p}\mathbf{p}^\top$: matriz con entradas $p_ip_j$.
:::
