---
id: ley-de-la-varianza-total
titulo: Ley de la varianza total
titulo_en: Law of total variance
alias:
  - fórmula de Eve
  - descomposición de la varianza
  - varianza explicada y no explicada
modulo: 1
submodulo: '1.4'
orden: 11
nivel: intermedio
prerrequisitos:
  - ley-de-la-esperanza-total
  - varianza
relaciones:
  - tipo: relacionado
    id: esperanza-condicional
etiquetas:
  - descomposición de la varianza
  - entre grupos
  - dentro de grupos
  - varianza explicada
resumen: >
  La varianza de Y se divide en dos partes: la varianza de las medias condicionales, que es la parte
  explicada por X, y la media de las varianzas condicionales, que es la dispersión que queda dentro
  de cada valor de X.
formula: '\operatorname{Var}(Y) = \operatorname{Var}\big(\mathbb{E}[Y \mid X]\big) + \mathbb{E}\big[\operatorname{Var}(Y \mid X)\big]'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: varianza-total
    experimento: dos-dados
    variable: maximo
    segunda: suma
referencias:
  - clave: blitzstein-hwang
    capitulo: '9.5'
  - clave: ross-probabilidad
    capitulo: '7.5'
publicado: true
---

## Intuición

Las calificaciones de un examen varían por dos razones: hay escuelas con promedios distintos, y dentro de cada escuela los estudiantes difieren entre sí. La **ley de la varianza total** dice que la varianza de todas las calificaciones es exactamente la suma de esas dos fuentes: la varianza **entre** grupos (cuánto difieren los promedios de las escuelas) más la varianza promedio **dentro** de los grupos.

Si los grupos los define una variable $X$, la primera parte es la variabilidad que $X$ explica: si se conoce $X$, se conoce la media de su grupo. La segunda parte es la que $X$ no puede explicar. Esta división es la base del análisis de varianza y del coeficiente de determinación en regresión.

## Definición

:::teorema[Ley de la varianza total]
Si $\operatorname{Var}(Y) < \infty$, entonces
$$
\operatorname{Var}(Y) = \operatorname{Var}\big(\mathbb{E}[Y \mid X]\big) + \mathbb{E}\big[\operatorname{Var}(Y \mid X)\big],
$$
donde $\operatorname{Var}(Y \mid X = x) = \mathbb{E}\big[(Y - \mathbb{E}[Y \mid X = x])^2 \mid X = x\big]$ es la varianza de la distribución condicional.
:::

La prueba escribe $Y - \mu_Y = \big(Y - \mathbb{E}[Y \mid X]\big) + \big(\mathbb{E}[Y \mid X] - \mu_Y\big)$, eleva al cuadrado y usa la ley de la esperanza total; el término cruzado tiene media cero.

:::figura[El primer dado y la suma: la media condicional $x + 3.5$ varía tanto como el primer dado, $35/12$, y dentro de cada valor queda la varianza del segundo dado, también $35/12$. La suma es $35/6 \approx 5.833$.]{componente="JointDistribution2D"}
```yaml
modo: varianza-total
experimento: dos-dados
variable: primero
segunda: suma
```
:::

:::nota[Qué significa cada símbolo]
- $\mathbb{E}[Y \mid X]$: media condicional, variable aleatoria.
- $\operatorname{Var}(Y \mid X = x)$: varianza de $Y$ dentro del caso $X = x$.
- $\operatorname{Var}(\mathbb{E}[Y \mid X])$: varianza entre casos, la parte explicada por $X$.
- $\mathbb{E}[\operatorname{Var}(Y \mid X)]$: varianza promedio dentro de los casos.
- $\mu_Y$: media de $Y$.
- $\rho$: correlación de la normal bivariada.
- $\eta^2$: fracción de la varianza explicada por $X$.
- $N$: número aleatorio de sumandos; $Y_i$: sumandos idénticos.
- $G$, $R$: grupo de edad y reclamaciones del ejemplo.
:::

## Cómo usar la visualización

Cada punto es la media de la suma de dos dados para un valor del mayor $M$, y la barra vertical cubre una desviación estándar condicional. La animación acumula primero la media total, y en el último paso la barra de abajo divide la varianza de la suma en sus dos partes. El encabezado escribe la descomposición con los números.

Los puntos están muy separados (la media de la suma crece mucho con el mayor) y las barras son cortas, así que la parte explicada, 4.32, es casi tres veces la no explicada, 1.52.

## Ejemplo

En la aseguradora con tres grupos de edad $G$ (probabilidades 0.2, 0.5 y 0.3), las reclamaciones $R$ tienen medias 0.7, 0.25 y 0.4 y varianzas 0.61, 0.2875 y 0.44 en cada grupo; la media total es 0.385.

