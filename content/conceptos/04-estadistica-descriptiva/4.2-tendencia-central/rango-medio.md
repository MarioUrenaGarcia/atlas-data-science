---
id: rango-medio
titulo: Rango medio
titulo_en: Midrange
alias:
  - semirrango central
  - midrange
  - promedio de extremos
modulo: 4
submodulo: '4.2'
orden: 10
nivel: basico
prerrequisitos:
  - media-aritmetica
etiquetas:
  - tendencia central
  - extremos
  - mínimo y máximo
resumen: >
  El rango medio es el promedio del mínimo y el máximo de los datos. Es fácil de calcular, pero solo
  usa dos observaciones y es muy sensible a los valores extremos.
formula: '\operatorname{RM} = \frac{x_{(1)} + x_{(n)}}{2}'
visualizacion:
  componente: DataStrip
  parametros:
    modo: centro
    datos: [14, 15, 17, 20, 24, 28, 31, 30, 27, 22, 18, 16]
    medidas: [rango-medio, media, mediana]
    variable: Temperatura cada dos horas en un día
    unidad: °C
    decimales: 0
    dominio: [10, 35]
referencias:
  - clave: degroot
publicado: true
---

## Intuición

Muchos reportes meteorológicos antiguos calculaban la temperatura media del día como el promedio entre la máxima y la mínima, porque los termómetros de máximas y mínimas solo registraban esos dos valores. Es una cuenta sencilla: si el día amaneció a 14 °C y llegó a 31 °C, la "temperatura media" sería 22.5 °C.

Ese número es el **rango medio**: el punto que queda a la mitad entre el dato más pequeño y el más grande. Es el centro del intervalo que ocupan los datos, no el centro de los datos. Si la temperatura pasó la mayor parte del día fresca y solo subió un par de horas, el rango medio no lo nota, porque ignora todo lo que ocurre entre los dos extremos. Por la misma razón, una lectura errónea en cualquiera de los extremos lo cambia por completo.

## Definición

:::definicion[Rango medio]
Con $x_{(1)} = \min_i x_i$ y $x_{(n)} = \max_i x_i$, el **rango medio** es
$$
\operatorname{RM} = \frac{x_{(1)} + x_{(n)}}{2}.
$$
:::

Requiere al menos una escala de intervalo. Es el centro del intervalo $[x_{(1)}, x_{(n)}]$, cuya longitud es el rango, y se escribe también como $x_{(1)} + \frac{1}{2}(x_{(n)} - x_{(1)})$.

:::figura[Rango medio de las calificaciones de ocho estudiantes de un taller, todas entre 47 y 53. En datos simétricos sin extremos, el rango medio coincide con la media.]{componente="DataStrip"}
```yaml
modo: centro
datos: [48, 52, 50, 49, 51, 50, 53, 47]
medidas: [rango-medio, media]
variable: Puntaje en el examen
unidad: puntos
decimales: 0
dominio: [44, 56]
```
:::

:::nota[Qué significa cada símbolo]
- $\operatorname{RM}$: rango medio.
- $x_{(1)}$: dato más pequeño (primer dato ordenado).
- $x_{(n)}$: dato más grande ($n$-ésimo dato ordenado).
- $n$: número de datos.
- $\min_i$, $\max_i$: mínimo y máximo sobre todas las observaciones.
:::

## Cómo usar la visualización

Los doce círculos son temperaturas registradas cada dos horas durante un día. Se comparan tres marcadores: el rango medio, la media y la mediana. El encabezado muestra que el rango medio solo usa el primer y el último dato ordenados.

Al arrastrar cualquier lectura intermedia, el rango medio no se mueve, aunque cambien la media y la mediana. Al arrastrar la máxima de 31 °C hasta 35 °C, el rango medio sube 2 °C, la mitad del cambio, mientras que la media sube solo un tercio de grado.

## Ejemplo

