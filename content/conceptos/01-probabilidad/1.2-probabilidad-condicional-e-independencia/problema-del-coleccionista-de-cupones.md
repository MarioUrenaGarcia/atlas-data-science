---
id: problema-del-coleccionista-de-cupones
titulo: Problema del coleccionista de cupones
titulo_en: Coupon collector's problem
alias:
  - problema del álbum
  - coleccionista de estampas
modulo: 1
submodulo: '1.2'
orden: 19
nivel: basico
prerrequisitos:
  - independencia-de-eventos
  - serie-geometrica
relaciones:
  - tipo: relacionado
    id: paradoja-del-cumpleanos
etiquetas:
  - tiempos de espera
  - número armónico
  - álbumes
  - colecciones
resumen: >
  Para reunir los n cupones de una colección, si cada compra da uno al azar, se necesitan en promedio
  n por el número armónico H_n compras, cerca de n log n: los últimos cupones son los más costosos.
formula: '\mathbb{E}[T] = n\left(1 + \frac{1}{2} + \cdots + \frac{1}{n}\right) = n H_n \approx n \log n'
visualizacion:
  componente: CouponCollector
  parametros:
    cupones: 10
    colecciones: 300
referencias:
  - clave: blitzstein-hwang
    capitulo: '4'
  - clave: ross-probabilidad
    capitulo: '7'
publicado: true
---

## Intuición

Un álbum del mundial tiene 640 estampas, y cada sobre trae una al azar. Las primeras compras casi siempre dan estampas nuevas, pero conforme el álbum se llena, la mayoría de las estampas que salen ya se tienen. Para conseguir la última, cuando solo falta una, hay que comprar en promedio 640 sobres.

El problema del coleccionista de cupones calcula cuántas compras se necesitan en total. La idea es partir la colección en etapas: la etapa $k$ empieza cuando ya se tienen $k - 1$ cupones distintos y termina al obtener uno nuevo. En esa etapa cada compra da un cupón nuevo con probabilidad $(n - k + 1)/n$, así que en promedio se necesitan $n/(n - k + 1)$ compras. Sumando todas las etapas se obtiene $n(1 + 1/2 + \cdots + 1/n)$.

Esa suma, el número armónico, crece como el logaritmo de $n$. Por eso el total crece un poco más rápido que $n$: completar una colección de 640 estampas requiere en promedio unas 4500 compras, siete veces el tamaño del álbum.

## Definición

Hay $n$ tipos de cupón. Cada compra da uno de ellos, elegido de manera uniforme e independiente de las demás compras. Sea $T$ el número de compras necesarias para tener los $n$ tipos.

:::teorema[Coleccionista de cupones]
$$
\mathbb{E}[T] = \sum_{k=1}^{n} \frac{n}{n - k + 1} = n H_n, \qquad H_n = \sum_{j=1}^{n} \frac{1}{j},
$$
$$
\operatorname{Var}(T) = \sum_{k=1}^{n} \frac{1 - p_k}{p_k^2}, \qquad p_k = \frac{n - k + 1}{n}.
$$
:::

:::demostracion
Sea $T_k$ el número de compras de la etapa $k$, desde que se tienen $k - 1$ tipos hasta obtener uno nuevo. Cada compra de la etapa es independiente y da un tipo nuevo con probabilidad $p_k$, así que $P(T_k = j) = (1 - p_k)^{j-1}p_k$. Por la serie geométrica, su promedio es $1/p_k$. Como $T = T_1 + \cdots + T_n$, el promedio de $T$ es la suma de los promedios. La varianza se obtiene sumando las varianzas, porque las etapas son independientes.
:::

El promedio $\mathbb{E}[T]$ es la esperanza de $T$, que se estudia formalmente en el submódulo de variables aleatorias; aquí basta leerlo como el número promedio de compras en muchas repeticiones.

:::figura[Una colección de 6 tipos, como las caras de un dado: en promedio se necesitan 14.7 lanzamientos para ver todas las caras, con mucha variación entre colecciones.]{componente="CouponCollector"}
```yaml
cupones: 6
colecciones: 400
```
:::

:::nota[Qué significa cada símbolo]
- $n$: número de tipos de cupón.
- $T$: número de compras hasta completar la colección.
- $T_k$: compras de la etapa $k$, mientras se busca el $k$-ésimo tipo distinto.
- $p_k = (n - k + 1)/n$: probabilidad de que una compra dé un tipo nuevo en la etapa $k$.
- $H_n$: número armónico, $1 + 1/2 + \cdots + 1/n$.
- $\mathbb{E}[T]$: número promedio de compras (esperanza); $\operatorname{Var}(T)$: su varianza.
- $\log$: logaritmo natural; $\gamma \approx 0.5772$: constante de Euler-Mascheroni.
:::

## Cómo usar la visualización

Las casillas representan los tipos de cupón. Cada compra pone un número en la casilla del tipo obtenido (cuántas veces ha salido) y marca el último. El encabezado indica cuántos tipos se tienen y cuántas compras se esperan para conseguir el siguiente nuevo: el valor crece mucho al final. Al completar una colección, el número de compras se agrega al histograma, que se compara con la esperanza $nH_n$.

