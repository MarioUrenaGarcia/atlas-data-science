---
id: matriz-identidad-y-matriz-inversa
titulo: Matriz identidad y matriz inversa
titulo_en: Identity matrix and inverse matrix
alias:
  - matriz identidad
  - inversa de una matriz
  - matriz invertible
  - matriz singular
modulo: 0
submodulo: '0.3'
orden: 15
nivel: basico
prerrequisitos:
  - multiplicacion-de-matrices-como-transformacion-lineal
etiquetas:
  - identidad
  - inversa
  - matriz singular
  - sistemas de ecuaciones
resumen: >
  La identidad I deja todo vector igual; la inversa de A es la matriz que deshace su efecto, AA^{-1} =
  A^{-1}A = I, y existe solo cuando A no aplasta el espacio, es decir, cuando det A es distinto de cero.
formula: 'A A^{-1} = A^{-1} A = I, \qquad \begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: inversa
    pares:
      - nombre: Invertible
        primera: [[2, 1], [1, 1]]
      - nombre: Rotación de 90 grados
        primera: [[0, -1], [1, 0]]
      - nombre: Escalamiento
        primera: [[3, 0], [0, 0.5]]
      - nombre: Singular
        primera: [[1, 2], [2, 4]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

La matriz identidad es la transformación que no hace nada: cada punto se queda donde estaba. Tiene unos en la diagonal y ceros fuera, y cumple para las matrices el papel que el número 1 cumple para los números: multiplicar por ella no cambia nada.

La inversa de una matriz es la transformación que deshace lo que hizo la original. Si $A$ gira el plano 90 grados, su inversa lo gira 90 grados de regreso; si $A$ estira al triple en una dirección, su inversa encoge a un tercio. Pero hay transformaciones que no se pueden deshacer: una que aplasta todo el plano sobre una recta manda muchos puntos distintos al mismo lugar, y desde ahí no hay forma de saber de dónde venía cada uno. Esas matrices se llaman singulares. Tener inversa equivale a que el sistema $A\mathbf{x} = \mathbf{b}$ tenga exactamente una solución para cada $\mathbf{b}$.

## Definición

:::definicion[Identidad e inversa]
La **identidad** $I_n$ es la matriz de $n \times n$ con $(I_n)_{ii} = 1$ y $(I_n)_{ij} = 0$ si $i \neq j$; cumple $AI = IA = A$. Una matriz cuadrada $A$ es **invertible** si existe $A^{-1}$ con
$$
A A^{-1} = A^{-1} A = I.
$$
Si no existe, $A$ es **singular**.
:::

:::teorema[Inversa de 2 por 2]
$$
A = \begin{pmatrix} a & b \\ c & d \end{pmatrix} \text{ es invertible} \iff ad - bc \neq 0, \quad\text{y entonces}\quad A^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}.
$$
:::

:::nota[Qué significa cada símbolo]
- $I_n$ o $I$: matriz identidad de tamaño $n$.
- $A$: matriz cuadrada.
- $A^{-1}$: inversa de $A$.
- $a, b, c, d$: entradas de una matriz de $2 \times 2$.
- $ad - bc$: determinante de la matriz de $2 \times 2$.
- $n$: número de filas y de columnas.
:::

## Cómo usar la visualización

El selector elige una matriz $A$. En la primera fase la rejilla se deforma con $A$; en la segunda se aplica $A^{-1}$ y todo regresa a la rejilla original. El panel muestra el determinante, la inversa y el producto $A^{-1}A$, que siempre resulta la identidad.

Con la rotación, la inversa es la rotación en sentido contrario. Con el escalamiento, la inversa invierte cada factor: 3 pasa a $1/3$ y 0.5 pasa a 2. Con la matriz singular, la primera fase aplasta el plano sobre una recta y la segunda no puede ocurrir: el determinante es 0 y la inversa no existe.

## Ejemplo

Un taller mezcla dos aleaciones. La matriz $A = \begin{pmatrix} 3 & 1 \\ 5 & 2 \end{pmatrix}$ convierte kilos de aleación $(x_1, x_2)$ en kilos de cobre y zinc. Se necesitan $(4, 7)$ kilos de cobre y zinc.

