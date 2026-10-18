---
id: convolucion-de-distribuciones
titulo: Convolución de distribuciones
titulo_en: Convolution of distributions
alias:
  - convolución
  - suma de variables independientes
  - producto de convolución
modulo: 1
submodulo: '1.4'
orden: 13
nivel: intermedio
prerrequisitos:
  - suma-de-variables-aleatorias
  - independencia-de-variables-aleatorias
relaciones:
  - tipo: caso-particular
    id: suma-de-variables-aleatorias
  - tipo: relacionado
    id: funcion-generadora-de-momentos
etiquetas:
  - convolución
  - suma de independientes
  - densidad de la suma
  - familias cerradas
resumen: >
  La convolución es la operación que da la distribución de la suma de dos variables independientes
  a partir de sus marginales: se recorren todas las maneras de partir s en x más s - x y se suman
  los productos de sus probabilidades.
formula: '(p_X * p_Y)(s) = \sum_x p_X(x)\, p_Y(s - x), \qquad (f_X * f_Y)(s) = \int_{-\infty}^{\infty} f_X(x)\, f_Y(s - x)\,dx'
visualizacion:
  componente: JointDistribution2D
  parametros:
    modo: suma
    modelo: producto-xy
    s: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '8.2'
  - clave: ross-probabilidad
    capitulo: '6.3'
publicado: true
---

## Intuición

Si $X$ y $Y$ son independientes, su distribución conjunta es el producto de las marginales y no hace falta guardarla aparte: basta con las dos distribuciones individuales. La distribución de la suma se obtiene entonces de una operación entre ellas, la **convolución**: para cada valor $s$ se consideran todas las maneras de repartirlo como $x$ más $s - x$, se multiplica la probabilidad de cada parte y se suman los productos.

Visualmente es lo mismo que recorrer la diagonal $x + y = s$ de la tabla conjunta, solo que cada casilla ya se sabe que vale $p_X(x)\, p_Y(s - x)$. Para densidades, la suma se convierte en integral. La convolución tiende a suavizar: la suma de dos uniformes es un triángulo, la de tres ya parece una campana, y ese suavizado repetido es lo que lleva al teorema central del límite.

## Definición

:::definicion[Convolución]
Si $X$ y $Y$ son independientes y discretas, la masa de $S = X + Y$ es la **convolución** de sus masas:
$$
p_S(s) = (p_X * p_Y)(s) = \sum_x p_X(x)\, p_Y(s - x).
$$
Si son independientes con densidades $f_X$ y $f_Y$,
$$
f_S(s) = (f_X * f_Y)(s) = \int_{-\infty}^{\infty} f_X(x)\, f_Y(s - x)\,dx.
$$
:::

La convolución es conmutativa y asociativa, de modo que la distribución de $X_1 + \dots + X_n$ independientes es la convolución de las $n$ marginales, en cualquier orden.

:::figura[Dos dados de cuatro caras independientes: cada casilla vale 1/16 y la diagonal $s = 5$ tiene cuatro casillas, así que $P(S = 5) = 4/16 = 0.25$.]{componente="JointDistribution2D"}
```yaml
modo: suma
valoresX: [1, 2, 3, 4]
valoresY: [1, 2, 3, 4]
probabilidades:
  - [1, 1, 1, 1]
  - [1, 1, 1, 1]
  - [1, 1, 1, 1]
  - [1, 1, 1, 1]
nombreX: el primer dado de cuatro caras
nombreY: el segundo dado de cuatro caras
s: 5
```
:::

:::nota[Qué significa cada símbolo]
- $p_X$, $p_Y$: masas marginales; $f_X$, $f_Y$: densidades marginales.
- $*$: operación de convolución.
- $S = X + Y$: la suma.
- $s - x$: valor que debe tomar $Y$ para que la suma sea $s$ cuando $X = x$.
- $\lambda$: tasa de las exponenciales; $\mathcal{N}(\mu, \sigma^2)$: distribución normal con media $\mu$ y varianza $\sigma^2$.
- $M_X(t) = \mathbb{E}[e^{tX}]$: función generadora de momentos de $X$, con $\mathbb{E}$ la esperanza y $t$ su argumento.
:::

## Cómo usar la visualización

La densidad conjunta es $4xy$ sobre el cuadrado unitario, el producto de dos marginales $2x$ independientes. La diagonal $x + y = s$ cruza el cuadrado; la densidad de la suma en $s$ es la integral de la conjunta a lo largo de esa diagonal, y se deposita en la gráfica de la derecha. Con $s = 1$ vale $\int_0^1 2x \cdot 2(1 - x)\,dx = 2/3$.

La deslizadera mueve $s$ entre 0 y 2. Al recorrerlo, la densidad de la suma sube como $\tfrac{2}{3}s^3$ hasta $s = 1$ y luego tiene su máximo cerca de $s = 1.4$, donde la diagonal pasa por la zona más oscura.

## Ejemplo

Dos llamadas independientes duran $X$ y $Y$ minutos, exponenciales con tasa $\lambda = 2$ (media de medio minuto).

1. $f_S(s) = \int_0^s 2e^{-2x}\, 2e^{-2(s - x)}\,dx = 4e^{-2s} \int_0^s dx = 4s\,e^{-2s}$ para $s \ge 0$.
2. Es una gamma con forma 2 y tasa 2. En $s = 1$: $f_S(1) = 4e^{-2} \approx 0.541$.
3. $P(S \le 1) = 1 - e^{-2}(1 + 2) \approx 1 - 0.406 = 0.594$.

