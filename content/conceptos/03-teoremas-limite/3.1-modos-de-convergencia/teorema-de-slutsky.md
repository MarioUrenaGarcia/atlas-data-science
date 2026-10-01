---
id: teorema-de-slutsky
titulo: Teorema de Slutsky
titulo_en: Slutsky's theorem
alias:
  - lema de Slutsky
modulo: 3
submodulo: '3.1'
orden: 17
nivel: intermedio
prerrequisitos:
  - convergencia-en-distribucion
etiquetas:
  - convergencia en distribución
  - estadístico t
  - estimación de la varianza
  - normalidad asintótica
resumen: >
  Si Xₙ converge en distribución a X e Yₙ converge en probabilidad a una constante c, entonces Xₙ + Yₙ,
  XₙYₙ y Xₙ/Yₙ (con c ≠ 0) convergen en distribución a X + c, cX y X/c.
formula: 'X_n \xrightarrow{d} X,\ \ Y_n \xrightarrow{p} c \ \Rightarrow\ X_n + Y_n \xrightarrow{d} X + c,\quad X_nY_n \xrightarrow{d} cX,\quad \frac{X_n}{Y_n} \xrightarrow{d} \frac{X}{c}\ (c \neq 0)'
visualizacion:
  componente: AsymptoticTransform
  parametros:
    modo: slutsky
    variante: estadistico-t
    poblacion:
      distribucion: exponencial
    n: 15
referencias:
  - clave: casella-berger
    capitulo: '5.5'
  - clave: wasserman
publicado: true
---

## Intuición

Un agrónomo quiere probar si el rendimiento medio de una variedad de maíz supera las 4.8 toneladas por hectárea. Por el teorema central del límite, la media de 40 parcelas estandarizada con la desviación estándar verdadera es aproximadamente normal. Pero esa desviación es desconocida; el agrónomo solo tiene la desviación estándar muestral, que también es aleatoria. ¿Sigue siendo normal el cociente cuando el denominador es una estimación?

El teorema de Slutsky dice que sí, siempre que la estimación converja a una constante. Un factor que se acerca a un número fijo termina comportándose como ese número: multiplicar por algo cada vez más cercano a 1 no cambia la distribución límite. Lo mismo vale para sumar algo que se acerca a una constante. La condición clave es que el segundo factor tienda a una constante; si tiende a una variable aleatoria, la conclusión puede fallar por completo, porque la distribución de la suma o el producto depende de cómo se relacionan ambas sucesiones, y la convergencia en distribución por separado no informa nada de eso.

## Definición

:::teorema[Slutsky]
Sean $X_n$ y $Y_n$ variables aleatorias definidas en el mismo espacio. Si $X_n \xrightarrow{d} X$ y $Y_n \xrightarrow{p} c$, con $c$ una constante, entonces
1. $X_n + Y_n \xrightarrow{d} X + c$,
2. $X_n Y_n \xrightarrow{d} cX$,
3. $X_n / Y_n \xrightarrow{d} X/c$, si $c \neq 0$.
:::

Más en general, el vector $(X_n, Y_n)$ converge en distribución a $(X, c)$, y por el teorema del mapeo continuo $h(X_n, Y_n) \xrightarrow{d} h(X, c)$ para toda función $h$ continua. La versión vectorial y matricial también vale: si $\mathbf{A}_n \xrightarrow{p} \mathbf{A}$, entonces $\mathbf{A}_n\mathbf{X}_n \xrightarrow{d} \mathbf{A}\mathbf{X}$.

:::nota[Qué significa cada símbolo]
- $X_n$: sucesión que converge en distribución a la variable $X$.
- $Y_n$: sucesión que converge en probabilidad a la constante $c$.
- $c$: constante real; en el cociente debe ser distinta de cero.
- $\xrightarrow{d}$, $\xrightarrow{p}$: convergencia en distribución y en probabilidad.
- $h$: función continua de dos variables.
- $\mathbf{A}_n$, $\mathbf{A}$: matrices aleatorias y su límite constante; $\mathbf{X}_n$, vectores aleatorios.
:::

