---
id: funcion-de-distribucion-empirica
titulo: Función de distribución empírica (ECDF)
titulo_en: Empirical cumulative distribution function
alias:
  - ECDF
  - distribución acumulada empírica
  - función de distribución muestral
modulo: 4
submodulo: '4.6'
orden: 7
nivel: basico
prerrequisitos:
  - cuantiles-cuartiles-deciles-y-percentiles
  - funcion-indicadora-y-funcion-escalon
etiquetas:
  - visualización
  - distribución acumulada
  - comparación de grupos
  - escalera
resumen: >
  La función de distribución empírica da, para cada valor x, la proporción de datos menores o iguales a
  x. Se dibuja como una escalera que sube 1/n en cada dato y no requiere elegir intervalos.
formula: '\hat{F}_n(x) = \frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{x_i \le x\}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: ecdf
    grupos:
      - nombre: Sucursal Norte
        forma: normal
        centro: 12
        escala: 3
        n: 60
      - nombre: Sucursal Sur
        forma: sesgo-derecha
        parametro: 3
        centro: 15
        escala: 4
        n: 60
    eje:
      variable: Tiempo de entrega
      unidad: min
referencias:
  - clave: wasserman
    capitulo: '7'
publicado: true
---

## Intuición

Una cadena de comida a domicilio quiere comparar los tiempos de entrega de dos sucursales. Una pregunta natural es: ¿qué fracción de las entregas llega en menos de 15 minutos? Si se responde esa pregunta para cada tiempo posible, 5, 10, 15, 20 minutos, y se grafica la respuesta, se obtiene una curva que empieza en 0 y termina en 1. Esa curva es la **función de distribución empírica**.

Se dibuja como una escalera: cada entrega hace subir la curva un escalón del mismo tamaño en su tiempo. Donde hay muchas entregas juntas, la escalera sube rápido; donde hay pocas, avanza casi plana. A diferencia del histograma, no hay que elegir intervalos ni anchos de banda, no se pierde ningún dato y se pueden leer directamente medianas, percentiles y proporciones. Para comparar dos grupos, la curva que queda más a la derecha corresponde al grupo con valores más grandes.

## Definición

:::definicion[Función de distribución empírica]
Para datos $x_1, \dots, x_n$, la **función de distribución empírica** es

