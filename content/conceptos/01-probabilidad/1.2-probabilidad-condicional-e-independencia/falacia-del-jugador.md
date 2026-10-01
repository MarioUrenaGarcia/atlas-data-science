---
id: falacia-del-jugador
titulo: Falacia del jugador
titulo_en: Gambler's fallacy
alias:
  - falacia de Montecarlo
  - falacia de la madurez de las probabilidades
  - ley de los promedios mal entendida
modulo: 1
submodulo: '1.2'
orden: 17
nivel: basico
prerrequisitos:
  - independencia-de-eventos
relaciones:
  - tipo: relacionado
    id: interpretacion-frecuentista
etiquetas:
  - rachas
  - independencia
  - sesgos de razonamiento
  - juegos de azar
resumen: >
  Creencia de que, en ensayos independientes, un resultado se vuelve más probable después de una racha
  del resultado contrario. Con independencia, la probabilidad del siguiente ensayo no depende de la racha.
formula: 'P(X_{n+1} = \text{cara} \mid X_1 = \cdots = X_n = \text{cruz}) = P(X_{n+1} = \text{cara}) = p'
visualizacion:
  componente: GamblersFallacy
  parametros:
    p: 0.5
    racha: 5
    lanzamientos: 20000
referencias:
  - clave: blitzstein-hwang
    capitulo: '2'
  - clave: ross-probabilidad
    capitulo: '3'
publicado: true
---

## Intuición

El 18 de agosto de 1913, en el casino de Montecarlo, la bola de la ruleta cayó en negro 26 veces seguidas. Muchos jugadores apostaron fuertes sumas al rojo cada vez, convencidos de que "ya le tocaba". Perdieron millones de francos. La ruleta no tiene memoria: después de 15 negros, la probabilidad del rojo en el siguiente giro es exactamente la misma que en cualquier otro giro.

La falacia del jugador es la creencia de que, en un proceso de ensayos independientes, los resultados "se compensan" a corto plazo: después de muchas cruces, una cara sería más probable. La intuición proviene de una versión deformada de la ley de los grandes números. Es cierto que la proporción de caras tiende a 1/2 en series largas, pero no porque las caras "se apresuren" a compensar: el exceso acumulado simplemente se diluye entre muchos ensayos nuevos, y en términos absolutos ni siquiera tiende a desaparecer.

La falacia no se limita a los casinos: aparece en decisiones de jueces, revisores de crédito y árbitros, que tienden a alternar decisiones aunque los casos sean independientes.

## Definición

:::definicion[Falacia del jugador]
Error que consiste en creer que, para ensayos independientes $X_1, X_2, \dots$ con la misma probabilidad $p$ de éxito,
$$
P(X_{n+1} = \text{éxito} \mid X_1 = \cdots = X_n = \text{fracaso}) > p.
$$
Con independencia, la probabilidad condicional es exactamente $p$, sin importar la longitud de la racha.
:::

