---
id: covarianza
titulo: Covarianza
titulo_en: Covariance
alias:
  - covarianza de dos variables aleatorias
  - momento mixto central
modulo: 1
submodulo: '1.4'
orden: 5
nivel: intermedio
prerrequisitos:
  - distribucion-conjunta
  - varianza
relaciones:
  - tipo: generaliza
    id: varianza
  - tipo: relacionado
    id: covarianza-muestral
etiquetas:
  - variación conjunta
  - signo de la relación
  - relación lineal
  - covarianza poblacional
resumen: >
  La covarianza mide si dos variables tienden a estar por encima de sus medias al mismo tiempo
  (positiva) o una por encima cuando la otra está por debajo (negativa). Es la esperanza del
  producto de sus desviaciones respecto a la media.
formula: '\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big] = \mathbb{E}[XY] - \mu_X \mu_Y'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: covarianza
    experimento: dos-dados
    variable: primero
    segunda: suma
referencias:
  - clave: blitzstein-hwang
    capitulo: '7.3'
  - clave: ross-probabilidad
    capitulo: '7.4'
publicado: true
---

## Intuición

Si la estatura y el peso de una persona se miden respecto a sus promedios, lo usual es que una persona más alta que el promedio también pese más que el promedio, y una más baja pese menos. El producto de las dos desviaciones es positivo en ambos casos. Cuando las variables se mueven en sentidos opuestos, como la altitud y la temperatura, el producto suele ser negativo.

La **covarianza** promedia ese producto sobre toda la distribución conjunta. Si dominan los productos positivos, es positiva; si dominan los negativos, es negativa; si se compensan, es cercana a cero. Geométricamente, las líneas por las medias dividen el plano en cuatro cuadrantes: arriba a la derecha y abajo a la izquierda suman, los otros dos restan.

## Definición

:::definicion[Covarianza]
Sean $X$ y $Y$ variables con medias $\mu_X$, $\mu_Y$ y varianzas finitas. Su **covarianza** es
$$
\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big].
$$
Desarrollando el producto,
$$
\operatorname{Cov}(X, Y) = \mathbb{E}[XY] - \mu_X \mu_Y.
$$
:::

En el caso discreto, $\operatorname{Cov}(X, Y) = \sum_x \sum_y (x - \mu_X)(y - \mu_Y)\, p(x, y)$; en el continuo, la suma se cambia por una integral doble con la densidad conjunta.

