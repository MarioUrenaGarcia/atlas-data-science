---
id: dependencia-de-colas
titulo: Dependencia de colas
titulo_en: Tail dependence
alias:
  - coeficiente de dependencia de colas
  - dependencia extrema
  - lambda superior e inferior
modulo: 1
submodulo: '1.4'
orden: 18
nivel: avanzado
prerrequisitos:
  - copulas
relaciones:
  - tipo: relacionado
    id: colas-ligeras-y-pesadas-en-datos
  - tipo: contrasta
    id: correlacion-de-pearson
etiquetas:
  - valores extremos
  - riesgo conjunto
  - colas de la cópula
  - crisis simultáneas
resumen: >
  La dependencia de colas mide la probabilidad de que una variable sea extrema sabiendo que la otra
  lo es, en el límite de los valores más extremos. Depende solo de la cópula, y familias con la
  misma correlación pueden tenerla o no.
formula: '\lambda_U = \lim_{q \to 1} P\big(V > q \mid U > q\big), \qquad \lambda_L = \lim_{q \to 0} P\big(V \le q \mid U \le q\big)'
visualizacion:
  componente: CopulaViz
  parametros:
    modo: colas
    familia: gaussiana
    familias: [gaussiana, gumbel, clayton]
    tau: 0.5
    muestras: 3000
    q: 0.9
referencias:
  - clave: coles
    capitulo: '8'
publicado: true
---

## Intuición

Dos ríos vecinos pueden tener crecidas moderadas sin mucha relación, pero cuando llega una tormenta excepcional ambos se desbordan a la vez. Dos acciones pueden moverse con independencia relativa en días normales y desplomarse juntas en una crisis. En estos casos la dependencia es más fuerte en los extremos que en el centro, y una medida global como la correlación no lo detecta.

La **dependencia de colas** pregunta directamente por los extremos: si $X$ está en su 1 % más alto, ¿con qué probabilidad $Y$ también lo está? Si esa probabilidad no tiende a cero cuando el umbral se vuelve cada vez más extremo, hay dependencia en la cola superior. Lo mismo, con los valores más bajos, define la dependencia en la cola inferior.

## Definición

:::definicion[Coeficientes de dependencia de colas]
Sean $X$ y $Y$ continuas con marginales $F$ y $G$, y sean $U = F(X)$, $V = G(Y)$. Los coeficientes de **dependencia de cola superior** e **inferior** son
$$
\lambda_U = \lim_{q \to 1^-} P(V > q \mid U > q), \qquad \lambda_L = \lim_{q \to 0^+} P(V \le q \mid U \le q),
$$
cuando los límites existen. Hay dependencia de cola superior si $\lambda_U > 0$ y es asintóticamente independiente en esa cola si $\lambda_U = 0$.
:::

Los coeficientes dependen solo de la cópula de $(X, Y)$, no de sus marginales. Para la cópula de Gumbel, $\lambda_U = 2 - 2^{1/\theta}$; para la de Clayton, $\lambda_L = 2^{-1/\theta}$; para la gaussiana con $|\rho| < 1$, ambos son 0.

:::figura[La cópula de Clayton con tau 0.5 ($\theta = 2$): la esquina inferior concentra puntos y la curva de la cola inferior se mantiene cerca de $\lambda_L = 2^{-1/2} \approx 0.707$, mientras que la de la cola superior baja hacia 0.]{componente="CopulaViz"}
```yaml
modo: colas
familia: clayton
tau: 0.5
muestras: 3000
q: 0.9
```
:::

:::nota[Qué significa cada símbolo]
- $U = F(X)$, $V = G(Y)$: percentiles de $X$ y $Y$, uniformes entre 0 y 1.
- $q$: umbral; $U > q$ indica que $X$ está en su fracción superior $1 - q$.
- $\lambda_U$, $\lambda_L$: coeficientes de dependencia de cola superior e inferior.
- $\theta$: parámetro de la familia de cópulas; $\rho$: correlación de la cópula gaussiana.
- $\tau$: tau de Kendall.
- $C$: cópula del par; $C(q, q)$: probabilidad de que ambos percentiles queden en o debajo de $q$.
- $F$, $G$: funciones de distribución de $X$ y $Y$.
:::

## Cómo usar la visualización

A la izquierda, los pares simulados de la cópula gaussiana con tau 0.5; las esquinas sombreadas son los pares en los que ambas coordenadas superan $q$ (arriba) o quedan debajo de $1 - q$ (abajo). A la derecha, las fracciones condicionales estimadas para cada umbral entre 0.5 y 0.98, junto con los límites teóricos punteados. El encabezado da la fracción de la esquina superior para el umbral elegido.

Con la gaussiana, las dos curvas bajan conforme $q$ se acerca a 1, aunque despacio: su límite es 0, pero en $q = 0.98$ todavía valen alrededor de 0.3. Al cambiar a Gumbel, la curva superior se estabiliza alrededor de 0.59; con Clayton, la inferior lo hace alrededor de 0.71. La deslizadera de $q$ mueve las esquinas y la línea vertical.

