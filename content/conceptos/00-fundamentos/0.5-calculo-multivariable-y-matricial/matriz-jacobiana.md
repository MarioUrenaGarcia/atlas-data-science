---
id: matriz-jacobiana
titulo: Matriz jacobiana
titulo_en: Jacobian matrix
alias:
  - jacobiano
  - derivada de una función vectorial
modulo: 0
submodulo: '0.5'
orden: 7
nivel: intermedio
prerrequisitos:
  - gradiente
  - multiplicacion-de-matrices-como-transformacion-lineal
etiquetas:
  - jacobiana
  - funciones vectoriales
  - transformación lineal
  - aproximación lineal
resumen: >
  La jacobiana de F : R^n -> R^m es la matriz de m por n de sus derivadas parciales; es la transformación
  lineal que mejor aproxima a F cerca de un punto.
formula: '\mathbf{J}_F(\mathbf{x}) = \begin{pmatrix} \frac{\partial F_1}{\partial x_1} & \cdots & \frac{\partial F_1}{\partial x_n} \\ \vdots & & \vdots \\ \frac{\partial F_m}{\partial x_1} & \cdots & \frac{\partial F_m}{\partial x_n} \end{pmatrix}, \qquad F(\mathbf{x} + \mathbf{h}) \approx F(\mathbf{x}) + \mathbf{J}_F(\mathbf{x})\,\mathbf{h}'
visualizacion:
  componente: SurfaceViz
  parametros:
    modo: jacobiana
    mapas: [cuadrado, onda, lineal, polares]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '4.3'
publicado: true
---

## Intuición

Una hoja de goma con una rejilla dibujada se estira y se dobla. Vista de lejos, la rejilla deformada está curvada; pero un cuadrito muy pequeño se transforma casi en un paralelogramo, como si en esa zona la deformación fuera una matriz. Esa matriz local es la jacobiana.

Cuando una función devuelve varios números a partir de varios números, como una transformación del plano en el plano o una capa de una red neuronal, ya no basta un gradiente. Cada salida tiene su gradiente, y apilarlos como filas da una matriz: la jacobiana. Multiplicar esa matriz por un desplazamiento pequeño de la entrada da el desplazamiento aproximado de la salida. Sus columnas dicen en qué se convierten los pasos unitarios en cada eje, y su determinante, cuando es cuadrada, dice cuánto se amplifica el área de un cuadrito.

## Definición

:::definicion[Matriz jacobiana]
Sea $F : \mathbb{R}^n \to \mathbb{R}^m$ con componentes $F = (F_1, \dots, F_m)$, cada una con derivadas parciales en $\mathbf{x}$. La **matriz jacobiana** de $F$ en $\mathbf{x}$ es la matriz de $m \times n$
$$
\mathbf{J}_F(\mathbf{x}) = \left[\frac{\partial F_i}{\partial x_j}(\mathbf{x})\right]_{i, j} =
\begin{pmatrix} \nabla F_1(\mathbf{x})^\top \\ \vdots \\ \nabla F_m(\mathbf{x})^\top \end{pmatrix}.
$$
:::

La fila $i$ es el gradiente transpuesto de la componente $F_i$; la columna $j$ es la derivada de $F$ respecto a $x_j$. Si $F$ es diferenciable en $\mathbf{x}$,
$$
F(\mathbf{x} + \mathbf{h}) = F(\mathbf{x}) + \mathbf{J}_F(\mathbf{x})\,\mathbf{h} + o(\lVert \mathbf{h} \rVert).
$$
Cuando $m = n$, el número $\det \mathbf{J}_F(\mathbf{x})$ se llama **determinante jacobiano**.

