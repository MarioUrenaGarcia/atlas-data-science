---
id: tcl-de-lindeberg-levy
titulo: TCL de Lindeberg-Lévy
titulo_en: Lindeberg-Lévy central limit theorem
alias:
  - teorema central del límite clásico
  - TCL para variables independientes e idénticamente distribuidas
modulo: 3
submodulo: '3.1'
orden: 9
nivel: intermedio
prerrequisitos:
  - teorema-central-del-limite
etiquetas:
  - teorema central del límite
  - función característica
  - convolución
  - distribución normal
resumen: >
  Versión clásica del teorema central del límite: para variables independientes e idénticamente
  distribuidas con varianza finita, √n(X̄ₙ - μ)/σ converge en distribución a la normal estándar.
formula: '\varphi_{Z_n}(t) = \Big[\varphi_{Y}\Big(\frac{t}{\sqrt{n}}\Big)\Big]^n = \Big(1 - \frac{t^2}{2n} + o\Big(\frac{1}{n}\Big)\Big)^n \longrightarrow e^{-t^2/2}'
visualizacion:
  componente: CentralLimit
  parametros:
    modo: convolucion
    poblacion: uniforme
    poblaciones:
      - uniforme
      - arcoseno
      - exponencial
      - lognormal
      - bimodal
      - dado
    nMaximo: 40
referencias:
  - clave: durrett
  - clave: casella-berger
    capitulo: '5.5'
publicado: true
---

## Intuición

Las primeras computadoras generaban números aleatorios uniformes entre 0 y 1, pero muchos cálculos necesitaban números con distribución normal. Un truco muy usado era sumar 12 uniformes y restar 6. La suma de dos uniformes tiene forma de triángulo; la de tres, una campana hecha de parábolas; la de doce ya es casi indistinguible de la normal estándar. Cada nueva suma suaviza la forma anterior, porque la densidad de una suma es la convolución de las densidades: un promedio móvil que redondea las esquinas.

El teorema de Lindeberg-Lévy es la versión precisa de ese fenómeno para sumandos independientes con la misma distribución. Su demostración clásica usa funciones características: la de una suma es el producto de las de los sumandos, y al reescalar por $\sqrt{n}$ ese producto de $n$ factores casi iguales a 1 converge a $e^{-t^2/2}$, que es la función característica de la normal estándar. Solo intervienen la media y la varianza, porque los términos de orden mayor se desvanecen en el límite.

## Definición

