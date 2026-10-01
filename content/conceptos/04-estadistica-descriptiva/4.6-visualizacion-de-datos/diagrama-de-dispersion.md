---
id: diagrama-de-dispersion
titulo: Diagrama de dispersión
titulo_en: Scatter plot
alias:
  - gráfico de dispersión
  - nube de puntos
  - scatterplot
modulo: 4
submodulo: '4.6'
orden: 10
nivel: basico
prerrequisitos:
  - unidad-de-observacion-y-datos-ordenados
relaciones:
  - tipo: relacionado
    id: coeficiente-de-correlacion-de-pearson
  - tipo: relacionado
    id: covarianza-muestral
etiquetas:
  - visualización
  - dos variables
  - relación
  - sobreposición de puntos
resumen: >
  El diagrama de dispersión dibuja cada observación como un punto con coordenadas (x, y). Muestra la
  forma, la dirección y la fuerza de la relación entre dos variables cuantitativas, y los puntos que se
  apartan del patrón.
formula: '\{(x_i, y_i) : i = 1, \dots, n\} \subset \mathbb{R}^2'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: dispersion
    generador:
      n: 150
      pendiente: 0.5
      ruido: 5
      media: 172
      escala: 7
    ejes:
      x:
        variable: Estatura del padre
        unidad: cm
      y:
        variable: Estatura del hijo
        unidad: cm
    vista: puntos
referencias:
  - clave: james-isl
    capitulo: '2'
  - clave: tufte
publicado: true
---

## Intuición

Una clínica registra la estatura de 150 padres y la de sus hijos adultos. Una tabla con 300 números no deja ver casi nada; en cambio, si cada familia se dibuja como un punto, con la estatura del padre en el eje horizontal y la del hijo en el vertical, aparece de inmediato una nube alargada que sube hacia la derecha: los padres altos tienden a tener hijos altos, aunque con mucha variación.

Eso es un **diagrama de dispersión**: un punto por observación, colocado según dos mediciones de la misma unidad. A simple vista se responden cuatro preguntas: si hay relación (la nube tiene una dirección), qué forma tiene (recta, curva, por grupos), qué tan fuerte es (nube delgada o gruesa) y qué observaciones no siguen el patrón. Ningún resumen numérico responde las cuatro a la vez; por eso el diagrama se dibuja antes de calcular cualquier coeficiente.

## Definición

:::definicion[Diagrama de dispersión]
Dados $n$ pares de mediciones $(x_1, y_1), \dots, (x_n, y_n)$ tomados sobre las mismas unidades, el **diagrama de dispersión** es la representación del conjunto

$$
\{(x_i, y_i) : i = 1, \dots, n\} \subset \mathbb{R}^2
$$

como puntos en el plano cartesiano, con $x$ en el eje horizontal y $y$ en el vertical.
:::

Supuestos y convenciones:

- Las dos variables son cuantitativas y cada par corresponde a la misma unidad de observación.
- Si una variable se considera explicativa, se coloca en el eje horizontal y la respuesta en el vertical.
- Cuando muchos pares coinciden o están muy juntos (**sobreposición**), se usa transparencia, un pequeño desplazamiento aleatorio o conteos por regiones.

:::nota[Qué significa cada símbolo]
- $n$: número de observaciones (puntos).
- $x_i$, $y_i$: valores de las dos variables en la observación $i$.
- $(x_i, y_i)$: coordenadas del punto $i$.
- $\mathbb{R}^2$: el plano de números reales.
:::

## Cómo usar la visualización

La nube se forma por tandas de puntos. El encabezado muestra cuántos puntos hay, cuántas posiciones distintas ocupan y la correlación $r$ de lo dibujado.

El selector **Forma de dibujar** cambia la representación sin cambiar los datos: puntos opacos, puntos con transparencia, un desplazamiento aleatorio pequeño o hexágonos con conteos.

Experimentos sugeridos:

1. Pausar con 20 puntos y observar que la dirección ya se intuye, aunque $r$ todavía oscila; al completar los 150 se estabiliza.
2. Cambiar a transparencia: las zonas donde se acumulan más familias se ven más oscuras.
3. Comparar el número de puntos con el de posiciones distintas: si coinciden, no hay sobreposición exacta.

## Ejemplo

Seis estaciones meteorológicas registran la altitud (en cientos de metros) y la temperatura media anual (°C):

| Estación | Altitud $x$ | Temperatura $y$ |
| -------- | ----------- | --------------- |
| A        | 2           | 24              |
| B        | 5           | 22              |
| C        | 9           | 19              |
| D        | 14          | 16              |
| E        | 18          | 13              |
| F        | 22          | 11              |

1. Cada estación se dibuja como un punto: A en $(2, 24)$, F en $(22, 11)$.
2. Los puntos bajan de izquierda a derecha: a mayor altitud, menor temperatura (relación **negativa**).
3. Quedan casi sobre una recta: relación **lineal y fuerte**; la pendiente aproximada es $(11 - 24)/(22 - 2) = -0.65$ °C por cada 100 m.
4. Ningún punto se aparta del patrón: no hay atípicos.

