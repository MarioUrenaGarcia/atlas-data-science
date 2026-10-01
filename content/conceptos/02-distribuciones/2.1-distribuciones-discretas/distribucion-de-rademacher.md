---
id: distribucion-de-rademacher
titulo: Distribución de Rademacher
titulo_en: Rademacher distribution
alias:
  - Rademacher
  - signo aleatorio
  - variable de signo simétrico
modulo: 2
submodulo: '2.1'
orden: 15
nivel: intermedio
prerrequisitos:
  - distribucion-binomial
relaciones:
  - tipo: relacionado
    id: distribucion-de-skellam
etiquetas:
  - distribución discreta
  - signo aleatorio
  - caminata aleatoria
  - simetrización
resumen: >
  Toma los valores -1 y +1 con probabilidad 1/2 cada uno. Es el signo aleatorio más simple: tiene
  media 0 y varianza 1, y la suma de varios de ellos describe una caminata aleatoria.
formula: 'P(X = -1) = P(X = +1) = \tfrac{1}{2}'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: signos
    valores:
      n: 1
referencias:
  - clave: wasserman
    capitulo: '4'
  - clave: durrett
publicado: true
---

## Intuición

Una moneda justa decide si un paso se da hacia adelante o hacia atrás. Si se anota +1 para adelante y -1 para atrás, cada lanzamiento produce un signo aleatorio sin preferencia por ningún lado. Esa es la distribución de Rademacher: la versión centrada de una moneda justa.

Comparada con la Bernoulli de parámetro 1/2, que usa 0 y 1, la Rademacher está centrada en cero y tiene varianza exactamente 1. Esa normalización la hace muy cómoda: al sumar muchos signos independientes, la suma tiene media 0 y varianza igual al número de signos, y su recorrido es una caminata aleatoria que sube y baja de uno en uno.

Los signos aleatorios aparecen en muchos lugares de la estadística y el aprendizaje automático. En las pruebas de permutación de signos se cambia al azar el signo de diferencias pareadas para ver qué tan extremo es el resultado observado. En teoría del aprendizaje, la complejidad de Rademacher mide qué tan bien puede un modelo ajustarse a etiquetas que son puro ruido. Y en algoritmos de aproximación de matrices, los vectores de signos aleatorios sirven para estimar trazas y productos de manera económica.

## Definición

:::definicion[Distribución de Rademacher]
Una variable aleatoria $X$ tiene **distribución de Rademacher** si
$$
P(X = -1) = P(X = +1) = \frac{1}{2}.
$$
:::

Equivalentemente, $X = 2B - 1$ con $B \sim \operatorname{Bernoulli}(1/2)$. La suma de $n$ variables de Rademacher independientes, $S_n = X_1 + \dots + X_n$, cumple $S_n = 2\,\operatorname{Bin}(n, 1/2) - n$, de modo que
$$
P(S_n = s) = \binom{n}{(n + s)/2} 2^{-n}, \qquad s \in \{-n, -n + 2, \dots, n\}.
$$

:::nota[Qué significa cada símbolo]
- $X$: signo aleatorio, $-1$ o $+1$.
- $B$: variable de Bernoulli con parámetro 1/2.
- $X_1, \dots, X_n$: signos independientes.
- $S_n$: suma de los $n$ signos, la posición de una caminata aleatoria después de $n$ pasos.
- $s$: valor posible de la suma, con la misma paridad que $n$.
- $\binom{n}{(n + s)/2}$: número de secuencias con $(n + s)/2$ signos positivos.
- $2^{-n}$: probabilidad de cada secuencia.
:::

## Cómo usar la visualización

Cada experimento sortea $n$ signos: las fichas azules son $+1$ y las naranjas $-1$. Con $n = 1$ el histograma tiene dos barras de altura 1/2 en $-1$ y $+1$, con media 0 y varianza 1. Con varios signos, debajo de las fichas se dibuja la suma parcial como una caminata que sube y baja, y el histograma recoge la suma final.

Al subir $n$ a 2, la suma solo puede valer $-2$, 0 o 2, con probabilidades 1/4, 1/2 y 1/4. Con $n = 12$ las sumas impares nunca aparecen, porque la suma tiene la paridad de $n$, y la varianza observada se acerca a 12. Con $n = 40$ el histograma tiene forma de campana de ancho $\sqrt{40} \approx 6.3$.

## Ejemplo

Para evaluar si un tratamiento mejora una medición, se toman 10 pares de observaciones y se cambia al azar el signo de cada diferencia. Bajo la hipótesis de que el tratamiento no tiene efecto, el número de diferencias positivas menos el de negativas se comporta como $S_{10}$, la suma de 10 signos de Rademacher.

1. Media y varianza: $\mathbb{E}[S_{10}] = 0$ y $\operatorname{Var}(S_{10}) = 10$.
2. Empate perfecto, 5 positivas y 5 negativas: $P(S_{10} = 0) = \binom{10}{5}2^{-10} = 252/1024 \approx 0.246$.
3. Ocho o más positivas: $P(S_{10} \ge 6) = (45 + 10 + 1)/1024 \approx 0.0547$.
4. Resultado al menos tan desequilibrado en cualquier dirección: $P(|S_{10}| \ge 6) \approx 0.109$, todavía no muy raro.

