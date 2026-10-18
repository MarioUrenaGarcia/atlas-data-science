---
id: correlacion-cero-no-implica-independencia
titulo: Correlación cero no implica independencia
titulo_en: Uncorrelated does not imply independent
alias:
  - variables no correlacionadas
  - dependencia no lineal
  - covarianza cero sin independencia
modulo: 1
submodulo: '1.4'
orden: 7
nivel: intermedio
prerrequisitos:
  - correlacion-de-pearson
  - independencia-de-variables-aleatorias
relaciones:
  - tipo: contrasta
    id: independencia-de-variables-aleatorias
  - tipo: relacionado
    id: correlacion-de-distancia
etiquetas:
  - no correlacionadas
  - dependencia no lineal
  - simetría
  - normal bivariada
resumen: >
  Dos variables independientes tienen correlación cero, pero dos variables con correlación cero
  pueden ser fuertemente dependientes: la correlación solo detecta relaciones lineales. La
  excepción importante es la normal bivariada.
formula: 'X, Y \text{ independientes} \ \Rightarrow\ \operatorname{Cov}(X, Y) = 0, \qquad \operatorname{Cov}(X, Y) = 0 \ \not\Rightarrow\ X, Y \text{ independientes}'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: independencia
    valoresX: [-1, 0, 1]
    valoresY: [0, 1]
    probabilidades:
      - [0, 1]
      - [1, 0]
      - [0, 1]
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.3'
  - clave: wasserman
    capitulo: '3.3'
publicado: true
---

## Intuición

Si $X$ toma los valores $-1$, 0 y 1 con la misma probabilidad y $Y = X^2$, entonces $Y$ está completamente determinada por $X$: no hay dependencia más fuerte que esa. Sin embargo, la correlación entre ellas es 0. La razón es la simetría: cuando $X$ crece de $-1$ a 0, $Y$ baja; cuando crece de 0 a 1, $Y$ sube. Una recta no puede describir esa relación en forma de U, y las contribuciones positivas y negativas a la covarianza se cancelan.

La covarianza y la correlación miden solo la parte **lineal** de la relación. La independencia, en cambio, exige que ninguna información sobre $X$ cambie la distribución de $Y$. Por eso la implicación va en un solo sentido: independencia implica correlación cero, pero no al revés.

## Definición

:::teorema[Relación entre independencia y correlación]
Si $X$ y $Y$ son independientes con varianzas finitas, entonces $\operatorname{Cov}(X, Y) = 0$. El recíproco es falso: existen variables con $\operatorname{Cov}(X, Y) = 0$ que no son independientes. Las variables con covarianza cero se llaman **no correlacionadas**.
:::

Hay una excepción importante: si $(X, Y)$ tiene distribución normal bivariada, correlación cero sí implica independencia, porque la densidad conjunta con $\rho = 0$ se factoriza en el producto de dos normales.

