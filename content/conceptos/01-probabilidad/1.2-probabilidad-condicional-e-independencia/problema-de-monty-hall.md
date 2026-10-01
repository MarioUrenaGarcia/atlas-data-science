---
id: problema-de-monty-hall
titulo: Problema de Monty Hall
titulo_en: Monty Hall problem
alias:
  - problema de las tres puertas
  - paradoja de Monty Hall
modulo: 1
submodulo: '1.2'
orden: 12
nivel: basico
prerrequisitos:
  - teorema-de-bayes
relaciones:
  - tipo: relacionado
    id: problema-de-los-tres-prisioneros
etiquetas:
  - paradojas
  - concursos
  - información del presentador
  - teorema de Bayes
resumen: >
  En un concurso con tres puertas, tras elegir una el presentador abre otra con una cabra y ofrece
  cambiar. Cambiar gana con probabilidad 2/3, porque el presentador nunca abre la puerta del premio.
formula: 'P(\text{ganar cambiando}) = \frac{2}{3}, \qquad P(\text{ganar quedándose}) = \frac{1}{3}'
visualizacion:
  componente: MontyHall
  parametros:
    puertas: 3
    presentador: sabe
referencias:
  - clave: blitzstein-hwang
    capitulo: '2.7'
publicado: true
---

## Intuición

En un concurso hay tres puertas: detrás de una hay un auto y detrás de las otras dos, cabras. El concursante elige una puerta, por ejemplo la 1. El presentador, que sabe dónde está el auto, abre otra puerta, digamos la 3, y muestra una cabra. Después ofrece cambiar a la puerta 2. ¿Conviene cambiar?

La respuesta casi universal es "da igual, quedan dos puertas, 50 y 50". La correcta es que cambiar gana dos de cada tres veces. La clave es que el presentador no abre una puerta al azar: nunca abre la elegida ni la del auto. La puerta elegida tenía 1/3 de probabilidad al principio, y el presentador siempre puede mostrar una cabra entre las otras dos, así que su acción no da ninguna información sobre la puerta elegida, que conserva su 1/3. El 2/3 restante, que estaba repartido entre las otras dos puertas, se concentra en la única que el presentador dejó cerrada.

Con 100 puertas la intuición se vuelve clara: si el presentador abre 98 puertas con cabra y deja cerrada una, cambiar gana con probabilidad 99/100.

## Definición

Supuestos del problema:

1. El auto está detrás de cualquiera de las tres puertas con la misma probabilidad.
2. El presentador sabe dónde está el auto, siempre abre una puerta distinta de la elegida, siempre muestra una cabra y siempre ofrece cambiar.
3. Si puede abrir dos puertas (porque el concursante eligió el auto), elige entre ellas al azar.

:::teorema[Monty Hall]
Bajo esos supuestos, si el concursante eligió la puerta 1 y el presentador abrió la 3,
$$
P(\text{auto en } 2 \mid \text{abre } 3) = \frac{2}{3}, \qquad P(\text{auto en } 1 \mid \text{abre } 3) = \frac{1}{3}.
$$
Con $n$ puertas y un presentador que abre $n - 2$ puertas con cabra, cambiar gana con probabilidad $(n-1)/n$.
:::

:::demostracion
Sea $A_i$ = "el auto está en $i$" y $M$ = "el presentador abre la 3". Las verosimilitudes son $P(M \mid A_1) = 1/2$ (puede abrir 2 o 3), $P(M \mid A_2) = 1$ (está obligado a abrir la 3) y $P(M \mid A_3) = 0$. Con a priori de $1/3$ cada una, por Bayes,
$$
P(A_2 \mid M) = \frac{1 \cdot \tfrac{1}{3}}{\tfrac{1}{2}\cdot\tfrac{1}{3} + 1 \cdot \tfrac{1}{3} + 0} = \frac{1/3}{1/2} = \frac{2}{3}.
$$
:::

:::figura[La demostración como actualización bayesiana: con el concursante en la puerta 1, el dato "abre la 3" tiene verosimilitud 1/2, 1 y 0 bajo cada posición del auto. La a posteriori queda en 1/3, 2/3 y 0.]{componente="BayesUpdater"}
```yaml
hipotesis:
  - nombre: Auto en 1
    prior: 0.3333333333
  - nombre: Auto en 2
    prior: 0.3333333333
  - nombre: Auto en 3
    prior: 0.3333333334
observaciones:
  - nombre: Abre la 3
    verosimilitudes: [0.5, 1, 0]
  - nombre: Abre la 2
    verosimilitudes: [0.5, 0, 1]
secuencia: [Abre la 3]
```
:::

:::nota[Qué significa cada símbolo]
- $A_i$: el auto está detrás de la puerta $i$, con $i = 1, 2, 3$.
- $M$: el presentador abre la puerta 3.
- $P(M \mid A_i)$: probabilidad de que abra la 3 si el auto está en $i$.
- $n$: número de puertas en la versión generalizada.
- $(n-1)/n$: probabilidad de ganar cambiando cuando se abren $n - 2$ puertas con cabra.
:::

## Cómo usar la visualización

Cada ronda muestra el juego completo: el concursante elige una puerta (recuadro de "elegida"), el presentador abre las puertas con cabra y queda marcada la puerta disponible para cambiar; al final se revelan todas. Las primeras rondas avanzan fase por fase y después se juegan completas. La gráfica acumula la proporción de victorias de quien siempre se queda y de quien siempre cambia, junto a las líneas teóricas de 1/3 y 2/3.

