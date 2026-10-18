---
id: medida-y-espacio-de-medida
titulo: Medida y espacio de medida
titulo_en: Measure and measure space
alias:
  - medida
  - espacio de medida
  - aditividad numerable
  - sigma-aditividad
modulo: 0
submodulo: '0.9'
orden: 3
nivel: avanzado
prerrequisitos:
  - espacio-medible
  - series-y-convergencia-de-series
etiquetas:
  - teoría de la medida
  - aditividad
  - continuidad
  - probabilidad
resumen: >
  Una medida asigna a cada conjunto medible un número no negativo, posiblemente infinito, de modo que la
  medida de una unión numerable disjunta es la suma de las medidas. Con medida total 1 es una probabilidad.
formula: '\mu(\varnothing) = 0, \qquad \mu\Big(\bigcup_{n=1}^{\infty} A_n\Big) = \sum_{n=1}^{\infty} \mu(A_n) \text{ si los } A_n \text{ son disjuntos}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: continuidad
    sentido: creciente
referencias:
  - clave: durrett
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Longitud, área, volumen, masa, número de elementos y probabilidad comparten una regla: si un objeto se parte en piezas que no se traslapan, su tamaño es la suma de los tamaños de las piezas. Una medida es cualquier asignación de tamaños que cumple esa regla, también cuando las piezas son infinitas en número, siempre que se puedan contar.

La versión numerable de la aditividad es la que permite pasar al límite. Si una región se va llenando con conjuntos crecientes, sus medidas suben hasta la medida de la región completa; si se va vaciando con conjuntos decrecientes de medida finita, bajan hasta la medida de lo que queda. Esta continuidad es la que justifica calcular probabilidades de eventos definidos por procesos infinitos.

Un espacio de medida reúne las tres piezas: el conjunto, los conjuntos medibles y la medida. Cuando la medida total vale 1, es un espacio de probabilidad.

## Definición

:::definicion[Medida y espacio de medida]
Sea $(\Omega, \mathcal{F})$ un espacio medible. Una medida es una función $\mu : \mathcal{F} \to [0, \infty]$ tal que

1. $\mu(\varnothing) = 0$;
2. para conjuntos $A_1, A_2, \dots \in \mathcal{F}$ disjuntos dos a dos, $\mu\big(\bigcup_{n} A_n\big) = \sum_{n} \mu(A_n)$.

La terna $(\Omega, \mathcal{F}, \mu)$ es un espacio de medida. Si $\mu(\Omega) < \infty$ la medida es finita, y si $\mu(\Omega) = 1$ es una medida de probabilidad.
:::

Ejemplos: la medida de conteo $\mu(A) = |A|$; la medida de Dirac $\delta_x(A) = \mathbf{1}\{x \in A\}$; la medida de Lebesgue en $\mathbb{R}$, que asigna a cada intervalo su longitud.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F})$: espacio medible.
- $\mu$: medida; $\mu(A)$: medida del conjunto $A$.
- $[0, \infty]$: números no negativos más el valor infinito.
- $A_n$: conjuntos medibles disjuntos dos a dos.
- $|A|$: número de elementos de $A$.
- $\delta_x$: medida de Dirac en el punto $x$; $\mathbf{1}\{x \in A\}$: vale 1 si $x \in A$ y 0 si no.
:::

## Cómo usar la visualización

Cada renglón es un conjunto de la sucesión creciente $A_n = [0, 1 - 1/n]$, dibujado sobre el intervalo $[0, 1]$; el renglón actual se resalta. El encabezado escribe la medida de Lebesgue de $A_n$ y su límite. La reproducción agrega un conjunto por paso, hasta $n = 12$.

Las barras se alargan: la medida pasa de 0 con $n = 1$ a 0.5, 0.667, ..., y llega a 0.917 con $n = 12$, acercándose a 1, la medida de la unión $[0, 1)$. La diferencia con el límite es exactamente $1/n$.

## Ejemplo

El conjunto de Cantor $C$ se obtiene quitando de $[0, 1]$ los tercios centrales abiertos una y otra vez. Sea $C_k$ lo que queda tras $k$ pasos.

1. $C_k$ está formado por $2^k$ intervalos disjuntos de longitud $3^{-k}$, así que $\lambda(C_k) = 2^k 3^{-k} = (2/3)^k$.
2. Los $C_k$ decrecen y $C = \bigcap_k C_k$.
3. Como $\lambda(C_1) = 2/3$ es finita, la continuidad desde arriba da $\lambda(C) = \lim_k (2/3)^k = 0$.
4. Con $k = 4$ ya se ha quitado $1 - 0.198 = 0.802$ de la longitud.

