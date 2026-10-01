---
id: funciones-convexas-y-concavas
titulo: Funciones convexas y cóncavas
titulo_en: Convex and concave functions
alias:
  - convexidad
  - concavidad
  - desigualdad de Jensen
modulo: 0
submodulo: '0.4'
orden: 9
nivel: basico
prerrequisitos:
  - maximos-y-minimos
etiquetas:
  - convexidad
  - cuerdas
  - Jensen
  - optimización
resumen: >
  Una función es convexa si el segmento entre dos puntos de su gráfica queda por encima de ella, y cóncava
  si queda por debajo; en funciones derivables dos veces equivale a f'' >= 0 o f'' <= 0.
formula: 'f\big((1 - \lambda)p + \lambda q\big) \le (1 - \lambda) f(p) + \lambda f(q), \quad \lambda \in [0, 1]'
visualizacion:
  componente: CalculusViz
  parametros:
    modo: convexidad
    funciones: [cuadrada, cubica, logaritmo, x-exp]
    cuerda: [-1, 1.5]
referencias:
  - clave: boyd
  - clave: goodfellow
    capitulo: '4'
publicado: true
---

## Intuición

Si se tiende una cuerda entre dos puntos de un tazón, la cuerda queda por encima del tazón: esa es la convexidad. En un domo pasa lo contrario, la cuerda queda por debajo, y la función es cóncava. La cuerda representa promediar los valores de los extremos; la gráfica, evaluar la función en el promedio de las entradas. Para una función convexa, el valor en el promedio nunca supera el promedio de los valores.

Esa desigualdad tiene consecuencias prácticas. En una función convexa no hay valles falsos: cualquier mínimo local es el mínimo global, y los algoritmos de descenso llegan al fondo desde cualquier punto de partida. Por eso muchos problemas de estadística y aprendizaje automático se formulan con funciones de pérdida convexas. Y en probabilidad, la misma desigualdad aplicada a promedios de variables aleatorias es la desigualdad de Jensen.

## Definición

:::definicion[Convexidad y concavidad]
$f$ es **convexa** en un intervalo $I$ si para todos $p, q \in I$ y $\lambda \in [0, 1]$
$$
f\big((1 - \lambda)p + \lambda q\big) \le (1 - \lambda) f(p) + \lambda f(q).
$$
Es **cóncava** si se cumple la desigualdad contraria, es decir, si $-f$ es convexa. Es **estrictamente convexa** si la desigualdad es estricta para $p \neq q$ y $0 < \lambda < 1$.
:::

:::teorema[Criterios con derivadas]
Si $f$ es derivable dos veces en $I$: $f$ es convexa si y solo si $f''(x) \ge 0$ en $I$, y cóncava si y solo si $f''(x) \le 0$. Si $f$ es derivable, es convexa si y solo si su gráfica queda sobre todas sus tangentes: $f(y) \ge f(x) + f'(x)(y - x)$.
:::

:::nota[Qué significa cada símbolo]
- $f$: función estudiada.
- $I$: intervalo del dominio.
- $p, q$: extremos de la cuerda.
- $\lambda$: peso entre 0 y 1; recorre el segmento de $p$ a $q$.
- $(1 - \lambda)p + \lambda q$: punto intermedio en el eje $x$.
- $(1 - \lambda)f(p) + \lambda f(q)$: altura de la cuerda en ese punto.
- $f''$: segunda derivada.
:::

## Cómo usar la visualización

El fondo es verde donde $f'' \ge 0$ y rosa donde $f'' < 0$. La cuerda naranja une $(p, f(p))$ y $(q, f(q))$; los controles mueven sus extremos. La reproducción desliza un punto a lo largo de la cuerda y lo compara con la gráfica directamente debajo o encima; el encabezado muestra ambas alturas con la desigualdad correspondiente.

Con $x^2$ la cuerda siempre queda arriba, sin importar dónde se coloquen sus extremos. Con la cúbica, una cuerda dentro de la zona rosa queda abajo y una dentro de la verde queda arriba; si cruza el punto de inflexión, puede quedar arriba en un tramo y abajo en otro.

## Ejemplo

Un inversionista compara recibir un pago seguro con recibir un pago aleatorio del mismo promedio. Con la función convexa $f(x) = e^x$ y los valores $p = -1$, $q = 2$:

