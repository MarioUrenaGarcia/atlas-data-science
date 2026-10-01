---
id: media-recortada
titulo: Media recortada
titulo_en: Trimmed mean
alias:
  - media truncada
  - trimmed mean
modulo: 4
submodulo: '4.2'
orden: 6
nivel: basico
prerrequisitos:
  - media-aritmetica
etiquetas:
  - tendencia central
  - estadística robusta
  - valores atípicos
  - recorte
resumen: >
  La media recortada descarta una proporción fija de los valores más pequeños y de los más grandes y
  promedia los restantes; combina la eficiencia de la media con la resistencia de la mediana.
formula: '\bar{x}_{\alpha} = \frac{1}{n - 2g}\sum_{i=g+1}^{n-g} x_{(i)}, \qquad g = \lfloor n\alpha \rfloor'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [210, 195, 230, 205, 220, 1800, 200, 215, 190, 225]
    medidas: [recortada, media, mediana]
    proporcion: 0.1
    variable: Tiempo de respuesta de un servidor
    unidad: ms
    decimales: 0
referencias:
  - clave: wasserman
  - clave: casella-berger
publicado: true
---

## Intuición

En las competencias de clavados, siete jueces califican cada salto, pero no todas las calificaciones cuentan: se descartan las más altas y las más bajas y se promedian las demás. Así, un juez demasiado generoso o demasiado severo no puede cambiar el resultado por sí solo. La calificación final sigue usando la información de la mayoría de los jueces, pero ignora los extremos donde suelen esconderse los sesgos y los errores.

La **media recortada** aplica esa regla a cualquier conjunto de datos: ordena los valores, quita el mismo número de observaciones de cada extremo y promedia lo que queda. Recortar poco la deja muy parecida a la media aritmética; recortar casi todo la convierte en la mediana. Entre esos dos extremos ofrece un compromiso útil cuando se sospecha que unos pocos valores son errores de medición o casos muy distintos del resto.

## Definición

:::definicion[Media recortada]
Sean $x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}$ los datos ordenados y $\alpha \in [0, 0.5)$ la proporción que se recorta en cada extremo. Con $g = \lfloor n\alpha \rfloor$ observaciones quitadas de cada lado, la **media recortada al $100\alpha$ %** es
$$
\bar{x}_{\alpha} = \frac{1}{n - 2g}\sum_{i=g+1}^{n-g} x_{(i)}.
$$
:::

Se habla de "media recortada al 10 %" para $\alpha = 0.1$: con 20 datos se quitan 2 por abajo y 2 por arriba. El recorte es simétrico; si la proporción no da un número entero de observaciones, se redondea hacia abajo.

:::figura[Recorte al 25 % de las edades de 12 asistentes a un taller, con un error de captura de 95 años y un registro de 2 años. Las observaciones recortadas aparecen atenuadas.]{componente="DataStrip"}
```yaml
modo: centro
datos: [31, 35, 29, 33, 38, 30, 36, 34, 32, 95, 37, 2]
medidas: [recortada, media]
proporcion: 0.25
variable: Edad
unidad: años
decimales: 0
```
:::

:::nota[Qué significa cada símbolo]
- $x_{(i)}$: valor que ocupa la posición $i$ al ordenar los datos de menor a mayor (estadístico de orden).
- $n$: número de observaciones.
- $\alpha$: proporción recortada en cada extremo.
- $g = \lfloor n\alpha \rfloor$: número de observaciones quitadas de cada lado.
- $\lfloor \cdot \rfloor$: parte entera, redondeo hacia abajo.
- $n - 2g$: número de observaciones que se promedian.
- $\bar{x}_{\alpha}$: media recortada.
:::

## Cómo usar la visualización

Los círculos son tiempos de respuesta de un servidor en diez solicitudes; una de ellas tardó 1800 ms por una falla de red. Las observaciones que el recorte descarta aparecen atenuadas, y el encabezado promedia solo las que quedan. El control de proporción define cuánto se recorta de cada lado.

Con proporción 0, la media recortada es la media aritmética y la falla la arrastra hasta 369 ms. Con 0.1 basta para descartar la falla, y la media recortada queda en 212.5 ms, junto a la mediana. Al llevar la proporción a 0.4 solo quedan los dos valores centrales y la media recortada coincide con la mediana.

## Ejemplo

Siete jueces califican un clavado: 7.5, 8.0, 8.0, 8.5, 9.5, 6.0 y 8.0. Se usa una media recortada que quita una calificación de cada extremo.

