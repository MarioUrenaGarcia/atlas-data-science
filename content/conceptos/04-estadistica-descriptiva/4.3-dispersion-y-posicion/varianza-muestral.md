---
id: varianza-muestral
titulo: Varianza muestral
titulo_en: Sample variance
alias:
  - varianza
  - cuasivarianza
  - s cuadrada
modulo: 4
submodulo: '4.3'
orden: 2
nivel: basico
prerrequisitos:
  - media-aritmetica
etiquetas:
  - dispersión
  - varianza
  - desviaciones cuadradas
  - suma de cuadrados
resumen: >
  La varianza muestral es la suma de los cuadrados de las desviaciones respecto a la media, dividida
  entre n - 1. Mide la dispersión promedio en unidades al cuadrado.
formula: 's^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2'
visualizacion:
  componente: DataStrip
  parametros:
    modo: dispersion
    datos: [12, 15, 11, 18, 14]
    medida: varianza
    lecturas: [varianza, desviacion, varianza-n]
    cuadrados: true
    variable: Altura de plántulas a los 10 días
    unidad: cm
    decimales: 0
    dominio: [9, 20]
referencias:
  - clave: degroot
  - clave: casella-berger
    capitulo: '5'
publicado: true
---

## Intuición

Cinco plántulas de frijol crecieron 12, 15, 11, 18 y 14 cm. Su media es 14 cm, pero no todas miden eso: una está 3 cm por debajo, otra 4 cm por encima. Para resumir qué tan lejos están, en general, de la media, no sirve promediar las distancias con su signo, porque las de arriba y las de abajo se cancelan exactamente. Una salida es elevarlas al cuadrado: así todas cuentan como positivas, y las grandes cuentan mucho más que las pequeñas.

La **varianza** es el promedio de esos cuadrados. Geométricamente, cada desviación es el lado de un cuadrado, y la varianza es el área promedio de los cuadrados. Su principal desventaja es que queda en unidades al cuadrado (centímetros cuadrados para longitudes); por eso se usa junto con su raíz, la desviación estándar. Su principal ventaja es algebraica: las varianzas se suman y se descomponen con facilidad, lo que la vuelve la base de casi toda la estadística inferencial.

## Definición

:::definicion[Varianza muestral]
Para datos $x_1, \dots, x_n$ con media $\bar{x}$ y $n \ge 2$, la **varianza muestral** es
$$
s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2 = \frac{\mathrm{SC}}{n-1},
$$
donde $\mathrm{SC} = \sum (x_i - \bar{x})^2$ es la **suma de cuadrados** de las desviaciones. La varianza de una población finita de $N$ valores es $\sigma^2 = \frac{1}{N}\sum_{j}(y_j - \mu)^2$.
:::

El denominador $n - 1$ en lugar de $n$ es la [[correccion-de-bessel]]: hace que $s^2$ no subestime en promedio a $\sigma^2$. Una fórmula equivalente, útil para cálculos a mano, es $\mathrm{SC} = \sum x_i^2 - n\bar{x}^2$, aunque numéricamente es menos estable con datos grandes.

