---
id: probabilidad-geometrica
titulo: Probabilidad geométrica
titulo_en: Geometric probability
alias:
  - probabilidad como cociente de áreas
  - probabilidad uniforme en una región
modulo: 1
submodulo: '1.1'
orden: 11
nivel: basico
prerrequisitos:
  - espacios-equiprobables
relaciones:
  - tipo: relacionado
    id: aguja-de-buffon
etiquetas:
  - áreas
  - longitudes
  - distribución uniforme
  - problema del encuentro
resumen: >
  Si un punto se elige uniformemente en una región, la probabilidad de que caiga en una subregión es
  el cociente de sus medidas: longitudes, áreas o volúmenes.
formula: 'P(A) = \frac{\operatorname{área}(A)}{\operatorname{área}(\Omega)}'
visualizacion:
  componente: GeometricProbability
  parametros:
    escenario: encuentro
    espera: 15
    horizonte: 60
referencias:
  - clave: ross-probabilidad
    capitulo: '2'
  - clave: degroot
publicado: true
---

## Intuición

Dos amigos acuerdan verse en un café entre las 6 y las 7 de la tarde. Cada uno llega en un momento al azar de esa hora y espera 15 minutos al otro antes de irse. ¿Qué tan probable es que se encuentren? Hay infinitos momentos de llegada posibles, así que no se puede contar casos favorables. Pero se puede medir.

Cada par de horas de llegada es un punto de un cuadrado de 60 por 60 minutos. Si las llegadas son uniformes e independientes, ninguna zona del cuadrado es preferida: la probabilidad de caer en una zona es proporcional a su área. Los amigos se encuentran cuando sus llegadas difieren en a lo más 15 minutos, una franja alrededor de la diagonal. La probabilidad es el área de la franja dividida entre el área del cuadrado.

La probabilidad geométrica es la regla de Laplace con medidas continuas en lugar de conteos. Funciona igual en una dimensión (longitudes de segmentos), en dos (áreas) o en tres (volúmenes), siempre que el punto se elija de manera uniforme.

## Definición

:::definicion[Probabilidad geométrica]
Sea $\Omega \subset \mathbb{R}^d$ una región con medida $\lambda(\Omega)$ finita y positiva (longitud si $d = 1$, área si $d = 2$, volumen si $d = 3$). Si un punto se elige **uniformemente** en $\Omega$, la probabilidad de que caiga en una subregión $A \subseteq \Omega$ es

$$
P(A) = \frac{\lambda(A)}{\lambda(\Omega)}.
$$

:::

"Uniformemente" significa que dos subregiones con la misma medida tienen la misma probabilidad, sin importar dónde estén. La definición cumple los axiomas de Kolmogorov: las medidas son no negativas, $P(\Omega) = 1$ y las medidas de regiones disjuntas se suman. Cada punto individual tiene probabilidad 0, porque su área es 0.

:::figura[Un punto uniforme en un disco de radio 1 cae dentro del disco concéntrico de radio r con probabilidad igual al cociente de áreas, r al cuadrado. Con r = 0.5 la probabilidad es 1/4, no 1/2.]{componente="GeometricProbability"}

```yaml
escenario: disco
radio: 0.5
muestreo: area
```

:::

:::nota[Qué significa cada símbolo]

- $\Omega$: región donde se elige el punto, dentro de $\mathbb{R}^d$ (el espacio de dimensión $d$).
- $A$: subregión favorable.
- $\lambda(\cdot)$: medida de una región: longitud, área o volumen según la dimensión.
- $T$: duración de la ventana de llegada en el problema del encuentro; $w$: tiempo de espera.
- $x$, $y$: momentos de llegada de cada persona, medidos desde el inicio de la ventana.
- $r$: radio del disco interior; $\pi$: la constante 3.14159...
:::

## Cómo usar la visualización

El cuadrado de la izquierda representa todas las parejas de horas de llegada: el eje horizontal es la llegada de la primera persona y el vertical la de la segunda, en minutos a partir de las 6. La franja sombreada son las parejas en que se encuentran. Cada paso agrega un punto al azar; los puntos dentro de la franja se colorean. A la derecha, la proporción de puntos dentro de la franja se compara con el cociente exacto de áreas.

Con 15 minutos de espera la probabilidad es $1 - (45/60)^2 = 7/16 \approx 0.44$. Al subir la espera a 30 minutos la franja cubre tres cuartos del cuadrado. Con 5 minutos la franja es muy delgada y la probabilidad baja a cerca de 0.16: duplicar el tiempo de espera no duplica la probabilidad.

## Ejemplo

Dos camiones de reparto llegan a un andén de carga en momentos independientes y uniformes entre las 8 y las 9 de la mañana. La descarga de cada uno ocupa el andén 10 minutos. ¿Cuál es la probabilidad de que uno tenga que esperar?

