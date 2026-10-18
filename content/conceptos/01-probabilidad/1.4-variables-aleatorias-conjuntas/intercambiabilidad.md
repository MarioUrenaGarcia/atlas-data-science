---
id: intercambiabilidad
titulo: Intercambiabilidad
titulo_en: Exchangeability
alias:
  - variables intercambiables
  - sucesión intercambiable
  - simetría ante permutaciones
modulo: 1
submodulo: '1.4'
orden: 19
nivel: avanzado
prerrequisitos:
  - independencia-de-variables-aleatorias
relaciones:
  - tipo: generaliza
    id: independencia-de-variables-aleatorias
  - tipo: relacionado
    id: teorema-de-de-finetti
etiquetas:
  - permutaciones
  - urna de Pólya
  - orden irrelevante
  - modelos jerárquicos
resumen: >
  Una sucesión de variables es intercambiable si su distribución conjunta no cambia al reordenarlas:
  el orden de las observaciones no importa. Las sucesiones independientes e idénticas lo son, pero
  también otras que tienen dependencia.
formula: '(X_1, \dots, X_n) \overset{d}{=} (X_{\pi(1)}, \dots, X_{\pi(n)}) \quad \text{para toda permutación } \pi'
visualizacion:
  componente: ExchangeableViz
  parametros:
    modo: polya
    a: 1
    b: 1
    n: 80
    secuencias: 150
referencias:
  - clave: gelman-bda
    capitulo: '5.2'
publicado: true
---

## Intuición

Una urna tiene una bola roja y una azul. Se saca una al azar, se regresa junto con otra bola del mismo color, y se repite. Las extracciones no son independientes: sacar roja al principio hace más probable sacar roja después. Sin embargo, tienen una simetría notable: la probabilidad de la secuencia roja, roja, azul es la misma que la de roja, azul, roja o azul, roja, roja. Solo importa cuántas rojas hay, no en qué orden salieron.

Esa propiedad se llama **intercambiabilidad**. Es más débil que la independencia y más realista en muchas situaciones: los resultados de pacientes de un mismo hospital, las calificaciones de estudiantes de una misma escuela o los lanzamientos de una moneda cuyo sesgo se desconoce comparten algo en común, y por eso están relacionados, pero no hay razón para distinguir al primero del quinto.

## Definición

:::definicion[Intercambiabilidad]
Las variables $X_1, \dots, X_n$ son **intercambiables** si, para toda permutación $\pi$ de $\{1, \dots, n\}$,
$$
(X_1, \dots, X_n) \overset{d}{=} (X_{\pi(1)}, \dots, X_{\pi(n)}),
$$
es decir, si la distribución conjunta es simétrica en sus argumentos. Una sucesión infinita es intercambiable si lo son sus primeros $n$ términos para todo $n$.
:::

Para variables con valores 0 y 1, intercambiabilidad significa que la probabilidad de cada secuencia depende solo del número de unos que contiene.

