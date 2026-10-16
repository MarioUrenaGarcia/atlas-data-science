---
id: momentos-centrales
titulo: Momentos centrales
titulo_en: Central moments
alias:
  - momentos alrededor de la media
  - momento central de orden k
modulo: 1
submodulo: '1.3'
orden: 17
nivel: basico
prerrequisitos:
  - momentos
  - varianza
relaciones:
  - tipo: relacionado
    id: asimetria
  - tipo: relacionado
    id: curtosis
etiquetas:
  - momento central
  - desviaciones respecto a la media
  - simetría
  - invariancia por traslación
resumen: >
  Los momentos centrales son los momentos de las desviaciones respecto a la media. No cambian al
  desplazar la variable, el segundo es la varianza y los de orden impar valen cero en las
  distribuciones simétricas.
formula: '\mu_k = \mathbb{E}\big[(X - \mu)^k\big], \qquad \mu_2 = \operatorname{Var}(X)'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: forma
    distribucion: gamma
    parametros:
      alpha: 2
      beta: 1
    momento: central
    orden: 3
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.2'
  - clave: degroot
    capitulo: '4.4'
publicado: true
---

## Intuición

Los momentos crudos dependen de dónde está el origen: si una temperatura se mide en grados Celsius o se le suma 100, $\mathbb{E}[X^2]$ cambia por completo aunque la forma de la distribución sea la misma. Para describir la forma conviene medir desde el centro de la propia distribución. Los **momentos centrales** hacen eso: promedian potencias de la desviación $X - \mu$.

El segundo momento central es la varianza, que mide el ancho. El tercero distingue hacia qué lado se extiende la distribución: las desviaciones positivas elevadas al cubo siguen positivas y las negativas siguen negativas, así que si la cola derecha es más larga, ganan las positivas. El cuarto, con todas las desviaciones convertidas en positivas y amplificadas, mide cuánto peso tienen los valores muy alejados.

## Definición

:::definicion[Momento central de orden k]
Sea $X$ una variable aleatoria con media $\mu$ y $\mathbb{E}|X|^k < \infty$. Su **momento central de orden $k$** es
$$
\mu_k = \mathbb{E}\big[(X - \mu)^k\big].
$$
:::

Siempre $\mu_1 = 0$ y $\mu_2 = \operatorname{Var}(X)$. Desarrollando el binomio, cada momento central se expresa con los crudos $\mu_j' = \mathbb{E}[X^j]$:
$$
\mu_3 = \mu_3' - 3\mu\mu_2' + 2\mu^3, \qquad \mu_4 = \mu_4' - 4\mu\mu_3' + 6\mu^2\mu_2' - 3\mu^4.
$$

