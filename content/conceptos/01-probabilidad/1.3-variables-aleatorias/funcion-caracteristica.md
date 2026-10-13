---
id: funcion-caracteristica
titulo: Función característica
titulo_en: Characteristic function
alias:
  - transformada de Fourier de la distribución
  - función característica de una variable aleatoria
modulo: 1
submodulo: '1.3'
orden: 22
nivel: intermedio
prerrequisitos:
  - funcion-generadora-de-momentos
relaciones:
  - tipo: generaliza
    id: funcion-generadora-de-momentos
etiquetas:
  - transformada de Fourier
  - números complejos
  - existencia universal
  - teorema de continuidad de Lévy
resumen: >
  La función característica es la esperanza de e elevado a itX. Existe para toda variable aleatoria, determina su distribución y convierte sumas independientes en productos; con ella se prueba el teorema central del límite.
formula: '\varphi_X(t) = \mathbb{E}\big[e^{itX}\big] = \mathbb{E}[\cos(tX)] + i\,\mathbb{E}[\sin(tX)]'
visualizacion:
  componente: MomentFunctionViz
  parametros:
    modo: caracteristica
    valores: [0, 1, 2]
    probabilidades: [0.25, 0.5, 0.25]
    nombre: el número de caras en dos lanzamientos
    t: 6.3
referencias:
  - clave: durrett
    capitulo: '3.3'
  - clave: blitzstein-hwang
    capitulo: '6.7'
publicado: true
---

## Intuición

La generadora de momentos $\mathbb{E}[e^{tX}]$ tiene un defecto: si la distribución tiene colas pesadas, $e^{tX}$ crece tan rápido que la esperanza es infinita. La **función característica** lo resuelve con un cambio mínimo: en lugar de $e^{tX}$ usa $e^{itX}$, donde $i$ es la unidad imaginaria. Por la fórmula de Euler, $e^{itx} = \cos(tx) + i\sin(tx)$ es un punto del círculo unitario del plano complejo, de tamaño 1 sin importar qué tan grande sea $x$. Promediar puntos de tamaño 1 siempre da algo finito.

Hay una imagen concreta. Cada valor $x$ de la variable es un corredor que da vueltas al círculo unitario con velocidad $x$: al tiempo $t$ está en el ángulo $tx$. La función característica en $t$ es el centro de masa de todos los corredores, pesados por sus probabilidades. Al principio todos están juntos en el punto 1; conforme pasa el tiempo se dispersan, y el centro de masa se acerca al origen.

## Definición

:::definicion[Función característica]
La **función característica** de una variable aleatoria $X$ es
$$
\varphi_X(t) = \mathbb{E}\big[e^{itX}\big] = \mathbb{E}[\cos(tX)] + i\,\mathbb{E}[\sin(tX)], \qquad t \in \mathbb{R}.
$$
Existe para toda variable aleatoria, porque $|e^{itX}| = 1$.
:::

Si $X$ tiene densidad $f$, $\varphi_X(t) = \int e^{itx} f(x)\,dx$ es la transformada de Fourier de $f$ (con la convención de signo de la probabilidad). Si la generadora de momentos existe, $\varphi_X(t) = M_X(it)$.