:::nota[Qué significa cada símbolo]
- $F$: función de $\mathbb{R}^n$ en $\mathbb{R}^m$; $F_i$ es su componente $i$, una función con valores reales.
- $\mathbf{x}$: punto de entrada; $x_j$ es su coordenada $j$.
- $\mathbf{J}_F(\mathbf{x})$: jacobiana, matriz de $m$ filas y $n$ columnas.
- $\frac{\partial F_i}{\partial x_j}$: entrada de la fila $i$ y la columna $j$.
- $\nabla F_i(\mathbf{x})^\top$: gradiente de $F_i$ escrito como fila.
- $\mathbf{h}$: desplazamiento pequeño de la entrada.
- $o(\lVert \mathbf{h} \rVert)$: término que se vuelve despreciable frente a $\lVert \mathbf{h} \rVert$ cuando $\mathbf{h} \to \mathbf{0}$.
- $\det \mathbf{J}_F$: determinante jacobiano, solo cuando $m = n$.
:::

## Cómo usar la visualización

A la izquierda, una rejilla del plano de entrada con un cuadrito verde; a la derecha, la rejilla transformada por $F$, la imagen del cuadrito en amarillo y, punteado, el paralelogramo que forman las columnas de la jacobiana multiplicadas por los lados del cuadrito. El encabezado escribe la jacobiana en el punto, su determinante y el cociente entre el área de la imagen y el área del cuadrito. El selector cambia la transformación y los controles mueven el cuadrito.

Al reproducir, el cuadrito se encoge: la imagen se parece cada vez más al paralelogramo y el cociente de áreas se acerca a $\lvert \det \mathbf{J} \rvert$. Con la transformación lineal la imagen es exactamente el paralelogramo desde el principio.

## Ejemplo

En una simulación, una malla de cálculo se deforma con $F(u, v) = (u^2 - v^2,\ 2uv)$. Se estudia la deformación cerca de $(u, v) = (0.8, 0.6)$.

1. Componentes: $F_1 = u^2 - v^2$ y $F_2 = 2uv$.
2. Parciales: $\dfrac{\partial F_1}{\partial u} = 2u$, $\dfrac{\partial F_1}{\partial v} = -2v$, $\dfrac{\partial F_2}{\partial u} = 2v$, $\dfrac{\partial F_2}{\partial v} = 2u$.
3. En el punto: $\mathbf{J}_F(0.8, 0.6) = \begin{pmatrix} 1.6 & -1.2 \\ 1.2 & 1.6 \end{pmatrix}$.
4. Imagen del punto: $F(0.8, 0.6) = (0.64 - 0.36,\ 0.96) = (0.28, 0.96)$.
5. Un paso pequeño $\mathbf{h} = (0.01, 0)$ se convierte aproximadamente en $\mathbf{J}\mathbf{h} = (0.016, 0.012)$: la longitud se multiplica por $\sqrt{1.6^2 + 1.2^2} = 2$ y la dirección gira unos 37 grados.
6. $\det \mathbf{J} = 1.6^2 + 1.2^2 = 4$: un cuadrito pequeño cerca del punto se convierte en una figura de área unas 4 veces mayor.

