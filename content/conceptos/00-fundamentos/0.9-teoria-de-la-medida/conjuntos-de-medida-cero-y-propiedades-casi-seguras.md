---
id: conjuntos-de-medida-cero-y-propiedades-casi-seguras
titulo: Conjuntos de medida cero y propiedades casi seguras
titulo_en: Null sets and almost sure properties
alias:
  - conjunto nulo
  - casi en todas partes
  - c.t.p.
  - casi seguramente
  - c.s.
modulo: 0
submodulo: '0.9'
orden: 5
nivel: avanzado
prerrequisitos:
  - medida-de-lebesgue
  - serie-geometrica
etiquetas:
  - teoría de la medida
  - conjuntos nulos
  - casi seguro
  - igualdad casi en todas partes
resumen: >
  Un conjunto de medida cero es invisible para la medida. Una propiedad vale casi en todas partes, o casi
  seguramente, si falla solo en un conjunto de medida cero; así, funciones iguales c.t.p. tienen la misma integral.
formula: 'P \text{ vale } \mu\text{-c.t.p.} \iff \mu(\{\omega : P(\omega) \text{ falla}\}) = 0'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: casi-seguro
    funcion: raiz
    puntos: 25
referencias:
  - clave: durrett
  - clave: wasserman
publicado: true
---

## Intuición

Al lanzar un dardo ideal al intervalo $[0, 1]$, la probabilidad de caer exactamente en $0.5$ es cero, y lo mismo pasa con cualquier punto, con cualquier lista numerable de puntos y con conjuntos más raros como el de Cantor. Esos conjuntos no son imposibles: el dardo cae en algún punto, y ese punto tenía probabilidad cero. Pero son despreciables para cualquier cálculo de probabilidad, área o promedio.

La teoría de la medida aprovecha esa invisibilidad. Si dos funciones solo difieren en un conjunto de medida cero, tienen la misma integral; si una sucesión converge salvo en un conjunto de medida cero, se dice que converge casi seguramente. En lugar de "siempre" se dice "casi en todas partes", abreviado c.t.p., o en probabilidad "casi seguramente", c.s.

Es una relajación cómoda y precisa: permite ignorar los puntos problemáticos sin cambiar ningún resultado que dependa de integrales.

## Definición

:::definicion[Conjunto nulo y propiedad casi segura]
En un espacio de medida $(\Omega, \mathcal{F}, \mu)$, un conjunto $N \in \mathcal{F}$ es nulo si $\mu(N) = 0$. Una propiedad $P(\omega)$ vale casi en todas partes si existe un conjunto nulo $N$ tal que $P(\omega)$ se cumple para todo $\omega \notin N$. En particular, $f = g$ c.t.p. significa $\mu(\{\omega : f(\omega) \ne g(\omega)\}) = 0$.
:::

En un espacio de probabilidad se dice casi seguramente: $X_n \to X$ c.s. si $P(\{\omega : X_n(\omega) \to X(\omega)\}) = 1$.

:::nota[Qué significa cada símbolo]
- $(\Omega, \mathcal{F}, \mu)$: espacio de medida.
- $N$: conjunto nulo, de medida cero.
- $P(\omega)$: propiedad que puede cumplirse o no en cada punto $\omega$.
- $f$, $g$: funciones medibles.
- $X_n$, $X$: variables aleatorias.
- $P$: medida de probabilidad.
- c.t.p.: casi en todas partes; c.s.: casi seguramente.
:::

## Cómo usar la visualización

La curva es $f(x) = \sqrt{x}$ y el área sombreada, su integral. La función $g$ coincide con $f$ salvo en los racionales marcados, donde se desplaza 0.4 hacia arriba o hacia abajo; la reproducción cambia un racional más en cada paso, hasta 25. Las lecturas comparan las integrales.

Por más puntos que se cambien, el conjunto donde $f$ y $g$ difieren es numerable y mide cero, y las dos integrales siguen valiendo 0.6667. Los puntos resaltados se acumulan, pero el área no cambia.

## Ejemplo

Se compara $f(x) = x^2$ con la función $g$ que vale 1 en cada racional de $[0, 1]$ y $x^2$ en los irracionales.