Al aumentar las puertas a 10, el presentador abre 8 y cambiar gana el 90 % de las veces. Al elegir "abre puertas al azar", el presentador a veces revela el auto; esas rondas se descartan, y entre las que quedan cambiar y quedarse ganan lo mismo, 1/2.

## Ejemplo

Se resuelve con frecuencias naturales. En 300 juegos, el concursante siempre elige la puerta 1.

1. En unos 100 juegos el auto está en la puerta 1. El presentador abre la 2 o la 3; quien cambia pierde.
2. En unos 100 el auto está en la 2. El presentador debe abrir la 3; quien cambia gana.
3. En unos 100 el auto está en la 3. El presentador debe abrir la 2; quien cambia gana.
4. Cambiar gana en unos 200 de 300 juegos, es decir, 2/3. Quedarse gana en los 100 del primer caso, 1/3.

:::figura[Los 300 juegos como árbol: posición del auto y puerta que abre el presentador. Las hojas en que cambiar gana suman 2/3.]{componente="ProbabilityTree"}
```yaml
niveles: [Auto en, Presentador abre]
ramas:
  - etiqueta: Puerta 1
    prob: 0.3333333333
    ramas:
      - etiqueta: Puerta 2
        prob: 0.5
      - etiqueta: Puerta 3
        prob: 0.5
  - etiqueta: Puerta 2
    prob: 0.3333333333
    ramas:
      - etiqueta: Puerta 3
        prob: 1
  - etiqueta: Puerta 3
    prob: 0.3333333334
    ramas:
      - etiqueta: Puerta 2
        prob: 1
consultas:
  - nombre: Cambiar gana
    hojas: [Puerta 2/Puerta 3, Puerta 3/Puerta 2]
  - nombre: Auto en 2 dado que abre la 3
    hojas: [Puerta 2/Puerta 3]
    condicion: [Puerta 1/Puerta 3, Puerta 2/Puerta 3]
```
:::

## Propiedades

- **La puerta elegida no cambia:** como el presentador siempre puede mostrar una cabra, abrir una puerta no aporta información sobre la elegida, que conserva su 1/3.
- **Generalización:** con $n$ puertas y $n - 2$ abiertas, cambiar gana con probabilidad $(n-1)/n$.
- **Depende del comportamiento del presentador:** si abre al azar y por casualidad muestra una cabra, las dos puertas cerradas quedan con 1/2 cada una.
- **Presentador con preferencias:** si, cuando puede escoger, prefiere abrir la puerta 3, entonces ver que abrió la 2 indica que el auto está en la 3, y cambiar gana con certeza.

:::figura[Con 10 puertas el presentador abre 8 con cabra. Cambiar gana cerca del 90 % de las rondas.]{componente="MontyHall"}
```yaml
puertas: 10
presentador: sabe
rapido: true
```
:::

## Errores comunes

- **Pensar que dos puertas cerradas implican 50 y 50.** Las puertas no son simétricas: una fue elegida antes de la información y la otra sobrevivió a la selección del presentador.
- **Ignorar el comportamiento del presentador.** El resultado depende de que el presentador sepa dónde está el auto y nunca lo revele.
- **Creer que la probabilidad de la puerta elegida sube al abrirse otra.** Su probabilidad se mantiene en 1/3; lo que sube es la de la puerta que quedó cerrada.

:::figura[Con un presentador que abre al azar, se descartan las rondas en que revela el auto. En las restantes, quedarse y cambiar ganan cerca de 1/2 cada uno.]{componente="MontyHall"}
```yaml
puertas: 3
presentador: ignora
rapido: true
```
:::

## Conexiones

El problema es una aplicación del [[teorema-de-bayes]] y se resuelve con [[arboles-de-probabilidad]], donde la información está en las verosimilitudes del comportamiento del presentador. Tiene la misma estructura que el [[problema-de-los-tres-prisioneros]], muestra el peligro de suponer [[espacios-equiprobables]] sin justificación y ejemplifica cómo la [[probabilidad-condicional]] depende del mecanismo que produjo la información, no solo de la información.

## Formulario

:::formula[Probabilidad de ganar con tres puertas]
$$
P(\text{gana quedándose}) = \frac{1}{3}, \qquad P(\text{gana cambiando}) = \frac{2}{3}
$$

- Supone un presentador que sabe dónde está el auto y siempre abre una puerta con cabra.
:::

:::formula[Bayes para la puerta que queda]
$$
P(A_2 \mid M) = \frac{P(M \mid A_2)\,P(A_2)}{\sum_{i=1}^{3} P(M \mid A_i)\,P(A_i)} = \frac{1 \cdot \tfrac{1}{3}}{\tfrac{1}{2}\cdot\tfrac{1}{3} + 1\cdot\tfrac{1}{3} + 0\cdot\tfrac{1}{3}} = \frac{2}{3}
$$

- $M$: el presentador abre la puerta 3; $A_i$: el auto está en la puerta $i$.
:::

:::formula[Con n puertas]
$$
P(\text{gana cambiando}) = \frac{n-1}{n}
$$

- $n$: número de puertas; el presentador abre $n - 2$ con cabra.
:::

:::formula[Presentador que abre al azar]
$$
P(\text{gana cambiando} \mid \text{se ve una cabra}) = \frac{1}{2}
$$

- El presentador no sabe dónde está el auto; se condiciona en que no lo reveló.
:::
