---
id: eventos
titulo: Eventos
titulo_en: Events
alias:
  - suceso
  - sucesos
  - evento aleatorio
modulo: 1
submodulo: '1.1'
orden: 3
nivel: basico
prerrequisitos:
  - espacio-muestral
  - operaciones-de-conjuntos
relaciones:
  - tipo: relacionado
    id: leyes-de-de-morgan
  - tipo: relacionado
    id: diagramas-de-venn
etiquetas:
  - subconjuntos
  - unión e intersección
  - complemento
  - eventos excluyentes
resumen: >
  Un evento es un subconjunto del espacio muestral. Ocurre cuando el resultado del experimento
  pertenece a él, y los eventos se combinan con las operaciones de conjuntos: unión, intersección y complemento.
formula: 'A \subseteq \Omega, \qquad A \text{ ocurre} \iff \omega \in A'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: eventos
    experimento: dos-dados
    eventoA: suma-mayor-9
    eventoB: dobles
    operacion: union
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.2'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

Las preguntas que se hacen sobre un experimento rara vez se refieren a un resultado individual. Al lanzar dos dados interesa saber si "la suma es 10 o más", si "salieron dobles" o si "hay al menos un 6". Cada una de esas afirmaciones es verdadera para algunos resultados y falsa para otros, así que puede identificarse con el conjunto de resultados que la hacen verdadera. Ese conjunto es un evento.

Con esta traducción, la lógica se convierte en operaciones de conjuntos. "A o B" es la unión, "A y B" es la intersección y "no A" es el complemento. Decir que dos afirmaciones no pueden ser verdaderas a la vez equivale a decir que sus conjuntos no tienen elementos en común. Todo el cálculo de probabilidades trabaja con estos conjuntos.

Un evento **ocurre** cuando el resultado obtenido pertenece a él. Si salen $(5, 5)$, ocurren a la vez "dobles", "la suma es 10 o más" y "no sale ningún 6", y no ocurre "la suma es 7".

## Definición

:::definicion[Evento]
Un **evento** es un subconjunto $A \subseteq \Omega$ del espacio muestral. Si el resultado del experimento es $\omega$, el evento $A$ **ocurre** cuando $\omega \in A$.
:::

Casos particulares: $\Omega$ es el **evento seguro** (siempre ocurre), $\varnothing$ es el **evento imposible** (nunca ocurre) y un conjunto de un solo resultado $\{\omega\}$ es un **evento elemental**.

Operaciones con eventos $A, B \subseteq \Omega$:

| Lenguaje    | Conjunto                       | Ocurre cuando                     |
| ----------- | ------------------------------ | --------------------------------- |
| A o B       | $A \cup B$                     | ocurre al menos uno de los dos    |
| A y B       | $A \cap B$                     | ocurren los dos                   |
| no A        | $A^{c} = \Omega \setminus A$   | no ocurre $A$                     |
| A pero no B | $A \setminus B = A \cap B^{c}$ | ocurre $A$ y no ocurre $B$        |
| A implica B | $A \subseteq B$                | siempre que ocurre $A$ ocurre $B$ |

Dos eventos son **mutuamente excluyentes** (o disjuntos) si $A \cap B = \varnothing$: no pueden ocurrir a la vez.

