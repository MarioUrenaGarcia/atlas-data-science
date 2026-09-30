---
id: limites
titulo: Límites
titulo_en: Limits
alias:
  - límite de una función
  - límites laterales
  - definición épsilon delta
modulo: 0
submodulo: '0.4'
orden: 2
nivel: basico
prerrequisitos: []
relaciones:
  - tipo: relacionado
    id: sucesiones
etiquetas:
  - límites
  - épsilon delta
  - límites laterales
  - aproximación
resumen: >
  El límite de f(x) cuando x tiende a a es el valor al que se acercan las salidas cuando las entradas se
  acercan a a, sin importar lo que pase exactamente en a; existe solo si ambos lados coinciden.
formula: '\lim_{x \to a} f(x) = L \iff \forall \varepsilon > 0\ \exists \delta > 0:\ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: limite
    casos: [removible, salto, infinito-signos, oscilante, valor-absoluto]
    epsilon: true
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un límite describe hacia dónde se dirigen los valores de una función cuando la entrada se acerca a un punto, aunque nunca llegue a él. Es como estimar la velocidad de un auto en un instante con un cronómetro: se mide la distancia recorrida en intervalos cada vez más cortos alrededor de ese instante y se observa a qué valor se acercan los cocientes. El instante mismo no sirve, porque en él no hay recorrido.

Por eso el límite ignora lo que ocurre exactamente en el punto: la función puede no estar definida ahí, o valer algo distinto, y el límite no cambia. Lo que importa es que, al acercarse por la izquierda y por la derecha, los valores se amontonen alrededor de un mismo número. Si por un lado se acercan a un número y por el otro a otro, si crecen sin cota o si oscilan sin decidirse, el límite no existe.

## Definición

:::definicion[Límite]
Sea $f$ definida cerca de $a$, salvo quizá en $a$. Se dice que $\lim_{x \to a} f(x) = L$ si para cada $\varepsilon > 0$ existe $\delta > 0$ tal que
$$
0 < |x - a| < \delta \ \Longrightarrow\ |f(x) - L| < \varepsilon.
$$
:::

:::definicion[Límites laterales]
$\lim_{x \to a^-} f(x) = L$ si la condición anterior se cumple solo para $a - \delta < x < a$; $\lim_{x \to a^+} f(x) = L$ si se cumple para $a < x < a + \delta$. El límite existe si y solo si los dos laterales existen y son iguales.
:::

Se escribe $\lim_{x \to a} f(x) = +\infty$ cuando $f(x)$ supera cualquier cota al acercarse a $a$; en ese caso el límite, como número, no existe.

:::nota[Qué significa cada símbolo]
- $f$: función estudiada.
- $a$: punto al que se acerca $x$.
- $L$: valor del límite.
- $\varepsilon$: tolerancia permitida alrededor de $L$.
- $\delta$: ventana alrededor de $a$ que garantiza esa tolerancia.
- $|x - a|$: distancia entre $x$ y $a$; la condición $0 < |x - a|$ excluye al propio $a$.
- $a^-$, $a^+$: acercamiento por la izquierda y por la derecha.
:::

## Cómo usar la visualización

El selector elige una función. Dos puntos se acercan al punto $a$, uno por cada lado, y el panel registra $f(a - h)$ y $f(a + h)$ mientras $h$ se reduce. Los círculos vacíos marcan límites laterales; el lleno, el valor $f(a)$ si existe. El control de tolerancia dibuja la franja $L \pm \varepsilon$ y la ventana $a \pm \delta$ que la garantiza.

Con el hueco, al reducir $\varepsilon$ la ventana $\delta$ también se reduce, pero siempre existe. Con el salto, los dos puntos se separan hacia valores distintos y no hay franja que los contenga a ambos. Con la oscilación, los valores saltan entre $-1$ y $1$ sin estabilizarse.

## Ejemplo

Se estima $\lim_{x \to 0} \frac{\operatorname{sen} x}{x}$, que aparece al medir ángulos pequeños con instrumentos ópticos, donde $f(0)$ no está definido.

