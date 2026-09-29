---
id: operaciones-de-conjuntos
titulo: Operaciones de conjuntos (unión, intersección, complemento, diferencia, diferencia simétrica)
titulo_en: Set operations
alias:
  - unión
  - intersección
  - complemento
  - diferencia de conjuntos
  - diferencia simétrica
modulo: 0
submodulo: '0.1'
orden: 5
nivel: basico
prerrequisitos:
  - conjuntos-y-notacion
relaciones:
  - tipo: relacionado
    id: proposiciones-y-conectivos-logicos
etiquetas:
  - conjuntos
  - unión
  - intersección
  - complemento
  - diagramas
resumen: >
  Las operaciones de conjuntos forman nuevos conjuntos a partir de otros: la unión junta, la intersección
  conserva lo común, el complemento toma lo que falta y la diferencia quita los elementos de otro conjunto.
formula: 'A \cup B = \{x : x \in A \lor x \in B\},\quad A \cap B = \{x : x \in A \land x \in B\}'
visualizacion:
  componente: VennSets
  parametros:
    modo: operaciones
    universo: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    conjuntos:
      - etiqueta: A
        elementos: [2, 4, 6, 8, 10, 12, 14]
      - etiqueta: B
        elementos: [3, 6, 9, 12, 15]
    operacion: interseccion
    operaciones:
      - union
      - interseccion
      - complemento
      - diferencia
      - diferencia-simetrica
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una cadena de cines tiene dos listas de clientes: los que compraron boletos en línea el mes pasado y los que compraron palomitas. El equipo de mercadotecnia hace preguntas distintas con esas listas. ¿A quién se le puede enviar un cupón? A cualquiera que esté en alguna de las dos listas. ¿Quiénes son los clientes más fieles? Los que están en ambas. ¿A quién invitar a comprar en línea? A los que compraron palomitas pero no están en la primera lista. ¿Quiénes no aparecen en ninguna? Los demás clientes registrados.

Cada una de esas preguntas es una operación de conjuntos. Juntar dos listas sin repetir nombres es la unión; quedarse con los nombres comunes es la intersección; quitar de una lista a los que aparecen en la otra es la diferencia; y todo lo que queda fuera de una lista, dentro del universo de clientes, es su complemento. Estas operaciones corresponden exactamente a los conectivos "o", "y" y "no" aplicados a la pertenencia.

## Definición

Sean $A$ y $B$ subconjuntos de un conjunto universal $U$.

:::definicion[Operaciones]
- **Unión:** $A \cup B = \{x \in U : x \in A \lor x \in B\}$.
- **Intersección:** $A \cap B = \{x \in U : x \in A \land x \in B\}$.
- **Complemento:** $A^c = \{x \in U : x \notin A\}$.
- **Diferencia:** $A \setminus B = \{x \in U : x \in A \land x \notin B\} = A \cap B^c$.
- **Diferencia simétrica:** $A \,\triangle\, B = (A \setminus B) \cup (B \setminus A)$, los elementos que están en exactamente uno de los dos.
:::

$A$ y $B$ son **disjuntos** si $A \cap B = \varnothing$. El complemento depende del universo elegido; la unión, la intersección y la diferencia no.

## Cómo usar la visualización

El rectángulo es el universo, del 1 al 15, y los círculos son $A$ (múltiplos de 2) y $B$ (múltiplos de 3). La región sombreada corresponde a la operación elegida. La reproducción revisa cada elemento y lo marca en verde cuando cumple la condición que aparece arriba; el panel muestra el resultado parcial y su cardinalidad.

Al elegir la intersección el resultado es $\{6, 12\}$, los múltiplos de 6. Con la diferencia simétrica la zona común queda sin sombrear. Con el complemento de $A$ quedan los impares, incluidos los que están en $B$ como el 3 y el 9.

## Ejemplo

En una escuela de 30 estudiantes, $F$ es el conjunto de quienes juegan futbol y $B$ el de quienes juegan basquetbol. Se sabe que $|F| = 14$, $|B| = 9$ y $|F \cap B| = 4$.

