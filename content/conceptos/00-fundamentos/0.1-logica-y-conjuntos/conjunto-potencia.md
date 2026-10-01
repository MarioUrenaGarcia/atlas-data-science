---
id: conjunto-potencia
titulo: Conjunto potencia
titulo_en: Power set
alias:
  - conjunto de partes
  - partes de un conjunto
modulo: 0
submodulo: '0.1'
orden: 9
nivel: basico
prerrequisitos:
  - conjuntos-y-notacion
etiquetas:
  - conjuntos
  - subconjuntos
  - conteo
  - códigos binarios
resumen: >
  El conjunto potencia de S es el conjunto de todos sus subconjuntos, incluidos el vacío y S. Si S tiene
  n elementos, su conjunto potencia tiene 2^n, uno por cada cadena binaria de longitud n.
formula: '\mathcal{P}(S) = \{A : A \subseteq S\},\qquad |\mathcal{P}(S)| = 2^{|S|}'
visualizacion:
  componente: SetStructures
  parametros:
    modo: potencia
    elementos: ['a', 'b', 'c', 'd', 'e']
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una pizzería ofrece cuatro ingredientes extra: champiñones, pimiento, aceitunas y jalapeño. Cada cliente elige cualesquiera, incluso ninguno o todos. ¿Cuántas pizzas distintas pueden pedirse? Para cada ingrediente hay una decisión independiente de sí o no, así que hay $2 \cdot 2 \cdot 2 \cdot 2 = 16$ pedidos posibles.

Cada pedido es un subconjunto de los ingredientes, y la colección de todos los pedidos posibles es el conjunto potencia. La cuenta muestra algo importante: agregar un solo ingrediente al menú duplica el número de pizzas posibles, porque cada pedido anterior puede hacerse con o sin el ingrediente nuevo.

Las decisiones de sí o no pueden escribirse como una cadena de ceros y unos, una posición por ingrediente. Así, 1010 significa champiñones y aceitunas. Cada subconjunto corresponde a un código binario distinto y viceversa.

## Definición

:::definicion[Conjunto potencia]
Para un conjunto $S$, su **conjunto potencia** es
$$
\mathcal{P}(S) = \{A : A \subseteq S\}.
$$
:::

Sus elementos son conjuntos. Siempre $\varnothing \in \mathcal{P}(S)$ y $S \in \mathcal{P}(S)$.

Si $S = \{s_1, \dots, s_n\}$ es finito, cada subconjunto $A$ se identifica con el vector $(\mathbf{1}\{s_1 \in A\}, \dots, \mathbf{1}\{s_n \in A\}) \in \{0, 1\}^n$. Esta correspondencia es biyectiva, por lo que $|\mathcal{P}(S)| = 2^n$.

:::nota[Qué significa cada símbolo]
- $S$: el conjunto de partida; $n = |S|$, su número de elementos.
- $\mathcal{P}(S)$: conjunto potencia, el conjunto de todos los subconjuntos de $S$.
- $A \subseteq S$: $A$ es un subconjunto de $S$.
- $\mathbf{1}\{s_i \in A\}$: indicadora, vale 1 si $s_i$ está en $A$ y 0 si no.
- $\{0, 1\}^n$: cadenas de $n$ ceros y unos.
- $\binom{n}{k}$: número de subconjuntos con exactamente $k$ elementos.
:::

## Cómo usar la visualización

Cada rectángulo es un subconjunto, con su código binario debajo. Los subconjuntos se acomodan por niveles según su tamaño, del vacío abajo al conjunto completo arriba, y las líneas unen subconjuntos que difieren en un solo elemento. La reproducción los genera en el orden de su código, $000$, $001$, $010$, y así sucesivamente, resaltando el actual.

El control del número de elementos va de 1 a 5. Al subirlo de 3 a 4 el total pasa de 8 a 16: el diagrama nuevo contiene dos copias del anterior, una sin el elemento nuevo y otra con él. Contar los rectángulos de cada nivel da los coeficientes 1, 4, 6, 4, 1.

## Ejemplo

Un analista tiene tres variables candidatas para un modelo: edad ($e$), ingreso ($i$) y escolaridad ($s$). Quiere comparar todos los modelos posibles con cualquier combinación de variables.

