---
id: grafico-de-barras
titulo: Gráfico de barras
titulo_en: Bar chart
alias:
  - diagrama de barras
  - gráfico de columnas
modulo: 4
submodulo: '4.6'
orden: 13
nivel: basico
prerrequisitos:
  - escalas-nominal-ordinal-de-intervalo-y-de-razon
relaciones:
  - tipo: contrasta
    id: histograma
  - tipo: contrasta
    id: grafico-de-pastel-y-sus-limitaciones
etiquetas:
  - visualización
  - datos categóricos
  - frecuencias
  - comparación
resumen: >
  El gráfico de barras representa una cantidad por categoría con barras de longitud proporcional, todas
  desde una línea base común en cero. Es la forma más precisa de comparar frecuencias o totales entre
  categorías.
formula: '\text{longitud}_k \propto f_k,\qquad \text{con base en } 0'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: barras
    categorias: [Fiebre, Fractura, Dolor abdominal, Herida, Dificultad respiratoria, Otro]
    valores: [64, 31, 48, 27, 39, 21]
    variable: Pacientes atendidos
    vista: barras
    horizontal: true
referencias:
  - clave: tufte
  - clave: agresti
    capitulo: '2'
publicado: true
---

## Intuición

Un servicio de urgencias registra el motivo de consulta de 230 pacientes en una semana. Para saber qué motivos son más comunes basta con dibujar una barra por motivo, con longitud proporcional al número de pacientes, todas partiendo de la misma línea. Al comparar barras, el ojo compara longitudes alineadas en una base común, una de las tareas visuales en que las personas son más precisas.

Ese es el **gráfico de barras**. Funciona con cualquier variable categórica (nominal u ordinal) o con cantidades asociadas a categorías, como ventas por región. Dos decisiones lo mejoran mucho: ordenar las barras de mayor a menor cuando las categorías no tienen orden propio, y dibujarlas horizontales cuando los nombres son largos. Lo que nunca debe hacerse es cortar la base: la barra representa la cantidad por su longitud completa, desde cero.

## Definición

:::definicion[Gráfico de barras]
Sean $K$ categorías con valores no negativos $f_1, \dots, f_K$ (frecuencias, proporciones o totales). El **gráfico de barras** dibuja para cada categoría $k$ un rectángulo de ancho constante y longitud

$$
\ell_k = a \cdot f_k,
$$

medida desde una línea base en $0$, donde $a > 0$ es la escala del eje. Las barras están separadas por espacios, porque las categorías son clases distintas y no intervalos contiguos.
:::

Si se grafican proporciones, $p_k = f_k / n$, con $n = \sum_k f_k$ el total; la forma del gráfico es la misma, solo cambia el eje.

:::nota[Qué significa cada símbolo]
- $K$: número de categorías.
- $f_k$: valor de la categoría $k$ (frecuencia o total).
- $\ell_k$: longitud de la barra $k$.
- $a$: escala del eje, unidades de longitud por unidad de la variable.
- $p_k$: proporción de la categoría $k$; $n$: total de observaciones.
:::

## Cómo usar la visualización

Las barras aparecen una a una y el encabezado muestra el valor de la última y su porcentaje del total. El selector **Gráfico** cambia entre barras, pastel o ambos lado a lado, y el interruptor **Ordenar de mayor a menor** reacomoda las categorías.

Experimentos sugeridos:

1. Con el orden original, buscar el tercer motivo más frecuente; activar el ordenamiento y volver a buscarlo: la respuesta es inmediata.
2. Cambiar a la vista de ambos gráficos y comparar Fractura con Herida (31 y 27) en las barras y en el pastel.
3. Observar que el porcentaje del encabezado no cambia al ordenar: solo cambia la posición.

## Ejemplo

Motivos de consulta de los 230 pacientes:

1. Total: $n = 64 + 31 + 48 + 27 + 39 + 21 = 230$.
2. Proporciones: Fiebre $64/230 \approx 0.278$, Dolor abdominal $48/230 \approx 0.209$, Dificultad respiratoria $39/230 \approx 0.170$, Fractura $0.135$, Herida $0.117$, Otro $0.091$.
3. Ordenadas de mayor a menor, la primera barra es casi tres veces la última: $64/21 \approx 3.0$, y en el gráfico la longitud guarda exactamente esa razón porque ambas parten de cero.

:::figura[Los motivos de consulta ordenados de mayor a menor: la jerarquía se lee de arriba abajo.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [Fiebre, Fractura, Dolor abdominal, Herida, Dificultad respiratoria, Otro]
valores: [64, 31, 48, 27, 39, 21]
variable: Pacientes atendidos
vista: barras
ordenar: true
horizontal: true
```
:::

## Propiedades

- **Comparación precisa:** longitudes alineadas sobre una base común se juzgan con poco error.
- **Base en cero obligatoria:** la longitud es proporcional al valor solo si la barra empieza en cero.
- **Orden:** con categorías nominales conviene ordenar por magnitud; con categorías ordinales se respeta su orden natural.
- **Orientación:** las barras horizontales dejan espacio para etiquetas largas.

:::figura[Variable ordinal: nivel de satisfacción de 400 clientes de una aerolínea. Las barras siguen el orden natural de la escala, no el de las frecuencias.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [Muy insatisfecho, Insatisfecho, Neutral, Satisfecho, Muy satisfecho]
valores: [28, 52, 96, 141, 83]
variable: Clientes
vista: barras
```
:::

## Errores comunes

- **Cortar el eje.** Si la base no es cero, una diferencia pequeña parece enorme; el factor de mentira del gráfico se dispara.
- **Confundirlo con un histograma.** El histograma agrupa una variable continua en intervalos contiguos, sin espacios entre barras y con área proporcional a la frecuencia; el de barras muestra categorías separadas.
- **Ordenar categorías ordinales por frecuencia.** Se pierde la lectura de la escala.
- **Agregar profundidad o sombras.** El efecto 3D desplaza la parte superior de la barra y dificulta leer su altura.

:::figura[Eje truncado: la tasa de aprobación de dos años, 50 % y 54 %. Al subir la base, el cambio de 8 % se dibuja como uno de 200 %.]{componente="ChartGallery"}
```yaml
grafico: enganoso
truco: eje-truncado
etiquetas: ['2023', '2024']
valores: [50, 54]
variable: Aprobación (%)
```
:::

## Conexiones

Las barras representan las frecuencias de las [[escalas-nominal-ordinal-de-intervalo-y-de-razon|variables nominales y ordinales]]. Se contrastan con el [[histograma]], para datos continuos, y con el [[grafico-de-pastel-y-sus-limitaciones|gráfico de pastel]], que codifica las mismas proporciones con ángulos. Las razones por las que la longitud se lee mejor que el ángulo o el área se explican en [[percepcion-visual-y-codificacion-de-variables]], y el eje truncado es el primero de los [[graficos-enganosos]].

## Formulario

:::formula[Longitud de cada barra]
$$
\ell_k = a \cdot f_k
$$

- $\ell_k$: longitud de la barra de la categoría $k$, medida desde cero.
- $a$: escala del eje.
- $f_k$: valor de la categoría $k$.
:::

:::formula[Proporción por categoría]
$$
p_k = \frac{f_k}{n},\qquad n = \sum_{k=1}^{K} f_k
$$

- $p_k$: proporción de la categoría $k$.
- $f_k$: frecuencia de la categoría $k$.
- $n$: total; $K$: número de categorías.
:::

:::formula[Razón de longitudes]
$$
\frac{\ell_j}{\ell_k} = \frac{f_j}{f_k}
$$

- $\ell_j$, $\ell_k$: longitudes de dos barras con base en cero.
- $f_j$, $f_k$: valores de esas categorías.
:::
