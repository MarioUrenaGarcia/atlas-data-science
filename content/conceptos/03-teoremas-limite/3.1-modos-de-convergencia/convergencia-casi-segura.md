---
id: convergencia-casi-segura
titulo: Convergencia casi segura
titulo_en: Almost sure convergence
alias:
  - convergencia con probabilidad 1
  - convergencia fuerte
  - convergencia c.s.
modulo: 3
submodulo: '3.1'
orden: 2
nivel: avanzado
prerrequisitos:
  - convergencia-en-probabilidad
relaciones:
  - tipo: relacionado
    id: independencia-de-eventos
etiquetas:
  - convergencia
  - trayectorias
  - probabilidad 1
  - variables aleatorias
resumen: >
  Xₙ converge casi seguramente a X si el conjunto de resultados donde la sucesión numérica Xₙ(ω)
  converge a X(ω) tiene probabilidad 1: casi todas las trayectorias terminan quedándose cerca del límite.
formula: 'X_n \xrightarrow{c.s.} X \iff P\Big(\lim_{n \to \infty} X_n = X\Big) = 1 \iff \lim_{n \to \infty} P\Big(\sup_{m \ge n} |X_m - X| > \varepsilon\Big) = 0\ \ \forall \varepsilon > 0'
visualizacion:
  componente: ConvergenceViz
  parametros:
    modo: casi-segura
    sucesion: picos-independientes
    sucesiones:
      - picos-independientes
      - picos-cuadrado
      - pico-creciente
      - maquina-de-escribir
    epsilon: 0.5
    trayectorias: 100
    horizonte: 500
referencias:
  - clave: durrett
  - clave: wasserman
publicado: true
---

## Intuición

Un centro de datos registra si un servidor falla cada día. Gracias a sucesivas mejoras, la probabilidad de falla en el día $n$ disminuye. Hay dos preguntas distintas. La primera: ¿la probabilidad de que el servidor falle hoy tiende a cero? La segunda, más exigente: ¿llegará un día a partir del cual el servidor no vuelva a fallar nunca?

La convergencia casi segura responde a la segunda. Se mira cada historia completa del servidor, día tras día, como una sucesión de números, y se pregunta si esa sucesión converge. Si casi todas las historias posibles terminan por estabilizarse, es decir, si el conjunto de historias que no convergen tiene probabilidad cero, hay convergencia casi segura.

Que la probabilidad de fallar hoy tienda a cero no basta. Si las fallas son independientes y su probabilidad baja como $1/n$, el servidor sigue fallando de vez en cuando para siempre, porque la suma de esas probabilidades es infinita. Si baja como $1/n^2$, la suma es finita y casi seguramente las fallas terminan. Lo que decide es cuánta probabilidad queda en todo el futuro, no solo en el día de hoy.

## Definición

:::definicion[Convergencia casi segura]
Sean $X_1, X_2, \dots$ y $X$ variables aleatorias en un espacio $(\Omega, \mathcal{F}, P)$. La sucesión **converge casi seguramente** a $X$, y se escribe $X_n \xrightarrow{c.s.} X$, si
$$
P\Big(\big\{\omega \in \Omega : \lim_{n \to \infty} X_n(\omega) = X(\omega)\big\}\Big) = 1.
$$
:::

Una caracterización útil mira la peor desviación en todo el futuro: $X_n \xrightarrow{c.s.} X$ si y solo si para todo $\varepsilon > 0$
$$
\lim_{n \to \infty} P\Big(\sup_{m \ge n} |X_m - X| > \varepsilon\Big) = 0.
$$
Equivalentemente, para todo $\varepsilon > 0$, $P(|X_n - X| > \varepsilon \text{ para infinitos } n) = 0$.

