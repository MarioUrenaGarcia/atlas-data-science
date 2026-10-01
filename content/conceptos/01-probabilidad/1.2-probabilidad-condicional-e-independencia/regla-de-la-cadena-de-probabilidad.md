---
id: regla-de-la-cadena-de-probabilidad
titulo: Regla de la cadena de probabilidad
titulo_en: Chain rule of probability
alias:
  - regla general de la multiplicación
  - fórmula de multiplicación para n eventos
modulo: 1
submodulo: '1.2'
orden: 3
nivel: basico
prerrequisitos:
  - regla-del-producto
relaciones:
  - tipo: generaliza
    id: regla-del-producto
  - tipo: relacionado
    id: arboles-de-probabilidad
etiquetas:
  - intersección de varios eventos
  - etapas sucesivas
  - sin reemplazo
  - árboles
resumen: >
  La probabilidad de que ocurran n eventos es el producto de la probabilidad del primero por la de
  cada evento siguiente condicionada a todos los anteriores.
formula: 'P(A_1 \cap \cdots \cap A_n) = P(A_1)\,P(A_2 \mid A_1) \cdots P(A_n \mid A_1 \cap \cdots \cap A_{n-1})'
visualizacion:
  componente: ProbabilityTree
  parametros:
    niveles: [Pieza 1, Pieza 2, Pieza 3]
    contexto: Un lote tiene 10 piezas y 3 son defectuosas. Se revisan 3 piezas al azar, sin reemplazo.
    ramas:
      - etiqueta: Buena
        prob: 0.7
        ramas:
          - etiqueta: Buena
            prob: 0.6666666667
            ramas:
              - etiqueta: Buena
                prob: 0.625
              - etiqueta: Defectuosa
                prob: 0.375
          - etiqueta: Defectuosa
            prob: 0.3333333333
            ramas:
              - etiqueta: Buena
                prob: 0.75
              - etiqueta: Defectuosa
                prob: 0.25
      - etiqueta: Defectuosa
        prob: 0.3
        ramas:
          - etiqueta: Buena
            prob: 0.7777777778
            ramas:
              - etiqueta: Buena
                prob: 0.75
              - etiqueta: Defectuosa
                prob: 0.25
          - etiqueta: Defectuosa
            prob: 0.2222222222
            ramas:
              - etiqueta: Buena
                prob: 0.875
              - etiqueta: Defectuosa
                prob: 0.125
    consultas:
      - nombre: Las tres buenas
        hojas: [Buena/Buena/Buena]
      - nombre: Al menos una defectuosa
        hojas:
          - Buena/Buena/Defectuosa
          - Buena/Defectuosa/Buena
          - Buena/Defectuosa/Defectuosa
          - Defectuosa/Buena/Buena
          - Defectuosa/Buena/Defectuosa
          - Defectuosa/Defectuosa/Buena
          - Defectuosa/Defectuosa/Defectuosa
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.3'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

Un inspector revisa tres piezas de un lote de diez en el que hay tres defectuosas. Para que las tres piezas revisadas sean buenas, la primera debe ser buena (7 de 10), la segunda también, sabiendo que ya salió una buena (6 de 9), y la tercera, sabiendo que ya salieron dos buenas (5 de 8). La probabilidad de que todo salga bien es el producto de esas tres fracciones.

La regla de la cadena extiende la regla del producto a cualquier número de etapas. Cada factor responde a la pregunta "¿qué tan probable es este paso, dado todo lo que ya pasó?". En un árbol de probabilidad, ese producto es lo que se acumula al recorrer un camino de la raíz a una hoja.

La regla vale siempre, haya o no dependencia entre las etapas. Cuando las etapas son independientes los factores se simplifican a probabilidades sin condicionar; cuando no lo son, como en la extracción sin reemplazo, cada factor se actualiza con la información acumulada.

## Definición

:::teorema[Regla de la cadena]
Para eventos $A_1, \dots, A_n$ con $P(A_1 \cap \dots \cap A_{n-1}) > 0$,
$$
P\Big(\bigcap_{i=1}^{n} A_i\Big) = P(A_1)\,P(A_2 \mid A_1)\,P(A_3 \mid A_1 \cap A_2) \cdots P(A_n \mid A_1 \cap \cdots \cap A_{n-1}).
$$
:::

