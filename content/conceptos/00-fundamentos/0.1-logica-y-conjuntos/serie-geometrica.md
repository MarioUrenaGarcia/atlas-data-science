---
id: serie-geometrica
titulo: Serie geométrica
titulo_en: Geometric series
alias:
  - progresión geométrica
  - suma geométrica
modulo: 0
submodulo: '0.1'
orden: 19
nivel: basico
prerrequisitos:
  - series-y-convergencia-de-series
etiquetas:
  - series
  - razón
  - suma cerrada
  - convergencia
resumen: >
  La serie geométrica suma términos que se multiplican siempre por la misma razón r. Converge si y solo si
  |r| < 1, y entonces su suma es el primer término dividido entre 1 - r.
formula: '\sum_{k=0}^{\infty} a r^k = \frac{a}{1 - r},\qquad |r| < 1'
visualizacion:
  componente: SequenceSeries
  parametros:
    modo: geometrica
    razon: 0.5
    primero: 1
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una pelota se deja caer desde 1 metro y en cada rebote sube a la mitad de la altura anterior. Las alturas de los rebotes son $1/2$, $1/4$, $1/8$, ... Cada rebote cubre la mitad de lo que le faltaba al anterior para completar un metro, así que la suma de todas las alturas se acerca a 1 sin pasarse nunca: después de cada rebote queda por recorrer exactamente la misma cantidad que acaba de subir.

Si la pelota conservara el 90 % de la altura, las alturas se reducirían más despacio y la suma sería mayor, pero igual finita. Si rebotara siempre a la misma altura, la suma crecería sin límite. La serie geométrica describe todas estas situaciones con un solo número, la razón entre un término y el anterior, y es de las pocas series infinitas que se suman con una fórmula exacta.

## Definición

:::definicion[Serie geométrica]
Dados un primer término $a \neq 0$ y una **razón** $r$, la serie geométrica es
$$
\sum_{k=0}^{\infty} a r^k = a + a r + a r^2 + \cdots.
$$
Su suma parcial con $n$ términos es
$$
S_n = \sum_{k=0}^{n-1} a r^k = \begin{cases} a \dfrac{1 - r^n}{1 - r} & r \neq 1, \\ n a & r = 1. \end{cases}
$$
:::

:::teorema
La serie geométrica converge si y solo si $|r| < 1$, y en ese caso $\sum_{k=0}^{\infty} a r^k = \dfrac{a}{1 - r}$.
:::

:::nota[Qué significa cada símbolo]
- $a$: primer término de la serie.
- $r$: razón, el número por el que se multiplica cada término para obtener el siguiente.
- $k$: exponente de $r$ en cada término, empieza en 0.
- $n$: número de términos sumados.
- $S_n$: suma parcial de los primeros $n$ términos.
- $|r|$: valor absoluto de la razón.
:::

## Cómo usar la visualización

Cada término $a r^{k}$ se apila como un segmento de una barra, y la reproducción agrega un segmento a la vez. Cuando $|r| < 1$ una línea marca el límite $a/(1 - r)$, y cada segmento nuevo cubre la misma fracción de lo que falta. El panel compara la suma parcial con el límite.

Con $r = 0.5$ y $a = 1$ la suma parcial se acerca a 2, y cada paso reduce a la mitad la distancia restante. Con $r = 0.9$ el límite sube a 10 y la convergencia es mucho más lenta. Con $r$ negativo los segmentos alternan dirección y las sumas oscilan alrededor del límite. Con $r = 1$ o $|r| > 1$ el panel indica que el límite no existe.

## Ejemplo

Un tratamiento administra 100 mg de un fármaco cada 12 horas, y en ese lapso el organismo elimina el 60 % de lo presente, así que queda una fracción $r = 0.4$.

1. Justo después de la dosis $n$, la cantidad es $100 + 100(0.4) + \dots + 100(0.4)^{n-1} = 100\,\frac{1 - 0.4^n}{0.6}$.
2. Tras 3 dosis: $100 \cdot \frac{1 - 0.064}{0.6} = 156$ mg.
3. A largo plazo la cantidad se estabiliza en $\frac{100}{1 - 0.4} = 166.7$ mg.
4. Tras 5 dosis ya se alcanza $100 \cdot \frac{1 - 0.01024}{0.6} = 164.96$ mg, a menos de 2 mg del nivel estable.

