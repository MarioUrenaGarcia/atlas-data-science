---
id: correlacion-de-pearson
titulo: Correlación de Pearson
titulo_en: Pearson correlation coefficient
alias:
  - coeficiente de correlación
  - correlación lineal
  - rho de Pearson
modulo: 1
submodulo: '1.4'
orden: 6
nivel: intermedio
prerrequisitos:
  - covarianza
  - desviacion-estandar
relaciones:
  - tipo: relacionado
    id: coeficiente-de-correlacion-de-pearson
  - tipo: relacionado
    id: desigualdad-de-cauchy-schwarz
etiquetas:
  - correlación
  - relación lineal
  - sin unidades
  - entre -1 y 1
resumen: >
  La correlación de Pearson es la covarianza dividida entre el producto de las desviaciones
  estándar. No tiene unidades, vale entre -1 y 1 y mide qué tan cerca está la relación entre dos
  variables de ser una recta.
formula: '\rho_{X,Y} = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\, \sigma_Y}, \qquad -1 \le \rho_{X,Y} \le 1'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: covarianza
    modelo: normal-bivariada
    parametros:
      rho: -0.4
    editable: true
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.3'
  - clave: degroot
    capitulo: '4.6'
publicado: true
---

## Intuición

La covarianza dice hacia dónde se mueven juntas dos variables, pero su tamaño depende de las unidades: la covarianza entre estatura y peso cambia si la estatura se mide en centímetros o en metros. Para comparar la fuerza de relaciones distintas hace falta una medida sin unidades.

La **correlación** se obtiene estandarizando ambas variables antes de calcular la covarianza: se mide cada una en desviaciones estándar respecto a su media. El resultado queda siempre entre $-1$ y $1$. Vale 1 cuando $Y$ es exactamente una función lineal creciente de $X$, $-1$ cuando es lineal decreciente, y valores cercanos a 0 cuando no hay una tendencia lineal. Mide linealidad, no cualquier tipo de relación.

## Definición

:::definicion[Correlación de Pearson]
Sean $X$ y $Y$ variables con varianzas positivas y finitas. Su **correlación** es
$$
\rho_{X,Y} = \operatorname{Corr}(X, Y) = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\, \sigma_Y} = \operatorname{Cov}\!\left(\frac{X - \mu_X}{\sigma_X},\ \frac{Y - \mu_Y}{\sigma_Y}\right).
$$
:::

Siempre $-1 \le \rho_{X,Y} \le 1$, y $|\rho_{X,Y}| = 1$ si y solo si existen constantes $a \ne 0$ y $b$ con $Y = aX + b$ con probabilidad 1; el signo de $\rho$ es el de $a$.

