---
id: momentos
titulo: Momentos
titulo_en: Moments
alias:
  - momentos crudos
  - momentos alrededor del origen
  - momento de orden k
modulo: 1
submodulo: '1.3'
orden: 16
nivel: basico
prerrequisitos:
  - ley-del-estadistico-inconsciente
relaciones:
  - tipo: relacionado
    id: momentos-centrales
  - tipo: relacionado
    id: funcion-generadora-de-momentos
etiquetas:
  - momento de orden k
  - potencias
  - existencia de momentos
  - colas pesadas
resumen: >
  El momento de orden k de una variable aleatoria es la esperanza de su potencia k. El primero es
  la media, el segundo mide el tamaño típico de los valores y los de orden superior describen la
  forma de la distribución, sobre todo sus colas.
formula: '\mu_k'' = \mathbb{E}[X^k] = \sum_x x^k p(x) \quad \text{o} \quad \int_{-\infty}^{\infty} x^k f(x)\,dx'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: forma
    distribucion: gamma
    parametros:
      alpha: 2
      beta: 1
    momento: crudo
    orden: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.2'
  - clave: degroot
    capitulo: '4.4'
publicado: true
---

## Intuición

La media resume una distribución con un solo número, pero distribuciones muy distintas tienen la misma media. Los **momentos** son una sucesión de resúmenes que van agregando detalle: la media de $X$, la media de $X^2$, la media de $X^3$, y así sucesivamente.

Cada potencia mira la distribución con una lente distinta. Al elevar al cuadrado, los valores grandes en valor absoluto pesan más; al elevar a la cuarta, pesan muchísimo más. Por eso los momentos de orden alto son sensibles a las colas: un valor raro pero enorme apenas mueve la media y en cambio domina $\mathbb{E}[X^4]$.

El nombre viene de la mecánica: si la distribución es una barra con masa, el primer momento ubica el centro de masa y el segundo mide la inercia al girar alrededor del origen.

## Definición

:::definicion[Momento de orden k]
Sea $X$ una variable aleatoria y $k$ un entero positivo. El **momento de orden $k$** de $X$ (o momento crudo, o alrededor del origen) es
$$
\mu_k' = \mathbb{E}[X^k],
$$
siempre que $\mathbb{E}\big[|X|^k\big] < \infty$. En el caso discreto vale $\sum_x x^k p(x)$, y en el continuo $\int x^k f(x)\,dx$.
:::

El primer momento es la media, $\mu_1' = \mu$. Los momentos centrales, $\mathbb{E}[(X - \mu)^k]$, son los mismos momentos calculados alrededor de la media en lugar del origen.

:::figura[El segundo momento de la cara de un dado: cada cara aporta $x^2/6$ y el total es $91/6 \approx 15.17$, mucho más que el cuadrado de la media, 12.25.]{componente="RandomVariableLab"}
```yaml
modo: forma
experimento: dado
variable: valor
momento: crudo
orden: 2
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $k$: orden del momento, un entero positivo.
- $\mu_k' = \mathbb{E}[X^k]$: momento crudo de orden $k$.
- $\mu$: media, igual a $\mu_1'$.
- $x^k p(x)$: contribución del valor $x$ al momento de orden $k$.
- $U$: variable uniforme entre 0 y 1.
- $\alpha$: índice de cola de la distribución de Pareto.
:::

## Cómo usar la visualización

Arriba está una densidad gamma con su media, su mediana y su moda marcadas. Al avanzar, abajo aparece la contribución de cada franja al momento elegido: con orden 2 y momento crudo, cada franja aporta $x^2 f(x)\,\Delta x$, y el total aparece en el encabezado. Las contribuciones crecen hacia la derecha aunque la densidad baje, porque $x^2$ crece más rápido.

La deslizadera cambia el orden. Con orden 4 la mayor contribución se va a la cola, lejos del pico de la densidad: los momentos altos miran las colas. El selector cambia entre momentos crudos y centrales.

## Ejemplo

Para $U$ uniforme entre 0 y 1, la densidad vale 1 en el intervalo y los momentos son
$$
\mathbb{E}[U^k] = \int_0^1 u^k\,du = \frac{1}{k + 1}.
$$

1. Primer momento: $1/2$, la media.
2. Segundo momento: $1/3$, de donde $\operatorname{Var}(U) = 1/3 - 1/4 = 1/12$.
3. Tercer momento: $1/4$. Los momentos decrecen porque $u^k$ se hace pequeño en todo el intervalo salvo cerca de 1.

:::figura[El tercer momento de la uniforme entre 0 y 1: solo las franjas cercanas a 1 aportan algo apreciable, y el total es 0.25.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: uniforme
parametros:
  a: 0
  b: 1
momento: crudo
orden: 3
```
:::

