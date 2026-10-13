---
id: esperanza-matematica
titulo: Esperanza matemática
titulo_en: Expected value
alias:
  - esperanza
  - valor esperado
  - media de una variable aleatoria
  - valor medio
modulo: 1
submodulo: '1.3'
orden: 10
nivel: basico
prerrequisitos:
  - funcion-de-masa-de-probabilidad
  - funcion-de-densidad-de-probabilidad
relaciones:
  - tipo: relacionado
    id: media-aritmetica
  - tipo: relacionado
    id: media-ponderada
etiquetas:
  - media
  - promedio ponderado
  - centro de masa
  - valor justo de una apuesta
resumen: >
  La esperanza de una variable aleatoria es el promedio de sus valores ponderado por sus
  probabilidades: el centro de masa de su distribución. Es el valor alrededor del cual se
  estabiliza el promedio de muchas repeticiones independientes.
formula: '\mathbb{E}[X] = \sum_x x\, p(x) \quad \text{o} \quad \mathbb{E}[X] = \int_{-\infty}^{\infty} x\, f(x)\,dx'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: esperanza
    experimento: dos-dados
    variable: suma
    variables: [suma, maximo, minimo, diferencia, producto]
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.1'
  - clave: ross-probabilidad
    capitulo: '4.3 y 5.2'
publicado: true
---

## Intuición

Si una apuesta paga 4 pesos con probabilidad 1/6 y quita 1 peso con probabilidad 5/6, ¿cuánto se gana en promedio? Al repetirla 600 veces se esperan unos 100 aciertos y 500 fallos: $100 \cdot 4 - 500 \cdot 1 = -100$ pesos, es decir $-1/6$ de peso por apuesta. Ese promedio a largo plazo es la **esperanza**: cada valor multiplicado por su probabilidad, y todo sumado.

Hay una imagen física útil. Si cada valor posible es un punto de una regla y su probabilidad es un peso colgado ahí, la esperanza es el punto donde la regla queda en equilibrio, el **centro de masa**. Un valor lejano con poco peso puede mover el equilibrio tanto como uno cercano con mucho peso.

La esperanza no tiene que ser un valor posible: la cara media de un dado es 3.5, que nunca sale. Tampoco es el valor más probable ni el valor central; es el promedio de largo plazo.

## Definición

:::definicion[Esperanza]
Si $X$ es discreta con función de masa $p$, su **esperanza** es
$$
\mathbb{E}[X] = \sum_x x\, p(x).
$$
Si $X$ es continua con densidad $f$,
$$
\mathbb{E}[X] = \int_{-\infty}^{\infty} x\, f(x)\,dx.
$$
En ambos casos se exige que la suma o la integral de $|x|$ sea finita; si no, la esperanza no existe.
:::

También se escribe $\mu$ o $\mu_X$, y se llama media de la distribución. La condición de convergencia absoluta evita que el resultado dependa del orden en que se suman los términos.