## Cómo usar la visualización

Cada muestra de tamaño $n$ produce tres valores: el cociente $S/\sigma$ entre la desviación estándar muestral y la verdadera, la media estandarizada con $\sigma$ conocida, $Z_n$, y el estadístico $T_n$ que usa $S$ en lugar de $\sigma$. El histograma izquierdo muestra $S/\sigma$; el derecho, $T_n$, con el contorno de $Z_n$ y la normal estándar encima.

Con datos exponenciales y $n = 15$ el cociente $S/\sigma$ todavía es muy disperso y $T_n$ tiene colas más pesadas que la normal: la fracción con $|T_n| > 1.96$ supera 0.05. Al aumentar $n$ a 100, $S/\sigma$ se concentra en 1 y el histograma de $T_n$ coincide con el de $Z_n$ y con la normal.

## Ejemplo

Se miden los rendimientos de $n = 40$ parcelas, con media $\bar{x} = 5.2$ toneladas por hectárea y desviación estándar muestral $s = 1.6$. Se quiere contrastar $\mu = 4.8$ sin suponer normalidad.

1. Por el teorema central del límite, $Z_n = \sqrt{n}(\bar{X}_n - \mu)/\sigma \xrightarrow{d} \mathcal{N}(0, 1)$ si $\mu$ es la media verdadera.
2. Por la ley de los grandes números y el mapeo continuo, $S_n \xrightarrow{p} \sigma$, así que $\sigma/S_n \xrightarrow{p} 1$.
3. Por Slutsky, $T_n = Z_n \cdot \frac{\sigma}{S_n} \xrightarrow{d} 1 \cdot \mathcal{N}(0, 1)$.
4. Valor observado: $t = \frac{\sqrt{40}\,(5.2 - 4.8)}{1.6} = \frac{6.325 \cdot 0.4}{1.6} = 1.581$.
5. Valor $p$ bilateral aproximado: $2\big(1 - \Phi(1.581)\big) = 0.114$. Con $\alpha = 0.05$ no se rechaza $\mu = 4.8$.

:::figura[El estadístico t con datos no normales: con población uniforme y n = 40, el cociente S/σ ya está cerca de 1 y Tₙ es casi idéntico a Zₙ.]{componente="AsymptoticTransform"}
```yaml
modo: slutsky
variante: estadistico-t
poblacion:
  distribucion: uniforme
n: 40
```
:::

## Propiedades

- **Estadísticos estudentizados:** cualquier $\frac{\sqrt{n}(\hat{\theta}_n - \theta)}{\hat{\sigma}_n}$ con $\hat{\sigma}_n \xrightarrow{p} \sigma > 0$ hereda el límite normal de $\frac{\sqrt{n}(\hat{\theta}_n - \theta)}{\sigma}$.
- **Intervalos de Wald:** $\hat{\theta}_n \pm z_{\alpha/2}\,\hat{\sigma}_n/\sqrt{n}$ tiene cobertura asintótica $1 - \alpha$.
- **Términos despreciables:** si $Y_n \xrightarrow{p} 0$, entonces $X_n + Y_n$ y $X_n$ tienen el mismo límite; así se descartan restos de desarrollos de Taylor.
- **Corolario de equivalencia:** si $X_n - Y_n \xrightarrow{p} 0$ y $Y_n \xrightarrow{d} X$, entonces $X_n \xrightarrow{d} X$.
- **Es la base del método delta:** en su demostración, la derivada evaluada en un punto intermedio converge en probabilidad a $g'(\theta)$.

:::figura[Propiedad: con n grande el estadístico estudentizado se vuelve normal. Con datos exponenciales y n = 100, Tₙ y Zₙ casi coinciden.]{componente="AsymptoticTransform"}
```yaml
modo: slutsky
variante: estadistico-t
poblacion:
  distribucion: exponencial
n: 100
```
:::