:::figura[Diez signos aleatorios y su suma parcial como caminata. El histograma de la suma final solo tiene barras en valores pares, con el máximo 0.246 en el cero.]{componente="DistributionGenesis"}
```yaml
proceso: signos
valores:
  n: 10
```
:::

## Propiedades

- **Momentos:** $\mathbb{E}[X] = 0$, $X^{2} = 1$, así que $\operatorname{Var}(X) = 1$; todos los momentos impares valen 0 y los pares valen 1.
- **Simetría:** $-X$ tiene la misma distribución que $X$, y el producto de dos signos independientes es otro signo de Rademacher.
- **Suma:** $S_n = 2\,\operatorname{Bin}(n, 1/2) - n$ tiene media 0, varianza $n$ y valores con la paridad de $n$.
- **Función generadora:** $\mathbb{E}[e^{tX}] = \cosh t \le e^{t^{2}/2}$, la cota que hace a $X$ subgaussiana y que da origen a la desigualdad de Hoeffding.
- **Curtosis mínima:** con $\mathbb{E}[X^{4}] = 1$, su curtosis es 1, la menor posible para una variable con varianza 1.

:::figura[Con dos signos la suma vale -2, 0 o 2 con probabilidades 1/4, 1/2 y 1/4.]{componente="DistributionGenesis"}
```yaml
proceso: signos
valores:
  n: 2
```
:::

:::figura[Con 40 signos la suma tiene forma de campana centrada en 0, con desviación estándar 6.3, y solo toma valores pares.]{componente="DistributionGenesis"}
```yaml
proceso: signos
valores:
  n: 40
```
:::

:::demostracion
Si $B \sim \operatorname{Bernoulli}(1/2)$ y $X = 2B - 1$, entonces $\mathbb{E}[X] = 2 \cdot \tfrac{1}{2} - 1 = 0$ y $\operatorname{Var}(X) = 4\operatorname{Var}(B) = 4 \cdot \tfrac{1}{4} = 1$. Para la suma, $S_n = \sum (2B_i - 1) = 2\sum B_i - n$ con $\sum B_i \sim \operatorname{Bin}(n, 1/2)$. La cota exponencial sale de comparar series: $\cosh t = \sum_k \frac{t^{2k}}{(2k)!} \le \sum_k \frac{t^{2k}}{2^{k}k!} = e^{t^{2}/2}$, porque $(2k)! \ge 2^{k}k!$.
:::

## Errores comunes

- **Confundirla con la Bernoulli de parámetro 1/2.** Los valores 0 y 1 dan media 1/2 y varianza 1/4; los valores $-1$ y $+1$ dan media 0 y varianza 1.
- **Esperar sumas impares con n par.** Con un número par de signos la suma siempre es par; con 10 signos, $S_{10} = 3$ es imposible.
- **Pensar que la caminata regresa pronto al cero.** Aunque la media es 0, la desviación de $S_n$ crece como $\sqrt{n}$ y la caminata pasa largos tramos de un solo lado.
- **Generalizar a signos con probabilidades distintas.** Con $P(X = 1) = q \ne 1/2$ la media es $2q - 1$; esa variable ya no es de Rademacher.

:::figura[La Bernoulli(1/2) con valores 0 y 1: mismas probabilidades que la Rademacher, pero centrada en 1/2 y con varianza 1/4.]{componente="DistributionGenesis"}
```yaml
proceso: moneda
valores:
  p: 0.5
exito: Cara
fracaso: Cruz
```
:::

## Conexiones

La Rademacher es una transformación lineal de la [[distribucion-de-bernoulli]] de parámetro 1/2, y sus sumas son [[distribucion-binomial|binomiales]] reescaladas. Sumar signos da la caminata aleatoria simple, cuyo límite es el movimiento browniano; si los pasos ocurren en tiempos de Poisson, la posición sigue una [[distribucion-de-skellam]]. Su cota exponencial la convierte en el ejemplo básico de variable subgaussiana y en la herramienta de simetrización en teoría del aprendizaje.

## Formulario

:::formula[Función de masa]
$$
P(X = -1) = P(X = +1) = \frac{1}{2}
$$

- $X$: signo aleatorio.
:::

:::formula[Relación con la Bernoulli]
$$
X = 2B - 1, \qquad B \sim \operatorname{Bernoulli}(1/2)
$$

- $B$: variable con valores 0 y 1.
:::

:::formula[Suma de n signos]
$$
P(S_n = s) = \binom{n}{(n + s)/2} 2^{-n}, \qquad \mathbb{E}[S_n] = 0, \qquad \operatorname{Var}(S_n) = n
$$

- $S_n$: suma de $n$ signos independientes.
- $s$: valor con la paridad de $n$.
:::

:::formula[Función generadora de momentos]
$$
\mathbb{E}[e^{tX}] = \cosh t \le e^{t^{2}/2}
$$

- $t$: número real.
- $\cosh t = (e^{t} + e^{-t})/2$: coseno hiperbólico.
:::