:::nota[Qué significa cada símbolo]
- $\Omega$: espacio muestral; $\omega$, un resultado posible, es decir, una trayectoria completa.
- $\mathcal{F}$: familia de eventos; $P$, la medida de probabilidad.
- $X_n(\omega)$: valor de la variable $n$ en el resultado $\omega$; para $\omega$ fijo es una sucesión de números.
- $X$: límite.
- $\xrightarrow{c.s.}$: "converge casi seguramente a".
- $\sup_{m \ge n} |X_m - X|$: la mayor distancia al límite desde el índice $n$ en adelante.
- $\varepsilon$: tolerancia positiva.
:::

## Cómo usar la visualización

Arriba aparecen las trayectorias de $X_n - X$ y la banda $\pm\varepsilon$; las trayectorias que todavía saldrán de la banda después del $n$ actual se resaltan y un punto marca la última salida de cada una dentro del horizonte. Abajo, la línea oscura es la fracción fuera de la banda en $n$ y la otra línea, la fracción que aún tiene alguna salida posterior: esta segunda es la que debe ir a cero.

Con picos independientes de probabilidad $1/n$, la fracción fuera en cada $n$ baja, pero los picos siguen apareciendo en todas las trayectorias hasta el final. Al cambiar a picos con probabilidad $1/n^2$, las últimas salidas se concentran al principio y la fracción con salidas futuras sigue la curva exacta $1/n$.

## Ejemplo

La probabilidad de que un servidor falle el día $n$ es $p_n = 1/n^2$, con fallas independientes. Sea $X_n = 1$ si falla el día $n$ y $X_n = 0$ si no.

1. $P(|X_n - 0| > \varepsilon) = 1/n^2 \to 0$ para $\varepsilon < 1$: hay convergencia en probabilidad a 0.
2. La probabilidad de no fallar ningún día desde el día $n$ es $\prod_{m \ge n}\big(1 - \frac{1}{m^2}\big)$.
3. Como $1 - \frac{1}{m^2} = \frac{(m-1)(m+1)}{m^2}$, el producto es telescópico y vale $\frac{n-1}{n}$ para $n \ge 2$.
4. Así, $P\big(\sup_{m \ge n} X_m > \varepsilon\big) = 1 - \frac{n-1}{n} = \frac{1}{n}$: desde el día 10 la probabilidad de alguna falla futura es 0.1, desde el día 100 es 0.01.
5. Como esa probabilidad tiende a cero, $X_n \xrightarrow{c.s.} 0$: casi seguramente hay un último día de falla.

:::figura[El servidor del ejemplo: picos independientes con probabilidad 1/n². La fracción de historias con alguna falla futura sigue la curva exacta 1/n.]{componente="ConvergenceViz"}
```yaml
modo: casi-segura
sucesion: picos-cuadrado
epsilon: 0.5
trayectorias: 150
horizonte: 400
```
:::

## Propiedades

- **Implica convergencia en probabilidad:** $P(|X_n - X| > \varepsilon) \le P(\sup_{m \ge n} |X_m - X| > \varepsilon)$.
- **Criterio de Borel-Cantelli:** si $\sum_n P(|X_n - X| > \varepsilon) < \infty$ para todo $\varepsilon > 0$, entonces $X_n \xrightarrow{c.s.} X$.
- **Funciones continuas:** si $g$ es continua y $X_n \xrightarrow{c.s.} X$, entonces $g(X_n) \xrightarrow{c.s.} g(X)$, porque se aplica el límite de sucesiones numéricas trayectoria por trayectoria.
- **Álgebra:** sumas y productos de sucesiones que convergen casi seguramente convergen casi seguramente a la suma y al producto de los límites.
- **No implica convergencia en media:** $X_n = n\,\mathbf{1}\{U < 1/n\}$ converge casi seguramente a 0, pero $\mathbb{E}[X_n^2] = n$.

