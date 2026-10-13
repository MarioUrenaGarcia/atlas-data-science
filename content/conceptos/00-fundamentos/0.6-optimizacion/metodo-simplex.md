---
id: metodo-simplex
titulo: Método simplex
titulo_en: Simplex method
alias:
  - algoritmo simplex
  - pivoteo
  - tabla simplex
modulo: 0
submodulo: '0.6'
orden: 14
nivel: intermedio
prerrequisitos:
  - programacion-lineal
  - eliminacion-gaussiana
etiquetas:
  - simplex
  - programación lineal
  - pivote
  - vértices
resumen: >
  El método simplex resuelve un programa lineal recorriendo vértices adyacentes de la región factible, cada
  uno con mejor valor del objetivo, hasta que ningún vecino mejora.
formula: '\text{entra } j = \arg\min_j \bar{c}_j < 0, \qquad \text{sale } r = \arg\min_{i : a_{ij} > 0} \frac{b_i}{a_{ij}}'
visualizacion:
  componente: OptimizerRace
  parametros:
    modo: lineal
    metodo: simplex
    c: [2, 3]
    a: [[1, 1], [1, 3], [2, 1]]
    b: [4, 7.5, 7]
referencias:
  - clave: boyd
publicado: true
---

## Intuición

El óptimo de un programa lineal está en un vértice, pero con cientos de variables hay más vértices que átomos en el universo, y revisarlos todos es imposible. El método simplex propone algo más astuto: empezar en un vértice, mirar las aristas que salen de él y caminar por una que mejore el objetivo hasta el siguiente vértice. Se repite hasta llegar a un vértice donde ninguna arista mejora; por convexidad, ese es el óptimo.

Algebraicamente, cada vértice corresponde a elegir qué variables valen cero y cuáles se despejan de las restricciones, las básicas. Pasar a un vértice vecino es intercambiar una variable básica por una que no lo era, un pivote, igual que en la eliminación gaussiana. Las reglas para elegir quién entra y quién sale garantizan que el objetivo mejore y que nunca se salga de la región. En la práctica el simplex visita muy pocos vértices y sigue siendo uno de los algoritmos más usados en la industria.

## Definición

Se parte de $\max \mathbf{c}^\top \mathbf{x}$ con $\mathbf{A}\mathbf{x} + \mathbf{s} = \mathbf{b}$, $\mathbf{x}, \mathbf{s} \ge \mathbf{0}$ y $\mathbf{b} \ge \mathbf{0}$, de modo que $\mathbf{x} = \mathbf{0}$, $\mathbf{s} = \mathbf{b}$ es un vértice inicial.

:::definicion[Iteración del simplex]
1. **Costos reducidos:** $\bar{c}_j$ mide cuánto cambia el objetivo, con signo invertido, al aumentar la variable no básica $j$. Si todos los $\bar{c}_j \ge 0$, el vértice actual es óptimo.
2. **Variable que entra:** una $j$ con $\bar{c}_j < 0$; la regla de Dantzig toma el más negativo.
3. **Prueba del cociente mínimo:** la variable básica que sale es la de la fila $r$ que minimiza $b_i/a_{ij}$ entre las filas con $a_{ij} > 0$. Si no hay ninguna, el problema es no acotado.
4. **Pivote:** se divide la fila $r$ entre $a_{rj}$ y se elimina la columna $j$ de las demás filas y del renglón del objetivo.
:::

Al terminar, los costos reducidos de las variables de holgura son los valores duales, los precios sombra de cada restricción.

:::nota[Qué significa cada símbolo]
- $\mathbf{s}$: variables de holgura; junto con $\mathbf{x}$ forman todas las variables.
- Variables básicas: las que se despejan en el vértice actual; las no básicas valen cero.
- $\bar{c}_j$: costo reducido de la variable $j$ en el renglón del objetivo.
- $a_{ij}$: coeficiente de la variable $j$ en la fila $i$ de la tabla actual.
- $b_i$: lado derecho de la fila $i$, el valor de su variable básica.
- $r$: fila del pivote; $j$: columna del pivote.
:::

## Cómo usar la visualización

El polígono es la región factible del programa. La reproducción da un pivote por paso: el punto amarillo pasa de un vértice al siguiente y deja un camino negro por las aristas. El encabezado indica en cada paso el vértice, el valor $z$ y qué variable entra y cuál sale; el panel lista las variables básicas. Al final se marca el óptimo y se muestran los precios sombra.

En el programa de la vista, $\max 2x + 3y$, el simplex sale del origen, sube por el eje $y$ hasta $(0, 2.5)$ con $z = 7.5$ y luego avanza por una arista hasta $(2.25, 1.75)$, con $z = 9.75$: dos pivotes.

