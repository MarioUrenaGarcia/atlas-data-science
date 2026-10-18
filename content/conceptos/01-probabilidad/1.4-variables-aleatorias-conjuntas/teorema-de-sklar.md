---
id: teorema-de-sklar
titulo: Teorema de Sklar
titulo_en: Sklar's theorem
alias:
  - descomposición en marginales y cópula
  - construcción de distribuciones con cópulas
modulo: 1
submodulo: '1.4'
orden: 17
nivel: avanzado
prerrequisitos:
  - copulas
relaciones:
  - tipo: relacionado
    id: muestreo-por-transformada-inversa
etiquetas:
  - Sklar
  - marginales y dependencia
  - construcción de modelos
  - función cuantil
resumen: >
  Toda distribución conjunta es una cópula evaluada en sus marginales, y cualquier cópula con cualesquiera marginales da una distribución conjunta: variables y dependencia se modelan por separado.
formula: 'H(x, y) = C\big(F(x),\ G(y)\big)'
visualizacion:
  componente: CopulaViz
  parametros:
    modo: sklar
    familia: gaussiana
    tau: 0.5
    margenX: exponencial
    margenY: normal
referencias:
  - clave: coles
  - clave: murphy
publicado: true
---

## Intuición

Al modelar dos riesgos financieros se suele saber bastante de cada uno por separado: uno tiene colas pesadas, otro es casi normal. Lo difícil es elegir cómo se relacionan. El **teorema de Sklar** permite resolver los dos problemas de manera independiente: primero se eligen las marginales, después una cópula para la dependencia, y el teorema garantiza que la combinación es una distribución conjunta válida y que, en sentido inverso, toda conjunta se descompone así.

La construcción es concreta. Se generan pares $(u, v)$ de la cópula y cada coordenada se lleva a su escala con la función cuantil de su marginal: $x = F^{-1}(u)$, $y = G^{-1}(v)$. Las funciones cuantil son crecientes, así que el orden de los puntos no cambia: la dependencia es la misma, y las marginales son las elegidas.

## Definición

:::teorema[Teorema de Sklar]
Sea $H$ la función de distribución conjunta de $(X, Y)$, con marginales $F$ y $G$. Existe una cópula $C$ tal que
$$
H(x, y) = C\big(F(x),\ G(y)\big) \quad \text{para todos } x, y.
$$
Si $F$ y $G$ son continuas, $C$ es única. Recíprocamente, si $C$ es una cópula y $F$, $G$ son funciones de distribución, la fórmula define una distribución conjunta con marginales $F$ y $G$.
:::

Cuando las marginales son continuas, la cópula se recupera de la conjunta con las funciones cuantil: $C(u, v) = H\big(F^{-1}(u),\ G^{-1}(v)\big)$.

:::figura[Una cópula de Clayton con tau 0.6 combinada con una marginal lognormal y otra gamma: a la derecha, los valores pequeños de ambas variables aparecen juntos, como en la esquina inferior de la cópula.]{componente="CopulaViz"}
```yaml
modo: sklar
familia: clayton
tau: 0.6
margenX: lognormal
margenY: gamma
parametrosY:
  alpha: 3
```
:::

:::nota[Qué significa cada símbolo]
- $H$: función de distribución conjunta de $(X, Y)$.
- $F$, $G$: funciones de distribución marginales de $X$ y $Y$.
- $C$: cópula, distribución conjunta con marginales uniformes.
- $F^{-1}$, $G^{-1}$: funciones cuantil.
- $(u, v)$: un par de la cópula; $(x, y)$: el par correspondiente con las marginales elegidas.
- $\Phi^{-1}$: función cuantil de la normal estándar.
:::

## Cómo usar la visualización

A la izquierda se simulan pares de una cópula gaussiana con tau de Kendall 0.5; a la derecha, los mismos pares llevados a una marginal exponencial para $X$ y normal para $Y$. El último par aparece resaltado en ambos paneles y el encabezado escribe la transformación con sus números. Los histogramas de los bordes muestran que a la izquierda las marginales son planas y a la derecha son la exponencial y la normal.

