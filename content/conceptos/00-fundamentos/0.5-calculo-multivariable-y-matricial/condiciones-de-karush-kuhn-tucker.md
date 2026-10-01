---
id: condiciones-de-karush-kuhn-tucker
titulo: Condiciones de Karush-Kuhn-Tucker
titulo_en: Karush-Kuhn-Tucker conditions
alias:
  - condiciones KKT
  - KKT
  - holgura complementaria
modulo: 0
submodulo: '0.5'
orden: 17
nivel: avanzado
prerrequisitos:
  - multiplicadores-de-lagrange
etiquetas:
  - KKT
  - restricciones de desigualdad
  - holgura complementaria
  - optimización
resumen: >
  Las condiciones KKT extienden a Lagrange a restricciones de desigualdad: en el óptimo, el gradiente se
  equilibra con restricciones activas de multiplicadores no negativos y las inactivas no cuentan.
formula: '\nabla f(\mathbf{x}^*) + \sum_i \mu_i \nabla g_i(\mathbf{x}^*) = \mathbf{0}, \quad g_i(\mathbf{x}^*) \le 0, \quad \mu_i \ge 0, \quad \mu_i\,g_i(\mathbf{x}^*) = 0'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: kkt
    casos: [triangulo, semiplano]
referencias:
  - clave: boyd
    capitulo: '5.5'
publicado: true
---

## Intuición

Muchas restricciones reales son desigualdades: un presupuesto que no se puede exceder, cantidades que no pueden ser negativas, una capacidad máxima. A diferencia de una igualdad, una desigualdad puede no estorbar: si el mejor punto sin restricciones ya la cumple con margen, es como si no existiera. Solo cuando el óptimo quiere salirse de la región la restricción se vuelve una pared que lo detiene.

Las condiciones de Karush, Kuhn y Tucker formalizan esa idea. Cada restricción recibe un multiplicador que mide con qué fuerza empuja. Si la restricción no está activa, su multiplicador es cero; si está activa, el multiplicador es positivo y la pared empuja hacia dentro de la región para equilibrar el tirón del objetivo. En una esquina pueden empujar dos paredes a la vez. Estas condiciones son la base de los métodos de optimización con restricciones y de modelos como las máquinas de vectores de soporte.

## Definición

Problema: minimizar $f(\mathbf{x})$ sujeto a $g_i(\mathbf{x}) \le 0$ para $i = 1, \dots, m$, con funciones diferenciables.

:::teorema[Condiciones KKT]
Si $\mathbf{x}^*$ es un mínimo local y se cumple una condición de regularidad (por ejemplo, que los gradientes de las restricciones activas sean linealmente independientes), existen $\mu_1, \dots, \mu_m$ tales que:
1. **Estacionariedad:** $\nabla f(\mathbf{x}^*) + \sum_{i=1}^{m} \mu_i \nabla g_i(\mathbf{x}^*) = \mathbf{0}$.
2. **Factibilidad primal:** $g_i(\mathbf{x}^*) \le 0$ para todo $i$.
3. **Factibilidad dual:** $\mu_i \ge 0$ para todo $i$.
4. **Holgura complementaria:** $\mu_i\,g_i(\mathbf{x}^*) = 0$ para todo $i$.
:::

Una restricción es **activa** si $g_i(\mathbf{x}^*) = 0$. Por la holgura complementaria, las inactivas tienen $\mu_i = 0$. Si $f$ y las $g_i$ son convexas, las condiciones KKT también son suficientes: todo punto que las cumple es un mínimo global.

:::nota[Qué significa cada símbolo]
- $f$: función objetivo que se minimiza.
- $g_i$: función de la restricción $i$; los puntos permitidos cumplen $g_i(\mathbf{x}) \le 0$.
- $m$: número de restricciones.
- $\mathbf{x}^*$: punto óptimo.
- $\mu_i$: multiplicador de la restricción $i$, no negativo.
- $\nabla f$, $\nabla g_i$: gradientes.
- $\mu_i\,g_i(\mathbf{x}^*) = 0$: o la restricción está activa, o su multiplicador es cero.
:::

## Cómo usar la visualización

La región azul es el conjunto factible. Un objetivo naranja se mueve alrededor de ella y el punto amarillo es el punto factible más cercano a él, la solución de minimizar $\lVert \mathbf{x} - \mathbf{t} \rVert^2$. Las flechas verdes son los términos $\mu_i\mathbf{a}_i$ de las restricciones activas. El encabezado escribe el equilibrio $-\nabla f = \sum \mu_i \mathbf{a}_i$ con los números del instante y la lista de restricciones activas; el panel muestra cada multiplicador.

Cuando el objetivo pasa por dentro de la región, la solución es el propio objetivo y todos los multiplicadores valen 0. Frente a un lado, se activa una restricción; frente a una esquina, dos, y sus flechas se suman para apuntar hacia el objetivo.

## Ejemplo

Un recurso se reparte entre dos proyectos en cantidades $x, y \ge 0$, con un total que no supera 1. La asignación ideal sería $(1, 1)$, y se busca la asignación factible más cercana: minimizar $f(x, y) = (x - 1)^2 + (y - 1)^2$ sujeto a $g_1 = x + y - 1 \le 0$, $g_2 = -x \le 0$ y $g_3 = -y \le 0$.