:::figura[El primer dado y la suma de dos dados: covarianza $35/12$, desviaciones estándar 1.708 y 2.415, y correlación $1/\sqrt{2} \approx 0.707$.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
experimento: dos-dados
variable: primero
segunda: suma
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $\mu_X$, $\mu_Y$: medias; $\sigma_X$, $\sigma_Y$: desviaciones estándar.
- $\operatorname{Cov}(X, Y)$: covarianza.
- $\rho_{X,Y}$, $\operatorname{Corr}(X, Y)$: correlación.
- $a$, $b$: constantes de una relación lineal.
- $H$: horas de estudio; $C$: calificación del ejemplo.
:::

## Cómo usar la visualización

La gráfica muestra una normal bivariada con correlación $-0.4$: las celdas de los cuadrantes de arriba a la izquierda y abajo a la derecha, que aportan negativo, dominan. La animación suma las columnas en la covarianza y, en el último paso, divide entre las dos desviaciones estándar para dar $\rho$.

La deslizadera cambia la correlación del modelo. Con $\rho = 0$ la nube es circular y los cuatro cuadrantes se equilibran; con $\rho$ cerca de 1 o de $-1$ la nube se aplasta sobre una recta y casi toda la masa queda en dos cuadrantes opuestos.

## Ejemplo

En un grupo, las horas de estudio $H$ (1, 2 o 3) y la calificación $C$ (6, 8 o 10) tienen la distribución conjunta de la figura.

1. Marginales: ambas valen 0.3, 0.4 y 0.3. Medias $\mu_H = 2$ y $\mu_C = 8$; varianzas $0.6$ y $2.4$.
2. Solo las celdas $(1, 6)$ y $(3, 10)$, con probabilidad 0.2 cada una, aportan a la covarianza: $(-1)(-2)(0.2) + (1)(2)(0.2) = 0.8$.
3. $\rho = 0.8 / \sqrt{0.6 \cdot 2.4} = 0.8 / 1.2 \approx 0.667$.

:::figura[El ejemplo de las horas de estudio: la diagonal concentra la probabilidad y la correlación es 2/3. Las celdas fuera de la diagonal aportan 0.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
valoresX: [1, 2, 3]
valoresY: [6, 8, 10]
probabilidades:
  - [0.2, 0.1, 0]
  - [0.1, 0.2, 0.1]
  - [0, 0.1, 0.2]
nombreX: horas de estudio
nombreY: calificación
simboloX: H
simboloY: C
```
:::

## Propiedades

- **Invariancia:** $\operatorname{Corr}(aX + b,\ cY + d) = \operatorname{sgn}(ac)\, \operatorname{Corr}(X, Y)$; cambiar unidades no la altera.
- **Cota:** $|\rho| \le 1$, consecuencia de la desigualdad de Cauchy y Schwarz.
- **Recta de mejor ajuste:** la recta $\hat{Y} = \mu_Y + \rho\, \dfrac{\sigma_Y}{\sigma_X}(X - \mu_X)$ minimiza el error cuadrático medio, y la fracción de varianza que explica es $\rho^2$.
- **Normal bivariada:** $\rho$ es su parámetro de dependencia, y $\rho = 0$ equivale a independencia en ese caso particular.

:::figura[Una relación lineal imperfecta: en el triángulo $0 < x < y < 1$ la covarianza es $1/36$, ambas varianzas valen $1/18$ y la correlación es exactamente 0.5.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
modelo: uniforme-triangulo
```
:::

## Errores comunes

- **Leer $\rho = 0$ como ausencia de relación.** Con $Y = X^2$ y $X$ simétrica, $Y$ está determinada por $X$ y la correlación es 0.
- **Interpretar $\rho$ como pendiente.** $\rho = 0.5$ no significa que $Y$ aumente media unidad por unidad de $X$; la pendiente es $\rho\, \sigma_Y / \sigma_X$.
- **Confundir correlación con causalidad.** Una correlación alta puede deberse a una causa común o a una relación inversa.

:::figura[Correlación cero con dependencia total: $X$ vale $-1$, 0 o 1 con probabilidad 1/3 y $Y = X^2$. Las dos contribuciones de la fila $Y = 1$ se cancelan y la covarianza es 0.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
valoresX: [-1, 0, 1]
valoresY: [0, 1]
probabilidades:
  - [0, 1]
  - [1, 0]
  - [0, 1]
```
:::

## Conexiones

La correlación es la [[covarianza]] de las variables estandarizadas con la [[desviacion-estandar]], y su cota $|\rho| \le 1$ es la [[desigualdad-de-cauchy-schwarz]]. La [[correlacion-cero-no-implica-independencia]] explica sus límites, y la [[matriz-de-covarianza]] reúne correlaciones y escalas de varias variables. Con datos se estima mediante el [[coeficiente-de-correlacion-de-pearson]] muestral, y la [[correlacion-no-implica-causalidad]] advierte sobre su interpretación.

## Formulario

:::formula[Correlación]
$$
\rho_{X,Y} = \frac{\operatorname{Cov}(X, Y)}{\sigma_X\, \sigma_Y}
$$

- Covarianza entre el producto de desviaciones estándar.
:::

:::formula[Cota]
$$
-1 \le \rho_{X,Y} \le 1, \qquad |\rho_{X,Y}| = 1 \iff Y = aX + b
$$

- Con probabilidad 1 y $a \ne 0$.
:::

:::formula[Invariancia ante cambios de escala]
$$
\operatorname{Corr}(aX + b,\ cY + d) = \operatorname{sgn}(ac)\, \operatorname{Corr}(X, Y)
$$

- $\operatorname{sgn}$: signo del producto $ac$.
:::

:::formula[Mejor predicción lineal]
$$
\hat{Y} = \mu_Y + \rho\, \frac{\sigma_Y}{\sigma_X}\, (X - \mu_X)
$$

- Explica una fracción $\rho^2$ de la varianza de $Y$.
:::
