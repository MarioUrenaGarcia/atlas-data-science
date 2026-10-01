---
id: experimento-aleatorio
titulo: Experimento aleatorio
titulo_en: Random experiment
alias:
  - fenómeno aleatorio
  - ensayo aleatorio
modulo: 1
submodulo: '1.1'
orden: 1
nivel: basico
prerrequisitos:
  - conjuntos-y-notacion
relaciones:
  - tipo: relacionado
    id: interpretacion-frecuentista
etiquetas:
  - aleatoriedad
  - incertidumbre
  - resultados
  - repetición
resumen: >
  Procedimiento que puede repetirse en condiciones iguales, cuyos resultados posibles se conocen de
  antemano pero cuyo resultado concreto no puede predecirse con certeza en cada realización.
formula: '\text{experimento} \;\longmapsto\; \omega \in \Omega'
visualizacion:
  componente: SampleSpaceLab
  parametros:
    modo: frecuencia
    experimento: tres-monedas
    eventoA: exactamente-dos-caras
    eventos: [exactamente-dos-caras, al-menos-una-cara, todas-iguales, primera-cara]
    ensayos: 400
referencias:
  - clave: blitzstein-hwang
    capitulo: '1.1'
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

Al lanzar tres monedas no es posible anticipar qué saldrá esta vez, pero sí se sabe qué puede salir: alguna de las ocho combinaciones de caras y cruces. Si el lanzamiento se repite muchas veces, aparece un orden que ninguna tirada individual muestra: la combinación "exactamente dos caras" sale en cerca de tres de cada ocho lanzamientos.

Esa mezcla de imprevisibilidad individual y regularidad colectiva define un experimento aleatorio. No importa si el azar es "verdadero" (como en la desintegración de un átomo) o si solo refleja ignorancia de detalles (la fuerza exacta con que se lanza la moneda): lo que importa es que el resultado de cada realización no está determinado por lo que se controla, y que el procedimiento puede repetirse en las mismas condiciones.

Muchos fenómenos de interés práctico se modelan así: el número de pacientes que llegan a urgencias en una hora, el tiempo de vida de un foco, la estatura de una persona elegida al azar o el resultado de un examen médico. Toda la teoría de la probabilidad empieza por identificar el experimento y sus resultados posibles.

## Definición

:::definicion[Experimento aleatorio]
Un **experimento aleatorio** es un procedimiento que cumple tres condiciones:

1. Puede repetirse, al menos conceptualmente, en condiciones esencialmente iguales.
2. El conjunto de todos sus resultados posibles se conoce antes de realizarlo.
3. El resultado de una realización concreta no puede predecirse con certeza.
   :::

Cada realización del experimento produce exactamente un **resultado** $\omega$, que pertenece al conjunto $\Omega$ de resultados posibles. Un experimento en el que el resultado sí está determinado por las condiciones (por ejemplo, calentar agua pura a nivel del mar hasta que hierva y medir si hierve a 100 °C) se llama **determinista**.

