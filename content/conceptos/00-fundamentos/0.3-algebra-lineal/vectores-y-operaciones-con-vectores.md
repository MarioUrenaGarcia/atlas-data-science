---
id: vectores-y-operaciones-con-vectores
titulo: Vectores y operaciones con vectores
titulo_en: Vectors and vector operations
alias:
  - vector
  - suma de vectores
  - producto por escalar
  - regla del paralelogramo
modulo: 0
submodulo: '0.3'
orden: 1
nivel: basico
prerrequisitos:
  - producto-cartesiano
etiquetas:
  - vectores
  - suma de vectores
  - escalares
  - geometría
resumen: >
  Un vector de n componentes es una lista ordenada de números que se interpreta como flecha o punto;
  se suman componente a componente y se multiplican por escalares estirándolos o invirtiéndolos.
formula: '\mathbf{u} + \mathbf{v} = (u_1 + v_1, \dots, u_n + v_n), \quad c\,\mathbf{u} = (c\,u_1, \dots, c\,u_n)'
visualizacion:
  componente: VectorPlane
  parametros:
    modo: operaciones
    u: [2, 1]
    v: [1, 3]
    escalar: -1.5
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Un vector registra varias cantidades a la vez y en un orden fijo. El desplazamiento de un dron que avanza 3 km al este y 1 km al norte se describe con el par $(3, 1)$; el perfil de un paciente con edad, peso y presión se describe con una lista de tres números. En el plano, el par $(3, 1)$ se dibuja como una flecha que sale del origen y termina en el punto $(3, 1)$.

Las dos operaciones básicas tienen una lectura geométrica directa. Sumar dos desplazamientos equivale a recorrer uno y después el otro: la flecha suma une el inicio del primero con el final del segundo, y coincide con la diagonal del paralelogramo que forman ambos. Multiplicar por un número $c$ estira la flecha si $|c| > 1$, la encoge si $|c| < 1$ y la invierte si $c$ es negativo, sin sacarla de la recta en la que está. Estas dos operaciones, aplicadas componente a componente, son todo lo que se necesita para construir el resto del álgebra lineal.

## Definición

:::definicion[Vector y operaciones]
Un **vector** de $\mathbb{R}^n$ es una lista ordenada $\mathbf{u} = (u_1, \dots, u_n)$ de números reales, llamados **componentes**. Para $\mathbf{u}, \mathbf{v} \in \mathbb{R}^n$ y $c \in \mathbb{R}$ se definen

$$
\mathbf{u} + \mathbf{v} = (u_1 + v_1, \dots, u_n + v_n), \qquad c\,\mathbf{u} = (c\,u_1, \dots, c\,u_n).
$$

La resta es $\mathbf{u} - \mathbf{v} = \mathbf{u} + (-1)\mathbf{v}$ y el **vector cero** es $\mathbf{0} = (0, \dots, 0)$.
:::

Solo se suman vectores con el mismo número de componentes. Por convención, en álgebra lineal los vectores se escriben como columnas, $\mathbf{u} = (u_1, \dots, u_n)^\top$, aunque en el texto se escriban en una línea.

:::nota[Qué significa cada símbolo]
- $\mathbf{u}, \mathbf{v}$: vectores, escritos en negritas minúsculas.
- $u_i$: componente $i$ del vector $\mathbf{u}$, un número real.
- $n$: número de componentes, la dimensión del espacio $\mathbb{R}^n$.
- $\mathbb{R}^n$: conjunto de todas las listas de $n$ números reales.
- $c$: escalar, un número real que multiplica al vector.
- $\mathbf{0}$: vector cero, con todas sus componentes iguales a cero.
- $\top$: transpuesta, indica que el vector se piensa como columna.
:::

## Cómo usar la visualización

El plano muestra los vectores $\mathbf{u}$ y $\mathbf{v}$ como flechas desde el origen; sus puntas se arrastran con el ratón o con el teclado. La reproducción recorre en orden la suma $\mathbf{u} + \mathbf{v}$ con su paralelogramo, la resta $\mathbf{u} - \mathbf{v}$ y el múltiplo $c\,\mathbf{u}$. El control del escalar cambia $c$, y el panel muestra las componentes y longitudes en vivo.

Con $c$ negativo, $c\,\mathbf{u}$ apunta en sentido contrario a $\mathbf{u}$ sobre la misma recta. Al arrastrar $\mathbf{v}$ hasta que coincida con $\mathbf{u}$, la resta se vuelve el vector cero. Con $\mathbf{u}$ y $\mathbf{v}$ perpendiculares, el paralelogramo se vuelve un rectángulo y la longitud de la suma cumple el teorema de Pitágoras.

## Ejemplo

Un dron hace dos tramos: primero $\mathbf{u} = (3, 1)$ km y luego $\mathbf{v} = (-1, 2)$ km, con la primera componente hacia el este y la segunda hacia el norte.

1. Desplazamiento total: $\mathbf{u} + \mathbf{v} = (3 - 1, 1 + 2) = (2, 3)$ km.
2. Si el segundo tramo se hace de regreso, el total es $\mathbf{u} - \mathbf{v} = (3 + 1, 1 - 2) = (4, -1)$ km.
3. Repetir el primer tramo dos veces equivale a $2\mathbf{u} = (6, 2)$ km.
4. La distancia en línea recta al punto final del inciso 1 es $\sqrt{2^2 + 3^2} = \sqrt{13} \approx 3.61$ km, menor que la suma de los tramos, $\sqrt{10} + \sqrt{5} \approx 5.40$ km.