1. **Unión.** Al sumar $14 + 9$ los 4 que juegan ambos se cuentan dos veces, así que $|F \cup B| = 14 + 9 - 4 = 19$.
2. **Complemento de la unión.** $|(F \cup B)^c| = 30 - 19 = 11$ estudiantes no juegan ninguno.
3. **Diferencia.** $|F \setminus B| = 14 - 4 = 10$ juegan solo futbol.
4. **Diferencia simétrica.** $|F \,\triangle\, B| = 10 + (9 - 4) = 15$ juegan exactamente uno de los dos.

:::figura[Los números del ejemplo en un diagrama con conteos por región: 10 juegan solo futbol, 5 solo basquetbol, 4 ambos y 11 ninguno. Cada consulta sombrea una operación y suma sus regiones.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [F, B]
universo: Estudiantes
conteos:
  F: 10
  B: 5
  FB: 4
  ninguno: 11
consultas:
  - nombre: "F ∪ B"
    regiones: [F, B, FB]
  - nombre: "F ∩ B"
    regiones: [FB]
  - nombre: "(F ∪ B)ᶜ"
    regiones: [ninguno]
  - nombre: "F \\ B"
    regiones: [F]
  - nombre: "F Δ B"
    regiones: [F, B]
```
:::

## Propiedades

- **Conmutatividad:** $A \cup B = B \cup A$ y $A \cap B = B \cap A$.
- **Asociatividad:** $(A \cup B) \cup C = A \cup (B \cup C)$, igual para $\cap$.
- **Distributividad:** $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ y $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$.
- **Identidades:** $A \cup \varnothing = A$, $A \cap U = A$, $A \cup A^c = U$, $A \cap A^c = \varnothing$, $(A^c)^c = A$.
- **Cardinalidad de la unión:** $|A \cup B| = |A| + |B| - |A \cap B|$ para conjuntos finitos.
- La diferencia no es conmutativa: en general $A \setminus B \neq B \setminus A$.

:::demostracion
Para la distributividad, $x \in A \cap (B \cup C)$ equivale a $x \in A \land (x \in B \lor x \in C)$, que por la distributividad lógica equivale a $(x \in A \land x \in B) \lor (x \in A \land x \in C)$, es decir, $x \in (A \cap B) \cup (A \cap C)$.
:::

:::figura[Distributividad comprobada por regiones. Los dos lados de cada ley sombrean exactamente las mismas regiones, así que son iguales para cualesquiera conjuntos.]{componente="VennSets"}
```yaml
modo: conteos
etiquetas: [A, B, C]
conteos:
  A: 5
  B: 4
  C: 3
  AB: 2
  AC: 2
  BC: 1
  ABC: 1
  ninguno: 6
consultas:
  - nombre: "A ∩ (B ∪ C)"
    regiones: [AB, AC, ABC]
  - nombre: "(A ∩ B) ∪ (A ∩ C)"
    regiones: [AB, AC, ABC]
  - nombre: "A ∪ (B ∩ C)"
    regiones: [A, AB, AC, ABC, BC]
  - nombre: "(A ∪ B) ∩ (A ∪ C)"
    regiones: [A, AB, AC, ABC, BC]
```
:::

## Errores comunes

- **Sumar cardinalidades para obtener la unión.** $|A \cup B| = |A| + |B|$ solo si $A$ y $B$ son disjuntos.
- **Confundir $A \setminus B$ con $B \setminus A$.** El orden importa.
- **Calcular un complemento sin universo.** El complemento de los números pares no es lo mismo en $\{1, \dots, 10\}$ que en $\mathbb{Z}$.
- **Creer que la diferencia simétrica es la unión.** Excluye la parte común.

## Conexiones

Cada operación traduce un conectivo de [[proposiciones-y-conectivos-logicos]]. Las [[leyes-de-de-morgan]] relacionan el complemento con la unión y la intersección, y los [[diagramas-de-venn]] muestran todas las regiones que se forman con varios conjuntos. La fórmula de la cardinalidad de la unión es el primer caso del principio de inclusión y exclusión, y las mismas operaciones definen los eventos compuestos en probabilidad.
