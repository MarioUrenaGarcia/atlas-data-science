---
id: cuantiles-cuartiles-deciles-y-percentiles
titulo: Cuantiles, cuartiles, deciles y percentiles
titulo_en: Quantiles, quartiles, deciles and percentiles
alias:
  - cuantil muestral
  - percentil
  - cuartil
  - decil
modulo: 4
submodulo: '4.3'
orden: 6
nivel: basico
prerrequisitos:
  - mediana
etiquetas:
  - posición
  - cuantiles
  - percentiles
  - cuartiles
  - estadísticos de orden
resumen: >
  El cuantil de orden p es un valor que deja aproximadamente una proporción p de los datos por debajo.
  Cuartiles, deciles y percentiles son los cuantiles que dividen los datos en 4, 10 y 100 partes.
formula: 'Q(p) \approx \min\{x : \hat{F}(x) \ge p\}, \qquad \hat{F}(x) = \frac{1}{n}\#\{i : x_i \le x\}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: cuantiles
    datos: [12, 15, 17, 18, 21, 22, 25, 28, 31, 40]
    familia: cuartiles
    variable: Espera en urgencias
    unidad: min
    decimales: 0
referencias:
  - clave: wasserman
  - clave: degroot
publicado: true
---

## Intuición

Las tablas de crecimiento que usan los pediatras dicen que un bebé de seis meses está "en el percentil 75 de peso": de cada 100 bebés de su edad, unos 75 pesan menos que él. El percentil no dice cuánto pesa en kilogramos, sino qué lugar ocupa en la fila de todos los bebés ordenados del más ligero al más pesado.

Los **cuantiles** generalizan esa idea. La mediana es el cuantil 0.5: deja la mitad de los datos de cada lado. Los **cuartiles** cortan la fila en cuatro grupos iguales; los **deciles**, en diez; los **percentiles**, en cien. Leer los datos por posiciones tiene dos ventajas. La primera, que resume la forma completa de los datos y no solo su centro: el percentil 10 y el 90 dicen dónde empiezan las colas. La segunda, que como la mediana, los cuantiles centrales no se alteran por unos cuantos valores extremos.

## Definición

:::definicion[Cuantil]
Sea $\hat{F}(x) = \frac{1}{n}\#\{i : x_i \le x\}$ la función de distribución empírica, que da la proporción de datos menores o iguales a $x$. Para $p \in (0, 1)$, un **cuantil de orden $p$** es un valor $Q(p)$ que deja aproximadamente una proporción $p$ de los datos por debajo y $1 - p$ por encima. La definición más simple es
$$
Q(p) = \min\{x : \hat{F}(x) \ge p\}.
$$
:::

Con pocos datos hay varios valores que cumplen la condición, y por eso existen distintos métodos de cálculo; el más usado interpola entre dos datos ordenados. Casos particulares:

- **Cuartiles:** $Q_1 = Q(0.25)$, $Q_2 = Q(0.5)$ (la mediana) y $Q_3 = Q(0.75)$.
- **Deciles:** $D_k = Q(k/10)$, para $k = 1, \dots, 9$.
- **Percentiles:** $P_k = Q(k/100)$, para $k = 1, \dots, 99$.

