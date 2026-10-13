---
id: teorema-del-mapeo-continuo
titulo: Teorema del mapeo continuo
titulo_en: Continuous mapping theorem
alias:
  - teorema de la aplicación continua
  - conservación de límites bajo funciones continuas
modulo: 3
submodulo: '3.1'
orden: 18
nivel: intermedio
prerrequisitos:
  - convergencia-en-distribucion
  - continuidad
etiquetas:
  - funciones continuas
  - convergencia en distribución
  - convergencia en probabilidad
  - ji cuadrada
resumen: >
  Si Xₙ converge a X casi seguramente, en probabilidad o en distribución, y g es continua salvo en un
  conjunto donde X tiene probabilidad cero, entonces g(Xₙ) converge a g(X) en el mismo sentido.
formula: 'X_n \xrightarrow{d} X,\ \ P(X \in D_g) = 0 \ \Rightarrow\ g(X_n) \xrightarrow{d} g(X)'
visualizacion:
  componente: AsymptoticTransform
  parametros:
    modo: mapeo
    funcion: cuadrado
    funciones:
      - cuadrado
      - valor-absoluto
      - exponencial
      - signo
      - indicadora-en-cero
    nMaximo: 120
referencias:
  - clave: wasserman
  - clave: casella-berger
    capitulo: '5.5'
publicado: true
---

## Intuición

Un genetista cruza plantas y espera que tres de cada cuatro muestren el rasgo dominante. Para evaluar si sus conteos se apartan de la proporción esperada calcula la estadística ji cuadrada de Pearson. Con dos categorías esa estadística es exactamente el cuadrado de la diferencia estandarizada entre lo observado y lo esperado. El teorema central del límite dice que la diferencia estandarizada es aproximadamente normal; ¿qué se puede decir de su cuadrado?

El teorema del mapeo continuo resuelve esta clase de preguntas de una vez: si una sucesión converge y se le aplica una función continua, el resultado converge al valor de la función en el límite. Una función continua no separa puntos cercanos, así que si $X_n$ y $X$ se parecen, $g(X_n)$ y $g(X)$ también. Por eso el cuadrado de algo aproximadamente normal estándar es aproximadamente ji cuadrada con un grado de libertad. La continuidad puede fallar en algunos puntos siempre que el límite no ponga probabilidad en ellos; si la función salta justo donde se concentra el límite, la conclusión deja de valer.

## Definición

:::teorema[Mapeo continuo]
Sea $g: \mathbb{R}^k \to \mathbb{R}^m$ y sea $D_g$ el conjunto de puntos donde $g$ es discontinua. Si $P(X \in D_g) = 0$, entonces
1. $X_n \xrightarrow{c.s.} X \Rightarrow g(X_n) \xrightarrow{c.s.} g(X)$,
2. $X_n \xrightarrow{p} X \Rightarrow g(X_n) \xrightarrow{p} g(X)$,
3. $X_n \xrightarrow{d} X \Rightarrow g(X_n) \xrightarrow{d} g(X)$.
:::

En particular, si $g$ es continua en todo punto, las tres conclusiones valen sin condiciones adicionales. El teorema aplica también a vectores: por ejemplo, si $(X_n, Y_n) \xrightarrow{d} (X, Y)$ conjuntamente, entonces $X_n + Y_n \xrightarrow{d} X + Y$.

:::nota[Qué significa cada símbolo]
- $X_n$: sucesión de variables o vectores aleatorios; $X$, su límite.
- $g$: función que se aplica a cada término.
- $D_g$: conjunto de puntos de discontinuidad de $g$.
- $P(X \in D_g) = 0$: el límite no pone probabilidad en las discontinuidades.
- $\xrightarrow{c.s.}$, $\xrightarrow{p}$, $\xrightarrow{d}$: convergencia casi segura, en probabilidad y en distribución.
- $k$, $m$: dimensiones del dominio y del codominio de $g$.
:::

## Cómo usar la visualización