:::figura[La normal bivariada con correlación 0.6: las celdas de los cuadrantes de arriba a la derecha y abajo a la izquierda aportan mucho más que las otras dos, y la covarianza es 0.6. La deslizadera cambia la correlación del modelo.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
modelo: normal-bivariada
parametros:
  rho: 0.6
editable: true
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias.
- $\mu_X$, $\mu_Y$: sus medias.
- $\operatorname{Cov}(X, Y)$: covarianza.
- $(x - \mu_X)(y - \mu_Y)\, p(x, y)$: contribución de la casilla $(x, y)$.
- $\mathbb{E}[XY]$: esperanza del producto.
- $a$, $b$, $c$, $d$: constantes.
- $L$, $S$: días con lluvia y suspensión del ejemplo.
:::

## Cómo usar la visualización

La tabla del primer dado $X_1$ y la suma $S$ aparece con cada celda coloreada por el signo de su contribución $(x - \mu_X)(y - \mu_Y)\,p(x, y)$ e intensidad según su tamaño; el número escrito en cada celda es esa contribución. Las líneas punteadas pasan por las medias 3.5 y 7. La animación suma las columnas una por una y el encabezado lleva el total parcial; al final divide entre las desviaciones estándar para dar la correlación.

Casi toda la masa cae en los cuadrantes positivos, porque un primer dado grande hace grande la suma. La covarianza final es $35/12 \approx 2.917$, exactamente la varianza del primer dado.

## Ejemplo

Con los días con lluvia $L$ y la suspensión $S$ (tabla de las fichas anteriores):

1. Medias: $\mathbb{E}[L] = 0.8$ y $\mathbb{E}[S] = 0.45$.
2. $\mathbb{E}[LS]$ solo recibe aportes con $S = 1$: $1 \cdot 0.20 + 2 \cdot 0.15 = 0.50$.
3. $\operatorname{Cov}(L, S) = 0.50 - 0.8 \cdot 0.45 = 0.50 - 0.36 = 0.14$.
4. Es positiva: más lluvia acompaña a más suspensiones.

:::figura[La covarianza del ejemplo: las celdas $(0, 0)$ y $(2, 1)$ aportan positivo, las celdas $(0, 1)$ y $(2, 0)$ negativo, y el balance es 0.14.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
valoresX: [0, 1, 2]
valoresY: [0, 1]
probabilidades:
  - [0.30, 0.10]
  - [0.20, 0.20]
  - [0.05, 0.15]
nombreX: días con lluvia
nombreY: suspensión del partido
simboloX: L
simboloY: S
```
:::

## Propiedades

- **Simetría y varianza:** $\operatorname{Cov}(X, Y) = \operatorname{Cov}(Y, X)$ y $\operatorname{Cov}(X, X) = \operatorname{Var}(X)$.
- **Bilinealidad:** $\operatorname{Cov}(aX + b,\ cY + d) = ac\, \operatorname{Cov}(X, Y)$, y $\operatorname{Cov}(X + Z, Y) = \operatorname{Cov}(X, Y) + \operatorname{Cov}(Z, Y)$.
- **Varianza de la suma:** $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)$.
- **Independencia:** si $X$ y $Y$ son independientes, $\operatorname{Cov}(X, Y) = 0$.
- **Cota:** $|\operatorname{Cov}(X, Y)| \le \sigma_X \sigma_Y$, por la desigualdad de Cauchy y Schwarz.

:::figura[La densidad uniforme sobre el triángulo $0 < x < y < 1$: medias 1/3 y 2/3, $\mathbb{E}[XY] = 1/4$, y covarianza $1/4 - 2/9 = 1/36 \approx 0.028$.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
modelo: uniforme-triangulo
```
:::

## Errores comunes

- **Leer el tamaño de la covarianza como fuerza de la relación.** La covarianza cambia con las unidades: medir $X$ en centímetros en lugar de metros la multiplica por 100. Para comparar fuerza se usa la correlación.
- **Concluir independencia de una covarianza cero.** Solo se descarta la relación lineal; puede haber dependencia no lineal fuerte.
- **Olvidar el término cruzado.** $\operatorname{Var}(X + Y)$ no es la suma de varianzas si la covarianza no es cero.

:::figura[La misma correlación 0.6 con una desviación estándar de $X$ igual a 2: la covarianza se duplica a 1.2, aunque la relación no es más fuerte.]{componente="JointDistribution2D"}
```yaml
modo: covarianza
modelo: normal-bivariada
parametros:
  sigmaX: 2
  rho: 0.6
```
:::

## Conexiones

La covarianza generaliza la [[varianza]] a dos variables y se calcula con la [[distribucion-conjunta]]. Normalizada por las desviaciones estándar da la [[correlacion-de-pearson]], y reunida para varias variables forma la [[matriz-de-covarianza]]. Es cero bajo [[independencia-de-variables-aleatorias]], aunque la [[correlacion-cero-no-implica-independencia]]. Aparece en la varianza de la suma de variables aleatorias. Su versión con datos es la [[covarianza-muestral]].

## Formulario

:::formula[Definición]
$$
\operatorname{Cov}(X, Y) = \mathbb{E}\big[(X - \mu_X)(Y - \mu_Y)\big]
$$

- $\mu_X$, $\mu_Y$: medias de $X$ y $Y$.
:::

:::formula[Fórmula de cálculo]
$$
\operatorname{Cov}(X, Y) = \mathbb{E}[XY] - \mu_X \mu_Y
$$

- Esperanza del producto menos el producto de las medias.
:::

:::formula[Bilinealidad]
$$
\operatorname{Cov}(aX + b,\ cY + d) = ac\, \operatorname{Cov}(X, Y)
$$

- Las constantes aditivas no cuentan.
:::

:::formula[Varianza de una suma]
$$
\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)
$$

- El término cruzado desaparece si la covarianza es cero.
:::
