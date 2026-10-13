---
id: dualidad-de-lagrange
titulo: Dualidad de Lagrange
titulo_en: Lagrange duality
alias:
  - problema dual
  - función dual
  - dualidad débil
  - dualidad fuerte
modulo: 0
submodulo: '0.6'
orden: 15
nivel: intermedio
prerrequisitos:
  - optimizacion-con-restricciones
etiquetas:
  - dualidad
  - lagrangiano
  - cota inferior
  - precios sombra
resumen: >
  La función dual g(μ) es el mínimo del lagrangiano para cada multiplicador; siempre es una cota inferior
  del óptimo y, en problemas convexos regulares, su máximo coincide con él.
formula: 'g(\boldsymbol{\mu}) = \min_{\mathbf{x}} \Big(f(\mathbf{x}) + \sum_i \mu_i g_i(\mathbf{x})\Big) \le p^*, \qquad d^* = \max_{\boldsymbol{\mu} \ge \mathbf{0}} g(\boldsymbol{\mu})'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: dualidad
    objetivo: [1.5, 1.5]
    normal: [1, 1]
    cota: 1
referencias:
  - clave: boyd
    capitulo: '5'
publicado: true
---

## Intuición

Imaginar que una restricción no es una prohibición sino un cobro: se puede salir de la región, pero se paga un precio $\mu$ por cada unidad de violación, y se gana ese mismo precio por cada unidad de holgura. Con ese trato, el problema se resuelve sin restricciones. Si el precio es bajo, conviene violar la restricción; si es el adecuado, la mejor decisión ya no tiene incentivo para salirse.

La dualidad de Lagrange formaliza este juego. Para cada precio se calcula el mejor valor del problema sin restricciones con el cobro incluido: la función dual. Como en la región factible el cobro nunca es positivo, ese valor nunca supera al verdadero óptimo; es una cota inferior. El problema dual busca el precio que da la mejor cota. En problemas convexos la mejor cota coincide con el óptimo, y el precio que la logra es el multiplicador de Lagrange, el valor marginal del recurso.

## Definición

Para el problema $\min f(\mathbf{x})$ sujeto a $g_i(\mathbf{x}) \le 0$, $i = 1, \dots, m$, con valor óptimo $p^*$:

:::definicion[Lagrangiano y función dual]
$$
\mathcal{L}(\mathbf{x}, \boldsymbol{\mu}) = f(\mathbf{x}) + \sum_{i=1}^{m} \mu_i\,g_i(\mathbf{x}), \qquad g(\boldsymbol{\mu}) = \inf_{\mathbf{x}} \mathcal{L}(\mathbf{x}, \boldsymbol{\mu}).
$$
El **problema dual** es $d^* = \max_{\boldsymbol{\mu} \ge \mathbf{0}} g(\boldsymbol{\mu})$.
:::

:::teorema[Dualidad débil y fuerte]
Para todo $\boldsymbol{\mu} \ge \mathbf{0}$, $g(\boldsymbol{\mu}) \le p^*$; por tanto $d^* \le p^*$. Si el problema es convexo y existe un punto estrictamente factible (condición de Slater), entonces $d^* = p^*$.
:::

La función dual siempre es cóncava, aunque el problema original no sea convexo. La diferencia $p^* - d^*$ se llama **brecha de dualidad**.

:::nota[Qué significa cada símbolo]
- $f$: objetivo; $g_i$: restricciones $g_i(\mathbf{x}) \le 0$.
- $\mu_i$: multiplicador o precio de la restricción $i$; $\boldsymbol{\mu}$: vector de multiplicadores.
- $\mathcal{L}$: lagrangiano, el objetivo con los cobros incluidos.
- $g(\boldsymbol{\mu})$: función dual, el mínimo del lagrangiano para precios fijos.
- $p^*$: óptimo del problema original; $d^*$: óptimo del dual.
- $\inf$: ínfimo, el mínimo cuando existe.
:::

## Cómo usar la visualización

El problema es proyectar un punto objetivo $\mathbf{t}$ sobre el semiplano $\mathbf{a}^\top\mathbf{x} \le c$. A la izquierda, la región azul, el objetivo naranja y, en amarillo, el punto que minimiza el lagrangiano para el precio actual, $\mathbf{x}(\mu) = \mathbf{t} - \mu\mathbf{a}$. A la derecha, la función dual $g(\mu)$, una parábola cóncava, y la línea verde del óptimo primal $p^*$. La reproducción aumenta $\mu$; el encabezado compara $g(\mu)$ con $p^*$.

Con $\mu = 0$ el punto amarillo coincide con el objetivo, fuera de la región. Al subir el precio se acerca a la frontera y $g(\mu)$ sube; cuando la toca, en $\mu^*$, la parábola alcanza su máximo, que es exactamente $p^*$. Si el precio sigue subiendo, el punto entra a la región y $g$ baja.

## Ejemplo

Se proyecta $\mathbf{t} = (2, 1)$ sobre $x + 2y \le 2$: $\min \tfrac{1}{2}\lVert \mathbf{x} - \mathbf{t} \rVert^2$ con $g(\mathbf{x}) = \mathbf{a}^\top \mathbf{x} - 2 \le 0$, $\mathbf{a} = (1, 2)$.