$X_n$ es una binomial estandarizada, $\frac{B_n - n/2}{\sqrt{n/4}}$ con $B_n \sim \operatorname{Bin}(n, 1/2)$, cuya distribución exacta se calcula para cada $n$. El panel izquierdo compara su histograma con la normal estándar; el derecho compara la función de distribución exacta de $g(X_n)$ con la de $g(Z)$, o bien, para funciones con valores 0 y 1, las barras de ambas leyes. La reproducción aumenta $n$.

Con $g(x) = x^2$ la escalera de $X_n^2$ se pega a la ji cuadrada con un grado de libertad. Con $g = \mathbf{1}\{x > 0\}$, discontinua en 0, el límite no tiene masa en 0 y la probabilidad de 1 tiende a 1/2. En el último caso, $X_n = 1/n$ y la misma indicadora: $g(X_n) = 1$ para todo $n$ mientras que $g(0) = 0$, y la distancia se queda en 1.

## Ejemplo

En un cruce genético se esperan plantas con rasgo dominante en proporción $p = 0.75$. De $n = 200$ plantas, 140 lo muestran.

1. Diferencia estandarizada: $Z_n = \frac{140 - 200 \cdot 0.75}{\sqrt{200 \cdot 0.75 \cdot 0.25}} = \frac{-10}{6.124} = -1.633$. Por el teorema central del límite, $Z_n \approx \mathcal{N}(0, 1)$.
2. La ji cuadrada de Pearson con dos categorías es $X^2 = \frac{(140 - 150)^2}{150} + \frac{(60 - 50)^2}{50} = 0.667 + 2 = 2.667$, que es exactamente $Z_n^2$.
3. Como $g(z) = z^2$ es continua, $Z_n^2 \xrightarrow{d} Z^2 \sim \chi^2_1$.
4. Valor $p$: $P(\chi^2_1 > 2.667) = P(|Z| > 1.633) = 0.102$.
5. Los conteos son compatibles con la proporción 3 a 1 al nivel 0.05.

:::figura[El ejemplo del cruce genético: el cuadrado de una binomial estandarizada se acerca a la ji cuadrada con un grado de libertad.]{componente="AsymptoticTransform"}
```yaml
modo: mapeo
funcion: cuadrado
nMaximo: 200
```
:::

## Propiedades

- **Consistencia transformada:** si $\hat{\theta}_n \xrightarrow{p} \theta$, entonces $\hat{\theta}_n^2$, $e^{\hat{\theta}_n}$ y $1/\hat{\theta}_n$ (si $\theta \neq 0$) son consistentes para $\theta^2$, $e^{\theta}$ y $1/\theta$.
- **Formas cuadráticas:** si $\mathbf{Z}_n \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \mathbf{I})$, entonces $\|\mathbf{Z}_n\|^2 \xrightarrow{d} \chi^2_k$; así se obtiene la distribución asintótica de la ji cuadrada de Pearson con $k + 1$ categorías.
- **Discontinuidades permitidas:** basta continuidad en un conjunto de probabilidad 1 para el límite; la indicadora $\mathbf{1}\{x > 0\}$ sirve cuando el límite es continuo.
- **Relación con Slutsky:** Slutsky es el caso $g(x, y) = x + y$, $xy$ o $x/y$ aplicado al vector $(X_n, Y_n) \xrightarrow{d} (X, c)$.
- **Requiere convergencia conjunta para funciones de varias variables:** la convergencia de cada coordenada por separado no basta.

:::figura[Propiedad: el valor absoluto. |Xₙ| converge a la distribución seminormal, con densidad 2φ(y).]{componente="AsymptoticTransform"}
```yaml
modo: mapeo
funcion: valor-absoluto
nMaximo: 120
```
:::

:::figura[Propiedad: la exponencial lleva el límite normal a una lognormal. La escalera de e^Xₙ se acerca a la función de distribución lognormal.]{componente="AsymptoticTransform"}
```yaml
modo: mapeo
funcion: exponencial
nMaximo: 120
```
:::

:::figura[Propiedad: discontinuidades donde el límite no tiene masa. La indicadora de positivo salta en 0, pero la normal no pone probabilidad en 0 y P(Xₙ > 0) tiende a 1/2.]{componente="AsymptoticTransform"}
```yaml
modo: mapeo
funcion: signo
nMaximo: 120
```
:::

