---
id: funcion-cuantil
titulo: Función cuantil
titulo_en: Quantile function
alias:
  - inversa de la función de distribución
  - inversa generalizada
  - función de percentiles
modulo: 1
submodulo: '1.3'
orden: 6
nivel: basico
prerrequisitos:
  - funcion-de-distribucion-acumulada
relaciones:
  - tipo: relacionado
    id: cuantiles-cuartiles-deciles-y-percentiles
  - tipo: relacionado
    id: muestreo-por-transformada-inversa
etiquetas:
  - cuantil
  - percentil
  - mediana
  - inversa generalizada
  - valor en riesgo
resumen: >
  La función cuantil responde la pregunta inversa a la función de distribución: dada una
  probabilidad p, da el menor valor que deja al menos esa probabilidad a su izquierda. La mediana
  es el cuantil de orden 1/2.
formula: 'Q(p) = \inf\{x \in \mathbb{R} : F(x) \ge p\}, \qquad 0 < p < 1'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: acumulada
    distribucion: normal
    x: 1.96
    p: 0.975
referencias:
  - clave: blitzstein-hwang
    capitulo: '5.3'
  - clave: wasserman
    capitulo: '2.3'
publicado: true
---

## Intuición

La función de distribución va de valores a probabilidades: dado $x$, dice qué fracción de la probabilidad queda a su izquierda. Muchas preguntas prácticas van al revés: ¿qué tiempo de entrega se cumple en el 90 % de los pedidos?, ¿qué pérdida solo se supera el 1 % de los días?, ¿qué estatura separa al 5 % más bajo? Cada una pide un valor a partir de una probabilidad, y eso es lo que da la **función cuantil**.

Gráficamente, se lee la función de distribución al revés: se sube por el eje vertical hasta la altura $p$, se avanza horizontalmente hasta tocar la curva y se baja al eje horizontal. El punto de llegada es $Q(p)$. Cuando la curva es continua y estrictamente creciente, esto es simplemente la función inversa. Cuando tiene escalones o tramos planos, hace falta una regla para elegir, y la convención es tomar el menor valor que alcanza la altura $p$.

## Definición

:::definicion[Función cuantil]
Sea $F$ la función de distribución de una variable aleatoria $X$. Su **función cuantil** es
$$
Q(p) = F^{-1}(p) = \inf\{x \in \mathbb{R} : F(x) \ge p\}, \qquad 0 < p < 1.
$$
El número $Q(p)$ es el **cuantil de orden $p$** de $X$; $Q(1/2)$ es la mediana y $Q(1/4)$, $Q(3/4)$ son los cuartiles.
:::

Si $F$ es continua y estrictamente creciente, $Q$ es su inversa usual y cumple $F(Q(p)) = p$. En general solo se garantiza $F(Q(p)) \ge p$.

