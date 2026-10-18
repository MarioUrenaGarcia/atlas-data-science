---
id: informacion-mutua
titulo: Información mutua
titulo_en: Mutual information
alias:
  - I(X; Y)
  - información compartida
  - ganancia de información
modulo: 0
submodulo: '0.8'
orden: 5
nivel: intermedio
prerrequisitos:
  - entropia-condicional
etiquetas:
  - información mutua
  - dependencia
  - entropía
  - teoría de la información
resumen: >
  La información mutua I(X; Y) = H(X) - H(X | Y) es lo que una variable dice de la otra. Es simétrica,
  no negativa y vale cero exactamente cuando las variables son independientes.
formula: 'I(X; Y) = H(X) + H(Y) - H(X, Y) = \sum_{x, y} p(x, y) \log_2 \frac{p(x, y)}{p(x)\,p(y)}'
visualizacion:
  componente: InformationViz
  parametros:
    modo: conjunta
    tabla:
      - [0.3, 0.05, 0.05]
      - [0.05, 0.2, 0.05]
      - [0.02, 0.03, 0.25]
    enfoque: mutua
    filas: [sol, nublado, lluvia]
    columnas: [sol, nublado, lluvia]
referencias:
  - clave: cover-thomas
    capitulo: '2'
  - clave: murphy
publicado: true
---

## Intuición

Un pronóstico del tiempo vale por lo que dice del clima real. Si acierta siempre, conocer el pronóstico equivale a conocer el clima; si no tiene relación con lo que pasa, no sirve de nada. La información mutua mide ese valor en bits: cuánto se reduce, en promedio, la incertidumbre sobre una variable al conocer la otra.

Tiene una lectura gráfica. Si la incertidumbre de cada variable se dibuja como una barra, el par completo ocupa menos que las dos barras juntas, porque parte de la incertidumbre es común. Ese traslape es la información mutua: lo que $X$ y $Y$ comparten. Por eso es simétrica: el pronóstico dice del clima exactamente lo mismo que el clima dice del pronóstico.

A diferencia de la correlación, detecta cualquier tipo de dependencia, no solo la lineal, y vale cero solo cuando las variables son independientes.

## Definición

:::definicion[Información mutua]
Sean $X$ y $Y$ variables discretas con función de masa conjunta $p(x, y)$ y marginales $p(x)$ y $p(y)$. Su información mutua es
$$
I(X; Y) = \sum_{x, y} p(x, y) \log_2 \frac{p(x, y)}{p(x)\,p(y)}.
$$
Equivale a
$$
I(X; Y) = H(X) - H(X \mid Y) = H(Y) - H(Y \mid X) = H(X) + H(Y) - H(X, Y).
$$
:::

Es la divergencia de Kullback-Leibler entre la conjunta y el producto de sus marginales: $I(X; Y) = D_{\mathrm{KL}}\big(p(x, y) \,\|\, p(x)\,p(y)\big)$.

:::nota[Qué significa cada símbolo]
- $X$, $Y$: variables aleatorias discretas.
- $p(x, y)$: probabilidad conjunta; $p(x)$, $p(y)$: marginales.
- $I(X; Y)$: información mutua en bits.
- $H(X)$, $H(Y)$: entropías marginales; $H(X, Y)$: entropía conjunta.
- $H(X \mid Y)$, $H(Y \mid X)$: entropías condicionales.
- $D_{\mathrm{KL}}$: divergencia de Kullback-Leibler.
:::

## Cómo usar la visualización

La tabla cruza el pronóstico (filas) con el clima observado (columnas). En el diagrama, la barra de arriba es $H(X)$, la de en medio $H(Y)$ y el tramo que comparten, resaltado, es $I(X; Y)$; la barra de abajo es $H(X, Y)$. El encabezado calcula $H(X) + H(Y) - H(X, Y)$. La reproducción parte de la tabla independiente con las mismas marginales y llega a la tabla real.

Al inicio el traslape es cero y $H(X, Y) = 3.146$, la suma de las marginales. Al final el pronóstico comparte 0.531 bits con el clima, una tercera parte de los 1.571 bits de incertidumbre del pronóstico.

## Ejemplo

En un ensayo, $X$ indica si un paciente recibió un medicamento y $Y$ si se recuperó en una semana:

| | se recupera | no se recupera |
| --- | --- | --- |
| medicamento | 0.4 | 0.1 |
| placebo | 0.2 | 0.3 |