1. Gradientes: $\nabla f = (2(x - 1), 2(y - 1))$, $\nabla g_1 = (1, 1)$, $\nabla g_2 = (-1, 0)$, $\nabla g_3 = (0, -1)$.
2. El ideal $(1, 1)$ viola $g_1$, así que se prueba con $g_1$ activa y las otras inactivas: $\mu_2 = \mu_3 = 0$.
3. Estacionariedad: $2(x - 1) + \mu_1 = 0$ y $2(y - 1) + \mu_1 = 0$, de donde $x = y$; con $x + y = 1$, $x = y = 0.5$.
4. Multiplicador: $\mu_1 = -2(0.5 - 1) = 1 \ge 0$. Se cumplen las cuatro condiciones.
5. Como $f$ y las restricciones son convexas, $(0.5, 0.5)$ es el mínimo global, a distancia $\sqrt{0.5} = 0.707$ del ideal.
6. Sensibilidad: si el total subiera a $1 + c$, la distancia al cuadrado sería $(1 - c)^2/2$, que en $c = 0$ cambia a razón de $-1 = -\mu_1$.

:::figura[El reparto del ejemplo: con el objetivo en (1, 1), la solución es (0.5, 0.5), sobre el lado x + y = 1, con μ₁ = 1. Al reproducir, el objetivo da la vuelta a la región y cambian las restricciones activas.]{componente="SurfaceViz"}
```yaml
modo: kkt
casos: [triangulo]
objetivo: [1, 1]
```
:::

## Propiedades

- **Igualdades:** las restricciones de igualdad se agregan con multiplicadores sin restricción de signo, como en Lagrange.
- **Suficiencia en problemas convexos:** con $f$ y las $g_i$ convexas, cualquier punto que cumple las KKT es un mínimo global.
- **Precios sombra:** cada $\mu_i$ mide cuánto bajaría el óptimo si la restricción $i$ se relajara una unidad.
- **Interior:** si ninguna restricción está activa, las KKT se reducen a $\nabla f(\mathbf{x}^*) = \mathbf{0}$.
- **Dualidad:** los multiplicadores son las variables del problema dual, cuya resolución da cotas del valor óptimo.

:::figura[Holgura complementaria: con el objetivo en (0.5, 0.2), dentro del semiplano x + 2y ≤ 2, la solución es el propio objetivo, la restricción no está activa y su multiplicador vale 0.]{componente="SurfaceViz"}
```yaml
modo: kkt
casos: [semiplano]
objetivo: [0.5, 0.2]
```
:::

## Errores comunes

- **Permitir multiplicadores negativos.** Con la convención $g_i \le 0$ y $\nabla f + \sum \mu_i \nabla g_i = \mathbf{0}$, un $\mu_i < 0$ indica que la restricción no debería estar activa.
- **Activar todas las restricciones.** Las inactivas tienen multiplicador cero; tratarlas como igualdades lleva a soluciones que no son óptimas o ni siquiera factibles.
- **Olvidar la condición de regularidad.** En puntos donde los gradientes activos son dependientes, el óptimo puede no cumplir las KKT.
- **Usarlas como suficientes sin convexidad.** En problemas no convexos un punto KKT puede ser un máximo o una silla.

:::figura[Una esquina con dos restricciones activas: con el objetivo en (-1, -1), la solución es el vértice (0, 0), y los multiplicadores de x ≥ 0 y de y ≥ 0 valen 2 cada uno, ambos positivos; sus flechas se suman para apuntar hacia el objetivo.]{componente="SurfaceViz"}
```yaml
modo: kkt
casos: [triangulo]
objetivo: [-1, -1]
```
:::

## Conexiones

Extienden los [[multiplicadores-de-lagrange]] a desigualdades y usan el [[gradiente]] de cada restricción. La región factible de este ejemplo es un polígono, y proyectar sobre ella es como la [[proyeccion-ortogonal]] sobre un subespacio, pero con paredes. En aprendizaje automático, las máquinas de vectores de soporte se resuelven con estas condiciones, y los vectores de soporte son justamente los datos con multiplicador positivo.

## Formulario

:::formula[Estacionariedad]
$$
\nabla f(\mathbf{x}^*) + \sum_{i=1}^{m} \mu_i \nabla g_i(\mathbf{x}^*) = \mathbf{0}
$$

- $f$: objetivo; $g_i$: restricciones $g_i \le 0$.
- $\mu_i$: multiplicadores.
:::

:::formula[Factibilidad primal y dual]
$$
g_i(\mathbf{x}^*) \le 0, \qquad \mu_i \ge 0
$$

- La primera dice que el punto cumple las restricciones.
- La segunda, que las paredes solo empujan hacia dentro.
:::

:::formula[Holgura complementaria]
$$
\mu_i\,g_i(\mathbf{x}^*) = 0
$$

- Si $g_i(\mathbf{x}^*) < 0$, la restricción está inactiva y $\mu_i = 0$.
- Si $\mu_i > 0$, la restricción está activa: $g_i(\mathbf{x}^*) = 0$.
:::

:::formula[Proyección del ejemplo]
$$
\min\ (x - 1)^2 + (y - 1)^2 \ \text{ s. a. }\ x + y \le 1,\ x \ge 0,\ y \ge 0 \ \Rightarrow\ (x^*, y^*) = (0.5, 0.5),\ \mu_1 = 1
$$

- $(1, 1)$: asignación ideal; $\mu_1$: multiplicador de la restricción del total.
:::