1. $x = 0.5$: $\operatorname{sen}(0.5)/0.5 = 0.47943/0.5 = 0.95885$.
2. $x = 0.1$: $0.099833/0.1 = 0.99833$.
3. $x = 0.01$: $0.0099998/0.01 = 0.99998$.
4. Por la izquierda los valores son iguales, porque $\operatorname{sen}(-x)/(-x) = \operatorname{sen} x / x$.
5. Los valores se acercan a 1: $\lim_{x \to 0} \frac{\operatorname{sen} x}{x} = 1$. Para $\varepsilon = 0.01$ basta $\delta = 0.24$, porque $1 - \operatorname{sen} x / x \le x^2/6 < 0.01$ si $|x| < 0.24$.

:::figura[El cociente sen x / x del ejemplo: los valores a ambos lados de 0 se acercan a 1 aunque la función no esté definida en 0. La franja de tolerancia muestra la ventana δ que funciona para cada ε.]{componente="CalculusViz"}
```yaml
modo: limite
casos: [seno-sobre-x]
epsilon: true
```
:::

## Propiedades

- **Unicidad:** si el límite existe, es único.
- **Álgebra de límites:** si $\lim f = L$ y $\lim g = M$, entonces $\lim (f \pm g) = L \pm M$, $\lim fg = LM$ y $\lim f/g = L/M$ si $M \neq 0$.
- **Sustitución directa:** para polinomios y funciones continuas, $\lim_{x \to a} f(x) = f(a)$.
- **Teorema del sándwich:** si $g \le f \le h$ cerca de $a$ y $\lim g = \lim h = L$, entonces $\lim f = L$.
- **Límites al infinito:** $\lim_{x \to \infty} f(x) = L$ si $f(x)$ se acerca a $L$ para $x$ grande; por ejemplo $\lim_{x \to \infty} 1/x = 0$.
- **Relación con sucesiones:** $\lim_{x \to a} f(x) = L$ si y solo si $f(x_n) \to L$ para toda sucesión $x_n \to a$ con $x_n \neq a$.

:::demostracion
Unicidad: si $L$ y $M$ fueran límites distintos, con $\varepsilon = |L - M|/2$ existiría un $x$ cercano a $a$ con $|f(x) - L| < \varepsilon$ y $|f(x) - M| < \varepsilon$, y entonces $|L - M| \le |L - f(x)| + |f(x) - M| < 2\varepsilon = |L - M|$, una contradicción.
:::

## Errores comunes

- **Calcular el límite evaluando en el punto.** En $\frac{x^2 - 1}{x - 1}$ evaluar en 1 da $0/0$, que no es un número; hay que simplificar a $x + 1$ y el límite es 2.
- **Creer que el límite y el valor coinciden siempre.** Solo coinciden si la función es continua en el punto.
- **Declarar que existe con un solo lado.** $|x|/x$ tiende a $-1$ por la izquierda y a $1$ por la derecha: no tiene límite en 0.
- **Confiar en una tabla con pocos valores.** $\operatorname{sen}(\pi/x)$ vale 0 en $x = 1, 0.1, 0.01, \dots$ y sin embargo no tiene límite en 0.

## Conexiones

El límite de funciones generaliza el de las [[sucesiones]] y sirve para definir la [[continuidad]], la [[derivada-como-pendiente-y-razon-de-cambio|derivada]] y la [[integral-definida-como-area|integral]]. Las formas indeterminadas $0/0$ se resuelven con la [[regla-de-lhopital]], y los límites en el infinito definen las [[integrales-impropias]]. En probabilidad, los teoremas límite describen el comportamiento de promedios cuando el tamaño de muestra crece.

## Formulario

:::formula[Definición épsilon delta]
$$
\lim_{x \to a} f(x) = L \iff \forall \varepsilon > 0\ \exists \delta > 0:\ 0 < |x - a| < \delta \Rightarrow |f(x) - L| < \varepsilon
$$

- $\varepsilon$: tolerancia en la salida.
- $\delta$: ventana en la entrada.
:::

:::formula[Límites laterales]
$$
\lim_{x \to a} f(x) = L \iff \lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L
$$

- $a^-$: por la izquierda; $a^+$: por la derecha.
:::

:::formula[Álgebra de límites]
$$
\lim (f + g) = L + M, \qquad \lim fg = LM, \qquad \lim \frac{f}{g} = \frac{L}{M}\ (M \neq 0)
$$

- $L = \lim f$, $M = \lim g$.
:::

:::formula[Límite notable]
$$
\lim_{x \to 0} \frac{\operatorname{sen} x}{x} = 1
$$

- $x$ en radianes.
:::
