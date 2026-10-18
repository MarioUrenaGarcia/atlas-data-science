---
id: metodos-iterativos-para-sistemas-lineales
titulo: Métodos iterativos para sistemas lineales (Jacobi, Gauss-Seidel)
titulo_en: Iterative methods for linear systems (Jacobi, Gauss-Seidel)
alias:
  - método de Jacobi
  - método de Gauss-Seidel
  - iteración de punto fijo para sistemas
modulo: 0
submodulo: '0.7'
orden: 15
nivel: intermedio
prerrequisitos:
  - sistemas-de-ecuaciones-lineales
  - valores-y-vectores-propios
etiquetas:
  - sistemas lineales
  - iteración
  - radio espectral
  - diagonal dominante
resumen: >
  Jacobi y Gauss-Seidel resuelven A x = b despejando cada incógnita de su ecuación y repitiendo; convergen
  si el radio espectral de la matriz de iteración es menor que 1, por ejemplo con diagonal dominante.
formula: 'x_i^{(k+1)} = \frac{1}{a_{ii}}\Big(b_i - \sum_{j \ne i} a_{ij}\,x_j^{(k)}\Big)'
visualizacion:
  componente: NumericsLab
  parametros:
    modo: iterativo
    matriz: [[4, 1], [2, 5]]
    b: [9, 13]
    inicio: [-2, 4]
    metodos: [jacobi, gauss-seidel]
referencias:
  - clave: strang
publicado: true
---

## Intuición

En un sistema grande, cada ecuación suele involucrar pocas incógnitas: la temperatura de un punto de una placa depende de la de sus vecinos, el precio de un producto de unos cuantos insumos. Una manera natural de resolverlo es por aproximaciones: se propone un valor para todas las incógnitas, se despeja cada una de su propia ecuación usando los valores propuestos para las demás y se repite. Si el sistema está dominado por la diagonal, es decir, si cada incógnita pesa en su ecuación más que todas las demás juntas, las correcciones se hacen cada vez más pequeñas y el proceso converge.

El método de Jacobi actualiza todas las incógnitas a la vez con los valores de la ronda anterior. Gauss-Seidel usa cada valor nuevo en cuanto lo calcula, lo que suele acelerar la convergencia y no requiere guardar dos copias del vector. A diferencia de la eliminación gaussiana, estos métodos solo multiplican por la matriz, así que aprovechan que la mayoría de sus entradas son cero y caben en memoria aunque el sistema tenga millones de incógnitas.

## Definición

Se escribe $\mathbf{A} = \mathbf{D} + \mathbf{L} + \mathbf{U}$, con $\mathbf{D}$ la diagonal y $\mathbf{L}$, $\mathbf{U}$ las partes estrictamente inferior y superior.

:::definicion[Métodos de Jacobi y de Gauss-Seidel]
- **Jacobi:** $x_i^{(k+1)} = \dfrac{1}{a_{ii}}\Big(b_i - \sum_{j \ne i} a_{ij}\,x_j^{(k)}\Big)$, es decir, $\mathbf{x}^{(k+1)} = \mathbf{D}^{-1}\big(\mathbf{b} - (\mathbf{L} + \mathbf{U})\mathbf{x}^{(k)}\big)$.
- **Gauss-Seidel:** $x_i^{(k+1)} = \dfrac{1}{a_{ii}}\Big(b_i - \sum_{j < i} a_{ij}\,x_j^{(k+1)} - \sum_{j > i} a_{ij}\,x_j^{(k)}\Big)$, es decir, $\mathbf{x}^{(k+1)} = (\mathbf{D} + \mathbf{L})^{-1}\big(\mathbf{b} - \mathbf{U}\mathbf{x}^{(k)}\big)$.
:::

