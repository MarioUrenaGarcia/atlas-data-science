---
id: espacios-lp
titulo: Espacios Lp
titulo_en: Lp spaces
alias:
  - espacio L1
  - espacio L2
  - norma Lp
  - funciones p-integrables
modulo: 0
submodulo: '0.9'
orden: 13
nivel: avanzado
prerrequisitos:
  - integral-de-lebesgue
  - conjuntos-de-medida-cero-y-propiedades-casi-seguras
etiquetas:
  - normas
  - integrabilidad
  - espacios de funciones
  - teoría de la medida
resumen: >
  El espacio Lp reúne las funciones medibles cuya potencia p del valor absoluto tiene integral finita,
  identificando las que son iguales c.t.p. Con la norma (∫|f|^p)^(1/p) es un espacio vectorial completo.
formula: '\|f\|_p = \Big(\int |f|^p\,d\mu\Big)^{1/p}, \qquad L^p(\mu) = \{f \text{ medible} : \|f\|_p < \infty\}'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: lp
    vista: bola
referencias:
  - clave: durrett
  - clave: boyd
publicado: true
---

## Intuición

Para decir qué tan grande es una función hay muchas maneras razonables. Se puede promediar su valor absoluto, que pesa por igual errores grandes y chicos; promediar su cuadrado, que castiga más los errores grandes; o tomar su valor máximo, que solo mira el peor caso. Cada elección es una norma $p$: $p = 1$, $p = 2$ y $p = \infty$, con todas las intermedias.

En el plano, las normas $p$ se ven en la forma de su esfera unitaria: un rombo para $p = 1$, el círculo para $p = 2$ y un cuadrado para $p = \infty$. Para funciones, la norma $p$ mide el área bajo $|f|^p$ y luego saca raíz. Una función con un pico muy alto pero angosto puede tener norma 1 finita y norma 2 infinita: la potencia amplifica el pico hasta que su área explota.

Los espacios $L^p$ son las funciones de norma $p$ finita. Son la base de la estadística: el error absoluto medio vive en $L^1$, la varianza y los mínimos cuadrados en $L^2$, y las cotas uniformes en $L^\infty$.

## Definición

:::definicion[Espacio Lp]
Sea $(\Omega, \mathcal{F}, \mu)$ un espacio de medida y $1 \le p < \infty$. La norma $p$ de una función medible $f$ es
$$
\|f\|_p = \Big(\int_\Omega |f|^p\,d\mu\Big)^{1/p},
$$
y para $p = \infty$, $\|f\|_\infty = \inf\{M : |f| \le M \text{ c.t.p.}\}$, el supremo esencial. El espacio $L^p(\mu)$ está formado por las clases de funciones medibles con $\|f\|_p < \infty$, donde se identifican las que son iguales c.t.p.
:::

En $\mathbb{R}^d$ con la medida de conteo se obtiene la norma $\|\mathbf{x}\|_p = \big(\sum_i |x_i|^p\big)^{1/p}$, y $\|\mathbf{x}\|_\infty = \max_i |x_i|$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $f$: función medible.
- $p$: exponente, entre 1 e infinito.
- $\|f\|_p$: norma $p$; $\|f\|_\infty$: supremo esencial.
- $M$: cota de $|f|$ salvo un conjunto nulo.
- $L^p(\mu)$: espacio de las clases de funciones con norma $p$ finita.
- $\mathbf{x}$: vector de $\mathbb{R}^d$ con componentes $x_i$.
:::

## Cómo usar la visualización

La curva resaltada es la esfera unitaria de la norma $p$ en el plano, los puntos con $\|\mathbf{x}\|_p = 1$; las anteriores quedan atenuadas. El segmento llega al vector $(1, 0.5)$. La reproducción recorre $p = 1, 1.25, 1.5, 2, 2.5, 2.9, 3, 4, 6, 10$ e infinito.

El rombo de $p = 1$ se infla hasta el círculo de $p = 2$ y luego hasta el cuadrado de $p = \infty$. La norma del vector baja: 1.5 con $p = 1$, 1.118 con $p = 2$, 1.040 con $p = 3$ y 1 con $p = \infty$. Para un mismo vector, la norma $p$ nunca crece al aumentar $p$.

## Ejemplo

Se estudia $f(x) = x^{-1/3}$ en $(0, 1]$ con la medida de Lebesgue.

1. $\int_0^1 x^{-p/3}\,dx$ es finita si y solo si $p/3 < 1$, es decir, $p < 3$; en ese caso vale $\frac{3}{3 - p}$.
2. $\|f\|_1 = \frac{3}{2} = 1.5$.
3. $\|f\|_2 = \big(\tfrac{3}{1}\big)^{1/2} = 1.732$.
4. Para $p \ge 3$ la integral diverge: $f \in L^1 \cap L^2$, pero $f \notin L^3$ y $f \notin L^\infty$.

