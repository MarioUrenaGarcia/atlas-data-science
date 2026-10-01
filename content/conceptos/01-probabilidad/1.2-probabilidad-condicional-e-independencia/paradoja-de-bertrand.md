---
id: paradoja-de-bertrand
titulo: Paradoja de Bertrand
titulo_en: Bertrand paradox
alias:
  - paradoja de la cuerda
  - problema de la cuerda al azar
modulo: 1
submodulo: '1.2'
orden: 15
nivel: basico
prerrequisitos:
  - probabilidad-geometrica
relaciones:
  - tipo: relacionado
    id: espacios-equiprobables
etiquetas:
  - paradojas
  - probabilidad geométrica
  - elegir al azar
  - modelado
resumen: >
  La probabilidad de que una cuerda elegida al azar en un círculo sea más larga que el lado del
  triángulo equilátero inscrito vale 1/3, 1/2 o 1/4 según cómo se elija la cuerda.
formula: 'P_{\text{extremos}} = \tfrac{1}{3}, \qquad P_{\text{radio}} = \tfrac{1}{2}, \qquad P_{\text{punto medio}} = \tfrac{1}{4}'
visualizacion:
  componente: BertrandParadox
  parametros:
    metodo: extremos
    vista: cuerdas
referencias:
  - clave: blitzstein-hwang
  - clave: ross-probabilidad
    capitulo: '2'
publicado: true
---

## Intuición

En 1889, Joseph Bertrand planteó una pregunta de apariencia simple: se traza una cuerda al azar en un círculo; ¿cuál es la probabilidad de que sea más larga que el lado del triángulo equilátero inscrito? Mostró tres razonamientos, cada uno natural, que dan tres respuestas distintas: 1/3, 1/2 y 1/4.

Ninguno de los tres razonamientos tiene errores de cálculo. La paradoja está en la frase "al azar". Elegir dos puntos uniformes en la circunferencia, elegir un punto uniforme sobre un radio o elegir el punto medio de la cuerda uniforme en el disco son tres experimentos distintos, que reparten las cuerdas de maneras distintas. Cada uno produce su propia distribución sobre el conjunto de cuerdas, y por lo tanto su propia respuesta.

La lección es que, en espacios infinitos, "uniforme" no tiene un significado único: depende de qué cantidad se considera uniforme. Una pregunta de probabilidad está bien planteada solo cuando el mecanismo aleatorio está especificado.

## Definición

Sea un círculo de radio 1. El triángulo equilátero inscrito tiene lado $\sqrt{3}$, y una cuerda es más larga que $\sqrt{3}$ exactamente cuando su punto medio está a distancia menor que $1/2$ del centro. Los tres métodos clásicos son:

1. **Extremos uniformes:** se eligen dos puntos independientes y uniformes en la circunferencia. Fijado el primero, la cuerda es larga si el segundo cae en el arco de $120^\circ$ opuesto: $P = 1/3$.
2. **Radio uniforme:** se elige un radio al azar y un punto uniforme sobre él; la cuerda es la perpendicular al radio por ese punto. Es larga si el punto está a distancia menor que $1/2$: $P = 1/2$.
3. **Punto medio uniforme:** se elige un punto uniforme en el disco como punto medio de la cuerda. Es larga si el punto cae en el disco de radio $1/2$: $P = \pi(1/2)^2/\pi = 1/4$.

:::figura[Los puntos medios del método de extremos uniformes: se acumulan cerca de la circunferencia, de modo que la fracción dentro del círculo punteado de radio 1/2 es solo 1/3.]{componente="BertrandParadox"}
```yaml
metodo: extremos
vista: puntos-medios
```
:::

:::nota[Qué significa cada símbolo]
- $\sqrt{3}$: lado del triángulo equilátero inscrito en un círculo de radio 1.
- $d$: distancia del centro del círculo al punto medio de la cuerda.
- $2\sqrt{1 - d^2}$: longitud de una cuerda cuyo punto medio está a distancia $d$ del centro.
- $P_{\text{extremos}}$, $P_{\text{radio}}$, $P_{\text{punto medio}}$: respuestas de cada método.
- $120^\circ$: arco de la circunferencia en que debe caer el segundo extremo para que la cuerda sea larga.
:::

## Cómo usar la visualización

El círculo de la izquierda muestra el triángulo inscrito, el círculo punteado de radio 1/2 y las cuerdas más recientes del método elegido: las largas en color, las cortas en gris. A la derecha, las barras muestran la proporción de cuerdas largas de los tres métodos, que se simulan a la vez, con líneas horizontales en 1/3, 1/2 y 1/4.