:::figura[Los nueve deciles del ingreso mensual de 20 hogares, en miles de pesos. Cada línea horizontal a la altura k/10 encuentra la escalera de la función empírica y baja hasta el decil.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [6.2, 7.5, 8.1, 8.8, 9.4, 10.0, 10.5, 11.2, 12.0, 12.6, 13.5, 14.1, 15.0, 16.2, 17.8, 19.5, 21.0, 24.3, 29.0, 41.5]
familia: deciles
variable: Ingreso mensual
unidad: miles de pesos
decimales: 1
```
:::

:::nota[Qué significa cada símbolo]
- $Q(p)$: cuantil de orden $p$.
- $p$: proporción acumulada, entre 0 y 1.
- $\hat{F}(x)$: función de distribución empírica, proporción de datos menores o iguales a $x$.
- $\#\{i : x_i \le x\}$: número de datos menores o iguales a $x$.
- $n$: número de datos.
- $Q_1, Q_2, Q_3$: primer, segundo y tercer cuartil.
- $D_k$: decil $k$; $P_k$: percentil $k$.
:::

## Cómo usar la visualización

La escalera es la función de distribución empírica de diez tiempos de espera en urgencias: cada dato hace subir la escalera un escalón de altura $1/10$. La reproducción agrega los cuartiles uno por uno: una línea horizontal a la altura 0.25, 0.5 o 0.75 cruza hasta la escalera y baja al eje, donde marca el cuartil. El encabezado muestra entre qué dos datos ordenados cae cada cuartil y cómo se interpola.

El primer cuartil, 17.25 minutos, no es un dato observado: queda una cuarta parte del camino entre el tercer y el cuarto dato. Al cambiar el método de cálculo en el selector, los cuartiles se desplazan ligeramente; con diez datos, esas diferencias son de hasta un minuto.

## Ejemplo

Con los diez tiempos de espera ordenados, 12, 15, 17, 18, 21, 22, 25, 28, 31 y 40 minutos, se calcula el percentil 90 con el método de interpolación más común:

1. Posición: $h = (n - 1)p + 1 = 9 \cdot 0.9 + 1 = 9.1$.
2. El percentil está entre el noveno dato, $x_{(9)} = 31$, y el décimo, $x_{(10)} = 40$, a una décima del camino.
3. $P_{90} = 31 + 0.1\,(40 - 31) = 31.9$ minutos.
4. Interpretación: aproximadamente el 90 % de los pacientes esperó 31.9 minutos o menos.

Con el mismo método, los cuartiles son $Q_1 = 17.25$, $Q_2 = 21.5$ y $Q_3 = 27.25$ minutos.

:::figura[El percentil 90 del ejemplo: la línea a la altura 0.9 cae en el último escalón y la interpolación da 31.9 minutos.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [12, 15, 17, 18, 21, 22, 25, 28, 31, 40]
familia: percentiles
p: 0.9
variable: Espera en urgencias
unidad: min
decimales: 0
```
:::

## Propiedades

- **Monotonía:** si $p < q$, entonces $Q(p) \le Q(q)$.
- **Equivarianza monótona:** si $g$ es creciente, el cuantil de los $g(x_i)$ es $g$ del cuantil, salvo por la interpolación. Por eso los percentiles de ingreso en pesos o en dólares corresponden a los mismos hogares.
- **Resistencia:** el cuantil de orden $p$ tolera que cambie arbitrariamente una fracción menor que $\min(p, 1-p)$ de los datos.
- **Relación con la función de distribución:** los cuantiles son, aproximadamente, la inversa de $\hat{F}$; con muchos datos, $\hat{F}$ se parece a la función de distribución de la población y los cuantiles muestrales a los poblacionales.

:::figura[Propiedad de resistencia: tiempos de 12 corredores en 5 km, en segundos. La mediana y los cuartiles quedan entre los datos centrales y no dependen de qué tan lento fue el último corredor.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [310, 285, 342, 298, 355, 320, 276, 301, 333, 290, 315, 305]
familia: cuartiles
variable: Tiempo en 5 km
unidad: s
decimales: 0
```
:::

## Errores comunes

- **Confundir percentil con porcentaje.** Estar en el percentil 80 de un examen no significa haber contestado 80 % de las preguntas, sino haber superado aproximadamente al 80 % de quienes lo presentaron.
- **Creer que los cuartiles dividen el rango en cuatro partes iguales.** Dividen los datos, no el intervalo: la distancia entre $Q_1$ y $Q_2$ puede ser muy distinta de la que hay entre $Q_2$ y $Q_3$.
- **Esperar un valor único con pocos datos.** Con diez datos, el percentil 37 no está bien determinado; distintos programas darán valores distintos según su método.

:::figura[Los cuartiles no dividen el rango en partes iguales: con los ingresos de 20 hogares, de Q2 a Q3 hay 5.2 mil pesos y de Q1 a Q2 solo 3.2 mil, porque los datos se dispersan hacia los ingresos altos.]{componente="DataStrip"}
```yaml
modo: cuantiles
datos: [6.2, 7.5, 8.1, 8.8, 9.4, 10.0, 10.5, 11.2, 12.0, 12.6, 13.5, 14.1, 15.0, 16.2, 17.8, 19.5, 21.0, 24.3, 29.0, 41.5]
familia: cuartiles
variable: Ingreso mensual
unidad: miles de pesos
decimales: 1
```
:::

## Conexiones

La [[mediana]] es el cuantil 0.5. Los cuartiles definen el [[rango-intercuartilico]] y, con el mínimo y el máximo, el [[resumen-de-cinco-numeros]]. Las distintas maneras de interpolar se comparan en [[metodos-de-calculo-de-cuantiles]]. La función de distribución empírica, cuya inversa da los cuantiles, se estudia en la visualización de datos, y los gráficos Q-Q comparan cuantiles muestrales con los de una distribución teórica.

## Formulario

:::formula[Función de distribución empírica]
$$
\hat{F}(x) = \frac{1}{n}\#\{i : x_i \le x\}
$$

- $\hat{F}(x)$: proporción de datos menores o iguales a $x$.
- $n$: número de datos.
:::

:::formula[Cuantil por inversa]
$$
Q(p) = \min\{x : \hat{F}(x) \ge p\}
$$

- $p$: orden del cuantil, entre 0 y 1.
:::

:::formula[Cuantil por interpolación (método 7)]
$$
h = (n - 1)p + 1, \qquad Q(p) = x_{(\lfloor h \rfloor)} + (h - \lfloor h \rfloor)\big(x_{(\lfloor h \rfloor + 1)} - x_{(\lfloor h \rfloor)}\big)
$$

- $h$: posición fraccionaria en la lista ordenada.
- $x_{(k)}$: $k$-ésimo dato ordenado.
- $\lfloor h \rfloor$: parte entera de $h$.
:::

:::formula[Cuartiles, deciles y percentiles]
$$
Q_k = Q\!\left(\tfrac{k}{4}\right), \qquad D_k = Q\!\left(\tfrac{k}{10}\right), \qquad P_k = Q\!\left(\tfrac{k}{100}\right)
$$

- $k$: número del cuartil, decil o percentil.
:::
