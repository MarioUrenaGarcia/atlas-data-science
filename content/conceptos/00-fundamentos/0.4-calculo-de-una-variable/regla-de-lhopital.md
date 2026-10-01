---
id: regla-de-lhopital
titulo: Regla de L'Hôpital
titulo_en: L'Hôpital's rule
alias:
  - regla de L'Hospital
  - formas indeterminadas
  - cero entre cero
modulo: 0
submodulo: '0.4'
orden: 10
nivel: basico
prerrequisitos:
  - reglas-de-derivacion
etiquetas:
  - límites
  - formas indeterminadas
  - derivadas
  - cocientes
resumen: >
  Si f(x)/g(x) toma la forma 0/0 o infinito entre infinito en a, su límite coincide con el de f'(x)/g'(x),
  siempre que este último exista; cerca de a, cada función se parece a su recta tangente.
formula: '\lim_{x \to a}\frac{f(x)}{g(x)} = \lim_{x \to a}\frac{f''(x)}{g''(x)} \quad \text{si } \tfrac{0}{0} \text{ o } \tfrac{\infty}{\infty}'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: lhopital
    casos: [seno-x, exp-menos-uno, log-x-menos-uno, cubo-menos-ocho, uno-menos-coseno]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Cuando numerador y denominador se anulan en el mismo punto, el cociente $\frac{0}{0}$ no dice nada: el resultado depende de qué tan rápido llega cada uno a cero. Es como comparar a dos corredores que cruzan la meta al mismo tiempo; para saber cuál iba más rápido hay que mirar sus velocidades en ese instante.

Cerca del punto, cada función se parece a su recta tangente, así que $f(x) \approx f'(a)(x - a)$ y $g(x) \approx g'(a)(x - a)$. El factor $(x - a)$ se cancela en el cociente y queda $f'(a)/g'(a)$: el cociente de las velocidades con que ambas funciones se acercan a cero. La regla de L'Hôpital formaliza esa idea y la extiende a los casos en que ambas funciones crecen sin cota.

## Definición

