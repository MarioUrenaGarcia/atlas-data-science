---
id: teorema-de-convergencia-dominada
titulo: Teorema de convergencia dominada
titulo_en: Dominated convergence theorem
alias:
  - TCD
  - teorema de Lebesgue de convergencia dominada
  - convergencia dominada
modulo: 0
submodulo: '0.9'
orden: 9
nivel: avanzado
prerrequisitos:
  - teorema-de-convergencia-monotona
relaciones:
  - tipo: relacionado
    id: lema-de-fatou
etiquetas:
  - teoremas de límite
  - integración
  - cota integrable
  - teoría de la medida
resumen: >
  Si f_n converge c.t.p. a f y todas las |f_n| están bajo una misma función integrable g, entonces la integral
  de f_n converge a la de f. La cota común impide que la masa se escape o se concentre.
formula: 'f_n \to f \text{ c.t.p.},\ |f_n| \le g,\ \int g\,d\mu < \infty \;\Longrightarrow\; \int f_n\,d\mu \to \int f\,d\mu'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: sucesion
    caso: potencias
referencias:
  - clave: durrett
  - clave: wasserman
publicado: true
---

## Intuición

Cuando una sucesión de funciones converge punto por punto, sus integrales pueden no converger a la integral del límite. Lo que falla es que la masa se escape: puede concentrarse en una franja cada vez más angosta y alta, o huir hacia el infinito. En el límite, cada punto ve la función tender a cero, pero la masa nunca desaparece de las integrales.

El teorema de convergencia dominada pone una barrera. Si todas las funciones de la sucesión están por debajo de una misma función integrable, el techo $g$, la masa no puede concentrarse sin pasar por encima del techo ni huir sin que el techo la acompañe con integral finita. Con esa barrera, límite e integral se intercambian.

Es el teorema más usado para derivar bajo el signo integral, calcular límites de esperanzas y justificar aproximaciones en estadística, siempre que se encuentre una cota integrable común.

## Definición

:::teorema[Teorema de convergencia dominada]
Sea $(\Omega, \mathcal{F}, \mu)$ un espacio de medida y sean $f_n$ funciones medibles con $f_n \to f$ c.t.p. Si existe $g$ integrable, $\int g\,d\mu < \infty$, con $|f_n| \le g$ c.t.p. para todo $n$, entonces $f$, redefinida si hace falta en un conjunto nulo, es integrable y
$$
\lim_{n \to \infty} \int f_n\,d\mu = \int f\,d\mu, \qquad \text{más aún,} \quad \int |f_n - f|\,d\mu \to 0.
$$
:::

Caso particular, la convergencia acotada: si $\mu(\Omega) < \infty$ y $|f_n| \le M$, basta tomar $g = M$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $f_n$: sucesión de funciones medibles; $f$: su límite c.t.p.
- $g$: función dominante, integrable y mayor que todas las $|f_n|$.
- $\int |f_n - f|\,d\mu$: distancia entre $f_n$ y $f$ en $L^1$.
- $M$: cota constante; $\mu(\Omega)$: medida total.
:::

:::demostracion
Las funciones $g + f_n$ y $g - f_n$ son no negativas. El lema de Fatou aplicado a ellas da $\int (g + f) \le \liminf \int (g + f_n)$ y $\int (g - f) \le \liminf \int (g - f_n)$. Como $\int g < \infty$, se puede restar: $\int f \le \liminf \int f_n$ y $\int f \ge \limsup \int f_n$, así que $\int f_n \to \int f$.
:::

## Cómo usar la visualización

A la izquierda está $f_n(x) = x^n$ con los tres términos anteriores, el límite puntual punteado, que vale 0 salvo en $x = 1$, y la cota $g = 1$. A la derecha, las integrales $1/(n + 1)$. La reproducción avanza hasta $n = 16$.

Las curvas se hunden hacia el eje salvo cerca de $x = 1$, siempre bajo la cota. Las integrales valen 0.5, 0.333, 0.25, ... y con $n = 16$ ya son 0.0588: tienden a 0, la integral del límite, como predice el teorema.

## Ejemplo

Se calcula $\lim_n \int_0^1 \min\{n, x^{-1/2}\}\,dx$ sin hacer la integral de cada término.