1. Punto medio: $\lambda = 0.5$, $x = 0.5$.
2. Valor en el promedio: $f(0.5) = e^{0.5} \approx 1.649$.
3. Promedio de los valores: $\tfrac{1}{2}(e^{-1} + e^{2}) \approx \tfrac{1}{2}(0.368 + 7.389) = 3.878$.
4. Se cumple $1.649 \le 3.878$: la cuerda queda por encima.
5. Por la desigualdad de Jensen, $\mathbb{E}[e^X] \ge e^{\mathbb{E}[X]}$ para cualquier variable aleatoria $X$: la variabilidad aumenta el valor esperado de una función convexa.

:::figura[La exponencial del ejemplo con la cuerda entre -1 y 2: en todo punto la cuerda queda por encima de la curva, y en el punto medio la separación es 3.878 - 1.649.]{componente="CalculusViz"}
```yaml
modo: convexidad
funciones: [exponencial]
cuerda: [-1, 2]
```
:::

## Propiedades

- **Mínimos globales:** en una función convexa todo mínimo local es global; si es estrictamente convexa, el mínimo es único.
- **Operaciones:** la suma de convexas y el máximo de convexas son convexos; $f(ax + b)$ es convexa si $f$ lo es.
- **Ejemplos:** $x^2$, $|x|$, $e^x$ y $-\log x$ son convexas; $\log x$ y $\sqrt{x}$ son cóncavas.
- **Tangentes:** una función convexa derivable queda sobre sus rectas tangentes.
- **Desigualdad de Jensen:** si $f$ es convexa, $f\big(\mathbb{E}[X]\big) \le \mathbb{E}\big[f(X)\big]$.

:::figura[Caso cóncavo: el logaritmo queda por encima de sus cuerdas. Por eso el logaritmo del promedio supera al promedio de los logaritmos, y la media geométrica es menor que la aritmética.]{componente="CalculusViz"}
```yaml
modo: convexidad
funciones: [logaritmo]
cuerda: [0.5, 5]
```
:::

:::demostracion
Mínimo local implica global: si $c$ es mínimo local y existiera $q$ con $f(q) < f(c)$, para $\lambda$ pequeño el punto $x = (1 - \lambda)c + \lambda q$ está cerca de $c$ y cumple $f(x) \le (1 - \lambda)f(c) + \lambda f(q) < f(c)$, contradiciendo que $c$ es mínimo local.
:::

## Errores comunes

- **Confundir la terminología.** En algunos textos "cóncava hacia arriba" significa convexa; conviene fijarse en la definición.
- **Pensar que convexa implica creciente.** $x^2$ es convexa y decrece para $x < 0$.
- **Creer que una función convexa siempre tiene mínimo.** $e^x$ es convexa y no alcanza un mínimo en $\mathbb{R}$.
- **Aplicar Jensen en la dirección equivocada.** Para cóncavas la desigualdad se invierte: $\mathbb{E}[\log X] \le \log \mathbb{E}[X]$.

## Conexiones

La convexidad se lee de las [[derivadas-de-orden-superior|segundas derivadas]] y simplifica la búsqueda de [[maximos-y-minimos]]. La [[funcion-exponencial-y-logaritmo-natural|exponencial]] es el ejemplo convexo típico y el logaritmo el cóncavo. En estadística, la desigualdad de Jensen explica por qué ciertos estimadores están sesgados, y la optimización convexa garantiza que los métodos de regresión regularizada encuentren su mejor solución.

## Formulario

:::formula[Definición de convexidad]
$$
f\big((1 - \lambda)p + \lambda q\big) \le (1 - \lambda) f(p) + \lambda f(q)
$$

- $\lambda \in [0, 1]$: peso de la combinación.
- $p, q$: dos puntos del intervalo.
:::

:::formula[Criterio de la segunda derivada]
$$
f \text{ convexa en } I \iff f''(x) \ge 0\ \ \forall x \in I
$$

- Para $f$ derivable dos veces.
:::

:::formula[Condición de la tangente]
$$
f(y) \ge f(x) + f'(x)(y - x)
$$

- La gráfica queda sobre todas sus tangentes.
:::

:::formula[Desigualdad de Jensen]
$$
f\big(\mathbb{E}[X]\big) \le \mathbb{E}\big[f(X)\big]
$$

- $X$: variable aleatoria con esperanza finita.
- $\mathbb{E}$: esperanza.
:::