:::figura[El ejemplo de las llamadas: la densidad conjunta $4e^{-2(x + y)}$ es constante sobre cada diagonal, y la densidad de la suma en $s = 1$ es cerca de 0.541. La figura evalúa la densidad sobre una rejilla, por lo que el encabezado muestra valores ligeramente redondeados, como 0.99 y 0.547.]{componente="JointDistribution2D"}
```yaml
modo: suma
modelo: exponenciales-independientes
parametros:
  lambda: 2
s: 1
```
:::

## Propiedades

- **Familias cerradas:** $\mathcal{N}(\mu_1, \sigma_1^2) * \mathcal{N}(\mu_2, \sigma_2^2) = \mathcal{N}(\mu_1 + \mu_2,\ \sigma_1^2 + \sigma_2^2)$; Poisson con medias $\lambda_1$ y $\lambda_2$ da Poisson con media $\lambda_1 + \lambda_2$; binomiales con la misma $p$ suman sus ensayos.
- **Transformadas:** la convolución se convierte en producto con las funciones generadoras: $M_{X+Y}(t) = M_X(t)\, M_Y(t)$.
- **Suavizado:** la convolución de dos densidades es al menos tan regular como la más regular de ellas, y repetida tiende a la normal.
- **Media y varianza:** se suman, sin términos cruzados, porque los sumandos son independientes.

:::figura[Dos binomiales independientes con 2 ensayos y $p = 1/2$: la convolución da la binomial con 4 ensayos, con $P(S = 2) = 6/16 = 0.375$.]{componente="JointDistribution2D"}
```yaml
modo: suma
valoresX: [0, 1, 2]
valoresY: [0, 1, 2]
probabilidades:
  - [0.0625, 0.125, 0.0625]
  - [0.125, 0.25, 0.125]
  - [0.0625, 0.125, 0.0625]
s: 2
```
:::

## Errores comunes

- **Aplicar la convolución a variables dependientes.** La fórmula usa el producto de marginales; si las variables están relacionadas, hay que integrar la densidad conjunta sobre la diagonal.
- **Confundir la convolución con el producto de densidades.** $f_X(s)\, f_Y(s)$ no es una densidad de nada útil; la convolución integra sobre todas las particiones de $s$.
- **Olvidar los límites de integración.** Con soportes acotados, $f_Y(s - x)$ es cero fuera de un rango de $x$ que depende de $s$, y los límites cambian en cada tramo.

:::figura[Variables dependientes en el triángulo $0 < x < y < 1$: la densidad de la suma sale de integrar la conjunta sobre cada diagonal, y no coincide con la convolución de sus marginales $2(1 - x)$ y $2y$.]{componente="JointDistribution2D"}
```yaml
modo: suma
modelo: uniforme-triangulo
s: 1
```
:::

## Conexiones

La convolución es el caso independiente de la [[suma-de-variables-aleatorias]], válido gracias a la [[independencia-de-variables-aleatorias]]. Se vuelve un producto mediante la [[funcion-generadora-de-momentos]] y la [[funcion-caracteristica]], y con variables enteras mediante la [[funcion-generadora-de-probabilidad]]. Las sumas de la [[distribucion-binomial]] y la [[distribucion-de-poisson]] son ejemplos de familias cerradas. El suavizado que produce al repetirse es el contenido del [[tcl-de-lindeberg-levy]].

## Formulario

:::formula[Convolución discreta]
$$
(p_X * p_Y)(s) = \sum_x p_X(x)\, p_Y(s - x)
$$

- $X$, $Y$: variables independientes con masas $p_X$ y $p_Y$; $*$: convolución.
- $s$: valor de la suma $S = X + Y$; la suma recorre los valores $x$ de $X$.
- $s - x$: valor que debe tomar $Y$ para que la suma sea $s$.
:::

:::formula[Convolución continua]
$$
(f_X * f_Y)(s) = \int_{-\infty}^{\infty} f_X(x)\, f_Y(s - x)\,dx
$$

- $f_X$, $f_Y$: densidades de $X$ y $Y$ independientes; el resultado es la densidad de $X + Y$ en $s$.
:::

:::formula[Exponenciales con la misma tasa]
$$
f_{X+Y}(s) = \lambda^2 s\, e^{-\lambda s}, \qquad s \ge 0
$$

- $X$, $Y$: exponenciales independientes con tasa $\lambda$.
- El resultado es una gamma con forma 2 y tasa $\lambda$.
:::

:::formula[Normales independientes]
$$
\mathcal{N}(\mu_1, \sigma_1^2) * \mathcal{N}(\mu_2, \sigma_2^2) = \mathcal{N}(\mu_1 + \mu_2,\ \sigma_1^2 + \sigma_2^2)
$$

- $\mathcal{N}(\mu, \sigma^2)$: normal con media $\mu$ y varianza $\sigma^2$; los subíndices 1 y 2 indican cada sumando.
- Medias y varianzas se suman.
:::

:::formula[Generadora de momentos de la suma]
$$
M_{X+Y}(t) = M_X(t)\, M_Y(t)
$$

- $M_X(t) = \mathbb{E}[e^{tX}]$: función generadora de momentos, con $\mathbb{E}$ la esperanza y $t$ un número real donde existe.
- Vale para $X$ y $Y$ independientes: la convolución se vuelve producto.
:::
