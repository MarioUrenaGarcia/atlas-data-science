---
id: lema-de-fatou
titulo: Lema de Fatou
titulo_en: Fatou's lemma
alias:
  - desigualdad de Fatou
  - lema de Fatou para integrales
modulo: 0
submodulo: '0.9'
orden: 10
nivel: avanzado
prerrequisitos:
  - teorema-de-convergencia-monotona
relaciones:
  - tipo: relacionado
    id: teorema-de-convergencia-dominada
etiquetas:
  - teoremas de límite
  - límite inferior
  - integración
  - teoría de la medida
resumen: >
  Para funciones medibles no negativas, la integral del límite inferior es a lo más el límite inferior de
  las integrales. En el paso al límite se puede perder masa, pero nunca ganarla.
formula: '\int \liminf_{n \to \infty} f_n\,d\mu \;\le\; \liminf_{n \to \infty} \int f_n\,d\mu, \qquad f_n \ge 0'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: sucesion
    caso: alternante
    enfoque: fatou
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Un reflector ilumina alternadamente la mitad izquierda y la mitad derecha de un escenario. En cada instante la mitad del escenario está iluminada, pero ningún punto está iluminado siempre: si se pregunta qué luz tiene garantizada cada punto a la larga, la respuesta es ninguna. La luz garantizada en el límite es menor que la luz que hay en cada instante.

El lema de Fatou dice que esta pérdida es la única posibilidad. La integral del límite inferior, lo que cada punto conserva a la larga, nunca supera el límite inferior de las integrales, lo que hay en total en los mejores momentos. Puede haber desigualdad estricta cuando la masa se mueve o se concentra, pero la masa no puede aparecer de la nada en el límite.

No pide monotonía, ni cota, ni siquiera que la sucesión converja; solo que las funciones sean no negativas. Por esa generalidad es la herramienta para probar el teorema de convergencia dominada y para acotar integrales de límites en probabilidad.

## Definición

:::teorema[Lema de Fatou]
Sea $(\Omega, \mathcal{F}, \mu)$ un espacio de medida y sean $f_n \ge 0$ funciones medibles. Entonces
$$
\int \liminf_{n \to \infty} f_n\,d\mu \;\le\; \liminf_{n \to \infty} \int f_n\,d\mu.
$$
:::

El límite inferior puntual es $\liminf_n f_n(x) = \lim_{n \to \infty} \inf_{k \ge n} f_k(x)$, y el de las integrales se define igual con la sucesión numérica $\int f_n\,d\mu$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $f_n$: funciones medibles no negativas.
- $\liminf_n f_n$: límite inferior puntual, el valor que $f_n(x)$ termina superando siempre.
- $\inf_{k \ge n} f_k(x)$: mínimo de la cola de la sucesión en el punto $x$.
- $\liminf_n \int f_n\,d\mu$: límite inferior de la sucesión de integrales.
:::

:::demostracion
Sea $g_n = \inf_{k \ge n} f_k$. Las $g_n$ son medibles, no negativas, crecen hacia $\liminf f_n$ y cumplen $g_n \le f_k$ para $k \ge n$, así que $\int g_n \le \inf_{k \ge n}\int f_k$. Por el teorema de convergencia monótona, $\int \liminf f_n = \lim \int g_n \le \liminf \int f_n$.
:::

## Cómo usar la visualización

A la izquierda, la sucesión alterna entre la indicadora de $[0, 1/2)$ y la de $[1/2, 1)$; la línea punteada es el límite inferior puntual. A la derecha, la integral de cada término. El encabezado compara los dos lados de la desigualdad. La reproducción avanza hasta $n = 16$.

Cada término tiene integral 0.5 y los puntos de la derecha forman una línea horizontal. Pero cada punto del intervalo vale 0 en la mitad de los términos, así que el límite inferior puntual es 0 en todas partes. La desigualdad se lee $0 \le 0.5$: estricta.

## Ejemplo

Se aplica el lema a $f_n = n\,\mathbf{1}_{(0, 1/n)}$ en $[0, 1]$.

1. Para cada $x > 0$, en cuanto $n > 1/x$ se tiene $f_n(x) = 0$; así $\liminf_n f_n(x) = 0$.
2. Lado izquierdo: $\int \liminf f_n\,d\lambda = 0$.
3. Cada integral vale $n \cdot (1/n) = 1$, así que el lado derecho es $\liminf_n 1 = 1$.
4. La desigualdad $0 \le 1$ es estricta: toda la masa se concentra cerca de 0 y se pierde en el límite.

:::figura[Escalones cada vez más altos y angostos con el enfoque de Fatou: la integral del límite inferior es 0 y la de cada término es 1, así que la desigualdad se cumple con holgura.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: escalon-alto
enfoque: fatou
```
:::

## Propiedades

- **Sin hipótesis de convergencia:** vale para cualquier sucesión no negativa.
- **Igualdad bajo monotonía o dominación:** con crecimiento (convergencia monótona) o con una cota integrable (convergencia dominada) la desigualdad se vuelve igualdad.

:::figura[Potencias $x^n$ con el enfoque de Fatou: el límite inferior puntual es 0 salvo en x = 1 y el de las integrales también es 0; con una cota integrable la desigualdad es igualdad.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: potencias
enfoque: fatou
```
:::

- **Versión para el límite superior:** si $f_n \le g$ con $\int g < \infty$, entonces $\limsup_n \int f_n \le \int \limsup_n f_n$.
- **Probabilidad:** para eventos, $P(\liminf_n A_n) \le \liminf_n P(A_n)$.

## Errores comunes

- **Invertir la desigualdad.** El lema no afirma $\int \liminf f_n \ge \liminf \int f_n$; con los escalones del ejemplo esa versión diría $0 \ge 1$. La masa se puede perder en el límite, no ganar.
- **Aplicarlo a funciones con signo.** Con $f_n = -n\,\mathbf{1}_{(0, 1/n)}$ el límite inferior es 0, con integral 0, mientras cada integral vale $-1$: la desigualdad $0 \le -1$ es falsa.
- **Confundir límite inferior puntual con el límite inferior de las integrales.** Son dos operaciones distintas; el lema compara justamente la integral de una con la otra.

:::figura[La sucesión alternante con el enfoque de límite: las integrales se quedan en 0.5, pero no hay límite puntual; el lema de Fatou es la herramienta que todavía dice algo, 0 menor o igual que 0.5.]{componente="MeasureLab"}
```yaml
modo: sucesion
caso: alternante
enfoque: limite
```
:::

## Conexiones

Se demuestra con el [[teorema-de-convergencia-monotona]] y sirve para probar el [[teorema-de-convergencia-dominada]]. Trabaja con la [[integral-de-lebesgue]] y con el límite inferior de [[sucesiones]], y en probabilidad da cotas para límites de esperanzas y probabilidades.

## Formulario

:::formula[Lema de Fatou]
$$
\int \liminf_{n} f_n\,d\mu \le \liminf_{n}\int f_n\,d\mu
$$

- $f_n \ge 0$ medibles; $\mu$: medida; $\liminf$: límite inferior.
:::

:::formula[Límite inferior puntual]
$$
\liminf_{n} f_n(x) = \lim_{n \to \infty}\inf_{k \ge n} f_k(x)
$$

- $\inf_{k \ge n}$: ínfimo de la cola de la sucesión desde el índice $n$.
:::

:::formula[Versión para eventos]
$$
P\Big(\liminf_{n} A_n\Big) \le \liminf_{n} P(A_n)
$$

- $A_n$: eventos; $\liminf_n A_n$: puntos que pertenecen a todos los $A_n$ desde algún índice.
:::
