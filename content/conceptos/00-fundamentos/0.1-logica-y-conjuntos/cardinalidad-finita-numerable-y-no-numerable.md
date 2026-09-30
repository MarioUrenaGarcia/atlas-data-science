---
id: cardinalidad-finita-numerable-y-no-numerable
titulo: Cardinalidad (finita, numerable, no numerable)
titulo_en: Cardinality (finite, countable, uncountable)
alias:
  - cardinalidad
  - conjunto numerable
  - conjunto contable
  - conjunto no numerable
  - equipotencia
modulo: 0
submodulo: '0.1'
orden: 14
nivel: basico
prerrequisitos:
  - funciones-inyectivas-suprayectivas-y-biyectivas
relaciones:
  - tipo: relacionado
    id: conjunto-potencia
etiquetas:
  - conjuntos
  - cardinalidad
  - infinito
  - biyección
  - numerabilidad
resumen: >
  Dos conjuntos tienen la misma cardinalidad si existe una biyección entre ellos. Un conjunto es numerable
  si puede listarse como sucesión; los reales no pueden listarse, así que hay infinitos de distinto tamaño.
formula: '|A| = |B| \iff \exists\, f: A \to B \text{ biyectiva}'
visualizacion:
  componente: CountableSets
  parametros:
    vista: enteros
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

En un salón de clases puede saberse si hay tantas sillas como estudiantes sin contar ninguna de las dos cosas: se pide a cada estudiante que se siente. Si no sobran sillas ni quedan estudiantes de pie, hay la misma cantidad. Emparejar es más básico que contar, y es la idea que permite comparar tamaños de conjuntos infinitos, donde contar hasta el final es imposible.

Al emparejar conjuntos infinitos aparecen sorpresas. Los números pares pueden emparejarse con todos los naturales ($1 \leftrightarrow 2$, $2 \leftrightarrow 4$, $3 \leftrightarrow 6$, ...), así que en este sentido hay tantos pares como naturales, aunque los pares sean una parte. Los enteros también se pueden emparejar con los naturales si se listan alternando signos: 0, 1, -1, 2, -2, ... Cualquier conjunto que pueda ponerse en una lista así, con cada elemento en una posición finita, se llama numerable.

Pero no todo infinito se deja listar. Los números reales no caben en ninguna lista: cualquier intento deja fuera a alguno. Hay, por tanto, infinitos más grandes que otros.

## Definición

:::definicion[Cardinalidad]
- $A$ y $B$ tienen la **misma cardinalidad**, $|A| = |B|$, si existe una biyección $f: A \to B$.
- $|A| \le |B|$ si existe una función inyectiva $f: A \to B$.
- $A$ es **finito** con $n$ elementos si $|A| = |\{1, \dots, n\}|$ (o $A = \varnothing$, con $n = 0$).
- $A$ es **infinito numerable** si $|A| = |\mathbb{N}|$, y **numerable** si es finito o infinito numerable.
- $A$ es **no numerable** si no es numerable.
:::

Un conjunto infinito $A$ es numerable si y solo si sus elementos pueden escribirse como una sucesión $a_1, a_2, a_3, \dots$ en la que cada elemento aparece.

:::nota[Qué significa cada símbolo]
- $|A|$: cardinalidad, el "tamaño" de $A$.
- $|A| = |B|$: existe una biyección entre $A$ y $B$.
- $|A| \le |B|$: existe una función inyectiva de $A$ en $B$.
- $\mathbb{N} = \{1, 2, 3, \dots\}$: los naturales; $\mathbb{Z}$: los enteros; $\mathbb{Q}$: los racionales; $\mathbb{R}$: los reales.
- $a_1, a_2, a_3, \dots$: una lista infinita de los elementos de un conjunto numerable.
- $\mathcal{P}(A)$: conjunto potencia de $A$.
:::

## Cómo usar la visualización

La visualización tiene tres vistas. En "Conjuntos finitos" los días de la semana se emparejan con 1, 2, 3, ... hasta agotar el conjunto. En "Los enteros" cada posición de la lista se une con un entero siguiendo el orden 0, 1, -1, 2, -2, ...; la recta muestra que la lista alterna lados y nunca se salta un entero. En "Los racionales" un recorrido en zigzag sobre la tabla de fracciones $p/q$ cuenta cada racional positivo la primera vez que aparece y salta las fracciones repetidas como $2/4$.

Al avanzar paso a paso en la vista de enteros conviene observar que cualquier entero, por grande que sea, llega a su turno en una posición finita: el entero $-5$ ocupa la posición 11.

## Ejemplo

Se muestra que $\mathbb{Z}$ es numerable construyendo una biyección explícita $f: \mathbb{N} \to \mathbb{Z}$:

$$
f(n) = \begin{cases} n/2 & \text{si } n \text{ es par}, \\ -(n - 1)/2 & \text{si } n \text{ es impar}. \end{cases}
$$