:::figura[Área bajo $|f|^p$ para $f(x) = x^{-1/3}$: la norma vale 1.5 con p = 1, 1.587 con 1.5 y 1.732 con 2, crece a 3.23 con 2.9 y es infinita desde p = 3, cuando el pico en 0 deja de tener área finita.]{componente="MeasureLab"}
```yaml
modo: lp
vista: funcion
```
:::

## Propiedades

- **Desigualdad de Minkowski:** $\|f + g\|_p \le \|f\|_p + \|g\|_p$; con ella $\|\cdot\|_p$ es una norma.
- **Desigualdad de Hölder:** $\int |fg|\,d\mu \le \|f\|_p\,\|g\|_q$ con $\frac{1}{p} + \frac{1}{q} = 1$; para $p = q = 2$ es la de Cauchy-Schwarz.
- **Completitud:** $L^p$ es un espacio de Banach (Riesz-Fischer); $L^2$ es además un espacio de Hilbert con $\langle f, g\rangle = \int fg\,d\mu$.
- **Inclusión con medida finita:** si $\mu(\Omega) < \infty$ y $p < r$, entonces $L^r \subseteq L^p$ y $\|f\|_p \le \mu(\Omega)^{1/p - 1/r}\|f\|_r$; en probabilidad, $\|X\|_p$ crece con $p$.
- **Vectores:** en $\mathbb{R}^d$, $\|\mathbf{x}\|_\infty \le \|\mathbf{x}\|_2 \le \|\mathbf{x}\|_1$.

:::figura[Desde p = 2.9 en adelante: la norma de $x^{-1/3}$ vale 3.23 y el área sombreada se dispara; con p = 3 la integral diverge y el área cambia de color para indicar que f no está en $L^3$.]{componente="MeasureLab"}
```yaml
modo: lp
vista: funcion
p: 2.9
```
:::

## Errores comunes

- **Pensar que $L^p$ contiene funciones y no clases.** Dos funciones iguales c.t.p. son el mismo elemento de $L^p$; por eso $\|f\|_p = 0$ implica $f = 0$ c.t.p., no en todo punto.
- **Generalizar la inclusión a medidas infinitas.** En $\mathbb{R}$ con la medida de Lebesgue no hay inclusión: $\mathbf{1}_{[1, \infty)}/x$ está en $L^2$ pero no en $L^1$, y $x^{-1/3}\mathbf{1}_{(0, 1]}$ está en $L^1$ pero no en $L^3$.
- **Usar $p < 1$ como norma.** Para $0 < p < 1$ la expresión no cumple la desigualdad del triángulo y la esfera unitaria no es convexa.
- **Confundir la norma $\infty$ con el máximo.** Es el supremo esencial: cambiar $f$ en un conjunto de medida cero no la modifica.

:::figura[Esferas unitarias desde p = 4: el círculo ya casi es un cuadrado y la norma del vector (1, 0.5) baja de 1.015 a 1, el valor de su mayor componente.]{componente="MeasureLab"}
```yaml
modo: lp
vista: bola
p: 4
```
:::

## Conexiones

Se definen con la [[integral-de-lebesgue]] e identifican funciones que coinciden salvo [[conjuntos-de-medida-cero-y-propiedades-casi-seguras|conjuntos de medida cero]]. La convergencia en $L^1$ es la conclusión del [[teorema-de-convergencia-dominada]], las normas vectoriales $p$ son las [[normas-vectoriales]] del álgebra lineal, y $L^2$, cuyo producto interno generaliza el [[producto-punto]], es el marco de la [[varianza]] y de la [[proyeccion-ortogonal]] de funciones.

## Formulario

:::formula[Norma p]
$$
\|f\|_p = \Big(\int |f|^p\,d\mu\Big)^{1/p}
$$

- $f$: función medible; $p \ge 1$: exponente; $\mu$: medida.
:::

:::formula[Norma infinito]
$$
\|f\|_\infty = \inf\{M : |f| \le M \ \text{c.t.p.}\}
$$

- $M$: cota de $|f|$ fuera de un conjunto nulo.
:::

:::formula[Desigualdad de Hölder]
$$
\int |fg|\,d\mu \le \|f\|_p\,\|g\|_q, \qquad \frac{1}{p} + \frac{1}{q} = 1
$$

- $p$, $q$: exponentes conjugados; $f$, $g$: funciones medibles.
:::

:::formula[Norma del ejemplo]
$$
\|x^{-1/3}\|_p = \Big(\frac{3}{3 - p}\Big)^{1/p}, \qquad 1 \le p < 3
$$

- $p$: exponente; para $p \ge 3$ la norma es infinita.
:::

:::formula[Norma de un vector]
$$
\|\mathbf{x}\|_p = \Big(\sum_{i=1}^{d}|x_i|^p\Big)^{1/p}, \qquad \|\mathbf{x}\|_\infty = \max_i |x_i|
$$

- $\mathbf{x}$: vector con componentes $x_i$; $d$: dimensión.
:::
