---
id: problema-de-optimizacion
titulo: Problema de optimización (objetivo, variables, restricciones)
titulo_en: Optimization problem
alias:
  - problema de optimización
  - función objetivo
  - región factible
  - programa matemático
modulo: 0
submodulo: '0.6'
orden: 1
nivel: intermedio
prerrequisitos:
  - funciones-de-varias-variables
etiquetas:
  - optimización
  - función objetivo
  - restricciones
  - región factible
resumen: >
  Un problema de optimización pide el valor de las variables que hace mínima (o máxima) una función objetivo
  entre los puntos que cumplen las restricciones, llamados puntos factibles.
formula: '\min_{\mathbf{x} \in \mathbb{R}^n} f(\mathbf{x}) \quad \text{sujeto a} \quad g_i(\mathbf{x}) \le 0,\ h_j(\mathbf{x}) = 0'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: restricciones
    funciones: [girada]
    restricciones:
      - a: [1, 0]
        c: 0.5
        etiqueta: 'x \le 0.5'
      - a: [-1, -1]
        c: 0
        etiqueta: 'x + y \ge 0'
    inicio: [-2, 2]
    tasa: 0.15
referencias:
  - clave: boyd
    capitulo: '1'
publicado: true
---

## Intuición

Elegir la ruta más corta, la mezcla de alimento más barata que cubre los nutrientes de un hato o los parámetros de un modelo que menos se equivocan son problemas con la misma estructura. Hay algo que se puede decidir, las variables; una medida de qué tan buena es cada decisión, la función objetivo; y reglas que la decisión debe respetar, las restricciones. Resolver el problema es encontrar, entre todas las decisiones permitidas, la que da el mejor valor del objetivo.

Escribir un problema así obliga a separar lo que se controla de lo que está dado y a decir con precisión qué significa "mejor". También revela su dificultad: si el objetivo y las restricciones son sencillos, como funciones lineales o cuadráticas convexas, hay algoritmos que garantizan el óptimo; si no, puede haber muchos óptimos locales y ninguna garantía. Casi todo el aprendizaje automático es, en el fondo, un problema de optimización: elegir parámetros que minimicen una pérdida, a veces con restricciones o penalizaciones.

## Definición

:::definicion[Problema de optimización]
Un problema de optimización en forma estándar es
$$
\min_{\mathbf{x} \in \mathbb{R}^n} f(\mathbf{x}) \quad \text{sujeto a} \quad g_i(\mathbf{x}) \le 0,\ i = 1, \dots, m, \qquad h_j(\mathbf{x}) = 0,\ j = 1, \dots, p.
$$
El conjunto $C = \{\mathbf{x} : g_i(\mathbf{x}) \le 0,\ h_j(\mathbf{x}) = 0\}$ es la **región factible**. Un punto $\mathbf{x}^* \in C$ es un **mínimo global** si $f(\mathbf{x}^*) \le f(\mathbf{x})$ para todo $\mathbf{x} \in C$, y un **mínimo local** si lo es para los $\mathbf{x} \in C$ cercanos. El número $p^* = f(\mathbf{x}^*)$ es el **valor óptimo**.
:::

Maximizar $f$ equivale a minimizar $-f$. Si $C$ es vacío el problema es **infactible**; si $f$ toma valores arbitrariamente negativos en $C$, es **no acotado** y no tiene mínimo. Una restricción con $g_i(\mathbf{x}^*) = 0$ en el óptimo es **activa**; las demás no influyen en dónde está el óptimo.

:::nota[Qué significa cada símbolo]
- $\mathbf{x} = (x_1, \dots, x_n)$: variables de decisión.
- $f$: función objetivo, el costo o la pérdida que se minimiza.
- $g_i$: funciones de las restricciones de desigualdad, $g_i(\mathbf{x}) \le 0$; $m$ es su número.
- $h_j$: funciones de las restricciones de igualdad; $p$ es su número.
- $C$: región factible, los puntos que cumplen todas las restricciones.
- $\mathbf{x}^*$: punto óptimo; $p^* = f(\mathbf{x}^*)$: valor óptimo.
:::

## Cómo usar la visualización

El mapa muestra las curvas de nivel de la función objetivo, la región factible sombreada y el mínimo sin restricciones como un círculo vacío. Un método sencillo, el descenso de gradiente proyectado, busca el óptimo: da un paso en la dirección de máximo descenso, en naranja, y si sale de la región regresa al punto factible más cercano, en amarillo. El encabezado escribe ese paso con números y el panel indica qué restricciones están activas.

Desde el punto inicial, los pasos caen fuera de la región y se proyectan sobre la frontera. El camino se detiene en la esquina donde se cruzan las dos restricciones, no en el mínimo sin restricciones, que queda fuera. Al mover el punto inicial, el camino cambia pero llega al mismo óptimo.

## Ejemplo

Un modelo tiene dos parámetros $x$ y $y$ y su pérdida es $f(x, y) = \tfrac{1}{2}(3x^2 + 4xy + 3y^2) - x + y$. Por razones físicas, $x \le 0.5$ y $x + y \ge 0$.