:::figura[La esperanza de una variable continua: el tiempo exponencial con media 2 tiene su punto de equilibrio en 2, a la derecha del pico de la densidad, porque la cola larga tira hacia allá.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
distribucion: exponencial
parametros:
  lambda: 0.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $\mathbb{E}[X]$: esperanza de $X$; también $\mu$ o $\mu_X$.
- $p(x)$: función de masa; $f(x)$: densidad.
- $x\,p(x)$: contribución del valor $x$ a la esperanza.
- $|x|$: valor absoluto.
- $G$: ganancia neta de la rifa del ejemplo, en pesos.
:::

## Cómo usar la visualización

Las barras son la distribución de la suma de dos dados, vistas como pesos sobre una regla. La animación suma un término $x\,p(x)$ a la vez: el encabezado muestra la suma parcial y las barras ya sumadas se iluminan. Al terminar, el triángulo bajo el eje marca el punto de equilibrio, 7.

El selector cambia la variable: el máximo de los dados tiene su masa cargada a la derecha y su equilibrio en 4.47; el producto tiene una cola larga y su media, 12.25, queda lejos de los valores más frecuentes.

## Ejemplo

Una rifa vende 1000 boletos de 10 pesos; hay un premio de 1000 pesos y dos de 100. La ganancia neta $G$ de un boleto vale 990 con probabilidad $1/1000$, 90 con probabilidad $2/1000$ y $-10$ con probabilidad $997/1000$.

1. $\mathbb{E}[G] = 990 \cdot 0.001 + 90 \cdot 0.002 + (-10) \cdot 0.997$.
2. $= 0.99 + 0.18 - 9.97 = -8.8$ pesos.
3. En promedio cada boleto pierde 8.80 pesos: de cada 10 pesos, la rifa devuelve 1.20 en premios.

:::figura[La rifa del ejemplo: casi toda la masa está en $-10$, y los premios, aunque grandes, pesan tan poco que el punto de equilibrio queda en $-8.8$.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
valores: [-10, 90, 990]
probabilidades: [997, 2, 1]
nombre: la ganancia neta de un boleto
simbolo: G
```
:::

## Propiedades

- **Linealidad:** $\mathbb{E}[aX + bY + c] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y] + c$, siempre que existan las esperanzas.
- **Monotonía:** si $X \le Y$ siempre, entonces $\mathbb{E}[X] \le \mathbb{E}[Y]$. En particular, si $X \ge 0$, entonces $\mathbb{E}[X] \ge 0$.
- **Constantes e indicadoras:** $\mathbb{E}[c] = c$ y $\mathbb{E}[\mathbf{1}_A] = P(A)$.
- **Variables no negativas:** $\mathbb{E}[X] = \int_0^\infty P(X > x)\,dx$.
- **Ley de los grandes números:** el promedio de $n$ repeticiones independientes se acerca a $\mathbb{E}[X]$ cuando $n$ crece.

:::figura[Al arrastrar una barra hacia arriba, el punto de equilibrio se desplaza hacia ella: la esperanza responde a cada cambio de probabilidad en proporción a la distancia del valor.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
valores: [1, 2, 3, 4, 5]
probabilidades: [0.1, 0.2, 0.4, 0.2, 0.1]
nombre: la calificación de un producto
simbolo: X
editable: true
```
:::

## Errores comunes

- **Esperar que la media sea un valor posible.** La cara media de un dado es 3.5.
- **Confundir la media con el valor más probable o con la mediana.** En la apuesta del dado, el resultado más probable es perder 1 peso, la mediana es $-1$ y la media es $-1/6$.
- **Suponer que la esperanza siempre existe.** En la distribución de Cauchy la integral de $|x| f(x)$ diverge: el promedio de muchas observaciones no se estabiliza, y en la [[paradoja-de-san-petersburgo]] la esperanza es infinita.

:::figura[La apuesta al 6 con un dado: la barra de $-1$ pesa 5/6 y la de 4 pesa 1/6. La media, $-0.17$, no coincide con ningún resultado posible.]{componente="RandomVariableLab"}
```yaml
modo: esperanza
experimento: dado
variable: ganancia-apuesta
```
:::

## Conexiones

La esperanza resume en un número la distribución dada por la [[funcion-de-masa-de-probabilidad]] o la [[funcion-de-densidad-de-probabilidad]]. Su propiedad más útil es la [[linealidad-de-la-esperanza]], y para calcular la media de $g(X)$ se usa la [[ley-del-estadistico-inconsciente]]. La dispersión alrededor de ella la mide la [[varianza]], y las esperanzas de potencias son los [[momentos]]. Su contraparte con datos es la [[media-aritmetica]], o la [[media-ponderada]] cuando cada valor tiene un peso. La [[ley-debil-de-los-grandes-numeros]] justifica su interpretación como promedio de largo plazo, y la [[convergencia-en-media-cuadratica]] mide distancias con esperanzas.

## Formulario

:::formula[Caso discreto]
$$
\mathbb{E}[X] = \sum_x x\, p(x)
$$

- Existe si $\sum_x |x|\, p(x) < \infty$.
:::

:::formula[Caso continuo]
$$
\mathbb{E}[X] = \int_{-\infty}^{\infty} x\, f(x)\,dx
$$

- Existe si $\int |x|\, f(x)\,dx < \infty$.
:::

:::formula[Linealidad]
$$
\mathbb{E}[aX + b] = a\,\mathbb{E}[X] + b
$$

- $a$, $b$: constantes.
:::

:::formula[Variables no negativas]
$$
\mathbb{E}[X] = \int_0^\infty P(X > x)\,dx
$$

- Área bajo la función de supervivencia.
:::