:::teorema[Lindeberg-Lévy]
Sean $X_1, X_2, \dots$ independientes e idénticamente distribuidas con $\mathbb{E}[X_i] = \mu$ y $\operatorname{Var}(X_i) = \sigma^2 \in (0, \infty)$. Entonces
$$
Z_n = \frac{\sqrt{n}\,(\bar{X}_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1).
$$
:::

No se piden momentos de orden mayor que 2 ni ninguna forma especial de la distribución. Si $Y_i = (X_i - \mu)/\sigma$ tiene función característica $\varphi_Y$, entonces $Z_n = \frac{1}{\sqrt{n}}\sum Y_i$ tiene función característica $\varphi_{Z_n}(t) = \varphi_Y(t/\sqrt{n})^n$, y el teorema equivale a $\varphi_{Z_n}(t) \to e^{-t^2/2}$ para todo $t$.

:::nota[Qué significa cada símbolo]
- $X_i$: variables independientes con la misma distribución.
- $\mu$, $\sigma^2$: media y varianza comunes; $\sigma \in (0, \infty)$.
- $\bar{X}_n$: media muestral.
- $Z_n$: media estandarizada.
- $Y_i = (X_i - \mu)/\sigma$: variable estandarizada, con media 0 y varianza 1.
- $\varphi_Y(t) = \mathbb{E}[e^{itY}]$: función característica; $t$ real, $i$ la unidad imaginaria.
- $o(1/n)$: término que, dividido entre $1/n$, tiende a cero.
- $e^{-t^2/2}$: función característica de la normal estándar.
:::

## Cómo usar la visualización

La visualización calcula la distribución exacta de $Z_n$ convolucionando la población consigo misma $n$ veces, sin simular. La reproducción aumenta $n$ de uno en uno y el histograma exacto se compara con la curva normal; abajo se grafica la distancia máxima entre ambas distribuciones según $n$. El panel reporta la asimetría de la población y la de $Z_n$.

Con la uniforme la distancia es 0.057 en $n = 1$ y menor que 0.003 desde $n = 10$. La Beta(1/2, 1/2), con su masa en los extremos, empieza en forma de U y en $n = 3$ ya tiene un solo pico. La lognormal, muy asimétrica, conserva un sesgo visible incluso con $n = 40$: la asimetría de $Z_n$ es la de la población dividida entre $\sqrt{n}$.

## Ejemplo

Un generador antiguo producía normales con $Z = U_1 + \cdots + U_{12} - 6$, con $U_i$ uniformes independientes en $[0, 1]$.

1. Cada $U_i$ tiene media $1/2$ y varianza $1/12$, así que la suma tiene media 6 y varianza $12 \cdot \frac{1}{12} = 1$: $Z$ ya está estandarizada.
2. Por Lindeberg-Lévy, $Z$ es aproximadamente $\mathcal{N}(0, 1)$.
3. La distribución exacta de la suma es la de Irwin-Hall: $P(Z \le 1) = 0.8393$, frente a $\Phi(1) = 0.8413$.
4. En $z = 2$: $0.9777$ exacta contra $\Phi(2) = 0.9772$.
5. En las colas la aproximación es peor: $P(Z > 3) = 0.0010$ contra $0.0013$ de la normal, y $Z$ nunca supera 6, mientras que la normal no tiene cota.

:::figura[El ejemplo del generador: la distribución exacta de la suma estandarizada de uniformes. Con n = 12 el histograma exacto y la normal casi coinciden.]{componente="CentralLimit"}
```yaml
modo: convolucion
poblacion: uniforme
nMaximo: 12
```
:::

## Propiedades

- **Mínimas condiciones:** basta varianza finita y positiva; no se necesita tercer momento.
- **Producto de funciones características:** $\varphi_{S_n} = \varphi_X^n$ para sumas de variables independientes con la misma distribución.
- **Desarrollo de Taylor:** si $\mathbb{E}[Y] = 0$ y $\mathbb{E}[Y^2] = 1$, entonces $\varphi_Y(s) = 1 - s^2/2 + o(s^2)$ cuando $s \to 0$.
- **Corrección de Edgeworth:** el primer término de error es $-\frac{\gamma}{6\sqrt{n}}(z^2 - 1)\phi(z)$, proporcional a la asimetría $\gamma$, lo que explica por qué las poblaciones simétricas convergen más rápido.
- **Densidades:** si la población tiene densidad acotada, la densidad de $Z_n$ converge uniformemente a la normal (teorema local).

:::figura[Propiedad: las poblaciones simétricas convergen rápido. La Beta(1/2, 1/2), con forma de U, se vuelve una campana en pocas convoluciones.]{componente="CentralLimit"}
```yaml
modo: convolucion
poblacion: arcoseno
nMaximo: 20
```
:::

:::figura[Propiedad: la asimetría frena la convergencia. La lognormal conserva un sesgo visible durante decenas de sumandos.]{componente="CentralLimit"}
```yaml
modo: convolucion
poblacion: lognormal
nMaximo: 40
```
:::

:::demostracion
Sea $Y = (X - \mu)/\sigma$. Por Taylor, $\varphi_Y(s) = 1 - \frac{s^2}{2} + o(s^2)$. Entonces $\varphi_{Z_n}(t) = \varphi_Y(t/\sqrt{n})^n = \big(1 - \frac{t^2}{2n} + o(1/n)\big)^n$. Como $(1 + a_n/n)^n \to e^{a}$ cuando $a_n \to a$, el límite es $e^{-t^2/2}$. Por el teorema de continuidad de Lévy, $Z_n \xrightarrow{d} \mathcal{N}(0, 1)$.
:::

## Errores comunes

- **Pensar que se necesita simetría o unimodalidad.** Cualquier población con varianza finita sirve; la forma solo afecta la velocidad.
- **Confundir convergencia de distribuciones con convergencia de densidades.** Para poblaciones discretas $Z_n$ no tiene densidad, aunque su distribución converja.
- **Aplicarlo a sumandos con distribuciones distintas sin verificar condiciones.** Para eso están los teoremas de Lyapunov y de Lindeberg-Feller.
- **Usar la aproximación en colas extremas.** El error relativo en probabilidades muy pequeñas puede ser grande aunque la distancia máxima entre distribuciones sea mínima.

:::figura[Error común: confundir distribución con densidad. La suma estandarizada de dados es discreta para todo n; lo que converge es su distribución, cuyos escalones se acercan a la normal.]{componente="CentralLimit"}
```yaml
modo: convolucion
poblacion: dado
nMaximo: 30
```
:::

## Conexiones

Es la versión estándar del [[teorema-central-del-limite]]. El [[tcl-de-lyapunov]] y el [[tcl-de-lindeberg-feller]] la generalizan a sumandos con distribuciones distintas, el [[tcl-multivariado]] a vectores, y el [[teorema-de-berry-esseen]] acota su error. Se demuestra con [[convergencia-en-distribucion]] vía funciones características, y el paso clave usa el límite $(1 + a/n)^n \to e^{a}$ de la [[funcion-exponencial-y-logaritmo-natural|función exponencial]] y el desarrollo de [[serie-de-taylor-y-de-maclaurin|Taylor]].

## Formulario

:::formula[Teorema de Lindeberg-Lévy]
$$
\frac{\sqrt{n}\,(\bar{X}_n - \mu)}{\sigma} \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $\bar{X}_n$: media de $n$ observaciones independientes con la misma distribución.
- $\mu$, $\sigma$: media y desviación estándar, con $\sigma$ finita y positiva.
:::

:::formula[Función característica de la suma estandarizada]
$$
\varphi_{Z_n}(t) = \Big[\varphi_Y\Big(\frac{t}{\sqrt{n}}\Big)\Big]^n \to e^{-t^2/2}
$$

- $\varphi_Y$: función característica de $Y = (X - \mu)/\sigma$.
- $t$: argumento real.
:::

:::formula[Desarrollo de Taylor]
$$
\varphi_Y(s) = 1 - \frac{s^2}{2} + o(s^2)
$$

- $s$: argumento cercano a 0.
- Usa $\mathbb{E}[Y] = 0$ y $\mathbb{E}[Y^2] = 1$.
:::

:::formula[Generador con doce uniformes]
$$
Z = \sum_{i=1}^{12} U_i - 6 \approx \mathcal{N}(0, 1)
$$

- $U_i$: uniformes independientes en $[0, 1]$, con media $1/2$ y varianza $1/12$.
:::

:::formula[Corrección de Edgeworth]
$$
P(Z_n \le z) \approx \Phi(z) - \frac{\gamma}{6\sqrt{n}}(z^2 - 1)\,\phi(z)
$$

- $\gamma$: asimetría de la población.
- $\Phi$, $\phi$: distribución y densidad normales estándar.
:::