:::figura[Un evento es un subconjunto del espacio muestral: "sale al menos un 6" ocupa la última fila y la última columna de la rejilla, 11 de los 36 resultados.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: al-menos-un-seis
operaciones: [A]
```

:::

:::figura[El complemento de "sale al menos un 6" es "no sale ningún 6": el cuadrado de 5 por 5 que queda al quitar la última fila y la última columna.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: al-menos-un-seis
eventoB: dobles
operacion: complemento
operaciones: [A, complemento]
```

:::

:::nota[Qué significa cada símbolo]

- $\Omega$: espacio muestral; $\omega$: resultado obtenido.
- $A, B$: eventos, es decir, subconjuntos de $\Omega$.
- $\subseteq$: "es subconjunto de"; $A \subseteq B$ significa que todo resultado de $A$ está en $B$.
- $\in$: pertenencia; $\omega \in A$ significa que el resultado está en $A$.
- $\iff$: "si y solo si".
- $\cup$, $\cap$: unión (al menos uno) e intersección (los dos).
- $A^{c}$: complemento de $A$, los resultados de $\Omega$ que no están en $A$.
- $\setminus$: diferencia de conjuntos.
- $\varnothing$: conjunto vacío, el evento imposible.
:::

## Cómo usar la visualización

La rejilla contiene los 36 resultados de lanzar dos dados. Las casillas azul claro forman el evento A y las rayadas el evento B. El selector "Evento que se cuenta" aplica una operación (unión, intersección, complemento, diferencia) y la reproducción recorre la rejilla marcando los resultados del evento resultante mientras lleva la cuenta.

Con A = "la suma es 10 o más" y B = "dobles", cada evento tiene 6 resultados; la intersección tiene solo 2, $(5, 5)$ y $(6, 6)$, y la unión tiene 10. Al elegir "Exactamente uno de los dos" se obtienen 8 resultados, la unión menos la intersección. Al cambiar B por "la suma es 7", la intersección con los dobles queda vacía: son eventos mutuamente excluyentes.

## Ejemplo

Se saca una carta de una baraja inglesa de 52 cartas. Sean $R$ = "la carta es roja" y $F$ = "la carta es una figura (J, Q o K)".

1. $|R| = 26$ (corazones y diamantes) y $|F| = 12$ (tres figuras por palo).
2. $R \cap F$ = "figura roja": J, Q y K de corazones y de diamantes, 6 cartas.
3. $R \cup F$ = "roja o figura": las 26 rojas más las 6 figuras negras, 32 cartas.
4. $F \setminus R$ = "figura negra": 6 cartas.
5. $(R \cup F)^{c}$ = "carta negra que no es figura": $52 - 32 = 20$ cartas, que coincide con $R^{c} \cap F^{c}$ por las leyes de De Morgan.

:::figura[Las cartas del ejemplo: las rojas son las dos primeras filas y las figuras son las tres últimas columnas. La unión cubre 32 casillas; al cambiar la operación se obtienen la intersección (6), la diferencia y el complemento.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: carta
eventoA: roja
eventoB: figura
operacion: union
operaciones: [union, interseccion, diferencia, complemento]
```

:::

## Propiedades

- **Álgebra de eventos:** la unión, la intersección y el complemento de eventos son eventos, y cumplen las leyes de los conjuntos: conmutatividad, asociatividad, distributividad y las [[leyes-de-de-morgan]], $(A \cup B)^{c} = A^{c} \cap B^{c}$ y $(A \cap B)^{c} = A^{c} \cup B^{c}$.
- **Partición:** los eventos $B_1, \dots, B_k$ forman una partición de $\Omega$ si son mutuamente excluyentes y su unión es $\Omega$. En cada realización ocurre exactamente uno de ellos.
- **Descomposición disjunta:** todo evento se parte en piezas que no se traslapan, $A = (A \cap B) \cup (A \cap B^{c})$. Esta identidad es la base de la ley de probabilidad total.
- **Eventos en espacios infinitos:** cuando $\Omega$ no es numerable, por razones técnicas no todo subconjunto se considera evento; se trabaja con una familia de eventos cerrada bajo complementos y uniones numerables (una σ-álgebra).

:::figura[Eventos mutuamente excluyentes: "la suma es 7" ocupa la antidiagonal y "dobles" la diagonal. No comparten ninguna casilla, así que su intersección es vacía.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-7
eventoB: dobles
operacion: interseccion
operaciones: [interseccion, union]
```

:::

:::figura[Descomposición disjunta de A = "la suma es 10 o más" según B = "dobles": la intersección (2 casillas) y la diferencia A menos B (4 casillas) no se traslapan y juntas forman A.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-mayor-9
eventoB: dobles
operacion: interseccion
operaciones: [interseccion, diferencia, A]
```

:::

## Errores comunes

- **Leer "o" como exclusivo.** En probabilidad, "A o B" incluye el caso en que ocurren los dos. El "o" exclusivo corresponde a la diferencia simétrica.
- **Confundir "excluyentes" con "complementarios".** "Sale 1" y "sale 2" en un dado son excluyentes, pero no complementarios: su unión no es todo $\Omega$.
- **Confundir "al menos uno" con "exactamente uno".** Al lanzar cuatro monedas, "al menos una cara" tiene 15 resultados y "exactamente una cara" solo 4.
- **Confundir un resultado con un evento.** El resultado $(6, 6)$ es un elemento de $\Omega$; el evento correspondiente es el conjunto $\{(6, 6)\}$.

:::figura[El "o" de probabilidad es inclusivo. Con A = "primer dado par" y B = "segundo dado par", la unión tiene 27 casillas; "exactamente uno de los dos" excluye las 9 en que ambos son pares y deja 18.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: primero-par
eventoB: segundo-par
operacion: union
operaciones: [union, diferencia-simetrica, interseccion]
```

:::

:::figura[Con cuatro monedas, "sale al menos una cara" abarca 15 de los 16 resultados, mientras que "sale exactamente una cara" abarca solo 4.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: cuatro-monedas
eventoA: al-menos-una-cara
eventoB: exactamente-una-cara
operacion: A
operaciones: [A, B]
```

:::

## Conexiones

Los eventos son subconjuntos del [[espacio-muestral]] y se manipulan con las [[operaciones-de-conjuntos]] y las [[leyes-de-de-morgan]]; los [[diagramas-de-venn]] los representan gráficamente. Los [[axiomas-de-kolmogorov]] asignan una probabilidad a cada evento, y la [[probabilidad-de-la-union-de-eventos]] muestra cómo calcular la de una unión a partir de las de sus partes. Más adelante, la probabilidad condicional estudia cómo cambia la probabilidad de un evento cuando se sabe que otro ocurrió.

## Formulario

:::formula[Evento y ocurrencia]

$$
A \subseteq \Omega, \qquad A \text{ ocurre} \iff \omega \in A
$$

- $A$: evento; $\Omega$: espacio muestral.
- $\omega$: resultado de la realización.
:::

:::formula[Complemento]

$$
A^{c} = \Omega \setminus A = \{\omega \in \Omega : \omega \notin A\}
$$

- $A^{c}$: resultados en los que no ocurre $A$.
- $\notin$: "no pertenece a".
:::

:::formula[Eventos mutuamente excluyentes]

$$
A \cap B = \varnothing
$$

- $A \cap B$: resultados en los que ocurren $A$ y $B$ a la vez.
- $\varnothing$: evento imposible.
:::

:::formula[Leyes de De Morgan]

$$
(A \cup B)^{c} = A^{c} \cap B^{c}, \qquad (A \cap B)^{c} = A^{c} \cup B^{c}
$$

- $\cup$: al menos uno ocurre; $\cap$: ambos ocurren.
- $^{c}$: complemento.
:::

:::formula[Descomposición disjunta]

$$
A = (A \cap B) \cup (A \cap B^{c})
$$

- Las dos piezas son mutuamente excluyentes y su unión es $A$.
:::
