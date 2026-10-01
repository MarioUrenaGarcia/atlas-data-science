---
id: relaciones-entre-modos-de-convergencia
titulo: Relaciones entre modos de convergencia
titulo_en: Relationships between modes of convergence
alias:
  - jerarquía de modos de convergencia
  - contraejemplos de convergencia
modulo: 3
submodulo: '3.1'
orden: 5
nivel: avanzado
prerrequisitos:
  - convergencia-casi-segura
  - convergencia-en-media-cuadratica
  - convergencia-en-distribucion
etiquetas:
  - convergencia
  - implicaciones
  - contraejemplos
  - jerarquía
resumen: >
  Casi segura y en media cuadrática implican en probabilidad, que implica en distribución. Ninguna
  flecha se invierte en general, y cada fallo tiene un contraejemplo concreto.
formula: 'X_n \xrightarrow{c.s.} X \ \Rightarrow\ X_n \xrightarrow{p} X \ \Rightarrow\ X_n \xrightarrow{d} X, \qquad X_n \xrightarrow{L^2} X \ \Rightarrow\ X_n \xrightarrow{p} X'
visualizacion:
  componente: ConvergenceViz
  parametros:
    modo: relaciones
    sucesion: maquina-de-escribir
    sucesiones:
      - maquina-de-escribir
      - pico-creciente
      - signo-alternante
      - picos-independientes
      - picos-cuadrado
      - media-moneda
referencias:
  - clave: durrett
  - clave: casella-berger
    capitulo: '5.5'
publicado: true
---

## Intuición

Los cuatro modos de convergencia responden preguntas distintas sobre una sucesión aleatoria. La casi segura pregunta si cada trayectoria termina quieta. La de media cuadrática pregunta si el error al cuadrado, en promedio, se apaga. La de probabilidad pregunta si en cada instante grande casi todas las trayectorias están cerca. La de distribución solo pregunta si la tabla de probabilidades se parece a la del límite.

Algunas preguntas son más exigentes que otras. Si cada trayectoria termina quieta, en un instante grande casi todas estarán cerca; si el error cuadrático promedio es pequeño, pocas trayectorias pueden estar lejos. Y si casi todas están cerca del límite, sus distribuciones se parecen. Lo contrario falla: un inspector que visita una por una todas las secciones de un almacén, cada ronda con secciones más pequeñas, pasa cada vez menos tiempo en la sección de un paquete concreto, pero vuelve a ella en cada ronda para siempre. Conocer cuál implica cuál, y qué ejemplo rompe cada implicación inversa, evita errores al demostrar consistencia de estimadores o al aplicar teoremas límite.

## Definición

:::teorema[Implicaciones entre modos]
Sean $X_n$ y $X$ variables aleatorias en el mismo espacio.
1. $X_n \xrightarrow{c.s.} X \Rightarrow X_n \xrightarrow{p} X$.
2. $X_n \xrightarrow{L^r} X \Rightarrow X_n \xrightarrow{p} X$ para todo $r \ge 1$, y $L^r \Rightarrow L^s$ si $r > s \ge 1$.
3. $X_n \xrightarrow{p} X \Rightarrow X_n \xrightarrow{d} X$.
4. Si $c$ es constante, $X_n \xrightarrow{d} c \Rightarrow X_n \xrightarrow{p} c$.
5. Si $X_n \xrightarrow{p} X$, alguna subsucesión cumple $X_{n_k} \xrightarrow{c.s.} X$.
6. Si $X_n \xrightarrow{p} X$ y $|X_n| \le Y$ con $\mathbb{E}[Y] < \infty$ (o, en general, si la familia es uniformemente integrable), entonces $X_n \xrightarrow{L^1} X$.
:::

Ninguna otra implicación vale en general: casi segura y media cuadrática son independientes entre sí, y ni la convergencia en probabilidad ni la de distribución implican las más fuertes.

