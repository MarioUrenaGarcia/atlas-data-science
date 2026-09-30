---
id: tensores
titulo: Tensores
titulo_en: Tensors
alias:
  - tensor
  - arreglo multidimensional
  - fibra
  - rebanada
  - matricización
modulo: 0
submodulo: '0.3'
orden: 45
nivel: intermedio
prerrequisitos:
  - matrices-y-operaciones-con-matrices
etiquetas:
  - tensores
  - arreglos multidimensionales
  - imágenes
  - aprendizaje profundo
resumen: >
  En ciencia de datos, un tensor es un arreglo de números con varios índices: los escalares tienen cero,
  los vectores uno, las matrices dos, y una imagen a color o un lote de imágenes tienen tres o cuatro.
formula: '\mathcal{X} \in \mathbb{R}^{I \times J \times K}, \qquad x_{ijk}, \qquad \mathcal{X}_{:,j,k} \in \mathbb{R}^{I}, \qquad \mathcal{X}_{i,:,:} \in \mathbb{R}^{J \times K}'
visualizacion:
  componente: MatrixGrid
  parametros:
    modo: tensor
    forma: [2, 3, 5]
referencias:
  - clave: goodfellow
    capitulo: '2'
  - clave: murphy
publicado: true
---

## Intuición

Una hoja de cálculo tiene filas y columnas: dos índices. Si se guarda una hoja por cada mes del año, el conjunto necesita un tercer índice, el mes. Una imagen a color es igual: cada píxel tiene fila, columna y canal (rojo, verde o azul). Y un lote de imágenes agrega un cuarto índice, el número de imagen. Estos arreglos de varios índices son los tensores con los que trabajan el aprendizaje profundo y el análisis de datos multidimensionales.

El número de índices se llama orden. Fijando algunos índices y dejando correr los demás se obtienen piezas más sencillas: si solo corre uno, una fibra, que es un vector; si corren dos, una rebanada, que es una matriz. Muchos cálculos con tensores se reducen a reacomodarlos como matrices, desplegando varios índices en uno solo, para usar después todas las herramientas del álgebra matricial.

## Definición

:::definicion[Tensor de orden N]
Un **tensor** de orden $N$ es un arreglo $\mathcal{X} \in \mathbb{R}^{I_1 \times I_2 \times \dots \times I_N}$ con entradas $x_{i_1 i_2 \dots i_N}$, donde $1 \le i_n \le I_n$. Los escalares son tensores de orden 0, los vectores de orden 1 y las matrices de orden 2. La **forma** es la lista $(I_1, \dots, I_N)$ y el número de entradas es $I_1 I_2 \cdots I_N$.
:::

:::definicion[Fibras, rebanadas y despliegue]
Para $\mathcal{X} \in \mathbb{R}^{I \times J \times K}$:
- una **fibra** fija todos los índices menos uno, por ejemplo $\mathcal{X}_{:,j,k} \in \mathbb{R}^{I}$;
- una **rebanada** fija un índice, por ejemplo $\mathcal{X}_{i,:,:} \in \mathbb{R}^{J \times K}$;
- el **despliegue en el modo 1**, $X_{(1)} \in \mathbb{R}^{I \times JK}$, coloca como columnas todas las fibras del modo 1.
:::

:::nota[Qué significa cada símbolo]
- $\mathcal{X}$: tensor, escrito con letra caligráfica.
- $N$: orden, número de índices.
- $I_n$ (o $I, J, K$): tamaño del índice $n$.
- $x_{ijk}$: entrada en la posición $(i, j, k)$.
- $:$: índice que se deja correr sobre todos sus valores.
- $X_{(1)}$: despliegue del tensor como matriz en el modo 1.
:::

## Cómo usar la visualización

El tensor se dibuja como una fila de rebanadas, una por cada valor de $i$. Cada entrada muestra sus propios índices: el número 213 está en $i = 2$, $j = 1$, $k = 3$. El selector elige qué resaltar: un elemento, una fibra en cada modo o una rebanada; los controles fijan los índices. Abajo aparece el despliegue en el modo 1 con la misma selección.

Una fibra del modo 1 atraviesa todas las rebanadas en la misma posición y en el despliegue ocupa una columna completa. Una rebanada con $k$ fijo toma una columna de cada rebanada, y en el despliegue aparece como un bloque de columnas consecutivas.

## Ejemplo

Un sensor de calidad del aire registra 3 contaminantes en 4 estaciones durante 4 horas. Los datos forman un tensor $\mathcal{X} \in \mathbb{R}^{3 \times 4 \times 4}$ con índices contaminante, estación y hora.

