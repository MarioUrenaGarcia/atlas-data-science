---
id: condiciones-de-optimalidad-de-primer-y-segundo-orden
titulo: Condiciones de optimalidad de primer y segundo orden
titulo_en: First- and second-order optimality conditions
alias:
  - condición necesaria de primer orden
  - condición suficiente de segundo orden
  - punto estacionario
modulo: 0
submodulo: '0.6'
orden: 2
nivel: intermedio
prerrequisitos:
  - problema-de-optimizacion
  - puntos-criticos-y-puntos-silla
etiquetas:
  - optimalidad
  - gradiente
  - hessiana
  - mínimo local
resumen: >
  En un mínimo local interior el gradiente se anula y la hessiana es semidefinida positiva; si el gradiente
  se anula y la hessiana es definida positiva, el punto es un mínimo local estricto.
formula: '\nabla f(\mathbf{x}^*) = \mathbf{0},\quad \mathbf{H}_f(\mathbf{x}^*) \succeq 0 \ \text{(necesarias)};\qquad \nabla f(\mathbf{x}^*) = \mathbf{0},\quad \mathbf{H}_f(\mathbf{x}^*) \succ 0 \ \text{(suficientes)}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: criticos
    campos: [himmelblau, silla-mono, ondas]
referencias:
  - clave: boyd
    capitulo: '9.1'
  - clave: goodfellow
    capitulo: '4.3'
publicado: true
---

## Intuición

Para saber si se está en el fondo de un valle hay dos preguntas. La primera es si el suelo es plano bajo los pies: si hubiera pendiente en alguna dirección, bastaría dar un paso en la dirección de bajada para descender, y el punto no sería un mínimo. La segunda es si el suelo se curva hacia arriba en todas las direcciones, como el fondo de un tazón: si se curvara hacia abajo en alguna, sería un paso de montaña, no un fondo.

Las condiciones de optimalidad convierten esas preguntas en pruebas sobre derivadas. La de primer orden pide que el gradiente sea cero. La de segundo orden mira la hessiana: si es definida positiva, el punto es un mínimo local estricto; si tiene una curvatura negativa, no es un mínimo. Entre ambas queda un caso que las derivadas de segundo orden no deciden, cuando alguna curvatura es exactamente cero. Estas condiciones son la base de los criterios de parada de los algoritmos y del análisis de cualquier problema sin restricciones.

## Definición

Sea $f$ con segundas derivadas continuas cerca de un punto interior $\mathbf{x}^*$ de su dominio.

:::teorema[Condiciones necesarias]
Si $\mathbf{x}^*$ es un mínimo local, entonces $\nabla f(\mathbf{x}^*) = \mathbf{0}$ (primer orden) y $\mathbf{H}_f(\mathbf{x}^*)$ es semidefinida positiva (segundo orden).
:::

:::teorema[Condiciones suficientes]
Si $\nabla f(\mathbf{x}^*) = \mathbf{0}$ y $\mathbf{H}_f(\mathbf{x}^*)$ es definida positiva, entonces $\mathbf{x}^*$ es un mínimo local estricto: $f(\mathbf{x}) > f(\mathbf{x}^*)$ para todo $\mathbf{x} \neq \mathbf{x}^*$ cercano.
:::

La razón está en la aproximación de Taylor: cerca de un punto con gradiente cero, $f(\mathbf{x}^* + \mathbf{h}) \approx f(\mathbf{x}^*) + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f(\mathbf{x}^*)\,\mathbf{h}$, y el signo de esa forma cuadrática decide.

:::nota[Qué significa cada símbolo]
- $f$: función objetivo.
- $\mathbf{x}^*$: punto candidato, interior al dominio.
- $\nabla f(\mathbf{x}^*)$: gradiente en el punto.
- $\mathbf{H}_f(\mathbf{x}^*)$: hessiana en el punto.
- $\succeq 0$: semidefinida positiva, todos los valores propios $\ge 0$.
- $\succ 0$: definida positiva, todos los valores propios $> 0$.
- $\mathbf{h}$: desplazamiento pequeño desde $\mathbf{x}^*$.
:::

## Cómo usar la visualización

La función de Himmelblau aparece con sus curvas de nivel y su superficie. Los puntos donde el gradiente se anula, encontrados numéricamente, se marcan por tipo: verde los mínimos, naranja los máximos y amarillo las sillas. La reproducción visita cada uno y el encabezado escribe su hessiana, sus valores propios y la conclusión de la prueba de segundo orden. El selector cambia la función.

Himmelblau tiene nueve puntos donde se cumple la condición de primer orden, pero solo cuatro son mínimos. Con la silla de mono $x^3 - 3xy^2$, el único punto crítico tiene hessiana cero y la prueba no decide: es un caso degenerado.

## Ejemplo

La función de Himmelblau, $f(x, y) = (x^2 + y - 11)^2 + (x + y^2 - 7)^2$, se usa para probar métodos de optimización. Se verifica que $(3, 2)$ es un mínimo local.