1. Límite puntual: $\min\{n, x^{-1/2}\} \to x^{-1/2}$ para todo $x \in (0, 1]$.
2. Cota: $0 \le \min\{n, x^{-1/2}\} \le x^{-1/2} = g(x)$ y $\int_0^1 g = 2 < \infty$.
3. Por el teorema, el límite de las integrales es $\int_0^1 x^{-1/2}\,dx = 2$.
4. Comprobación: las integrales son $2 - 1/n$, que valen 1.9375 con $n = 16$.

:::figura[Truncamientos de $1/\sqrt{x}$ bajo la cota integrable $g(x) = 1/\sqrt{x}$: las integrales 1, 1.5, 1.75 y 1.9375 se acercan a 2, la integral de la cota y del límite.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: creciente
```
:::

## Propiedades

- **Convergencia en $L^1$:** la conclusión es más fuerte que la convergencia de las integrales: $\int |f_n - f| \to 0$.
- **Derivación bajo la integral:** sea $h(x, \theta)$ una función de $x$ y de un parámetro $\theta$, con derivada parcial $\partial_\theta h$ respecto de $\theta$. Si $|\partial_\theta h(x, \theta)| \le G(x)$ para todo $\theta$ de un entorno, con $G$ integrable que no depende de $\theta$, entonces $\frac{d}{d\theta}\int h(x, \theta)\,dx = \int \partial_\theta h(x, \theta)\,dx$.
- **Esperanzas:** si las variables aleatorias $X_n$ tienden c.s. a $X$ y están acotadas en valor absoluto por una variable $Y$ con $\mathbb{E}[Y] < \infty$, entonces $\mathbb{E}[X_n] \to \mathbb{E}[X]$.
- **Convergencia en medida:** el teorema sigue valiendo si la convergencia c.t.p. se reemplaza por convergencia en medida.
- **Necesidad de la convergencia:** la cota común no basta si la sucesión no converge; una sucesión acotada que alterna entre dos indicadoras no tiene límite que integrar.

:::figura[Sucesión que alterna entre las indicadoras de la mitad izquierda y de la mitad derecha del intervalo: está dominada por 1 y cada integral vale 0.5, pero no converge en ningún punto, así que el teorema no dice nada.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: alternante
```
:::

## Errores comunes

- **Usar una cota que depende de $n$.** La cota $g$ debe ser la misma para todos los términos. Para $f_n = n\,\mathbf{1}_{(0, 1/n)}$ la menor cota común es $\sup_n f_n$, que se comporta como $1/x$ y no es integrable en $(0, 1)$.

:::figura[Escalones n en (0, 1/n): tienden a 0 en cada punto, pero ninguna función integrable los domina a todos y las integrales se quedan en 1, lejos del 0 del límite.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: escalon-alto
```
:::

- **Verificar la integrabilidad del límite y no la de la cota.** Que $\int f < \infty$ no basta; la hipótesis es sobre la función dominante.
- **Olvidar que basta casi en todas partes.** La convergencia y la cota pueden fallar en un conjunto de medida cero, como $x^n$ en $x = 1$.

## Conexiones

Se demuestra con el [[lema-de-fatou]], que a su vez sale del [[teorema-de-convergencia-monotona]]. Trabaja con la [[integral-de-lebesgue]] y con convergencia [[conjuntos-de-medida-cero-y-propiedades-casi-seguras|casi en todas partes]], y su conclusión es una convergencia en los [[espacios-lp|espacio L1]]. En probabilidad se usa para pasar al límite en la [[esperanza-matematica]].

## Formulario

:::formula[Convergencia dominada]
$$
f_n \to f \ \text{c.t.p.},\quad |f_n| \le g,\quad \int g\,d\mu < \infty \;\Longrightarrow\; \int f_n\,d\mu \to \int f\,d\mu
$$

- $f_n$: sucesión medible; $f$: límite; $g$: función dominante integrable; $\mu$: medida.
:::

:::formula[Convergencia en L1]
$$
\int |f_n - f|\,d\mu \to 0
$$

- Consecuencia del teorema bajo las mismas hipótesis.
:::

:::formula[Ejemplo de potencias]
$$
\int_0^1 x^n\,dx = \frac{1}{n + 1} \to 0 = \int_0^1 \lim_n x^n\,dx
$$

- $n$: índice; el límite puntual es 0 salvo en $x = 1$, un conjunto de medida cero.
:::