:::figura[El tercer momento central de una binomial con 10 ensayos y probabilidad 0.2: la cola derecha es más larga y sus desviaciones al cubo ganan, así que el total es positivo, 0.96.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: binomial
parametros:
  n: 10
  p: 0.2
momento: central
orden: 3
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con media $\mu$.
- $\mu_k$: momento central de orden $k$.
- $\mu_j' = \mathbb{E}[X^j]$: momentos crudos.
- $(x - \mu)^k p(x)$: contribución del valor $x$ al momento central.
- $c$: constante de escala.
- $B$: variable de Bernoulli del ejemplo, con parámetro $p$.
:::

## Cómo usar la visualización

Arriba está una densidad gamma con su media marcada; abajo, la contribución de cada franja a $\mu_3$, positiva sobre el eje y negativa por debajo. A la izquierda de la media las contribuciones son negativas y a la derecha positivas; como la cola derecha es más larga, las positivas suman más y el total es positivo.

La deslizadera cambia el orden. Con orden 2 todas las contribuciones son positivas y el total es la varianza; con orden 4 se concentran todavía más en la cola. El selector cambia a momentos crudos, medidos desde 0.

## Ejemplo

Para una variable de Bernoulli $B$ con $P(B = 1) = p$ y media $p$:

1. $\mu_2 = (1 - p)^2 p + (0 - p)^2 (1 - p) = p(1 - p)$.
2. $\mu_3 = (1 - p)^3 p + (-p)^3 (1 - p) = p(1 - p)\big[(1 - p)^2 - p^2\big] = p(1 - p)(1 - 2p)$.
3. Con $p = 0.2$: $\mu_2 = 0.16$ y $\mu_3 = 0.16 \cdot 0.6 = 0.096$, positivo porque el valor 1 es raro y está lejos de la media 0.2.
4. Con $p = 0.5$, $\mu_3 = 0$: la distribución es simétrica.

:::figura[La Bernoulli del ejemplo con $p = 0.2$: el valor 1 está a 0.8 de la media y aporta $0.8^3 \cdot 0.2 = 0.102$; el valor 0 aporta $-0.2^3 \cdot 0.8 = -0.006$. El total es 0.096.]{componente="RandomVariableLab"}
```yaml
modo: forma
valores: [0, 1]
probabilidades: [0.8, 0.2]
nombre: una variable de Bernoulli con p = 0.2
simbolo: B
momento: central
orden: 3
```
:::

## Propiedades

- **Traslación:** $X + b$ tiene los mismos momentos centrales que $X$.
- **Escala:** los momentos centrales de $cX$ son $c^k \mu_k$; por eso la asimetría y la curtosis se definen dividiendo entre $\sigma^3$ y $\sigma^4$.
- **Simetría:** si la distribución es simétrica alrededor de $\mu$, todos los momentos centrales impares valen 0.
- **Signo de los pares:** los momentos centrales pares son no negativos, y valen 0 solo para constantes.

:::figura[En la normal, simétrica, las contribuciones al tercer momento central se cancelan exactamente a ambos lados de la media y el total es 0.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: normal
momento: central
orden: 3
```
:::

## Errores comunes

- **Confundir $\mu_k$ con $\mu_k'$.** En la exponencial de media 1, el tercer momento crudo es 6 y el central es 2.
- **Concluir simetría a partir de $\mu_3 = 0$.** Hay distribuciones asimétricas con tercer momento central nulo; la simetría implica $\mu_3 = 0$, pero no al revés.
- **Comparar momentos centrales en escalas distintas.** $\mu_3$ cambia con las unidades al cubo; para comparar formas se usa la asimetría estandarizada.

:::figura[El tercer momento central de la exponencial de media 1 vale 2, mientras que el crudo vale 6: medir desde la media en lugar de desde 0 cambia el resultado.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: exponencial
parametros:
  lambda: 1
momento: central
orden: 3
```
:::

## Conexiones

Los momentos centrales son los [[momentos]] de $X - \mu$. El segundo es la [[varianza]]; dividiendo el tercero y el cuarto entre potencias de la [[desviacion-estandar]] se obtienen la [[asimetria]] y la [[curtosis]]. Los [[cumulantes-y-funcion-generadora-de-cumulantes]] coinciden con los momentos centrales hasta el orden 3. Con datos, los momentos centrales muestrales dan la [[asimetria-muestral]] y la [[curtosis-muestral-y-exceso-de-curtosis]].

## Formulario

:::formula[Definición]
$$
\mu_k = \mathbb{E}\big[(X - \mu)^k\big]
$$

- $\mu_1 = 0$, $\mu_2 = \operatorname{Var}(X)$.
:::

:::formula[Tercer momento central]
$$
\mu_3 = \mu_3' - 3\mu\mu_2' + 2\mu^3
$$

- $\mu_j' = \mathbb{E}[X^j]$.
:::

:::formula[Cuarto momento central]
$$
\mu_4 = \mu_4' - 4\mu\mu_3' + 6\mu^2\mu_2' - 3\mu^4
$$

- Desarrollo del binomio $(X - \mu)^4$.
:::

:::formula[Traslación y escala]
$$
\mu_k(cX + b) = c^k \mu_k(X)
$$

- Los desplazamientos no cambian los momentos centrales.
:::