:::figura[Una sola realización del experimento "lanzar tres monedas" produce uno de los 8 resultados posibles. Cada paso de la animación es un nuevo lanzamiento: el recuadro marca el resultado que salió y los números cuentan cuántas veces ha salido cada combinación.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: tres-monedas
eventoA: primera-cara
eventos: [primera-cara]
ensayos: 40
```

:::

:::nota[Qué significa cada símbolo]

- $\omega$: un resultado concreto de una realización del experimento (letra griega omega minúscula).
- $\Omega$: conjunto de todos los resultados posibles (omega mayúscula), llamado espacio muestral.
- $\omega \in \Omega$: el resultado obtenido es uno de los elementos de $\Omega$.
- $\longmapsto$: "produce"; cada realización del experimento produce un resultado.
  :::

## Cómo usar la visualización

La rejilla muestra los ocho resultados posibles de lanzar tres monedas (C: cara, X: cruz). Cada paso es un lanzamiento nuevo: el recuadro señala el resultado obtenido y el número de cada casilla cuenta cuántas veces ha salido. Las casillas rayadas forman el evento elegido. Abajo, la gráfica sigue la proporción de lanzamientos en que ocurrió ese evento.

Con pocos lanzamientos los conteos son muy desiguales y la proporción salta mucho; al llegar a 400, las ocho casillas tienen conteos parecidos y la proporción de "exactamente dos caras" se estabiliza cerca de 0.375. Al activar varias repeticiones independientes se ve que cada serie de lanzamientos es distinta, aunque todas se acercan al mismo valor.

## Ejemplo

Una fábrica de focos toma uno al azar de la línea de producción y lo deja encendido hasta que se funde, registrando las horas de duración.

1. **Repetible:** puede tomarse otro foco de la misma línea y repetir la prueba en las mismas condiciones de voltaje y temperatura.
2. **Resultados conocidos:** la duración es un número real no negativo, así que $\Omega = [0, \infty)$.
3. **Resultado impredecible:** dos focos de la misma línea duran tiempos distintos, por ejemplo 1180 y 1342 horas.

Es un experimento aleatorio. En cambio, "medir la longitud de un foco con una regla precisa" es, en la práctica, determinista: repetirlo da siempre el mismo valor dentro del error de medición.

Un ejemplo discreto del mismo tipo: se lanza un dado equilibrado y se anota la cara superior. Los resultados posibles son $\{1, 2, 3, 4, 5, 6\}$ y ninguno puede anticiparse.

:::figura[Lanzamientos repetidos de un dado. Cada resultado individual es impredecible, pero con muchos lanzamientos las seis caras aparecen con frecuencias parecidas.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dado
eventoA: seis
eventos: [seis, par, mayor-que-4]
ensayos: 600
```

:::

## Propiedades

- **Estabilidad de las frecuencias:** al repetir un experimento aleatorio muchas veces, la proporción de veces que ocurre un resultado tiende a estabilizarse. Esta regularidad empírica es la base de la [[interpretacion-frecuentista]].
- **Independencia de las repeticiones:** en el modelo usual, el resultado de una realización no cambia las probabilidades de las siguientes.
- **La descripción depende de lo que se registra:** el mismo procedimiento físico da experimentos distintos según qué se anote. Al lanzar dos dados, registrar el par ordenado de caras produce 36 resultados; registrar solo la suma produce 11.

:::figura[Dos dados, registrando el par ordenado: 36 resultados. La franja resaltada es el evento "la suma es 7", que agrupa 6 de esos pares; registrar solo la suma convertiría esa franja en un único resultado.]{componente="SampleSpaceLab"}

```yaml
modo: eventos
experimento: dos-dados
eventoA: suma-7
operaciones: [A]
```

:::

:::figura[Varias series independientes de lanzamientos de dos dados. Cada serie sigue su propio camino, pero todas se estabilizan alrededor de la misma proporción de sumas iguales a 7.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: dos-dados
eventoA: suma-7
eventos: [suma-7]
trayectorias: 6
ensayos: 1500
```

:::

## Errores comunes

- **Creer que "aleatorio" significa "sin patrón".** Cada resultado es impredecible, pero el comportamiento de muchas repeticiones es muy regular.
- **Suponer que los resultados posibles son igualmente probables.** "Llueve o no llueve" tiene dos resultados, pero eso no hace que cada uno tenga probabilidad 1/2.
- **Esperar que una racha se compense.** Tras cinco cruces seguidas, la siguiente moneda no está "obligada" a caer cara; las repeticiones no tienen memoria.
- **Confundir el experimento con su registro.** Si no se define con precisión qué se anota, dos personas pueden describir el mismo experimento con conjuntos de resultados distintos.

:::figura[Con 40 lanzamientos de una moneda, la proporción de caras todavía se aleja bastante de 1/2 y no hay ninguna tendencia a compensar las rachas; solo con muchos lanzamientos la proporción se acerca a 0.5.]{componente="SampleSpaceLab"}

```yaml
modo: frecuencia
experimento: moneda
eventoA: primera-cara
eventos: [primera-cara]
ensayos: 1000
banda: true
```

:::

## Conexiones

El conjunto de resultados de un experimento es su [[espacio-muestral]], y las preguntas sobre el experimento se formulan como [[eventos]]. La regularidad de las frecuencias al repetirlo motiva la [[interpretacion-frecuentista]], mientras que la [[interpretacion-subjetiva-o-bayesiana]] también asigna probabilidad a situaciones que no se pueden repetir. Los [[axiomas-de-kolmogorov]] dan el marco matemático común, y más adelante las variables aleatorias asignan números a los resultados del experimento.

## Formulario

:::formula[Resultado de un experimento]

$$
\text{experimento} \;\longmapsto\; \omega \in \Omega
$$

- $\omega$: resultado de una realización.
- $\Omega$: conjunto de todos los resultados posibles.
- $\in$: pertenencia; el resultado es un elemento de $\Omega$.
  :::

:::formula[Frecuencia relativa tras n repeticiones]

$$
f_n(A) = \frac{n_A}{n}
$$

- $n$: número de veces que se ha repetido el experimento.
- $n_A$: número de repeticiones en las que ocurrió el resultado o evento $A$.
- $f_n(A)$: proporción de repeticiones en las que ocurrió $A$.
  :::
