---
id: cuantificadores-universal-y-existencial
titulo: Cuantificadores universal y existencial
titulo_en: Universal and existential quantifiers
alias:
  - para todo
  - existe
  - lógica de predicados
modulo: 0
submodulo: '0.1'
orden: 3
nivel: basico
prerrequisitos:
  - proposiciones-y-conectivos-logicos
etiquetas:
  - lógica
  - cuantificadores
  - predicados
  - contraejemplo
resumen: >
  El cuantificador universal afirma que una propiedad vale para todos los elementos de un dominio; el
  existencial, que vale para al menos uno. Un contraejemplo refuta al primero y un testigo prueba al segundo.
formula: '\lnot\,\forall x\, P(x) \iff \exists x\, \lnot P(x)'
visualizacion:
  componente: LogicViz
  parametros:
    modo: cuantificadores
    predicado: primo
    predicados:
      - primo
      - impar
      - par
      - menor-que
      - positivo
      - cuadrado
    inicio: 1
    tamano: 20
    k: 25
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una inspectora de calidad recibe dos encargos sobre un lote de 200 piezas. El primero: comprobar que todas miden lo que deben. El segundo: averiguar si al menos una tiene un defecto de pintura. Los dos encargos se resuelven de manera muy distinta.

Para afirmar que todas las piezas cumplen, tendría que revisar las 200; pero basta encontrar una sola pieza fuera de medida para declarar falso el "todas". Para el segundo encargo ocurre lo contrario: en cuanto aparece una pieza con defecto la pregunta queda respondida, y solo si revisa todo el lote sin encontrar ninguna puede decir que no existe.

Los cuantificadores formalizan esas dos ideas. "Para todo" pide que una propiedad se cumpla sin excepción; "existe" pide al menos un caso. Negar uno produce el otro: decir que no todas las piezas miden bien es lo mismo que decir que existe una que mide mal.

## Definición

Sea $D$ un conjunto no vacío, el **dominio**, y $P(x)$ un **predicado**: un enunciado que se convierte en proposición al sustituir $x$ por un elemento de $D$.

:::definicion[Cuantificadores]
- $\forall x \in D:\ P(x)$ es verdadera si y solo si $P(a)$ es verdadera para todo $a \in D$.
- $\exists x \in D:\ P(x)$ es verdadera si y solo si existe al menos un $a \in D$ con $P(a)$ verdadera.
:::

Un elemento $a$ con $P(a)$ falsa es un **contraejemplo** de la afirmación universal; un elemento con $P(a)$ verdadera es un **testigo** de la existencial. Si $D = \{a_1, \dots, a_n\}$ es finito,

$$
\forall x\, P(x) \equiv P(a_1) \land \dots \land P(a_n), \qquad \exists x\, P(x) \equiv P(a_1) \lor \dots \lor P(a_n).
$$

:::nota[Qué significa cada símbolo]
- $D$: dominio, el conjunto de valores que puede tomar $x$.
- $x$: variable que recorre el dominio.
- $P(x)$: predicado, afirmación que se vuelve verdadera o falsa al sustituir $x$.
- $\forall$: "para todo".
- $\exists$: "existe al menos un".
- $a, a_1, \dots, a_n$: elementos concretos del dominio; $n$ es el número de elementos si $D$ es finito.
- $\iff$: "si y solo si".
:::

## Cómo usar la visualización

Cada círculo es un elemento del dominio. La reproducción los revisa en orden: verde si cumple el predicado y naranja si no. Arriba se lleva el estado de las dos afirmaciones; la universal se decide en falso con el primer contraejemplo, y la existencial en verdadero con el primer testigo. Los controles cambian el predicado, el primer elemento y el tamaño del dominio.

Con el predicado "x es primo" y el dominio de 1 a 20, el contraejemplo aparece de inmediato (1 no es primo), mientras que el testigo tarda un paso más. Al elegir "x < k" con k mayor que todo el dominio, la afirmación universal solo se confirma al revisar el último elemento.

## Ejemplo

Sea $D = \{12, 15, 18, 21\}$, las edades de los integrantes de un equipo juvenil, y $P(x)$: "$x$ es múltiplo de 3".

1. $\forall x \in D:\ P(x)$. Revisamos: $12 = 3 \cdot 4$, $15 = 3 \cdot 5$, $18 = 3 \cdot 6$, $21 = 3 \cdot 7$. No hay contraejemplo, así que es verdadera.
2. Sea $Q(x)$: "$x$ es par". $\forall x \in D:\ Q(x)$ es falsa, y $15$ es un contraejemplo.
3. $\exists x \in D:\ x > 20$ es verdadera, con testigo $21$.
4. La negación de $\forall x \in D:\ Q(x)$ es $\exists x \in D:\ \lnot Q(x)$, "existe una edad impar", verdadera por el mismo contraejemplo.