:::teorema[Regla de L'Hôpital]
Sean $f$ y $g$ derivables cerca de $a$ (salvo quizá en $a$), con $g'(x) \neq 0$ cerca de $a$. Si
$$
\lim_{x \to a} f(x) = \lim_{x \to a} g(x) = 0 \qquad \text{o} \qquad \lim_{x \to a} |f(x)| = \lim_{x \to a} |g(x)| = \infty,
$$
y existe $\lim_{x \to a} \frac{f'(x)}{g'(x)} = L$ (finito o infinito), entonces
$$
\lim_{x \to a} \frac{f(x)}{g(x)} = L.
$$
:::

El resultado vale también para límites laterales y para $a = \pm\infty$.

:::nota[Qué significa cada símbolo]
- $f$: numerador; $g$: denominador.
- $a$: punto al que se acerca $x$, finito o infinito.
- $f', g'$: derivadas de numerador y denominador.
- $L$: valor del límite.
- $\tfrac{0}{0}$, $\tfrac{\infty}{\infty}$: formas indeterminadas a las que se aplica la regla.
:::

## Cómo usar la visualización

A la izquierda aparecen el numerador y el denominador, que se cruzan en cero en el punto $a$. A la derecha, el cociente $f/g$ (línea continua) y el cociente de derivadas $f'/g'$ (línea punteada). La reproducción acerca $x$ al punto $a$ y el encabezado compara ambos cocientes numéricamente; la línea horizontal marca el límite.

Lejos de $a$ los dos cocientes son distintos, pero al acercarse coinciden en el mismo valor. En el caso de $\frac{1 - \cos x}{x^2}$ el cociente de derivadas vuelve a ser $0/0$ en $a$: la regla se aplica dos veces.

## Ejemplo

En el análisis de la vibración de una viga aparece $\lim_{x \to 0} \frac{1 - \cos x}{x^2}$.

1. En $x = 0$: numerador $1 - 1 = 0$ y denominador 0. Es $\frac{0}{0}$.
2. Primera aplicación: $\lim_{x \to 0} \frac{\operatorname{sen} x}{2x}$, que sigue siendo $\frac{0}{0}$.
3. Segunda aplicación: $\lim_{x \to 0} \frac{\cos x}{2} = \frac{1}{2}$.
4. Comprobación numérica: con $x = 0.1$, $\frac{1 - \cos 0.1}{0.01} = \frac{0.0049958}{0.01} = 0.49958$.
5. Consecuencia: $\cos x \approx 1 - \frac{x^2}{2}$ para $x$ pequeño.

:::figura[El límite del ejemplo: 1 - cos x y x² se anulan juntos en 0, y tanto su cociente como el de sus derivadas se acercan a 1/2.]{componente="CalculusViz"}
```yaml
modo: lhopital
casos: [uno-menos-coseno]
```
:::

## Propiedades

- **Otras formas indeterminadas:** $0 \cdot \infty$, $\infty - \infty$, $1^\infty$, $0^0$ e $\infty^0$ se reescriben como $\frac{0}{0}$ o $\frac{\infty}{\infty}$ con álgebra o logaritmos.
- **Aplicación repetida:** si $\frac{f'}{g'}$ vuelve a ser indeterminado, se puede aplicar la regla otra vez.
- **Comparación de crecimientos:** $\lim_{x \to \infty} \frac{\log x}{x} = 0$ y $\lim_{x \to \infty} \frac{x^n}{e^x} = 0$: el logaritmo crece más lento que cualquier potencia, y las potencias más lento que la exponencial.
- **Relación con la derivada:** si $f(a) = g(a) = 0$ y $g'(a) \neq 0$, el límite es simplemente $\frac{f'(a)}{g'(a)}$.
- **Límite notable:** $\lim_{x \to \infty}\big(1 + \frac{1}{x}\big)^x = e$, que se obtiene tomando logaritmos.

:::figura[Caso de una indeterminación que se resuelve con una sola aplicación: (x³ - 8)/(x - 2) cerca de 2, donde el cociente de derivadas 3x² vale 12.]{componente="CalculusViz"}
```yaml
modo: lhopital
casos: [cubo-menos-ocho]
```
:::

:::demostracion
Caso sencillo: si $f(a) = g(a) = 0$, $f'$ y $g'$ son continuas y $g'(a) \neq 0$, entonces $\frac{f(x)}{g(x)} = \frac{f(x) - f(a)}{g(x) - g(a)} = \frac{\frac{f(x) - f(a)}{x - a}}{\frac{g(x) - g(a)}{x - a}} \to \frac{f'(a)}{g'(a)}$. El caso general se prueba con el teorema del valor medio de Cauchy.
:::

## Errores comunes

- **Aplicarla sin forma indeterminada.** $\lim_{x \to 0}\frac{x + 1}{x + 2} = \frac{1}{2}$ directamente; derivar daría 1, que es incorrecto.
- **Derivar el cociente con la regla del cociente.** Se derivan numerador y denominador por separado.
- **Concluir que no hay límite si $f'/g'$ no tiene límite.** La regla solo dice algo cuando $\lim f'/g'$ existe; $\frac{x + \operatorname{sen} x}{x}$ tiende a 1 en el infinito aunque $\frac{1 + \cos x}{1}$ oscile.
- **Olvidar revisar la indeterminación antes de cada nueva aplicación.**

## Conexiones

La regla combina [[limites]] con [[reglas-de-derivacion]], y su intuición es la de la [[derivada-como-pendiente-y-razon-de-cambio|recta tangente]]. Los límites notables que resuelve reaparecen en la [[funcion-exponencial-y-logaritmo-natural|exponencial]], en las aproximaciones de la [[serie-de-taylor-y-de-maclaurin]] y en las [[integrales-impropias]]. En probabilidad sirve para comparar colas de distribuciones y velocidades de convergencia.

## Formulario

:::formula[Regla de L'Hôpital]
$$
\lim_{x \to a}\frac{f(x)}{g(x)} = \lim_{x \to a}\frac{f'(x)}{g'(x)}
$$

- Requiere la forma $\frac{0}{0}$ o $\frac{\infty}{\infty}$ y que exista el límite de la derecha.
:::

:::formula[Caso con derivadas en el punto]
$$
f(a) = g(a) = 0,\ g'(a) \neq 0 \ \Rightarrow\ \lim_{x \to a}\frac{f(x)}{g(x)} = \frac{f'(a)}{g'(a)}
$$

- $f', g'$ continuas en $a$.
:::

:::formula[Comparación de crecimientos]
$$
\lim_{x \to \infty}\frac{\log x}{x^{p}} = 0, \qquad \lim_{x \to \infty}\frac{x^{n}}{e^{x}} = 0
$$

- $p > 0$, $n$ cualquier potencia.
:::

:::formula[Límite notable del número e]
$$
\lim_{x \to \infty}\Big(1 + \frac{1}{x}\Big)^{x} = e
$$

- $e \approx 2.71828$.
:::
