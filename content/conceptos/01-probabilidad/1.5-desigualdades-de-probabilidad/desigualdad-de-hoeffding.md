---
id: desigualdad-de-hoeffding
titulo: Desigualdad de Hoeffding
titulo_en: Hoeffding's inequality
alias:
  - cota de Hoeffding
  - concentración de variables acotadas
modulo: 1
submodulo: '1.5'
orden: 9
nivel: avanzado
prerrequisitos:
  - cota-de-chernoff
relaciones:
  - tipo: relacionado
    id: desigualdad-de-bernstein
  - tipo: relacionado
    id: ley-fuerte-de-los-grandes-numeros
etiquetas:
  - variables acotadas
  - promedio
  - tamaño de muestra
  - cota exponencial
resumen: >
  Si n variables independientes toman valores en un intervalo de longitud c, la probabilidad de que
  su promedio se aleje t de su media decae como exp(-2nt²/c²). Solo usa el rango de las variables, no
  su distribución.
formula: 'P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{2 n t^2}{(b - a)^2}\right), \qquad a \le X_i \le b'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: concentracion
    p: 0.5
    umbral: 0.05
    n: 1000
    cotas: [hoeffding, chebyshev]
referencias:
  - clave: wasserman
    capitulo: '4.1'
publicado: true
---

## Intuición

Para estimar la proporción de votantes que apoya a un candidato se encuesta a $n$ personas elegidas al azar. Cada respuesta es 0 o 1, y el promedio estima la proporción verdadera. ¿Cuántas personas hacen falta para que el error sea menor que 3 puntos porcentuales con 95 % de confianza? La **desigualdad de Hoeffding** responde sin saber nada de la proporción verdadera, usando solo que cada respuesta está entre 0 y 1.

La idea es la de Chernoff: cada variable acotada tiene una función generadora de momentos controlada por su rango, y la de la suma es el producto. El resultado es una cota que decae como $e^{-2nt^2}$: duplicar el tamaño de muestra eleva al cuadrado la cota, y para desviaciones moderadas las probabilidades se vuelven minúsculas muy rápido.

## Definición

:::teorema[Desigualdad de Hoeffding]
Sean $X_1, \dots, X_n$ independientes con $a_i \le X_i \le b_i$, y sea $\bar{X}_n$ su promedio, con media $\mu$. Para todo $t > 0$,
$$
P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{2 n^2 t^2}{\sum_{i=1}^{n} (b_i - a_i)^2}\right).
$$
Si todas toman valores en $[a, b]$, la cota es $\exp\big(-2nt^2/(b - a)^2\big)$, y para las dos colas se multiplica por 2.
:::

La pieza clave es el lema de Hoeffding: si $a \le X \le b$ y $\mathbb{E}[X] = 0$, entonces $\mathbb{E}[e^{sX}] \le e^{s^2 (b - a)^2/8}$. Con él se aplica el método de Chernoff y se optimiza $s$.

