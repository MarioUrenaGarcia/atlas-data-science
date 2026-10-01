---
id: ley-de-probabilidad-total
titulo: Ley de probabilidad total
titulo_en: Law of total probability
alias:
  - teorema de la probabilidad total
  - regla de la probabilidad total
  - fórmula de la probabilidad total
modulo: 1
submodulo: '1.2'
orden: 4
nivel: basico
prerrequisitos:
  - regla-del-producto
  - particiones-de-un-conjunto
relaciones:
  - tipo: relacionado
    id: teorema-de-bayes
etiquetas:
  - partición
  - promedio ponderado
  - casos
  - mezcla
resumen: >
  Si los eventos B_1, ..., B_k forman una partición, la probabilidad de A es el promedio de las
  probabilidades condicionales P(A | B_i) ponderado por las probabilidades P(B_i).
formula: 'P(A) = \sum_{i=1}^{k} P(A \mid B_i)\,P(B_i)'
visualizacion:
  componente: ProbabilitySquare
  parametros:
    modo: total
    particion:
      - etiqueta: Planta 1
        prob: 0.5
      - etiqueta: Planta 2
        prob: 0.3
      - etiqueta: Planta 3
        prob: 0.2
    evento: Defectuosa
    complemento: buena
    condicionales: [0.02, 0.05, 0.1]
    contexto: Una empresa fabrica la misma pieza en tres plantas, con distintas tasas de defectos.
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.3'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

Una empresa fabrica la misma pieza en tres plantas. La mitad de la producción sale de la planta 1, que tiene 2 % de piezas defectuosas; el 30 % de la planta 2, con 5 %; y el 20 % de la planta 3, con 10 %. ¿Qué proporción de todas las piezas es defectuosa? No es el promedio simple de 2, 5 y 10 %, porque las plantas no producen lo mismo: hay que ponderar cada tasa por el peso de su planta.

La ley de probabilidad total hace exactamente eso. Cuando el espacio muestral se divide en casos que no se traslapan y cubren todo, la probabilidad de un evento se obtiene calculándola dentro de cada caso y promediando con los pesos de los casos. Es la estrategia de "dividir en casos" escrita como fórmula.

Geométricamente, si el cuadrado unitario se parte en columnas, una por planta, con anchos iguales a sus proporciones, las piezas defectuosas ocupan la parte inferior de cada columna. El área total de esas partes inferiores es la probabilidad de defecto.

## Definición

:::teorema[Ley de probabilidad total]
Sean $B_1, \dots, B_k$ eventos que forman una partición de $\Omega$ (mutuamente excluyentes y con unión $\Omega$), con $P(B_i) > 0$. Para cualquier evento $A$,
$$
P(A) = \sum_{i=1}^{k} P(A \mid B_i)\,P(B_i).
$$
:::

:::demostracion
Como los $B_i$ forman una partición, $A$ es la unión disjunta de $A \cap B_1, \dots, A \cap B_k$. Por la aditividad, $P(A) = \sum_i P(A \cap B_i)$, y por la regla del producto, $P(A \cap B_i) = P(A \mid B_i)\,P(B_i)$.
:::

El caso más usado tiene dos piezas, $B$ y $B^{c}$: $P(A) = P(A \mid B)\,P(B) + P(A \mid B^{c})\,P(B^{c})$.

:::figura[Con dos casos: la probabilidad de positivo es el área de las dos partes inferiores, 0.1 por 0.9 más 0.9 por 0.2, igual a 0.27.]{componente="ProbabilitySquare"}
```yaml
modo: total
particion:
  - etiqueta: Enfermo
    prob: 0.1
  - etiqueta: Sano
    prob: 0.9
evento: Positivo
complemento: negativo
condicionales: [0.9, 0.2]
```
:::

:::nota[Qué significa cada símbolo]
- $B_1, \dots, B_k$: casos que forman una partición de $\Omega$; $k$ es el número de casos.
- $P(B_i)$: probabilidad o peso del caso $i$ (ancho de su columna).
- $A$: evento cuya probabilidad se busca.
- $P(A \mid B_i)$: probabilidad de $A$ dentro del caso $i$ (altura de la parte inferior de la columna).
- $\sum_{i=1}^{k}$: suma sobre todos los casos.
- $B^{c}$: complemento de $B$, el otro caso cuando solo hay dos.
:::

## Cómo usar la visualización

Las tres columnas tienen anchos 0.5, 0.3 y 0.2, las proporciones de producción de cada planta. Dentro de cada columna, la parte inferior son las piezas defectuosas: su altura es la tasa de defectos de esa planta. La animación suma las áreas una columna a la vez, y la fórmula de arriba muestra la suma parcial con los números.

Con los valores iniciales, $P(\text{defectuosa}) = 0.5 \cdot 0.02 + 0.3 \cdot 0.05 + 0.2 \cdot 0.1 = 0.045$. Al subir el peso de la planta 3, la proporción total de defectos crece aunque ninguna tasa cambie. Si se igualan las tres tasas, la probabilidad total coincide con ellas, sin importar los pesos.

## Ejemplo

En una ciudad, 60 % de los viajes al trabajo se hacen en transporte público, 30 % en auto y 10 % en bicicleta. La probabilidad de llegar tarde es 0.15 en transporte público, 0.10 en auto y 0.05 en bicicleta.

