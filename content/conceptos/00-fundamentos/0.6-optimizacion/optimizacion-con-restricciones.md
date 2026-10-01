---
id: optimizacion-con-restricciones
titulo: Optimización con restricciones
titulo_en: Constrained optimization
alias:
  - optimización restringida
  - gradiente proyectado
  - método de penalización
modulo: 0
submodulo: '0.6'
orden: 12
nivel: intermedio
prerrequisitos:
  - condiciones-de-karush-kuhn-tucker
  - descenso-de-gradiente
etiquetas:
  - restricciones
  - gradiente proyectado
  - penalización
  - KKT
resumen: >
  Para optimizar con restricciones se mantiene la búsqueda dentro de la región factible, por ejemplo
  proyectando cada paso de gradiente sobre ella, o se penaliza salirse; en el óptimo se cumplen las condiciones KKT.
formula: '\mathbf{x}_{k+1} = P_C\big(\mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)\big), \qquad P_C(\mathbf{z}) = \arg\min_{\mathbf{x} \in C} \lVert \mathbf{x} - \mathbf{z} \rVert'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: restricciones
    funciones: [redonda, girada]
    restricciones:
      - a: [-1, -1]
        c: -2
        etiqueta: 'x + y \ge 2'
      - a: [1, 0]
        c: 1.5
        etiqueta: 'x \le 1.5'
    inicio: [-2, 3]
    tasa: 0.3
referencias:
  - clave: boyd
    capitulo: '10'
publicado: true
---

## Intuición

Una empresa quiere bajar sus costos, pero debe producir al menos lo que pide un contrato y no puede superar su capacidad. Sin esas reglas bajaría la producción a cero; con ellas, el mejor plan queda en algún borde de lo permitido. La optimización con restricciones busca el mejor punto dentro de la región factible, y casi siempre ese punto está en la frontera.

Hay dos ideas básicas para lograrlo. Una es caminar como si no hubiera restricciones y, cada vez que un paso se sale de la región, regresar al punto permitido más cercano: el gradiente proyectado. La otra es cambiar el problema por uno sin restricciones que castiga salirse, sumando a la función una penalización que crece con la violación. En el óptimo, la tendencia de la función a seguir bajando queda equilibrada por las restricciones activas, y los multiplicadores miden con qué fuerza empuja cada una.

## Definición

Problema: minimizar $f(\mathbf{x})$ con $\mathbf{x} \in C$, donde $C$ es la región factible.

:::definicion[Gradiente proyectado]
Con la **proyección** $P_C(\mathbf{z}) = \arg\min_{\mathbf{x} \in C} \lVert \mathbf{x} - \mathbf{z} \rVert$, el método es
$$
\mathbf{x}_{k+1} = P_C\big(\mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)\big).
$$
Si $C$ es convexo y cerrado, la proyección existe y es única.
:::

:::definicion[Penalización cuadrática]
Para restricciones $g_i(\mathbf{x}) \le 0$, se minimiza sin restricciones
$$
f_\rho(\mathbf{x}) = f(\mathbf{x}) + \frac{\rho}{2}\sum_i \max\big(0,\ g_i(\mathbf{x})\big)^2
$$
y se aumenta $\rho$; las soluciones tienden a la del problema original.
:::

En un óptimo regular se cumplen las condiciones KKT: $\nabla f(\mathbf{x}^*) + \sum_i \mu_i \nabla g_i(\mathbf{x}^*) = \mathbf{0}$ con $\mu_i \ge 0$ y $\mu_i g_i(\mathbf{x}^*) = 0$.

:::nota[Qué significa cada símbolo]
- $C$: región factible.
- $P_C(\mathbf{z})$: proyección de $\mathbf{z}$ sobre $C$, el punto de $C$ más cercano.
- $\eta$: tasa del paso de gradiente.
- $g_i$: funciones de las restricciones, $g_i(\mathbf{x}) \le 0$.
- $\rho$: peso de la penalización.
- $\mu_i$: multiplicadores de KKT.
:::

## Cómo usar la visualización

El mapa muestra las curvas de nivel, la región factible sombreada y, como círculo vacío, el mínimo sin restricciones. En cada iteración se ve el paso de gradiente en naranja, que puede salirse de la región, y su proyección en amarillo, de regreso a ella. El encabezado escribe el paso y la proyección con números; el panel indica qué restricciones están activas. El selector cambia la función.

Con $\tfrac{1}{2}(x^2 + y^2)$, el mínimo sin restricciones, el origen, queda fuera de la región $x + y \ge 2$; los pasos chocan con la recta y se deslizan sobre ella hasta $(1, 1)$. La restricción $x \le 1.5$ nunca se activa.

## Ejemplo

Un equipo reparte una carga de trabajo entre dos turnos, $x$ y $y$, con costo $\tfrac{1}{2}(x^2 + y^2)$; el contrato exige $x + y \ge 2$.