1. Dentro de los grupos: $\mathbb{E}[\operatorname{Var}(R \mid G)] = 0.2 \cdot 0.61 + 0.5 \cdot 0.2875 + 0.3 \cdot 0.44 = 0.3978$.
2. Entre grupos: $\operatorname{Var}(\mathbb{E}[R \mid G]) = 0.2 \cdot 0.315^2 + 0.5 \cdot 0.135^2 + 0.3 \cdot 0.015^2 = 0.0290$.
3. Total: $\operatorname{Var}(R) = 0.0290 + 0.3978 = 0.4268$.
4. El grupo de edad explica solo cerca del 6.8 % de la varianza: la mayor parte de la incertidumbre está dentro de cada grupo.

:::figura[El ejemplo de la aseguradora: las medias de los grupos están cerca entre sí y las barras de dispersión son largas, así que la parte explicada por la edad es pequeña.]{componente="JointDistribution2D"}
```yaml
modo: varianza-total
valoresX: [1, 2, 3]
valoresY: [0, 1, 2]
probabilidades:
  - [0.10, 0.06, 0.04]
  - [0.40, 0.075, 0.025]
  - [0.21, 0.06, 0.03]
nombreX: grupo de edad
nombreY: reclamaciones al año
simboloX: G
simboloY: R
```
:::

## Propiedades

- **Fracción explicada:** $\eta^2 = \operatorname{Var}(\mathbb{E}[Y \mid X]) / \operatorname{Var}(Y)$ está entre 0 y 1; vale 0 si la media de $Y$ no depende de $X$ y 1 si $Y$ es función de $X$.
- **Normal bivariada:** la parte explicada es $\rho^2 \operatorname{Var}(Y)$ y la no explicada $(1 - \rho^2)\operatorname{Var}(Y)$.
- **Independencia:** si $X$ y $Y$ son independientes, $\mathbb{E}[Y \mid X]$ es constante y toda la varianza queda dentro de los grupos.
- **Sumas aleatorias:** con $N$ independiente de las $Y_i$ idénticas, $\operatorname{Var}\big(\sum_{i=1}^{N} Y_i\big) = \mathbb{E}[N]\operatorname{Var}(Y_1) + (\mathbb{E}[Y_1])^2 \operatorname{Var}(N)$.

:::figura[Con la densidad $4xy$, que hace independientes a $X$ y $Y$, todas las medias condicionales coinciden: la parte explicada es 0 y toda la barra de abajo es varianza dentro de los grupos.]{componente="JointDistribution2D"}
```yaml
modo: varianza-total
modelo: producto-xy
```
:::

## Errores comunes

- **Sumar varianzas sin ponderar.** La parte de dentro de los grupos es un promedio ponderado por $P(X = x)$, no una suma simple.
- **Omitir la parte entre grupos.** Promediar las varianzas de cada grupo subestima la varianza total cuando las medias de los grupos difieren.
- **Confundir explicada con causada.** Que $X$ explique una gran fracción de la varianza de $Y$ no indica que $X$ la cause.

:::figura[En la normal bivariada con correlación 0.8 la parte explicada es $0.8^2 = 0.64$ y la no explicada 0.36: la barra de abajo reparte la varianza unitaria en esas proporciones.]{componente="JointDistribution2D"}
```yaml
modo: varianza-total
modelo: normal-bivariada
parametros:
  rho: 0.8
```
:::

## Conexiones

La ley de la varianza total acompaña a la [[ley-de-la-esperanza-total]] y descompone la [[varianza]] usando la [[esperanza-condicional]] y la [[distribucion-condicional]]. En la normal bivariada la fracción explicada es el cuadrado de la [[correlacion-de-pearson]]. Es el fundamento de la descomposición de la variabilidad en análisis de varianza y en regresión.

## Formulario

:::formula[Ley de la varianza total]
$$
\operatorname{Var}(Y) = \operatorname{Var}\big(\mathbb{E}[Y \mid X]\big) + \mathbb{E}\big[\operatorname{Var}(Y \mid X)\big]
$$

- Entre grupos más dentro de grupos.
:::

:::formula[Varianza condicional]
$$
\operatorname{Var}(Y \mid X = x) = \mathbb{E}[Y^2 \mid X = x] - \big(\mathbb{E}[Y \mid X = x]\big)^2
$$

- Varianza de la distribución condicional.
:::

:::formula[Fracción explicada]
$$
\eta^2 = \frac{\operatorname{Var}\big(\mathbb{E}[Y \mid X]\big)}{\operatorname{Var}(Y)}
$$

- En la normal bivariada, $\eta^2 = \rho^2$.
:::

:::formula[Suma aleatoria]
$$
\operatorname{Var}\Big(\sum_{i=1}^{N} Y_i\Big) = \mathbb{E}[N]\operatorname{Var}(Y_1) + (\mathbb{E}[Y_1])^2 \operatorname{Var}(N)
$$

- $N$ independiente de las $Y_i$, idénticas.
:::
