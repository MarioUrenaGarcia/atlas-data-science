---
id: cumulantes-y-funcion-generadora-de-cumulantes
titulo: Cumulantes y función generadora de cumulantes
titulo_en: Cumulants and cumulant generating function
alias:
  - cumulantes
  - función generadora de cumulantes
  - semiinvariantes
  - logaritmo de la generadora de momentos
modulo: 1
submodulo: '1.3'
orden: 24
nivel: avanzado
prerrequisitos:
  - funcion-generadora-de-momentos
  - momentos-centrales
relaciones:
  - tipo: relacionado
    id: asimetria
  - tipo: relacionado
    id: curtosis
etiquetas:
  - cumulantes
  - aditividad
  - logaritmo
  - expansión de Edgeworth
resumen: >
  La generadora de cumulantes es el logaritmo de la generadora de momentos; sus coeficientes son los cumulantes. El primero es la media, el segundo la varianza, y todos se suman al sumar variables independientes.
formula: 'K_X(t) = \log M_X(t) = \sum_{n=1}^{\infty} \kappa_n \frac{t^n}{n!}, \qquad \kappa_1 = \mu, \quad \kappa_2 = \sigma^2, \quad \kappa_3 = \mu_3'
visualizacion:
  componente: MomentFunctionViz
  parametros:
    modo: cumulantes
    distribucion: poisson
    parametros:
      lambda: 3
    t: 0.8
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.5'
  - clave: durrett
    capitulo: '3.4'
publicado: true
---

## Intuición

La generadora de momentos convierte sumas independientes en productos: $M_{X+Y} = M_X M_Y$. Al tomar logaritmo, los productos se vuelven sumas: $\log M_{X+Y} = \log M_X + \log M_Y$. Los coeficientes de la serie de $\log M$, los **cumulantes**, heredan esa propiedad: el cumulante de orden $n$ de una suma de independientes es la suma de los cumulantes de orden $n$.

Los momentos no tienen esa propiedad, salvo el primero. Por eso los cumulantes son la forma natural de describir cómo cambia la forma al sumar: si cada sumando tiene varianza $\kappa_2$ y tercer cumulante $\kappa_3$, la suma de $n$ tiene $n\kappa_2$ y $n\kappa_3$, y su asimetría, $n\kappa_3 / (n\kappa_2)^{3/2}$, decrece como $1/\sqrt{n}$. La convergencia a la normal se ve así de forma transparente: la normal es la única distribución con todos los cumulantes de orden mayor que 2 iguales a cero.

## Definición

:::definicion[Cumulantes]
Sea $X$ una variable aleatoria cuya generadora de momentos $M_X$ existe cerca de 0. Su **función generadora de cumulantes** es
$$
K_X(t) = \log M_X(t),
$$
y los **cumulantes** $\kappa_n$ son los coeficientes de su serie de Taylor en 0:
$$
K_X(t) = \sum_{n=1}^{\infty} \kappa_n \frac{t^n}{n!}, \qquad \kappa_n = K_X^{(n)}(0).
$$
:::

Los primeros cumulantes, en términos de la media $\mu$ y los momentos centrales $\mu_k$, son
$$
\kappa_1 = \mu, \qquad \kappa_2 = \mu_2 = \sigma^2, \qquad \kappa_3 = \mu_3, \qquad \kappa_4 = \mu_4 - 3\mu_2^2.
$$

:::figura[La normal con media 1 y desviación estándar 1.5 tiene $K(t) = t + 1.125\,t^2$, una parábola exacta: solo los dos primeros cumulantes son distintos de cero.]{componente="MomentFunctionViz"}
```yaml
modo: cumulantes
distribucion: normal
parametros:
  mu: 1
  sigma: 1.5
t: 1
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $M_X(t)$: función generadora de momentos.
- $K_X(t)$: función generadora de cumulantes.
- $\kappa_n$: cumulante de orden $n$.
- $\mu$, $\sigma^2$: media y varianza.
- $\mu_k$: momento central de orden $k$.
- $\gamma_1$, $\gamma_2$: asimetría y exceso de curtosis.
- $\lambda$: tasa de la exponencial o media de la Poisson.
:::

## Cómo usar la visualización

La curva es $K(t) = \log M(t)$ para una Poisson con media 3, cuya generadora de cumulantes es $3(e^{t} - 1)$. La animación agrega términos de Taylor: la recta de orden 1 tiene pendiente $\kappa_1 = 3$, la parábola de orden 2 agrega $\kappa_2 = 3$, y así hasta el orden 4. El panel lista los cuatro cumulantes: en la Poisson todos valen $\lambda = 3$, una propiedad que la caracteriza.

El encabezado escribe el polinomio con los cumulantes actuales. Cerca de $t = 0$ todos los polinomios se pegan a la curva; lejos de 0 solo los de orden alto la siguen, porque la curvatura de $K$ depende de los cumulantes superiores.

## Ejemplo

La exponencial con tasa $\lambda$ tiene $M(t) = \lambda / (\lambda - t)$ para $t < \lambda$.

1. $K(t) = -\log(1 - t/\lambda) = \sum_{n \ge 1} \dfrac{(t/\lambda)^n}{n}$.
2. Comparando con $\sum \kappa_n t^n / n!$: $\kappa_n = (n - 1)!/\lambda^n$.
3. Con $\lambda = 1$: $\kappa_1 = 1$, $\kappa_2 = 1$, $\kappa_3 = 2$, $\kappa_4 = 6$.
4. Asimetría $\gamma_1 = \kappa_3 / \kappa_2^{3/2} = 2$ y exceso de curtosis $\gamma_2 = \kappa_4 / \kappa_2^2 = 6$.

:::figura[La exponencial del ejemplo: los cumulantes 1, 1, 2 y 6 son los coeficientes de los polinomios de Taylor de $K(t) = -\log(1 - t)$.]{componente="MomentFunctionViz"}
```yaml
modo: cumulantes
distribucion: exponencial
parametros:
  lambda: 1
