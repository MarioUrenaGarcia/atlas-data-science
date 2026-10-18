---
id: embeddings-de-variables-categoricas
titulo: Embeddings de variables categóricas
titulo_en: Categorical embeddings
alias:
  - entity embeddings
  - vectores aprendidos de categorías
  - incrustaciones de categorías
modulo: 12
submodulo: '12.3'
orden: 12
nivel: intermedio
prerrequisitos:
  - codificacion-one-hot
  - similitud-coseno
  - descenso-de-gradiente
etiquetas:
  - variables categóricas
  - representación
  - descenso de gradiente
  - similitud
resumen: >
  Un embedding asigna a cada categoría un vector denso de pocas dimensiones aprendido de los datos, de modo
  que categorías que se comportan parecido quedan cerca; a diferencia de one-hot, codifica similitud.
formula: 'L = \sum_{i < j} \left(s_{ij} - \mathbf{e}_i^\top \mathbf{e}_j\right)^2'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: embedding
    pasos: 300
referencias:
  - clave: goodfellow
  - clave: murphy
publicado: true
---

## Intuición

En la codificación one-hot, café, pan dulce y carbón son tres columnas independientes: cada producto está a la misma distancia de todos los demás. Pero quien compra café suele comprar pan dulce, y quien compra carbón suele llevar carne y tortillas. Esa información sobre qué productos se parecen se pierde.

Un **embedding** representa cada categoría con un vector corto de números reales, por ejemplo de dos dimensiones, cuyas coordenadas no se fijan a mano sino que se aprenden. Se parte de vectores pequeños al azar y se ajustan con descenso de gradiente para que el producto punto entre dos productos refleje cuánto se compran juntos. Al terminar, los productos del desayuno apuntan en una dirección, los de la carne asada en otra y los de lavandería en una tercera. Un modelo que reciba esos vectores puede aprovechar que café y pan dulce se parecen, aunque haya visto pocos datos de uno de ellos. Los embeddings se aprenden también dentro de una red neuronal, como una capa más que se entrena junto con el resto del modelo.

## Definición

:::definicion[Embedding de una variable categórica]
Un **embedding** de dimensión $d$ es una matriz $\mathbf{E} \in \mathbb{R}^{K \times d}$ cuya fila $\mathbf{e}_c$ representa a la categoría $c$, con $d$ mucho menor que $K$. Equivale a multiplicar el vector one-hot por la matriz: $\mathbf{e}_c = \mathbf{E}^\top \mathbf{u}_c$. Las filas se aprenden minimizando una pérdida; en la visualización, la que aproxima una matriz de similitud $s_{ij}$ con productos punto:

$$
L(\mathbf{E}) = \sum_{i < j} \left(s_{ij} - \mathbf{e}_i^\top \mathbf{e}_j\right)^2, \qquad \mathbf{e}_i \leftarrow \mathbf{e}_i - \eta\,\nabla_{\mathbf{e}_i} L .
$$
:::

:::nota[Qué significa cada símbolo]
- $K$: número de categorías; $d$: dimensión del embedding.
- $\mathbf{E}$: matriz de embeddings, una fila por categoría.
- $\mathbf{e}_c$, $\mathbf{e}_i$: vector de la categoría $c$ o $i$.
- $\mathbf{u}_c$: vector one-hot de la categoría $c$.
- $s_{ij}$: similitud objetivo entre las categorías $i$ y $j$; aquí, $1$ si suelen comprarse juntas y $-0.4$ si no.
- $\mathbf{e}_i^\top \mathbf{e}_j$: producto punto de los dos vectores.
- $L$: pérdida que se minimiza.
- $\eta$: tasa de aprendizaje.
- $\nabla_{\mathbf{e}_i} L$: gradiente de la pérdida respecto al vector de la categoría $i$.
:::

## Cómo usar la visualización

Cada punto es un producto, coloreado según el grupo de compras al que pertenece, y la línea que lo une con el origen es su vector. Al reproducir, el descenso de gradiente mueve los vectores desde posiciones aleatorias cercanas al origen; el encabezado muestra la pérdida en cada paso. Las lecturas comparan el coseno entre café y pan dulce, que tiende a 1, con el de café y carbón, que se vuelve negativo, y recuerdan que con one-hot todas las parejas están a la misma distancia, $\sqrt{2}$.

Experimentos sugeridos: cambiar la semilla y observar que los grupos aparecen en otras direcciones pero con la misma separación; pausar a los pocos pasos para ver los vectores todavía mezclados.

## Ejemplo

Tres productos tienen vectores café $(1, 0)$, pan dulce $(0.9, 0.4)$ y carbón $(-0.5, 0.85)$. Las similitudes objetivo son $1$ entre café y pan, y $-0.4$ en los otros dos pares.

