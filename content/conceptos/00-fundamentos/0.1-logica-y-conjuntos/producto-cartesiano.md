---
id: producto-cartesiano
titulo: Producto cartesiano
titulo_en: Cartesian product
alias:
  - pares ordenados
  - producto de conjuntos
modulo: 0
submodulo: '0.1'
orden: 8
nivel: basico
prerrequisitos:
  - conjuntos-y-notacion
etiquetas:
  - conjuntos
  - pares ordenados
  - producto
  - conteo
resumen: >
  El producto cartesiano de A y B es el conjunto de todos los pares ordenados (a, b) con a en A y b en B.
  Si ambos son finitos, tiene |A| por |B| elementos.
formula: 'A \times B = \{(a, b) : a \in A,\ b \in B\}'
visualizacion:
  componente: SetStructures
  parametros:
    modo: producto
    a: ['S', 'M', 'L']
    b: ['rojo', 'azul', 'negro']
    nombres: ['T', 'C']
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una tienda de ropa vende una playera en tres tallas y tres colores. Para acomodar el inventario, el encargado arma una tabla con las tallas en las filas y los colores en las columnas. Cada casilla corresponde a una variante concreta del producto: talla M en color azul, talla L en color negro. La tabla tiene tantas casillas como tallas por colores, nueve en total, y cada variante aparece exactamente una vez.

Esa tabla es el producto cartesiano de los dos conjuntos. Sus elementos son pares en los que el orden importa: primero la talla y después el color. Un par como (M, azul) no es un conjunto de dos cosas sino una combinación con posiciones fijas; por eso el producto de tallas por colores y el de colores por tallas contienen la misma información, pero no son el mismo conjunto.

El plano cartesiano, formado por pares de números reales, es el ejemplo más conocido, y de ahí toma su nombre.

## Definición

Un **par ordenado** $(a, b)$ cumple que $(a, b) = (c, d)$ si y solo si $a = c$ y $b = d$.

:::definicion[Producto cartesiano]
Para conjuntos $A$ y $B$,
$$
A \times B = \{(a, b) : a \in A,\ b \in B\}.
$$
Más generalmente, $A_1 \times \dots \times A_n = \{(a_1, \dots, a_n) : a_i \in A_i\}$, y $A^n$ denota $A \times \dots \times A$ con $n$ factores.
:::

Si $A$ y $B$ son finitos, $|A \times B| = |A| \cdot |B|$. Si alguno es vacío, el producto es vacío.

## Cómo usar la visualización

Las filas son los elementos de $T$ (tallas) y las columnas los de $C$ (colores). La reproducción forma los pares uno a uno, recorriendo cada fila completa antes de pasar a la siguiente, y el panel lleva la cuenta junto con el producto $|T| \cdot |C|$.

Los controles reducen el número de elementos de cada conjunto: con una sola talla la tabla se vuelve una fila y el total es igual al número de colores. El interruptor muestra $C \times T$: la tabla se transpone y los pares aparecen con el color primero, lo que ilustra que el producto no es conmutativo aunque ambos tengan la misma cardinalidad.

## Ejemplo

Un estudio clínico asigna a cada participante un medicamento $M = \{\text{placebo}, \text{dosis baja}, \text{dosis alta}\}$ y un horario $H = \{\text{mañana}, \text{noche}\}$.

1. Los tratamientos posibles son $M \times H$, con $|M \times H| = 3 \cdot 2 = 6$ combinaciones.
2. Por extensión: (placebo, mañana), (placebo, noche), (dosis baja, mañana), (dosis baja, noche), (dosis alta, mañana), (dosis alta, noche).
3. Si además se registra el sexo $S = \{F, M\}$, las celdas del diseño son $M \times H \times S$, con $3 \cdot 2 \cdot 2 = 12$ ternas.
4. Si cada celda debe tener 10 participantes, el estudio necesita $12 \cdot 10 = 120$ personas.

:::figura[Los tratamientos del estudio como producto cartesiano $M \times H$: cada casilla es un par (medicamento, horario) y hay $3 \cdot 2 = 6$.]{componente="SetStructures"}
```yaml
modo: producto
a: [placebo, dosis baja, dosis alta]
b: [mañana, noche]
nombres: [M, H]
```
:::

:::figura[Al agregar el sexo, las celdas del diseño son las ternas de $M \times H \times S$. El árbol muestra cómo cada nivel multiplica el número de ramas: $3 \cdot 2 \cdot 2 = 12$ hojas.]{componente="CombinatoricsBoard"}
```yaml
modo: arbol
etapas:
  - nombre: medicamento
    opciones: [placebo, baja, alta]
  - nombre: horario
    opciones: [mañana, noche]
  - nombre: sexo
    opciones: [F, M]
```
:::

## Propiedades

- **No conmutativo:** $A \times B \neq B \times A$ salvo que $A = B$ o alguno sea vacío, aunque siempre $|A \times B| = |B \times A|$.
- **Distributivo respecto a unión e intersección:** $A \times (B \cup C) = (A \times B) \cup (A \times C)$ y $A \times (B \cap C) = (A \times B) \cap (A \times C)$.
- **Vacío:** $A \times \varnothing = \varnothing$.
- **Cardinalidad:** $|A_1 \times \dots \times A_n| = |A_1| \cdots |A_n|$; esta es la regla del producto del conteo.
- Un subconjunto de $A \times B$ es una relación de $A$ en $B$.

:::demostracion
Para la cardinalidad, cada $a \in A$ produce una fila de $|B|$ pares distintos, y filas de elementos distintos son disjuntas porque difieren en la primera coordenada. Sumando $|A|$ filas de tamaño $|B|$ se obtiene $|A| \cdot |B|$.
:::

## Errores comunes

- **Tratar los pares como conjuntos.** $(1, 2) \neq (2, 1)$, mientras que $\{1, 2\} = \{2, 1\}$.
- **Sumar en lugar de multiplicar.** Tres tallas y tres colores dan 9 variantes, no 6.
- **Creer que $A \times A$ solo contiene pares de elementos distintos.** Incluye los pares $(a, a)$ de la diagonal.
- **Confundir $\mathbb{R}^2$ con $\mathbb{R}$ duplicado.** $\mathbb{R}^2 = \mathbb{R} \times \mathbb{R}$ es el conjunto de puntos del plano.

:::figura[$A \times A$ como puntos del plano para $A = \{1, \dots, 5\}$. La relación "menor o igual" es un subconjunto de esos 25 pares que incluye a los de la diagonal $(a, a)$; al cambiar de relación se ve que el par $(1, 2)$ y el par $(2, 1)$ son puntos distintos.]{componente="RelationViz"}
```yaml
elementos: [1, 2, 3, 4, 5]
relacion: menor-o-igual
relaciones: [menor-o-igual, menor, misma-paridad]
vista: plano
```
:::

## Conexiones

El producto cartesiano se construye a partir de [[conjuntos-y-notacion]]. Una función es un subconjunto especial de $A \times B$, como se ve en [[funciones]], y las [[relaciones-y-relaciones-de-equivalencia|relaciones]] son subconjuntos arbitrarios de $A \times A$. En probabilidad, el espacio muestral de experimentos repetidos es un producto cartesiano, y su cardinalidad es la regla del producto de la combinatoria.