:::demostracion
El producto es telescópico: al escribir cada condicional como cociente,
$$
P(A_1)\cdot\frac{P(A_1 \cap A_2)}{P(A_1)}\cdot\frac{P(A_1 \cap A_2 \cap A_3)}{P(A_1 \cap A_2)}\cdots\frac{P(A_1 \cap \cdots \cap A_n)}{P(A_1 \cap \cdots \cap A_{n-1})},
$$
todos los factores se cancelan salvo el último numerador.
:::

:::figura[La regla de la cadena en un árbol de tres etapas: sacar tres cartas sin reemplazo y que las tres sean de corazones. El camino multiplica 13/52, 12/51 y 11/50.]{componente="ProbabilityTree"}
```yaml
niveles: [Carta 1, Carta 2, Carta 3]
ramas:
  - etiqueta: Corazón
    prob: 0.25
    ramas:
      - etiqueta: Corazón
        prob: 0.2352941176
        ramas:
          - etiqueta: Corazón
            prob: 0.22
          - etiqueta: Otra
            prob: 0.78
      - etiqueta: Otra
        prob: 0.7647058824
  - etiqueta: Otra
    prob: 0.75
consultas:
  - nombre: Tres corazones
    hojas: [Corazón/Corazón/Corazón]
```
:::

:::nota[Qué significa cada símbolo]
- $A_1, \dots, A_n$: eventos de cada etapa; $n$ es el número de etapas.
- $\bigcap_{i=1}^{n} A_i$: ocurren todos los eventos.
- $P(A_k \mid A_1 \cap \cdots \cap A_{k-1})$: probabilidad de la etapa $k$ sabiendo que ocurrieron todas las anteriores.
- En el ejemplo, $B_i$: la pieza $i$ revisada es buena.
:::

## Cómo usar la visualización

El árbol crece una etapa a la vez: primero la pieza 1 (buena con 7/10), luego la pieza 2 en cada rama y después la pieza 3. Las probabilidades de cada rama cambian según lo que ya se extrajo. Cuando el árbol está completo, la animación multiplica las probabilidades a lo largo de cada camino y escribe el producto junto a cada hoja; al final suma las hojas de la consulta elegida.

El camino Buena, Buena, Buena da $0.7 \cdot 0.667 \cdot 0.625 \approx 0.292$. La consulta "Al menos una defectuosa" suma las otras siete hojas y da $1 - 0.292 = 0.708$. Las ocho hojas suman 1, como se comprueba en el panel de valores.

## Ejemplo

Un grupo tiene 12 estudiantes, 5 de ellos de nuevo ingreso. Se eligen 3 al azar para una encuesta. ¿Cuál es la probabilidad de que los tres sean de nuevo ingreso?

1. $P(N_1) = 5/12$.
2. $P(N_2 \mid N_1) = 4/11$: quedan 11 estudiantes y 4 son de nuevo ingreso.
3. $P(N_3 \mid N_1 \cap N_2) = 3/10$.
4. Regla de la cadena: $\dfrac{5}{12}\cdot\dfrac{4}{11}\cdot\dfrac{3}{10} = \dfrac{60}{1320} = \dfrac{1}{22} \approx 0.045$.
5. Comprobación: $\binom{5}{3}/\binom{12}{3} = 10/220 = 1/22$.

:::figura[El ejemplo de los estudiantes: el camino de tres estudiantes de nuevo ingreso multiplica 5/12, 4/11 y 3/10.]{componente="ProbabilityTree"}
```yaml
niveles: [Primero, Segundo, Tercero]
ramas:
  - etiqueta: Nuevo
    prob: 0.4166666667
    ramas:
      - etiqueta: Nuevo
        prob: 0.3636363636
        ramas:
          - etiqueta: Nuevo
            prob: 0.3
          - etiqueta: Otro
            prob: 0.7
      - etiqueta: Otro
        prob: 0.6363636364
  - etiqueta: Otro
    prob: 0.5833333333
consultas:
  - nombre: Tres de nuevo ingreso
    hojas: [Nuevo/Nuevo/Nuevo]
```
:::

## Propiedades

