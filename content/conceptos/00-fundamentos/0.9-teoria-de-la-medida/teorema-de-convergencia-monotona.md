---
id: teorema-de-convergencia-monotona
titulo: Teorema de convergencia monótona
titulo_en: Monotone convergence theorem
alias:
  - TCM
  - teorema de Beppo Levi
  - convergencia monótona
modulo: 0
submodulo: '0.9'
orden: 8
nivel: avanzado
prerrequisitos:
  - integral-de-lebesgue
etiquetas:
  - teoremas de límite
  - integración
  - sucesiones de funciones
  - teoría de la medida
resumen: >
  Si una sucesión de funciones medibles no negativas crece puntualmente hacia f, sus integrales crecen hacia
  la integral de f, aunque esta sea infinita. Límite e integral se pueden intercambiar sin más condiciones.
formula: '0 \le f_1 \le f_2 \le \cdots,\ f_n \to f \text{ c.t.p.} \;\Longrightarrow\; \int f_n\,d\mu \to \int f\,d\mu'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: sucesion
    caso: creciente
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Un tanque se llena por etapas y en ninguna etapa se le quita agua. El volumen final es el límite de los volúmenes intermedios: no hay manera de que una parte del agua desaparezca en el límite. El teorema de convergencia monótona dice lo mismo para integrales: si las funciones crecen punto por punto, la integral del límite es el límite de las integrales.

No hace falta que las funciones estén acotadas ni que el límite tenga integral finita. Si la integral del límite es infinita, las integrales de la sucesión crecen sin cota. Esta ausencia de condiciones es lo que lo hace tan útil: es la herramienta con la que se demuestran casi todas las demás propiedades de la integral, desde la linealidad hasta el lema de Fatou.

El crecimiento es esencial. Sin él, una sucesión puede tener integrales que se quedan en 1 mientras las funciones tienden a 0, porque la masa se concentra en regiones cada vez más pequeñas.

## Definición

:::teorema[Teorema de convergencia monótona]
Sea $(\Omega, \mathcal{F}, \mu)$ un espacio de medida y sean $f_1, f_2, \dots$ funciones medibles con $0 \le f_1 \le f_2 \le \cdots$ c.t.p. y $f_n \to f$ c.t.p. Entonces $f$ es medible y
$$
\lim_{n \to \infty} \int f_n\,d\mu = \int f\,d\mu,
$$
donde los dos lados pueden valer $+\infty$.
:::

Para series de funciones no negativas: $\int \sum_{n} g_n\,d\mu = \sum_{n} \int g_n\,d\mu$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $f_n$: sucesión creciente de funciones medibles no negativas.
- $f$: límite puntual de la sucesión.
- $\int f_n\,d\mu$: integral de Lebesgue de cada término.
- c.t.p.: casi en todas partes.
- $g_n$: funciones medibles no negativas que se suman.
:::

:::demostracion
Como $f_n \le f$, se tiene $\lim_n \int f_n \le \int f$. Para la otra desigualdad, sea $\varphi \le f$ simple y $0 < c < 1$. Los conjuntos $E_n = \{f_n \ge c\varphi\}$ crecen hasta $\Omega$, así que $\int f_n \ge c\int_{E_n} \varphi \to c\int \varphi$ por la continuidad de la medida. Haciendo $c \to 1$ y tomando el supremo sobre $\varphi$ resulta $\lim_n \int f_n \ge \int f$.
:::

## Cómo usar la visualización

A la izquierda está el término $f_n(x) = \min\{n, 1/\sqrt{x}\}$, junto con los anteriores y el límite $1/\sqrt{x}$ punteado; a la derecha, la integral de cada término. La reproducción avanza un término por paso, hasta $n = 16$.

Las funciones crecen y se pegan al límite; sus integrales, $2 - 1/n$, valen 1, 1.5, 1.667, 1.75, ..., y suben hacia 2, la integral de $1/\sqrt{x}$, aunque esta función no está acotada. Los puntos de la derecha nunca bajan, como garantiza el crecimiento.

## Ejemplo

Se calcula $\int_0^1 \min\{n, x^{-1/2}\}\,dx$ y su límite.

