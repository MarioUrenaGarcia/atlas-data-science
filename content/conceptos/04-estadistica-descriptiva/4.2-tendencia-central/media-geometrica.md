---
id: media-geometrica
titulo: Media geométrica
titulo_en: Geometric mean
alias:
  - promedio geométrico
  - tasa media de crecimiento
modulo: 4
submodulo: '4.2'
orden: 3
nivel: basico
prerrequisitos:
  - media-aritmetica
  - funcion-exponencial-y-logaritmo-natural
etiquetas:
  - tendencia central
  - crecimiento
  - tasas
  - factores multiplicativos
  - logaritmo
resumen: >
  La media geométrica de n valores positivos es la raíz n-ésima de su producto. Es el factor
  constante que, aplicado n veces, produce el mismo efecto total; por eso promedia tasas de crecimiento.
formula: '\bar{x}_G = \left(\prod_{i=1}^{n} x_i\right)^{1/n} = \exp\!\left(\frac{1}{n}\sum_{i=1}^{n}\log x_i\right)'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [1.10, 0.95, 1.20, 1.05]
    medidas: [geometrica, media]
    variable: Factor de crecimiento anual de un cultivo de bacterias
    decimales: 2
    dominio: [0.9, 1.25]
referencias:
  - clave: degroot
  - clave: cover-thomas
publicado: true
---

## Intuición

Un fondo de inversión gana 10 % un año, pierde 5 % el siguiente, gana 20 % y luego 5 %. ¿Cuál fue su rendimiento "promedio"? Sumar y dividir da 7.5 %, pero si el fondo hubiera crecido 7.5 % cada año terminaría con más dinero del que realmente tiene. El error es que los rendimientos no se suman: se multiplican. Un peso se convierte en $1.10$, luego en $1.10 \times 0.95$, y así sucesivamente.

La **media geométrica** es el promedio adecuado para cantidades que se combinan multiplicando. Responde a la pregunta: ¿qué factor constante, aplicado en cada periodo, deja el mismo resultado final? Equivale a promediar en escala logarítmica, donde las multiplicaciones se convierten en sumas, y regresar después a la escala original. Por eso aparece al promediar tasas de crecimiento, índices de precios, razones y cualquier magnitud cuyos cambios son proporcionales.

## Definición

:::definicion[Media geométrica]
Para valores estrictamente positivos $x_1, \dots, x_n$, la **media geométrica** es
$$
\bar{x}_G = \left(\prod_{i=1}^{n} x_i\right)^{1/n} = \sqrt[n]{x_1 x_2 \cdots x_n}.
$$
Equivalentemente, es la exponencial de la media aritmética de los logaritmos:
$$
\log \bar{x}_G = \frac{1}{n}\sum_{i=1}^{n}\log x_i.
$$
:::

Solo está definida para valores positivos: con un cero el producto es cero, y con valores negativos la raíz puede no existir o no tener interpretación. Requiere una escala de razón, porque compara proporciones.

Cuando los datos son tasas de crecimiento $r_i$ (por ejemplo, 0.10 para 10 %), se promedian los factores $1 + r_i$ y la tasa media es $\bar{r} = \bar{x}_G - 1$.

:::figura[Datos con espaciado multiplicativo: 2, 8 y 32 se obtienen multiplicando por 4. La media geométrica, 8, es el valor del centro en ese sentido; la aritmética, 14, se va hacia el valor grande.]{componente="DataStrip"}
```yaml
modo: centro
datos: [2, 8, 32]
medidas: [geometrica, media]
variable: Concentración de un reactivo
unidad: mg/L
decimales: 0
dominio: [0, 36]
```
:::

:::nota[Qué significa cada símbolo]
- $\bar{x}_G$: media geométrica.
- $x_i$: valor $i$, positivo.
- $n$: número de valores.
- $\prod_{i=1}^{n}$: producto de los $n$ términos.
- $\sqrt[n]{\cdot}$ o $(\cdot)^{1/n}$: raíz $n$-ésima.
- $\log$: logaritmo natural.
- $\exp$: función exponencial, inversa del logaritmo.
- $r_i$: tasa de crecimiento del periodo $i$; $1 + r_i$ es su factor.
- $\bar{r}$: tasa media de crecimiento por periodo.
:::

## Cómo usar la visualización

Los cuatro círculos son los factores de crecimiento anual de un cultivo: 1.10 significa que creció 10 % en el año. El encabezado multiplica los factores visibles y saca la raíz correspondiente. Las dos líneas marcan la media geométrica y la aritmética.

La media geométrica siempre queda a la izquierda de la aritmética, salvo que todos los factores sean iguales. Al arrastrar el factor 0.95 hacia valores más bajos, la geométrica cae más rápido que la aritmética: un año malo pesa mucho en el resultado acumulado. Al alinear los cuatro factores en un mismo valor, ambas medias coinciden con él.

