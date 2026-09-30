---
id: matrices-estocasticas
titulo: Matrices estocásticas
titulo_en: Stochastic matrices
alias:
  - matriz de transición
  - matriz de Markov
  - matriz estocástica por filas
  - matriz doblemente estocástica
modulo: 0
submodulo: '0.3'
orden: 42
nivel: intermedio
prerrequisitos:
  - valores-y-vectores-propios
etiquetas:
  - matriz de transición
  - cadenas de Markov
  - distribución estacionaria
  - probabilidades
resumen: >
  Una matriz estocástica tiene entradas no negativas y filas que suman 1; describe transiciones entre
  estados, siempre tiene el valor propio 1 y su vector propio izquierdo da la distribución estacionaria.
formula: 'p_{ij} \ge 0,\ \ \sum_j p_{ij} = 1, \qquad \boldsymbol{\pi}^\top P = \boldsymbol{\pi}^\top'
visualizacion:
  componente: MarkovChainViz
  parametros:
    estados: [Casa, Trabajo, Tienda]
    matriz:
      - [0.6, 0.3, 0.1]
      - [0.4, 0.5, 0.1]
      - [0.5, 0.2, 0.3]
referencias:
  - clave: norris
  - clave: ross-procesos
publicado: true
---

## Intuición

Una persona se mueve cada hora entre su casa, el trabajo y una tienda. Si está en casa, con probabilidad 0.6 se queda, con 0.3 va al trabajo y con 0.1 a la tienda; los demás lugares tienen sus propias probabilidades. Estas reglas caben en una tabla: una fila por el lugar actual, una columna por el lugar siguiente. Cada fila reparte todas las posibilidades, así que suma 1. Esa tabla es una matriz estocástica.

Si se conoce la probabilidad de estar en cada lugar ahora, multiplicar ese vector de probabilidades por la matriz da las probabilidades de la hora siguiente. Repetido muchas veces, el vector suele estabilizarse en una distribución que ya no cambia al multiplicar: la distribución estacionaria. En términos de álgebra lineal, es un vector propio con valor propio 1, y el hecho de que las filas sumen 1 garantiza que ese valor propio siempre existe.

## Definición

:::definicion[Matriz estocástica]
Una matriz $P \in \mathbb{R}^{n \times n}$ es **estocástica por filas** si
$$
p_{ij} \ge 0 \quad \text{y} \quad \sum_{j=1}^{n} p_{ij} = 1 \ \text{ para cada } i.
$$
Es **doblemente estocástica** si además sus columnas suman 1. Una **distribución estacionaria** es un vector de probabilidades $\boldsymbol{\pi}$ con $\boldsymbol{\pi}^\top P = \boldsymbol{\pi}^\top$.
:::

:::teorema[Valor propio 1]
Toda matriz estocástica tiene el valor propio 1 con vector propio derecho $\mathbf{1} = (1, \dots, 1)$, y todos sus valores propios cumplen $|\lambda| \le 1$. Si además todas las entradas de alguna potencia $P^k$ son positivas, la distribución estacionaria es única y $\boldsymbol{\mu}^\top P^t \to \boldsymbol{\pi}^\top$ para cualquier distribución inicial $\boldsymbol{\mu}$.
:::

:::nota[Qué significa cada símbolo]
- $P$: matriz de transición de $n \times n$.
- $p_{ij}$: probabilidad de pasar del estado $i$ al estado $j$ en un paso.
- $n$: número de estados.
- $\boldsymbol{\pi}$: distribución estacionaria, con entradas no negativas que suman 1.
- $\mathbf{1}$: vector de unos.
- $\boldsymbol{\mu}$: distribución inicial.
- $t$: número de pasos.
:::

## Cómo usar la visualización

El grafo muestra los tres lugares y las flechas con las probabilidades de transición. Al reproducir, una ficha salta de lugar en lugar según esas probabilidades, y las barras muestran la frecuencia con la que visitó cada uno, que se acerca a la distribución estacionaria. La semilla controla la secuencia aleatoria.

Tras muchas horas, las frecuencias dejan de cambiar aunque la ficha siga moviéndose. Con otra semilla el recorrido cambia, pero las frecuencias finales son las mismas: la distribución estacionaria no depende del punto de partida.

## Ejemplo

El clima de una ciudad se modela con dos estados, soleado y nublado: $P = \begin{pmatrix} 0.8 & 0.2 \\ 0.4 & 0.6 \end{pmatrix}$.

