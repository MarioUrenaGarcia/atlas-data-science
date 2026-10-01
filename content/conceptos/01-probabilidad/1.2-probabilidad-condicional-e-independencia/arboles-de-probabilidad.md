---
id: arboles-de-probabilidad
titulo: Árboles de probabilidad
titulo_en: Probability trees
alias:
  - diagrama de árbol
  - árbol de decisiones probabilístico
modulo: 1
submodulo: '1.2'
orden: 6
nivel: basico
prerrequisitos:
  - regla-de-la-cadena-de-probabilidad
  - ley-de-probabilidad-total
relaciones:
  - tipo: relacionado
    id: teorema-de-bayes
etiquetas:
  - diagramas
  - etapas
  - caminos
  - representación
resumen: >
  Diagrama que representa un experimento por etapas: cada rama lleva una probabilidad condicional,
  cada camino se multiplica (regla de la cadena) y las hojas de un evento se suman.
formula: 'P(\text{hoja}) = \prod_{\text{ramas del camino}} P(\text{rama} \mid \text{camino previo})'
visualizacion:
  componente: ProbabilityTree
  parametros:
    niveles: [Urna, Bola]
    contexto: Se lanza una moneda para elegir una urna. La urna 1 tiene 3 bolas rojas y 1 azul; la urna 2 tiene 1 roja y 3 azules.
    ramas:
      - etiqueta: Urna 1
        prob: 0.5
        ramas:
          - etiqueta: Roja
            prob: 0.75
          - etiqueta: Azul
            prob: 0.25
      - etiqueta: Urna 2
        prob: 0.5
        ramas:
          - etiqueta: Roja
            prob: 0.25
          - etiqueta: Azul
            prob: 0.75
    consultas:
      - nombre: Sale roja
        hojas: [Urna 1/Roja, Urna 2/Roja]
      - nombre: Urna 1 dado roja
        hojas: [Urna 1/Roja]
        condicion: [Urna 1/Roja, Urna 2/Roja]
referencias:
  - clave: blitzstein-hwang
    capitulo: '2'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

Muchos experimentos ocurren por etapas: primero se elige una urna y luego una bola, primero se hace una prueba y luego otra, primero llueve o no y luego hay tráfico o no. Un árbol de probabilidad dibuja esas etapas de izquierda a derecha. De cada nodo salen ramas, una por cada resultado posible de la siguiente etapa, y cada rama lleva la probabilidad de ese resultado dado todo lo que ocurrió antes.

Con el árbol dibujado, las tres reglas principales de la probabilidad se vuelven operaciones visuales. Para la probabilidad de un camino completo se multiplican las ramas que lo forman (regla de la cadena). Para la probabilidad de un evento se suman los caminos que lo cumplen (ley de probabilidad total). Para una probabilidad condicional se divide la suma de los caminos que cumplen ambas cosas entre la de los que cumplen la condición (teorema de Bayes).

El árbol también sirve como verificación: las ramas que salen de cada nodo deben sumar 1, y las hojas de todo el árbol también.

## Definición

:::definicion[Árbol de probabilidad]
Un **árbol de probabilidad** es un árbol con raíz en el que:

1. Cada nivel corresponde a una etapa del experimento.
2. Las ramas que salen de un nodo representan los resultados posibles de la siguiente etapa y forman una partición; sus probabilidades, condicionadas al camino que lleva al nodo, suman 1.
3. Cada hoja corresponde a un resultado completo del experimento, y su probabilidad es el producto de las ramas de su camino.
:::

