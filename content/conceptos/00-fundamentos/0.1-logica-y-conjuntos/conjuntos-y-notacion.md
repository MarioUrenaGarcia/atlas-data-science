---
id: conjuntos-y-notacion
titulo: Conjuntos y notación
titulo_en: Sets and set notation
alias:
  - notación por comprensión
  - notación por extensión
  - pertenencia
modulo: 0
submodulo: '0.1'
orden: 4
nivel: basico
prerrequisitos:
  - cuantificadores-universal-y-existencial
etiquetas:
  - conjuntos
  - pertenencia
  - notación
  - subconjunto
resumen: >
  Un conjunto es una colección de objetos bien definida. Se describe por extensión, listando sus
  elementos, o por comprensión, con una propiedad que solo sus elementos cumplen.
formula: 'A = \{x \in U : P(x)\}'
visualizacion:
  componente: SetStructures
  parametros:
    modo: notacion
    universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    predicado: divisible-entre-3
    predicados:
      - divisible-entre-3
      - par
      - primo
      - cuadrado
      - menor-que
    k: 8
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una biblioteca escolar necesita separar los libros que deben repararse. Hay dos maneras de comunicar cuáles son. La primera es entregar una lista con los títulos: "El principito, Pedro Páramo, Rayuela". La segunda es dar una regla: "todos los libros con el lomo despegado". La lista funciona cuando son pocos; la regla funciona siempre, incluso si hay miles o si nadie los ha contado todavía.

Un conjunto es justamente una colección con un criterio claro para decidir quién pertenece y quién no. No importa el orden en que se mencionen los elementos ni si alguno se menciona dos veces: la lista de libros a reparar es la misma se escriba como se escriba. Lo único que define al conjunto es qué objetos están dentro.

La notación matemática formaliza esas dos maneras de describirlo, la lista y la regla, y agrega símbolos para decir que un objeto pertenece o no pertenece, y que un conjunto está contenido en otro.

## Definición

Un **conjunto** es una colección de objetos, llamados **elementos**, tal que para cualquier objeto $x$ está determinado si $x$ pertenece al conjunto. Se escribe $x \in A$ si $x$ pertenece a $A$ y $x \notin A$ si no.

- **Por extensión:** se listan los elementos entre llaves, $A = \{3, 6, 9\}$.
- **Por comprensión:** dado un conjunto universal $U$ y un predicado $P$, $A = \{x \in U : P(x)\}$ es el conjunto de los elementos de $U$ que cumplen $P$.

:::definicion[Igualdad y contención]
$A = B$ si y solo si tienen los mismos elementos: $\forall x\,(x \in A \leftrightarrow x \in B)$. $A$ es **subconjunto** de $B$, $A \subseteq B$, si $\forall x\,(x \in A \rightarrow x \in B)$. El **conjunto vacío** $\varnothing$ no tiene elementos. La **cardinalidad** $|A|$ de un conjunto finito es su número de elementos.
:::

Conjuntos numéricos usuales: $\mathbb{N} = \{1, 2, 3, \dots\}$, $\mathbb{Z}$ (enteros), $\mathbb{Q}$ (racionales) y $\mathbb{R}$ (reales).

:::nota[Qué significa cada símbolo]
- $A, B, F, G$: conjuntos.
- $x$: un objeto cualquiera.
- $x \in A$: $x$ pertenece a $A$; $x \notin A$: no pertenece.
- $U$: conjunto universal, de donde se toman los elementos.
- $P(x)$: propiedad que define al conjunto por comprensión.
- $\{\ \dots\ \}$: llaves que encierran los elementos o la regla.
- $A \subseteq B$: $A$ es subconjunto de $B$.
- $\varnothing$: conjunto vacío.
- $|A|$: cardinalidad, número de elementos de $A$.
- $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$: naturales, enteros, racionales y reales.
:::

## Cómo usar la visualización

La fila superior es el conjunto universal $U$. La reproducción revisa cada elemento, lo compara con la propiedad elegida y, si la cumple, lo desplaza dentro del recuadro $A$. Arriba se muestra la notación por comprensión junto a la notación por extensión que se va completando. El panel indica la pertenencia del elemento actual y la cardinalidad.

Al cambiar la propiedad de "múltiplo de 3" a "x es un cuadrado perfecto" el conjunto se reduce a cuatro elementos. Con "x < k" y k igual a 1 el recuadro queda vacío al final: la descripción por comprensión sigue siendo válida aunque defina el conjunto vacío.

## Ejemplo

Un hospital registra la temperatura de 8 pacientes en grados: $U = \{36.5, 38.2, 37.0, 39.1, 36.8, 38.0, 37.6, 40.2\}$. Se considera fiebre una temperatura de al menos 38 grados.