1. Partición: $T$ (transporte público), $U$ (auto), $C$ (bicicleta), con $P(T) = 0.6$, $P(U) = 0.3$, $P(C) = 0.1$.
2. Condicionales: $P(L \mid T) = 0.15$, $P(L \mid U) = 0.10$, $P(L \mid C) = 0.05$, donde $L$ es "llega tarde".
3. Ley de probabilidad total: $P(L) = 0.15 \cdot 0.6 + 0.10 \cdot 0.3 + 0.05 \cdot 0.1 = 0.09 + 0.03 + 0.005 = 0.125$.
4. Uno de cada ocho viajes termina en retraso.

:::figura[El ejemplo de los viajes como árbol: cada camino que termina en "Tarde" multiplica el peso del medio de transporte por su tasa de retraso, y la consulta suma esos tres caminos.]{componente="ProbabilityTree"}
```yaml
niveles: [Medio, Llegada]
ramas:
  - etiqueta: Transporte público
    prob: 0.6
    ramas:
      - etiqueta: Tarde
        prob: 0.15
      - etiqueta: A tiempo
        prob: 0.85
  - etiqueta: Auto
    prob: 0.3
    ramas:
      - etiqueta: Tarde
        prob: 0.1
      - etiqueta: A tiempo
        prob: 0.9
  - etiqueta: Bicicleta
    prob: 0.1
    ramas:
      - etiqueta: Tarde
        prob: 0.05
      - etiqueta: A tiempo
        prob: 0.95
consultas:
  - nombre: Llega tarde
    hojas: [Transporte público/Tarde, Auto/Tarde, Bicicleta/Tarde]
```
:::

## Propiedades

- **Promedio ponderado:** $P(A)$ está entre el menor y el mayor de los $P(A \mid B_i)$; nunca puede ser mayor que todas las tasas condicionales ni menor que todas.
- **Caso independiente:** si $P(A \mid B_i)$ es igual para todo $i$, entonces $P(A)$ es ese valor común.
- **Base de Bayes:** el denominador del teorema de Bayes, $P(A)$, se calcula con esta ley.
- **Versión con esperanzas:** la misma idea, aplicada a variables aleatorias, es la ley de la esperanza total.

:::figura[Si todas las plantas tienen la misma tasa de defectos (5 %), la línea divisoria es recta y la probabilidad total es 0.05, sin importar cuánto produce cada planta.]{componente="ProbabilitySquare"}
```yaml
modo: total
particion:
  - etiqueta: Planta 1
    prob: 0.5
  - etiqueta: Planta 2
    prob: 0.3
  - etiqueta: Planta 3
    prob: 0.2
evento: Defectuosa
complemento: buena
condicionales: [0.05, 0.05, 0.05]
```
:::

## Errores comunes

- **Promediar las condicionales sin ponderar.** El promedio simple de 0.02, 0.05 y 0.10 es 0.057, no la respuesta 0.045.
- **Usar casos que no forman una partición.** Si los casos se traslapan o no cubren todo el espacio, la suma cuenta de más o de menos.
- **Confundir $P(A \mid B_i)$ con $P(B_i \mid A)$.** La ley usa la probabilidad del evento dentro de cada caso; la proporción de cada caso entre los que cumplen $A$ es una pregunta del teorema de Bayes.

:::figura[Ponderar importa: si la planta 3, la de más defectos, produce el 60 % en lugar del 20 %, la probabilidad total sube a 0.0725 con las mismas tres tasas.]{componente="ProbabilitySquare"}
```yaml
modo: total
particion:
  - etiqueta: Planta 1
    prob: 0.25
  - etiqueta: Planta 2
    prob: 0.15
  - etiqueta: Planta 3
    prob: 0.6
evento: Defectuosa
complemento: buena
condicionales: [0.02, 0.05, 0.1]
```
:::

## Conexiones

La ley combina la [[regla-del-producto]] con la aditividad sobre [[particiones-de-un-conjunto]]. Es el cálculo que se hace al sumar hojas en los [[arboles-de-probabilidad]] y da el denominador del [[teorema-de-bayes]]. Ilumina la [[paradoja-de-simpson]], donde los pesos de los casos cambian una comparación, y es la herramienta central en el [[problema-de-la-ruina-del-jugador]], donde se condiciona en el resultado de la primera apuesta.

## Formulario

:::formula[Ley de probabilidad total]
$$
P(A) = \sum_{i=1}^{k} P(A \mid B_i)\,P(B_i)
$$

- $B_1, \dots, B_k$: partición del espacio muestral.
- $P(B_i)$: peso de cada caso; $P(A \mid B_i)$: probabilidad de $A$ en ese caso.
:::

:::formula[Caso de dos piezas]
$$
P(A) = P(A \mid B)\,P(B) + P(A \mid B^{c})\,P(B^{c})
$$

- $B$, $B^{c}$: un evento y su complemento, que siempre forman una partición.
:::

:::formula[Cota del promedio ponderado]
$$
\min_i P(A \mid B_i) \le P(A) \le \max_i P(A \mid B_i)
$$

- $\min_i$, $\max_i$: menor y mayor de las probabilidades condicionales.
:::