:::figura[Construcción del conjunto de Cantor nivel por nivel: la longitud total baja de 1 a 0.667, 0.444, 0.296 y 0.198, y con 8 niveles ya es 0.039.]{componente="MeasureLab"}
```yaml
modo: cantor
```
:::

## Propiedades

- **Monotonía:** si $A \subseteq B$, entonces $\mu(A) \le \mu(B)$.
- **Subaditividad numerable:** $\mu\big(\bigcup_n A_n\big) \le \sum_n \mu(A_n)$ para conjuntos cualesquiera.
- **Continuidad desde abajo:** si $A_1 \subseteq A_2 \subseteq \cdots$, entonces $\mu\big(\bigcup_n A_n\big) = \lim_n \mu(A_n)$.
- **Continuidad desde arriba:** si $A_1 \supseteq A_2 \supseteq \cdots$ y $\mu(A_1) < \infty$, entonces $\mu\big(\bigcap_n A_n\big) = \lim_n \mu(A_n)$.

:::figura[Sucesión decreciente $[0, 1/n]$: las medidas 1, 0.5, 0.333 y siguientes bajan hasta 0.083 con $n = 12$ y tienden a 0, la medida de la intersección, que es el punto 0.]{componente="MeasureLab"}
```yaml
modo: continuidad
sentido: decreciente
```
:::

- **Inclusión y exclusión:** si $\mu(A \cap B) < \infty$, $\mu(A \cup B) = \mu(A) + \mu(B) - \mu(A \cap B)$.

## Errores comunes

- **Aplicar la continuidad desde arriba sin medida finita.** Con la medida de Lebesgue en $\mathbb{R}$, los conjuntos $[n, \infty)$ decrecen hasta el vacío, pero cada uno mide infinito: el límite de las medidas es $\infty$, no 0.
- **Confundir aditividad finita con numerable.** Hay funciones finitamente aditivas que no son medidas; la aditividad numerable es la que permite los teoremas de límite.
- **Pensar que medida cero implica conjunto vacío o finito.** El conjunto de Cantor es no numerable y mide cero.

:::figura[El conjunto de Cantor a partir del nivel 3: quedan 8 intervalos con longitud 0.296, y aunque la longitud tiende a cero, siempre quedan puntos, como los extremos 0, 1/3, 2/3 y 1.]{componente="MeasureLab"}
```yaml
modo: cantor
nivel: 3
```
:::

- **Usar la suma cuando los conjuntos se traslapan.** La aditividad exige conjuntos disjuntos; con traslapes solo vale la subaditividad.

## Conexiones

Agrega números a un [[espacio-medible]] respetando la suma de [[series-y-convergencia-de-series]]. La [[medida-de-lebesgue]] es el ejemplo central en la recta, los [[conjuntos-de-medida-cero-y-propiedades-casi-seguras]] son los que la medida no distingue del vacío, y la [[integral-de-lebesgue]] se define respecto de una medida. Con $\mu(\Omega) = 1$ se recuperan los [[axiomas-de-kolmogorov]].

## Formulario

:::formula[Aditividad numerable]
$$
\mu\Big(\bigcup_{n=1}^{\infty} A_n\Big) = \sum_{n=1}^{\infty}\mu(A_n), \qquad A_i \cap A_j = \varnothing \ (i \ne j)
$$

- $\mu$: medida; $A_n$: conjuntos medibles disjuntos dos a dos.
:::

:::formula[Continuidad desde abajo y desde arriba]
$$
A_n \uparrow A \Rightarrow \mu(A_n) \to \mu(A), \qquad A_n \downarrow A,\ \mu(A_1) < \infty \Rightarrow \mu(A_n) \to \mu(A)
$$

- $A_n \uparrow A$: sucesión creciente con unión $A$; $A_n \downarrow A$: sucesión decreciente con intersección $A$.
:::

:::formula[Subaditividad]
$$
\mu\Big(\bigcup_n A_n\Big) \le \sum_n \mu(A_n)
$$

- $A_n$: conjuntos medibles cualesquiera, no necesariamente disjuntos.
:::

:::formula[Medida del conjunto de Cantor]
$$
\lambda(C_k) = \Big(\frac{2}{3}\Big)^{k} \to 0
$$

- $C_k$: lo que queda tras $k$ pasos; $\lambda$: medida de Lebesgue.
:::