1. Determinante: $3 \cdot 2 - 1 \cdot 5 = 1 \neq 0$, así que $A$ es invertible.
2. Inversa: $A^{-1} = \frac{1}{1}\begin{pmatrix} 2 & -1 \\ -5 & 3 \end{pmatrix}$.
3. Comprobación: $A A^{-1} = \begin{pmatrix} 6 - 5 & -3 + 3 \\ 10 - 10 & -5 + 6 \end{pmatrix} = I$.
4. Solución: $\mathbf{x} = A^{-1}(4, 7)^\top = (8 - 7,\ -20 + 21) = (1, 1)$: un kilo de cada aleación.
5. Verificación: $A(1, 1)^\top = (3 + 1, 5 + 2) = (4, 7)$.

:::figura[La matriz del ejemplo y su inversa. La primera fase deforma la rejilla con A; la segunda la regresa exactamente a su lugar con A inversa.]{componente="MatrixTransform"}
```yaml
modo: inversa
pares:
  - nombre: Aleaciones
    primera: [[3, 1], [5, 2]]
```
:::

## Propiedades

- **Unicidad:** si existe, la inversa es única.
- **Inversa de la inversa:** $(A^{-1})^{-1} = A$.
- **Inversa de un producto:** $(AB)^{-1} = B^{-1}A^{-1}$, con el orden invertido, como quitarse los calcetines después de los zapatos.
- **Inversa de la transpuesta:** $(A^\top)^{-1} = (A^{-1})^\top$.
- **Criterios equivalentes para $A$ de $n \times n$:** $A$ es invertible si y solo si $\det A \neq 0$, si y solo si sus columnas son independientes, si y solo si $A\mathbf{x} = \mathbf{0}$ solo tiene la solución $\mathbf{x} = \mathbf{0}$.
- **Sistemas:** si $A$ es invertible, $A\mathbf{x} = \mathbf{b}$ tiene la solución única $\mathbf{x} = A^{-1}\mathbf{b}$.
- **Inversa de una matriz diagonal:** se invierten las entradas de la diagonal.

:::figura[Caso singular: la matriz con columnas (1, 2) y (2, 4) aplasta todo el plano sobre la recta y = 2x. Muchos puntos llegan al mismo lugar y no hay forma de deshacerlo.]{componente="MatrixTransform"}
```yaml
modo: transformacion
circulo: true
matrices:
  - nombre: Singular
    matriz: [[1, 2], [2, 4]]
  - nombre: Casi singular
    matriz: [[1, 2], [2, 4.2]]
```
:::

:::demostracion
Inversa del producto: $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = AIA^{-1} = AA^{-1} = I$, y de forma análoga $(B^{-1}A^{-1})(AB) = I$.
:::

## Errores comunes

- **Escribir $(AB)^{-1} = A^{-1}B^{-1}$.** El orden se invierte.
- **Calcular la inversa para resolver un sistema.** En la práctica se resuelve $A\mathbf{x} = \mathbf{b}$ por eliminación o factorización; formar $A^{-1}$ es más caro y menos preciso.
- **Hablar de la inversa de una matriz no cuadrada.** Solo las cuadradas pueden tener inversa; las rectangulares tienen, a lo más, inversas por un lado o la pseudoinversa.
- **Dividir entre una matriz.** No existe $B/A$; se multiplica por $A^{-1}$ del lado correcto.

## Conexiones

La inversa deshace la [[multiplicacion-de-matrices-como-transformacion-lineal|transformación lineal]] de una matriz, igual que la [[funcion-inversa-y-composicion|función inversa]] deshace una función. Existe exactamente cuando el [[determinante-como-factor-de-volumen|determinante]] no es cero y cuando el [[rango-de-una-matriz|rango]] es completo. Se calcula en la práctica con [[eliminacion-gaussiana]], y para matrices que no la tienen existe la [[pseudoinversa-de-moore-penrose]]. En regresión, la solución de mínimos cuadrados usa $(X^\top X)^{-1}$.

## Formulario

:::formula[Definición]
$$
A A^{-1} = A^{-1} A = I
$$

- $A$: matriz cuadrada invertible.
- $I$: identidad.
:::

:::formula[Inversa de 2 por 2]
$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}
$$

- $a, b, c, d$: entradas.
- $ad - bc$: determinante, distinto de cero.
:::

:::formula[Propiedades algebraicas]
$$
(AB)^{-1} = B^{-1}A^{-1}, \qquad (A^\top)^{-1} = (A^{-1})^\top, \qquad (cA)^{-1} = \tfrac{1}{c}A^{-1}
$$

- $c$: escalar distinto de cero.
:::

:::formula[Solución de un sistema]
$$
A\mathbf{x} = \mathbf{b} \ \Rightarrow\ \mathbf{x} = A^{-1}\mathbf{b}
$$

- $\mathbf{b}$: lado derecho.
- $\mathbf{x}$: vector de incógnitas.
:::
