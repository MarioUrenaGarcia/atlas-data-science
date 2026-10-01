---
id: metodo-de-nelder-mead
titulo: Método de Nelder-Mead
titulo_en: Nelder-Mead method
alias:
  - simplex de Nelder-Mead
  - método del simplex descendente
  - downhill simplex
modulo: 0
submodulo: '0.6'
orden: 19
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
etiquetas:
  - sin derivadas
  - optimización local
  - reflexión
  - simplex
resumen: >
  Nelder-Mead minimiza sin derivadas moviendo un triángulo, o un simplex en n dimensiones: refleja el peor
  vértice a través de los demás y se expande, contrae o encoge según los valores que encuentra.
formula: '\mathbf{x}_r = \bar{\mathbf{x}} + (\bar{\mathbf{x}} - \mathbf{x}_{\text{peor}}), \qquad \bar{\mathbf{x}} = \frac{1}{n}\sum_{i \ne \text{peor}} \mathbf{x}_i'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: poblacion
    metodo: nelder-mead
    funciones: [himmelblau, rosenbrock]
    inicio: [-1, -1]
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Hay funciones que se pueden evaluar pero no derivar: el resultado de una simulación, el rendimiento de un proceso que se mide en el laboratorio, el error de un modelo que se ajusta con un programa externo. Para minimizarlas sin gradiente, Nelder-Mead usa un triángulo de puntos de prueba que se desplaza y cambia de forma, como una ameba que se arrastra cuesta abajo.

En cada paso se evalúan los vértices y se mira el peor. Lo natural es alejarse de él: se refleja a través del punto medio de los otros dos. Si el reflejo es muy bueno, el triángulo se estira en esa dirección, una expansión; si es malo, se queda a medio camino, una contracción; y si nada funciona, el triángulo entero se encoge hacia su mejor vértice. Con estas cuatro reglas el triángulo baja por los valles, se alarga para avanzar por terreno parejo y se hace pequeño cerca del mínimo. Es un método local: encuentra el mínimo del valle donde empieza, no necesariamente el global.

## Definición

En $\mathbb{R}^n$ se usa un simplex de $n + 1$ vértices; en el plano, un triángulo. En cada iteración se ordenan los vértices, $f(\mathbf{x}_1) \le \dots \le f(\mathbf{x}_{n+1})$, y se calcula el centroide de todos menos el peor, $\bar{\mathbf{x}} = \frac{1}{n}\sum_{i=1}^{n} \mathbf{x}_i$.

:::definicion[Iteración de Nelder-Mead]
Con $\mathbf{x}(c) = \bar{\mathbf{x}} + c\,(\bar{\mathbf{x}} - \mathbf{x}_{n+1})$:

1. **Reflexión** $\mathbf{x}_r = \mathbf{x}(1)$. Si $f(\mathbf{x}_1) \le f(\mathbf{x}_r) < f(\mathbf{x}_n)$, reemplaza al peor.
2. **Expansión:** si $f(\mathbf{x}_r) < f(\mathbf{x}_1)$, se prueba $\mathbf{x}_e = \mathbf{x}(2)$ y se queda el mejor de los dos.
3. **Contracción:** si $f(\mathbf{x}_r) \ge f(\mathbf{x}_n)$, se prueba $\mathbf{x}(\tfrac{1}{2})$, del lado del reflejo, o $\mathbf{x}(-\tfrac{1}{2})$, hacia el interior; si mejora, reemplaza al peor.
4. **Encogimiento:** si nada mejora, todos los vértices se acercan a la mitad de su distancia a $\mathbf{x}_1$.
:::

Se detiene cuando el simplex es muy pequeño o los valores de sus vértices casi coinciden.

:::nota[Qué significa cada símbolo]
- $n$: número de variables; el simplex tiene $n + 1$ vértices.
- $\mathbf{x}_1$, $\mathbf{x}_n$, $\mathbf{x}_{n+1}$: mejor, segundo peor y peor vértice.
- $\bar{\mathbf{x}}$: centroide de todos los vértices menos el peor.
- $c$: coeficiente del punto de prueba: 1 para la reflexión, 2 para la expansión y $\pm\tfrac{1}{2}$ para las contracciones.
- $\mathbf{x}_r$, $\mathbf{x}_e$: puntos reflejado y expandido.
:::

## Cómo usar la visualización

Las curvas de nivel son las de la función elegida y el triángulo azul es el simplex actual; los anteriores quedan como trazos tenues. El punto amarillo es el mejor vértice y los círculos negros, los mínimos globales. El encabezado nombra el movimiento de cada iteración, reflexión, expansión, contracción o encogimiento, junto con los valores del mejor y del peor vértice.

En Himmelblau, desde $(-1, -1)$, el triángulo se expande dos veces, avanza y se encoge hasta el mínimo $(-2.805, 3.131)$, uno de los cuatro. En Rosenbrock baja al valle curvo y lo recorre hasta $(1, 1)$. Conviene observar cómo el triángulo se alarga en las zonas parejas y se reduce cerca del mínimo.