:::demostracion
Para la convergencia en probabilidad con $g$ continua y límite constante $c$: dado $\varepsilon > 0$, por continuidad existe $\delta > 0$ tal que $|x - c| < \delta$ implica $|g(x) - g(c)| < \varepsilon$. Entonces $P(|g(X_n) - g(c)| \ge \varepsilon) \le P(|X_n - c| \ge \delta) \to 0$.
:::

## Errores comunes

- **Olvidar la condición sobre las discontinuidades.** Con $X_n = 1/n \to 0$ y $g = \mathbf{1}\{x > 0\}$, $g(X_n) = 1$ para todo $n$ pero $g(0) = 0$.
- **Aplicarlo coordenada por coordenada.** Si $X_n \xrightarrow{d} X$ e $Y_n \xrightarrow{d} Y$ por separado, no se sigue $X_n + Y_n \xrightarrow{d} X + Y$; hace falta la convergencia del vector.
- **Confundirlo con el método delta.** El mapeo continuo da el límite de $g(X_n)$, pero si $X_n \to c$ constante, el límite es degenerado; para obtener una normal no degenerada hay que reescalar y usar la derivada.
- **Esperar que conserve momentos.** $g(X_n) \xrightarrow{d} g(X)$ no implica $\mathbb{E}[g(X_n)] \to \mathbb{E}[g(X)]$ si $g$ no es acotada.

:::figura[Error común: discontinuidad justo donde está el límite. Con Xₙ = 1/n la indicadora vale 1 siempre y no converge a g(0) = 0.]{componente="AsymptoticTransform"}
```yaml
modo: mapeo
funcion: indicadora-en-cero
nMaximo: 40
```
:::

## Conexiones

Generaliza a variables aleatorias la [[continuidad]] de funciones reales y se aplica a los tres modos: [[convergencia-casi-segura]], [[convergencia-en-probabilidad]] y [[convergencia-en-distribucion]]. El [[teorema-de-slutsky]] es un caso particular, y el [[metodo-delta]] lo complementa cuando el límite es una constante. Junto con el [[teorema-central-del-limite]] y el [[tcl-multivariado]] produce las distribuciones ji cuadrada asintóticas de muchas pruebas. Por ejemplo, si un estadístico converge a una normal estándar, su cuadrado converge a una [[distribucion-chi-cuadrada]] con un grado de libertad.

## Formulario

:::formula[Mapeo continuo]
$$
X_n \xrightarrow{d} X,\ \ P(X \in D_g) = 0 \Rightarrow g(X_n) \xrightarrow{d} g(X)
$$

- $g$: función medible.
- $D_g$: conjunto de discontinuidades de $g$.
- Vale igual con $\xrightarrow{p}$ y con $\xrightarrow{c.s.}$.
:::

:::formula[Cuadrado de una normal estándar]
$$
Z_n \xrightarrow{d} \mathcal{N}(0, 1) \Rightarrow Z_n^2 \xrightarrow{d} \chi^2_1
$$

- $\chi^2_1$: ji cuadrada con un grado de libertad.
:::

:::formula[Ji cuadrada con dos categorías]
$$
X^2 = \frac{(O_1 - E_1)^2}{E_1} + \frac{(O_2 - E_2)^2}{E_2} = \bigg(\frac{O_1 - np}{\sqrt{np(1-p)}}\bigg)^2
$$

- $O_1$, $O_2$: conteos observados; $E_1 = np$, $E_2 = n(1 - p)$: esperados.
- $n$: total; $p$: proporción esperada de la primera categoría.
:::

:::formula[Norma al cuadrado de un vector normal]
$$
\mathbf{Z}_n \xrightarrow{d} \mathcal{N}_k(\mathbf{0}, \mathbf{I}) \Rightarrow \|\mathbf{Z}_n\|^2 \xrightarrow{d} \chi^2_k
$$

- $\mathbf{I}$: matriz identidad $k \times k$.
- $\|\cdot\|^2$: suma de los cuadrados de las coordenadas.
:::
