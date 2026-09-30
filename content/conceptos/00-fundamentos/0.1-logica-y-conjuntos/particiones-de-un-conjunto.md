---
id: particiones-de-un-conjunto
titulo: Particiones de un conjunto
titulo_en: Partition of a set
alias:
  - partición
  - bloques de una partición
modulo: 0
submodulo: '0.1'
orden: 10
nivel: basico
prerrequisitos:
  - operaciones-de-conjuntos
relaciones:
  - tipo: relacionado
    id: diagramas-de-venn
etiquetas:
  - conjuntos
  - partición
  - clasificación
  - conteo
resumen: >
  Una partición divide un conjunto en bloques no vacíos, disjuntos entre sí y cuya unión es el conjunto
  completo: cada elemento queda en exactamente un bloque.
formula: 'A_i \neq \varnothing,\quad A_i \cap A_j = \varnothing\ (i \neq j),\quad \bigcup_i A_i = S'
visualizacion:
  componente: SetStructures
  parametros:
    modo: particion
    elementos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    modulo: 3
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una oficina de correos clasifica las cartas del día por código postal. Cada carta termina en una sola bandeja, ninguna carta queda en el piso y no hay bandejas vacías porque solo se abren las que reciben algo. Esa clasificación es una partición: el montón completo quedó dividido en grupos que no se traslapan y que, juntos, contienen todas las cartas.

Las tres condiciones importan. Si una carta pudiera ir a dos bandejas, se contaría dos veces al sumar los contenidos. Si alguna carta quedara fuera, la suma no daría el total. Y una bandeja vacía no aporta nada, por lo que no se considera un bloque. Cuando se cumplen las tres, cualquier cantidad total se obtiene sumando por bloques, y esta idea sostiene buena parte del conteo y de la probabilidad.

## Definición

:::definicion[Partición]
Una **partición** de un conjunto $S$ es una familia $\{A_i\}_{i \in I}$ de subconjuntos de $S$ tal que:

1. $A_i \neq \varnothing$ para todo $i$;
2. $A_i \cap A_j = \varnothing$ si $i \neq j$;
3. $\bigcup_{i \in I} A_i = S$.

Los $A_i$ se llaman **bloques** de la partición.
:::

Equivalentemente, cada $x \in S$ pertenece a exactamente un bloque. Si $S$ es finito,

$$
|S| = \sum_{i \in I} |A_i|.
$$

:::nota[Qué significa cada símbolo]
- $S$: el conjunto que se parte.
- $\{A_i\}_{i \in I}$: la familia de bloques; $I$ es el conjunto de índices y $A_i$ el bloque número $i$.
- $\varnothing$: conjunto vacío.
- $\cap$: intersección; $\bigcup$: unión de todos los bloques.
- $|S|$, $|A_i|$: número de elementos.
- $B_n$: número de Bell, cuántas particiones tiene un conjunto de $n$ elementos.
:::

## Cómo usar la visualización

Los números del 1 al 12 se asignan uno por uno a $k$ bloques. Con el criterio "mismo residuo al dividir entre k", cada número va al bloque de su residuo; con "asignación al azar" cada número se envía a un bloque elegido con la semilla. Al terminar, el panel indica si el resultado es una partición.

Con residuo y k igual a 3 se obtienen tres bloques de cuatro números. Con la asignación al azar y k igual a 6, algunas semillas dejan un bloque vacío, y el resultado deja de ser una partición en 6 bloques aunque los elementos sigan sin repetirse. Con k igual a 1 la partición tiene un único bloque, el conjunto completo.

## Ejemplo

Una clínica atiende 240 pacientes al mes, clasificados por grupo sanguíneo: 108 del grupo O, 84 del A, 36 del B y 12 del AB.

1. Los cuatro grupos son no vacíos, ningún paciente pertenece a dos grupos y cada paciente tiene un grupo, así que forman una partición de los pacientes.
2. Por eso $108 + 84 + 36 + 12 = 240$.
3. Si además se separa cada grupo por factor Rh, se obtiene una partición más fina con hasta 8 bloques; sus cantidades por grupo siguen sumando lo mismo.
4. En cambio, "pacientes mayores de 60" y "pacientes con diabetes" no forman una partición: pueden traslaparse y dejar pacientes fuera.

