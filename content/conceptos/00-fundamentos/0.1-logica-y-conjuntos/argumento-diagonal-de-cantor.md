---
id: argumento-diagonal-de-cantor
titulo: Argumento diagonal de Cantor
titulo_en: Cantor's diagonal argument
alias:
  - diagonal de Cantor
  - diagonalización
  - no numerabilidad de los reales
modulo: 0
submodulo: '0.1'
orden: 15
nivel: intermedio
prerrequisitos:
  - cardinalidad-finita-numerable-y-no-numerable
relaciones:
  - tipo: relacionado
    id: conjunto-potencia
etiquetas:
  - cardinalidad
  - infinito
  - demostración por contradicción
  - números reales
  - diagonalización
resumen: >
  Dada cualquier lista de sucesiones binarias infinitas, cambiar el i-ésimo dígito de la i-ésima sucesión
  produce una sucesión que no está en la lista. Por eso esas sucesiones, y los reales, no son numerables.
formula: 'd_i = 1 - s_{i,i} \ \Rightarrow\ d \neq s_i \ \ \forall i'
visualizacion:
  componente: CantorDiagonal
  parametros:
    filas: 6
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Un club afirma tener un registro con las preferencias de todas las posibles personas: para cada persona hay una ficha con una cadena infinita de respuestas "sí" o "no" a las preguntas 1, 2, 3, ... Alguien propone construir una cadena que, con toda seguridad, no esté en el registro. La receta es simple: para la pregunta 1, contestar lo contrario de lo que contestó la ficha 1; para la pregunta 2, lo contrario de la ficha 2; y así con cada pregunta.

La cadena nueva no puede ser la ficha 1, porque difiere de ella en la pregunta 1. No puede ser la ficha 2, porque difiere en la pregunta 2. En general, no coincide con la ficha número $i$ porque difiere en la pregunta $i$. Así, el registro no estaba completo, y como la receta funciona con cualquier registro, ninguna lista numerada puede contener todas las cadenas.

El truco consiste en recorrer la diagonal de la tabla, donde la fila y la columna coinciden, y cambiar cada dígito que aparece ahí.

## Definición

Sea $S = \{0, 1\}^{\mathbb{N}}$ el conjunto de sucesiones binarias infinitas.

:::teorema[Cantor]
$S$ es no numerable: para toda sucesión $s_1, s_2, s_3, \dots$ de elementos de $S$ existe $d \in S$ distinta de todas las $s_i$.
:::

:::demostracion
Escribimos $s_i = (s_{i,1}, s_{i,2}, \dots)$ y definimos $d_j = 1 - s_{j,j}$. Para cada $i$, $d_i \neq s_{i,i}$, así que $d$ y $s_i$ difieren en la posición $i$ y $d \neq s_i$. Por tanto $d$ no aparece en la lista, y ninguna función de $\mathbb{N}$ en $S$ es suprayectiva.
:::

La misma construcción, aplicada a desarrollos decimales en $(0, 1)$ y cambiando cada dígito diagonal por otro distinto de 0 y de 9, muestra que $\mathbb{R}$ es no numerable. Evitar 0 y 9 impide que el número nuevo tenga dos desarrollos, como $0.1999\ldots = 0.2$.

## Cómo usar la visualización

Cada fila es una sucesión de la lista supuesta, de la que se ven los primeros dígitos. La reproducción recorre la diagonal: resalta el dígito $(i, i)$ y escribe su opuesto como el dígito $i$ de la sucesión nueva. Al terminar, el panel muestra que la sucesión nueva difiere de cada fila en su posición diagonal.

Un clic sobre cualquier dígito de la tabla lo cambia, como si se intentara arreglar la lista para incluir la sucesión nueva. El control del número de filas y la semilla generan otras listas. En todos los casos la construcción vuelve a producir una sucesión ausente, porque modificar la lista cambia también la diagonal.

## Ejemplo

Supongamos una lista cuyas primeras filas son:

| $i$ | $s_i$ |
| --- | --- |
| 1 | **0** 1 1 0 1 ... |
| 2 | 1 **1** 0 0 1 ... |
| 3 | 0 0 **0** 1 1 ... |
| 4 | 1 0 1 **1** 0 ... |
| 5 | 0 1 0 0 **0** ... |

1. Los dígitos diagonales son $0, 1, 0, 1, 0$.
2. Se invierten: $d = 1, 0, 1, 0, 1, \dots$
3. $d$ difiere de $s_1$ en la posición 1, de $s_2$ en la 2, y así sucesivamente.
4. Si alguien agrega $d$ como nueva fila 1 y recorre la lista, la diagonal cambia y produce otra sucesión ausente.

:::figura[La lista del ejemplo. La construcción recorre la diagonal, invierte cada dígito y produce $d = 1, 0, 1, 0, 1, \dots$; al cambiar cualquier dígito de la lista con un clic, la nueva diagonal produce otra sucesión ausente.]{componente="CantorDiagonal"}
```yaml
lista:
  - [0, 1, 1, 0, 1]
  - [1, 1, 0, 0, 1]
  - [0, 0, 0, 1, 1]
  - [1, 0, 1, 1, 0]
  - [0, 1, 0, 0, 0]
```
:::

## Propiedades

- **Teorema de Cantor general:** ninguna función $f: A \to \mathcal{P}(A)$ es suprayectiva. El conjunto $D = \{a \in A : a \notin f(a)\}$ cumple el papel de la sucesión diagonal.
- $\{0, 1\}^{\mathbb{N}}$, $\mathcal{P}(\mathbb{N})$, $(0, 1)$ y $\mathbb{R}$ tienen la misma cardinalidad.
- La diagonalización es una técnica general: aparece en la demostración de que existen problemas que ninguna computadora puede resolver y en los teoremas de incompletitud.
- El argumento no se aplica a los racionales: el número diagonal puede ser irracional, así que no contradice la numerabilidad de $\mathbb{Q}$.

:::demostracion
Para el caso general, si $f(a_0) = D$ para algún $a_0$, entonces $a_0 \in D$ si y solo si $a_0 \notin f(a_0) = D$, una contradicción. Por tanto $D$ no está en la imagen de $f$.
:::

## Errores comunes

- **Pensar que basta agregar $d$ a la lista.** La lista nueva tiene otra diagonal y el argumento produce otra sucesión ausente.
- **Creer que el argumento demuestra que la lista es mala.** Demuestra que toda lista falla, porque la construcción no depende de cuál sea.
- **Aplicarlo a los decimales sin cuidar la doble representación.** Sin evitar 0 y 9, el número construido podría coincidir con uno de la lista escrito de otra forma.
- **Concluir que $\mathbb{Q}$ es no numerable con el mismo argumento.** El número construido no tiene por qué ser racional.

## Conexiones

El argumento completa la clasificación de [[cardinalidad-finita-numerable-y-no-numerable]] y es la misma idea que muestra que el [[conjunto-potencia]] es siempre más grande que el conjunto original. Es una demostración por contradicción que usa [[cuantificadores-universal-y-existencial|cuantificadores]] en el orden "para toda lista existe una sucesión ausente". La no numerabilidad de los reales explica por qué las variables aleatorias continuas asignan probabilidad cero a cada punto individual.
