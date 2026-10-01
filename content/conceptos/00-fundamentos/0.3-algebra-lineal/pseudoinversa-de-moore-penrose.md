---
id: pseudoinversa-de-moore-penrose
titulo: Pseudoinversa de Moore-Penrose
titulo_en: Moore-Penrose pseudoinverse
alias:
  - pseudoinversa
  - inversa generalizada
  - A más
modulo: 0
submodulo: '0.3'
orden: 36
nivel: intermedio
prerrequisitos:
  - descomposicion-en-valores-singulares
  - proyeccion-ortogonal
etiquetas:
  - pseudoinversa
  - mínimos cuadrados
  - norma mínima
  - sistemas sin solución
resumen: >
  La pseudoinversa A^+ = V Σ^+ U^T existe para cualquier matriz; x = A^+ b es la solución de mínimos
  cuadrados de Ax = b y, entre todas ellas, la de menor longitud.
formula: 'A^{+} = V\Sigma^{+}U^\top, \qquad \Sigma^{+} = \operatorname{diag}(1/\sigma_i \text{ si } \sigma_i > 0,\ 0 \text{ si no})'
visualizacion:
  componente: MatrixTransform
  parametros:
    modo: pseudoinversa
    matrices:
      - nombre: Rango 1 horizontal
        matriz: [[1, 1], [0, 0]]
      - nombre: Invertible
        matriz: [[2, 1], [1, 1]]
      - nombre: Rango 1 inclinada
        matriz: [[2, -1], [-2, 1]]
referencias:
  - clave: strang
  - clave: hastie-esl
publicado: true
---

## Intuición

Cuando una matriz aplasta el plano sobre una recta, no se puede deshacer: muchos puntos llegan al mismo lugar y algunos lugares no se alcanzan nunca. Aun así se puede hacer lo mejor posible. Si el objetivo $\mathbf{b}$ no está en la recta alcanzable, se apunta al punto de la recta más cercano, su proyección. Y como muchos puntos de partida llegan ahí, se elige el más corto, el que no desperdicia nada en direcciones que la matriz ignora.

La pseudoinversa hace exactamente esas dos elecciones. Usando la descomposición en valores singulares, invierte los estiramientos que sí se pueden invertir y deja en cero los que la matriz aplastó. Si la matriz es invertible, coincide con la inversa. Si no, da la solución de mínimos cuadrados de norma mínima, que es lo que calculan los programas de regresión cuando las variables son redundantes.

## Definición

:::definicion[Pseudoinversa]
Si $A = U\Sigma V^\top$ es la SVD de $A \in \mathbb{R}^{m \times n}$, la **pseudoinversa** es
$$
A^{+} = V\Sigma^{+}U^\top,
$$
donde $\Sigma^{+} \in \mathbb{R}^{n \times m}$ es diagonal con entradas $1/\sigma_i$ para los $\sigma_i > 0$ y 0 para los demás.
:::

:::teorema[Mínimos cuadrados de norma mínima]
Para todo $\mathbf{b}$, el vector $\mathbf{x}^{+} = A^{+}\mathbf{b}$ minimiza $\lVert A\mathbf{x} - \mathbf{b} \rVert$, y entre todos los minimizadores es el de menor norma. Además $AA^{+}$ es la proyección ortogonal sobre el espacio columna de $A$.
:::

:::nota[Qué significa cada símbolo]
- $A$: matriz de $m \times n$, de cualquier rango.
- $A^{+}$: pseudoinversa, de $n \times m$.
- $U, \Sigma, V$: factores de la SVD de $A$.
- $\Sigma^{+}$: se invierten los valores singulares positivos y se dejan los ceros.
- $\sigma_i$: valores singulares.
- $\mathbf{b}$: lado derecho del sistema.
- $\mathbf{x}^{+}$: solución de mínimos cuadrados de norma mínima.
:::

## Cómo usar la visualización

El panel izquierdo es la salida: el vector $\mathbf{b}$ se arrastra y se proyecta sobre el espacio columna, dando $A\mathbf{x}^{+}$, lo más cercano que la matriz puede alcanzar. El panel derecho es la entrada: la línea punteada reúne todos los $\mathbf{x}$ que alcanzan esa proyección, y $\mathbf{x}^{+}$ es su punto más cercano al origen, sobre el espacio fila. El panel muestra $A^{+}$, el residuo y las longitudes.

Con la matriz invertible, el residuo es cero y $A^{+}$ es la inversa. Con las de rango 1, mover $\mathbf{b}$ perpendicularmente al espacio columna no cambia $\mathbf{x}^{+}$, porque esa parte de $\mathbf{b}$ es inalcanzable.

## Ejemplo

Dos máquinas producen dos piezas según $A = \begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$, y se piden $\mathbf{b} = (1, 3)$ piezas, una combinación imposible de lograr exactamente.

