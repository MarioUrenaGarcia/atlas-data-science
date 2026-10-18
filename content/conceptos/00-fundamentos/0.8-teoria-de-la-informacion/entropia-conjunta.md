---
id: entropia-conjunta
titulo: Entropía conjunta
titulo_en: Joint entropy
alias:
  - entropía de un par de variables
  - H(X, Y)
modulo: 0
submodulo: '0.8'
orden: 3
nivel: intermedio
prerrequisitos:
  - entropia-de-shannon
  - independencia-de-eventos
etiquetas:
  - entropía
  - distribución conjunta
  - subaditividad
  - teoría de la información
resumen: >
  La entropía conjunta H(X, Y) es la incertidumbre del par de variables. Nunca supera la suma
  H(X) + H(Y) y la iguala solo cuando las variables son independientes.
formula: 'H(X, Y) = -\sum_{x, y} p(x, y) \log_2 p(x, y) \le H(X) + H(Y)'
visualizacion:
  componente: InformationViz
  parametros:
    modo: conjunta
    tabla:
      - [0.35, 0.1, 0.05]
      - [0.05, 0.15, 0.3]
    enfoque: conjunta
    filas: [seca, lluvias]
    columnas: [bajo, medio, alto]
referencias:
  - clave: cover-thomas
    capitulo: '2'
publicado: true
---

## Intuición

Para describir el clima de un día y el nivel de una presa hay que transmitir dos datos. Si no tuvieran nada que ver, la incertidumbre total sería la suma de las dos incertidumbres. Pero en temporada de lluvias la presa suele estar alta y en temporada seca, baja: conocer una cosa ya dice algo de la otra, y el par completo es menos incierto que la suma de sus partes.

La entropía conjunta mide la incertidumbre del par $(X, Y)$ tratado como una sola variable cuyos valores son las parejas posibles. Se calcula igual que la entropía de una variable, pero sobre la tabla de probabilidades conjuntas. La diferencia entre la suma $H(X) + H(Y)$ y la entropía conjunta mide lo que las dos variables comparten; esa diferencia es la información mutua.

## Definición

:::definicion[Entropía conjunta]
Sean $X$ y $Y$ variables discretas con función de masa conjunta $p(x, y)$. Su entropía conjunta es
$$
H(X, Y) = -\sum_{x \in \mathcal{X}} \sum_{y \in \mathcal{Y}} p(x, y) \log_2 p(x, y) = \mathbb{E}\left[-\log_2 p(X, Y)\right].
$$
Para $n$ variables, $H(X_1, \dots, X_n) = -\sum p(x_1, \dots, x_n) \log_2 p(x_1, \dots, x_n)$.
:::

Las marginales son $p(x) = \sum_y p(x, y)$ y $p(y) = \sum_x p(x, y)$, y con ellas se calculan $H(X)$ y $H(Y)$.

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias discretas.
- $\mathcal{X}$, $\mathcal{Y}$: sus conjuntos de valores.
- $p(x, y)$: probabilidad de que $X = x$ y $Y = y$ a la vez.
- $p(x)$, $p(y)$: funciones de masa marginales.
- $H(X, Y)$: entropía conjunta en bits.
- $X_1, \dots, X_n$: varias variables discretas.
:::

## Cómo usar la visualización

A la izquierda está la tabla conjunta con sus marginales; a la derecha, el diagrama de información: la barra de arriba es $H(X)$, la de en medio $H(Y)$ y la de abajo $H(X, Y)$. El tramo resaltado, común a las dos primeras, es la información compartida. La reproducción parte de la tabla independiente con las mismas marginales y la deforma hasta la tabla dada.

En la tabla de temporada y nivel de la presa, al inicio $H(X, Y) = 2.559$, la suma exacta $H(X) + H(Y) = 1 + 1.559$. Al final de la animación baja a 2.226 bits: la barra de abajo se acorta en 0.333 bits, el tramo compartido.

## Ejemplo

En una ciudad, las probabilidades de lluvia y de tráfico lento en una mañana son:

| | lento | fluido |
| --- | --- | --- |
| lluvia | 0.2 | 0.05 |
| sin lluvia | 0.1 | 0.65 |