:::figura[El fármaco del ejemplo: cada segmento es lo que queda de una dosis de 100 mg, y la suma se acerca al nivel estable de $100/0.6 \approx 166.7$ mg.]{componente="SequenceSeries"}
```yaml
modo: geometrica
razon: 0.4
primero: 100
```
:::

## Propiedades

- $1 + r + r^2 + \dots = \frac{1}{1 - r}$ para $|r| < 1$; empezando en $k = 1$, $\sum_{k=1}^{\infty} r^k = \frac{r}{1 - r}$.
- El error al truncar después de $n$ términos es $\frac{a r^n}{1 - r}$: disminuye geométricamente.
- **Derivando término a término:** $\sum_{k=1}^{\infty} k r^{k-1} = \frac{1}{(1 - r)^2}$ para $|r| < 1$.
- Todo decimal periódico es una serie geométrica: $0.\overline{3} = \frac{3}{10} \cdot \frac{1}{1 - 1/10} = \frac{1}{3}$.
- Es la base del criterio de la razón: una serie cuyos términos decrecen al menos como una geométrica con $|r| < 1$ converge.

:::demostracion
Para $r \neq 1$, $S_n - r S_n = a - a r^n$, de donde $S_n = a\frac{1 - r^n}{1 - r}$. Si $|r| < 1$, $r^n \to 0$ y $S_n \to \frac{a}{1 - r}$. Si $|r| \ge 1$, los términos $a r^n$ no tienden a 0, así que la serie diverge.
:::

## Errores comunes

- **Aplicar $\frac{a}{1 - r}$ con $|r| \ge 1$.** Con $r = 2$ daría $-a$, un resultado sin sentido para una suma de términos positivos.
- **Confundir el índice inicial.** $\sum_{k=1}^{\infty} r^k$ no empieza en 1 sino en $r$.
- **Usar como $a$ un término que no es el primero.** En $\frac{a}{1 - r}$, $a$ es el primer término que se suma.
- **Pensar que con $r$ negativo la serie diverge.** Con $r = -0.5$ converge a $\frac{a}{1.5}$.

:::figura[Con razón negativa los segmentos cambian de sentido y las sumas parciales oscilan alrededor del límite: con $r = -0.5$ y $a = 1$ convergen a $1/1.5 \approx 0.667$.]{componente="SequenceSeries"}
```yaml
modo: geometrica
razon: -0.5
primero: 1
```
:::

## Conexiones

Es el ejemplo fundamental de [[series-y-convergencia-de-series]] y el punto de comparación de varios criterios de convergencia. Su suma parcial se deduce con la [[notacion-sumatoria-y-productoria|notación sumatoria]] y se demuestra también por [[induccion-matematica]]. En probabilidad aparece en la distribución geométrica, en el valor presente de flujos con descuento y en los modelos autorregresivos, cuyas respuestas a impulsos decaen geométricamente.

## Formulario

:::formula[Suma parcial]
$$
S_n = \sum_{k=0}^{n-1} a r^{k} = a\,\frac{1 - r^{n}}{1 - r} \quad (r \neq 1)
$$

- $a$: primer término.
- $r$: razón.
- $n$: número de términos.
- Con $r = 1$, $S_n = na$.
:::

:::formula[Suma infinita]
$$
\sum_{k=0}^{\infty} a r^{k} = \frac{a}{1 - r} \quad (|r| < 1)
$$

- $|r| < 1$: condición para que la serie converja.
- $a$: primer término que se suma.
:::

:::formula[Error al truncar]
$$
\frac{a}{1 - r} - S_n = \frac{a r^{n}}{1 - r}
$$

- $S_n$: suma de los primeros $n$ términos.
- $a r^{n}$: primer término que se deja fuera.
:::

:::formula[Derivada de la serie]
$$
\sum_{k=1}^{\infty} k r^{k-1} = \frac{1}{(1 - r)^2} \quad (|r| < 1)
$$

- $k$: índice del término; aparece multiplicando porque se derivó $r^k$.
:::
