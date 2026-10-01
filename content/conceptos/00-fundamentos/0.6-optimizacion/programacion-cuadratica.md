---
id: programacion-cuadratica
titulo: Programación cuadrática
titulo_en: Quadratic programming
alias:
  - programa cuadrático
  - QP
modulo: 0
submodulo: '0.6'
orden: 16
nivel: intermedio
prerrequisitos:
  - optimizacion-con-restricciones
  - optimizacion-convexa
  - formas-cuadraticas
etiquetas:
  - programación cuadrática
  - restricciones lineales
  - convexidad
  - KKT
resumen: >
  Un programa cuadrático minimiza una función cuadrática con restricciones lineales; si su matriz es
  semidefinida positiva el problema es convexo y las condiciones KKT caracterizan la solución.
formula: '\min_{\mathbf{x}}\ \tfrac{1}{2}\mathbf{x}^\top \mathbf{Q}\,\mathbf{x} + \mathbf{c}^\top \mathbf{x} \quad \text{sujeto a} \quad \mathbf{A}\mathbf{x} \le \mathbf{b}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: restricciones
    funciones: [girada, cuadratica]
    restricciones:
      - a: [-1, -1]
        c: -0.5
        etiqueta: 'x + y \ge 0.5'
      - a: [0, -1]
        c: 0.5
        etiqueta: 'y \ge -0.5'
    inicio: [-2, 2]
    tasa: 0.15
referencias:
  - clave: boyd
    capitulo: '4.4'
publicado: true
---

## Intuición

La programación lineal supone que todo es proporcional: el doble de producción cuesta el doble. Muchas situaciones no son así. El costo de operar una planta crece más rápido que la producción, el riesgo de una cartera depende de los cuadrados y productos de las inversiones, y el error de un ajuste se mide con cuadrados. Si el objetivo es cuadrático y las restricciones siguen siendo lineales, el problema es un programa cuadrático.

Con un objetivo cuadrático en forma de tazón, el óptimo ya no tiene que estar en una esquina: puede estar en el interior, si el fondo del tazón es factible, en un lado o en un vértice. Cuando la matriz del objetivo es semidefinida positiva el problema es convexo y su solución se caracteriza completamente por las condiciones de Karush-Kuhn-Tucker. Las máquinas de vectores de soporte, la regresión con restricciones y la selección de carteras de Markowitz son programas cuadráticos.

## Definición

:::definicion[Programa cuadrático]
$$
\min_{\mathbf{x} \in \mathbb{R}^n}\ \tfrac{1}{2}\mathbf{x}^\top \mathbf{Q}\,\mathbf{x} + \mathbf{c}^\top \mathbf{x} \quad \text{sujeto a} \quad \mathbf{A}\mathbf{x} \le \mathbf{b},\quad \mathbf{E}\mathbf{x} = \mathbf{d},
$$
con $\mathbf{Q}$ simétrica. Si $\mathbf{Q} \succeq 0$ el problema es convexo; si $\mathbf{Q} \succ 0$, la solución, si existe, es única.
:::

Condiciones KKT para el caso con desigualdades: existe $\boldsymbol{\mu} \ge \mathbf{0}$ con
$$
\mathbf{Q}\mathbf{x}^* + \mathbf{c} + \mathbf{A}^\top \boldsymbol{\mu} = \mathbf{0}, \qquad \mathbf{A}\mathbf{x}^* \le \mathbf{b}, \qquad \mu_i\,(\mathbf{A}\mathbf{x}^* - \mathbf{b})_i = 0.
$$
Si se conoce qué restricciones están activas, estas condiciones forman un sistema lineal.

:::nota[Qué significa cada símbolo]
- $\mathbf{x}$: variables de decisión.
- $\mathbf{Q}$: matriz simétrica de la parte cuadrática; $\mathbf{c}$: vector de la parte lineal.
- $\mathbf{A}$, $\mathbf{b}$: restricciones de desigualdad $\mathbf{A}\mathbf{x} \le \mathbf{b}$.
- $\mathbf{E}$, $\mathbf{d}$: restricciones de igualdad.
- $\boldsymbol{\mu}$: multiplicadores de las desigualdades.
- $\succeq 0$, $\succ 0$: semidefinida y definida positiva.
:::

## Cómo usar la visualización

Las curvas de nivel elípticas son las de un objetivo cuadrático y la región sombreada la definen dos desigualdades lineales. El descenso de gradiente proyectado avanza: cada paso de gradiente, en naranja, se proyecta de regreso a la región, en amarillo. El encabezado escribe el paso y su proyección y el panel indica las restricciones activas. El selector cambia el objetivo.

Con la cuadrática girada, el mínimo sin restricciones, $(1, -1)$, viola las dos restricciones y la solución es el vértice $(1, -0.5)$, donde ambas son activas. Con $\tfrac{1}{2}(x^2 + 10y^2)$ la solución está sobre un solo lado.

## Ejemplo

Dos máquinas reparten una producción mínima de 2 unidades; sus costos son $\tfrac{1}{2}x^2$ y $5y^2$. Se resuelve $\min \tfrac{1}{2}(x^2 + 10y^2)$ sujeto a $x + y \ge 2$.