:::teorema[Convergencia]
Cada método es de la forma $\mathbf{x}^{(k+1)} = \mathbf{G}\mathbf{x}^{(k)} + \mathbf{c}$ y converge desde cualquier punto inicial si y solo si el radio espectral $\rho(\mathbf{G})$, el mayor valor absoluto de sus valores propios, es menor que 1. El error se multiplica aproximadamente por $\rho(\mathbf{G})$ en cada iteración. Si $\mathbf{A}$ es estrictamente diagonal dominante, $|a_{ii}| > \sum_{j \ne i}|a_{ij}|$, ambos métodos convergen.
:::

:::nota[Qué significa cada símbolo]
- $\mathbf{A}$: matriz del sistema, con entradas $a_{ij}$; $\mathbf{b}$: lado derecho, con entradas $b_i$.
- $\mathbf{x}^{(k)}$: aproximación en la iteración $k$; $x_i^{(k)}$: su componente $i$.
- $\mathbf{D}$, $\mathbf{L}$, $\mathbf{U}$: partes diagonal, inferior y superior de $\mathbf{A}$.
- $\mathbf{G}$: matriz de iteración; $\mathbf{c}$: vector constante del método.
- $\rho(\mathbf{G})$: radio espectral.
:::

## Cómo usar la visualización

Las dos rectas grises son las ecuaciones del sistema y su cruce es la solución. Los caminos de colores son las iteraciones de Jacobi y de Gauss-Seidel desde el mismo punto inicial. La reproducción agrega una iteración por cuadro y el encabezado escribe el punto actual de cada método; las lecturas dan el error y el radio espectral de cada uno.

En el sistema $4x + y = 9$, $2x + 5y = 13$, los radios son $0.316$ para Jacobi y $0.1$ para Gauss-Seidel: tras 13 iteraciones el error de Jacobi es $1.6 \times 10^{-6}$ y el de Gauss-Seidel $5.7 \times 10^{-13}$.

## Ejemplo

Se resuelve $4x + y = 9$, $2x + 5y = 13$, cuya solución es $(16/9, 17/9) = (1.7778, 1.8889)$, desde $(0, 0)$.

1. Jacobi: $x = (9 - y)/4$ y $y = (13 - 2x)/5$ con los valores anteriores. Primera iteración: $(2.25, 2.6)$.
2. Segunda: $x = (9 - 2.6)/4 = 1.6$ y $y = (13 - 4.5)/5 = 1.7$. Tercera: $(1.825, 1.96)$.
3. Gauss-Seidel: $x = 9/4 = 2.25$ y, con ese $x$ nuevo, $y = (13 - 4.5)/5 = 1.7$. Segunda: $(1.825, 1.87)$. Tercera: $(1.7825, 1.887)$.
4. Tras tres iteraciones el error de Gauss-Seidel es $0.005$ y el de Jacobi $0.08$.
5. La matriz es diagonal dominante, $4 > 1$ y $5 > 2$, así que la convergencia estaba garantizada.

:::figura[Jacobi desde $(0, 0)$ en el sistema del ejemplo: los puntos $(2.25, 2.6)$, $(1.6, 1.7)$ y $(1.825, 1.96)$ rodean la solución y se acercan a ella reduciendo el error a cerca de un tercio por iteración.]{componente="NumericsLab"}
```yaml
modo: iterativo
matriz: [[4, 1], [2, 5]]
b: [9, 13]
inicio: [0, 0]
metodos: [jacobi]
```
:::

## Propiedades

- **Gauss-Seidel en sistemas de 2 por 2:** su radio espectral es el cuadrado del de Jacobi, así que una iteración de Gauss-Seidel vale por dos de Jacobi.

:::figura[$3x + y = 5$, $x + 3y = 7$ con los dos métodos: los radios son $1/3$ y $1/9$, y el camino de Gauss-Seidel llega a la solución $(1, 2)$ en la mitad de iteraciones.]{componente="NumericsLab"}
```yaml
modo: iterativo
matriz: [[3, 1], [1, 3]]
b: [5, 7]
inicio: [-2, 4]
metodos: [jacobi, gauss-seidel]
```
:::