El selector de familia (si hay varias) y la deslizadera de tau cambian solo la dependencia; las marginales de la derecha no cambian.

## Ejemplo

Se quiere un par con $X$ exponencial de media 1, $Y$ normal estándar y dependencia dada por una cópula gaussiana. Un par simulado de la cópula es $(u, v) = (0.9,\ 0.3)$.

1. $x = F^{-1}(0.9) = -\ln(1 - 0.9) = \ln 10 \approx 2.303$.
2. $y = G^{-1}(0.3) = \Phi^{-1}(0.3) \approx -0.524$.
3. El par $(2.303,\ -0.524)$ tiene $X$ en su percentil 90 y $Y$ en su percentil 30, igual que $(u, v)$.
4. Repitiendo con muchos pares se obtiene una muestra de la distribución conjunta $H(x, y) = C\big(1 - e^{-x},\ \Phi(y)\big)$.

:::figura[Una cópula de Gumbel con marginales Weibull y lognormal: la dependencia de cola superior de la cópula aparece como valores grandes de ambas variables que ocurren juntos.]{componente="CopulaViz"}
```yaml
modo: sklar
familia: gumbel
tau: 0.5
margenX: weibull
parametrosX:
  k: 1.5
margenY: lognormal
```
:::

## Propiedades

- **Separación:** las marginales determinan el comportamiento de cada variable y la cópula todo lo demás.
- **Unicidad:** con marginales continuas la cópula es única; con marginales discretas solo queda determinada en el rango de $F$ y $G$.
- **Simulación:** generar $(U, V)$ de la cópula y aplicar las funciones cuantil es el método general para simular distribuciones conjuntas con marginales prescritas.
- **Independencia:** con la cópula $C(u, v) = uv$, la conjunta es $F(x)\,G(y)$.
- **Varias dimensiones:** el teorema vale igual para $d$ variables con una cópula $d$-dimensional.

:::figura[Con la cópula de independencia y marginales normal y exponencial, la nube de la derecha no muestra tendencia: la conjunta es el producto de las marginales.]{componente="CopulaViz"}
```yaml
modo: sklar
familia: independiente
margenX: normal
margenY: exponencial
```
:::

## Errores comunes

- **Esperar la misma correlación de Pearson con marginales distintas.** La correlación lineal depende de las marginales: la misma cópula con marginales muy asimétricas da correlaciones de Pearson menores.
- **Usar la correlación lineal para elegir la cópula.** Lo que la cópula conserva son medidas de rangos, como la tau de Kendall.
- **Olvidar que la unicidad requiere continuidad.** Con marginales discretas, distintas cópulas pueden producir la misma conjunta.

:::figura[Una cópula gaussiana con tau 0.7 y marginales lognormales muy asimétricas: el orden de los puntos se conserva, pero unos cuantos valores enormes dominan y la relación ya no parece lineal.]{componente="CopulaViz"}
```yaml
modo: sklar
familia: gaussiana
tau: 0.7
margenX: lognormal
parametrosX:
  sigma: 1.2
margenY: lognormal
parametrosY:
  sigma: 1.2
```
:::

## Conexiones

El teorema de Sklar une las [[copulas]] con las [[distribuciones-marginales]] para formar una [[distribucion-conjunta]]. Su construcción es el [[muestreo-por-transformada-inversa]] aplicado a cada coordenada, y su inversa usa la [[transformada-integral-de-probabilidad]] y la [[funcion-cuantil]]. Permite estudiar la [[dependencia-de-colas]] por separado del comportamiento de cada variable.

## Formulario

:::formula[Teorema de Sklar]
$$
H(x, y) = C\big(F(x),\ G(y)\big)
$$

- $C$ única si $F$ y $G$ son continuas.
:::

:::formula[Cópula desde la conjunta]
$$
C(u, v) = H\big(F^{-1}(u),\ G^{-1}(v)\big)
$$

- Con marginales continuas.
:::

:::formula[Construcción por simulación]
$$
(U, V) \sim C \ \Rightarrow\ \big(F^{-1}(U),\ G^{-1}(V)\big) \sim H
$$

- Las funciones cuantil llevan cada coordenada a su escala.
:::
