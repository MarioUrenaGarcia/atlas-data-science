---
id: teorema-de-de-finetti
titulo: Teorema de De Finetti
titulo_en: De Finetti's theorem
alias:
  - representación de De Finetti
  - mezcla de independientes
  - teorema de representación
modulo: 1
submodulo: '1.4'
orden: 20
nivel: avanzado
prerrequisitos:
  - intercambiabilidad
relaciones:
  - tipo: relacionado
    id: interpretacion-subjetiva-o-bayesiana
  - tipo: relacionado
    id: distribucion-beta-binomial
etiquetas:
  - representación
  - mezcla
  - parámetro aleatorio
  - fundamento bayesiano
resumen: >
  Toda sucesión infinita intercambiable de ceros y unos se comporta como si primero se eligiera al azar una probabilidad p y luego se hicieran ensayos independientes con esa p.
formula: 'P(X_1 = x_1, \dots, X_n = x_n) = \int_0^1 p^{k} (1 - p)^{n - k}\, dG(p), \qquad k = \sum_{i=1}^{n} x_i'
visualizacion:
  componente: ExchangeableViz
  parametros:
    modo: de-finetti
    a: 2
    b: 3
    n: 8
referencias:
  - clave: gelman-bda
    capitulo: '5.2'
  - clave: durrett
publicado: true
---

## Intuición

Una moneda de origen desconocido se lanza muchas veces. Antes de ver resultados, ningún orden de caras y cruces parece más probable que otro con el mismo número de caras: la sucesión es intercambiable. Pero los lanzamientos no son independientes en la mente de quien observa: si salen muchas caras, se sospecha que la moneda está cargada y se espera más caras.

El **teorema de De Finetti** dice que esa situación tiene siempre la misma estructura: es como si la moneda tuviera un sesgo $p$ desconocido, elegido al azar según cierta distribución, y dados ese $p$ los lanzamientos fueran independientes. La dependencia viene solo de no conocer $p$. Esto da un fundamento al razonamiento bayesiano: la distribución previa sobre un parámetro no es una suposición adicional, sino la forma que toma cualquier creencia intercambiable.

## Definición

:::teorema[Teorema de De Finetti]
Sea $X_1, X_2, \dots$ una sucesión infinita intercambiable de variables con valores en $\{0, 1\}$. Existe una distribución $G$ en $[0, 1]$ tal que, para todo $n$ y todos $x_1, \dots, x_n \in \{0, 1\}$,
$$
P(X_1 = x_1, \dots, X_n = x_n) = \int_0^1 p^{k} (1 - p)^{n - k}\, dG(p), \qquad k = \sum_{i=1}^{n} x_i.
$$
Además, la proporción $\frac{1}{n}\sum_{i=1}^{n} X_i$ converge con probabilidad 1 a una variable aleatoria con distribución $G$.
:::

Dicho de otro modo: elegir un parámetro aleatorio $\Theta$ según $G$ y, dado $\Theta = p$, generar $X_1, X_2, \dots$ independientes con $P(X_i = 1) = p$ produce exactamente la misma distribución que la sucesión original.