Con 10 tipos, la esperanza es 29.3 compras, y el histograma tiene una cola larga a la derecha: algunas colecciones requieren más de 60. Con 30 tipos, la esperanza sube a 120: triplicar la colección cuadruplica las compras.

## Ejemplo

Un restaurante de comida rápida regala una de 8 figuras distintas en cada paquete infantil. ¿Cuántos paquetes hay que comprar, en promedio, para tener las 8?

1. Etapa 1: la primera figura siempre es nueva, 1 paquete.
2. Etapa 2: probabilidad $7/8$ de nueva, en promedio $8/7$ paquetes.
3. En general, la etapa $k$ requiere en promedio $8/(9 - k)$ paquetes.
4. Total: $8\left(1 + \frac{1}{2} + \frac{1}{3} + \cdots + \frac{1}{8}\right) = 8 \cdot 2.718 \approx 21.7$ paquetes.
5. Las últimas dos figuras requieren en promedio $8/2 + 8/1 = 12$ paquetes, más de la mitad del total.

:::figura[La colección de 8 figuras del ejemplo: el histograma de paquetes necesarios se concentra cerca de 21.7, con colecciones que necesitan más de 40.]{componente="CouponCollector"}
```yaml
cupones: 8
colecciones: 400
```
:::

## Propiedades

- **Crecimiento:** $H_n \approx \log n + \gamma$, de modo que $\mathbb{E}[T] \approx n \log n + \gamma n$.
- **Dispersión:** la desviación estándar de $T$ es cercana a $\pi n/\sqrt{6} \approx 1.28\,n$, del mismo orden que la diferencia entre $n \log n$ y $n$.
- **Las últimas etapas dominan:** la etapa final requiere en promedio $n$ compras, más que las primeras $n/2$ etapas juntas, que suman cerca de $n \log 2 \approx 0.69\,n$.
- **Intercambio de cupones:** si varios coleccionistas comparten cupones repetidos, el número total de compras por persona baja considerablemente.
- **Probabilidades no uniformes:** si algunos cupones son más raros, la esperanza aumenta; el tipo más raro domina el tiempo de espera.

:::figura[Una colección grande de 50 tipos: la esperanza es 225 compras y la desviación estándar cerca de 62. Las primeras casillas se llenan rápido y las últimas tardan mucho.]{componente="CouponCollector"}
```yaml
cupones: 50
colecciones: 200
```
:::

## Errores comunes

- **Esperar completar la colección con unas $n$ compras.** Con $n$ compras, en promedio se tiene solo cerca del 63 % de los tipos ($1 - (1 - 1/n)^n \approx 1 - e^{-1}$).
- **Pensar que cada etapa cuesta lo mismo.** La etapa $k$ cuesta $n/(n - k + 1)$ compras en promedio: 1 al principio y $n$ al final.
- **Confundir con la paradoja del cumpleaños.** Ver un cupón repetido ocurre pronto (unas $1.25\sqrt{n}$ compras); ver todos los tipos tarda unas $n \log n$.

:::figura[Con solo 2 tipos de cupón la esperanza es 3 compras: la primera siempre es nueva y la segunda etapa sigue una espera geométrica con probabilidad 1/2.]{componente="CouponCollector"}
```yaml
cupones: 2
colecciones: 400
```
:::

## Conexiones

El problema descompone el tiempo total en etapas independientes de espera, cada una con probabilidades de [[independencia-de-eventos]] y promedios que se calculan con la [[serie-geometrica]]. Su contraparte es la [[paradoja-del-cumpleanos]], que mide cuándo aparece la primera repetición en lugar de cuándo se completa la colección. Formalmente, $T$ es una suma de variables geométricas, y su esperanza usa la linealidad de la esperanza; el número armónico aparece también en el análisis de algoritmos y en el problema de la secretaria.

## Formulario

:::formula[Compras esperadas]
$$
\mathbb{E}[T] = n H_n = n \sum_{j=1}^{n} \frac{1}{j}
$$

- $n$: número de tipos; $H_n$: número armónico.
:::

:::formula[Etapa k]
$$
\mathbb{E}[T_k] = \frac{1}{p_k} = \frac{n}{n - k + 1}
$$

- $p_k$: probabilidad de obtener un tipo nuevo cuando ya se tienen $k - 1$.
:::

:::formula[Varianza]
$$
\operatorname{Var}(T) = \sum_{k=1}^{n} \frac{1 - p_k}{p_k^2}
$$

- Suma de las varianzas de las esperas geométricas de cada etapa.
:::

:::formula[Aproximación asintótica]
$$
\mathbb{E}[T] \approx n \log n + \gamma\,n + \tfrac{1}{2}
$$

- $\log$: logaritmo natural; $\gamma \approx 0.5772$.
:::

:::formula[Tipos distintos tras n compras]
$$
\text{proporción esperada} = 1 - \left(1 - \frac{1}{n}\right)^{n} \approx 1 - e^{-1} \approx 0.632
$$

- Probabilidad de que un tipo dado haya salido al menos una vez en $n$ compras.
:::
