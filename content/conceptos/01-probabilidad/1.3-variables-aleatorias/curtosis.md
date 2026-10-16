---
id: curtosis
titulo: Curtosis
titulo_en: Kurtosis
alias:
  - exceso de curtosis
  - cuarto momento estandarizado
  - apuntamiento
modulo: 1
submodulo: '1.3'
orden: 19
nivel: basico
prerrequisitos:
  - momentos-centrales
  - desviacion-estandar
relaciones:
  - tipo: relacionado
    id: curtosis-muestral-y-exceso-de-curtosis
  - tipo: relacionado
    id: colas-ligeras-y-pesadas-en-datos
etiquetas:
  - colas pesadas
  - cuarto momento
  - valores extremos
  - comparación con la normal
resumen: >
  La curtosis es el cuarto momento central entre la cuarta potencia de la desviación estándar. Mide el peso de las colas; la normal tiene curtosis 3 y el exceso de curtosis se mide respecto a ella.
formula: '\beta_2 = \frac{\mu_4}{\sigma^4}, \qquad \gamma_2 = \frac{\mu_4}{\sigma^4} - 3'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: forma
    distribucion: laplace
    parametros:
      mu: 0
      b: 1
    momento: central
    orden: 4
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.2'
  - clave: degroot
    capitulo: '4.4'
publicado: true
---

## Intuición

Dos distribuciones pueden tener la misma media y la misma desviación estándar y comportarse de manera muy distinta en los extremos. En una, los valores a más de 4 desviaciones de la media prácticamente no ocurren; en la otra aparecen de vez en cuando. Para quien administra riesgos, esa diferencia lo es todo: las crisis financieras, las inundaciones extremas y las fallas masivas viven en las colas.

La **curtosis** mide eso. Promedia la cuarta potencia de las desviaciones estandarizadas: una desviación de 1 aporta 1, una de 2 aporta 16 y una de 4 aporta 256. Así, la curtosis está dominada por los valores alejados. Como referencia se usa la normal, cuya curtosis es 3; el **exceso de curtosis** resta ese 3, de modo que un exceso positivo indica colas más pesadas que las de la normal.

## Definición

:::definicion[Curtosis y exceso de curtosis]
Sea $X$ una variable aleatoria con media $\mu$, desviación estándar $\sigma > 0$ y cuarto momento finito. Su **curtosis** es
$$
\beta_2 = \mathbb{E}\left[\left(\frac{X - \mu}{\sigma}\right)^4\right] = \frac{\mu_4}{\sigma^4},
$$
y su **exceso de curtosis** es $\gamma_2 = \beta_2 - 3$.
:::

Una distribución con $\gamma_2 > 0$ se llama leptocúrtica (colas más pesadas que la normal), con $\gamma_2 < 0$ platicúrtica y con $\gamma_2 = 0$ mesocúrtica.