:::nota[Qué significa cada símbolo]
- $\xrightarrow{c.s.}$, $\xrightarrow{p}$, $\xrightarrow{d}$, $\xrightarrow{L^r}$: convergencia casi segura, en probabilidad, en distribución y en media de orden $r$.
- $r, s$: órdenes de los momentos, con $r > s \ge 1$.
- $c$: constante real.
- $X_{n_k}$: subsucesión, con índices $n_1 < n_2 < \cdots$.
- $Y$: variable que acota a todas las $|X_n|$ y tiene esperanza finita.
:::

## Cómo usar la visualización

El diagrama tiene un nodo por modo. Las flechas negras son las implicaciones que siempre valen. Al elegir una sucesión, cada nodo se colorea según si esa sucesión converge en ese sentido, y aparece una flecha discontinua tachada por cada implicación que la sucesión refuta. Abajo se animan sus trayectorias con una banda de $\pm 0.5$.

La máquina de escribir refuta "probabilidad implica casi segura" y "media cuadrática implica casi segura". El pico creciente refuta "casi segura implica media cuadrática". El signo alternante refuta "distribución implica probabilidad". El promedio de volados converge en los cuatro sentidos y no refuta nada.

## Ejemplo

Un paquete está en la posición $U \sim U(0, 1)$ de un almacén. En la ronda $k$ un inspector divide el almacén en $k$ secciones de longitud $1/k$ y las visita en orden; $X_n = 1$ si en la visita número $n$ inspecciona la sección del paquete, y 0 si no. Es la máquina de escribir.

1. En la ronda $k$, cada visita encuentra el paquete con probabilidad $1/k$: $P(X_n = 1) = 1/k$.
2. **En probabilidad:** para $\varepsilon < 1$, $P(|X_n| > \varepsilon) = 1/k \to 0$, porque $k \to \infty$ cuando $n \to \infty$ (la visita $n$ cae en la ronda $k \approx \sqrt{2n}$).
3. **En media cuadrática:** $\mathbb{E}[X_n^2] = 1/k \to 0$.
4. **Casi segura:** para cada posición $u$, en cada ronda hay exactamente una visita con $X_n = 1$. La sucesión $X_n(u)$ toma el valor 1 infinitas veces y 0 infinitas veces: no converge para ningún $u$.
5. **En distribución:** como converge en probabilidad, converge en distribución a 0.
6. Conclusión: ni la convergencia en probabilidad ni la de media cuadrática implican la casi segura.

:::figura[El ejemplo del inspector: la máquina de escribir converge en media cuadrática, en probabilidad y en distribución, pero no casi seguramente.]{componente="ConvergenceViz"}
```yaml
modo: relaciones
sucesion: maquina-de-escribir
```
:::

## Propiedades

- **Pico creciente:** $X_n = n\,\mathbf{1}\{U < 1/n\}$ converge casi seguramente a 0 (para cada $u > 0$ vale 0 desde $n > 1/u$), pero $\mathbb{E}[X_n^2] = n$: casi segura no implica media cuadrática.
- **Signo alternante:** $X_n = (-1)^n Z$ con $Z$ simétrica converge en distribución a $Z$ y no en probabilidad: distribución no implica probabilidad cuando el límite es aleatorio.
- **Picos independientes:** con $X_n \sim \operatorname{Bernoulli}(1/n)$ independientes hay convergencia en probabilidad y en media cuadrática, pero no casi segura, porque $\sum 1/n = \infty$ y por el segundo lema de Borel-Cantelli ocurren infinitos picos.
- **Subsucesión rápida:** en el último ejemplo, la subsucesión $X_{n^2}$ sí converge casi seguramente, porque $\sum 1/n^2 < \infty$.
- **Representación de Skorokhod:** si $X_n \xrightarrow{d} X$, existen variables $Y_n$ y $Y$, con las mismas distribuciones, tales que $Y_n \xrightarrow{c.s.} Y$.

:::figura[Propiedad: el pico creciente converge casi seguramente y en probabilidad, pero no en media cuadrática.]{componente="ConvergenceViz"}
```yaml
modo: relaciones
sucesion: pico-creciente
```
:::