1. Sean $x$ e $y$ los minutos de llegada después de las 8; $(x, y)$ es uniforme en el cuadrado $[0, 60]^2$, de área $3600$.
2. Hay conflicto si $|x - y| < 10$.
3. El complemento son dos triángulos rectángulos con catetos de $60 - 10 = 50$: área total $2 \cdot \tfrac{1}{2} \cdot 50^2 = 2500$.
4. Área favorable: $3600 - 2500 = 1100$.
5. $P(\text{conflicto}) = 1100 / 3600 = 1 - (50/60)^2 \approx 0.306$.

:::figura[El problema de los camiones: con 10 minutos de ocupación, la franja de conflicto cubre cerca del 31 % del cuadrado de llegadas.]{componente="GeometricProbability"}

```yaml
escenario: encuentro
espera: 10
horizonte: 60
```

:::

## Propiedades

- **Problema del encuentro:** con ventana $T$ y espera $w \le T$, $P = 1 - (1 - w/T)^2$.
- **Varilla rota:** si una varilla se corta en dos puntos uniformes independientes, las tres piezas forman un triángulo con probabilidad $1/4$; la región favorable son dos triángulos del cuadrado unitario.
- **Coeficientes aleatorios:** si en $x^2 + bx + c = 0$ los coeficientes $b$ y $c$ son uniformes en $[0, 1]$, la ecuación tiene raíces reales con probabilidad $1/12$, el área bajo la parábola $c = b^2/4$.
- **Invariancia:** la probabilidad no cambia si la región completa se reescala, porque el cociente de medidas se conserva.

:::figura[La varilla rota: cada punto del cuadrado son dos cortes al azar. Las piezas forman un triángulo cuando ninguna mide más de la mitad, lo que ocurre en los dos triángulos sombreados, de área total 1/4.]{componente="GeometricProbability"}

```yaml
escenario: varilla-rota
```

:::

:::figura[Raíces reales de x al cuadrado + bx + c = 0 con b y c uniformes en [0, 1]: la región favorable es la zona bajo la parábola c = b al cuadrado entre 4, de área 1/12.]{componente="GeometricProbability"}

```yaml
escenario: raices-reales
bMax: 1
cMax: 1
```

:::

## Errores comunes

- **Confundir "uniforme" con "uniforme en otra variable".** Elegir un radio uniforme en $[0, 1]$ y un ángulo uniforme no produce un punto uniforme en el disco: los puntos se amontonan en el centro, y la probabilidad de caer a distancia menor que $r$ pasa de $r^2$ a $r$.
- **Usar longitudes cuando corresponden áreas.** En el problema del encuentro, una espera de 15 minutos sobre 60 no da probabilidad $15/60$: la región favorable es bidimensional.
- **Dar probabilidad positiva a un punto.** En un espacio continuo, la probabilidad de un valor exacto, como llegar exactamente a las seis y media, es 0.

:::figura[Radio uniforme en lugar de área uniforme: la nube de puntos se concentra en el centro y la proporción dentro del disco de radio 0.5 converge a 0.5, no al valor correcto 0.25.]{componente="GeometricProbability"}

```yaml
escenario: disco
radio: 0.5
muestreo: radio
```

:::

## Conexiones

La probabilidad geométrica extiende los [[espacios-equiprobables]] a regiones continuas y es la base de la [[aguja-de-buffon]] y de la [[estimacion-de-pi-por-monte-carlo]]. Simular puntos uniformes y contar los que caen en una región es la idea de la [[estimacion-de-probabilidades-por-simulacion-monte-carlo]]. Formalmente es el caso de la distribución uniforme continua en varias dimensiones, y la paradoja de Bertrand muestra que "elegir al azar" debe precisarse para que la respuesta esté bien definida.

## Formulario

:::formula[Probabilidad geométrica]

$$
P(A) = \frac{\lambda(A)}{\lambda(\Omega)}
$$

- $\lambda$: longitud, área o volumen.
- $A$: región favorable; $\Omega$: región total.
:::

:::formula[Problema del encuentro]

$$
P(|X - Y| \le w) = 1 - \left(1 - \frac{w}{T}\right)^2
$$

- $X$, $Y$: momentos de llegada, uniformes e independientes en $[0, T]$.
- $w$: tiempo máximo de espera, con $0 \le w \le T$.
:::

:::formula[Punto en un disco]

$$
P(\text{distancia al centro} \le r) = \frac{\pi r^2}{\pi \cdot 1^2} = r^2
$$

- $r$: radio del disco interior, entre 0 y 1.
:::

:::formula[Raíces reales con coeficientes uniformes]

$$
P(b^2 \ge 4c) = \int_0^1 \frac{b^2}{4}\, db = \frac{1}{12}
$$

- $b$, $c$: coeficientes de $x^2 + bx + c = 0$, uniformes en $[0, 1]$.
- $\int_0^1 \dots\, db$: área bajo la parábola $c = b^2/4$.
:::