$$
\hat{F}_n(x) = \frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{x_i \le x\} = \frac{\#\{i : x_i \le x\}}{n}.
$$

Es una función escalonada, no decreciente, continua por la derecha, que vale 0 antes del dato más pequeño y 1 a partir del más grande, y salta $k/n$ en un valor que se repite $k$ veces.
:::

Para comparar dos muestras se usa la mayor distancia vertical entre sus funciones, $D = \max_x |\hat{F}_1(x) - \hat{F}_2(x)|$, base de la prueba de Kolmogorov-Smirnov.

:::figura[Función de distribución empírica de un solo grupo: 80 duraciones de baterías. La escalera sube rápido alrededor de los valores más frecuentes.]{componente="ChartGallery"}
```yaml
grafico: ecdf
grupos:
  - nombre: Baterías
    forma: normal
    centro: 18
    escala: 2
    n: 80
eje:
  variable: Duración de la batería
  unidad: h
```
:::

:::nota[Qué significa cada símbolo]
- $\hat{F}_n(x)$: proporción de datos menores o iguales a $x$.
- $x_i$: datos; $n$: número de datos.
- $\mathbf{1}\{x_i \le x\}$: indicadora, vale 1 si $x_i \le x$ y 0 si no.
- $\#\{\cdot\}$: número de datos que cumplen la condición.
- $D$: mayor distancia vertical entre dos funciones empíricas.
- $\hat{F}_1$, $\hat{F}_2$: funciones de distribución empírica de dos muestras.
:::

## Cómo usar la visualización

Las dos escaleras corresponden a 60 entregas de cada sucursal y crecen a medida que llegan los datos. El encabezado muestra la mayor distancia vertical entre ambas, marcada con un segmento, y el panel compara sus medianas.

La escalera de la Sucursal Sur queda casi siempre a la derecha: para cualquier tiempo, una proporción menor de sus entregas ya llegó. Al principio, con pocos datos, las escaleras son toscas y la distancia cambia mucho; al completar las 60 entregas se estabilizan. La mediana de cada grupo es el valor donde su escalera cruza la altura 0.5.

## Ejemplo

Cinco tiempos de respuesta de un servidor: 3.2, 4.5, 4.5, 6.1 y 7.8 segundos.

1. Para $x < 3.2$: ningún dato es menor o igual, $\hat{F}(x) = 0$.
2. En $x = 3.2$ la escalera sube a $1/5 = 0.2$.
3. En $x = 4.5$, dos datos iguales hacen un salto doble: $\hat{F}(4.5) = 3/5 = 0.6$.
4. Entre 4.5 y 6.1 la función se mantiene en 0.6; por ejemplo, $\hat{F}(5) = 0.6$.
5. En 6.1 sube a 0.8 y en 7.8 a 1; para cualquier $x \ge 7.8$, $\hat{F}(x) = 1$.

:::figura[Los cinco tiempos del ejemplo: el escalón doble en 4.5 corresponde al dato repetido.]{componente="ChartGallery"}
```yaml
grafico: ecdf
grupos:
  - nombre: Servidor
    valores: [3.2, 4.5, 4.5, 6.1, 7.8]
eje:
  variable: Tiempo de respuesta
  unidad: s
```
:::

## Propiedades

- **Estimador natural:** para cada $x$ fijo, $\hat{F}_n(x)$ es la proporción de éxitos en $n$ ensayos y estima sin sesgo $F(x) = P(X \le x)$.
- **Convergencia uniforme:** por el teorema de Glivenko-Cantelli, la distancia máxima entre $\hat{F}_n$ y $F$ tiende a cero al crecer $n$.
- **Lectura de cuantiles:** la inversa de la escalera da los cuantiles muestrales.
- **No requiere decisiones:** no hay intervalos ni ancho de banda que elegir, a diferencia del histograma y la densidad.

:::figura[Propiedad de comparación: tres grupos de estudiantes con distintas horas de estudio. Las escaleras ordenadas de izquierda a derecha indican que un grupo estudia sistemáticamente más que otro.]{componente="ChartGallery"}
```yaml
grafico: ecdf
grupos:
  - nombre: Primer año
    forma: normal
    centro: 8
    escala: 2
    n: 50
  - nombre: Segundo año
    forma: normal
    centro: 10
    escala: 2
    n: 50
  - nombre: Tercer año
    forma: normal
    centro: 12
    escala: 2.5
    n: 50
eje:
  variable: Horas de estudio a la semana
  unidad: h
```
:::

## Errores comunes

- **Leerla como una densidad.** La altura no indica dónde hay más datos; es la pendiente de la escalera la que lo indica.
- **Olvidar los saltos múltiples.** Con datos repetidos, la escalera sube varios escalones de golpe.
- **Esperar que dos muestras de la misma población coincidan.** Con pocos datos, dos escaleras pueden separarse bastante por azar.

:::figura[Dos muestras pequeñas de la misma población de pesos: aunque provienen de la misma distribución, sus escaleras se separan visiblemente.]{componente="ChartGallery"}
```yaml
grafico: ecdf
grupos:
  - nombre: Muestra 1
    forma: normal
    centro: 70
    escala: 10
    n: 12
  - nombre: Muestra 2
    forma: normal
    centro: 70
    escala: 10
    n: 12
eje:
  variable: Peso
  unidad: kg
```
:::

## Conexiones

La función de distribución empírica es la inversa de los [[cuantiles-cuartiles-deciles-y-percentiles|cuantiles]] y se escribe con la [[funcion-indicadora-y-funcion-escalon|función indicadora]]. Es la contraparte muestral de la función de distribución acumulada de una variable aleatoria, y la base de los [[grafico-p-p|gráficos P-P]], que la comparan con una distribución teórica, y de la prueba de Kolmogorov-Smirnov.

## Formulario

:::formula[Función de distribución empírica]
$$
\hat{F}_n(x) = \frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{x_i \le x\}
$$

- $\mathbf{1}\{\cdot\}$: indicadora; $x_i$: datos; $n$: número de datos.
:::

:::formula[Distancia entre dos muestras]
$$
D = \max_x \big|\hat{F}_1(x) - \hat{F}_2(x)\big|
$$

- $\hat{F}_1$, $\hat{F}_2$: funciones empíricas de cada muestra.
:::

:::formula[Teorema de Glivenko-Cantelli]
$$
\sup_x \big|\hat{F}_n(x) - F(x)\big| \longrightarrow 0
$$

- $F$: función de distribución de la población; la convergencia es con probabilidad 1 al crecer $n$.
- $\sup_x$: supremo sobre todos los valores de $x$.
:::