t: 0.6
```
:::

## Propiedades

- **Aditividad:** si $X$ y $Y$ son independientes, $\kappa_n(X + Y) = \kappa_n(X) + \kappa_n(Y)$ para todo $n$.
- **Traslación y escala:** $\kappa_1(aX + b) = a\kappa_1(X) + b$ y $\kappa_n(aX + b) = a^n \kappa_n(X)$ para $n \ge 2$.
- **Forma estandarizada:** $\gamma_1 = \kappa_3 / \kappa_2^{3/2}$ y $\gamma_2 = \kappa_4 / \kappa_2^2$; para la suma de $n$ independientes idénticas valen $\gamma_1/\sqrt{n}$ y $\gamma_2/n$.
- **Normal:** es la única distribución con $\kappa_n = 0$ para todo $n \ge 3$.
- **Familias:** en la Poisson todos los cumulantes valen $\lambda$; en la gamma con forma $\alpha$ y tasa $\beta$, $\kappa_n = \alpha (n-1)!/\beta^n$.

:::figura[La gamma con forma 3 es la suma de tres exponenciales independientes con media 1, y sus cumulantes son el triple de los de una exponencial: 3, 3, 6 y 18.]{componente="MomentFunctionViz"}
```yaml
modo: cumulantes
distribucion: gamma
parametros:
  alpha: 3
  beta: 1
t: 0.6
```
:::

## Errores comunes

- **Identificar cumulantes con momentos centrales.** Coinciden hasta el orden 3; el cuarto cumulante es $\mu_4 - 3\sigma^4$, que puede ser negativo.
- **Esperar aditividad de los momentos.** Solo la media y la varianza (bajo independencia) se suman; $\mathbb{E}[(X+Y)^3]$ tiene términos cruzados.
- **Usar la generadora de cumulantes donde $M$ no existe.** Para distribuciones sin generadora de momentos se usa el logaritmo de la función característica.

:::figura[Una moneda equilibrada con valores 0 y 1: el cuarto momento central es $1/16$, pero el cuarto cumulante es $1/16 - 3/16 = -1/8$, negativo.]{componente="MomentFunctionViz"}
```yaml
modo: cumulantes
valores: [0, 1]
probabilidades: [0.5, 0.5]
nombre: una moneda equilibrada
t: 1.5
```
:::

## Conexiones

La generadora de cumulantes es el logaritmo de la [[funcion-generadora-de-momentos]], y sus primeros coeficientes reproducen los [[momentos-centrales]]: la [[varianza]], el numerador de la [[asimetria]] y la parte de la [[curtosis]] que excede a la normal. Su aditividad explica la velocidad de convergencia en el [[teorema-central-del-limite]] y está detrás del [[teorema-de-berry-esseen]]. En la [[teoria-de-grandes-desviaciones]], la función de tasa es la transformada de Legendre de la generadora de cumulantes.

## Formulario

:::formula[Definición]
$$
K_X(t) = \log M_X(t) = \sum_{n \ge 1} \kappa_n \frac{t^n}{n!}
$$

- $\kappa_n = K_X^{(n)}(0)$.
:::

:::formula[Primeros cumulantes]
$$
\kappa_1 = \mu, \quad \kappa_2 = \sigma^2, \quad \kappa_3 = \mu_3, \quad \kappa_4 = \mu_4 - 3\sigma^4
$$

- $\mu_k$: momentos centrales.
:::

:::formula[Aditividad]
$$
\kappa_n(X + Y) = \kappa_n(X) + \kappa_n(Y)
$$

- Para $X$ y $Y$ independientes.
:::

:::formula[Asimetría y curtosis]
$$
\gamma_1 = \frac{\kappa_3}{\kappa_2^{3/2}}, \qquad \gamma_2 = \frac{\kappa_4}{\kappa_2^{2}}
$$

- $\gamma_2$ es el exceso de curtosis.
:::