:::figura[Desviaciones y sus cuadrados para los goles de un equipo en seis partidos. Cada cuadrado tiene un área proporcional a la desviación al cuadrado; la varianza es la suma de las áreas dividida entre n - 1.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [1, 3, 0, 2, 4, 2]
medida: varianza
lecturas: [varianza, desviacion]
cuadrados: true
variable: Goles por partido
decimales: 0
dominio: [-1, 5]
```
:::

:::nota[Qué significa cada símbolo]
- $s^2$: varianza muestral.
- $x_i$: observación $i$.
- $\bar{x}$: media muestral.
- $x_i - \bar{x}$: desviación de la observación $i$ respecto a la media.
- $n$: número de observaciones.
- $n - 1$: grados de libertad; número de desviaciones que pueden variar libremente, porque todas suman cero.
- $\mathrm{SC}$: suma de cuadrados de las desviaciones.
- $\sigma^2$: varianza poblacional; $\mu$: media poblacional; $N$: tamaño de la población; $y_j$: valores de la población.
:::

## Cómo usar la visualización

Cada fila es una plántula. La línea vertical marca la media de 14 cm; cada desviación aparece como un segmento y como un cuadrado, en azul si está por encima de la media y en naranja si está por debajo. El encabezado va sumando los cuadrados conforme aparecen y, al final, divide entre $n - 1 = 4$.

Al arrastrar la plántula de 18 cm hasta 20 cm, su cuadrado crece mucho más que su segmento: la varianza pasa de 7.5 a más de 11. Al acercar todas las plántulas a la media, los cuadrados se encogen y la varianza tiende a cero. El panel también muestra la varianza con denominador $n$, siempre menor.

## Ejemplo

Para las alturas 12, 15, 11, 18 y 14 cm:

1. Media: $\bar{x} = 70/5 = 14$ cm.
2. Desviaciones: $-2, 1, -3, 4, 0$. Suman cero, como siempre.
3. Cuadrados: $4, 1, 9, 16, 0$. Suma de cuadrados: $\mathrm{SC} = 30$ cm².
4. Varianza: $s^2 = 30 / (5 - 1) = 7.5$ cm².
5. Comprobación con la fórmula alternativa: $\sum x_i^2 = 144 + 225 + 121 + 324 + 196 = 1010$ y $1010 - 5 \cdot 14^2 = 1010 - 980 = 30$.

:::figura[El ejemplo paso a paso: al terminar la animación el encabezado muestra 30 / 4 = 7.5.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [12, 15, 11, 18, 14]
medida: varianza
lecturas: [varianza]
cuadrados: true
variable: Altura
unidad: cm
decimales: 0
dominio: [9, 20]
etiquetas: [Planta 1, Planta 2, Planta 3, Planta 4, Planta 5]
```
:::

## Propiedades

- **No negativa:** $s^2 \ge 0$, y $s^2 = 0$ solo si todos los datos son iguales.
- **Invariante ante traslaciones:** sumar una constante a todos los datos no cambia la varianza.
- **Escala al cuadrado:** si $y_i = a + b x_i$, entonces $s_y^2 = b^2 s_x^2$. Medir en milímetros en lugar de centímetros multiplica la varianza por 100.
- **Sensible a extremos:** al elevar al cuadrado, una desviación grande domina la suma.
- **Fórmula de pares:** $s^2 = \frac{1}{n(n-1)}\sum_{i<j}(x_i - x_j)^2$; la varianza mide qué tan distintos son los datos entre sí, sin necesidad de la media.

:::figura[Propiedad de traslación: las mismas alturas, y una segunda muestra con 10 cm más en cada planta. Los cuadrados son idénticos y la varianza es la misma, 7.5 cm².]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [12, 15, 11, 18, 14]
medida: varianza
lecturas: [varianza]
cuadrados: true
variable: Altura original
unidad: cm
decimales: 0
dominio: [9, 30]
comparar:
  datos: [22, 25, 21, 28, 24]
  variable: Altura más 10 cm
  unidad: cm
  dominio: [9, 30]
```
:::

## Errores comunes

- **Interpretar la varianza en las unidades de los datos.** Una varianza de 7.5 no significa que los datos se alejen 7.5 cm de la media; son 7.5 cm², y la distancia típica es su raíz, unos 2.74 cm.
- **Dividir entre $n$ sin saberlo.** Algunas calculadoras y programas usan $n$ por defecto; con muestras pequeñas la diferencia es grande.
- **Creer que una varianza grande indica algo malo.** La varianza describe; si la variabilidad es deseable o no depende del contexto.

:::figura[Efecto de dividir entre n o entre n - 1 con una muestra muy pequeña: con tres mediciones de presión, la varianza con n es dos tercios de la varianza muestral.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [118, 126, 122]
medida: varianza
lecturas: [varianza, varianza-n]
cuadrados: true
variable: Presión sistólica
unidad: mmHg
decimales: 0
dominio: [114, 130]
```
:::

## Conexiones

La varianza promedia los cuadrados de las desviaciones respecto a la [[media-aritmetica]], que es justamente el valor que minimiza esa suma. Su denominador se explica en la [[correccion-de-bessel]] y su raíz es la [[desviacion-estandar-muestral]]. En probabilidad, su análogo es la varianza de una variable aleatoria, y en regresión la suma de cuadrados se descompone en una parte explicada y otra residual.

## Formulario

:::formula[Varianza muestral]
$$
s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2
$$

- $x_i$: observaciones; $\bar{x}$: su media.
- $n$: número de observaciones.
:::

:::formula[Suma de cuadrados, forma alternativa]
$$
\mathrm{SC} = \sum_{i=1}^{n}(x_i - \bar{x})^2 = \sum_{i=1}^{n} x_i^2 - n\bar{x}^2
$$

- $\mathrm{SC}$: suma de cuadrados de las desviaciones.
- $\sum x_i^2$: suma de los cuadrados de los datos.
:::

:::formula[Varianza poblacional]
$$
\sigma^2 = \frac{1}{N}\sum_{j=1}^{N}(y_j - \mu)^2
$$

- $\sigma^2$: varianza de la población.
- $y_j$: valores de la población; $\mu$: su media; $N$: su tamaño.
:::

:::formula[Transformación lineal]
$$
y_i = a + b\,x_i \ \Longrightarrow\ s_y^2 = b^2\,s_x^2
$$

- $a$: desplazamiento, sin efecto.
- $b$: cambio de escala.
:::

:::formula[Forma de pares]
$$
s^2 = \frac{1}{n(n-1)}\sum_{i<j}(x_i - x_j)^2
$$

- $x_i - x_j$: diferencia entre dos observaciones distintas.
- $\sum_{i<j}$: suma sobre todos los pares.
:::
