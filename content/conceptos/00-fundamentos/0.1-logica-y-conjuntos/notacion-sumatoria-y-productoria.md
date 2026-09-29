---
id: notacion-sumatoria-y-productoria
titulo: Notación sumatoria y productoria
titulo_en: Summation and product notation
alias:
  - sumatoria
  - productoria
  - sigma
  - notación sigma
  - notación pi
modulo: 0
submodulo: '0.1'
orden: 20
nivel: basico
prerrequisitos:
  - sucesiones
etiquetas:
  - notación
  - sumatoria
  - productoria
  - índices
resumen: >
  La sumatoria y la productoria abrevian sumas y productos de muchos términos que siguen una regla, indicando
  la expresión general, el índice y el rango de valores que recorre.
formula: '\sum_{i=1}^{n} a_i = a_1 + \dots + a_n,\qquad \prod_{i=1}^{n} a_i = a_1 \cdots a_n'
visualizacion:
  componente: SequenceSeries
  parametros:
    modo: sumatoria
    expresion: impares
    expresiones:
      - impares
      - naturales
      - cuadrados
      - factorial
      - telescopico
    n: 6
referencias:
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una cafetería registra sus ventas diarias durante un mes. Para escribir el total no hace falta anotar "ventas del día 1 más ventas del día 2 más ..." hasta el día 30: basta decir "sumar las ventas del día $i$ para $i$ desde 1 hasta 30". La notación sumatoria es esa instrucción abreviada, con tres partes: qué se suma (la expresión que depende de $i$), con qué variable se recorre (el índice) y entre qué valores (los límites).

La productoria funciona igual, pero multiplica. Si una inversión rinde 2 % un mes, 1.5 % el siguiente y 3 % el tercero, el factor de crecimiento total es el producto $1.02 \cdot 1.015 \cdot 1.03$, y con muchos meses se escribe como una productoria.

Estas notaciones no agregan matemática nueva, pero permiten manipular expresiones largas con reglas precisas: separar sumas, sacar constantes y cambiar índices.

## Definición

:::definicion[Sumatoria y productoria]
Para enteros $m \le n$ y términos $a_m, \dots, a_n$:
$$
\sum_{i=m}^{n} a_i = a_m + a_{m+1} + \dots + a_n, \qquad \prod_{i=m}^{n} a_i = a_m \cdot a_{m+1} \cdots a_n.
$$
Si $m > n$, la suma es vacía y vale 0, y el producto es vacío y vale 1.
:::

El índice $i$ es una variable **muda**: $\sum_{i=1}^{n} a_i = \sum_{k=1}^{n} a_k$. También se usa la forma $\sum_{i \in I} a_i$ para sumar sobre un conjunto finito de índices $I$.

## Cómo usar la visualización

Arriba se muestra la expresión en notación compacta. La reproducción hace recorrer al índice $i$ los valores de 1 a $n$: en cada paso se escribe el término correspondiente, se acumula y el panel actualiza el término actual, el acumulado y, cuando existe, la fórmula cerrada.

Con la suma de impares y $n = 6$ los acumulados son 1, 4, 9, 16, 25, 36: siempre un cuadrado perfecto. Con el producto de los primeros naturales se obtiene $n!$, que crece mucho más rápido que cualquier suma de la lista. El producto telescópico se simplifica casi por completo y vale $n + 1$.

## Ejemplo

Un equipo de futbol anota $x_1 = 2$, $x_2 = 0$, $x_3 = 3$, $x_4 = 1$ y $x_5 = 4$ goles en cinco partidos.

1. **Total:** $\sum_{i=1}^{5} x_i = 2 + 0 + 3 + 1 + 4 = 10$.
2. **Media:** $\bar{x} = \frac{1}{5}\sum_{i=1}^{5} x_i = 2$.
3. **Suma de desviaciones cuadradas:** $\sum_{i=1}^{5} (x_i - \bar{x})^2 = 0 + 4 + 1 + 1 + 4 = 10$.
4. **Comprobación con la identidad** $\sum (x_i - \bar{x})^2 = \sum x_i^2 - n\bar{x}^2$: $\sum x_i^2 = 4 + 0 + 9 + 1 + 16 = 30$ y $30 - 5 \cdot 4 = 10$.

:::figura[Los goles del ejemplo. Primero se suman los $x_i$ uno por uno, luego aparece la media y al final cada desviación $x_i - \bar{x}$ como un segmento; la suma de sus cuadrados es 10.]{componente="SequenceSeries"}
```yaml
modo: datos
valores: [2, 0, 3, 1, 4]
nombre: Goles
```
:::

## Propiedades

- **Linealidad:** $\sum_{i} (c\,a_i + b_i) = c \sum_{i} a_i + \sum_{i} b_i$.
- **Constante:** $\sum_{i=1}^{n} c = n c$ y $\prod_{i=1}^{n} c = c^n$.
- **Separación del rango:** $\sum_{i=1}^{n} a_i = \sum_{i=1}^{k} a_i + \sum_{i=k+1}^{n} a_i$.
- **Cambio de índice:** $\sum_{i=1}^{n} a_i = \sum_{j=0}^{n-1} a_{j+1}$.
- **Suma telescópica:** $\sum_{i=1}^{n} (b_{i+1} - b_i) = b_{n+1} - b_1$.
- **Sumas dobles:** $\sum_{i} \sum_{j} a_i b_j = \left(\sum_{i} a_i\right)\left(\sum_{j} b_j\right)$, y en sumas finitas el orden de suma puede intercambiarse.
- **Logaritmo de un producto:** $\log \prod_{i} a_i = \sum_{i} \log a_i$ para $a_i > 0$.
- Fórmulas cerradas: $\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$, $\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$, $\sum_{i=1}^{n} (2i - 1) = n^2$.

:::figura[Una productoria telescópica: casi todos los factores se cancelan y el producto de $n$ términos vale $n + 1$. El factorial, en cambio, no tiene cancelaciones y crece mucho más rápido.]{componente="SequenceSeries"}
```yaml
modo: sumatoria
expresion: telescopico
expresiones: [telescopico, factorial, cuadrados]
n: 8
```
:::

## Errores comunes

- **Sacar de la suma algo que depende del índice.** $\sum_{i} i\,a_i \neq i \sum_{i} a_i$.
- **Distribuir la sumatoria sobre un producto.** $\sum a_i b_i \neq \left(\sum a_i\right)\left(\sum b_i\right)$ en general.
- **Contar mal los términos.** $\sum_{i=3}^{10}$ tiene 8 términos, no 7.
- **Olvidar que la suma vacía vale 0 y el producto vacío vale 1.** Por eso $0! = 1$.

## Conexiones

La sumatoria abrevia las sumas parciales de las [[sucesiones]] y es la notación de las [[series-y-convergencia-de-series|series]]. Sus fórmulas cerradas se demuestran por [[induccion-matematica]]. En estadística todas las medidas descriptivas, como la media y la varianza muestral, se escriben con sumatorias, y la verosimilitud de una muestra independiente es una productoria que se convierte en suma al tomar logaritmos.