1. Términos de la conjunta: $0.2 \log_2 \frac{1}{0.2} = 0.464$, $0.05 \log_2 \frac{1}{0.05} = 0.216$, $0.1 \log_2 \frac{1}{0.1} = 0.332$ y $0.65 \log_2 \frac{1}{0.65} = 0.404$. Suma: $H(X, Y) = 1.417$ bits.
2. Marginales: lluvia 0.25 y sin lluvia 0.75, de modo que $H(X) = H_b(0.25) = 0.811$; tráfico lento 0.3 y fluido 0.7, de modo que $H(Y) = H_b(0.3) = 0.881$.
3. La suma de las marginales es $1.692$ bits y la conjunta es $1.417$: el par es 0.276 bits menos incierto de lo que sería con variables independientes.

:::figura[Lluvia y tráfico: con la tabla independiente de mismas marginales, H(X, Y) vale 1.692 bits; al llegar a la tabla real baja a 1.417 bits y aparece el tramo compartido de 0.276 bits.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.2, 0.05]
  - [0.1, 0.65]
enfoque: conjunta
filas: [lluvia, seco]
columnas: [lento, fluido]
```
:::

## Propiedades

- **Cotas:** $\max\{H(X), H(Y)\} \le H(X, Y) \le H(X) + H(Y)$.
- **Subaditividad con igualdad en la independencia:** $H(X, Y) = H(X) + H(Y)$ si y solo si $X$ y $Y$ son independientes.

:::figura[Dos volados independientes: la tabla tiene 0.25 en cada casilla, H(X, Y) = 2 bits = 1 + 1 y las barras de H(X) y H(Y) no se traslapan en ningún momento de la animación.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.25, 0.25]
  - [0.25, 0.25]
enfoque: conjunta
filas: [cara, cruz]
columnas: [cara, cruz]
```
:::

- **Dependencia total:** si $Y$ es función de $X$, $H(X, Y) = H(X)$; la segunda variable no agrega incertidumbre.

:::figura[Un interruptor y su foco, que se enciende solo si el interruptor está arriba: la tabla tiene 0.5 en la diagonal y H(X, Y) termina en 1 bit, igual a H(X); las barras de H(X) y H(Y) acaban traslapadas por completo.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.5, 0]
  - [0, 0.5]
enfoque: conjunta
filas: [arriba, abajo]
columnas: [encendido, apagado]
```
:::

- **Regla de la cadena:** $H(X, Y) = H(X) + H(Y \mid X)$, y para $n$ variables $H(X_1, \dots, X_n) = \sum_i H(X_i \mid X_1, \dots, X_{i-1})$.
- **Simetría:** $H(X, Y) = H(Y, X)$.

## Errores comunes

- **Sumar las entropías marginales para obtener la conjunta.** La suma solo es correcta con variables independientes; en general la sobrestima por la información mutua.
- **Calcular la conjunta a partir de las marginales.** Dos tablas con las mismas marginales pueden tener entropías conjuntas distintas; la conjunta necesita la tabla completa, como muestra la visualización principal, cuyas marginales no cambian durante la animación.

:::figura[Dos variables con marginales de volado justo, como en la tabla independiente, pero con 0.3 en la diagonal: la entropía conjunta baja de 2 a 1.971 bits aunque ninguna marginal cambie.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.3, 0.2]
  - [0.2, 0.3]
enfoque: conjunta
filas: [x1, x2]
columnas: [y1, y2]
```
:::

- **Pensar que $H(X, Y)$ puede ser menor que $H(X)$.** Observar el par nunca da menos información que observar una de sus partes.

## Conexiones

Extiende la [[entropia-de-shannon]] a parejas de variables. La diferencia con la suma de marginales es la [[informacion-mutua]], y la regla de la cadena la descompone con la [[entropia-condicional]]. La igualdad con la suma caracteriza la independencia, que en eventos es la [[independencia-de-eventos]].

## Formulario

:::formula[Entropía conjunta]
$$
H(X, Y) = -\sum_{x, y} p(x, y) \log_2 p(x, y)
$$

- $X$, $Y$: variables discretas; $p(x, y)$: su función de masa conjunta; $H(X, Y)$: entropía del par en bits.
:::

:::formula[Cotas]
$$
\max\{H(X), H(Y)\} \le H(X, Y) \le H(X) + H(Y)
$$

- $H(X)$, $H(Y)$: entropías marginales; la cota superior es igualdad solo con independencia.
:::

:::formula[Regla de la cadena]
$$
H(X, Y) = H(X) + H(Y \mid X)
$$

- $H(Y \mid X)$: entropía condicional de $Y$ dado $X$.
:::
