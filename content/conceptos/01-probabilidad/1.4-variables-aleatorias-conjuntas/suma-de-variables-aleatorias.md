---
id: suma-de-variables-aleatorias
titulo: Suma de variables aleatorias
titulo_en: Sum of random variables
alias:
  - distribución de la suma
  - suma de dos variables
  - X + Y
modulo: 1
submodulo: '1.4'
orden: 12
nivel: intermedio
prerrequisitos:
  - distribucion-conjunta
  - propiedades-de-la-varianza
relaciones:
  - tipo: relacionado
    id: convolucion-de-distribuciones
  - tipo: relacionado
    id: linealidad-de-la-esperanza
etiquetas:
  - suma
  - diagonales de la tabla
  - media y varianza de una suma
  - agregación
resumen: >
  La distribución de X + Y se obtiene de la distribución conjunta sumando las probabilidades de los
  pares sobre cada diagonal x + y = s. Su media es siempre la suma de las medias, y su varianza
  incluye el término de covarianza.
formula: 'P(X + Y = s) = \sum_x p(x,\ s - x), \qquad \operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: suma
    experimento: dos-dados
    variable: primero
    segunda: segundo
    s: 7
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.2'
  - clave: ross-probabilidad
    capitulo: '6.3'
publicado: true
---

## Intuición

Muchas cantidades de interés son sumas: el total de ventas de dos sucursales, el tiempo de un trayecto con dos tramos, la puntuación de dos dados. Para conocer la distribución de la suma no basta con conocer cada sumando por separado; hay que saber cómo se combinan, es decir, la distribución conjunta.

En la tabla conjunta, los pares con la misma suma $s$ forman una **diagonal**: $(1, 6), (2, 5), \dots, (6, 1)$ suman 7. La probabilidad de que la suma valga $s$ es la suma de las probabilidades de esa diagonal. Recorriendo todas las diagonales se obtiene la distribución completa de $X + Y$. Para la media hay un atajo que nunca falla, la linealidad; para la varianza hay que corregir con la covarianza.

## Definición

:::definicion[Distribución de una suma]
Si $(X, Y)$ es discreto con masa conjunta $p$, la variable $S = X + Y$ tiene masa
$$
p_S(s) = \sum_x p(x,\ s - x).
$$
Si tiene densidad conjunta $f$, la densidad de la suma es
$$
f_S(s) = \int_{-\infty}^{\infty} f(x,\ s - x)\,dx.
$$
:::

Cuando $X$ y $Y$ son independientes, $p(x, s - x) = p_X(x)\,p_Y(s - x)$ y la fórmula se convierte en la convolución de las marginales.

:::figura[Dos tiempos de espera exponenciales independientes con media 1: la diagonal $x + y = 2$ cruza la densidad conjunta, y la densidad de la suma en $s = 2$ es $2e^{-2} \approx 0.271$.]{componente="JointDistribution2D"}
```yaml
modo: suma
modelo: exponenciales-independientes
s: 2
```
:::

:::nota[Qué significa cada símbolo]
- $X$, $Y$: sumandos; $S = X + Y$: la suma.
- $p(x, y)$, $f(x, y)$: masa o densidad conjunta.
- $p_S$, $f_S$: masa o densidad de la suma.
- $p(x,\ s - x)$: probabilidad del par de la diagonal que empieza en $x$.
- $\operatorname{Cov}(X, Y)$: covarianza; $\rho$: correlación.
- $M$, $T$: clientes de la mañana y de la tarde del ejemplo.
:::

## Cómo usar la visualización

A la izquierda está la tabla de dos dados con la diagonal $x + y = s$ resaltada; a la derecha se construye la distribución de la suma. La deslizadera elige $s$ y el encabezado suma las probabilidades de las casillas de su diagonal. Con $s = 7$ la diagonal es la más larga, seis casillas de 1/36, y $P(S = 7) = 1/6$.

El botón de reproducción barre $s$ desde 2 hasta 12 y deja depositada cada barra: la forma triangular de la suma de dos dados aparece porque las diagonales crecen hasta el centro y luego se acortan.