:::figura[La normal estándar tiene $\varphi(t) = e^{-t^2/2}$: por ser simétrica, la parte imaginaria es siempre 0 y el camino recorre el eje real de 1 hacia 0.]{componente="MomentFunctionViz"}
```yaml
modo: caracteristica
distribucion: normal
t: 4
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $t$: variable real.
- $i$: unidad imaginaria, $i^2 = -1$.
- $\varphi_X(t)$: función característica de $X$.
- $e^{itx} = \cos(tx) + i\sin(tx)$: punto del círculo unitario en el ángulo $tx$.
- $|\varphi_X(t)|$: módulo, distancia al origen.
- $\overline{\varphi_X(t)}$: conjugado complejo.
- $p$: probabilidad de la Bernoulli del ejemplo.
:::

## Cómo usar la visualización

A la izquierda está el plano complejo con el círculo unitario. Los puntos claros son los valores 0, 1 y 2 del número de caras en dos lanzamientos, de tamaño proporcional a su probabilidad; cada uno gira a la velocidad de su valor (el 0 no se mueve, el 2 gira el doble de rápido que el 1). El punto oscuro es su promedio ponderado, $\varphi(t)$, y su camino queda trazado.

A la derecha están la parte real y la imaginaria como funciones de $t$. El encabezado da $\varphi(t)$ y su módulo en cada instante. Al llegar a $t \approx 2\pi$ todos los corredores vuelven a juntarse en 1: con valores enteros, la función característica es periódica.

## Ejemplo

Para una Bernoulli con $P(X = 1) = p$:

1. $\varphi(t) = (1 - p)\,e^{0} + p\,e^{it} = 1 - p + p\cos t + i\,p \sin t$.
2. Como función de $t$, es un círculo de radio $p$ centrado en $1 - p$: el punto del valor 0 se queda quieto y el del valor 1 gira.
3. Con $p = 0.3$: $\varphi(\pi) = 0.7 - 0.3 = 0.4$, el punto más cercano al origen.
4. La binomial con $n$ ensayos es la suma de $n$ Bernoulli independientes, así que $\varphi(t) = (1 - p + pe^{it})^n$.

:::figura[La Bernoulli del ejemplo con $p = 0.3$: el camino de $\varphi(t)$ es un círculo de radio 0.3 que pasa por 1 y por 0.4.]{componente="MomentFunctionViz"}
```yaml
modo: caracteristica
valores: [0, 1]
probabilidades: [0.7, 0.3]
nombre: una variable de Bernoulli con p = 0.3
t: 6.3
```
:::

## Propiedades

- **Acotada:** $\varphi(0) = 1$ y $|\varphi(t)| \le 1$ para todo $t$; además es uniformemente continua.
- **Simetría:** $\varphi(-t) = \overline{\varphi(t)}$, y $\varphi$ es real exactamente cuando la distribución es simétrica alrededor de 0.
- **Sumas independientes:** $\varphi_{X+Y}(t) = \varphi_X(t)\,\varphi_Y(t)$; y $\varphi_{aX+b}(t) = e^{ibt}\varphi_X(at)$.
- **Unicidad e inversión:** la función característica determina la distribución, y existen fórmulas para recuperar la densidad o la función de distribución a partir de ella.
- **Momentos:** si $\mathbb{E}|X|^k < \infty$, entonces $\varphi^{(k)}(0) = i^k\,\mathbb{E}[X^k]$.
- **Continuidad de Lévy:** $X_n$ converge en distribución a $X$ si y solo si $\varphi_{X_n}(t) \to \varphi_X(t)$ para todo $t$.

:::figura[La exponencial de media 1 tiene $\varphi(t) = 1/(1 - it)$: como la distribución no es simétrica, el camino sale del eje real y recorre medio círculo, de centro 1/2 y radio 1/2, desde 1 hacia el origen.]{componente="MomentFunctionViz"}
```yaml
modo: caracteristica
distribucion: exponencial
parametros:
  lambda: 1
t: 10
```
:::

## Errores comunes

- **Pensar que la característica requiere momentos.** Existe siempre; los momentos solo aparecen si además existen derivadas en 0.
- **Olvidar la unidad imaginaria.** $\mathbb{E}[e^{itX}]$ es en general un número complejo; tratarla como real solo es correcto para distribuciones simétricas.
- **Esperar que $\varphi(t) \to 0$ siempre.** Para variables con valores enteros es periódica y vuelve a 1 cada $2\pi$.

:::figura[La Cauchy no tiene media, pero sí función característica: $\varphi(t) = e^{-|t|}$, real por la simetría y con un pico en 0 sin derivada, que refleja la falta de media.]{componente="MomentFunctionViz"}
```yaml
modo: caracteristica
distribucion: cauchy
t: 5
```
:::

## Conexiones

La función característica generaliza la [[funcion-generadora-de-momentos]]: coincide con ella evaluada en $it$ cuando esta existe, y existe siempre. Sus derivadas en 0 dan los [[momentos]]. Es la herramienta principal de la [[convergencia-en-distribucion]] a través del teorema de continuidad de Lévy, y con ella se prueban el [[tcl-de-lindeberg-levy]] y el [[teorema-central-del-limite]] en general.

## Formulario

:::formula[Definición]
$$
\varphi_X(t) = \mathbb{E}\big[e^{itX}\big] = \mathbb{E}[\cos(tX)] + i\,\mathbb{E}[\sin(tX)]
$$

- Existe para toda variable aleatoria.
:::

:::formula[Propiedades básicas]
$$
\varphi_X(0) = 1, \qquad |\varphi_X(t)| \le 1, \qquad \varphi_X(-t) = \overline{\varphi_X(t)}
$$

- Real si y solo si la distribución es simétrica.
:::

:::formula[Suma de independientes y transformación afín]
$$
\varphi_{X+Y}(t) = \varphi_X(t)\,\varphi_Y(t), \qquad \varphi_{aX+b}(t) = e^{ibt}\varphi_X(at)
$$

- La primera requiere independencia.
:::

:::formula[Momentos]
$$
\varphi_X^{(k)}(0) = i^k\,\mathbb{E}[X^k]
$$

- Si el momento de orden $k$ es finito.
:::

:::formula[Ejemplos]
$$
\text{Normal: } e^{i\mu t - \sigma^2 t^2/2}, \qquad \text{Cauchy estándar: } e^{-|t|}, \qquad \text{Poisson: } e^{\lambda(e^{it} - 1)}
$$

- La Cauchy no tiene generadora de momentos.
:::