1. Lagrangiano: $\mathcal{L} = \tfrac{1}{2}\lVert \mathbf{x} - \mathbf{t} \rVert^2 + \mu(\mathbf{a}^\top \mathbf{x} - 2)$, minimizado en $\mathbf{x}(\mu) = \mathbf{t} - \mu\mathbf{a}$.
2. Función dual: $g(\mu) = \mu(\mathbf{a}^\top \mathbf{t} - 2) - \tfrac{\mu^2}{2}\lVert \mathbf{a} \rVert^2 = 2\mu - 2.5\mu^2$, pues $\mathbf{a}^\top \mathbf{t} = 4$ y $\lVert \mathbf{a} \rVert^2 = 5$.
3. Máximo dual: $g'(\mu) = 2 - 5\mu = 0$ da $\mu^* = 0.4$ y $d^* = 0.8 - 0.4 = 0.4$.
4. Primal: la proyección es $\mathbf{x}(\mu^*) = (2 - 0.4,\ 1 - 0.8) = (1.6, 0.2)$, sobre la frontera ($1.6 + 0.4 = 2$), con $p^* = \tfrac{1}{2}(0.16 + 0.64) = 0.4$.
5. Dualidad fuerte: $d^* = p^* = 0.4$. Con cualquier otro precio, por ejemplo $\mu = 0.2$, $g = 0.4 - 0.1 = 0.3 < 0.4$.

:::figura[La proyección del ejemplo: al subir μ, el mínimo del lagrangiano se acerca a la recta x + 2y = 2 y la función dual 2μ - 2.5μ² sube hasta 0.4 en μ* = 0.4, justo el óptimo primal.]{componente="OptimizerRace"}
```yaml
modo: dualidad
objetivo: [2, 1]
normal: [1, 2]
cota: 2
```
:::

## Propiedades

- **Concavidad:** $g$ es el mínimo de funciones afines en $\boldsymbol{\mu}$, así que siempre es cóncava; el dual es un problema convexo.
- **Holgura complementaria:** si hay dualidad fuerte, $\mu_i^* g_i(\mathbf{x}^*) = 0$: una restricción inactiva tiene precio cero.
- **Programación lineal:** el dual de $\max \mathbf{c}^\top \mathbf{x}$ con $\mathbf{A}\mathbf{x} \le \mathbf{b}$, $\mathbf{x} \ge \mathbf{0}$ es $\min \mathbf{b}^\top \mathbf{y}$ con $\mathbf{A}^\top \mathbf{y} \ge \mathbf{c}$, $\mathbf{y} \ge \mathbf{0}$, y sus valores óptimos coinciden.
- **Certificados:** un par primal y dual factibles con el mismo valor demuestra que ambos son óptimos.
- **Aplicaciones:** las máquinas de vectores de soporte se resuelven en su forma dual, donde aparecen los productos punto que permite el truco del kernel.

:::figura[Restricción inactiva: si el objetivo (0, 0) ya cumple x + y ≤ 1, el óptimo primal es 0, la función dual -μ - μ² es negativa para todo μ > 0 y su máximo se alcanza en μ* = 0.]{componente="OptimizerRace"}
```yaml
modo: dualidad
objetivo: [0, 0]
normal: [1, 1]
cota: 1
```
:::

## Errores comunes

- **Tomar $g(\boldsymbol{\mu})$ como cota superior.** En una minimización la función dual siempre está por debajo del óptimo.
- **Olvidar $\boldsymbol{\mu} \ge \mathbf{0}$.** Con precios negativos se pierde la cota: el cobro dejaría de ser no positivo en la región factible.
- **Suponer dualidad fuerte sin convexidad.** En problemas no convexos puede haber brecha de dualidad positiva.
- **Confundir el signo de la convención.** Algunos textos escriben $f - \sum \mu_i g_i$; los resultados son los mismos con los signos cambiados.

:::figura[La cota nunca supera al óptimo: para la proyección de (2.5, 0.5) sobre x + y ≤ 1, con p* = 1, la parábola dual vale 0.75 en μ = 0.5 y solo toca la línea de p* en μ* = 1.]{componente="OptimizerRace"}
```yaml
modo: dualidad
objetivo: [2.5, 0.5]
normal: [1, 1]
cota: 1
```
:::

## Conexiones

Generaliza los [[multiplicadores-de-lagrange]] y explica las [[condiciones-de-karush-kuhn-tucker]] como condiciones de dualidad fuerte en la [[optimizacion-con-restricciones]]. En [[programacion-lineal]] da los precios sombra que calcula el [[metodo-simplex]], y en [[optimizacion-convexa]] garantiza que primal y dual tengan el mismo valor. La proyección del ejemplo es la [[proyeccion-ortogonal]] sobre un semiespacio.

## Formulario

:::formula[Lagrangiano]
$$
\mathcal{L}(\mathbf{x}, \boldsymbol{\mu}) = f(\mathbf{x}) + \sum_{i} \mu_i\,g_i(\mathbf{x})
$$

- $\mu_i \ge 0$: multiplicadores; $g_i \le 0$: restricciones.
:::

:::formula[Función dual]
$$
g(\boldsymbol{\mu}) = \inf_{\mathbf{x}} \mathcal{L}(\mathbf{x}, \boldsymbol{\mu})
$$

- Cóncava en $\boldsymbol{\mu}$.
:::

:::formula[Dualidad débil]
$$
g(\boldsymbol{\mu}) \le p^* \quad \text{para todo } \boldsymbol{\mu} \ge \mathbf{0}
$$

- $p^*$: óptimo del problema original.
:::

:::formula[Dual de la proyección sobre un semiespacio]
$$
g(\mu) = \mu(\mathbf{a}^\top \mathbf{t} - c) - \frac{\mu^2}{2}\lVert \mathbf{a} \rVert^2, \qquad \mu^* = \max\Big(0,\ \frac{\mathbf{a}^\top \mathbf{t} - c}{\lVert \mathbf{a} \rVert^2}\Big)
$$

- $\mathbf{t}$: punto que se proyecta; $\mathbf{a}^\top \mathbf{x} \le c$: semiespacio.
:::