:::figura[La normal estándar es la referencia: su cuarto momento central es 3 y su desviación estándar 1, así que el exceso de curtosis es 0.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: normal
momento: central
orden: 4
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $\mu$, $\sigma$: media y desviación estándar.
- $\mu_4$: cuarto momento central.
- $\beta_2$: curtosis.
- $\gamma_2 = \beta_2 - 3$: exceso de curtosis.
- $\gamma_1$: asimetría.
- $U$: variable uniforme entre 0 y 1.
- $\nu$: grados de libertad de la $t$ de Student.
:::

## Cómo usar la visualización

Arriba está la densidad de Laplace, con un pico agudo y colas exponenciales; abajo, la contribución de cada franja al cuarto momento central. Las contribuciones del centro son casi nulas, a pesar de que ahí está la mayor parte de la probabilidad: el cuarto momento lo construyen las colas. El encabezado termina con el exceso de curtosis, 3.

La deslizadera cambia el orden del momento; con orden 2 se ve que la varianza depende mucho menos de las colas.

## Ejemplo

Para $U$ uniforme entre 0 y 1, la media es $1/2$ y la varianza $1/12$.

1. Cuarto momento central: $\mu_4 = \int_0^1 (u - \tfrac{1}{2})^4\,du = \int_{-1/2}^{1/2} t^4\,dt = \tfrac{2}{5} \cdot \tfrac{1}{32} = \tfrac{1}{80}$.
2. $\sigma^4 = (1/12)^2 = 1/144$.
3. Curtosis: $\beta_2 = 144 / 80 = 1.8$, y exceso de curtosis $1.8 - 3 = -1.2$.

La uniforme no tiene colas: todos sus valores están a menos de $\sqrt{3} \approx 1.73$ desviaciones estándar de la media, y su curtosis es menor que la de la normal.

:::figura[La uniforme del ejemplo: las contribuciones al cuarto momento crecen hacia los extremos pero se cortan de golpe, y el exceso de curtosis es $-1.2$.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: uniforme
parametros:
  a: 0
  b: 1
momento: central
orden: 4
```
:::

## Propiedades

- **Sin unidades:** $\beta_2(aX + b) = \beta_2(X)$ para todo $a \ne 0$.
- **Cota inferior:** $\beta_2 \ge 1 + \gamma_1^2 \ge 1$. El mínimo, $\beta_2 = 1$, lo alcanza solo una variable con dos valores igualmente probables.
- **Familias conocidas:** exceso 0 en la normal, 3 en la Laplace, 6 en la exponencial, $6/(\nu - 4)$ en la $t$ de Student con $\nu > 4$ grados de libertad.
- **Sumas:** el exceso de curtosis de una suma de $n$ variables independientes e idénticas es $\gamma_2 / n$; los promedios se acercan a la normal también en las colas.

:::figura[El mínimo posible: una variable que vale 0 o 1 con probabilidad 1/2 tiene curtosis 1, exceso $-2$. Toda la masa está a exactamente una desviación estándar de la media.]{componente="RandomVariableLab"}
```yaml
modo: forma
valores: [0, 1]
probabilidades: [0.5, 0.5]
nombre: una moneda equilibrada
simbolo: X
momento: central
orden: 4
```
:::

## Errores comunes

- **Leer la curtosis como "qué tan puntiaguda" es la densidad.** La forma del pico influye poco; lo que domina el cuarto momento son las colas. Hay distribuciones con pico plano y curtosis alta.
- **Olvidar si se reporta la curtosis o el exceso.** Muchos programas dan el exceso $\gamma_2$; otros dan $\beta_2$. La normal tiene 0 en un caso y 3 en el otro.
- **Confiar en la curtosis estimada con colas muy pesadas.** Si el cuarto momento es infinito, como en la $t$ con 4 o menos grados de libertad, la curtosis no existe y su estimación salta con cada dato extremo.

:::figura[La $t$ de Student con 8 grados de libertad parece una campana normal un poco más ancha, pero su exceso de curtosis es $6/4 = 1.5$: sus colas aportan mucho más al cuarto momento.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: t
parametros:
  nu: 8
momento: central
orden: 4
```
:::

## Conexiones

La curtosis es el cuarto de los [[momentos-centrales]] dividido entre la cuarta potencia de la [[desviacion-estandar]], y junto con la [[asimetria]] completa la descripción de la forma. La cola que mide se ve directamente en la [[funcion-de-supervivencia]]. Con datos se estima con la [[curtosis-muestral-y-exceso-de-curtosis]], y sus consecuencias prácticas se discuten en [[colas-ligeras-y-pesadas-en-datos]]. El exceso de curtosis es el cuarto cumulante estandarizado, como se ve en [[cumulantes-y-funcion-generadora-de-cumulantes]].

## Formulario

:::formula[Curtosis]
$$
\beta_2 = \frac{\mu_4}{\sigma^4}
$$

- $\mu_4 = \mathbb{E}[(X - \mu)^4]$.
:::

:::formula[Exceso de curtosis]
$$
\gamma_2 = \frac{\mu_4}{\sigma^4} - 3
$$

- Vale 0 en la normal.
:::

:::formula[Cota inferior]
$$
\beta_2 \ge 1 + \gamma_1^2
$$

- $\gamma_1$: asimetría.
:::

:::formula[Suma de n independientes idénticas]
$$
\gamma_2\left(\sum_{i=1}^{n} X_i\right) = \frac{\gamma_2(X_1)}{n}
$$

- Las colas de la suma se acercan a las de la normal.
:::