:::figura[Después de tres cruces seguidas, el árbol mantiene la rama "cara" en 1/2: la probabilidad de cada lanzamiento no depende de los anteriores, y la secuencia de tres cruces y una cara vale 1/16, igual que cualquier otra secuencia de cuatro lanzamientos.]{componente="ProbabilityTree"}
```yaml
niveles: [Tres lanzamientos previos, Cuarto lanzamiento]
ramas:
  - etiqueta: XXX
    prob: 0.125
    ramas:
      - etiqueta: C
        prob: 0.5
      - etiqueta: X
        prob: 0.5
  - etiqueta: Otra secuencia
    prob: 0.875
    ramas:
      - etiqueta: C
        prob: 0.5
      - etiqueta: X
        prob: 0.5
consultas:
  - nombre: Cara dado tres cruces
    hojas: [XXX/C]
    condicion: [XXX/C, XXX/X]
  - nombre: Cara en el cuarto lanzamiento
    hojas: [XXX/C, Otra secuencia/C]
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, X_2, \dots$: resultados de ensayos sucesivos e independientes.
- $p$: probabilidad de éxito (por ejemplo, cara) en cada ensayo.
- $n$: longitud de la racha observada.
- $P(X_{n+1} = \text{éxito} \mid \dots)$: probabilidad del siguiente ensayo dada la racha.
- $S_n$: número de éxitos en los primeros $n$ ensayos.
:::

## Cómo usar la visualización

La simulación lanza una moneda miles de veces. La franja superior muestra los últimos 60 lanzamientos y enmarca la racha final de caras cuando alcanza la longitud elegida. Cada vez que hay una racha de $k$ caras, se registra el siguiente lanzamiento; las barras muestran, para cada $k$ de 1 a 8, la proporción de caras en el lanzamiento siguiente, y la línea punteada marca $p$.

Todas las barras quedan cerca de 0.5. Las de rachas largas fluctúan más porque se observan pocas veces (el número de rachas observadas aparece bajo cada barra). Al cambiar $p$ a 0.3, las barras se reacomodan alrededor de 0.3: con independencia, la racha no aporta información.

## Ejemplo

Un jugador ve que en una ruleta europea (18 rojos, 18 negros y un verde) salieron 6 negros seguidos y decide apostar al rojo.

1. Los giros son independientes, así que $P(\text{rojo en el giro 7} \mid 6 \text{ negros}) = 18/37 \approx 0.486$, la misma probabilidad de cualquier giro.
2. La probabilidad de una racha de 7 negros vista desde antes del primer giro es $(18/37)^7 \approx 0.0064$, muy pequeña. Pero esa no es la pregunta: después de 6 negros, solo falta un giro, con probabilidad $18/37$.
3. La secuencia "6 negros y luego rojo" tiene probabilidad $(18/37)^6 \cdot 18/37$, exactamente igual a "7 negros".

:::figura[Una moneda cargada hacia cruz (p = 0.3 de cara): las rachas de cruces son frecuentes y largas, pero la proporción de caras tras una racha de caras sigue en 0.3 para todo k.]{componente="GamblersFallacy"}
```yaml
p: 0.3
racha: 2
lanzamientos: 20000
```
:::

## Propiedades

- **Todas las secuencias son igualmente probables:** con una moneda equilibrada, CCCCCC tiene la misma probabilidad que CXXCXC, $1/64$; lo que parece "raro" es el patrón, no la secuencia.
- **Compensación relativa, no absoluta:** la ley de los grandes números dice que $S_n/n \to p$; la diferencia $S_n - np$ no tiende a 0, típicamente crece como $\sqrt{n}$.
- **Las rachas largas son esperables:** en 200 lanzamientos de una moneda, la racha más larga de un mismo resultado suele medir entre 6 y 8.
- **Falacia inversa:** creer en la "mano caliente", que una racha hace más probable que continúe, es el error opuesto cuando los ensayos son independientes.

:::figura[La compensación es relativa: el exceso de caras sobre n/2 no regresa a cero en series largas, sino que se dispersa como la raíz de n. Lo que se acerca a 0 es la diferencia de proporciones.]{componente="SampleSpaceLab"}
```yaml
modo: frecuencia
experimento: moneda
eventoA: primera-cara
eventos: [primera-cara]
grafica: exceso
trayectorias: 4
banda: true
ensayos: 3000
```
:::

## Errores comunes

- **Creer que los resultados "se deben".** Ninguna racha cambia la probabilidad del siguiente ensayo independiente.
- **Confundir la probabilidad de la racha completa con la del siguiente ensayo.** Que 10 negros seguidos sean raros no implica que, tras 9 negros, el décimo sea improbable.
- **Aplicar el razonamiento a procesos que sí tienen memoria.** Al sacar cartas sin reemplazo, después de muchos rojos sí aumenta la probabilidad de negro; ahí no hay falacia porque los ensayos no son independientes.

:::figura[Las proporciones tras rachas de 1 a 8 caras con una moneda equilibrada: aun con rachas de 8, el lanzamiento siguiente es cara en cerca de la mitad de los casos, con más variabilidad porque las rachas largas son raras.]{componente="GamblersFallacy"}
```yaml
p: 0.5
racha: 8
lanzamientos: 60000
```
:::

:::figura[Cuando sí hay memoria: tras sacar dos cartas rojas sin reemplazo, la probabilidad de que la tercera sea negra sube de 26/52 a 26/50.]{componente="ProbabilityTree"}
```yaml
niveles: [Carta 1, Carta 2, Carta 3]
ramas:
  - etiqueta: Roja
    prob: 0.5
    ramas:
      - etiqueta: Roja
        prob: 0.4901960784
        ramas:
          - etiqueta: Negra
            prob: 0.52
          - etiqueta: Roja
            prob: 0.48
      - etiqueta: Negra
        prob: 0.5098039216
  - etiqueta: Negra
    prob: 0.5
consultas:
  - nombre: Negra dado dos rojas
    hojas: [Roja/Roja/Negra]
    condicion: [Roja/Roja/Negra, Roja/Roja/Roja]
```
:::

## Conexiones

La falacia es la negación de la [[independencia-de-eventos]] en ensayos repetidos, y nace de una mala lectura de la [[interpretacion-frecuentista]] y de la ley de los grandes números. Contrasta con la extracción sin reemplazo de la [[regla-de-la-cadena-de-probabilidad]], donde la historia sí cambia las probabilidades. El [[problema-de-la-ruina-del-jugador]] muestra el otro lado: aunque cada apuesta sea justa, un jugador con capital limitado termina arruinado con alta probabilidad.

## Formulario

:::formula[Independencia de ensayos]
$$
P(X_{n+1} = \text{éxito} \mid X_1, \dots, X_n) = p
$$

- $p$: probabilidad de éxito en cada ensayo, sin importar la historia.
:::

:::formula[Probabilidad de una secuencia específica]
$$
P(x_1, \dots, x_n) = p^{s}(1 - p)^{n - s}
$$

- $s$: número de éxitos en la secuencia; con $p = 1/2$ todas las secuencias valen $2^{-n}$.
:::

:::formula[Compensación relativa]
$$
\frac{S_n}{n} \to p, \qquad S_n - np \approx \pm\sqrt{n\,p(1-p)}
$$

- $S_n$: éxitos en $n$ ensayos; la proporción converge, pero el exceso absoluto no tiende a 0.
:::