1. Por comprensión: $F = \{t \in U : t \ge 38\}$.
2. Revisando elemento por elemento, $F = \{38.2, 39.1, 38.0, 40.2\}$ por extensión.
3. $|F| = 4$, $38.0 \in F$ y $37.6 \notin F$.
4. Si $G = \{t \in U : t \ge 39\} = \{39.1, 40.2\}$, entonces $G \subseteq F$, porque toda temperatura de al menos 39 es también de al menos 38.

:::figura[Las temperaturas del ejemplo sobre la recta. Cada valor se revisa y se copia a los renglones de los conjuntos cuya condición cumple; al terminar, todos los puntos de $G$ aparecen también en $F$, lo que muestra $G \subseteq F$.]{componente="SetStructures"}
```yaml
modo: recta
valores: [36.5, 38.2, 37.0, 39.1, 36.8, 38.0, 37.6, 40.2]
conjuntos:
  - etiqueta: F
    desde: 38
  - etiqueta: G
    desde: 39
unidad: grados
```
:::

## Propiedades

- El orden y las repeticiones no importan: $\{1, 2, 2\} = \{2, 1\}$.
- $\varnothing \subseteq A$ y $A \subseteq A$ para todo conjunto $A$.
- **Doble contención:** $A = B$ si y solo si $A \subseteq B$ y $B \subseteq A$. Es la forma habitual de demostrar igualdades.
- La contención es transitiva: si $A \subseteq B$ y $B \subseteq C$, entonces $A \subseteq C$.
- Distinguir $\in$ de $\subseteq$: $2 \in \{1, 2\}$ pero $\{2\} \subseteq \{1, 2\}$.

:::demostracion
Para $\varnothing \subseteq A$ hay que ver que $\forall x\,(x \in \varnothing \rightarrow x \in A)$. Como $x \in \varnothing$ es falsa para todo $x$, cada condicional tiene antecedente falso y es verdadero.
:::

:::figura[Contención vista en un diagrama. $A = \{2, 4\}$ está dentro de $B = \{1, 2, 3, 4\}$: la diferencia $A \setminus B$ queda vacía, que es exactamente lo que significa $A \subseteq B$.]{componente="VennSets"}
```yaml
modo: operaciones
universo: [1, 2, 3, 4, 5, 6]
conjuntos:
  - etiqueta: A
    elementos: [2, 4]
  - etiqueta: B
    elementos: [1, 2, 3, 4]
operacion: diferencia
operaciones: [diferencia, interseccion, union]
```
:::

## Errores comunes

- **Confundir un elemento con el conjunto que lo contiene.** $a$ y $\{a\}$ son objetos distintos; $\{\varnothing\}$ tiene un elemento y $\varnothing$ tiene cero.
- **Escribir $\{x : P(x)\}$ sin universo.** Sin especificar de dónde se toma $x$ la descripción puede ser ambigua o incluso contradictoria.
- **Pensar que listar dos veces un elemento aumenta la cardinalidad.** $|\{1, 1, 2\}| = 2$.
- **Usar $\subset$ y $\subseteq$ como si significaran lo mismo en todos los textos.** Aquí $\subseteq$ permite la igualdad; cuando se quiere contención estricta conviene decirlo explícitamente.

## Conexiones

La notación por comprensión usa predicados, tomados de los [[cuantificadores-universal-y-existencial|cuantificadores]]. A partir de conjuntos se definen las [[operaciones-de-conjuntos]], el [[producto-cartesiano]] y el [[conjunto-potencia]]. En probabilidad, el espacio muestral y los eventos son conjuntos, y la cardinalidad es la base del conteo.

## Formulario

:::formula[Conjunto por comprensión]
$$
A = \{x \in U : P(x)\}
$$

- $A$: el conjunto que se define.
- $x$: elemento genérico.
- $U$: conjunto universal.
- $:$ se lee "tales que".
- $P(x)$: propiedad que deben cumplir los elementos.
:::

:::formula[Subconjunto]
$$
A \subseteq B \iff \forall x\,(x \in A \rightarrow x \in B)
$$

- $A, B$: conjuntos.
- $\subseteq$: "está contenido en", permite que sean iguales.
- $\forall x$: para todo objeto $x$.
- $\rightarrow$: si pertenece a $A$, entonces pertenece a $B$.
:::

:::formula[Doble contención]
$$
A = B \iff A \subseteq B \ \text{ y } \ B \subseteq A
$$

- $A, B$: conjuntos.
- $A = B$: tienen exactamente los mismos elementos.
:::

:::formula[Cardinalidad]
$$
|A| = \text{número de elementos de } A
$$

- $A$: conjunto finito.
- $|\cdot|$: barras de cardinalidad; los elementos repetidos se cuentan una sola vez.
:::