:::figura[Propiedad: casi segura sin media cuadrática. En cada trayectoria el pico n · 1{U < 1/n} desaparece para siempre en cuanto n supera 1/U; la fracción con salidas futuras es exactamente 1/n.]{componente="ConvergenceViz"}
```yaml
modo: casi-segura
sucesion: pico-creciente
epsilon: 0.5
trayectorias: 100
horizonte: 300
```
:::

:::figura[Propiedad: el promedio de volados converge casi seguramente a 1/2. Después de cierto n ninguna trayectoria vuelve a salir de una banda de ancho 0.1.]{componente="ConvergenceViz"}
```yaml
modo: casi-segura
sucesion: media-moneda
epsilon: 0.1
trayectorias: 100
horizonte: 1000
```
:::

## Errores comunes

- **Creer que convergencia en probabilidad ya garantiza que cada trayectoria se estabilice.** Con picos independientes de probabilidad $1/n$ la probabilidad de un pico en el día $n$ tiende a cero, pero cada trayectoria tiene infinitos picos.
- **Pensar que "casi seguro" significa "en casi todos los casos que se pueden imaginar".** Puede haber infinitos resultados donde no hay convergencia; lo que se exige es que su probabilidad sea cero.
- **Revisar solo el valor actual.** El criterio correcto mira el supremo de las desviaciones futuras, no la desviación en $n$.
- **Inferirla de una simulación finita.** Ninguna simulación ve el futuro infinito: una trayectoria tranquila durante 500 pasos puede volver a saltar.

:::figura[Error común: la máquina de escribir converge en probabilidad, pero cada trayectoria vuelve a valer 1 en cada bloque. La fracción con salidas futuras se queda en 1 hasta el final del horizonte.]{componente="ConvergenceViz"}
```yaml
modo: casi-segura
sucesion: maquina-de-escribir
epsilon: 0.5
trayectorias: 30
horizonte: 400
```
:::

## Conexiones

Es más fuerte que la [[convergencia-en-probabilidad]] y es independiente de la [[convergencia-en-media-cuadratica]]: ninguna de las dos implica a la otra, como se ve en [[relaciones-entre-modos-de-convergencia]]. Es el modo de la [[ley-fuerte-de-los-grandes-numeros]] y del [[teorema-de-glivenko-cantelli]]. Los [[lemas-de-borel-cantelli]] dan el criterio práctico para probarla, y la [[ley-0-1-de-kolmogorov]] explica por qué muchos eventos de convergencia tienen probabilidad 0 o 1. Con [[series-y-convergencia-de-series|series]] convergentes de probabilidades se obtienen las cotas.

## Formulario

:::formula[Definición]
$$
X_n \xrightarrow{c.s.} X \iff P\Big(\lim_{n \to \infty} X_n = X\Big) = 1
$$

- $X_n$: término $n$ de la sucesión.
- $X$: límite.
- $P$: probabilidad del conjunto de trayectorias que convergen.
:::

:::formula[Caracterización con el supremo]
$$
\lim_{n \to \infty} P\Big(\sup_{m \ge n} |X_m - X| > \varepsilon\Big) = 0\ \ \forall \varepsilon > 0
$$

- $\sup_{m \ge n}$: máximo de las desviaciones desde el índice $n$.
- $\varepsilon$: tolerancia positiva.
:::

:::formula[Criterio de Borel-Cantelli]
$$
\sum_{n=1}^{\infty} P\big(|X_n - X| > \varepsilon\big) < \infty\ \ \forall \varepsilon > 0 \ \Rightarrow\ X_n \xrightarrow{c.s.} X
$$

- $\sum$: suma sobre todos los índices.
- Si la suma es finita, solo hay finitas salidas de la banda.
:::

:::formula[Producto telescópico del ejemplo]
$$
\prod_{m \ge n}\Big(1 - \frac{1}{m^2}\Big) = \frac{n-1}{n}
$$

- $m$: índice del día.
- $\frac{1}{m^2}$: probabilidad de falla el día $m$.
- $n$: día a partir del cual se cuentan las fallas, $n \ge 2$.
:::