1. Las filas suman $0.8 + 0.2 = 1$ y $0.4 + 0.6 = 1$.
2. $P\mathbf{1} = (1, 1)^\top$: el valor propio 1 aparece con vector derecho $\mathbf{1}$.
3. Distribución estacionaria: $\boldsymbol{\pi}^\top P = \boldsymbol{\pi}^\top$ da $0.8\pi_1 + 0.4\pi_2 = \pi_1$, es decir, $0.4\pi_2 = 0.2\pi_1$, así que $\pi_1 = 2\pi_2$.
4. Con $\pi_1 + \pi_2 = 1$: $\boldsymbol{\pi} = (2/3, 1/3)$. A largo plazo, dos de cada tres días son soleados.
5. El otro valor propio es $\operatorname{tr}P - 1 = 0.4$: las diferencias con la distribución estacionaria se reducen a 40 % cada día.

:::figura[El clima del ejemplo como cadena de dos estados: la frecuencia de días soleados se acerca a dos tercios.]{componente="MarkovChainViz"}
```yaml
estados: [Soleado, Nublado]
matriz:
  - [0.8, 0.2]
  - [0.4, 0.6]
```
:::

:::figura[La transpuesta de la matriz del clima como transformación: la dirección (2, 1) no cambia, porque es la distribución estacionaria con valor propio 1, y la otra dirección propia se encoge a 0.4.]{componente="MatrixTransform"}
```yaml
modo: propios
matrices:
  - nombre: Transpuesta de P
    matriz: [[0.8, 0.4], [0.2, 0.6]]
```
:::

## Propiedades

- **Producto:** el producto de matrices estocásticas es estocástico; $P^t$ da las probabilidades de transición en $t$ pasos.
- **Radio espectral 1:** ningún valor propio supera 1 en valor absoluto.
- **Convergencia:** la velocidad con que $\boldsymbol{\mu}^\top P^t$ se acerca a $\boldsymbol{\pi}^\top$ depende del segundo valor propio más grande en valor absoluto.
- **Doblemente estocásticas:** tienen como distribución estacionaria la uniforme.
- **Matrices de permutación:** son doblemente estocásticas; por el teorema de Birkhoff, toda doblemente estocástica es promedio ponderado de permutaciones.

:::demostracion
$|\lambda| \le 1$: si $P\mathbf{v} = \lambda\mathbf{v}$ y $|v_k|$ es la mayor componente en valor absoluto, entonces $|\lambda|\,|v_k| = \big|\sum_j p_{kj}v_j\big| \le \sum_j p_{kj}|v_j| \le |v_k|\sum_j p_{kj} = |v_k|$.
:::

## Errores comunes

- **Confundir la convención de filas y columnas.** Algunos textos usan columnas que suman 1 y multiplican $P\mathbf{x}$; con filas se multiplica $\boldsymbol{\pi}^\top P$.
- **Buscar la estacionaria como vector propio derecho.** El vector propio derecho de 1 es $\mathbf{1}$; la estacionaria es el vector propio izquierdo, es decir, de $P^\top$.
- **Suponer que siempre hay convergencia.** Una cadena periódica, como $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$, oscila sin converger.
- **Olvidar normalizar.** El vector propio debe escalarse para que sus entradas sumen 1.

## Conexiones

Las matrices estocásticas son un caso donde los [[valores-y-vectores-propios]] tienen significado probabilístico directo, y el [[metodo-de-la-potencia]] es exactamente iterar la cadena hasta la estacionaria. Las [[matrices-especiales]] de permutación son su caso extremo. Son la base de las cadenas de Markov, del algoritmo PageRank y de muchos modelos de colas y de población.

## Formulario

:::formula[Matriz estocástica por filas]
$$
p_{ij} \ge 0, \qquad \sum_{j=1}^{n} p_{ij} = 1, \qquad P\mathbf{1} = \mathbf{1}
$$

- $p_{ij}$: probabilidad de transición de $i$ a $j$.
- $\mathbf{1}$: vector de unos.
:::

:::formula[Evolución de la distribución]
$$
\boldsymbol{\mu}_{t+1}^\top = \boldsymbol{\mu}_t^\top P, \qquad \boldsymbol{\mu}_t^\top = \boldsymbol{\mu}_0^\top P^t
$$

- $\boldsymbol{\mu}_t$: distribución en el paso $t$.
:::

:::formula[Distribución estacionaria]
$$
\boldsymbol{\pi}^\top P = \boldsymbol{\pi}^\top, \qquad \sum_i \pi_i = 1
$$

- $\boldsymbol{\pi}$: vector propio izquierdo de valor propio 1.
:::