1. Datos ordenados: 6.0, 7.5, 8.0, 8.0, 8.0, 8.5, 9.5.
2. Se quitan $g = 1$ valores de cada lado: el 6.0 y el 9.5.
3. Quedan $n - 2g = 5$ valores: 7.5, 8.0, 8.0, 8.0, 8.5, que suman 40.
4. Media recortada: $40/5 = 8.0$.
5. La media aritmética de las siete calificaciones es $55.5/7 \approx 7.93$: el juez severo de 6.0 pesaba más que el generoso de 9.5.

:::figura[Las siete calificaciones del ejemplo con un recorte del 15 %, que con n = 7 quita una calificación de cada extremo.]{componente="DataStrip"}
```yaml
modo: centro
datos: [7.5, 8.0, 8.0, 8.5, 9.5, 6.0, 8.0]
medidas: [recortada, media]
proporcion: 0.15
variable: Calificación del clavado
decimales: 1
dominio: [5.5, 10]
etiquetas: [J1, J2, J3, J4, J5, J6, J7]
```
:::

## Propiedades

- **Familia entre la media y la mediana:** $\alpha = 0$ da la media; cuando $\alpha$ se acerca a 0.5 se obtiene la mediana.
- **Resistencia:** la media recortada al $100\alpha$ % tolera hasta una fracción $\alpha$ de valores arbitrariamente grandes en cada extremo sin cambiar sin límite; su punto de ruptura es aproximadamente $\alpha$.
- **Eficiencia:** si los datos vienen de una distribución normal, la media recortada al 10 % o 20 % pierde poca precisión respecto a la media; con distribuciones de colas pesadas suele ser más precisa que ella.
- **Simetría:** en una distribución simétrica, la media recortada estima el mismo centro que la media y la mediana.

:::figura[Propiedad de la familia: con recorte del 40 % de los tiempos de respuesta, solo quedan las dos observaciones centrales y la media recortada coincide con la mediana.]{componente="DataStrip"}
```yaml
modo: centro
datos: [210, 195, 230, 205, 220, 1800, 200, 215, 190, 225]
medidas: [recortada, mediana, media]
proporcion: 0.4
variable: Tiempo de respuesta de un servidor
unidad: ms
decimales: 0
```
:::

## Errores comunes

- **Recortar solo el extremo "molesto".** Quitar únicamente los valores altos sesga el resultado hacia abajo; el recorte debe ser simétrico y decidirse antes de ver los datos.
- **Recortar datos asimétricos y llamarlo media.** En variables con cola larga, como el gasto por cliente, los valores grandes no son errores: son parte de la población. La media recortada describe el centro del grueso de los datos, no el gasto promedio que interesa para calcular un total.
- **Confundir recortar con eliminar atípicos.** El recorte quita siempre la misma proporción, haya o no valores atípicos.

:::figura[Error con datos asimétricos: gasto de diez clientes, en cientos de pesos. Recortar el 20 % baja el resultado de 23.7 a 15.7, pero los clientes de gasto alto existen y cuentan para el total.]{componente="DataStrip"}
```yaml
modo: centro
datos: [4, 6, 7, 9, 12, 15, 21, 30, 48, 85]
medidas: [recortada, media]
proporcion: 0.2
variable: Gasto por cliente
unidad: cientos de pesos
decimales: 0
```
:::

## Conexiones

La media recortada interpola entre la [[media-aritmetica]] y la [[mediana]]. La [[media-winsorizada]] usa la misma idea, pero en lugar de quitar los extremos los sustituye por los valores más cercanos que se conservan. Es uno de los estimadores robustos más simples y se apoya en los estadísticos de orden, los mismos que definen los cuantiles.

## Formulario

:::formula[Media recortada]
$$
\bar{x}_{\alpha} = \frac{1}{n - 2g}\sum_{i=g+1}^{n-g} x_{(i)}
$$

- $x_{(i)}$: $i$-ésimo valor ordenado.
- $n$: número de datos.
- $g$: datos quitados de cada lado.
:::

:::formula[Número de datos recortados]
$$
g = \lfloor n\alpha \rfloor
$$

- $\alpha$: proporción de recorte por lado, entre 0 y 0.5.
- $\lfloor \cdot \rfloor$: redondeo hacia abajo.
:::

:::formula[Casos extremos]
$$
\bar{x}_{0} = \bar{x}, \qquad \lim_{\alpha \to 0.5} \bar{x}_{\alpha} = \tilde{x}
$$

- $\bar{x}$: media aritmética.
- $\tilde{x}$: mediana.
:::
