---
id: transformacion-logaritmica-y-de-raiz
titulo: Transformación logarítmica y de raíz
titulo_en: Logarithmic and square-root transformations
alias:
  - transformación log
  - transformación raíz cuadrada
  - reexpresión de variables
modulo: 4
submodulo: '4.7'
orden: 9
nivel: basico
prerrequisitos:
  - asimetria-muestral
  - funcion-exponencial-y-logaritmo-natural
relaciones:
  - tipo: caso-particular
    id: transformacion-de-box-cox
etiquetas:
  - transformaciones
  - asimetría
  - escala
  - exploración
resumen: >
  Aplicar el logaritmo o la raíz cuadrada a una variable positiva comprime los valores grandes más que los
  pequeños. Corrige la asimetría a la derecha, estabiliza la dispersión y vuelve aditivas relaciones
  multiplicativas.
formula: 'y = \log x \quad (x > 0),\qquad y = \sqrt{x} \quad (x \ge 0)'
visualizacion:
  componente: FeatureTransformViz
  parametros:
    modo: transformacion
    muestra:
      nombre: Ingresos
      forma: sesgo-derecha
      parametro: 2
      centro: 20
      escala: 9
      n: 300
    eje:
      variable: Ingreso mensual del hogar
      unidad: miles de pesos
    funcion: log
referencias:
  - clave: james-isl
    capitulo: '3'
  - clave: hyndman-fpp
    capitulo: '3'
publicado: true
---

## Intuición

Los ingresos de los hogares de una ciudad tienen una cola larga: la mayoría gana entre 10 y 25 mil pesos al mes, pero unos pocos ganan 80 o 150. En un histograma, casi todos los datos quedan apretados a la izquierda y la cola ocupa la mayor parte del eje. Pasar de 10 a 20 mil pesos es, para un hogar, un cambio tan grande como pasar de 50 a 100, aunque en pesos la segunda diferencia sea cinco veces mayor.

El **logaritmo** mide justamente eso: cambios relativos. Al transformar, la distancia entre 10 y 20 es igual a la distancia entre 50 y 100, porque ambas son una duplicación. La cola se comprime, la distribución se vuelve más simétrica y los valores altos dejan de dominar. La **raíz cuadrada** hace algo parecido pero más suave: comprime menos y además acepta el cero, por lo que se usa mucho con conteos, cuya variabilidad crece con su nivel.

## Definición

:::definicion[Transformaciones logarítmica y de raíz]
Para una variable con valores $x_1, \dots, x_n$:

- La **transformación logarítmica** $y_i = \log x_i$ requiere $x_i > 0$. Con datos que incluyen ceros se usa $y_i = \log(x_i + c)$ con una constante $c > 0$, que debe reportarse.
- La **transformación de raíz cuadrada** $y_i = \sqrt{x_i}$ requiere $x_i \ge 0$.

Ambas son crecientes, de modo que conservan el orden de los datos y, en particular, los cuantiles: la mediana de los transformados es la transformada de la mediana.
:::

Al volver a la escala original, la media de los logaritmos da la **media geométrica**:
$$
\exp\Big(\frac{1}{n}\sum_{i=1}^{n} \log x_i\Big) = \Big(\prod_{i=1}^{n} x_i\Big)^{1/n},
$$
que es menor o igual que la media aritmética.

:::nota[Qué significa cada símbolo]
- $x_i$: valor original; $y_i$: valor transformado; $n$: número de datos.
- $\log$: logaritmo natural.
- $c$: constante positiva que se suma para poder aplicar el logaritmo a datos con ceros.
- $\exp$: función exponencial, inversa del logaritmo.
- $\prod$: producto de los $x_i$.
:::

## Cómo usar la visualización

Arriba está el histograma de los 300 ingresos y abajo el de los valores transformados. Al reproducir, los datos pasan por tandas de un eje al otro; las líneas muestran a dónde va cada valor. El encabezado calcula la transformación del último valor y compara la asimetría antes y después.

El selector **Transformación** ofrece la identidad, la raíz cuadrada, la raíz cúbica, el logaritmo natural, el logaritmo base 10 y el recíproco negativo.

Experimentos sugeridos:

1. Con el logaritmo, observar que las líneas de los valores altos convergen: la cola se comprime.
2. Cambiar a raíz cuadrada: la asimetría baja menos que con el logaritmo.
3. Probar el recíproco negativo: con esta cola, comprime demasiado y la asimetría cambia de signo.

## Ejemplo

Siete ingresos mensuales (miles de pesos): 8, 10, 12, 15, 20, 30 y 55.