## Ejemplo

Para la cópula de Gumbel con $\theta = 2$ (tau de Kendall 0.5):

1. $\lambda_U = 2 - 2^{1/2} \approx 0.586$.
2. Interpretación: cuando una variable supera un percentil muy alto, la otra lo supera con probabilidad cercana a 0.59.
3. Con independencia esa probabilidad sería $1 - q$, que tiende a 0; con la gaussiana del mismo tau también tiende a 0, aunque más despacio.
4. En $q = 0.95$ la probabilidad condicional exacta es $\big(1 - 2q + C(q, q)\big)/(1 - q) \approx 0.60$. Con 4000 pares hay unos 200 con $U > 0.95$, y la fracción simulada varía alrededor de 0.60 por el ruido de muestreo: con tan pocos pares, valores entre 0.53 y 0.67 son comunes.

:::figura[El ejemplo con la cópula de Gumbel y umbral 0.95: la esquina superior derecha retiene una fracción de los pares con $U > 0.95$ cercana a la exacta, 0.60, con la variación propia de unos 200 pares.]{componente="CopulaViz"}
```yaml
modo: colas
familia: gumbel
tau: 0.5
muestras: 4000
q: 0.95
```
:::

## Propiedades

- **Invariancia:** los coeficientes no cambian con transformaciones estrictamente crecientes de cada variable.
- **Asimetría posible:** una cópula puede tener dependencia en una cola y no en la otra (Clayton y Gumbel), o en ninguna (gaussiana, Frank).
- **Rango:** $0 \le \lambda_U, \lambda_L \le 1$; vale 1 con dependencia creciente perfecta.
- **Relación con la tau:** a igual tau de Kendall, la dependencia de colas puede ser muy distinta; la tau mide dependencia global y $\lambda$ solo la de los extremos.

:::figura[La cópula de Frank con tau 0.5: dependencia moderada en el centro, pero las fracciones de las dos esquinas caen hacia 0 al acercarse $q$ a 1; en $q = 0.98$ la exacta es cercana a 0.1.]{componente="CopulaViz"}
```yaml
modo: colas
familia: frank
tau: 0.5
muestras: 3000
q: 0.9
```
:::

## Errores comunes

- **Suponer que una correlación alta implica eventos extremos conjuntos.** La gaussiana con correlación 0.95 sigue teniendo $\lambda_U = 0$.
- **Estimar con umbrales demasiado altos.** Con pocos datos, la esquina contiene muy pocos puntos y la estimación es inestable; la curva completa en función de $q$ es más informativa que un solo valor.
- **Confundir colas pesadas con dependencia de colas.** Las colas pesadas son una propiedad de cada marginal; la dependencia de colas, de la cópula.

:::figura[La cópula gaussiana con tau 0.8, una correlación de casi 0.95: con $q = 0.98$ todavía muchos pares extremos coinciden, pero la curva sigue bajando y el límite teórico es 0.]{componente="CopulaViz"}
```yaml
modo: colas
familia: gaussiana
tau: 0.8
muestras: 4000
q: 0.98
```
:::

## Conexiones

La dependencia de colas es una propiedad de las [[copulas]], independiente de las marginales por el [[teorema-de-sklar]]. Contrasta con la [[correlacion-de-pearson]], que resume la relación en todo el rango, y no debe confundirse con las [[colas-ligeras-y-pesadas-en-datos]] de cada variable. Se calcula a partir de la [[distribucion-condicional]] de una variable dado que la otra es extrema.

## Formulario

:::formula[Cola superior]
$$
\lambda_U = \lim_{q \to 1^-} P(V > q \mid U > q)
$$

- $\lambda_U$: coeficiente de dependencia de cola superior.
- $U = F(X)$, $V = G(Y)$: percentiles de $X$ y $Y$; $F$, $G$: sus funciones de distribución.
- $q$: umbral que se acerca a 1 por la izquierda.
:::

:::formula[Cola inferior]
$$
\lambda_L = \lim_{q \to 0^+} P(V \le q \mid U \le q)
$$

- $\lambda_L$: coeficiente de dependencia de cola inferior.
- $q$: umbral que se acerca a 0 por la derecha.
:::

:::formula[Probabilidad condicional en la esquina superior]
$$
P(V > q \mid U > q) = \frac{1 - 2q + C(q, q)}{1 - q}
$$

- $C$: cópula de $(X, Y)$; $C(q, q) = P(U \le q,\ V \le q)$.
:::

:::formula[Familias]
$$
\text{Gumbel: } \lambda_U = 2 - 2^{1/\theta}, \qquad \text{Clayton: } \lambda_L = 2^{-1/\theta}, \qquad \text{gaussiana: } \lambda_U = \lambda_L = 0
$$

- $\theta$: parámetro de la familia, $\theta \ge 1$ en Gumbel y $\theta > 0$ en Clayton.
- La gaussiana con correlación $\rho$, $|\rho| < 1$, no tiene dependencia de colas.
:::