## Ejemplo

Una acción pierde 20 % un año y gana 25 % el siguiente. ¿Cuál es la tasa media anual?

1. Factores: $1 - 0.20 = 0.80$ y $1 + 0.25 = 1.25$.
2. Producto: $0.80 \times 1.25 = 1.00$. Al final de los dos años la acción vale exactamente lo mismo que al inicio.
3. Media geométrica: $\bar{x}_G = \sqrt{1.00} = 1.00$, es decir, una tasa media de $0$ % anual.
4. La media aritmética de las tasas, $(-20 + 25)/2 = 2.5$ %, sugiere una ganancia que no ocurrió: aplicar 2.5 % dos veces daría un factor de $1.025^2 \approx 1.051$.

:::figura[Los dos factores del ejemplo. La media geométrica es exactamente 1, sin ganancia, mientras que la aritmética marca 1.025.]{componente="DataStrip"}
```yaml
modo: centro
datos: [0.80, 1.25]
medidas: [geometrica, media]
variable: Factor anual del precio de la acción
decimales: 2
dominio: [0.7, 1.35]
```
:::

## Propiedades

- **Conserva el producto:** $\bar{x}_G^{\,n} = \prod x_i$. Sustituir cada valor por la media geométrica deja el producto igual, como la aritmética deja igual la suma.
- **Es una media aritmética en escala logarítmica:** por eso los valores muy grandes influyen menos que en la media aritmética.
- **Desigualdad:** $\bar{x}_G \le \bar{x}$, con igualdad solo si todos los valores son iguales. La brecha crece con la dispersión de los datos.
- **Invariante ante cambios de escala:** si $y_i = c\,x_i$ con $c > 0$, entonces $\bar{y}_G = c\,\bar{x}_G$. Además, la media geométrica de cocientes es el cociente de medias geométricas.

:::figura[Propiedad de la desigualdad: factores de crecimiento muy dispersos (0.6, 1.0, 1.5 y 1.9). La distancia entre la media aritmética y la geométrica es mucho mayor que con factores parecidos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [0.6, 1.0, 1.5, 1.9]
medidas: [geometrica, media]
variable: Factor de crecimiento
decimales: 2
dominio: [0.4, 2.1]
```
:::

## Errores comunes

- **Promediar tasas de crecimiento con la media aritmética.** Sobrestima el crecimiento real siempre que las tasas varían.
- **Aplicarla a datos con ceros o negativos.** Un rendimiento de $-100$ % da factor 0 y anula la media; para tasas, siempre se usan los factores $1 + r_i$, que son positivos mientras no se pierda todo.
- **Promediar tasas en lugar de factores.** La media geométrica de 10 % y 20 % no es $\sqrt{0.10 \cdot 0.20}$; es $\sqrt{1.10 \cdot 1.20} - 1 \approx 14.9$ %.

:::figura[Error con un cero: si uno de los valores es 0, el producto es 0 y la media geométrica no describe a los demás datos; el panel la reporta como no definida para datos no positivos.]{componente="DataStrip"}
```yaml
modo: centro
datos: [0, 4, 9]
medidas: [geometrica, media]
variable: Colonias contadas por placa
decimales: 0
dominio: [-1, 10]
```
:::

## Conexiones

La media geométrica es la [[media-aritmetica]] de los logaritmos, transformada de regreso con la [[funcion-exponencial-y-logaritmo-natural|función exponencial]]. Junto con la [[media-armonica]] y la aritmética forma la [[desigualdad-entre-medias]]. Aparece en el cálculo de rendimientos compuestos, en índices de precios y en la verosimilitud, donde los productos de probabilidades se promedian en escala logarítmica.

## Formulario

:::formula[Media geométrica]
$$
\bar{x}_G = \left(\prod_{i=1}^{n} x_i\right)^{1/n}
$$

- $x_i > 0$: valores.
- $n$: número de valores.
- $\prod$: producto.
:::

:::formula[Forma logarítmica]
$$
\bar{x}_G = \exp\!\left(\frac{1}{n}\sum_{i=1}^{n}\log x_i\right)
$$

- $\log x_i$: logaritmo natural de cada valor.
- $\exp$: función exponencial.
:::

:::formula[Tasa media de crecimiento]
$$
\bar{r} = \left(\prod_{i=1}^{n}(1 + r_i)\right)^{1/n} - 1
$$

- $r_i$: tasa del periodo $i$, como fracción.
- $1 + r_i$: factor del periodo $i$.
- $\bar{r}$: tasa constante equivalente.
:::

:::formula[Comparación con la media aritmética]
$$
\bar{x}_G \le \bar{x}
$$

- $\bar{x}$: media aritmética de los mismos valores positivos.
:::