1. Gradiente: $f_x = 4x(x^2 + y - 11) + 2(x + y^2 - 7)$ y $f_y = 2(x^2 + y - 11) + 4y(x + y^2 - 7)$.
2. En $(3, 2)$: $x^2 + y - 11 = 0$ y $x + y^2 - 7 = 0$, así que $\nabla f(3, 2) = (0, 0)$. Se cumple la condición de primer orden.
3. Hessiana: $f_{xx} = 12x^2 + 4y - 42 = 74$, $f_{xy} = 4x + 4y = 20$, $f_{yy} = 4x + 12y^2 - 26 = 34$.
4. $\mathbf{H} = \begin{pmatrix} 74 & 20 \\ 20 & 34 \end{pmatrix}$, con determinante $2516 - 400 = 2116 > 0$ y traza $108 > 0$: valores propios $82.28$ y $25.72$, ambos positivos.
5. La condición suficiente se cumple: $(3, 2)$ es un mínimo local estricto. Como $f \ge 0$ y $f(3, 2) = 0$, además es global.
6. En cambio, en $(0, 0)$: $\nabla f = (-14, -22) \neq \mathbf{0}$, así que el origen no es candidato.

:::figura[El mínimo (3, 2) de Himmelblau del ejemplo: la hessiana tiene valores propios 82.28 y 25.72, y al girar la línea la curvatura uᵀHu siempre es positiva, entre esos dos valores.]{componente="SurfaceViz"}
```yaml
modo: hessiana
campos: [himmelblau]
punto: [3, 2]
```
:::

## Propiedades

- **Derivada direccional nula:** en un punto con gradiente cero, la derivada en cualquier dirección es 0.
- **Máximos:** las mismas pruebas con la desigualdad invertida: $\nabla f = \mathbf{0}$ y $\mathbf{H}_f \prec 0$ bastan para un máximo local estricto.
- **Funciones convexas:** si $f$ es convexa y diferenciable, $\nabla f(\mathbf{x}^*) = \mathbf{0}$ basta para un mínimo global.
- **Criterio de parada:** los algoritmos se detienen cuando $\lVert \nabla f(\mathbf{x}_k) \rVert$ es menor que una tolerancia, una versión aproximada de la condición de primer orden.
- **Con restricciones:** en la frontera de la región factible el gradiente no tiene que anularse y las condiciones se reemplazan por las de Karush-Kuhn-Tucker.

:::figura[En el mínimo (3, 2) de Himmelblau la derivada direccional vale 0 en todas las direcciones: la onda coseno se aplana a una recta horizontal, porque el gradiente es cero.]{componente="SurfaceViz"}
```yaml
modo: direccional
campos: [himmelblau]
punto: [3, 2]
```
:::

## Errores comunes

- **Tomar el gradiente cero como prueba de mínimo.** Es necesario, no suficiente: máximos y sillas también lo cumplen.
- **Concluir que no es mínimo porque la hessiana no es definida positiva.** Con hessiana semidefinida, como en $x^4 + y^4$ en el origen, el punto puede ser un mínimo; la prueba de segundo orden simplemente no decide.
- **Revisar solo la diagonal de la hessiana.** La definida positividad depende de los valores propios, no solo de los elementos diagonales.
- **Aplicar las condiciones en la frontera.** En un problema con restricciones, el óptimo puede estar en el borde con gradiente distinto de cero.

:::figura[La silla de mono x³ - 3xy² tiene gradiente cero y hessiana cero en el origen: se cumplen las condiciones necesarias de segundo orden y aun así el punto no es mínimo, porque la función baja en tres direcciones.]{componente="SurfaceViz"}
```yaml
modo: criticos
campos: [silla-mono]
```
:::

## Conexiones

Formalizan la clasificación de [[puntos-criticos-y-puntos-silla]] dentro de un [[problema-de-optimizacion]], con el [[gradiente]] y la [[matriz-hessiana]]. En [[optimizacion-convexa]] la condición de primer orden basta. El [[metodo-de-newton]] busca directamente los puntos donde se anula el gradiente, y el [[descenso-de-gradiente]] usa su norma como criterio de parada. Con restricciones se extienden a las [[condiciones-de-karush-kuhn-tucker]].

## Formulario

:::formula[Condición de primer orden]
$$
\nabla f(\mathbf{x}^*) = \mathbf{0}
$$

- $\mathbf{x}^*$: mínimo local interior; $\nabla f$: gradiente.
:::

:::formula[Condición necesaria de segundo orden]
$$
\mathbf{H}_f(\mathbf{x}^*) \succeq 0
$$

- $\mathbf{H}_f$: hessiana; $\succeq 0$: semidefinida positiva.
:::

:::formula[Condición suficiente de segundo orden]
$$
\nabla f(\mathbf{x}^*) = \mathbf{0},\quad \mathbf{H}_f(\mathbf{x}^*) \succ 0 \ \Rightarrow\ \mathbf{x}^* \text{ es mínimo local estricto}
$$

- $\succ 0$: definida positiva.
:::

:::formula[Aproximación cuadrática en un punto estacionario]
$$
f(\mathbf{x}^* + \mathbf{h}) \approx f(\mathbf{x}^*) + \tfrac{1}{2}\mathbf{h}^\top \mathbf{H}_f(\mathbf{x}^*)\,\mathbf{h}
$$

- $\mathbf{h}$: desplazamiento pequeño.
:::
