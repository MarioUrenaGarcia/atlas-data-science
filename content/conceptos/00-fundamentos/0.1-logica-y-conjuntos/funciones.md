---
id: funciones
titulo: Funciones (dominio, codominio, imagen)
titulo_en: Functions (domain, codomain, image)
alias:
  - función
  - aplicación
  - dominio
  - codominio
  - imagen de una función
modulo: 0
submodulo: '0.1'
orden: 11
nivel: basico
prerrequisitos:
  - producto-cartesiano
etiquetas:
  - funciones
  - dominio
  - codominio
  - imagen
  - conjuntos
resumen: >
  Una función de A en B asigna a cada elemento del dominio A exactamente un elemento del codominio B. La
  imagen es el conjunto de valores que efectivamente se alcanzan, y puede ser menor que el codominio.
formula: 'f: A \to B,\qquad \forall a \in A\ \exists!\, b \in B:\ f(a) = b'
visualizacion:
  componente: FunctionMapping
  parametros:
    modo: funcion
    ejemplos:
      - nombre: Asignación de grupos (función)
        dominio: ['Ana', 'Beto', 'Caro', 'Dani', 'Eli']
        codominio: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4']
        flechas: [[0, 0], [1, 2], [2, 0], [3, 1], [4, 2]]
      - nombre: Estudiante sin grupo
        dominio: ['Ana', 'Beto', 'Caro', 'Dani', 'Eli']
        codominio: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4']
        flechas: [[0, 0], [1, 2], [3, 1], [4, 2]]
      - nombre: Estudiante en dos grupos
        dominio: ['Ana', 'Beto', 'Caro', 'Dani', 'Eli']
        codominio: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4']
        flechas: [[0, 0], [1, 2], [2, 0], [2, 3], [3, 1], [4, 2]]
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una escuela asigna a cada estudiante de nuevo ingreso un grupo. La regla administrativa es clara: nadie puede quedarse sin grupo y nadie puede estar inscrito en dos grupos a la vez. En cambio, un grupo puede recibir a muchos estudiantes, y puede haber un grupo abierto que por ahora no tenga a nadie.

Esa asignación es una función. Lo esencial no es que haya una fórmula, sino que cada elemento de partida tenga un destino y solo uno. El conjunto de estudiantes es el dominio, el conjunto de grupos disponibles es el codominio y los grupos que efectivamente recibieron estudiantes forman la imagen.

Muchas funciones de la ciencia de datos no tienen una fórmula sencilla: un modelo que asigna una categoría a cada correo, una tabla que asigna un código postal a cada domicilio. Todas cumplen la misma regla: una entrada, exactamente una salida.

## Definición

:::definicion[Función]
Una **función** $f$ de $A$ en $B$, escrita $f: A \to B$, es un subconjunto $f \subseteq A \times B$ tal que para cada $a \in A$ existe un único $b \in B$ con $(a, b) \in f$. Ese $b$ se denota $f(a)$.
:::

- $A$ es el **dominio** y $B$ el **codominio**.
- La **imagen** de $f$ es $f(A) = \{f(a) : a \in A\} \subseteq B$.
- Para $C \subseteq A$, $f(C) = \{f(a) : a \in C\}$; para $D \subseteq B$, la **preimagen** es $f^{-1}(D) = \{a \in A : f(a) \in D\}$.

Dos funciones son iguales si tienen el mismo dominio, el mismo codominio y $f(a) = g(a)$ para todo $a$.

:::figura[Prueba de la recta vertical. Una curva del plano es la gráfica de una función de $x$ si ninguna recta vertical la corta más de una vez; el círculo y la parábola acostada fallan porque algunos valores de $x$ tendrían dos salidas.]{componente="FunctionGraph"}
```yaml
modo: vertical
curvas: [parabola, circulo, parabola-lateral, seno, elipse, raiz]
```
:::

:::nota[Qué significa cada símbolo]
- $f: A \to B$: función $f$ con dominio $A$ y codominio $B$.
- $A$: dominio, conjunto de entradas.
- $B$: codominio, conjunto donde pueden caer las salidas.
- $f(a)$: la salida que corresponde a la entrada $a$.
- $f(A)$: imagen, las salidas que realmente se alcanzan.
- $C \subseteq A$ y $f(C)$: imagen de una parte del dominio.
- $D \subseteq B$ y $f^{-1}(D)$: preimagen, las entradas cuyas salidas caen en $D$.
- $\exists!$: "existe exactamente uno".
:::

## Cómo usar la visualización

A la izquierda está el dominio y a la derecha el codominio. La reproducción dibuja las flechas una por una y al final el panel dice si el diagrama es una función; los elementos que lo impiden se marcan en naranja y la imagen se sombrea en verde. Para editar, se hace clic en un elemento del dominio y luego en uno del codominio: la flecha se agrega o, si ya existía, se borra.

En el ejemplo "Estudiante sin grupo" basta agregar una flecha desde Caro para que el diagrama se vuelva función. En "Estudiante en dos grupos" hay que quitar una flecha. En cualquier caso, el Grupo 4 puede quedar fuera de la imagen sin que deje de ser función.