1. $x^{-1/2} \ge n$ cuando $x \le 1/n^2$.
2. $\int_0^{1/n^2} n\,dx = 1/n$.
3. $\int_{1/n^2}^{1} x^{-1/2}\,dx = 2 - 2/n$.
4. Total: $\int f_n = 2 - 1/n$; con $n = 4$ vale 1.75.
5. Por el teorema, $\int_0^1 x^{-1/2}\,dx = \lim_n (2 - 1/n) = 2$.

:::figura[Aproximaciones simples de la raíz de x desde abajo: son crecientes, y sus integrales 0.375, 0.531, 0.602, 0.635, 0.651 y 0.659 suben hacia 2/3, como asegura el teorema.]{componente="MeasureLab"}
```yaml
modo: simple
funcion: raiz
enfoque: lebesgue
```
:::

## Propiedades

- **Sin hipótesis de integrabilidad:** vale aunque $\int f = \infty$.
- **Series no negativas:** permite intercambiar suma e integral, por ejemplo $\mathbb{E}\big[\sum_n X_n\big] = \sum_n \mathbb{E}[X_n]$ si $X_n \ge 0$.
- **Construcción de la integral:** implica que $\int f\,d\mu = \lim_n \int \varphi_n\,d\mu$ para cualquier sucesión de funciones simples que crezca hacia $f$, no solo la estándar.

:::figura[Aproximaciones simples de x²: las integrales 0.1464, 0.2317, 0.2794, 0.3052, 0.3188 y 0.3259 crecen hacia 1/3 con cada refinamiento.]{componente="MeasureLab"}
```yaml
modo: simple
funcion: cuadrado
enfoque: lebesgue
```
:::

- **Versión decreciente:** si $f_n \downarrow f$ y $\int f_1 < \infty$, también $\int f_n \to \int f$; sin la condición sobre $f_1$ puede fallar.

## Errores comunes

- **Aplicarlo a sucesiones que no son monótonas.** La sucesión $f_n = n\,\mathbf{1}_{(0, 1/n)}$ tiende a 0 en cada punto, pero todas sus integrales valen 1.

:::figura[Escalones n en (0, 1/n): cada escalón es más alto y más angosto, las funciones tienden a 0 en cada punto y sin embargo la integral de cada término es 1; sin crecimiento el teorema no aplica.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: escalon-alto
```
:::

- **Olvidar la no negatividad.** Con $f_n = -\mathbf{1}_{[n, \infty)}$ en $\mathbb{R}$, crecientes hacia 0, las integrales valen $-\infty$ y no convergen a 0.
- **Usar la versión decreciente sin integral finita.** Con $f_n = \mathbf{1}_{[n, \infty)}$, que decrece hacia 0, las integrales son infinitas para todo $n$.

## Conexiones

Es el primer teorema de límite de la [[integral-de-lebesgue]] y trata [[sucesiones]] crecientes de funciones. A partir de él se demuestra el [[lema-de-fatou]], y de este el [[teorema-de-convergencia-dominada]]. En probabilidad justifica intercambiar esperanza y sumas de variables no negativas, como en la [[linealidad-de-la-esperanza]] para infinitos términos.

## Formulario

:::formula[Convergencia monótona]
$$
0 \le f_n \uparrow f \ \text{c.t.p.} \;\Longrightarrow\; \int f_n\,d\mu \uparrow \int f\,d\mu
$$

- $f_n$: funciones medibles no negativas crecientes; $f$: su límite; $\mu$: medida.
:::

:::formula[Series de funciones no negativas]
$$
\int \sum_{n=1}^{\infty} g_n\,d\mu = \sum_{n=1}^{\infty} \int g_n\,d\mu
$$

- $g_n \ge 0$ medibles; los dos lados pueden ser infinitos.
:::

:::formula[Ejemplo de truncamiento]
$$
\int_0^1 \min\{n, x^{-1/2}\}\,dx = 2 - \frac{1}{n} \to 2
$$

- $n$: nivel de truncamiento; el límite es $\int_0^1 x^{-1/2}\,dx$.
:::