1. Variables: $(x, y)$. Objetivo: $f$. Restricciones: $g_1 = x - 0.5 \le 0$ y $g_2 = -x - y \le 0$.
2. Sin restricciones, el gradiente $\nabla f = (3x + 2y - 1,\ 2x + 3y + 1)$ se anula en $(1, -1)$, con $f = -1$; pero $x = 1 > 0.5$, así que ese punto no es factible.
3. La solución del problema con restricciones es $(0.5, -0.5)$, donde ambas restricciones son activas: $x = 0.5$ y $x + y = 0$.
4. Ahí $\nabla f = (1.5 - 1 - 1,\ 1 - 1.5 + 1) = (-0.5, 0.5)$, y se equilibra con las restricciones: $\nabla f + 1 \cdot (1, 0) + 0.5 \cdot (-1, -1) = \mathbf{0}$, con multiplicadores $1$ y $0.5$, ambos no negativos.
5. Valor óptimo: $p^* = \tfrac{1}{2}(0.75 - 1 + 0.75) - 0.5 - 0.5 = -0.75$, mayor que el $-1$ sin restricciones, como debe ser al restringir.

:::figura[El problema del ejemplo: el mínimo sin restricciones, en (1, -1), queda fuera de la región, y el descenso proyectado termina en la esquina (0.5, -0.5), con valor -0.75 y las dos restricciones activas.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [girada]
restricciones:
  - a: [1, 0]
    c: 0.5
    etiqueta: 'x \le 0.5'
  - a: [-1, -1]
    c: 0
    etiqueta: 'x + y \ge 0'
inicio: [-2.5, -2]
tasa: 0.15
```
:::

## Propiedades

- **Equivalencias:** $\max f = -\min(-f)$; una igualdad $h = 0$ equivale a dos desigualdades $h \le 0$ y $-h \le 0$.
- **Restricciones inactivas:** si el mínimo sin restricciones es factible, es también la solución del problema con restricciones.
- **Monotonía:** agregar restricciones nunca mejora el valor óptimo de una minimización: $p^*$ sube o se queda igual.
- **Existencia:** si $f$ es continua y $C$ es cerrado y acotado y no vacío, el mínimo existe.
- **Tipos:** lineal si $f$ y las restricciones son lineales; cuadrático si $f$ es cuadrática y las restricciones lineales; convexo si $f$ y las $g_i$ son convexas y las $h_j$ afines.

:::figura[Caso de restricción inactiva: con x ≤ 2, el mínimo sin restricciones (1, -1) ya es factible, el descenso nunca toca la frontera y la restricción no cambia la solución.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [girada]
restricciones:
  - a: [1, 0]
    c: 2
    etiqueta: 'x \le 2'
inicio: [-2, 2]
tasa: 0.15
```
:::

## Errores comunes

- **Resolver sin restricciones y luego "recortar".** El punto factible más cercano al mínimo sin restricciones no es, en general, el óptimo del problema con restricciones.
- **Confundir variables con parámetros.** Los datos del problema, como los coeficientes de $f$, son fijos; solo las variables de decisión se eligen.
- **Olvidar la existencia.** Minimizar $e^{x}$ en $\mathbb{R}$ no tiene solución: el valor se acerca a 0 sin alcanzarlo.
- **Tomar un mínimo local por el global.** Un algoritmo local se detiene en el primer valle que encuentra.

:::figura[Recortar no es optimizar: con la restricción y ≥ 0, el punto factible más cercano a (1, -1) es (1, 0), con f = 0.5, pero el óptimo es (0.33, 0), con f = -0.17, porque el objetivo no es redondo.]{componente="OptimizerRace"}
```yaml
modo: restricciones
funciones: [girada]
restricciones:
  - a: [0, -1]
    c: 0
    etiqueta: 'y \ge 0'
inicio: [2, 2]
tasa: 0.15
```
:::

## Conexiones

Las funciones objetivo son [[funciones-de-varias-variables]]. Los óptimos interiores son [[puntos-criticos-y-puntos-silla]] y se caracterizan con las [[condiciones-de-optimalidad-de-primer-y-segundo-orden]]; los que están en la frontera, con [[multiplicadores-de-lagrange]] y [[condiciones-de-karush-kuhn-tucker]]. Cuando la región es un [[conjuntos-convexos|conjunto convexo]] y el objetivo es convexo, el problema es de [[optimizacion-convexa]] y todo mínimo local es global. Los algoritmos para resolverlo empiezan con el [[descenso-de-gradiente]].

## Formulario

:::formula[Forma estándar]
$$
\min_{\mathbf{x}} f(\mathbf{x}) \quad \text{s. a.} \quad g_i(\mathbf{x}) \le 0,\ h_j(\mathbf{x}) = 0
$$

- $\mathbf{x}$: variables; $f$: objetivo.
- $g_i \le 0$: restricciones de desigualdad; $h_j = 0$: de igualdad.
:::

:::formula[Región factible]
$$
C = \{\mathbf{x} : g_i(\mathbf{x}) \le 0,\ h_j(\mathbf{x}) = 0 \ \text{para todo } i, j\}
$$

- $C$: puntos que cumplen todas las restricciones.
:::

:::formula[Valor óptimo]
$$
p^* = \inf_{\mathbf{x} \in C} f(\mathbf{x})
$$

- $p^*$: mejor valor alcanzable; $\inf$ es el ínfimo, que coincide con el mínimo cuando este existe.
:::

:::formula[Maximizar como minimizar]
$$
\max_{\mathbf{x} \in C} f(\mathbf{x}) = -\min_{\mathbf{x} \in C} \big(-f(\mathbf{x})\big)
$$

- El maximizador de $f$ es el minimizador de $-f$.
:::