:::figura[El dominio del ejemplo, las edades 12, 15, 18 y 21. Con "x es múltiplo de 3" la afirmación universal se confirma al revisar todos los elementos; con "x es par" el primer contraejemplo, 15, la refuta de inmediato.]{componente="LogicViz"}
```yaml
modo: cuantificadores
predicado: divisible-entre-3
predicados: [divisible-entre-3, par, impar, positivo]
dominio: [12, 15, 18, 21]
```
:::

## Propiedades

- **Negación:** $\lnot \forall x\, P(x) \equiv \exists x\, \lnot P(x)$ y $\lnot \exists x\, P(x) \equiv \forall x\, \lnot P(x)$.
- **Distribución:** $\forall x\, (P(x) \land Q(x)) \equiv \forall x\, P(x) \land \forall x\, Q(x)$ y $\exists x\, (P(x) \lor Q(x)) \equiv \exists x\, P(x) \lor \exists x\, Q(x)$. Las otras dos combinaciones no son equivalencias en general.
- **Orden de cuantificadores distintos:** $\exists y\, \forall x\, R(x, y)$ implica $\forall x\, \exists y\, R(x, y)$, pero no al revés.
- **Dominio vacío:** si $D = \varnothing$, $\forall x\, P(x)$ es verdadera y $\exists x\, P(x)$ es falsa.

:::demostracion
Si $\lnot \forall x\, P(x)$ es verdadera, no todo elemento cumple $P$, así que hay algún $a$ con $P(a)$ falsa, es decir, $\exists x\, \lnot P(x)$. Recíprocamente, un $a$ con $\lnot P(a)$ impide que todos cumplan $P$.
:::

## Errores comunes

- **Probar un "para todo" con ejemplos.** Muchos casos favorables no demuestran la afirmación universal; un solo contraejemplo la refuta.
- **Negar mal.** La negación de "todos los días llueve" es "algún día no llueve", no "ningún día llueve".
- **Intercambiar cuantificadores.** "Todo estudiante tiene un tutor" ($\forall x\, \exists y$) no significa "hay un tutor de todos los estudiantes" ($\exists y\, \forall x$).
- **Olvidar el dominio.** "$\exists x:\ x^2 = 2$" es falsa en los racionales y verdadera en los reales.

:::figura[El orden de los cuantificadores. Cada estudiante tiene un tutor, así que "para todo estudiante existe un tutor" es verdadera; ningún tutor atiende a todos los estudiantes, así que "existe un tutor para todo estudiante" es falsa.]{componente="FunctionMapping"}
```yaml
modo: funcion
ejemplos:
  - nombre: Estudiantes y tutores
    dominio: [Ana, Beto, Caro, Dani, Eli]
    codominio: [Tutor 1, Tutor 2, Tutor 3]
    flechas: [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]]
```
:::

## Conexiones

Los cuantificadores extienden los [[proposiciones-y-conectivos-logicos|conectivos lógicos]]: sobre un dominio finito son conjunciones y disyunciones largas. La notación por comprensión de [[conjuntos-y-notacion]] usa predicados para definir conjuntos, y la [[induccion-matematica]] es la herramienta para demostrar afirmaciones universales sobre los naturales. Las definiciones de límite en [[sucesiones]] combinan varios cuantificadores en un orden preciso.

## Formulario

:::formula[Negación del cuantificador universal]
$$
\lnot\,\forall x \in D:\ P(x) \iff \exists x \in D:\ \lnot P(x)
$$

- $\forall x \in D$: "para todo $x$ del dominio $D$".
- $\exists x \in D$: "existe un $x$ en $D$".
- $P(x)$: el predicado; $\lnot P(x)$, su negación.
- El $x$ que cumple $\lnot P(x)$ es un contraejemplo.
:::

:::formula[Negación del cuantificador existencial]
$$
\lnot\,\exists x \in D:\ P(x) \iff \forall x \in D:\ \lnot P(x)
$$

- $D$: dominio.
- $P(x)$: predicado.
- La afirmación dice que ningún elemento de $D$ cumple $P$.
:::

:::formula[Cuantificadores en un dominio finito]
$$
\forall x\, P(x) \equiv P(a_1) \land \dots \land P(a_n), \qquad \exists x\, P(x) \equiv P(a_1) \lor \dots \lor P(a_n)
$$

- $a_1, \dots, a_n$: los $n$ elementos del dominio finito $D$.
- $\land$: todos deben cumplir.
- $\lor$: basta que uno cumpla.
:::