1. Café y pan: $\mathbf{e}^\top\mathbf{e} = 0.9$; error al cuadrado $(1 - 0.9)^2 = 0.01$.
2. Café y carbón: $-0.5$; error $(-0.4 + 0.5)^2 = 0.01$.
3. Pan y carbón: $0.9(-0.5) + 0.4(0.85) = -0.11$; error $(-0.4 + 0.11)^2 = 0.0841$.
4. Pérdida: $L = 0.01 + 0.01 + 0.0841 = 0.1041$. El gradiente empujará al pan y al carbón a separarse más.
5. Coseno entre café y pan: $0.9/(1 \cdot \sqrt{0.81 + 0.16}) = 0.914$.

:::figura[Con solo 10 pasos de descenso de gradiente, los vectores siguen cerca de su posición inicial: café y pan dulce todavía apuntan en direcciones casi opuestas y la pérdida apenas bajó.]{componente="FeatureEngineeringViz"}
```yaml
modo: embedding
pasos: 10
```
:::

## Propiedades

- **Codifica similitud.** Categorías con comportamiento parecido terminan con vectores parecidos, algo que one-hot no puede representar.
- **Es compacto.** Con $K$ categorías y dimensión $d$ se aprenden $K d$ números; para miles de categorías basta un $d$ de decenas.
- **No es único.** Cualquier rotación de todos los vectores deja igual los productos punto, así que las coordenadas individuales no tienen significado; solo importan las relaciones entre vectores.

:::figura[Otra semilla y 600 pasos: los tres grupos aparecen en direcciones distintas a las de la visualización principal, con la misma separación entre ellos.]{componente="FeatureEngineeringViz"}
```yaml
modo: embedding
pasos: 600
semilla: 77
```
:::

## Errores comunes

- **Interpretar cada coordenada como una característica con significado.** Por la invariancia a rotaciones, "la componente 1" no mide nada en particular.
- **Aprender embeddings con pocas observaciones por categoría.** Una categoría vista dos veces recibe un vector casi aleatorio; conviene agrupar las raras o compartir información con categorías parecidas.
- **Evaluar con los mismos datos con que se aprendieron.** Los embeddings son parámetros entrenados; si se aprenden con los datos de prueba, la evaluación queda optimista.

:::figura[Error de interpretar las coordenadas: con otra semilla, los tres grupos quedan en direcciones distintas de las de la visualización principal; lo que se conserva son los cosenos entre productos, no el significado de cada eje.]{componente="FeatureEngineeringViz"}
```yaml
modo: embedding
pasos: 300
semilla: 5
```
:::

## Conexiones

Generaliza la [[codificacion-one-hot]]: el embedding es el producto de la matriz $\mathbf{E}$ por el vector one-hot. Las relaciones entre vectores se miden con el [[producto-punto]] y la [[similitud-coseno]], y la pérdida se minimiza con [[descenso-de-gradiente]]. Aproximar una matriz de similitudes con productos punto de pocas dimensiones es la idea de la [[aproximacion-de-bajo-rango]]. Para muchas categorías sin aprendizaje, la alternativa es el [[truco-de-hashing]].

## Formulario

:::formula[Embedding como producto de matrices]
$$
\mathbf{e}_c = \mathbf{E}^\top \mathbf{u}_c
$$

- $\mathbf{E}$: matriz de embeddings de $K \times d$.
- $\mathbf{u}_c$: vector one-hot de la categoría $c$.
:::

:::formula[Pérdida de similitud]
$$
L = \sum_{i < j} \left(s_{ij} - \mathbf{e}_i^\top \mathbf{e}_j\right)^2
$$

- $L$: pérdida total que se minimiza.
- $s_{ij}$: similitud objetivo entre las categorías $i$ y $j$.
- $\mathbf{e}_i$, $\mathbf{e}_j$: vectores aprendidos de las categorías $i$ y $j$.
- $\mathbf{e}_i^\top \mathbf{e}_j$: producto punto de los vectores aprendidos.
- $i < j$: la suma recorre cada par de categorías una vez.
:::

:::formula[Paso de descenso de gradiente]
$$
\mathbf{e}_i \leftarrow \mathbf{e}_i + 2\eta \sum_{j \ne i} \left(s_{ij} - \mathbf{e}_i^\top \mathbf{e}_j\right)\mathbf{e}_j
$$

- $\mathbf{e}_i$: vector de la categoría $i$, que se actualiza; $\mathbf{e}_j$: vectores de las demás.
- $s_{ij}$: similitud objetivo entre las categorías $i$ y $j$.
- $\eta$: tasa de aprendizaje.
- La suma recorre todas las demás categorías.
:::

:::formula[Coseno entre dos categorías]
$$
\cos\theta_{ij} = \frac{\mathbf{e}_i^\top \mathbf{e}_j}{\lVert \mathbf{e}_i \rVert\,\lVert \mathbf{e}_j \rVert}
$$

- $\theta_{ij}$: ángulo entre los vectores de las categorías $i$ y $j$.
:::