1. Marginales: $p(x) = (0.5, 0.5)$ y $p(y) = (0.6, 0.4)$, con $H(X) = 1$ y $H(Y) = H_b(0.6) = 0.971$ bits.
2. Conjunta: $H(X, Y) = 0.4 \cdot 1.322 + 0.1 \cdot 3.322 + 0.2 \cdot 2.322 + 0.3 \cdot 1.737 = 0.529 + 0.332 + 0.464 + 0.521 = 1.846$ bits.
3. $I(X; Y) = 1 + 0.971 - 1.846 = 0.125$ bits.
4. Con la fórmula directa: $0.4 \log_2 \frac{0.4}{0.3} + 0.1 \log_2 \frac{0.1}{0.2} + 0.2 \log_2 \frac{0.2}{0.3} + 0.3 \log_2 \frac{0.3}{0.2} = 0.166 - 0.1 - 0.117 + 0.175 = 0.125$.

Saber qué recibió el paciente reduce la incertidumbre sobre su recuperación de 0.971 a 0.846 bits.

:::figura[Medicamento y recuperación: el traslape entre las barras crece de cero a 0.125 bits al pasar de la tabla independiente a la del ensayo.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.4, 0.1]
  - [0.2, 0.3]
enfoque: mutua
filas: [medicamento, placebo]
columnas: [recupera, no]
```
:::

## Propiedades

- **No negatividad e independencia:** $I(X; Y) \ge 0$, con igualdad si y solo si $X$ y $Y$ son independientes.

:::figura[Una tabla que es producto de sus marginales, 0.4 y 0.6 por 0.3 y 0.7: la información mutua es cero durante toda la animación y las barras de H(X) y H(Y) no se traslapan.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.12, 0.28]
  - [0.18, 0.42]
enfoque: mutua
filas: [x1, x2]
columnas: [y1, y2]
```
:::

- **Simetría:** $I(X; Y) = I(Y; X)$.
- **Cota:** $I(X; Y) \le \min\{H(X), H(Y)\}$, con igualdad cuando una variable determina a la otra.

:::figura[Un sensor que clasifica sin error tres tipos de pieza: la tabla es diagonal y la información mutua llega a 1.571 bits, toda la entropía de cada variable; las barras de H(X) y H(Y) terminan traslapadas por completo.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0.3, 0, 0]
  - [0, 0.3, 0]
  - [0, 0, 0.4]
enfoque: mutua
filas: [tipo 1, tipo 2, tipo 3]
columnas: [lee 1, lee 2, lee 3]
```
:::

- **Invariancia:** no cambia si se aplican funciones biyectivas a $X$ o a $Y$.
- **Información de una variable consigo misma:** $I(X; X) = H(X)$: observar $X$ revela toda su incertidumbre.

## Errores comunes

- **Identificar dependencia con correlación.** Si $X$ vale $-1$, 0 o 1 con probabilidades 0.25, 0.5 y 0.25 y $Y = X^2$, la correlación entre $X$ y $Y$ es cero, pero $Y$ queda determinada por $X$ e $I(X; Y) = H(Y) = 1$ bit.

:::figura[X en $-1$, 0 y 1 con Y igual a X al cuadrado: correlación nula y, sin embargo, 1 bit de información mutua; la entropía condicional de Y dado X termina en cero.]{componente="InformationViz"}
```yaml
modo: conjunta
tabla:
  - [0, 0.25]
  - [0.5, 0]
  - [0, 0.25]
enfoque: mutua
filas: [x = -1, x = 0, x = 1]
columnas: [y = 0, y = 1]
```
:::

- **Leer la información mutua como causalidad.** Es simétrica y no dice cuál variable influye en la otra.
- **Comparar valores sin normalizar.** Un valor de 0.5 bits es mucho si $H(X) = 0.6$ y poco si $H(X) = 5$; para comparar se usa a veces $I(X; Y)/\min\{H(X), H(Y)\}$.

## Conexiones

Se obtiene de la [[entropia-condicional]] como reducción de incertidumbre y de la [[entropia-conjunta]] como traslape. Es un caso de la [[divergencia-de-kullback-leibler]], entre la conjunta y el producto de marginales, y vale cero exactamente con independencia, la versión para variables de la [[independencia-de-eventos]]. La [[desigualdad-de-procesamiento-de-datos]] dice que ningún procesamiento la aumenta.

## Formulario

:::formula[Información mutua]
$$
I(X; Y) = \sum_{x, y} p(x, y) \log_2 \frac{p(x, y)}{p(x)\,p(y)}
$$

- $p(x, y)$: conjunta; $p(x)$, $p(y)$: marginales; $I(X; Y)$: información mutua en bits.
:::

:::formula[Relación con las entropías]
$$
I(X; Y) = H(X) - H(X \mid Y) = H(X) + H(Y) - H(X, Y)
$$

- $H(X)$, $H(Y)$: entropías marginales; $H(X \mid Y)$: entropía condicional; $H(X, Y)$: entropía conjunta.
:::

:::formula[Cotas]
$$
0 \le I(X; Y) \le \min\{H(X), H(Y)\}
$$

- La cota inferior es igualdad solo con independencia; la superior, cuando una variable determina a la otra.
:::