:::figura[Clima en dos días: si hoy llueve, mañana llueve con probabilidad 0.6; si no llueve, con 0.2. Las ramas del segundo nivel dependen del primero, y la consulta suma los caminos que terminan en lluvia.]{componente="ProbabilityTree"}
```yaml
niveles: [Hoy, Mañana]
ramas:
  - etiqueta: Llueve
    prob: 0.3
    ramas:
      - etiqueta: Llueve
        prob: 0.6
      - etiqueta: Seco
        prob: 0.4
  - etiqueta: Seco
    prob: 0.7
    ramas:
      - etiqueta: Llueve
        prob: 0.2
      - etiqueta: Seco
        prob: 0.8
consultas:
  - nombre: Llueve mañana
    hojas: [Llueve/Llueve, Seco/Llueve]
  - nombre: Llovió hoy dado que llueve mañana
    hojas: [Llueve/Llueve]
    condicion: [Llueve/Llueve, Seco/Llueve]
```
:::

:::nota[Qué significa cada símbolo]
- Rama: resultado de una etapa; su número es la probabilidad de ese resultado dado el camino anterior.
- Camino: secuencia de ramas desde la raíz hasta una hoja.
- Hoja: resultado completo; $P(\text{hoja})$ es el producto de las ramas del camino.
- $\prod$: producto de varios factores.
- $\sum$: suma sobre las hojas de un evento.
:::

## Cómo usar la visualización

El árbol crece de izquierda a derecha: primero las ramas de la moneda (urna 1 o urna 2, cada una con 0.5) y luego las de la bola dentro de cada urna. Después la animación multiplica a lo largo de cada camino y escribe la probabilidad junto a cada hoja. Al final aplica la consulta elegida: suma las hojas del evento o divide la suma de las hojas comunes entre la de la condición.

"Sale roja" suma $0.375 + 0.125 = 0.5$. "Urna 1 dado roja" divide $0.375/0.5 = 0.75$: ver una bola roja hace tres veces más probable la urna 1 que la urna 2. La tabla de datos, debajo, lista la probabilidad de cada camino.

## Ejemplo

Un equipo juega una serie al mejor de tres partidos contra un rival; gana cada partido con probabilidad 0.6, independientemente de los demás. ¿Cuál es la probabilidad de que gane la serie?

1. Primer nivel: gana (0.6) o pierde (0.4) el primer partido.
2. Segundo nivel: lo mismo para el segundo partido. Si ganó los dos, la serie termina: $0.6 \cdot 0.6 = 0.36$.
3. Si quedan 1 a 1, se juega un tercer partido: caminos G-P-G y P-G-G, cada uno con $0.6 \cdot 0.4 \cdot 0.6 = 0.144$.
4. $P(\text{gana la serie}) = 0.36 + 0.144 + 0.144 = 0.648$.

La serie amplifica la ventaja: un equipo que gana el 60 % de los partidos gana el 64.8 % de las series al mejor de tres.

:::figura[La serie al mejor de tres: los caminos se cortan cuando un equipo llega a dos victorias. La consulta suma los tres caminos ganadores.]{componente="ProbabilityTree"}
```yaml
niveles: [Partido 1, Partido 2, Partido 3]
ramas:
  - etiqueta: G
    prob: 0.6
    ramas:
      - etiqueta: G
        prob: 0.6
      - etiqueta: P
        prob: 0.4
        ramas:
          - etiqueta: G
            prob: 0.6
          - etiqueta: P
            prob: 0.4
  - etiqueta: P
    prob: 0.4
    ramas:
      - etiqueta: G
        prob: 0.6
        ramas:
          - etiqueta: G
            prob: 0.6
          - etiqueta: P
            prob: 0.4
      - etiqueta: P
        prob: 0.4
consultas:
  - nombre: Gana la serie
    hojas: [G/G, G/P/G, P/G/G]
```
:::

## Propiedades

- **Suma de las hojas:** las probabilidades de todas las hojas suman 1, porque las hojas forman una partición del espacio muestral.
- **Caminos de distinta longitud:** un árbol puede cortar ramas cuando el experimento termina antes, como en las series deportivas o en la ruina del jugador.
- **Orden de las etapas:** el mismo experimento admite árboles en distinto orden; el árbol "invertido" tiene como ramas las probabilidades a posteriori del teorema de Bayes.
- **Alternativa compacta:** una tabla de contingencia con las probabilidades conjuntas contiene la misma información que un árbol de dos niveles.

