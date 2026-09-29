---
id: principio-del-producto
titulo: Principio del producto
titulo_en: Rule of product
alias:
  - regla del producto
  - principio multiplicativo
  - principio fundamental del conteo
modulo: 0
submodulo: '0.2'
orden: 2
nivel: basico
prerrequisitos:
  - producto-cartesiano
  - principio-de-la-suma
etiquetas:
  - conteo
  - árbol de conteo
  - elecciones sucesivas
  - producto cartesiano
resumen: >
  Si una tarea consiste en etapas sucesivas y cada etapa admite un número fijo de opciones sin importar
  lo elegido antes, el número total de resultados es el producto de esos números.
formula: '|A_1 \times A_2 \times \dots \times A_k| = |A_1| \cdot |A_2| \cdots |A_k|'
visualizacion:
  componente: CombinatoricsBoard
  parametros:
    modo: arbol
    etapas:
      - nombre: entrada
        opciones: [sopa, ensalada]
      - nombre: plato fuerte
        opciones: [pollo, pescado, pasta]
      - nombre: postre
        opciones: [flan, fruta]
referencias:
  - clave: ross-probabilidad
    capitulo: '1'
publicado: true
---

## Intuición

Una fonda ofrece un menú del día con dos entradas, tres platos fuertes y dos postres, y cada comensal elige uno de cada tipo. Para contar los menús distintos se puede imaginar un árbol: de la raíz salen dos ramas, una por entrada; de cada una salen tres, una por plato fuerte; y de cada una de esas salen dos, una por postre. Cada camino de la raíz a una hoja es un menú completo, y el árbol tiene $2 \cdot 3 \cdot 2 = 12$ hojas.

Lo importante es que el número de ramas en cada nivel no depende del camino recorrido: sin importar la entrada, siempre hay tres platos fuertes disponibles. Cuando eso ocurre, el número total de resultados es el producto del número de opciones en cada etapa. El orden de las etapas no altera el total, y agregar una etapa multiplica todo lo anterior por su número de opciones, lo que explica por qué los conteos crecen tan rápido.

## Definición

:::teorema[Principio del producto]
Si una tarea se realiza en $k$ etapas sucesivas y, para cualquier elección hecha en las etapas anteriores, la etapa $i$ admite exactamente $n_i$ opciones, entonces la tarea admite
$$
n_1 \cdot n_2 \cdots n_k
$$
resultados distintos. En particular, para conjuntos finitos, $|A_1 \times \dots \times A_k| = |A_1| \cdots |A_k|$.
:::

La condición esencial es que el **número** de opciones de cada etapa sea el mismo para todas las elecciones previas, aunque las opciones concretas cambien.

## Cómo usar la visualización

El árbol tiene un nivel por etapa: la raíz arriba y los menús completos en las hojas, numeradas abajo. La reproducción traza los caminos uno por uno, resaltando el último; el panel muestra el producto de las opciones y el menú trazado. Los controles reducen el número de opciones de cada etapa.

Al bajar las opciones de postre de 2 a 1, cada rama del nivel intermedio deja de bifurcarse y el total baja a la mitad, de 12 a 6. Al dejar una sola entrada, el árbol completo se convierte en uno de los subárboles del caso original.

## Ejemplo

Las placas de un estado se forman con tres letras (de 26) seguidas de cuatro dígitos (de 10), con repetición permitida.

1. Hay siete etapas: tres de letras y cuatro de dígitos.
2. Cada letra tiene 26 opciones y cada dígito 10, sin importar lo elegido antes.
3. Por el principio del producto, hay $26^3 \cdot 10^4 = 17576 \cdot 10000 = 175760000$ placas.
4. Si no se permiten letras repetidas, las etapas de letras tienen 26, 25 y 24 opciones: $26 \cdot 25 \cdot 24 \cdot 10^4 = 156000000$ placas. El número de opciones de cada etapa sigue siendo fijo, aunque las opciones concretas dependan de lo ya elegido.

:::figura[Las placas del ejemplo como siete casillas. Cada casilla multiplica el conteo por su número de opciones; al prohibir letras repetidas solo cambian las tres primeras casillas, y las barras comparan ambos totales en escala logarítmica.]{componente="CombinatoricsBoard"}
```yaml
modo: casillas
escenarios:
  - nombre: Letras repetibles
    casillas:
      - etiqueta: letra
        opciones: 26
      - etiqueta: letra
        opciones: 26
      - etiqueta: letra
        opciones: 26
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
  - nombre: Letras sin repetir
    casillas:
      - etiqueta: letra
        opciones: 26
      - etiqueta: letra
        opciones: 25
      - etiqueta: letra
        opciones: 24
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
      - etiqueta: dígito
        opciones: 10
```
:::

## Propiedades

- **Palabras de longitud $k$:** con $n$ símbolos y repetición hay $n^k$ palabras.
- **Subconjuntos:** un conjunto de $n$ elementos tiene $2^n$ subconjuntos, uno por cada serie de $n$ decisiones de sí o no.
- **Funciones:** hay $|B|^{|A|}$ funciones de $A$ en $B$, porque cada elemento de $A$ elige su imagen de forma independiente.
- **Combinación con la suma:** en problemas con casos se multiplica dentro de cada caso y se suman los casos.

:::demostracion
Para dos etapas: los resultados son los pares $(x, y)$ con $x$ entre las $n_1$ opciones de la primera etapa. Para cada $x$ fijo hay $n_2$ pares, y los grupos correspondientes a distintos $x$ son disjuntos. Por el principio de la suma, el total es $n_2 + \dots + n_2 = n_1 n_2$. El caso de $k$ etapas sigue por inducción.
:::

## Errores comunes

- **Multiplicar cuando el número de opciones depende de elecciones previas.** Si el postre gratis solo aplica con pescado, las ramas no tienen el mismo tamaño y hay que separar en casos.
- **Contar resultados que no son distintos.** Elegir "primero Ana y luego Beto" y "primero Beto y luego Ana" da el mismo equipo si el orden no importa; el producto cuenta ambos.
- **Confundir con la suma.** Si se elige un solo platillo de entre dos listas, se suman las opciones; si se elige uno de cada lista, se multiplican.

## Conexiones

El principio del producto es la cardinalidad del [[producto-cartesiano]] y su demostración usa el [[principio-de-la-suma]]. De él se derivan el [[factorial]], las [[permutaciones]] y las [[variaciones]]. Los árboles de conteo de la visualización reaparecen en probabilidad como árboles de probabilidad, donde cada rama lleva una probabilidad en lugar de contar una opción.