## Propiedades

- **Jerarquía:** si existe el momento de orden $k$, existen todos los de orden menor.
- **Colas pesadas:** en la distribución de Pareto con índice $\alpha$, $\mathbb{E}[X^k]$ es finito solo si $k < \alpha$; con $\alpha = 2.5$ hay media y varianza, pero no tercer momento.
- **Escala:** $\mathbb{E}[(cX)^k] = c^k\,\mathbb{E}[X^k]$.
- **Relación con los centrales:** $\operatorname{Var}(X) = \mu_2' - (\mu_1')^2$, y en general cada momento central se escribe con los crudos desarrollando $(X - \mu)^k$.
- **Determinación:** si la función generadora de momentos existe cerca de 0, los momentos determinan la distribución.

:::figura[El cuarto momento de la normal estándar vale 3. Las contribuciones de $x^4 f(x)$ tienen dos jorobas lejos del centro, cerca de $\pm 2$: el centro casi no aporta.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: normal
momento: crudo
orden: 4
```
:::

## Errores comunes

- **Confundir el momento crudo con el central.** $\mathbb{E}[X^2]$ no es la varianza salvo que la media sea 0.
- **Suponer que todos los momentos existen.** Con colas pesadas, como en Pareto o en Cauchy, los momentos altos son infinitos o no existen, y las estimaciones con datos no se estabilizan.
- **Escribir $\mathbb{E}[X^k] = (\mathbb{E}[X])^k$.** Solo es cierto para constantes; en general $\mathbb{E}[X^2] \ge (\mathbb{E}[X])^2$.

:::figura[El mismo dado con el momento central de orden 2: alrededor de la media 3.5 el total es 2.917, la varianza, y no 15.17.]{componente="RandomVariableLab"}
```yaml
modo: forma
experimento: dado
variable: valor
momento: central
orden: 2
```
:::

## Conexiones

Los momentos se calculan con la [[ley-del-estadistico-inconsciente]] aplicada a $g(x) = x^k$, y el primero es la [[esperanza-matematica]]. Calculados alrededor de la media son los [[momentos-centrales]], de donde salen la [[varianza]], la [[asimetria]] y la [[curtosis]]. La [[funcion-generadora-de-momentos]] los reúne en una sola función, y los [[cumulantes-y-funcion-generadora-de-cumulantes]] los reorganizan de manera que se suman para variables independientes. Las versiones del teorema central del límite con condiciones de momentos, como el [[tcl-de-lyapunov]] y el [[teorema-de-berry-esseen]], piden momentos de orden mayor que 2.

## Formulario

:::formula[Momento de orden k]
$$
\mu_k' = \mathbb{E}[X^k]
$$

- Existe si $\mathbb{E}|X|^k < \infty$.
:::

:::formula[Casos discreto y continuo]
$$
\mathbb{E}[X^k] = \sum_x x^k p(x), \qquad \mathbb{E}[X^k] = \int_{-\infty}^{\infty} x^k f(x)\,dx
$$

- Ley del estadístico inconsciente con $g(x) = x^k$.
:::

:::formula[Momentos de la uniforme estándar]
$$
\mathbb{E}[U^k] = \frac{1}{k + 1}
$$

- $U$ uniforme entre 0 y 1.
:::

:::formula[Varianza con momentos crudos]
$$
\operatorname{Var}(X) = \mu_2' - (\mu_1')^2
$$

- Segundo momento menos el primero al cuadrado.
:::