:::figura[Con $p = 0.2$ y una desviación de 0.1 la cota de Hoeffding, $e^{-2n \cdot 0.01}$, es una recta en escala logarítmica, siempre por encima de la probabilidad exacta y más plana que ella: la exacta cae con pendiente $D(0.3 \,\|\, 0.2) \approx 0.028$ por ensayo y la cota con $2t^2 = 0.02$. La distancia crece con $n$: la cota es unas 12 veces la exacta en $n = 100$ y unas 100 veces en $n = 300$.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.2
umbral: 0.1
n: 300
cotas: [hoeffding]
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: variables independientes acotadas.
- $a_i$, $b_i$: extremos del intervalo de $X_i$; $a$, $b$: extremos comunes.
- $\bar{X}_n$: promedio; $\mu$: su media.
- $t$: desviación; $s$: parámetro del método de Chernoff.
- $\varepsilon$: error tolerado; $\delta$: probabilidad de fallar.
- $\exp(x) = e^x$; $\mathbb{E}$: esperanza; $\log$: logaritmo natural; $m$: número de promedios controlados a la vez.
:::

## Cómo usar la visualización

En escala logarítmica, la gráfica compara la probabilidad exacta de que el promedio de $n$ ensayos con $p = 0.5$ supere $0.55$ con las cotas de Hoeffding, $e^{-2n \cdot 0.0025}$, y de Chebyshev, $0.25/(n \cdot 0.0025)$. Con 1000 ensayos, la exacta es cerca de 0.0009, Hoeffding da 0.0067 y Chebyshev 0.1.

Las deslizaderas cambian $p$, $t$ y $n$. La cota de Hoeffding no depende de $p$: es la misma para cualquier proporción. Por eso es conservadora cuando $p$ está cerca de 0 o 1.

## Ejemplo

¿Cuántas personas hay que encuestar para que el error de la proporción estimada sea menor que $\varepsilon = 0.03$ con probabilidad al menos 0.95?

1. Hoeffding para las dos colas: $P(|\bar{X}_n - p| \ge 0.03) \le 2e^{-2n(0.03)^2}$.
2. Se pide $2e^{-0.0018n} \le 0.05$, es decir $0.0018n \ge \log 40 \approx 3.689$.
3. $n \ge 2050$ personas, sin suponer nada sobre la proporción verdadera.
4. Con Chebyshev habría que tomar $n \ge 0.25/(0.05 \cdot 0.0009) \approx 5556$.

:::figura[El ejemplo de la encuesta: con una desviación de 0.03, la cota de Hoeffding para una cola, la mitad de la cota de dos colas, baja a 0.025 en $n = 2050$ y vale 0.023 en el extremo derecho, $n = 2100$. La probabilidad exacta con $p = 0.5$ es todavía menor, y la cota de Chebyshev sigue muy arriba.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.5
umbral: 0.03
n: 2100
cotas: [hoeffding, chebyshev]
```
:::

## Propiedades

- **Tamaño de muestra:** para $P(|\bar{X}_n - \mu| \ge \varepsilon) \le \delta$ basta $n \ge \frac{(b - a)^2}{2\varepsilon^2}\log\frac{2}{\delta}$.
- **Independiente de la distribución:** solo usa el rango; vale igual para cualquier distribución en $[a, b]$.
- **Comparación:** es un caso particular, más simple, de la cota de Chernoff para variables acotadas, y casi tan buena como ella cuando $p$ está cerca de 1/2.
- **Uniforme en muchas hipótesis:** combinada con la cota de la unión, controla a la vez $m$ promedios con un costo de solo $\log m$ en el tamaño de muestra.

:::figura[Con $p = 0.5$, Hoeffding y Chernoff casi coinciden: la varianza de una Bernoulli con $p = 1/2$ es la máxima posible y el rango no desperdicia información.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.5
umbral: 0.15
n: 200
cotas: [hoeffding, chernoff]
```
:::

## Errores comunes

- **Aplicarla a variables no acotadas.** Para la normal o la exponencial hacen falta otras cotas, como Chernoff con su función generadora.
- **Ignorar la varianza cuando es pequeña.** Si $p = 0.02$, Hoeffding se comporta como si la varianza fuera 1/4; la desigualdad de Bernstein aprovecha la varianza real y es mucho mejor.
- **Olvidar el factor 2 de las dos colas.** La cota básica es para una cola; para $|\bar{X}_n - \mu| \ge t$ se duplica.

:::figura[Eventos raros, $p = 0.02$ y desviación 0.03: la cota de Hoeffding queda muy por encima de la de Bernstein, que usa la varianza real $p(1 - p) \approx 0.02$.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.02
umbral: 0.03
n: 1000
cotas: [hoeffding, bernstein]
```
:::

## Conexiones

La desigualdad de Hoeffding es la [[cota-de-chernoff]] especializada a variables acotadas. La [[desigualdad-de-bernstein]] la mejora cuando la varianza es pequeña, y la [[desigualdad-de-mcdiarmid]] la extiende a funciones de variables independientes con diferencias acotadas. Combinada con la [[cota-de-la-union]] es la base de las garantías de aprendizaje estadístico, y da una prueba sencilla de la [[ley-fuerte-de-los-grandes-numeros]] para variables acotadas.

## Formulario

:::formula[Desigualdad de Hoeffding]
$$
P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{2 n^2 t^2}{\sum_{i=1}^{n} (b_i - a_i)^2}\right)
$$

- $X_1, \dots, X_n$: variables independientes con $a_i \le X_i \le b_i$; $n$: número de variables.
- $\bar{X}_n$: su promedio; $\mu = \mathbb{E}[\bar{X}_n]$: la media del promedio, con $\mathbb{E}$ la esperanza.
- $t > 0$: desviación sobre la media; $\exp(x) = e^x$.
:::

:::formula[Rango común]
$$
P\big(\bar{X}_n - \mu \ge t\big) \le \exp\!\left(-\frac{2nt^2}{(b - a)^2}\right), \qquad P\big(|\bar{X}_n - \mu| \ge t\big) \le 2\exp\!\left(-\frac{2nt^2}{(b - a)^2}\right)
$$

- $a$, $b$: extremos comunes del intervalo de todas las $X_i$.
- La segunda forma cubre las dos colas y lleva el factor 2.
:::

:::formula[Lema de Hoeffding]
$$
\mathbb{E}\big[e^{sX}\big] \le e^{s^2 (b - a)^2 / 8}
$$

- $X$: variable con $a \le X \le b$ y $\mathbb{E}[X] = 0$; $s$: número real, el parámetro del método de Chernoff.
:::

:::formula[Tamaño de muestra]
$$
n \ge \frac{(b - a)^2}{2\varepsilon^2} \log\frac{2}{\delta}
$$

- $\varepsilon > 0$: error tolerado; $\delta$: probabilidad máxima de que el error lo supere; $\log$: logaritmo natural.
- Garantiza $P(|\bar{X}_n - \mu| \ge \varepsilon) \le \delta$.
:::