En una estación, el día registra mínima de 14 °C y máxima de 31 °C, y las doce lecturas del día son 14, 15, 17, 20, 24, 28, 31, 30, 27, 22, 18 y 16 °C.

1. Rango medio: $(14 + 31)/2 = 22.5$ °C.
2. Media de las doce lecturas: $262/12 \approx 21.83$ °C.
3. Mediana: los datos centrales ordenados son 20 y 22, así que $\tilde{x} = 21$ °C.
4. El rango medio sobrestima la temperatura media del día en casi 0.7 °C, porque el día pasó más horas en la parte fresca del intervalo.

:::figura[Las lecturas del ejemplo. El rango medio queda a la derecha de la media y de la mediana.]{componente="DataStrip"}
```yaml
modo: centro
datos: [14, 15, 17, 20, 24, 28, 31, 30, 27, 22, 18, 16]
medidas: [rango-medio, media]
variable: Temperatura
unidad: °C
decimales: 0
dominio: [10, 35]
```
:::

## Propiedades

- **Solo depende de dos datos:** cambiar cualquier observación que no sea el mínimo o el máximo no lo altera.
- **Máxima sensibilidad a extremos:** si el máximo cambia en $\Delta$, el rango medio cambia en $\Delta/2$, mientras que la media cambia en $\Delta/n$.
- **Equivarianza lineal:** si $y_i = a + b x_i$ con $b > 0$, entonces $\operatorname{RM}_y = a + b\,\operatorname{RM}_x$.
- **Buen estimador en un caso especial:** si los datos vienen de una distribución uniforme continua, el rango medio estima su centro con más precisión que la media; en casi cualquier otra situación es peor.

:::figura[Propiedad de sensibilidad: las calificaciones del taller con una calificación que se desliza hasta 95 por un error de captura. El rango medio se desplaza mucho más que la media.]{componente="DataStrip"}
```yaml
modo: centro
datos: [48, 52, 50, 49, 51, 50, 53, 47]
medidas: [rango-medio, media]
atipico:
  indice: 6
  hasta: 95
variable: Puntaje en el examen
unidad: puntos
decimales: 0
```
:::

## Errores comunes

- **Usarlo como sinónimo de media.** El promedio de la máxima y la mínima no es el promedio de los datos, salvo en distribuciones simétricas.
- **Confundirlo con la mediana.** El rango medio es el centro del intervalo; la mediana es el centro de los datos ordenados.
- **Confundirlo con el rango.** El rango es la longitud del intervalo, $x_{(n)} - x_{(1)}$; el rango medio es su punto central.

:::figura[Error de "promedio de extremos": tiempos de entrega con cola larga. El rango medio cae lejos de donde están la mayoría de los pedidos y de su mediana.]{componente="DataStrip"}
```yaml
modo: centro
datos: [3, 3, 4, 4, 4, 5, 5, 6, 7, 21]
medidas: [rango-medio, mediana, media]
variable: Tiempo de entrega
unidad: días
decimales: 0
```
:::

## Conexiones

El rango medio es la [[media-aritmetica]] de los dos estadísticos de orden extremos. Se contrasta con la [[mediana]], que es resistente, y con la media, que usa todos los datos. Comparte información con el rango, la medida de dispersión más simple, que es la distancia entre los mismos dos extremos.

## Formulario

:::formula[Rango medio]
$$
\operatorname{RM} = \frac{x_{(1)} + x_{(n)}}{2}
$$

- $x_{(1)}$: mínimo de los datos.
- $x_{(n)}$: máximo de los datos.
:::

:::formula[Efecto de cambiar el máximo]
$$
\Delta\operatorname{RM} = \frac{\Delta}{2}
$$

- $\Delta$: cambio en el valor máximo.
- $\Delta\operatorname{RM}$: cambio resultante en el rango medio.
:::

:::formula[Relación con el rango]
$$
\operatorname{RM} = x_{(1)} + \frac{x_{(n)} - x_{(1)}}{2}
$$

- $x_{(n)} - x_{(1)}$: rango de los datos.
:::
