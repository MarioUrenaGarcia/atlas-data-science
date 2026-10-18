---
id: agregaciones-por-grupo
titulo: Agregaciones por grupo
titulo_en: Group aggregations
alias:
  - características agregadas
  - group by
  - resúmenes por entidad
modulo: 12
submodulo: '12.3'
orden: 17
nivel: basico
prerrequisitos:
  - unidad-de-observacion-y-datos-ordenados
  - media-aritmetica
etiquetas:
  - ingeniería de características
  - agregación
  - unidad de análisis
  - transacciones
resumen: >
  Una agregación por grupo resume muchas filas de una misma entidad (las compras de un cliente) en estadísticos
  como conteo, suma, media o máximo, que se vuelven columnas de una tabla con una fila por entidad.
formula: 'S_c = \sum_{i:\,c_i = c} m_i,\qquad \bar{m}_c = \frac{S_c}{n_c}'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: agregacion
    estadistico: suma
referencias:
  - clave: hastie-esl
  - clave: james-isl
publicado: true
---

## Intuición

Una tienda quiere predecir qué clientes dejarán de comprar. Sus datos están en una tabla de compras: cada fila es una compra, con cliente, fecha y monto. Pero el modelo tiene que decidir sobre clientes, no sobre compras: necesita una fila por cliente. La tabla de compras tiene la unidad de observación equivocada.

**Agregar por grupo** resuelve el cambio de unidad. Se reúnen todas las compras de cada cliente y se resumen con unos cuantos números: cuántas compras hizo, cuánto gastó en total, cuál es su compra promedio, cuál fue la mayor, cuántos días han pasado desde la última. Cada resumen es una característica nueva en la tabla de clientes. Clientes con el mismo gasto total pueden ser muy distintos: uno compra poco y seguido, otro compra una sola vez algo caro. Por eso conviene combinar varios estadísticos. Las agregaciones también pueden hacerse sobre ventanas de tiempo (gasto en los últimos 30 días) siempre que la ventana termine antes del momento de la predicción.

## Definición

:::definicion[Agregación por grupo]
Sea una tabla con filas $i = 1, \dots, N$, cada una con una clave de grupo $c_i$ y un valor $m_i$. Para cada grupo $c$ se definen

$$
n_c = \sum_{i} \mathbf{1}\{c_i = c\}, \quad S_c = \sum_{i:\,c_i = c} m_i, \quad \bar{m}_c = \frac{S_c}{n_c}, \quad M_c = \max_{i:\,c_i = c} m_i .
$$

La tabla agregada tiene una fila por grupo y una columna por estadístico.
:::

:::nota[Qué significa cada símbolo]
- $N$: número de filas de la tabla original (compras).
- $c_i$: grupo de la fila $i$ (cliente).
- $m_i$: valor de la fila $i$ (monto de la compra).
- $\mathbf{1}\{c_i = c\}$: indicadora de que la fila pertenece al grupo $c$.
- $n_c$: número de filas del grupo.
- $S_c$: suma de los valores del grupo.
- $\bar{m}_c$: media de los valores del grupo.
- $M_c$: máximo de los valores del grupo.
:::

## Cómo usar la visualización

A la izquierda están las compras en orden de llegada; a la derecha, la tabla de clientes que se construye. Al reproducir, cada compra se procesa y actualiza los cuatro agregados de su cliente; la fila del cliente se resalta y las barras muestran el agregado elegido en el selector. El encabezado indica la fórmula del agregado y el valor actualizado.

Experimentos sugeridos: elegir el número de compras y luego el ticket promedio, y observar que el cliente que más compra no es el que más gasta por compra.

## Ejemplo

Andrea hizo tres compras de 150, 210 y 190 pesos; Darío hizo una sola compra de 2400 pesos.

1. Andrea: $n = 3$, $S = 150 + 210 + 190 = 550$, $\bar{m} = 550/3 = 183.3$, $M = 210$.
2. Darío: $n = 1$, $S = 2400$, $\bar{m} = 2400$, $M = 2400$.
3. La tabla de clientes tiene dos filas y cuatro columnas nuevas. Por gasto total, Darío vale más; por frecuencia, Andrea es más leal.

:::figura[El número de compras por cliente: quien más compra no es quien más gasta, como muestra la visualización principal con el gasto total.]{componente="FeatureEngineeringViz"}
```yaml
modo: agregacion
estadistico: conteo
```
:::

## Propiedades

- **Cambia la unidad de observación.** De una fila por evento a una fila por entidad, que es la que pide el planteamiento.
- **Cada estadístico capta un aspecto distinto.** Conteo, suma, media y máximo pueden ordenar a los clientes de formas diferentes.

:::figura[La compra máxima de cada cliente: un cliente con compras ocasionales grandes destaca aunque su conteo sea bajo.]{componente="FeatureEngineeringViz"}
```yaml
modo: agregacion
estadistico: maximo
```
:::

- **La media es la suma entre el conteo.** Con conteo y suma se puede reconstruir la media; agregar los tres no añade información para un modelo lineal, aunque sí para uno no lineal.

## Errores comunes

- **Agregar con datos posteriores al momento de la predicción.** Si se cuenta el gasto de todo el año para predecir el abandono de marzo, las compras de abril se filtran al modelo.
- **Usar la media de grupos con una sola fila como si fuera estable.** El ticket promedio de un cliente con una compra es solo esa compra; conviene acompañarlo del conteo.
- **Unir de vuelta los agregados a la tabla de eventos sin cuidado.** Si cada compra recibe la media de su cliente calculada con ella misma, la columna contiene información de la respuesta en problemas donde el monto es lo que se predice.

:::figura[Error de confiar en promedios de pocos datos: el ticket promedio del cliente con una sola compra es esa misma compra y no describe un hábito.]{componente="FeatureEngineeringViz"}
```yaml
modo: agregacion
estadistico: media
semilla: 12
```
:::

## Conexiones

El cambio de tabla responde a la pregunta de cuál es la [[unidad-de-observacion-y-datos-ordenados|unidad de observación]] fijada en el [[planteamiento-del-problema]]. Los estadísticos son la [[media-aritmetica]], el [[rango]] y sus extremos, y el conteo. Agregar por una categoría con la media de la variable respuesta es la [[codificacion-por-objetivo]]; agregar por características de calendario usa las [[caracteristicas-de-fecha-y-hora]].

## Formulario

:::formula[Conteo y suma por grupo]
$$
n_c = \sum_{i=1}^{N} \mathbf{1}\{c_i = c\}, \qquad S_c = \sum_{i:\,c_i = c} m_i
$$

- $c_i$: grupo de la fila $i$; $m_i$: su valor.
:::

:::formula[Media y máximo por grupo]
$$
\bar{m}_c = \frac{S_c}{n_c}, \qquad M_c = \max_{i:\,c_i = c} m_i
$$

- $n_c$: filas del grupo $c$.
:::