## Ejemplo

El taller de mesas y sillas: $\max\ 3x + 5y$ con $x \le 4$, $2y \le 12$, $3x + 2y \le 18$.

1. Vértice inicial: $x = y = 0$ y holguras $s_1 = 4$, $s_2 = 12$, $s_3 = 18$; $z = 0$. Costos reducidos: $-3$ para $x$ y $-5$ para $y$.
2. Entra $y$, el más negativo. Cocientes: fila 2, $12/2 = 6$; fila 3, $18/2 = 9$; la fila 1 no tiene $y$. Sale $s_2$.
3. Nuevo vértice: $(0, 6)$ con $z = 30$. El costo reducido de $x$ sigue siendo $-3$.
4. Entra $x$. Cocientes: fila 1, $4/1 = 4$; fila 3, $(18 - 12)/3 = 2$. Sale $s_3$.
5. Vértice $(2, 6)$ con $z = 36$. Ningún costo reducido es negativo: es el óptimo.
6. Precios sombra: $0$ para la máquina A, a la que le sobran horas, $1.5$ para la B y $1$ para la C. Comprobación: $4 \cdot 0 + 12 \cdot 1.5 + 18 \cdot 1 = 36$.

:::figura[El simplex del ejemplo: del origen a (0, 6) con z = 30 al entrar y, y de ahí a (2, 6) con z = 36 al entrar x; los precios sombra finales son 0, 1.5 y 1.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: simplex
c: [3, 5]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Propiedades

- **Monotonía:** cada pivote no empeora el objetivo; si mejora estrictamente, nunca se repite un vértice.
- **Terminación:** con una regla que evite ciclos, como la de Bland, el simplex termina en un número finito de pivotes.
- **Peor caso y caso típico:** hay ejemplos que obligan a visitar un número exponencial de vértices, pero en la práctica el número de pivotes suele ser proporcional al número de restricciones.
- **Precios sombra:** los costos reducidos finales de las holguras resuelven el problema dual.
- **Fase I:** si el origen no es factible, primero se resuelve un problema auxiliar que encuentra un vértice inicial.

:::figura[Con ganancias x + 0.2y, el simplex entra por el eje x hasta (4, 0) con z = 4 y luego sube por la arista hasta (4, 3) con z = 4.6: otro camino por los vértices según la dirección del objetivo.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: simplex
c: [1, 0.2]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Errores comunes

- **Elegir la fila que sale sin la prueba del cociente.** Cualquier otra fila lleva a un punto con alguna variable negativa, fuera de la región.
- **Detenerse al primer costo reducido positivo.** El vértice es óptimo solo cuando ninguno es negativo.
- **Pensar que el simplex se mueve por el interior.** Siempre va de vértice en vértice por las aristas; los métodos de punto interior son otra familia.
- **Creer que siempre recorre muchos vértices.** A veces basta un pivote, como en el caso de la figura.

:::figura[Con objetivo y - x, el simplex hace un solo pivote: sube por el eje y hasta (0, 6) con z = 6 y se detiene, porque aumentar x solo empeora el objetivo.]{componente="OptimizerRace"}
```yaml
modo: lineal
metodo: simplex
c: [-1, 1]
a: [[1, 0], [0, 2], [3, 2]]
b: [4, 12, 18]
```
:::

## Conexiones

Resuelve la [[programacion-lineal]] con pivotes como los de la [[eliminacion-gaussiana]], cuyos sistemas se escriben como [[sistemas-de-ecuaciones-lineales]]. Los precios sombra que entrega son la solución de la [[dualidad-de-lagrange]] del programa. Las variables básicas de cada vértice determinan una submatriz invertible, como en [[matriz-identidad-y-matriz-inversa]].

## Formulario

:::formula[Variable que entra]
$$
j = \arg\min_{j} \bar{c}_j, \qquad \bar{c}_j < 0
$$

- $\bar{c}_j$: costo reducido de la variable no básica $j$.
:::

:::formula[Prueba del cociente mínimo]
$$
r = \arg\min_{i : a_{ij} > 0} \frac{b_i}{a_{ij}}
$$

- $a_{ij}$: coeficiente de la columna que entra; $b_i$: lado derecho.
:::

:::formula[Criterio de optimalidad]
$$
\bar{c}_j \ge 0 \ \text{para toda variable no básica } j
$$

- Ninguna arista mejora el objetivo.
:::

:::formula[Igualdad de valores primal y dual]
$$
\mathbf{c}^\top \mathbf{x}^* = \mathbf{b}^\top \mathbf{y}^*
$$

- $\mathbf{x}^*$: solución óptima; $\mathbf{y}^*$: precios sombra.
:::