1. Sin la restricción, el mínimo es $(0, 0)$, que la viola.
2. KKT con $g = 2 - x - y \le 0$: $\nabla f + \mu\,\nabla g = (x, y) + \mu(-1, -1) = \mathbf{0}$, así que $x = y = \mu$.
3. La restricción activa da $x + y = 2$, de donde $x = y = 1$ y $\mu = 1 \ge 0$.
4. Costo óptimo: $\tfrac{1}{2}(1 + 1) = 1$. El multiplicador indica que exigir una unidad más de carga elevaría el costo en aproximadamente 1.
5. Gradiente proyectado con $\eta = 0.5$ desde $(-2, 3)$: la primera proyección lleva a $(-1.5, 3.5)$, sobre la recta, y los pasos siguientes se deslizan hacia $(1, 1)$, reduciendo la distancia a la mitad en cada paso.

:::figura[El reparto del ejemplo: el descenso proyectado sobre ½(x² + y²) se pega a la recta x + y = 2 y se desliza hasta (1, 1), donde el gradiente (1, 1) es perpendicular a la restricción.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [redonda]
restricciones:
  - a: [-1, -1]
    c: -2
    etiqueta: 'x + y \ge 2'
inicio: [-2, 3]
tasa: 0.5
```
:::

## Propiedades

- **Puntos fijos:** si $C$ es convexo, $\mathbf{x}^*$ es punto fijo del gradiente proyectado si y solo si cumple la condición de optimalidad $\nabla f(\mathbf{x}^*)^\top (\mathbf{x} - \mathbf{x}^*) \ge 0$ para todo $\mathbf{x} \in C$.
- **Proyecciones sencillas:** sobre cajas, $P_C$ recorta cada coordenada a su intervalo; sobre bolas, reescala el vector; sobre semiespacios, resta la componente que sobra.
- **Restricciones inactivas:** si el mínimo sin restricciones es factible, el método converge a él como el gradiente ordinario.
- **Penalización y barreras:** las penalizaciones permiten salirse un poco; las barreras logarítmicas, $-\sum_i \log(-g_i)$, mantienen la búsqueda en el interior y son la base de los métodos de punto interior.
- **Lagrangiano aumentado:** combina multiplicadores y penalización para no necesitar $\rho$ muy grande.

:::figura[Restricción inactiva: con x + y ≤ 2, el mínimo sin restricciones (0, 0) es factible y el descenso converge a él sin que la frontera intervenga.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [redonda]
restricciones:
  - a: [1, 1]
    c: 2
    etiqueta: 'x + y \le 2'
inicio: [2.5, -2.5]
tasa: 0.5
```
:::

## Errores comunes

- **Proyectar solo al final.** Optimizar sin restricciones y proyectar el resultado no da el óptimo cuando el objetivo no es redondo.
- **Suponer que siempre hay una sola restricción activa.** El óptimo puede estar en un vértice donde varias se activan a la vez.
- **Usar una penalización pequeña y creer que se cumplen las restricciones.** Con $\rho$ finito la solución viola un poco las restricciones.
- **Proyectar sobre un conjunto no convexo.** La proyección puede no ser única y el método pierde sus garantías.

:::figura[Un óptimo en un vértice: con x ≥ 1 y y ≥ 1, el mínimo de ½(x² + y²) es la esquina (1, 1), donde las dos restricciones son activas, cada una con multiplicador 1.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [redonda]
restricciones:
  - a: [-1, 0]
    c: -1
    etiqueta: 'x \ge 1'
  - a: [0, -1]
    c: -1
    etiqueta: 'y \ge 1'
inicio: [2.5, -2]
tasa: 0.5
```
:::

## Conexiones

Resuelve el [[problema-de-optimizacion]] con restricciones usando el [[descenso-de-gradiente]], la [[proyeccion-ortogonal]] sobre la región y las [[condiciones-de-karush-kuhn-tucker]]. Sus casos especiales son la [[programacion-lineal]] y la [[programacion-cuadratica]], y su teoría se completa con la [[dualidad-de-lagrange]]. Los [[metodos-proximales-y-gradiente-proximal]] generalizan la proyección a penalizaciones no suaves.

## Formulario

:::formula[Gradiente proyectado]
$$
\mathbf{x}_{k+1} = P_C\big(\mathbf{x}_k - \eta\,\nabla f(\mathbf{x}_k)\big)
$$

- $P_C$: proyección sobre la región factible $C$; $\eta$: tasa.
:::

:::formula[Proyección]
$$
P_C(\mathbf{z}) = \arg\min_{\mathbf{x} \in C} \lVert \mathbf{x} - \mathbf{z} \rVert
$$

- $\mathbf{z}$: punto que se proyecta.
:::

:::formula[Penalización cuadrática]
$$
f_\rho(\mathbf{x}) = f(\mathbf{x}) + \frac{\rho}{2}\sum_i \max\big(0,\ g_i(\mathbf{x})\big)^2
$$

- $\rho > 0$: peso de la penalización; $g_i \le 0$: restricciones.
:::

:::formula[Proyección sobre un semiespacio]
$$
P(\mathbf{z}) = \mathbf{z} - \frac{\max(0,\ \mathbf{a}^\top \mathbf{z} - c)}{\lVert \mathbf{a} \rVert^2}\,\mathbf{a}
$$

- Semiespacio $\{\mathbf{x} : \mathbf{a}^\top \mathbf{x} \le c\}$.
:::