:::figura[Otro ejemplo de covarianza cero: $X$ vale $-2$, $-1$, 1 o 2 con probabilidad 1/4 y $Y = |X|$. Las contribuciones de los valores negativos de $X$ cancelan exactamente las de los positivos.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
valoresX: [-2, -1, 1, 2]
valoresY: [1, 2]
probabilidades:
  - [0, 1]
  - [1, 0]
  - [1, 0]
  - [0, 1]
simboloY: Y
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $\operatorname{Cov}(X, Y)$: covarianza.
- $\rho$: correlación.
- $|X|$: valor absoluto de $X$.
- $P(X = 0,\ Y = 1)$: probabilidad conjunta de un par de valores.
- $g$, $h$: funciones de $X$ y de $Y$.
:::

## Cómo usar la visualización

Los tres paneles muestran la conjunta de $X$ y $Y = X^2$, el producto de sus marginales y la diferencia. La conjunta tiene probabilidad solo en $(-1, 1)$, $(0, 0)$ y $(1, 1)$; el producto de marginales reparte probabilidad en las seis celdas. El panel de diferencias se llena: positivo donde está la conjunta y negativo en las otras celdas. El panel de lecturas confirma que la covarianza es 0 y que las variables son dependientes.

## Ejemplo

$X$ uniforme en $\{-1, 0, 1\}$ y $Y = X^2$.

1. $\mathbb{E}[X] = 0$ y $\mathbb{E}[XY] = \mathbb{E}[X^3] = \tfrac{1}{3}(-1 + 0 + 1) = 0$.
2. $\operatorname{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\,\mathbb{E}[Y] = 0 - 0 = 0$.
3. Pero $P(X = 0,\ Y = 1) = 0$, mientras que $P(X = 0)\,P(Y = 1) = \tfrac{1}{3} \cdot \tfrac{2}{3} = \tfrac{2}{9}$.
4. Las variables son dependientes: saber que $X = 0$ obliga a $Y = 0$.

:::figura[Condicionar en $X = 0$ cambia por completo la distribución de $Y$: queda toda la masa en $Y = 0$, cuando la marginal, punteada, da 2/3 a $Y = 1$.]{componente="JointDistribution2D"}
```yaml
modo: condicional
valoresX: [-1, 0, 1]
valoresY: [0, 1]
probabilidades:
  - [0, 1]
  - [1, 0]
  - [0, 1]
x: 0
```
:::

## Propiedades

- **Implicación válida:** independencia implica $\mathbb{E}[g(X)\,h(Y)] = \mathbb{E}[g(X)]\,\mathbb{E}[h(Y)]$ para todas las funciones $g$ y $h$; la correlación cero solo lo pide para $g(x) = x$, $h(y) = y$.
- **Caracterización:** $X$ y $Y$ son independientes si y solo si $g(X)$ y $h(Y)$ son no correlacionadas para todas las funciones acotadas $g$, $h$.
- **Normal bivariada:** con $\rho = 0$, $f(x, y) = f_X(x)\, f_Y(y)$, y las variables son independientes.
- **Normales por separado no bastan:** dos variables con marginales normales y correlación cero pueden ser dependientes si su conjunta no es normal bivariada.

:::figura[La normal bivariada con correlación 0: la conjunta coincide con el producto de sus marginales en todas las celdas, y en este caso particular no correlacionadas sí significa independientes.]{componente="JointDistribution2D"}
```yaml
modo: independencia
modelo: normal-bivariada
parametros:
  rho: 0
```
:::

## Errores comunes

- **Concluir que no hay relación porque la correlación es cero.** Relaciones en forma de U, cíclicas o de varianza cambiante pasan inadvertidas para la correlación.
- **Aplicar la excepción normal a cualquier par de normales.** Se necesita que el par completo sea normal bivariado, no solo cada coordenada.
- **Usar la correlación para medir dependencia general.** Para eso existen medidas como la correlación de distancia o la información mutua, que son cero solo bajo independencia.

:::figura[La media condicional de $Y = X^2$ no es constante: vale 1 en $x = \pm 1$ y 0 en $x = 0$, una curva en V que la recta de la correlación no puede seguir.]{componente="JointDistribution2D"}
```yaml
modo: esperanza-condicional
valoresX: [-1, 0, 1]
valoresY: [0, 1]
probabilidades:
  - [0, 1]
  - [1, 0]
  - [0, 1]
x: 1
```
:::

## Conexiones

Este resultado marca la diferencia entre la [[independencia-de-variables-aleatorias]] y la ausencia de [[covarianza]] o de [[correlacion-de-pearson]]. La dependencia no lineal se ve en la [[esperanza-condicional]], que cambia con $x$ aunque la correlación sea cero. Con datos, la [[correlacion-de-distancia]] y la [[informacion-mutua-empirica]] detectan relaciones que la correlación de Pearson no ve.

## Formulario

:::formula[Implicación válida]
$$
X, Y \text{ independientes} \ \Rightarrow\ \operatorname{Cov}(X, Y) = 0
$$

- Requiere varianzas finitas.
:::

:::formula[Contraejemplo]
$$
X \sim \mathrm{U}\{-1, 0, 1\},\ Y = X^2 \ \Rightarrow\ \operatorname{Cov}(X, Y) = \mathbb{E}[X^3] = 0
$$

- Y sin embargo $Y$ es función de $X$.
:::

:::formula[Caracterización de la independencia]
$$
\mathbb{E}[g(X)\,h(Y)] = \mathbb{E}[g(X)]\,\mathbb{E}[h(Y)] \ \text{para todas } g, h \text{ acotadas}
$$

- La correlación cero solo lo exige para funciones lineales.
:::