1. Valores: $f(1) = 0$, $f(2) = 1$, $f(3) = -1$, $f(4) = 2$, $f(5) = -2$.
2. **Inyectiva.** Los pares van a enteros positivos y los impares a enteros menores o iguales que 0, así que un par y un impar nunca chocan; dentro de cada grupo la fórmula es estrictamente monótona.
3. **Suprayectiva.** Un entero $m > 0$ es $f(2m)$, y un entero $m \le 0$ es $f(1 - 2m)$. Por ejemplo, $-5 = f(11)$.
4. Por tanto $|\mathbb{Z}| = |\mathbb{N}|$.

:::figura[Los primeros valores de la biyección del ejemplo entre $\{1, \dots, 7\}$ y $\{-3, \dots, 3\}$: cada entero de la derecha recibe exactamente una flecha, y al continuar la lista ningún entero queda sin su natural.]{componente="FunctionMapping"}
```yaml
modo: clasificacion
ejemplos:
  - nombre: "f: N en Z"
    dominio: ['1', '2', '3', '4', '5', '6', '7']
    codominio: ['-3', '-2', '-1', '0', '1', '2', '3']
    flechas: [[0, 3], [1, 4], [2, 2], [3, 5], [4, 1], [5, 6], [6, 0]]
```
:::

## Propiedades

- Todo subconjunto de un conjunto numerable es numerable.
- $\mathbb{N} \times \mathbb{N}$ es numerable, y también lo es $\mathbb{Q}$.
- La unión numerable de conjuntos numerables es numerable.
- $\mathbb{R}$, el intervalo $(0, 1)$ y el conjunto de sucesiones binarias infinitas son no numerables, y los tres tienen la misma cardinalidad.
- **Teorema de Cantor:** $|A| < |\mathcal{P}(A)|$ para todo conjunto $A$, así que no existe un infinito máximo.
- **Teorema de Cantor, Schröder y Bernstein:** si $|A| \le |B|$ y $|B| \le |A|$, entonces $|A| = |B|$.
- Un conjunto es infinito si y solo si tiene la misma cardinalidad que algún subconjunto propio suyo.

## Errores comunes

- **Suponer que una parte propia siempre es más pequeña.** Eso solo vale para conjuntos finitos; los pares tienen la cardinalidad de $\mathbb{N}$.
- **Concluir que no hay biyección porque un intento falló.** Listar los racionales por numerador fijo nunca termina la primera fila, pero el zigzag sí funciona. Para mostrar que no existe biyección hay que refutar todas.
- **Pensar que "denso" implica "no numerable".** $\mathbb{Q}$ es denso en $\mathbb{R}$ y es numerable.
- **Tratar "infinito" como un número único.** Hay una jerarquía de cardinalidades infinitas.

:::figura[Una parte propia con tantos elementos como el todo. La función $n \mapsto 2n$ empareja los naturales con los pares sin que falte ni sobre ninguno, aunque los pares sean solo una parte de los naturales.]{componente="FunctionMapping"}
```yaml
modo: clasificacion
ejemplos:
  - nombre: "n a 2n"
    dominio: ['1', '2', '3', '4', '5', '6']
    codominio: ['2', '4', '6', '8', '10', '12']
    flechas: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]
```
:::

## Conexiones

Las comparaciones de tamaño se hacen con las [[funciones-inyectivas-suprayectivas-y-biyectivas]]. El [[argumento-diagonal-de-cantor]] demuestra que los reales son no numerables, con la misma idea que muestra que el [[conjunto-potencia]] es siempre más grande. En probabilidad, la distinción entre numerable y no numerable separa las variables aleatorias discretas de las continuas, y la aditividad de la probabilidad se exige solo sobre familias numerables de eventos.

## Formulario

:::formula[Misma cardinalidad]
$$
|A| = |B| \iff \exists\, f: A \to B \text{ biyectiva}
$$

- $A, B$: conjuntos cualesquiera, finitos o infinitos.
- $f$: una biyección que empareja sus elementos uno a uno.
:::

:::formula[Numerabilidad]
$$
A \text{ es infinito numerable} \iff |A| = |\mathbb{N}|
$$

- $\mathbb{N}$: los naturales.
- Equivale a poder listar los elementos como $a_1, a_2, a_3, \dots$
:::

:::formula[Biyección de los naturales en los enteros]
$$
f(n) = \begin{cases} n/2 & n \text{ par} \\ -(n - 1)/2 & n \text{ impar} \end{cases}
$$

- $n$: posición en la lista, un natural.
- $f(n)$: el entero que ocupa esa posición: $0, 1, -1, 2, -2, \dots$
:::

:::formula[Teorema de Cantor]
$$
|A| < |\mathcal{P}(A)|
$$

- $\mathcal{P}(A)$: conjunto potencia de $A$; siempre es estrictamente más grande.
:::