Con el método de extremos las cuerdas son variadas y abundan las cortas cerca del borde. Al cambiar la vista a "puntos medios" se ve por qué las respuestas difieren: con el método del radio los puntos medios se concentran hacia el centro, con el de extremos hacia el borde, y con el del punto medio cubren el disco de manera uniforme.

## Ejemplo

Se verifica la respuesta del método de extremos con un cálculo directo.

1. Por simetría, el primer extremo se fija en el ángulo $0$.
2. El segundo extremo está en el ángulo $\theta$, uniforme en $[0, 2\pi)$.
3. La cuerda mide $2\sin(\theta/2)$, que supera $\sqrt{3}$ cuando $\sin(\theta/2) > \sqrt{3}/2$, es decir, cuando $\theta/2 \in (\pi/3, 2\pi/3)$.
4. Esto equivale a $\theta \in (2\pi/3, 4\pi/3)$, un arco de longitud $2\pi/3$.
5. $P = (2\pi/3)/(2\pi) = 1/3$.

:::figura[Los puntos medios del método del radio: la distancia al centro es uniforme, así que la mitad de los puntos cae dentro del círculo de radio 1/2.]{componente="BertrandParadox"}
```yaml
metodo: radio
vista: puntos-medios
```
:::

## Propiedades

- **Distribución de la distancia:** con extremos uniformes, la distancia $d$ del punto medio al centro tiene densidad $2/(\pi\sqrt{1 - d^2})$; con radio uniforme, $d$ es uniforme en $[0, 1]$; con punto medio uniforme, $d$ tiene densidad $2d$.
- **Invariancia:** el método del radio es el único de los tres invariante bajo traslaciones y cambios de escala, argumento que propuso Jaynes para preferir la respuesta 1/2 cuando no hay más información.
- **Experimentos físicos:** lanzar pajillas sobre un círculo dibujado en el piso produce cuerdas que siguen el método del radio, con proporción cercana a 1/2.
- **Lección general:** en espacios continuos, una distribución "uniforme" depende de la parametrización; uniforme en el ángulo no es uniforme en la longitud ni en el área.

:::figura[Los puntos medios uniformes en el disco: la fracción dentro del círculo de radio 1/2 es el cociente de áreas, 1/4.]{componente="BertrandParadox"}
```yaml
metodo: punto-medio
vista: puntos-medios
```
:::

## Errores comunes

- **Buscar cuál de las tres respuestas es la correcta.** Las tres lo son, para tres experimentos distintos. El problema original está incompleto.
- **Creer que "uniforme" es una noción única en espacios continuos.** Una distribución uniforme en una variable se vuelve no uniforme al cambiar de variable.
- **Confundir la paradoja con un error de cálculo.** Ninguno de los tres razonamientos tiene errores; difieren en el modelo.

:::figura[Las cuerdas del método del punto medio: hay muchas cuerdas cortas cerca del borde porque la mayor parte del área del disco está lejos del centro.]{componente="BertrandParadox"}
```yaml
metodo: punto-medio
vista: cuerdas
```
:::

## Conexiones

La paradoja muestra los límites de la [[probabilidad-geometrica]] cuando el mecanismo de elección no está especificado, y es la versión continua del error de suponer [[espacios-equiprobables]] sin justificar la simetría. El error con el radio uniforme en el disco, visto al estimar áreas por simulación, es la misma idea. En estadística bayesiana reaparece como el problema de elegir distribuciones a priori "no informativas", que dependen de la parametrización.

## Formulario

:::formula[Condición de cuerda larga]
$$
2\sqrt{1 - d^2} > \sqrt{3} \iff d < \frac{1}{2}
$$

- $d$: distancia del centro al punto medio de la cuerda; el radio del círculo es 1.
:::

:::formula[Método de extremos]
$$
P = \frac{2\pi/3}{2\pi} = \frac{1}{3}
$$

- $2\pi/3$: longitud del arco en que debe caer el segundo extremo.
:::

:::formula[Método del radio]
$$
P = P\!\left(d < \tfrac{1}{2}\right) = \frac{1/2}{1} = \frac{1}{2}
$$

- $d$ es uniforme en $[0, 1]$.
:::

:::formula[Método del punto medio]
$$
P = \frac{\pi (1/2)^2}{\pi \cdot 1^2} = \frac{1}{4}
$$

- Cociente entre el área del disco de radio $1/2$ y la del disco completo.
:::