1. Logaritmos: 2.079, 2.303, 2.485, 2.708, 2.996, 3.401 y 4.007. Entre 8 y 10 hay 0.22 unidades; entre 30 y 55, 0.61, aunque en pesos la segunda diferencia es más de 12 veces mayor.
2. Raíces: 2.83, 3.16, 3.46, 3.87, 4.47, 5.48 y 7.42.
3. Asimetría: 1.72 en la escala original, 1.28 con la raíz y 0.78 con el logaritmo.
4. Medias: aritmética 21.43, mediana 15, geométrica $e^{\overline{\log x}} \approx 17.36$. La media geométrica queda entre la mediana y la media aritmética, mucho menos afectada por el 55.

:::figura[Los siete ingresos del ejemplo con la transformación logarítmica.]{componente="FeatureTransformViz"}
```yaml
modo: transformacion
muestra:
  nombre: Ingresos
  valores: [8, 10, 12, 15, 20, 30, 55]
eje:
  variable: Ingreso mensual
  unidad: miles de pesos
funcion: log
```
:::

## Propiedades

- **Conserva el orden** y, por lo tanto, los cuantiles, que se transforman directamente.
- **Convierte productos en sumas:** $\log(ab) = \log a + \log b$; relaciones multiplicativas se vuelven aditivas y crecimientos porcentuales, rectas.
- **Estabiliza la varianza:** el logaritmo cuando la desviación es proporcional al nivel; la raíz cuando la varianza es proporcional al nivel, como en conteos de Poisson.
- **Fuerza ordenada:** raíz cuadrada, raíz cúbica, logaritmo y recíproco comprimen cada vez más la cola derecha.

:::figura[Raíz cuadrada para conteos: llamadas por hora en un centro de atención. La raíz reduce la asimetría sin problemas con los ceros.]{componente="FeatureTransformViz"}
```yaml
modo: transformacion
muestra:
  nombre: Llamadas
  forma: sesgo-derecha
  parametro: 4
  centro: 6
  escala: 3
  n: 250
  decimales: 0
eje:
  variable: Llamadas por hora
funcion: raiz
```
:::

## Errores comunes

- **Aplicar el logaritmo a ceros o negativos.** No está definido; hay que sumar una constante y reportarla, o usar transformaciones como la de Yeo-Johnson.
- **Transformar datos que ya son simétricos o tienen cola izquierda.** El logaritmo acentúa la asimetría negativa.
- **Volver a la escala original con la media de los transformados como si fuera la media.** $\exp(\overline{\log x})$ es la media geométrica, no la aritmética.

:::figura[Cola izquierda: calificaciones de un examen fácil. El logaritmo empeora la asimetría en lugar de corregirla.]{componente="FeatureTransformViz"}
```yaml
modo: transformacion
muestra:
  nombre: Calificaciones
  forma: sesgo-izquierda
  parametro: 3
  centro: 85
  escala: 6
  n: 200
eje:
  variable: Calificación
funcion: log
```
:::

:::figura[Datos con ceros: días de incapacidad de 12 trabajadores. El logaritmo no admite los ceros y la visualización los omite; la raíz los conserva.]{componente="FeatureTransformViz"}
```yaml
modo: transformacion
muestra:
  nombre: Incapacidad
  valores: [0, 0, 1, 0, 2, 3, 0, 5, 1, 8, 0, 14]
eje:
  variable: Días de incapacidad
funcion: log
```
:::

## Conexiones

La transformación logarítmica usa la [[funcion-exponencial-y-logaritmo-natural|función logaritmo]] y corrige la [[asimetria-muestral]] positiva. Su media de regreso es la [[media-geometrica]]. Es el caso $\lambda = 0$ de la [[transformacion-de-box-cox]], y la raíz cuadrada el caso $\lambda = 1/2$; para datos con negativos se usa la [[transformacion-de-yeo-johnson]]. En gráficas, el mismo efecto se obtiene con [[escalas-logaritmicas]].

## Formulario

:::formula[Transformación logarítmica]
$$
y_i = \log x_i,\qquad x_i > 0
$$

- $x_i$: valor original positivo; $y_i$: valor transformado; $\log$: logaritmo natural.
:::

:::formula[Logaritmo con desplazamiento]
$$
y_i = \log(x_i + c),\qquad c > 0
$$

- $c$: constante que permite transformar ceros.
:::

:::formula[Raíz cuadrada]
$$
y_i = \sqrt{x_i},\qquad x_i \ge 0
$$

- Transformación más suave que el logaritmo, adecuada para conteos.
:::

:::formula[Media geométrica]
$$
\exp\Big(\frac{1}{n}\sum_{i=1}^{n} \log x_i\Big) = \Big(\prod_{i=1}^{n} x_i\Big)^{1/n}
$$

- $n$: número de datos; la media de los logaritmos, devuelta a la escala original.
:::

:::formula[Producto en suma]
$$
\log(ab) = \log a + \log b
$$

- $a$, $b$: números positivos.
:::
