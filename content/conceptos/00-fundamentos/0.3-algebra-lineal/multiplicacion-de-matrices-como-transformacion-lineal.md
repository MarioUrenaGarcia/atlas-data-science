---
id: multiplicacion-de-matrices-como-transformacion-lineal
titulo: Multiplicación de matrices como transformación lineal
titulo_en: Matrix multiplication as a linear transformation
alias:
  - transformación lineal
  - aplicación lineal
  - matriz de una transformación
modulo: 0
submodulo: '0.3'
orden: 14
nivel: basico
prerrequisitos:
  - matrices-y-operaciones-con-matrices
  - combinacion-lineal-y-espacio-generado
  - funcion-inversa-y-composicion
etiquetas:
  - transformación lineal
  - geometría
  - composición
  - rejilla
resumen: >
  Una matriz A define la función x -> Ax, que manda rectas a rectas y fija el origen; sus columnas son
  las imágenes de los vectores de la base, y multiplicar matrices es componer esas funciones.
formula: 'T(a\mathbf{x} + b\mathbf{y}) = a\,T(\mathbf{x}) + b\,T(\mathbf{y}), \qquad T(\mathbf{x}) = A\mathbf{x}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: transformacion
    circulo: true
    matrices:
      - nombre: Escalamiento
        matriz: [[2, 0], [0, 0.5]]
      - nombre: Rotación de 90 grados
        matriz: [[0, -1], [1, 0]]
      - nombre: Cizalla
        matriz: [[1, 1], [0, 1]]
      - nombre: Reflexión en el eje x
        matriz: [[1, 0], [0, -1]]
      - nombre: Proyección sobre el eje x
        matriz: [[1, 0], [0, 0]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Una matriz no es solo una tabla: es una máquina que toma un vector y devuelve otro. Aplicada a todos los puntos del plano a la vez, deforma el plano entero. Las rectas siguen siendo rectas, las paralelas siguen paralelas, la rejilla cuadriculada se convierte en una rejilla de paralelogramos iguales y el origen se queda en su lugar. Esas son las transformaciones lineales.

Para saber qué hace una matriz basta mirar a dónde manda los dos vectores básicos, $\mathbf{e}_1 = (1, 0)$ y $\mathbf{e}_2 = (0, 1)$: sus imágenes son las columnas de la matriz. Todo lo demás se deduce, porque cualquier punto es una combinación de $\mathbf{e}_1$ y $\mathbf{e}_2$ y la transformación respeta combinaciones. Aplicar una matriz y luego otra es aplicar su producto, y como girar y luego estirar no es lo mismo que estirar y luego girar, el orden del producto importa.

## Definición

:::definicion[Transformación lineal]
Una función $T : \mathbb{R}^n \to \mathbb{R}^m$ es **lineal** si para todos $\mathbf{x}, \mathbf{y}$ y escalares $a, b$
$$
T(a\mathbf{x} + b\mathbf{y}) = a\,T(\mathbf{x}) + b\,T(\mathbf{y}).
$$
:::

:::teorema[Matriz de una transformación]
Toda transformación lineal $T : \mathbb{R}^n \to \mathbb{R}^m$ es de la forma $T(\mathbf{x}) = A\mathbf{x}$ para una única matriz $A \in \mathbb{R}^{m \times n}$, cuya columna $j$ es $T(\mathbf{e}_j)$:
$$
A = \big[\, T(\mathbf{e}_1) \ \ T(\mathbf{e}_2) \ \cdots \ T(\mathbf{e}_n) \,\big].
$$
Si $T(\mathbf{x}) = A\mathbf{x}$ y $S(\mathbf{y}) = B\mathbf{y}$, la composición es $(S \circ T)(\mathbf{x}) = BA\mathbf{x}$.
:::

:::nota[Qué significa cada símbolo]
- $T$, $S$: transformaciones lineales.
- $\mathbf{x}, \mathbf{y}$: vectores de entrada.
- $a, b$: escalares.
- $A, B$: matrices que representan las transformaciones.
- $\mathbf{e}_j$: vector $j$ de la base canónica.
- $m, n$: dimensiones del espacio de llegada y de salida.
- $S \circ T$: aplicar primero $T$ y después $S$.
:::

## Cómo usar la visualización

El selector elige una matriz y la reproducción deforma la rejilla desde la identidad hasta su imagen. Las flechas $A\mathbf{e}_1$ y $A\mathbf{e}_2$ son las columnas de la matriz; el cuadrado unitario se convierte en el paralelogramo sombreado y el círculo unitario en la curva verde. El panel muestra columnas, determinante, traza, valores propios y normas.

En la cizalla, las rectas horizontales se deslizan sin cambiar de altura y el área se conserva. En la rotación nada cambia de tamaño. En la proyección todo el plano cae sobre el eje $x$ y el cuadrado se aplasta en un segmento. En la reflexión el cuadrado cambia de color porque la orientación se invierte.

## Ejemplo

Una cizalla horizontal manda $\mathbf{e}_1 = (1, 0)$ a $(1, 0)$ y $\mathbf{e}_2 = (0, 1)$ a $(1, 1)$, como un mazo de cartas empujado de lado.

1. Sus columnas dan la matriz $A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$.
2. El punto $\mathbf{x} = (2, 3)$ se escribe $2\mathbf{e}_1 + 3\mathbf{e}_2$, así que $A\mathbf{x} = 2(1, 0) + 3(1, 1) = (5, 3)$.
3. Con el producto fila por columna: $(1 \cdot 2 + 1 \cdot 3,\ 0 \cdot 2 + 1 \cdot 3) = (5, 3)$, el mismo resultado.
4. Cada punto se desplaza horizontalmente tanto como su altura: el de altura 3 se mueve 3 unidades.

:::figura[La cizalla del ejemplo con sus entradas editables. La rejilla se inclina, el cuadrado unitario se convierte en un paralelogramo de la misma área y la columna A e₂ = (1, 1) marca la inclinación.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: false
propios: false
matrices:
  - nombre: Cizalla
    matriz: [[1, 1], [0, 1]]
```
:::

## Propiedades

- **El origen queda fijo:** $T(\mathbf{0}) = \mathbf{0}$; una traslación no es lineal.
- **Rectas a rectas:** la imagen de una recta es una recta o un punto, y las paralelas siguen paralelas.
- **Composición es producto:** aplicar $A$ y después $B$ equivale a aplicar $BA$.
- **El orden importa:** $BA \neq AB$ en general; girar y luego estirar no es estirar y luego girar.
- **Imagen:** el conjunto de todas las salidas $A\mathbf{x}$ es el espacio generado por las columnas de $A$.
- **Ejemplos clásicos en el plano:** rotación $\begin{pmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}$, escalamiento $\begin{pmatrix} s_1 & 0 \\ 0 & s_2 \end{pmatrix}$, reflexión, cizalla y proyección.

:::figura[Caso de composición: una rotación de 90 grados seguida de un estiramiento horizontal. El interruptor invierte el orden y el resultado cambia, porque el producto de matrices no conmuta.]{componente="MatrixTransform"}
```yaml
modo: composicion
pares:
  - nombre: Rotación y estiramiento
    primera: [[0, -1], [1, 0]]
    segunda: [[2, 0], [0, 1]]
  - nombre: Cizalla y reflexión
    primera: [[1, 1], [0, 1]]
    segunda: [[1, 0], [0, -1]]
```
:::

:::demostracion
Matriz de $T$: todo $\mathbf{x}$ es $x_1\mathbf{e}_1 + \dots + x_n\mathbf{e}_n$. Por linealidad, $T(\mathbf{x}) = x_1T(\mathbf{e}_1) + \dots + x_nT(\mathbf{e}_n)$, que es la combinación de las columnas $T(\mathbf{e}_j)$ con pesos $x_j$, es decir, $A\mathbf{x}$.
:::

## Errores comunes

- **Llamar lineal a $f(x) = 2x + 3$.** En álgebra lineal no lo es, porque no fija el origen; es afín.
- **Componer en el orden de lectura.** "Primero $A$, luego $B$" es $BA\mathbf{x}$, no $AB\mathbf{x}$.
- **Olvidar que las columnas son las imágenes de la base.** Leer las filas como imágenes da la transformación transpuesta.
- **Creer que toda transformación lineal conserva ángulos o longitudes.** Solo las ortogonales lo hacen; la cizalla cambia ángulos.

## Conexiones

La transformación lineal es una [[funciones|función]] entre espacios vectoriales representada con una matriz de [[matrices-y-operaciones-con-matrices]]; su composición corresponde a la [[funcion-inversa-y-composicion|composición de funciones]]. Deshacer una transformación lleva a la [[matriz-identidad-y-matriz-inversa]], el factor de área es el [[determinante-como-factor-de-volumen]] y las direcciones que solo se estiran son los [[valores-y-vectores-propios]]. Una red neuronal alterna transformaciones lineales con funciones no lineales.

## Formulario

:::formula[Linealidad]
$$
T(a\mathbf{x} + b\mathbf{y}) = a\,T(\mathbf{x}) + b\,T(\mathbf{y})
$$

- $T$: transformación.
- $a, b$: escalares.
:::

:::formula[Matriz de una transformación]
$$
A = \big[\, T(\mathbf{e}_1) \ \cdots \ T(\mathbf{e}_n) \,\big], \qquad T(\mathbf{x}) = A\mathbf{x}
$$

- $T(\mathbf{e}_j)$: imagen del vector básico $j$, columna $j$ de $A$.
:::

:::formula[Composición]
$$
(S \circ T)(\mathbf{x}) = B(A\mathbf{x}) = (BA)\,\mathbf{x}
$$

- $A$: matriz de $T$, que se aplica primero.
- $B$: matriz de $S$, que se aplica después.
:::

:::formula[Rotación en el plano]
$$
R_\alpha = \begin{pmatrix} \cos\alpha & -\sin\alpha \\ \sin\alpha & \cos\alpha \end{pmatrix}
$$

- $\alpha$: ángulo de giro en sentido contrario a las manecillas del reloj.
:::