:::figura[Los 240 pacientes del ejemplo como una barra dividida en bloques proporcionales a cada grupo sanguíneo. Al refinar, cada grupo se separa según el factor Rh; los números de esa división son ilustrativos y cada grupo sigue sumando lo mismo.]{componente="SetStructures"}
```yaml
modo: reparto
universo: Pacientes
bloques:
  - nombre: O
    n: 108
    partes:
      - nombre: Rh+
        n: 95
      - nombre: Rh-
        n: 13
  - nombre: A
    n: 84
    partes:
      - nombre: Rh+
        n: 74
      - nombre: Rh-
        n: 10
  - nombre: B
    n: 36
    partes:
      - nombre: Rh+
        n: 32
      - nombre: Rh-
        n: 4
  - nombre: AB
    n: 12
    partes:
      - nombre: Rh+
        n: 11
      - nombre: Rh-
        n: 1
```
:::

## Propiedades

- Toda partición define una relación de equivalencia ("estar en el mismo bloque"), y toda relación de equivalencia define una partición en clases.
- Si $\{A_i\}$ es una partición de $S$ y $B \subseteq S$, entonces $\{A_i \cap B\}$ sin los bloques vacíos es una partición de $B$, y $|B| = \sum_i |A_i \cap B|$.
- Las regiones no vacías de un diagrama de Venn forman una partición del universo.
- El número de particiones de un conjunto de $n$ elementos es el número de Bell $B_n$: $B_1 = 1$, $B_2 = 2$, $B_3 = 5$, $B_4 = 15$.
- En probabilidad, si los $A_i$ forman una partición del espacio muestral, $P(B) = \sum_i P(B \cap A_i)$.

## Errores comunes

- **Aceptar bloques que se traslapan.** Categorías como "estudiante" y "trabajador" pueden compartir personas, y sumar sus conteos da más que el total.
- **Olvidar una categoría residual.** Una clasificación que deja elementos sin bloque no es partición; con frecuencia se agrega un bloque "otros".
- **Contar el bloque vacío.** Por definición los bloques son no vacíos.
- **Confundir una partición con un subconjunto del conjunto potencia cualquiera.** Una familia de subconjuntos no es partición si no cumple las tres condiciones.

:::figura[Dos categorías que no forman partición: "mayores de 60" ($M$) y "con diabetes" ($D$). Se traslapan en 25 pacientes y 145 no están en ninguna, así que sumar $|M| + |D| = 75 + 45$ cuenta dos veces la región común y aun así no llega a 240.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [M, D]
universo: Pacientes
conteos:
  M: 50
  D: 20
  MD: 25
  ninguno: 145
consultas:
  - nombre: M
    regiones: [M, MD]
  - nombre: D
    regiones: [D, MD]
  - nombre: "M ∩ D"
    regiones: [MD]
  - nombre: Fuera de ambas
    regiones: [ninguno]
```
:::

## Conexiones

Las particiones se definen con las [[operaciones-de-conjuntos]] de unión e intersección, y las regiones de los [[diagramas-de-venn]] son un ejemplo. Su equivalencia con las clases de las [[relaciones-y-relaciones-de-equivalencia|relaciones de equivalencia]] es uno de los resultados centrales del submódulo. En probabilidad, la ley de probabilidad total descompone un evento sobre una partición del espacio muestral.

## Formulario

:::formula[Condiciones de una partición]
$$
A_i \neq \varnothing, \qquad A_i \cap A_j = \varnothing \ (i \neq j), \qquad \bigcup_{i \in I} A_i = S
$$

- $A_i$: bloque número $i$.
- $i \neq j$: dos bloques distintos no comparten elementos.
- $\bigcup$: juntos cubren todo $S$.
:::

:::formula[Conteo por bloques]
$$
|S| = \sum_{i \in I} |A_i|
$$

- $|S|$: número total de elementos.
- $|A_i|$: tamaño de cada bloque; la suma recorre todos los bloques.
:::

:::formula[Conteo de un subconjunto por bloques]
$$
|B| = \sum_{i \in I} |A_i \cap B|
$$

- $B$: cualquier subconjunto de $S$.
- $A_i \cap B$: la parte de $B$ que cae en el bloque $i$.
:::

:::formula[Probabilidad total]
$$
P(B) = \sum_{i} P(B \cap A_i)
$$

- $P(\cdot)$: probabilidad.
- $A_i$: bloques de una partición del espacio muestral.
:::