## Ejemplo

Una estación meteorológica registra la temperatura máxima de cada día de una semana. Sea $D = \{\text{lun}, \dots, \text{dom}\}$ y $f: D \to \mathbb{Z}$ la temperatura máxima en grados enteros, con valores $f(\text{lun}) = 24$, $f(\text{mar}) = 26$, $f(\text{mié}) = 26$, $f(\text{jue}) = 23$, $f(\text{vie}) = 25$, $f(\text{sáb}) = 26$, $f(\text{dom}) = 24$.

1. Es una función: cada día tiene una sola temperatura máxima.
2. El dominio tiene 7 elementos; el codominio es $\mathbb{Z}$.
3. La imagen es $f(D) = \{23, 24, 25, 26\}$, con 4 elementos.
4. La preimagen de $\{26\}$ es $f^{-1}(\{26\}) = \{\text{mar}, \text{mié}, \text{sáb}\}$, los días más calurosos.
5. Que tres días compartan valor no viola la definición; lo que la violaría es que un día tuviera dos máximas.

:::figura[La temperatura máxima de cada día del ejemplo. Cada día tiene exactamente una flecha, aunque tres días lleguen a 26; en el codominio mostrado, 22 y 27 quedan fuera de la imagen.]{componente="FunctionMapping"}
```yaml
modo: funcion
ejemplos:
  - nombre: Temperatura máxima
    dominio: [lun, mar, mié, jue, vie, sáb, dom]
    codominio: ['22', '23', '24', '25', '26', '27']
    flechas: [[0, 2], [1, 4], [2, 4], [3, 1], [4, 3], [5, 4], [6, 2]]
```
:::

## Propiedades

- $|f(A)| \le |A|$ y $f(A) \subseteq B$.
- $f(C_1 \cup C_2) = f(C_1) \cup f(C_2)$, pero solo $f(C_1 \cap C_2) \subseteq f(C_1) \cap f(C_2)$.
- La preimagen respeta todas las operaciones: $f^{-1}(D_1 \cup D_2) = f^{-1}(D_1) \cup f^{-1}(D_2)$, $f^{-1}(D_1 \cap D_2) = f^{-1}(D_1) \cap f^{-1}(D_2)$ y $f^{-1}(D^c) = (f^{-1}(D))^c$.
- Si $A$ y $B$ son finitos, hay $|B|^{|A|}$ funciones de $A$ en $B$.
- Las preimágenes de los elementos de la imagen forman una partición del dominio.

## Errores comunes

- **Confundir codominio con imagen.** El codominio es donde podrían caer los valores; la imagen es donde caen.
- **Pensar que dos entradas con la misma salida violan la definición.** Lo prohibido es una entrada con dos salidas.
- **Creer que una función necesita fórmula.** Una tabla o un diagrama de flechas definen funciones igual de válidas.
- **Leer $f^{-1}(D)$ como si existiera una función inversa.** La preimagen de un conjunto existe siempre, aunque $f$ no sea invertible.

:::figura[Codominio frente a imagen en una gráfica. Con el seno de $[-3.5, 3.5]$ en $[-2, 2]$, la imagen es solo $[-1, 1]$: las alturas entre 1 y 2 están en el codominio pero ninguna entrada las alcanza.]{componente="FunctionGraph"}
```yaml
modo: clasificacion
funciones:
  - funcion: seno
    dominio: [-3.5, 3.5]
    codominio: [-2, 2]
    nombre: "sen x de [-3.5, 3.5] en [-2, 2]"
  - funcion: seno
    dominio: [-1.5, 1.5]
    codominio: [-1, 1]
    nombre: "sen x de [-1.5, 1.5] en [-1, 1]"
```
:::

## Conexiones

Una función es un subconjunto del [[producto-cartesiano]] con una condición de unicidad. Sus tipos se estudian en [[funciones-inyectivas-suprayectivas-y-biyectivas]] y se combinan en [[funcion-inversa-y-composicion]]. Las [[sucesiones]] son funciones con dominio en los naturales, y en probabilidad una variable aleatoria es una función del espacio muestral en los reales.

## Formulario

:::formula[Definición de función]
$$
f: A \to B, \qquad \forall a \in A\ \exists!\, b \in B:\ f(a) = b
$$

- $A$: dominio.
- $B$: codominio.
- $\exists!$: cada entrada tiene exactamente una salida.
:::

:::formula[Imagen]
$$
f(A) = \{f(a) : a \in A\} \subseteq B
$$

- $f(a)$: salida de cada entrada $a$.
- $f(A)$: conjunto de salidas alcanzadas, contenido en el codominio.
:::

:::formula[Preimagen]
$$
f^{-1}(D) = \{a \in A : f(a) \in D\}
$$

- $D$: subconjunto del codominio.
- $f^{-1}(D)$: entradas que caen en $D$; existe aunque $f$ no tenga inversa.
:::

:::formula[Número de funciones]
$$
\#\{f: A \to B\} = |B|^{|A|}
$$

- $|A|$: número de entradas, cada una elige su salida.
- $|B|$: número de salidas posibles para cada entrada.
:::
