---
id: problema-de-los-tres-prisioneros
titulo: Problema de los tres prisioneros
titulo_en: Three prisoners problem
alias:
  - paradoja de los tres prisioneros
  - problema del guardia
modulo: 1
submodulo: '1.2'
orden: 14
nivel: basico
prerrequisitos:
  - arboles-de-probabilidad
  - teorema-de-bayes
relaciones:
  - tipo: relacionado
    id: problema-de-monty-hall
etiquetas:
  - paradojas
  - información
  - teorema de Bayes
  - protocolo
resumen: >
  Uno de tres prisioneros será indultado. Que el guardia nombre a otro que será ejecutado no cambia la
  probabilidad 1/3 de quien pregunta, pero eleva a 2/3 la del prisionero no nombrado.
formula: 'P(A \text{ indultado} \mid \text{guardia dice } B) = \frac{1}{3}, \qquad P(C \text{ indultado} \mid \text{guardia dice } B) = \frac{2}{3}'
visualizacion:
  componente: ProbabilityTree
  parametros:
    niveles: [Indultado, El guardia nombra]
    contexto: El prisionero A pregunta al guardia el nombre de uno de los otros dos que será ejecutado. Si los dos lo serán, el guardia elige al azar.
    ramas:
      - etiqueta: A
        prob: 0.3333333333
        ramas:
          - etiqueta: Nombra a B
            prob: 0.5
          - etiqueta: Nombra a C
            prob: 0.5
      - etiqueta: B
        prob: 0.3333333333
        ramas:
          - etiqueta: Nombra a C
            prob: 1
      - etiqueta: C
        prob: 0.3333333334
        ramas:
          - etiqueta: Nombra a B
            prob: 1
    consultas:
      - nombre: A indultado dado que nombra a B
        hojas: [A/Nombra a B]
        condicion: [A/Nombra a B, C/Nombra a B]
      - nombre: C indultado dado que nombra a B
        hojas: [C/Nombra a B]
        condicion: [A/Nombra a B, C/Nombra a B]
      - nombre: El guardia nombra a B
        hojas: [A/Nombra a B, C/Nombra a B]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2'
publicado: true
---

## Intuición

Tres prisioneros, A, B y C, saben que dos serán ejecutados y uno indultado, elegido al azar. El prisionero A le pide al guardia: "dime el nombre de uno de los otros dos que será ejecutado; como al menos uno de ellos lo será, no me das información sobre mí". El guardia responde "B". A razona: "ahora solo quedamos C y yo, así que mi probabilidad de salvarme subió de 1/3 a 1/2".

El razonamiento de A es incorrecto. El guardia siempre podía nombrar a alguien distinto de A, así que su respuesta no dice nada sobre A: su probabilidad sigue siendo 1/3. Lo que sí cambió es la de C. Antes de la respuesta, B y C compartían 2/3; ahora que B quedó descartado, C tiene 2/3.

Es el mismo problema que el de Monty Hall, publicado décadas antes por Martin Gardner. El punto central es que la probabilidad condicional depende de cómo se generó la información (aquí, de la regla del guardia), no solo de cuál fue la respuesta.

## Definición

Supuestos:

1. El indultado es A, B o C con probabilidad 1/3 cada uno.
2. El guardia nunca nombra a A ni al indultado.
3. Si A es el indultado, el guardia nombra a B o a C con probabilidad 1/2 cada uno.

:::teorema[Tres prisioneros]
Con esos supuestos, si el guardia nombra a B,
$$
P(A \mid G_B) = \frac{\tfrac{1}{2}\cdot\tfrac{1}{3}}{\tfrac{1}{2}\cdot\tfrac{1}{3} + 0\cdot\tfrac{1}{3} + 1\cdot\tfrac{1}{3}} = \frac{1}{3}, \qquad P(C \mid G_B) = \frac{2}{3}.
$$
:::