:::figura[Las seis estaciones del ejemplo: la nube baja casi en línea recta, relación negativa y fuerte.]{componente="ChartGallery"}
```yaml
grafico: dispersion
puntos: [[2, 24], [5, 22], [9, 19], [14, 16], [18, 13], [22, 11]]
ejes:
  x:
    variable: Altitud
    unidad: cientos de m
  y:
    variable: Temperatura media
    unidad: °C
```
:::

## Propiedades

**Dirección.** Si la nube sube hacia la derecha la asociación es positiva; si baja, negativa; si no tiene inclinación, no hay asociación lineal.

:::figura[Relación positiva y débil: puntajes de dos exámenes parciales de 200 estudiantes. La nube sube, pero es ancha.]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 200
  pendiente: 0.4
  ruido: 9
  media: 70
  escala: 10
ejes:
  x:
    variable: Primer parcial
  y:
    variable: Segundo parcial
```
:::

:::figura[Sin asociación: talla de calzado y minutos de traslado al trabajo en 150 empleados. La nube no tiene inclinación.]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 150
  pendiente: 0
  ruido: 12
  media: 26
  mediaY: 40
  escala: 1.5
ejes:
  x:
    variable: Talla de calzado
  y:
    variable: Minutos de traslado
```
:::

**Forma.** Una nube curva indica una relación no lineal que la correlación de Pearson no resume bien.

:::figura[Relación curva: velocidad de un automóvil y consumo de combustible. El consumo baja y luego sube; la correlación lineal es apenas 0.21 aunque la relación es fuerte.]{componente="ChartGallery"}
```yaml
grafico: dispersion
puntos:
  [
    [30, 9.1],
    [40, 7.8],
    [50, 6.9],
    [60, 6.3],
    [70, 6.0],
    [80, 6.1],
    [90, 6.6],
    [100, 7.4],
    [110, 8.5],
    [120, 9.9],
  ]
ejes:
  x:
    variable: Velocidad
    unidad: km/h
  y:
    variable: Consumo
    unidad: L/100 km
```
:::

**Sobreposición.** Con muchos datos o valores redondeados, varios puntos caen en el mismo lugar y la nube engaña: zonas con cientos de observaciones se ven igual que zonas con una.

:::figura[Sobreposición: 2000 edades redondeadas a años enteros contra el gasto mensual. Con puntos opacos cada columna parece uniforme; la transparencia o el desplazamiento aleatorio revelan dónde se concentran los datos.]{componente="ChartGallery"}
```yaml
grafico: dispersion
generador:
  n: 2000
  pendiente: 40
  ruido: 300
  media: 35
  mediaY: 3000
  escala: 8
  redondeo: 1
ejes:
  x:
    variable: Edad
    unidad: años
  y:
    variable: Gasto mensual
    unidad: pesos
vista: puntos
```
:::

## Errores comunes

- **Concluir causalidad.** Que la nube suba no prueba que $x$ cause $y$; una tercera variable puede mover a ambas.
- **Ignorar la escala de los ejes.** Estirar o comprimir un eje cambia la impresión de fuerza sin cambiar los datos; la correlación no depende de esa elección.
- **No ver la sobreposición.** Un punto puede representar a cientos de observaciones; sin transparencia o conteos se subestima la densidad de las zonas centrales.
- **Leer un atípico como tendencia.** Un solo punto alejado puede dominar la impresión visual y la correlación.

:::figura[Un atípico que inventa una relación: diez mediciones sin asociación más un punto extremo. La correlación sube por un solo dato.]{componente="ChartGallery"}
```yaml
grafico: dispersion
puntos: [[4, 5], [5, 3], [6, 6], [4, 4], [5, 6], [6, 4], [5, 5], [4, 6], [6, 5], [5, 4], [15, 16]]
ejes:
  x:
    variable: Variable x
  y:
    variable: Variable y
```
:::

## Conexiones

El diagrama de dispersión es la imagen de la [[covarianza-muestral]] y del [[coeficiente-de-correlacion-de-pearson]]: ambos resumen en un número lo que la nube muestra completo. Con varias variables se organiza en una [[matriz-de-diagramas-de-dispersion]]; cuando hay demasiados puntos se reemplaza por un [[grafico-hexbin]]. El [[cuarteto-de-anscombe]] y el [[datasaurus-dozen]] muestran por qué siempre conviene dibujarlo antes de resumir.

## Formulario

:::formula[Conjunto representado]
$$
\{(x_i, y_i) : i = 1, \dots, n\} \subset \mathbb{R}^2
$$

- $n$: número de observaciones.
- $x_i$: valor de la variable horizontal en la observación $i$.
- $y_i$: valor de la variable vertical en la observación $i$.
- $\mathbb{R}^2$: plano cartesiano.
:::

:::formula[Pendiente entre dos puntos]
$$
m = \frac{y_b - y_a}{x_b - x_a}
$$

- $m$: cambio de $y$ por cada unidad de $x$ entre los dos puntos.
- $(x_a, y_a)$, $(x_b, y_b)$: coordenadas de los dos puntos, con $x_a \ne x_b$.
:::