:::figura[La urna que empieza con una bola de cada color corresponde a $G$ uniforme: el número de éxitos en 5 extracciones vale cada número de 0 a 5 con probabilidad 1/6, igual en la urna y en la mezcla.]{componente="ExchangeableViz"}
```yaml
modo: de-finetti
a: 1
b: 1
n: 5
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, X_2, \dots$: sucesión intercambiable de ceros y unos.
- $x_1, \dots, x_n$: una secuencia particular; $k$: su número de unos.
- $p$: probabilidad de éxito; $\Theta$: esa probabilidad tratada como variable aleatoria.
- $G$: distribución de $\Theta$, la mezcla.
- $\mathbb{E}[\Theta]$: media del parámetro aleatorio, la probabilidad de éxito antes de observar.
- $\int \cdots dG(p)$: promedio sobre los valores de $p$ con pesos dados por $G$.
- $a$, $b$: parámetros de la beta y bolas iniciales de la urna.
- $B(\cdot, \cdot)$: función beta.
:::

## Cómo usar la visualización

Cada repetición genera 8 extracciones de dos maneras: con una urna de Pólya que empieza con 2 bolas de un color y 3 del otro, y con una mezcla que primero sortea $p$ de una beta con parámetros 2 y 3 y luego hace 8 ensayos independientes con esa $p$. Las barras comparan las frecuencias del número de éxitos en ambas construcciones, y los puntos son las probabilidades exactas, una beta-binomial.

El encabezado toma la última secuencia de la urna y da su probabilidad exacta, que depende solo de su número de éxitos. Las deslizaderas cambian $a$ y $b$, y ambas construcciones cambian a la par.

## Ejemplo

Una urna de Pólya empieza con 2 bolas rojas y 1 azul. Por el teorema, equivale a elegir $p$ de una beta con parámetros 2 y 1 y hacer ensayos independientes.

1. Antes de observar: $P(X_1 = \text{roja}) = \mathbb{E}[\Theta] = 2/3$, la media de la beta con parámetros 2 y 1.
2. Tras 5 extracciones con 4 rojas, la urna tiene $2 + 4 = 6$ rojas y $1 + 1 = 2$ azules: $P(X_6 = \text{roja} \mid \dots) = 6/8 = 0.75$.
3. Con la mezcla: la distribución de $p$ dadas 4 rojas de 5 es una beta con parámetros $2 + 4$ y $1 + 1$, de media $6/8 = 0.75$. Las dos lecturas coinciden.

:::figura[La urna con 2 rojas y 1 azul: las proporciones de rojas se estabilizan en valores distintos, distribuidos según la beta con parámetros 2 y 1, cargada hacia valores altos.]{componente="ExchangeableViz"}
```yaml
modo: polya
a: 2
b: 1
n: 80
```
:::

## Propiedades

- **Unicidad:** la distribución mezcladora $G$ queda determinada por la sucesión.
- **Identificación de $G$:** es la distribución del límite de las proporciones; por eso se puede aprender de los datos.
- **Predicción:** la probabilidad del siguiente éxito, dados los anteriores, es la media de la distribución de $p$ actualizada con esos datos.
- **Sucesiones infinitas:** el teorema necesita intercambiabilidad para todo $n$; para sucesiones finitas la representación puede fallar.
- **Generalización:** con valores reales, o en los espacios usuales de la probabilidad, una sucesión infinita intercambiable es una mezcla de sucesiones independientes e idénticamente distribuidas (teorema de Hewitt y Savage).

:::figura[Con parámetros 6 y 6 la mezcla se concentra alrededor de $p = 0.5$, con desviación estándar 0.14: el número de éxitos en 10 extracciones se acerca más a una binomial que con parámetros 1 y 1, pero sigue siendo más disperso, con varianza 4.23 frente a 2.5.]{componente="ExchangeableViz"}
```yaml
modo: de-finetti
a: 6
b: 6
n: 10
```
:::

## Errores comunes

- **Aplicarlo a sucesiones finitas.** Sacar sin reemplazo las dos bolas de una urna con una roja y una azul da una sucesión intercambiable de dos términos que no es mezcla de independientes: la probabilidad de dos rojas es 0, y ninguna mezcla de independientes la anula sin anular también la de una sola roja.
- **Creer que existe un $p$ verdadero oculto en la urna.** El teorema dice que la sucesión se comporta como si existiera; el $p$ es una construcción que reproduce la misma distribución.
- **Confundir la mezcla con independencia.** Marginalmente los términos son dependientes; solo son independientes condicionalmente en $p$.

:::figura[Con parámetros 1 y 1 la incertidumbre sobre $p$ es grande, porque $\Theta$ es uniforme: el número de éxitos en 10 extracciones es uniforme entre 0 y 10, muy distinto de una binomial con $p = 1/2$.]{componente="ExchangeableViz"}
```yaml
modo: de-finetti
a: 1
b: 1
n: 10
```
:::

## Conexiones

El teorema representa toda sucesión infinita con [[intercambiabilidad]] como una mezcla de sucesiones con [[independencia-de-variables-aleatorias]]. Da un fundamento a la [[interpretacion-subjetiva-o-bayesiana]] de la probabilidad y a los modelos jerárquicos. El número de éxitos en la urna de Pólya sigue la [[distribucion-beta-binomial]], mezcla de la [[distribucion-binomial]] con una beta. La convergencia de la proporción a una variable aleatoria contrasta con la [[ley-debil-de-los-grandes-numeros]], donde el límite es una constante.

## Formulario

:::formula[Representación de De Finetti]
$$
P(X_1 = x_1, \dots, X_n = x_n) = \int_0^1 p^{k} (1 - p)^{n - k}\, dG(p)
$$

- $X_1, X_2, \dots$: sucesión infinita intercambiable de ceros y unos; $x_1, \dots, x_n$: una secuencia.
- $k = \sum_i x_i$: número de unos de la secuencia.
- $p^k (1 - p)^{n-k}$: probabilidad de la secuencia con ensayos independientes de probabilidad $p$.
- $G$: distribución mezcladora, la del parámetro aleatorio $\Theta$.
:::

:::formula[Urna de Pólya]
$$
P(x_1, \dots, x_n) = \frac{B(a + k,\ b + n - k)}{B(a, b)}
$$

- $a$, $b$: bolas iniciales de cada color, parámetros de la mezcla $G = \operatorname{Beta}(a, b)$.
- $B(\cdot, \cdot)$: función beta, $B(a, b) = \int_0^1 t^{a-1}(1-t)^{b-1}\,dt$.
:::

:::formula[Número de éxitos]
$$
P\Big(\sum_{i=1}^{n} X_i = k\Big) = \binom{n}{k} \frac{B(a + k,\ b + n - k)}{B(a, b)}
$$

- $\binom{n}{k}$: número de secuencias con $k$ unos entre $n$.
- La distribución resultante es la beta-binomial.
:::

:::formula[Predicción con la urna]
$$
P(X_{n+1} = 1 \mid k \text{ unos en } n) = \frac{a + k}{a + b + n} = \mathbb{E}[\Theta \mid k \text{ unos en } n]
$$

- La media de la beta con parámetros $a + k$ y $b + n - k$; con $a = 2$, $b = 1$, $n = 5$ y $k = 4$ vale $6/8$.
:::