:::figura[El cuantil 0.9 de la normal estándar: el valor 1.28 deja el 90 % del área a su izquierda.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
probabilidad: 0.9
vista: acumulada
```
:::

:::nota[Qué significa cada símbolo]
- $F$: función de distribución de $X$.
- $p$: probabilidad entre 0 y 1.
- $Q(p)$, $F^{-1}(p)$: cuantil de orden $p$.
- $\inf$: ínfimo, el mayor número que es menor o igual que todos los del conjunto.
- $\lambda$: tasa de la exponencial del ejemplo.
- $\ln$: logaritmo natural.
:::

## Cómo usar la visualización

La gráfica de abajo es la función de distribución normal estándar. La deslizadera de probabilidad fija la altura $p$, y la línea punteada viaja horizontalmente hasta la curva y baja al eje: el valor de llegada es $Q(p)$, que aparece en el panel. Con $p = 0.975$ el cuantil es cerca de 1.96, el número que aparece en los intervalos de confianza al 95 %.

Al bajar $p$ a 0.5 el cuantil llega a 0, la mediana. Al acercar $p$ a 1, el cuantil crece sin límite, porque la normal no tiene un valor máximo.

## Ejemplo

El tiempo de atención en una ventanilla es exponencial con media 2 minutos: $F(t) = 1 - e^{-t/2}$ para $t \ge 0$. Se quiere el tiempo que no se supera en el 90 % de los casos.

1. Se resuelve $F(t) = 0.9$: $1 - e^{-t/2} = 0.9$, es decir $e^{-t/2} = 0.1$.
2. $t = -2 \ln 0.1 = 2 \ln 10 \approx 4.61$ minutos.
3. En general, $Q(p) = -2 \ln(1 - p)$; la mediana es $Q(0.5) = 2 \ln 2 \approx 1.39$ minutos, menor que la media de 2.

:::figura[El ejemplo de la ventanilla: el cuantil 0.9 de la exponencial con media 2 es cerca de 4.61 minutos.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
distribucion: exponencial
parametros:
  lambda: 0.5
x: 4.6
p: 0.9
```
:::

## Propiedades

- **No decreciente:** si $p_1 < p_2$, entonces $Q(p_1) \le Q(p_2)$.
- **Inversa generalizada:** $Q(p) \le x$ si y solo si $p \le F(x)$. De aquí salen $F(Q(p)) \ge p$ y $Q(F(x)) \le x$.
- **Transformaciones crecientes:** si $g$ es creciente, el cuantil de $g(X)$ es $g(Q(p))$. En particular, el cuantil de $aX + b$ con $a > 0$ es $aQ(p) + b$.
- **Muestreo:** si $U$ es uniforme en $(0, 1)$, la variable $Q(U)$ tiene función de distribución $F$; es la base del muestreo por transformada inversa.

:::figura[La función cuantil en acción: cada número uniforme del eje vertical se lleva a la curva y se baja al eje horizontal, y los valores obtenidos siguen la distribución exponencial.]{componente="TransformationViz"}
```yaml
modo: transformada-inversa
distribucion: exponencial
parametros:
  lambda: 0.5
muestras: 400
```
:::

## Errores comunes

- **Esperar un cuantil único en variables discretas.** En un dado, $F(x) = 0.5$ para todo $x$ entre 3 y 4; cualquier valor de ese intervalo divide la masa a la mitad, y la convención elige $Q(0.5) = 3$.
- **Confundir el cuantil con la probabilidad.** El percentil 90 de un examen es una calificación, no el 90 %.
- **Promediar cuantiles de partes.** El cuantil de una mezcla de dos grupos no es el promedio de los cuantiles de cada grupo.

:::figura[En el dado la función de distribución es plana entre 3 y 4 a la altura 0.5. La línea punteada llega al primer punto del escalón, de modo que $Q(0.5) = 3$.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
experimento: dado
variable: valor
x: 3.5
p: 0.5
```
:::

## Conexiones

La función cuantil es la inversa generalizada de la [[funcion-de-distribucion-acumulada]]. Su versión con datos son los [[cuantiles-cuartiles-deciles-y-percentiles]], y el cuantil de orden 1/2 es la mediana estudiada en [[mediana-y-moda-de-una-distribucion]]. Aplicada a una uniforme produce cualquier distribución: es el [[muestreo-por-transformada-inversa]], cuyo reverso es la [[transformada-integral-de-probabilidad]]. La cola derecha, $1 - F$, es la [[funcion-de-supervivencia]], y los cuantiles altos se leen en ella.

## Formulario

:::formula[Definición]
$$
Q(p) = \inf\{x : F(x) \ge p\}, \qquad 0 < p < 1
$$

- Menor valor que acumula al menos $p$.
:::

:::formula[Equivalencia básica]
$$
Q(p) \le x \iff p \le F(x)
$$

- Vale para cualquier función de distribución.
:::

:::formula[Caso continuo y estrictamente creciente]
$$
F(Q(p)) = p, \qquad Q(F(x)) = x
$$

- $Q$ es la inversa usual de $F$.
:::

:::formula[Cuantil exponencial]
$$
Q(p) = -\frac{\ln(1 - p)}{\lambda}
$$

- Distribución exponencial con tasa $\lambda$.
:::