- **Cualquier orden:** los eventos pueden encadenarse en cualquier orden y el resultado es el mismo, porque la intersección no depende del orden. Conviene elegir el orden en que las condicionales son fáciles de calcular.
- **Etapas independientes:** si cada $A_k$ es independiente de los anteriores, $P(A_1 \cap \cdots \cap A_n) = P(A_1) \cdots P(A_n)$.
- **Caminos de un árbol:** la probabilidad de una hoja es el producto de las ramas de su camino, y las hojas de un árbol completo suman 1.
- **Factorización de distribuciones conjuntas:** la misma regla, aplicada a variables aleatorias, escribe una distribución conjunta como producto de condicionales; es la base de las redes bayesianas y de los modelos secuenciales.

:::figura[Con etapas independientes, como tres lanzamientos de moneda, todas las ramas valen 1/2 en cada etapa y cada camino vale 1/8.]{componente="ProbabilityTree"}
```yaml
niveles: [Moneda 1, Moneda 2, Moneda 3]
ramas:
  - etiqueta: C
    prob: 0.5
    ramas:
      - etiqueta: C
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
      - etiqueta: X
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
  - etiqueta: X
    prob: 0.5
    ramas:
      - etiqueta: C
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
      - etiqueta: X
        prob: 0.5
        ramas:
          - etiqueta: C
            prob: 0.5
          - etiqueta: X
            prob: 0.5
consultas:
  - nombre: Exactamente dos caras
    hojas: [C/C/X, C/X/C, X/C/C]
```
:::

## Errores comunes

- **No actualizar las condicionales.** En la extracción sin reemplazo, usar $7/10$ en las tres etapas da $0.343$ en lugar de $0.292$.
- **Condicionar solo en el evento inmediato anterior.** Cada factor se condiciona en todos los eventos previos, no solo en el último.
- **Sumar donde hay que multiplicar.** "Esto y luego aquello" se multiplica; "esto o aquello" (con eventos excluyentes) se suma.

:::figura[El error de no actualizar: un árbol con 0.7 en todas las etapas, como si las piezas se devolvieran al lote. El camino de tres piezas buenas da 0.343, no 0.292.]{componente="ProbabilityTree"}
```yaml
niveles: [Pieza 1, Pieza 2, Pieza 3]
ramas:
  - etiqueta: Buena
    prob: 0.7
    ramas:
      - etiqueta: Buena
        prob: 0.7
        ramas:
          - etiqueta: Buena
            prob: 0.7
          - etiqueta: Defectuosa
            prob: 0.3
      - etiqueta: Defectuosa
        prob: 0.3
  - etiqueta: Defectuosa
    prob: 0.3
consultas:
  - nombre: Las tres buenas
    hojas: [Buena/Buena/Buena]
```
:::

## Conexiones

La regla de la cadena generaliza la [[regla-del-producto]] y es la [[probabilidad-condicional]] aplicada repetidamente. Es el cálculo que se hace en los [[arboles-de-probabilidad]] y la herramienta principal en la [[paradoja-del-cumpleanos]], donde cada persona nueva debe evitar los cumpleaños de las anteriores. Con etapas independientes se reduce al producto de probabilidades de la [[independencia-de-eventos]].

## Formulario

:::formula[Regla de la cadena]
$$
P(A_1 \cap \cdots \cap A_n) = \prod_{k=1}^{n} P(A_k \mid A_1 \cap \cdots \cap A_{k-1})
$$

- $\prod$: producto de los factores.
- El primer factor, con $k = 1$, es $P(A_1)$ sin condición.
:::

:::formula[Tres etapas]
$$
P(A \cap B \cap C) = P(A)\,P(B \mid A)\,P(C \mid A \cap B)
$$

- $A$, $B$, $C$: eventos de la primera, segunda y tercera etapa.
:::

:::formula[Extracción sin reemplazo de k objetos de un tipo]
$$
P(\text{los } k \text{ del tipo}) = \frac{m}{N}\cdot\frac{m-1}{N-1}\cdots\frac{m-k+1}{N-k+1} = \frac{\binom{m}{k}}{\binom{N}{k}}
$$

- $N$: total de objetos; $m$: objetos del tipo buscado; $k$: número de extracciones.
:::
