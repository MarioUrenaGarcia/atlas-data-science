---
id: cota-de-chernoff
titulo: Cota de Chernoff
titulo_en: Chernoff bound
alias:
  - método de Chernoff
  - cota exponencial
  - cota por la función generadora de momentos
modulo: 1
submodulo: '1.5'
orden: 8
nivel: avanzado
prerrequisitos:
  - desigualdad-de-markov
  - funcion-generadora-de-momentos
relaciones:
  - tipo: relacionado
    id: teoria-de-grandes-desviaciones
  - tipo: relacionado
    id: desigualdad-de-hoeffding
etiquetas:
  - cota exponencial
  - función generadora de momentos
  - entropía relativa
  - sumas de independientes
resumen: >
  La cota de Chernoff aplica Markov a e elevado a tX y optimiza t. Para sumas de variables
  independientes da una probabilidad de cola que decae exponencialmente con el número de sumandos,
  mucho más rápido que la cota de Chebyshev.
formula: 'P(X \ge a) \le \inf_{t > 0} e^{-ta}\, M_X(t), \qquad P\big(\bar{X}_n \ge p + t\big) \le e^{-n\, D(p + t \,\|\, p)}'
visualizacion:
  componente: InequalityBound
  parametros:
    modo: concentracion
    p: 0.3
    umbral: 0.1
    n: 300
    cotas: [chernoff, hoeffding, chebyshev]
referencias:
  - clave: ross-probabilidad
    capitulo: '8.5'
  - clave: cover-thomas
    capitulo: '11'
publicado: true
---

## Intuición

La desigualdad de Markov da cotas débiles porque solo usa la media. Pero se puede aplicar a cualquier función creciente de la variable: con $(X - \mu)^2$ sale Chebyshev, y con $e^{tX}$ sale algo mucho más fuerte. La exponencial amplifica enormemente los valores grandes, de modo que su media "ve" la cola con mucho detalle. Además hay un parámetro $t$ libre: se elige el que da la mejor cota.

Para sumas de variables independientes el resultado es espectacular. La función generadora de la suma es el producto de las de cada sumando, así que la cota decae exponencialmente con el número de sumandos. Cien lanzamientos de una moneda equilibrada producen 60 caras o más con probabilidad de 2.8 %; Chebyshev solo garantiza que es menor que 25 %, mientras que Chernoff da 13 % y, con 400 lanzamientos y la misma proporción, 0.03 %.

## Definición

:::teorema[Cota de Chernoff]
Para toda variable $X$ y todo $a$,
$$
P(X \ge a) \le \inf_{t > 0}\, e^{-ta}\, M_X(t),
$$
donde $M_X(t) = \mathbb{E}[e^{tX}]$. Si $\bar{X}_n$ es el promedio de $n$ variables de Bernoulli independientes con probabilidad $p$, y $0 < t < 1 - p$,
$$
P(\bar{X}_n \ge p + t) \le e^{-n\, D(p + t \,\|\, p)}, \qquad D(a \,\|\, p) = a \log\frac{a}{p} + (1 - a)\log\frac{1 - a}{1 - p}.
$$
:::

La primera cota es Markov aplicada a $e^{tX} \ge e^{ta}$. En el caso de Bernoulli, el ínfimo se calcula explícitamente y el exponente resulta ser la entropía relativa entre dos distribuciones de Bernoulli.