1. Forma estándar: $\mathbf{Q} = \begin{pmatrix} 1 & 0 \\ 0 & 10 \end{pmatrix} \succ 0$, $\mathbf{c} = \mathbf{0}$, restricción $-x - y \le -2$.
2. Sin restricción el mínimo es $(0, 0)$, infactible; la restricción debe estar activa.
3. KKT: $(x, 10y) + \mu(-1, -1) = \mathbf{0}$, así que $x = \mu$ y $10y = \mu$, es decir, $x = 10y$.
4. Con $x + y = 2$: $11y = 2$, $y = 0.1818$, $x = 1.8182$ y $\mu = 1.8182 \ge 0$.
5. Costo óptimo: $\tfrac{1}{2}(3.3058 + 0.3306) = 1.8182$. La máquina barata produce diez veces más que la cara, y el multiplicador indica que una unidad más de producción mínima costaría unas 1.82 unidades.

:::figura[El reparto del ejemplo: el descenso proyectado se detiene en (1.82, 0.18), sobre la recta x + y = 2, donde la curva de nivel elíptica del costo es tangente a la restricción.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [cuadratica]
restricciones:
  - a: [-1, -1]
    c: -2
    etiqueta: 'x + y \ge 2'
inicio: [-3, -1]
tasa: 0.15
```
:::

## Propiedades

- **Óptimo interior posible:** a diferencia de la programación lineal, si el mínimo sin restricciones es factible, es la solución.
- **Restricciones activas conocidas:** con las activas fijadas como igualdades, la solución es la de un sistema lineal; los métodos de conjuntos activos prueban combinaciones de ellas.
- **Unicidad:** con $\mathbf{Q} \succ 0$ hay a lo más una solución.
- **Mínimos cuadrados con restricciones:** $\min \lVert \mathbf{X}\boldsymbol{\beta} - \mathbf{y} \rVert^2$ sujeto a restricciones lineales es un programa cuadrático con $\mathbf{Q} = 2\mathbf{X}^\top \mathbf{X}$.
- **Dual:** el dual de un programa cuadrático convexo es otro programa cuadrático; las máquinas de vectores de soporte suelen resolverse en su forma dual.

:::figura[Óptimo interior: con x + y ≥ -1, el mínimo sin restricciones (0, 0) es factible y es también la solución del programa cuadrático; ninguna restricción queda activa.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [cuadratica]
restricciones:
  - a: [-1, -1]
    c: 1
    etiqueta: 'x + y \ge -1'
inicio: [3, 1.5]
tasa: 0.15
```
:::

## Errores comunes

- **Buscar la solución solo en los vértices.** Esa estrategia vale para programas lineales, no para cuadráticos.
- **Ignorar la condición $\mathbf{Q} \succeq 0$.** Si $\mathbf{Q}$ tiene un valor propio negativo, el problema no es convexo y puede tener varios mínimos locales.
- **Olvidar el factor $\tfrac{1}{2}$.** Con $\mathbf{x}^\top \mathbf{Q}\mathbf{x}$ sin el medio, el gradiente es $2\mathbf{Q}\mathbf{x} + \mathbf{c}$ y los multiplicadores cambian.
- **Usar una $\mathbf{Q}$ no simétrica.** Solo la parte simétrica $\tfrac{1}{2}(\mathbf{Q} + \mathbf{Q}^\top)$ afecta al objetivo.

:::figura[Un programa cuadrático no convexo: x² - y² en el cuadrado [-1, 1]², con un valor propio negativo. Desde (0.5, 0.1) el método termina en (0, 1), y desde un punto con y negativa terminaría en (0, -1): dos mínimos locales.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [silla]
restricciones:
  - a: [0, 1]
    c: 1
    etiqueta: 'y \le 1'
  - a: [0, -1]
    c: 1
    etiqueta: 'y \ge -1'
  - a: [1, 0]
    c: 1
    etiqueta: 'x \le 1'
  - a: [-1, 0]
    c: 1
    etiqueta: 'x \ge -1'
inicio: [0.5, 0.1]
tasa: 0.1
```
:::

## Conexiones

Combina las [[formas-cuadraticas]] con las restricciones lineales de la [[programacion-lineal]] y se resuelve con las técnicas de [[optimizacion-con-restricciones]]. Si $\mathbf{Q}$ está entre las [[matrices-definidas-positivas-y-semidefinidas]], es [[optimizacion-convexa]] y la caracterizan las [[condiciones-de-karush-kuhn-tucker]]. Su dual se obtiene con la [[dualidad-de-lagrange]]. Los mínimos cuadrados del [[calculo-matricial]] son el caso sin restricciones.

## Formulario

:::formula[Programa cuadrático]
$$
\min_{\mathbf{x}}\ \tfrac{1}{2}\mathbf{x}^\top \mathbf{Q}\,\mathbf{x} + \mathbf{c}^\top \mathbf{x} \quad \text{s. a.} \quad \mathbf{A}\mathbf{x} \le \mathbf{b}
$$

- $\mathbf{Q}$: matriz simétrica; $\mathbf{c}$: vector; $\mathbf{A}\mathbf{x} \le \mathbf{b}$: restricciones lineales.
:::

:::formula[Condiciones KKT]
$$
\mathbf{Q}\mathbf{x}^* + \mathbf{c} + \mathbf{A}^\top \boldsymbol{\mu} = \mathbf{0}, \quad \boldsymbol{\mu} \ge \mathbf{0}, \quad \mu_i(\mathbf{A}\mathbf{x}^* - \mathbf{b})_i = 0
$$

- $\boldsymbol{\mu}$: multiplicadores.
:::

:::formula[Solución con una restricción activa en el ejemplo]
$$
x = 10y, \quad x + y = 2 \ \Rightarrow\ (x, y) = \left(\tfrac{20}{11}, \tfrac{2}{11}\right), \quad \mu = \tfrac{20}{11}
$$

- $x, y$: producción de cada máquina; $\mu$: costo marginal de la producción mínima.
:::