1. $\{x : f(x) \ne g(x)\} \subseteq [0, 1] \cap \mathbb{Q}$, que mide cero.
2. Por lo tanto $f = g$ c.t.p. y $\int_0^1 g\,d\lambda = \int_0^1 x^2\,dx = 1/3$.
3. En cambio, $g$ no es integrable según Riemann: en cada subintervalo toma valores cercanos a 1 en los racionales y menores en los irracionales, así que las sumas superiores e inferiores no se acercan.

:::figura[f(x) = x² cambiada en 25 racionales: el área bajo la curva, 0.3333, es la misma para f y para g aunque g tenga cada vez más saltos.]{componente="MeasureLab"}
```yaml
modo: casi-seguro
funcion: cuadrado
puntos: 25
```
:::

## Propiedades

- **Uniones numerables:** una unión numerable de conjuntos nulos es nula, por la subaditividad.
- **Integrales:** si $f = g$ c.t.p., entonces $\int f\,d\mu = \int g\,d\mu$; si $f \ge 0$ y $\int f\,d\mu = 0$, entonces $f = 0$ c.t.p.
- **Conjuntos nulos no numerables:** el conjunto de Cantor mide cero y tiene tantos puntos como $[0, 1]$.

:::figura[Cantor en el nivel 4: 16 intervalos con longitud total 0.198; al continuar, la longitud tiende a cero mientras siempre quedan puntos.]{componente="MeasureLab"}
```yaml
modo: cantor
nivel: 4
```
:::

- **Relación de equivalencia:** la igualdad c.t.p. es reflexiva, simétrica y transitiva; los espacios $L^p$ se forman con sus clases de equivalencia.
- **Probabilidad cero no es imposibilidad:** un evento de probabilidad cero puede ocurrir; un evento casi seguro puede fallar.

## Errores comunes

- **Leer "casi seguramente" como "siempre".** Que una variable continua sea distinta de 0.5 c.s. no impide que en una realización valga 0.5.
- **Pensar que los conjuntos nulos son pequeños en todo sentido.** El conjunto de Cantor es no numerable, y los racionales son densos; los dos miden cero.
- **Olvidar que "c.t.p." depende de la medida.** Para la medida de conteo solo el vacío es nulo, y "c.t.p." significa "en todas partes".
- **Cambiar una función en un conjunto de medida positiva.** Si se cambia en un intervalo, por pequeño que sea, la integral sí cambia.

:::figura[Escalón de 0.3 a 0.8 cambiado en 25 racionales: aunque cada cambio mueve el valor 0.4, la integral sigue en 0.55, porque los puntos cambiados no tienen longitud.]{componente="MeasureLab"}
```yaml
modo: casi-seguro
funcion: escalon
puntos: 25
```
:::

## Conexiones

Los conjuntos nulos de la [[medida-de-lebesgue]] se obtienen con cubrimientos cuya longitud es una [[serie-geometrica]]. La [[integral-de-lebesgue]] no distingue funciones iguales c.t.p., los teoremas de convergencia como el [[teorema-de-convergencia-dominada]] solo piden convergencia c.t.p., y los [[espacios-lp]] identifican funciones iguales c.t.p. El [[teorema-de-radon-nikodym]] se formula con la continuidad absoluta, que se define con conjuntos nulos.

## Formulario

:::formula[Propiedad casi en todas partes]
$$
P \text{ vale c.t.p.} \iff \exists N,\ \mu(N) = 0,\ P(\omega) \text{ vale para } \omega \notin N
$$

- $P$: propiedad; $N$: conjunto nulo; $\mu$: medida.
:::

:::formula[Igualdad casi en todas partes]
$$
f = g \ \text{c.t.p.} \iff \mu(\{f \ne g\}) = 0 \;\Longrightarrow\; \int f\,d\mu = \int g\,d\mu
$$

- $f$, $g$: funciones medibles integrables; $\{f \ne g\}$: conjunto donde difieren.
:::

:::formula[Uniones numerables de nulos]
$$
\mu\Big(\bigcup_{n} N_n\Big) \le \sum_n \mu(N_n) = 0
$$

- $N_n$: conjuntos de medida cero.
:::