## Ejemplo

Primer paso sobre $f(x, y) = \tfrac{1}{2}(x^2 + y^2)$ con el triángulo de vértices $(1, 1)$, $(2, 1)$ y $(1, 2.5)$.

1. Valores: $f(1, 1) = 1$, $f(2, 1) = 2.5$, $f(1, 2.5) = 3.625$. El peor es $(1, 2.5)$.
2. Centroide de los otros dos: $\bar{\mathbf{x}} = (1.5, 1)$.
3. Reflexión: $\mathbf{x}_r = (1.5, 1) + \big((1.5, 1) - (1, 2.5)\big) = (2, -0.5)$, con $f = \tfrac{1}{2}(4 + 0.25) = 2.125$.
4. Comparación: $2.125$ no mejora al mejor, que vale 1, pero sí al segundo, que vale 2.5. Se acepta la reflexión sin expandir.
5. Nuevo triángulo: $(1, 1)$, $(2, -0.5)$ y $(2, 1)$. El peor valor bajó de 3.625 a 2.5.

:::figura[El triángulo del ejemplo sobre ½(x² + y²): la primera iteración refleja el vértice (1, 2.5) a (2, -0.5) y las siguientes llevan el triángulo hacia el mínimo (0, 0).]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: nelder-mead
funciones: [redonda]
triangulo: [[1, 1], [2, 1], [1, 2.5]]
```
:::

## Propiedades

- **Sin derivadas:** solo usa comparaciones de valores de $f$; sirve con funciones ruidosas en grado moderado o no diferenciables.
- **Pocas evaluaciones por paso:** una o dos, salvo en el encogimiento, que necesita $n$ nuevas.
- **Invariante a transformaciones crecientes de $f$:** como solo compara valores, minimizar $f$ o $e^f$ da los mismos pasos.
- **Lento en valles curvos y en muchas dimensiones:** el simplex debe reorientarse una y otra vez; en dimensión alta suele ser mucho menos eficiente que los métodos con gradiente.
- **Sin garantía general de convergencia:** hay funciones convexas suaves en las que el simplex degenera y se detiene lejos del mínimo.

:::figura[Valle de Rosenbrock desde (-1.2, 1): tras 40 iteraciones el triángulo apenas va en (0.51, 0.25), con f = 0.249; en un valle largo y curvo debe reorientarse una y otra vez.]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: nelder-mead
funciones: [rosenbrock]
inicio: [-1.2, 1]
```
:::

## Errores comunes

- **Esperar el mínimo global.** Nelder-Mead es local: termina en el valle donde empezó.
- **Confundirlo con el método simplex de programación lineal.** Comparten la palabra simplex, pero uno recorre vértices de un poliedro y el otro mueve un triángulo de prueba.
- **Usarlo en problemas con muchas variables.** Con decenas de variables el simplex avanza muy despacio; ahí conviene un método con gradiente.
- **Empezar con un triángulo diminuto.** Un simplex inicial muy pequeño explora poco y puede quedarse en un mínimo local cercano.

:::figura[En la función de Rastrigin, con muchos mínimos locales, el triángulo que empieza en (2.2, 2.2) se queda en el hueco cercano (1.99, 1.99), con f = 7.96, lejos del mínimo global (0, 0).]{componente="OptimizerRace"}
```yaml
modo: poblacion
metodo: nelder-mead
funciones: [rastrigin]
inicio: [2.2, 2.2]
```
:::

## Conexiones

Resuelve el [[problema-de-optimizacion]] cuando no hay gradiente, a diferencia del [[descenso-de-gradiente]] y del [[metodo-de-newton]]. Como el [[descenso-por-coordenadas]], solo evalúa la función en puntos de prueba. Para buscar el mínimo global sin derivadas se usan [[recocido-simulado]], [[algoritmos-geneticos]] o [[optimizacion-por-enjambre-de-particulas]]. No debe confundirse con el [[metodo-simplex]] de la [[programacion-lineal]].

## Formulario

:::formula[Centroide]
$$
\bar{\mathbf{x}} = \frac{1}{n}\sum_{i=1}^{n} \mathbf{x}_i
$$

- $\mathbf{x}_1, \dots, \mathbf{x}_n$: todos los vértices menos el peor; $n$: número de variables.
:::

:::formula[Puntos de prueba]
$$
\mathbf{x}(c) = \bar{\mathbf{x}} + c\,(\bar{\mathbf{x}} - \mathbf{x}_{n+1})
$$

- $\mathbf{x}_{n+1}$: peor vértice; $c = 1$ reflexión, $c = 2$ expansión, $c = \pm\tfrac{1}{2}$ contracción.
:::

:::formula[Encogimiento]
$$
\mathbf{x}_i \leftarrow \mathbf{x}_1 + \tfrac{1}{2}(\mathbf{x}_i - \mathbf{x}_1), \qquad i = 2, \dots, n + 1
$$

- $\mathbf{x}_1$: mejor vértice, que se conserva.
:::