:::figura[La malla del ejemplo: el cuadrito en (0.8, 0.6) se convierte en un paralelogramo girado y agrandado; al encogerse, el cociente de áreas se acerca a det J = 4.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [cuadrado]
punto: [0.5, 0.5]
```
:::

## Propiedades

- **Regla de la cadena:** $\mathbf{J}_{F \circ G}(\mathbf{x}) = \mathbf{J}_F(G(\mathbf{x}))\,\mathbf{J}_G(\mathbf{x})$; las jacobianas se multiplican en el orden de la composición.
- **Funciones lineales:** si $F(\mathbf{x}) = \mathbf{A}\mathbf{x} + \mathbf{b}$, entonces $\mathbf{J}_F = \mathbf{A}$ en todos los puntos.
- **Casos particulares:** si $m = 1$, la jacobiana es el gradiente transpuesto; si $n = 1$, es el vector velocidad de una curva.
- **Factor de área:** $\lvert \det \mathbf{J}_F(\mathbf{x}) \rvert$ es el factor por el que $F$ multiplica áreas o volúmenes cerca de $\mathbf{x}$.
- **Inversa local:** si $\det \mathbf{J}_F(\mathbf{a}) \neq 0$ y $F$ es suave, $F$ es invertible cerca de $\mathbf{a}$ y $\mathbf{J}_{F^{-1}}(F(\mathbf{a})) = \mathbf{J}_F(\mathbf{a})^{-1}$.

:::figura[Caso lineal: para F(u, v) = (2u + v, u + v) la jacobiana es la misma matriz en todos los puntos, la rejilla se transforma en una rejilla de paralelogramos iguales y el cociente de áreas es exactamente det J = 1.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [lineal]
```
:::

## Errores comunes

- **Transponer la jacobiana.** Las filas corresponden a las componentes de la salida y las columnas a las variables de entrada; para $F : \mathbb{R}^3 \to \mathbb{R}^2$ la jacobiana es de $2 \times 3$, no de $3 \times 2$.
- **Confundir la jacobiana con su determinante.** La matriz describe toda la deformación local; el determinante solo dice cuánto cambia el área y si se invierte la orientación.
- **Multiplicar en el orden equivocado en la cadena.** Para $F \circ G$ se escribe $\mathbf{J}_F\,\mathbf{J}_G$, primero el de la función exterior evaluado en $G(\mathbf{x})$.
- **Suponer que es simétrica.** La jacobiana de una transformación general no lo es; solo la de un gradiente, que es la hessiana, es simétrica.

:::figura[En la deformación ondulada F(u, v) = (u + 0.3 sen v, v + 0.3 sen u), en (-0.4, -0.8), la entrada (1, 2) es 0.3 cos v = 0.209 y la (2, 1) es 0.3 cos u = 0.276: la jacobiana no es simétrica, y transponerla cambia la deformación.]{componente="SurfaceViz"}
```yaml
modo: jacobiana
mapas: [onda]
punto: [0.4, 0.3]
```
:::

## Conexiones

Reúne los [[gradiente|gradientes]] de varias funciones en una matriz que actúa como una [[multiplicacion-de-matrices-como-transformacion-lineal|transformación lineal]]. Generaliza el [[plano-tangente-y-aproximacion-lineal|plano tangente]] a funciones con varias salidas. Su determinante es el factor del [[cambio-de-variables-y-determinante-jacobiano]] y se interpreta como en [[determinante-como-factor-de-volumen]]. Se multiplica en la [[regla-de-la-cadena-multivariable]], y la jacobiana del gradiente es la [[matriz-hessiana]].

## Formulario

:::formula[Matriz jacobiana]
$$
\mathbf{J}_F(\mathbf{x}) = \left[\frac{\partial F_i}{\partial x_j}(\mathbf{x})\right]_{i = 1, \dots, m;\ j = 1, \dots, n}
$$

- $F = (F_1, \dots, F_m)$: función de $\mathbb{R}^n$ en $\mathbb{R}^m$.
- $i$: índice de la fila, la componente de la salida.
- $j$: índice de la columna, la variable de entrada.
:::

:::formula[Aproximación lineal]
$$
F(\mathbf{x} + \mathbf{h}) \approx F(\mathbf{x}) + \mathbf{J}_F(\mathbf{x})\,\mathbf{h}
$$

- $\mathbf{h}$: desplazamiento pequeño.
- $\mathbf{J}_F(\mathbf{x})\,\mathbf{h}$: desplazamiento aproximado de la salida.
:::

:::formula[Regla de la cadena]
$$
\mathbf{J}_{F \circ G}(\mathbf{x}) = \mathbf{J}_F(G(\mathbf{x}))\,\mathbf{J}_G(\mathbf{x})
$$

- $G$: función interior; $F$: exterior.
- El producto es de matrices, en ese orden.
:::

:::formula[Jacobiana del ejemplo]
$$
F(u, v) = (u^2 - v^2,\ 2uv), \qquad \mathbf{J}_F = \begin{pmatrix} 2u & -2v \\ 2v & 2u \end{pmatrix}, \qquad \det \mathbf{J}_F = 4(u^2 + v^2)
$$

- $u, v$: coordenadas de la malla original.
- $\det \mathbf{J}_F$: factor de área local.
:::