:::figura[Los tramos del dron. La suma sigue el paralelogramo formado por los dos desplazamientos, la resta recorre el segundo tramo en sentido contrario y el múltiplo 2u repite el primer tramo.]{componente="VectorPlane"}
```yaml
modo: operaciones
u: [3, 1]
v: [-1, 2]
escalar: 2
```
:::

## Propiedades

Para $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^n$ y escalares $a, b$:

- **Conmutativa:** $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$, porque ambos caminos recorren los lados opuestos del mismo paralelogramo.
- **Asociativa:** $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$.
- **Neutro e inverso:** $\mathbf{u} + \mathbf{0} = \mathbf{u}$ y $\mathbf{u} + (-\mathbf{u}) = \mathbf{0}$.
- **Distributivas:** $a(\mathbf{u} + \mathbf{v}) = a\mathbf{u} + a\mathbf{v}$ y $(a + b)\mathbf{u} = a\mathbf{u} + b\mathbf{u}$.
- **Compatibilidad:** $a(b\,\mathbf{u}) = (ab)\,\mathbf{u}$ y $1\,\mathbf{u} = \mathbf{u}$.
- **Múltiplos colineales:** todos los múltiplos $c\,\mathbf{u}$ de un vector no nulo están sobre la recta que pasa por el origen en la dirección de $\mathbf{u}$.

:::figura[Caso de la resta. La flecha u - v va de la punta de v a la punta de u; con u = (1, 3) y v = (3, 1) resulta (-2, 2), perpendicular a la suma (4, 4) porque ambos vectores miden lo mismo.]{componente="VectorPlane"}
```yaml
modo: operaciones
u: [1, 3]
v: [3, 1]
escalar: 0.5
```
:::

:::demostracion
Cada propiedad se reduce a la propiedad correspondiente de los números reales, aplicada en cada componente. Por ejemplo, la componente $i$ de $a(\mathbf{u} + \mathbf{v})$ es $a(u_i + v_i) = a u_i + a v_i$, que es la componente $i$ de $a\mathbf{u} + a\mathbf{v}$.
:::

## Errores comunes

- **Sumar vectores de distinto tamaño.** $(1, 2) + (1, 2, 3)$ no está definido; completar con ceros cambia el significado de los datos.
- **Pensar que la longitud de la suma es la suma de las longitudes.** Solo ocurre cuando los vectores apuntan en la misma dirección; en general $\lVert \mathbf{u} + \mathbf{v} \rVert \le \lVert \mathbf{u} \rVert + \lVert \mathbf{v} \rVert$.
- **Confundir punto y flecha.** El vector $(3, 1)$ es el mismo si se dibuja desde el origen o desde otro punto; lo que lo define es su desplazamiento, no su lugar de inicio.
- **Leer $\mathbf{u} - \mathbf{v}$ como la flecha de $\mathbf{u}$ a $\mathbf{v}$.** Es la flecha que va de la punta de $\mathbf{v}$ a la punta de $\mathbf{u}$.

## Conexiones

Un vector de $\mathbb{R}^n$ es un elemento del [[producto-cartesiano]] $\mathbb{R} \times \dots \times \mathbb{R}$. Las reglas de la sección de propiedades son los axiomas que definen los [[espacios-vectoriales]], y combinar suma y producto por escalar da lugar a la [[combinacion-lineal-y-espacio-generado|combinación lineal]]. Para medir longitudes y ángulos se necesitan el [[producto-punto]] y las [[normas-vectoriales]]. En ciencia de datos cada observación de una tabla es un vector de características.

## Formulario

:::formula[Suma de vectores]
$$
\mathbf{u} + \mathbf{v} = (u_1 + v_1, \dots, u_n + v_n)
$$

- $\mathbf{u}, \mathbf{v}$: vectores de $\mathbb{R}^n$.
- $u_i, v_i$: sus componentes $i$.
- $n$: número de componentes.
:::

:::formula[Producto por escalar]
$$
c\,\mathbf{u} = (c\,u_1, \dots, c\,u_n)
$$

- $c$: escalar real.
- $u_i$: componente $i$ de $\mathbf{u}$.
:::

:::formula[Resta y vector cero]
$$
\mathbf{u} - \mathbf{v} = \mathbf{u} + (-1)\,\mathbf{v}, \qquad \mathbf{u} + \mathbf{0} = \mathbf{u}
$$

- $\mathbf{0}$: vector con todas sus componentes iguales a cero.
- $-1$: escalar que invierte el sentido de $\mathbf{v}$.
:::

:::formula[Desigualdad del triángulo]
$$
\lVert \mathbf{u} + \mathbf{v} \rVert \le \lVert \mathbf{u} \rVert + \lVert \mathbf{v} \rVert
$$

- $\lVert \mathbf{u} \rVert$: longitud euclidiana de $\mathbf{u}$, $\sqrt{u_1^2 + \dots + u_n^2}$.
:::