:::figura[Urnas de Pólya que empiezan con 2 bolas de cada color: las proporciones se estabilizan en valores distintos para cada urna, repartidos según una beta con parámetros 2 y 2.]{componente="ExchangeableViz"}
```yaml
modo: polya
a: 2
b: 2
n: 60
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: variables aleatorias.
- $\pi$: permutación, un reordenamiento de los índices.
- $\overset{d}{=}$: igualdad en distribución.
- $a$, $b$: bolas iniciales de cada color en la urna de Pólya.
- $k$: número de extracciones del primer color entre $m$ realizadas.
- $R$, $A$: extracción de bola roja o azul.
- $q_n$: función que da la probabilidad de una secuencia según su número de unos.
:::

## Cómo usar la visualización

Cada línea es una urna de Pólya que empieza con una bola de cada color y registra la proporción de extracciones del primer color. Al principio las proporciones saltan mucho; después cada urna se estabiliza en su propio valor. El histograma de la derecha reúne las proporciones finales y se acerca a la densidad uniforme, la beta con parámetros 1 y 1. El encabezado da la probabilidad de la siguiente extracción en la urna resaltada.

Las deslizaderas cambian las bolas iniciales. Con más bolas iniciales las urnas se parecen más entre sí y el histograma se concentra; con pocas, cada urna toma su propio rumbo.

## Ejemplo

Una urna empieza con una bola roja y una azul. Probabilidades de las secuencias de tres extracciones con dos rojas:

1. $P(R, R, A) = \tfrac{1}{2} \cdot \tfrac{2}{3} \cdot \tfrac{1}{4} = \tfrac{1}{12}$.
2. $P(R, A, R) = \tfrac{1}{2} \cdot \tfrac{1}{3} \cdot \tfrac{2}{4} = \tfrac{1}{12}$.
3. $P(A, R, R) = \tfrac{1}{2} \cdot \tfrac{1}{3} \cdot \tfrac{2}{4} = \tfrac{1}{12}$.
4. Las tres son iguales: la sucesión es intercambiable. Pero no es independiente: $P(X_2 = R \mid X_1 = R) = 2/3 \ne 1/2 = P(X_2 = R)$.

:::figura[Tres extracciones de la urna con una bola de cada color: la probabilidad de cada secuencia, en el encabezado, solo depende del número de rojas, y el número total de rojas resulta uniforme entre 0 y 3.]{componente="ExchangeableViz"}
```yaml
modo: de-finetti
a: 1
b: 1
n: 3
```
:::

## Propiedades

- **Independientes e idénticas:** toda sucesión independiente con la misma distribución es intercambiable; el recíproco es falso.
- **Marginales iguales:** en una sucesión intercambiable todas las $X_i$ tienen la misma distribución, y todos los pares $(X_i, X_j)$ con $i \ne j$ la misma conjunta.
- **Correlación no negativa:** en una sucesión intercambiable infinita, $\operatorname{Cov}(X_i, X_j) \ge 0$.
- **Muestreo sin reemplazo:** las extracciones sin reemplazo de una población finita son intercambiables, aunque dependientes.
- **Representación:** por el teorema de De Finetti, una sucesión infinita de ceros y unos intercambiable es una mezcla de sucesiones independientes.

:::figura[Con 5 bolas iniciales de cada color las urnas se parecen más: las proporciones finales se concentran alrededor de 0.5, según una beta con parámetros 5 y 5.]{componente="ExchangeableViz"}
```yaml
modo: polya
a: 5
b: 5
n: 80
```
:::

## Errores comunes

- **Confundir intercambiable con independiente.** En la urna de Pólya, observar muchas rojas cambia la predicción de la siguiente extracción.
- **Suponer intercambiabilidad cuando hay tendencias o estructura temporal.** Si las observaciones cambian con el tiempo, por ejemplo por desgaste de un equipo o aprendizaje de un paciente, el orden sí aporta información y el supuesto no se cumple.
- **Suponer que la proporción converge al mismo valor en todas las repeticiones.** En una sucesión intercambiable la proporción límite es aleatoria.

:::figura[Una urna que empieza con 1 bola del primer color y 3 del segundo: las proporciones límite se cargan hacia valores bajos, y cada urna se estabiliza en un valor distinto.]{componente="ExchangeableViz"}
```yaml
modo: polya
a: 1
b: 3
n: 80
```
:::

## Conexiones

La intercambiabilidad generaliza la [[independencia-de-variables-aleatorias]] de variables idénticas, conservando la simetría de la [[distribucion-conjunta]]. El [[teorema-de-de-finetti]] la representa como una mezcla de sucesiones independientes, y es el fundamento de los modelos jerárquicos de la estadística bayesiana. La [[correlacion-de-pearson]] entre dos términos distintos de una sucesión intercambiable infinita nunca es negativa.

## Formulario

:::formula[Intercambiabilidad]
$$
(X_1, \dots, X_n) \overset{d}{=} (X_{\pi(1)}, \dots, X_{\pi(n)})
$$

- $X_1, \dots, X_n$: variables aleatorias.
- $\pi$: cualquier permutación de los índices $1, \dots, n$.
- $\overset{d}{=}$: igualdad en distribución conjunta.
:::

:::formula[Secuencias binarias]
$$
P(X_1 = x_1, \dots, X_n = x_n) = q_n\Big(\sum_{i=1}^{n} x_i\Big)
$$

- $x_1, \dots, x_n$: una secuencia de ceros y unos.
- $\sum_i x_i$: número de unos de la secuencia.
- $q_n$: función que da la probabilidad de cada secuencia según su número de unos.
:::

:::formula[Urna de Pólya]
$$
P(X_{m+1} = 1 \mid k \text{ unos en } m) = \frac{a + k}{a + b + m}
$$

- $a$, $b$: bolas iniciales de cada color.
- $m$: extracciones realizadas; $k$: cuántas fueron del primer color.
- $X_{m+1} = 1$: la siguiente extracción es del primer color.
:::

:::formula[Probabilidad de una secuencia de la urna]
$$
P(x_1, \dots, x_n) = \frac{a^{(k)}\, b^{(n-k)}}{(a + b)^{(n)}}, \qquad c^{(j)} = c(c+1)\cdots(c+j-1)
$$

- $k$: número de unos de la secuencia, de longitud $n$.
- $c^{(j)}$: producto creciente de $j$ factores que empieza en $c$; vale 1 si $j = 0$.
:::