:::demostracion
Para el producto con $c = 1$: $X_nY_n = X_n + X_n(Y_n - 1)$. Como $X_n$ converge en distribución, es acotada en probabilidad: para cada $\eta$ hay $M$ con $P(|X_n| > M) < \eta$ para todo $n$. Entonces $P(|X_n(Y_n - 1)| > \varepsilon) \le \eta + P(|Y_n - 1| > \varepsilon/M) \to \eta$, y como $\eta$ es arbitrario, $X_n(Y_n - 1) \xrightarrow{p} 0$. Sumar un término que tiende a cero en probabilidad no cambia el límite en distribución.
:::

## Errores comunes

- **Aplicarlo cuando $Y_n$ tiende a una variable aleatoria.** Si $X_n = Z$ e $Y_n = -Z$, ambas convergen en distribución a $\mathcal{N}(0, 1)$, pero $X_n + Y_n = 0$, no $\mathcal{N}(0, 2)$.
- **Olvidar que el resultado es asintótico.** Con muestras pequeñas de poblaciones asimétricas, el estadístico $t$ tiene colas más pesadas que la normal.
- **Dividir entre algo que tiende a cero.** Si $c = 0$, el cociente puede no converger.
- **Suponer que basta convergencia en distribución de $Y_n$ a una constante sin verificarla.** Hacia constantes, distribución y probabilidad son equivalentes, pero hay que probar una de las dos.

:::figura[Error común: el segundo término no tiende a una constante. Xₙ = Z e Yₙ = -Z son normales estándar, y su suma vale 0 siempre en lugar de seguir una N(0, 2).]{componente="AsymptoticTransform"}
```yaml
modo: slutsky
variante: contraejemplo
```
:::

:::figura[Error común: confiar en la normal con n pequeño. Con datos exponenciales y n = 6, S/σ está muy disperso y Tₙ tiene colas mucho más pesadas que la normal.]{componente="AsymptoticTransform"}
```yaml
modo: slutsky
variante: estadistico-t
poblacion:
  distribucion: exponencial
n: 6
```
:::

## Conexiones

Combina la [[convergencia-en-distribucion]] con la [[convergencia-en-probabilidad]] hacia una constante, la excepción descrita en [[relaciones-entre-modos-de-convergencia]]. Junto con el [[teorema-del-mapeo-continuo]] y el [[teorema-central-del-limite]] justifica el estadístico $t$ con datos no normales y los intervalos de Wald, y es el paso técnico central del [[metodo-delta]]. La consistencia de $S_n$ proviene de la [[ley-debil-de-los-grandes-numeros]].

## Formulario

:::formula[Teorema de Slutsky]
$$
X_n \xrightarrow{d} X,\ Y_n \xrightarrow{p} c \Rightarrow X_n + Y_n \xrightarrow{d} X + c,\ \ X_nY_n \xrightarrow{d} cX,\ \ \frac{X_n}{Y_n} \xrightarrow{d} \frac{X}{c}
$$

- $X_n$: converge en distribución a $X$.
- $Y_n$: converge en probabilidad a la constante $c$, distinta de cero en el cociente.
:::

:::formula[Estadístico t asintótico]
$$
T_n = \frac{\sqrt{n}\,(\bar{X}_n - \mu)}{S_n} \xrightarrow{d} \mathcal{N}(0, 1)
$$

- $\bar{X}_n$: media muestral.
- $\mu$: media poblacional.
- $S_n$: desviación estándar muestral.
- $n$: tamaño de muestra.
:::

:::formula[Intervalo de Wald]
$$
\hat{\theta}_n \pm z_{\alpha/2}\,\frac{\hat{\sigma}_n}{\sqrt{n}}
$$

- $\hat{\theta}_n$: estimador asintóticamente normal.
- $\hat{\sigma}_n$: estimador consistente de su desviación asintótica.
- $z_{\alpha/2}$: cuantil normal; 1.96 para 95 %.
:::

:::formula[Valor p bilateral aproximado]
$$
p \approx 2\big(1 - \Phi(|t|)\big)
$$

- $t$: valor observado del estadístico.
- $\Phi$: función de distribución normal estándar.
:::