:::figura[Eventos raros: con $p = 0.05$ y una desviación de 0.05, la cota de Chernoff sigue de cerca a la probabilidad exacta, mientras que la de Hoeffding, que solo usa que las variables están entre 0 y 1, decae mucho más despacio.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.05
umbral: 0.05
n: 500
cotas: [chernoff, hoeffding]
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria; $a$: umbral.
- $t$: parámetro libre de la cota; $M_X(t)$: función generadora de momentos.
- $\bar{X}_n$: promedio de $n$ ensayos de Bernoulli con probabilidad $p$.
- $t$ (en la versión de Bernoulli): desviación del promedio sobre $p$.
- $D(a \,\|\, p)$: entropía relativa entre Bernoulli($a$) y Bernoulli($p$).
- $S$: número de caras del ejemplo.
:::

## Cómo usar la visualización

El eje vertical está en escala logarítmica: una caída exponencial se ve como una recta. Para el promedio de $n$ ensayos con $p = 0.3$, la curva negra es la probabilidad exacta de superar $0.4$; las otras son las cotas de Chernoff, Hoeffding y Chebyshev. La de Chebyshev baja como $1/n$ y se queda muy arriba; las exponenciales bajan con la pendiente de la exacta. El encabezado da los valores en el $n$ actual.

Las deslizaderas cambian $p$, la desviación $t$ y $n$; el botón de reproducción aumenta $n$ desde 1.

## Ejemplo

Se lanzan 100 monedas equilibradas y $S$ es el número de caras. ¿Qué tan probable es obtener 60 o más?

1. Exacto (binomial): $P(S \ge 60) \approx 0.028$.
2. Chebyshev: $P(|S - 50| \ge 10) \le 25/100 = 0.25$.
3. Chernoff: $D(0.6 \,\|\, 0.5) = 0.6\log 1.2 + 0.4 \log 0.8 \approx 0.0201$, así que $P(S \ge 60) \le e^{-100 \cdot 0.0201} \approx 0.134$.
4. Con 400 monedas y 60 % de caras, Chernoff da $e^{-8.05} \approx 0.0003$, mientras que Chebyshev solo baja a 0.0625.

:::figura[El ejemplo de las monedas: con $p = 0.5$ y desviación 0.1, en $n = 100$ la probabilidad exacta es 0.028, la cota de Chernoff 0.134 y la de Chebyshev 0.25.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.5
umbral: 0.1
n: 100
cotas: [chernoff, chebyshev]
```
:::

## Propiedades

- **Exponente óptimo:** para promedios de Bernoulli, el exponente $D(p + t \,\|\, p)$ es exactamente la tasa a la que decae la probabilidad exacta (teorema de Cramér); la cota solo pierde un factor polinomial.
- **Compara con Hoeffding:** como $D(p + t \,\|\, p) \ge 2t^2$, Chernoff siempre es al menos tan buena como Hoeffding, y mucho mejor cuando $p$ está cerca de 0 o de 1.
- **Sumas de independientes:** $M_{X_1 + \dots + X_n}(t) = \prod_i M_{X_i}(t)$, lo que hace manejable el ínfimo.
- **Cola izquierda:** aplicando la cota a $-X$ se obtiene $P(\bar{X}_n \le p - t) \le e^{-n D(p - t \,\|\, p)}$.

:::figura[Chernoff, Hoeffding y Bernstein para un evento raro, $p = 0.05$: las tres son exponenciales, pero Chernoff y Bernstein aprovechan que la varianza es pequeña.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.05
umbral: 0.05
n: 500
cotas: [bernstein, chernoff, hoeffding]
```
:::

## Errores comunes

- **Aplicarla sin función generadora.** Si $M_X(t)$ es infinita para todo $t > 0$, como en distribuciones de colas pesadas, el método no da nada.
- **Olvidar optimizar $t$.** Un $t$ arbitrario da una cota válida pero puede ser mucho peor que la óptima.
- **Esperar cotas útiles para desviaciones pequeñas y $n$ pequeño.** Con $t = 0.02$ y 100 ensayos, todas las cotas están cerca de 1.

:::figura[Desviación muy pequeña: con $t = 0.02$ las cotas apenas bajan de 1 en los primeros cientos de ensayos; la caída exponencial necesita que $n t^2$ sea grande.]{componente="InequalityBound"}
```yaml
modo: concentracion
p: 0.5
umbral: 0.02
n: 400
cotas: [chernoff, hoeffding, chebyshev]
```
:::

## Conexiones

La cota de Chernoff aplica la [[desigualdad-de-markov]] a la exponencial y usa la [[funcion-generadora-de-momentos]], o de manera equivalente la [[cumulantes-y-funcion-generadora-de-cumulantes|generadora de cumulantes]]. Para variables acotadas se simplifica en la [[desigualdad-de-hoeffding]] y, usando la varianza, en la [[desigualdad-de-bernstein]]. Su exponente es el de la [[teoria-de-grandes-desviaciones]], y supera con mucho a la [[desigualdad-de-chebyshev]] para sumas de independientes.

## Formulario

:::formula[Cota de Chernoff general]
$$
P(X \ge a) \le \inf_{t > 0} e^{-ta}\, M_X(t)
$$

- $M_X$: función generadora de momentos.
:::

:::formula[Promedio de Bernoulli]
$$
P(\bar{X}_n \ge p + t) \le e^{-n\, D(p + t \,\|\, p)}
$$

- $n$ ensayos independientes con probabilidad $p$.
:::

:::formula[Entropía relativa de Bernoulli]
$$
D(a \,\|\, p) = a \log\frac{a}{p} + (1 - a) \log\frac{1 - a}{1 - p}
$$

- Siempre $D(a \,\|\, p) \ge 2(a - p)^2$.
:::