1. Número de entradas: $3 \cdot 4 \cdot 4 = 48$.
2. La serie del contaminante 2 en la estación 1 es la fibra $\mathcal{X}_{2,1,:} \in \mathbb{R}^{4}$: sus cuatro mediciones horarias.
3. El panorama de la hora 3 es la rebanada $\mathcal{X}_{:,:,3} \in \mathbb{R}^{3 \times 4}$, una matriz contaminante por estación.
4. El despliegue $X_{(1)} \in \mathbb{R}^{3 \times 16}$ pone una fila por contaminante y 16 columnas, una por cada par estación y hora.
5. Un lote de 10 días agrega un cuarto índice: $\mathbb{R}^{10 \times 3 \times 4 \times 4}$, con 480 entradas.

:::figura[El tensor de la calidad del aire del ejemplo, de forma 3 por 4 por 4, con una rebanada por contaminante y su despliegue en una matriz de 3 por 16.]{componente="MatrixGrid"}
```yaml
modo: tensor
forma: [3, 4, 4]
```
:::

## Propiedades

- **Número de fibras y rebanadas:** un tensor de $I \times J \times K$ tiene $JK$ fibras del modo 1 y $I$ rebanadas con el primer índice fijo.
- **Producto por una matriz en un modo:** $\mathcal{Y} = \mathcal{X} \times_1 U$ multiplica todas las fibras del modo 1 por $U$; en forma desplegada, $Y_{(1)} = UX_{(1)}$.
- **Tensor de rango 1:** $\mathcal{X} = \mathbf{a} \circ \mathbf{b} \circ \mathbf{c}$ con $x_{ijk} = a_ib_jc_k$, la generalización de $\mathbf{u}\mathbf{v}^\top$.
- **Relación con Kronecker:** el despliegue de un tensor de rango 1 es $\mathbf{a}(\mathbf{c} \otimes \mathbf{b})^\top$.
- **Descomposiciones:** las descomposiciones CP y de Tucker generalizan la SVD a tensores, aunque el rango de un tensor es mucho más difícil de calcular que el de una matriz.

:::demostracion
Número de entradas: cada entrada queda determinada por la elección independiente de $i_1, \dots, i_N$, así que por el principio del producto hay $I_1 I_2 \cdots I_N$ entradas.
:::

## Errores comunes

- **Confundir el orden con la dimensión.** Un vector de $\mathbb{R}^{100}$ es un tensor de orden 1, aunque tenga 100 componentes.
- **Desplegar con un orden de índices y reconstruir con otro.** Las convenciones de despliegue varían; mezclarlas desordena los datos.
- **Suponer que todo lo de matrices se generaliza igual.** El rango de un tensor puede ser mayor que todas sus dimensiones y encontrar la mejor aproximación de bajo rango puede no tener solución.
- **Confundir el tensor de la física con el arreglo de datos.** En física un tensor es un objeto con reglas de cambio de coordenadas; en datos suele ser simplemente un arreglo multidimensional.

## Conexiones

Los tensores extienden las [[matrices-y-operaciones-con-matrices|matrices]] a más de dos índices, y el [[producto-de-kronecker]] aparece al desplegarlos. Las ideas de [[descomposicion-en-valores-singulares]] y [[aproximacion-de-bajo-rango]] tienen versiones tensoriales. En aprendizaje profundo, las entradas, los pesos de las capas convolucionales y los lotes de datos son tensores de orden 3 o 4.

## Formulario

:::formula[Tensor de orden 3]
$$
\mathcal{X} \in \mathbb{R}^{I \times J \times K}, \qquad \#\text{entradas} = IJK
$$

- $I, J, K$: tamaños de cada índice.
:::

:::formula[Fibras y rebanadas]
$$
\mathcal{X}_{:,j,k} \in \mathbb{R}^{I}, \qquad \mathcal{X}_{i,:,:} \in \mathbb{R}^{J \times K}
$$

- $:$: índice libre.
- $i, j, k$: índices fijos.
:::

:::formula[Despliegue y producto en un modo]
$$
X_{(1)} \in \mathbb{R}^{I \times JK}, \qquad (\mathcal{X} \times_1 U)_{(1)} = U X_{(1)}
$$

- $X_{(1)}$: despliegue en el modo 1.
- $U$: matriz que actúa sobre el primer índice.
:::

:::formula[Tensor de rango 1]
$$
x_{ijk} = a_i\,b_j\,c_k
$$

- $\mathbf{a}, \mathbf{b}, \mathbf{c}$: vectores de tamaños $I$, $J$ y $K$.
:::