## Ejemplo

En una cafetería, $M$ y $T$ son los clientes que llegan en un intervalo de la mañana y en uno de la tarde, con la tabla conjunta de la figura.

1. $P(M + T = 2) = p(0, 2) + p(1, 1) + p(2, 0) = 0 + 0.3 + 0 = 0.3$.
2. La distribución completa de la suma es 0.15, 0.15, 0.3, 0.2 y 0.2 para 0, 1, 2, 3 y 4.
3. $\mathbb{E}[M + T] = 0.15 + 0.6 + 0.6 + 0.8 = 2.15$, que coincide con $\mathbb{E}[M] + \mathbb{E}[T] = 1.1 + 1.05$.

:::figura[El ejemplo de la cafetería: la diagonal $s = 2$ solo toca una casilla con probabilidad positiva, la del centro, con 0.3.]{componente="JointDistribution2D"}
```yaml
modo: suma
valoresX: [0, 1, 2]
valoresY: [0, 1, 2]
probabilidades:
  - [0.15, 0.05, 0]
  - [0.10, 0.30, 0.10]
  - [0, 0.10, 0.20]
nombreX: clientes de la mañana
nombreY: clientes de la tarde
simboloX: M
simboloY: T
s: 2
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X + Y] = \mathbb{E}[X] + \mathbb{E}[Y]$, con o sin independencia.
- **Varianza:** $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)$; se reduce a la suma de varianzas bajo independencia.
- **Muchos sumandos:** $\operatorname{Var}\big(\sum_i X_i\big) = \sum_i \operatorname{Var}(X_i) + 2\sum_{i < j} \operatorname{Cov}(X_i, X_j)$.
- **Familias cerradas:** la suma de normales independientes es normal, la de Poisson independientes es Poisson y la de binomiales independientes con la misma $p$ es binomial.
- **La conjunta importa:** dos pares con las mismas marginales pueden dar sumas con distribuciones distintas.

:::figura[El mayor más el menor de dos dados: son variables dependientes, pero su suma es exactamente la suma de los dos dados, y su distribución es la misma que la de la figura principal.]{componente="JointDistribution2D"}
```yaml
modo: suma
experimento: dos-dados
variable: maximo
segunda: minimo
s: 7
```
:::

## Errores comunes

- **Sumar varianzas de variables dependientes.** Con correlación negativa la suma varía menos que sus partes; con correlación positiva, más.
- **Sumar distribuciones como si fueran números.** La distribución de $X + Y$ no es la suma de las funciones de masa; se obtiene recorriendo diagonales.
- **Suponer que la suma conserva la forma.** La suma de dos uniformes independientes es triangular, no uniforme.

:::figura[Normales estándar con correlación $-0.8$: la suma tiene varianza $1 + 1 - 1.6 = 0.4$, mucho menor que 2, y su distribución es una campana angosta.]{componente="JointDistribution2D"}
```yaml
modo: suma
modelo: normal-bivariada
parametros:
  rho: -0.8
s: 0
```
:::

## Conexiones

La distribución de la suma se lee en la [[distribucion-conjunta]], y bajo [[independencia-de-variables-aleatorias]] se convierte en la [[convolucion-de-distribuciones]]. Su media sigue la [[linealidad-de-la-esperanza]] y su varianza usa la [[covarianza]], como en [[propiedades-de-la-varianza]]. Las sumas de muchas variables independientes son el objeto del [[teorema-central-del-limite]] y de la [[ley-debil-de-los-grandes-numeros]].

## Formulario

:::formula[Suma discreta]
$$
p_S(s) = \sum_x p(x,\ s - x)
$$

- Suma sobre la diagonal $x + y = s$.
:::

:::formula[Suma continua]
$$
f_S(s) = \int_{-\infty}^{\infty} f(x,\ s - x)\,dx
$$

- Integral de la densidad conjunta sobre la recta $x + y = s$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X + Y] = \mathbb{E}[X] + \mathbb{E}[Y], \qquad \operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) + 2\operatorname{Cov}(X, Y)
$$

- La media no necesita independencia; la varianza usa la covarianza.
:::