1. Los modelos son los elementos de $\mathcal{P}(\{e, i, s\})$.
2. Por extensión: $\varnothing$, $\{e\}$, $\{i\}$, $\{s\}$, $\{e, i\}$, $\{e, s\}$, $\{i, s\}$, $\{e, i, s\}$.
3. Hay $2^3 = 8$ modelos, contando el que no usa ninguna variable.
4. Con 20 variables candidatas habría $2^{20}$ modelos, es decir, 1,048,576, lo que explica por qué la búsqueda exhaustiva de subconjuntos se vuelve impracticable.

:::figura[Los 8 modelos del ejemplo como subconjuntos de $\{e, i, s\}$, ordenados por tamaño: el modelo vacío abajo, los de una variable, los de dos y el completo arriba. Cada línea une modelos que difieren en una sola variable.]{componente="SetStructures"}
```yaml
modo: potencia
elementos: [e, i, s]
```
:::

## Propiedades

- $|\mathcal{P}(S)| = 2^{|S|}$ para $S$ finito.
- El número de subconjuntos con exactamente $k$ elementos es $\binom{n}{k}$, así que $\sum_{k=0}^{n} \binom{n}{k} = 2^n$.
- $A \subseteq B$ implica $\mathcal{P}(A) \subseteq \mathcal{P}(B)$.
- $\mathcal{P}(S)$ es cerrado bajo unión, intersección y complemento respecto de $S$.
- **Teorema de Cantor:** para cualquier conjunto $S$, finito o infinito, no existe una función suprayectiva de $S$ en $\mathcal{P}(S)$; el conjunto potencia siempre es estrictamente más grande.

:::demostracion
Por inducción sobre $n$. Si $n = 0$, $\mathcal{P}(\varnothing) = \{\varnothing\}$ tiene $1 = 2^0$ elemento. Si $S$ tiene $n + 1$ elementos, fijamos uno, $s$. Cada subconjunto de $S$ lo contiene o no; los que no lo contienen son los $2^n$ subconjuntos de $S \setminus \{s\}$, y los que lo contienen se obtienen agregando $s$ a cada uno de ellos. En total hay $2 \cdot 2^n = 2^{n+1}$.
:::

:::figura[Los subconjuntos de $\{1, \dots, n\}$ agrupados por tamaño: la columna de tamaño $k$ tiene $\binom{n}{k}$ subconjuntos y las columnas suman $2^n$.]{componente="PascalTriangle"}
```yaml
modo: identidades
identidad: suma-de-fila
n: 4
```
:::

## Errores comunes

- **Olvidar el vacío o el conjunto completo.** Ambos son subconjuntos.
- **Confundir $\varnothing$ con $\{\varnothing\}$.** $\mathcal{P}(\varnothing) = \{\varnothing\}$ tiene un elemento.
- **Escribir $a \in \mathcal{P}(S)$ en lugar de $\{a\} \in \mathcal{P}(S)$.** Los elementos del conjunto potencia son subconjuntos, no elementos de $S$.
- **Pensar que el crecimiento es moderado.** Duplicar con cada elemento produce crecimiento exponencial.

## Conexiones

El conjunto potencia se define con la noción de subconjunto de [[conjuntos-y-notacion]]. El [[argumento-diagonal-de-cantor]] usa la misma idea que el teorema de Cantor para mostrar que hay infinitos de distintos tamaños, como se estudia en [[cardinalidad-finita-numerable-y-no-numerable]]. En probabilidad, los eventos de un espacio muestral finito son los elementos de su conjunto potencia, y en combinatoria los subconjuntos de tamaño fijo se cuentan con coeficientes binomiales.

## Formulario

:::formula[Conjunto potencia]
$$
\mathcal{P}(S) = \{A : A \subseteq S\}
$$

- $S$: conjunto de partida.
- $A$: cualquier subconjunto de $S$, incluidos $\varnothing$ y $S$.
:::

:::formula[Número de subconjuntos]
$$
|\mathcal{P}(S)| = 2^{n}, \qquad n = |S|
$$

- $n$: número de elementos de $S$.
- $2$: cada elemento está o no está en el subconjunto.
:::

:::formula[Subconjuntos por tamaño]
$$
\sum_{k=0}^{n} \binom{n}{k} = 2^{n}
$$

- $k$: tamaño del subconjunto, de $0$ a $n$.
- $\binom{n}{k}$: número de subconjuntos de tamaño $k$.
:::

:::formula[Teorema de Cantor]
$$
|S| < |\mathcal{P}(S)|
$$

- $S$: cualquier conjunto, finito o infinito.
- $<$: no existe una función suprayectiva de $S$ en $\mathcal{P}(S)$.
:::