- **Matrices simétricas definidas positivas:** Gauss-Seidel siempre converge para ellas.
- **Costo por iteración:** una multiplicación por la matriz, proporcional al número de entradas no nulas.
- **Sobrerrelajación (SOR):** $\mathbf{x}^{(k+1)} = (1 - \omega)\mathbf{x}^{(k)} + \omega\,\mathbf{x}_{\text{GS}}$ con $1 < \omega < 2$ puede acelerar mucho la convergencia.
- **Criterio de paro:** se detiene cuando el residuo $\lVert \mathbf{b} - \mathbf{A}\mathbf{x}^{(k)} \rVert$ es pequeño en relación con $\lVert \mathbf{b} \rVert$.

## Errores comunes

- **Aplicarlos sin revisar la convergencia.** En $x + 2y = 3$, $3x + y = 4$ la diagonal es débil, el radio de Jacobi es $\sqrt{6} = 2.45$ y los iterados se alejan cada vez más de la solución.

:::figura[Jacobi en $x + 2y = 3$, $3x + y = 4$: los puntos saltan de un lado a otro de la solución $(1, 1)$ con distancia multiplicada por 2.45 en cada iteración.]{componente="NumericsLab"}
```yaml
modo: iterativo
matriz: [[1, 2], [3, 1]]
b: [3, 4]
inicio: [0, 0]
metodos: [jacobi]
```
:::

- **Pensar que Gauss-Seidel siempre es más rápido.** Hay matrices para las que Jacobi converge y Gauss-Seidel no, aunque en los casos usuales Gauss-Seidel gana.
- **Reordenar ecuaciones sin pensar.** El orden importa: intercambiar las ecuaciones del ejemplo que diverge las vuelve diagonal dominantes y el método converge.
- **Usar Jacobi con una matriz pequeña y densa.** Para sistemas pequeños la eliminación gaussiana es más rápida y exacta; los iterativos brillan con matrices grandes y dispersas.

## Conexiones

Resuelven los mismos [[sistemas-de-ecuaciones-lineales]] que la [[eliminacion-gaussiana]], pero solo con productos por matrices, ideales para [[matrices-dispersas]]. Su convergencia se decide con [[valores-y-vectores-propios]] de la matriz de iteración, como en el [[metodo-de-la-potencia]]. El [[gradiente-conjugado]] es un método iterativo mucho más rápido para matrices simétricas definidas positivas.

## Formulario

:::formula[Jacobi]
$$
x_i^{(k+1)} = \frac{1}{a_{ii}}\Big(b_i - \sum_{j \ne i} a_{ij}\,x_j^{(k)}\Big)
$$

- $a_{ij}$: entradas de $\mathbf{A}$; $b_i$: lado derecho; $k$: iteración.
:::

:::formula[Gauss-Seidel]
$$
x_i^{(k+1)} = \frac{1}{a_{ii}}\Big(b_i - \sum_{j < i} a_{ij}\,x_j^{(k+1)} - \sum_{j > i} a_{ij}\,x_j^{(k)}\Big)
$$

- Usa los valores nuevos de las incógnitas anteriores.
:::

:::formula[Convergencia]
$$
\mathbf{x}^{(k+1)} - \mathbf{x}^* = \mathbf{G}\big(\mathbf{x}^{(k)} - \mathbf{x}^*\big), \qquad \text{converge} \iff \rho(\mathbf{G}) < 1
$$

- $\mathbf{x}^*$: solución; $\mathbf{G}$: matriz de iteración; $\rho$: radio espectral.
:::

:::formula[Radios en un sistema de 2 por 2]
$$
\rho_{\text{J}} = \sqrt{\left|\frac{a_{12}a_{21}}{a_{11}a_{22}}\right|}, \qquad \rho_{\text{GS}} = \left|\frac{a_{12}a_{21}}{a_{11}a_{22}}\right| = \rho_{\text{J}}^2
$$

- $a_{ij}$: entradas de la matriz de $2 \times 2$.
:::

:::formula[Diagonal dominante estricta]
$$
|a_{ii}| > \sum_{j \ne i}|a_{ij}| \quad \text{para todo } i
$$

- Condición suficiente para que ambos métodos converjan.
:::