1. $A = 5\,\mathbf{u}\mathbf{v}^\top$ con $\mathbf{u} = \mathbf{v} = (1, 2)/\sqrt{5}$: rango 1 y $\sigma_1 = 5$.
2. $A^{+} = \tfrac{1}{5}\mathbf{v}\mathbf{u}^\top = \tfrac{1}{25}\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}$.
3. $\mathbf{x}^{+} = A^{+}\mathbf{b} = \tfrac{1}{25}(1 + 6,\ 2 + 12) = (0.28, 0.56)$ horas.
4. Producción lograda: $A\mathbf{x}^{+} = (0.28 + 1.12,\ 0.56 + 2.24) = (1.4, 2.8)$, la proyección de $(1, 3)$ sobre la recta de $(1, 2)$.
5. Cualquier $\mathbf{x}^{+} + t(2, -1)$ produce lo mismo, pero $\mathbf{x}^{+}$ es el más corto: es perpendicular a $(2, -1)$, porque $0.56 - 0.56 = 0$.

:::figura[Las máquinas del ejemplo. El pedido (1, 3) se proyecta sobre la recta alcanzable en (1.4, 2.8), y entre las entradas que lo logran la pseudoinversa elige la más corta, (0.28, 0.56).]{componente="MatrixTransform"}
```yaml
modo: pseudoinversa
matrices:
  - nombre: Máquinas
    matriz: [[1, 2], [2, 4]]
```
:::

## Propiedades

- **Condiciones de Penrose:** $AA^{+}A = A$, $A^{+}AA^{+} = A^{+}$, y $AA^{+}$ y $A^{+}A$ son simétricas; estas cuatro condiciones la determinan de forma única.
- **Casos especiales:** si $A$ es invertible, $A^{+} = A^{-1}$; si tiene columnas independientes, $A^{+} = (A^\top A)^{-1}A^\top$; si tiene filas independientes, $A^{+} = A^\top(AA^\top)^{-1}$.
- **Proyecciones:** $AA^{+}$ proyecta sobre el espacio columna y $A^{+}A$ sobre el espacio fila.
- **Transpuesta:** $(A^\top)^{+} = (A^{+})^\top$ y $(A^{+})^{+} = A$.
- **Sensibilidad:** si un valor singular es muy pequeño, $1/\sigma_i$ es enorme; en la práctica se trunca con un umbral o se regulariza.

:::demostracion
Con $\mathbf{c} = U^\top\mathbf{b}$ y $\mathbf{y} = V^\top\mathbf{x}$, $\lVert A\mathbf{x} - \mathbf{b} \rVert^2 = \lVert \Sigma\mathbf{y} - \mathbf{c} \rVert^2 = \sum_{\sigma_i > 0}(\sigma_i y_i - c_i)^2 + \sum_{\sigma_i = 0} c_i^2$. Se minimiza con $y_i = c_i/\sigma_i$ para $\sigma_i > 0$, y las demás $y_i$ son libres; la norma $\lVert \mathbf{x} \rVert = \lVert \mathbf{y} \rVert$ es mínima con esas $y_i = 0$, que es $\mathbf{y} = \Sigma^{+}\mathbf{c}$.
:::

## Errores comunes

- **Usar $(A^\top A)^{-1}A^\top$ cuando las columnas son dependientes.** $A^\top A$ es singular; la pseudoinversa sí existe.
- **Pensar que $A^{+}A = I$.** Solo si las columnas de $A$ son independientes; en general es una proyección.
- **Invertir valores singulares diminutos sin cuidado.** Un $\sigma_i$ de $10^{-12}$ producido por redondeo convierte ruido en respuestas enormes.
- **Creer que da la solución exacta.** Da la mejor aproximación; si $\mathbf{b}$ no está en el espacio columna, $A\mathbf{x}^{+} \neq \mathbf{b}$.

## Conexiones

La pseudoinversa se construye con la [[descomposicion-en-valores-singulares]] y combina la [[proyeccion-ortogonal]] sobre el espacio columna con la elección del punto del espacio fila, de [[espacio-columna-espacio-fila-y-espacio-nulo]]. Generaliza la [[matriz-identidad-y-matriz-inversa|inversa]] y resuelve [[sistemas-de-ecuaciones-lineales]] sin solución. En regresión da los coeficientes de mínimos cuadrados, y su versión regularizada es la regresión ridge.

## Formulario

:::formula[Definición por SVD]
$$
A^{+} = V\Sigma^{+}U^\top = \sum_{\sigma_i > 0} \frac{1}{\sigma_i}\,\mathbf{v}_i\mathbf{u}_i^\top
$$

- $\sigma_i$: valores singulares positivos.
- $\mathbf{u}_i, \mathbf{v}_i$: vectores singulares.
:::

:::formula[Solución de mínimos cuadrados de norma mínima]
$$
\mathbf{x}^{+} = A^{+}\mathbf{b} = \arg\min\big\{ \lVert \mathbf{x} \rVert : \mathbf{x} \text{ minimiza } \lVert A\mathbf{x} - \mathbf{b} \rVert \big\}
$$

- $\mathbf{b}$: lado derecho.
:::

:::formula[Columnas independientes]
$$
A^{+} = (A^\top A)^{-1}A^\top
$$

- Válida solo si $A^\top A$ es invertible.
:::

:::formula[Condiciones de Penrose]
$$
AA^{+}A = A, \quad A^{+}AA^{+} = A^{+}, \quad (AA^{+})^\top = AA^{+}, \quad (A^{+}A)^\top = A^{+}A
$$

- Estas cuatro igualdades caracterizan a $A^{+}$.
:::