:::figura[El árbol invertido del ejemplo de las urnas: primero el color y luego la urna. Sus ramas del segundo nivel son las probabilidades a posteriori, y sus hojas tienen las mismas probabilidades conjuntas que el árbol original.]{componente="ProbabilityTree"}
```yaml
niveles: [Bola, Urna]
ramas:
  - etiqueta: Roja
    prob: 0.5
    ramas:
      - etiqueta: Urna 1
        prob: 0.75
      - etiqueta: Urna 2
        prob: 0.25
  - etiqueta: Azul
    prob: 0.5
    ramas:
      - etiqueta: Urna 1
        prob: 0.25
      - etiqueta: Urna 2
        prob: 0.75
consultas:
  - nombre: Urna 1 y roja
    hojas: [Roja/Urna 1]
```
:::

## Errores comunes

- **Escribir probabilidades no condicionales en las ramas posteriores.** En el ejemplo del clima, la rama "Llueve" del segundo día vale 0.6 o 0.2 según el primer día, no la probabilidad general de lluvia.
- **Sumar a lo largo de un camino o multiplicar entre caminos.** Dentro de un camino se multiplica; entre caminos distintos se suma.
- **Olvidar ramas.** Si las ramas de un nodo no suman 1, falta algún resultado y las hojas no sumarán 1.

:::figura[El error de no condicionar: si en el segundo día se usa 0.32, la probabilidad general de lluvia, en ambas ramas, el árbol trata los dos días como independientes y P(llueve los dos días) baja de 0.18 a 0.096.]{componente="ProbabilityTree"}
```yaml
niveles: [Hoy, Mañana]
ramas:
  - etiqueta: Llueve
    prob: 0.3
    ramas:
      - etiqueta: Llueve
        prob: 0.32
      - etiqueta: Seco
        prob: 0.68
  - etiqueta: Seco
    prob: 0.7
    ramas:
      - etiqueta: Llueve
        prob: 0.32
      - etiqueta: Seco
        prob: 0.68
consultas:
  - nombre: Llueve los dos días
    hojas: [Llueve/Llueve]
```
:::

## Conexiones

Los árboles de probabilidad son la representación gráfica de la [[regla-de-la-cadena-de-probabilidad]] (caminos) y de la [[ley-de-probabilidad-total]] (suma de hojas), y permiten aplicar el [[teorema-de-bayes]] dividiendo sumas de hojas. Son la forma natural de resolver el [[problema-de-monty-hall]], el [[problema-de-los-tres-prisioneros]] y las [[pruebas-diagnosticas]]. Más adelante, los árboles de decisión y los procesos de Markov extienden la misma idea a muchas etapas.

## Formulario

:::formula[Probabilidad de una hoja]
$$
P(\text{hoja}) = \prod_{\text{ramas del camino}} P(\text{rama} \mid \text{camino previo})
$$

- Cada factor es la probabilidad condicional escrita sobre una rama.
:::

:::formula[Probabilidad de un evento]
$$
P(E) = \sum_{\text{hojas en } E} P(\text{hoja})
$$

- $E$: evento formado por varias hojas.
:::

:::formula[Probabilidad condicional en un árbol]
$$
P(E \mid C) = \frac{\sum_{\text{hojas en } E \cap C} P(\text{hoja})}{\sum_{\text{hojas en } C} P(\text{hoja})}
$$

- $C$: evento condición; $E \cap C$: hojas que están en ambos.
:::

:::formula[Serie al mejor de tres]
$$
P(\text{gana}) = p^2 + 2p^2(1 - p)
$$

- $p$: probabilidad de ganar cada partido, independiente de los demás.
:::