:::figura[Propiedad: picos independientes con probabilidad 1/n frente a 1/n². Solo el segundo caso converge casi seguramente; ambos convergen en probabilidad.]{componente="ConvergenceViz"}
```yaml
modo: relaciones
sucesion: picos-independientes
sucesiones:
  - picos-independientes
  - picos-cuadrado
```
:::

:::demostracion
Para el punto 4: si $X_n \xrightarrow{d} c$, la función de distribución límite es $\mathbf{1}\{x \ge c\}$, continua en todo $x \neq c$. Entonces $P(|X_n - c| > \varepsilon) \le F_n(c - \varepsilon) + 1 - F_n(c + \varepsilon/2) \to 0 + 1 - 1 = 0$.
:::

## Errores comunes

- **Invertir las flechas.** Demostrar convergencia en distribución no basta para afirmar consistencia de un estimador cuando el límite es aleatorio.
- **Suponer que casi segura es la más fuerte de todas.** No implica la convergencia en media cuadrática; la convergencia de esperanzas requiere además dominación o integrabilidad uniforme.
- **Olvidar la excepción del límite constante.** Hacia una constante, distribución y probabilidad son equivalentes, y eso es lo que se usa en el teorema de Slutsky.
- **Pensar que los contraejemplos son rarezas.** Aparecen en problemas reales: estimadores con valores extremos raros fallan en media cuadrática aunque sean consistentes.

:::figura[Error común: invertir la flecha de distribución a probabilidad. El signo alternante solo converge en distribución.]{componente="ConvergenceViz"}
```yaml
modo: relaciones
sucesion: signo-alternante
```
:::

## Conexiones

Organiza los cuatro modos: [[convergencia-casi-segura]], [[convergencia-en-media-cuadratica]], [[convergencia-en-probabilidad]] y [[convergencia-en-distribucion]]. Los [[lemas-de-borel-cantelli]] explican por qué los picos independientes de probabilidad $1/n$ no convergen casi seguramente y los de $1/n^2$ sí. Las leyes de grandes números existen en versión [[ley-debil-de-los-grandes-numeros|débil]] y [[ley-fuerte-de-los-grandes-numeros|fuerte]] precisamente porque la convergencia en probabilidad y la casi segura son distintas. El [[teorema-de-slutsky]] usa la equivalencia de distribución y probabilidad hacia constantes.

## Formulario

:::formula[Cadena principal]
$$
\xrightarrow{c.s.}\ \Rightarrow\ \xrightarrow{p}\ \Rightarrow\ \xrightarrow{d}, \qquad \xrightarrow{L^r}\ \Rightarrow\ \xrightarrow{p}
$$

- $c.s.$: casi segura; $p$: en probabilidad; $d$: en distribución; $L^r$: en media de orden $r$.
:::

:::formula[Hacia una constante]
$$
X_n \xrightarrow{d} c \iff X_n \xrightarrow{p} c
$$

- $c$: constante.
:::

:::formula[Momentos de orden distinto]
$$
X_n \xrightarrow{L^r} X \Rightarrow X_n \xrightarrow{L^s} X, \quad r > s \ge 1
$$

- $r, s$: órdenes de los momentos.
:::

:::formula[Máquina de escribir]
$$
X_n = \mathbf{1}\Big\{U \in \Big[\frac{j}{k}, \frac{j+1}{k}\Big)\Big\},\quad n = \frac{k(k-1)}{2} + j + 1,\quad P(X_n = 1) = \frac{1}{k}
$$

- $U$: uniforme en $[0, 1]$.
- $k$: ronda o bloque; $j = 0, \dots, k - 1$, la sección dentro de la ronda.
- $n$: índice global de la visita.
:::

:::formula[Pico creciente]
$$
X_n = n\,\mathbf{1}\{U < 1/n\},\qquad \mathbb{E}[X_n^2] = n
$$

- $\mathbf{1}\{\cdot\}$: indicadora.
- $U$: uniforme en $[0, 1]$.
:::