:::figura[La respuesta del guardia como dato: sus verosimilitudes son 1/2, 0 y 1 según quién sea el indultado. La a posteriori deja a A en 1/3 y lleva a C a 2/3.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: A indultado
    prior: 0.3333333333
  - nombre: B indultado
    prior: 0.3333333333
  - nombre: C indultado
    prior: 0.3333333334
observaciones:
  - nombre: Guardia nombra a B
    verosimilitudes: [0.5, 0, 1]
  - nombre: Guardia nombra a C
    verosimilitudes: [0.5, 1, 0]
secuencia: [Guardia nombra a B]
```
:::

:::nota[Qué significa cada símbolo]
- $A$, $B$, $C$: los eventos "el indultado es A", "es B", "es C".
- $G_B$: el guardia nombra a B como uno de los que serán ejecutados.
- $P(G_B \mid A)$, $P(G_B \mid B)$, $P(G_B \mid C)$: probabilidades de esa respuesta según quién sea el indultado (1/2, 0 y 1).
- $q$: en la versión con preferencias, probabilidad de que el guardia nombre a B cuando puede elegir.
:::

## Cómo usar la visualización

El árbol tiene en el primer nivel al indultado (1/3 cada uno) y en el segundo la respuesta del guardia. Si el indultado es A, el guardia elige entre B y C; si es B o C, solo tiene una opción. La consulta "A indultado dado que nombra a B" divide la hoja A/Nombra a B (1/6) entre la suma de las hojas en que nombra a B (1/6 + 1/3 = 1/2), y da 1/3.

La consulta para C da 2/3 con el mismo denominador. La tercera muestra que el guardia nombra a B con probabilidad 1/2, como era de esperar por simetría.

## Ejemplo

Se resuelve con frecuencias. Supóngase que la situación se repite 600 veces.

1. En 200 casos el indultado es A; en 100 de ellos el guardia nombra a B y en 100 a C.
2. En 200 casos es B; el guardia nombra a C.
3. En 200 casos es C; el guardia nombra a B.
4. El guardia nombra a B en $100 + 200 = 300$ casos. A es el indultado en 100 de ellos: $100/300 = 1/3$. C lo es en 200: $200/300 = 2/3$.

:::figura[Las 600 repeticiones como cuadrado: la columna A tiene la mitad de su altura en "nombra a B", la columna C la tiene completa y la columna B nada. Al condicionar, C ocupa dos tercios del nuevo cuadrado.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: A
    prob: 0.3333333333
  - etiqueta: B
    prob: 0.3333333333
  - etiqueta: C
    prob: 0.3333333334
evento: Nombra a B
complemento: nombra a C
condicionales: [0.5, 0, 1]
columna: 0
```
:::

## Propiedades

- **La pregunta de A no lo informa sobre sí mismo:** la respuesta "B" tiene probabilidad 1/2 tanto si A es el indultado como si no lo es, así que $G_B$ es independiente de $A$ y $P(A \mid G_B) = P(A)$.
- **Equivalencia con Monty Hall:** A es la puerta elegida, el guardia es el presentador y C es la puerta que queda cerrada.
- **Dependencia del protocolo:** si el guardia, cuando puede elegir, nombra a B con probabilidad $q$, entonces $P(A \mid G_B) = q/(q + 1)$; solo con $q = 1/2$ vale 1/3.
- **Si el guardia hablara con C:** la respuesta tendría la misma estructura y C quedaría en 1/3, lo que muestra que la asimetría viene de quién pregunta.

:::figura[Un guardia con preferencia: si cuando puede elegir siempre nombra a B (q = 1), la respuesta "B" deja a A y a C con 1/2 cada uno.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: A
    prob: 0.3333333333
  - etiqueta: B
    prob: 0.3333333333
  - etiqueta: C
    prob: 0.3333333334
evento: Nombra a B
complemento: nombra a C
condicionales: [1, 0, 1]
columna: 0
```
:::

## Errores comunes

- **Repartir uniformemente entre los que quedan.** Que queden dos candidatos no implica 1/2 para cada uno; la probabilidad depende de cómo se eliminó al tercero.
- **Confundir "B será ejecutado" con "el guardia dijo B".** Si A supiera solo que B será ejecutado (por ejemplo, por un anuncio público que no podía nombrarlo a él), su probabilidad sí sería 1/2. Lo que se condiciona es la respuesta del guardia con su regla.
- **Olvidar la regla del guardia cuando A es el indultado.** El factor 1/2 de esa rama es el que deja a A en 1/3.

:::figura[Si la información fuera "B será ejecutado", sin la regla del guardia, se condicionaría en el evento "el indultado no es B": A y C quedarían con 1/2 cada uno.]{componente="ProbabilitySquare"}
```yaml
modo: bayes
particion:
  - etiqueta: A
    prob: 0.3333333333
  - etiqueta: B
    prob: 0.3333333333
  - etiqueta: C
    prob: 0.3333333334
evento: B ejecutado
complemento: B indultado
condicionales: [1, 0, 1]
columna: 2
```
:::

## Conexiones

El problema se resuelve con el [[teorema-de-bayes]] y con [[arboles-de-probabilidad]], y tiene la estructura del [[problema-de-monty-hall]]. Ilustra que la [[probabilidad-condicional]] depende del mecanismo que produce la información, y que suponer [[espacios-equiprobables]] entre los casos restantes es un error frecuente. La misma idea aparece en el diseño de experimentos, donde la forma de seleccionar los datos afecta qué se puede concluir de ellos.

## Formulario

:::formula[Probabilidad de A tras la respuesta]
$$
P(A \mid G_B) = \frac{P(G_B \mid A)\,P(A)}{P(G_B)} = \frac{\tfrac{1}{2}\cdot\tfrac{1}{3}}{\tfrac{1}{2}} = \frac{1}{3}
$$

- $G_B$: el guardia nombra a B; $P(G_B) = 1/2$ por la ley de probabilidad total.
:::

:::formula[Probabilidad de C tras la respuesta]
$$
P(C \mid G_B) = \frac{1 \cdot \tfrac{1}{3}}{\tfrac{1}{2}} = \frac{2}{3}
$$

- Si el indultado es C, el guardia está obligado a nombrar a B.
:::

:::formula[Guardia con preferencia q]
$$
P(A \mid G_B) = \frac{q}{q + 1}
$$

- $q$: probabilidad de nombrar a B cuando el indultado es A y el guardia puede elegir.
:::
