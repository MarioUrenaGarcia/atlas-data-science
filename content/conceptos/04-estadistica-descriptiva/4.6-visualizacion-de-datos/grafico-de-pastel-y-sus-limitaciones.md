---
id: grafico-de-pastel-y-sus-limitaciones
titulo: Gráfico de pastel y sus limitaciones
titulo_en: Pie chart and its limitations
alias:
  - gráfico circular
  - diagrama de sectores
  - pay
modulo: 4
submodulo: '4.6'
orden: 14
nivel: basico
prerrequisitos:
  - grafico-de-barras
relaciones:
  - tipo: contrasta
    id: grafico-de-barras
  - tipo: relacionado
    id: percepcion-visual-y-codificacion-de-variables
etiquetas:
  - visualización
  - proporciones
  - partes de un todo
  - percepción
resumen: >
  El gráfico de pastel divide un círculo en sectores con ángulo proporcional a cada parte del total. Sirve
  con pocas categorías, pero los ángulos se comparan peor que las longitudes de unas barras.
formula: '\theta_k = 360^\circ \cdot \frac{f_k}{n}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: barras
    categorias: [Operador A, Operador B, Operador C, Operador D, Operador E]
    valores: [23, 21, 20, 19, 17]
    variable: Participación de mercado (%)
    vista: ambas
referencias:
  - clave: tufte
publicado: true
---

## Intuición

Cinco compañías telefónicas se reparten el mercado de una ciudad con participaciones de 23, 21, 20, 19 y 17 por ciento. En un gráfico de pastel cada compañía recibe una rebanada del círculo con un ángulo proporcional a su participación. A primera vista se entiende que todas juntas forman el mercado completo, pero si se pregunta cuál es la tercera más grande, las rebanadas parecen casi iguales y hay que leer los números.

En un gráfico de barras con los mismos datos, la respuesta es inmediata: las barras se alinean sobre una base común y se comparan sus longitudes. El pastel obliga a comparar ángulos y áreas, que el ojo juzga con menos precisión. Por eso el **gráfico de pastel** se reserva para pocas categorías (dos o tres) con diferencias claras, cuando el mensaje principal es "qué parte del todo" y no "cuál es mayor".

## Definición

:::definicion[Gráfico de pastel]
Sean $K$ categorías con valores no negativos $f_1, \dots, f_K$ y total $n = \sum_k f_k$. El **gráfico de pastel** divide un círculo en $K$ sectores consecutivos; el sector $k$ tiene ángulo

$$
\theta_k = 360^\circ \cdot \frac{f_k}{n}
$$

y, por lo tanto, un área igual a la fracción $f_k / n$ del área del círculo.
:::

Condición de validez: las categorías deben ser mutuamente excluyentes y exhaustivas, de modo que las partes sumen el todo. Si cada persona puede elegir varias respuestas, los porcentajes suman más de 100 y el pastel no tiene sentido.

:::nota[Qué significa cada símbolo]
- $K$: número de categorías.
- $f_k$: valor de la categoría $k$.
- $n$: total, suma de todos los $f_k$.
- $\theta_k$: ángulo del sector $k$, en grados.
:::

## Cómo usar la visualización

El mismo conjunto de datos se dibuja con barras y con pastel, lado a lado. Las categorías se agregan una a una y el encabezado convierte el valor de la última en porcentaje y en grados.

Experimentos sugeridos:

1. Antes de leer los números, ordenar mentalmente las cinco rebanadas del pastel; después activar **Ordenar de mayor a menor** y comparar con el orden de las barras.
2. Cambiar el selector a solo pastel y tratar de decidir si el Operador C es mayor que el D.
3. Observar el encabezado: una diferencia de un punto porcentual equivale a 3.6 grados, muy difícil de ver.

## Ejemplo

Un hospital clasifica a 600 donantes de sangre por grupo: O, 270; A, 210; B, 90; AB, 30.

1. Proporciones: $270/600 = 0.45$, $210/600 = 0.35$, $90/600 = 0.15$, $30/600 = 0.05$.
2. Ángulos: $0.45 \cdot 360^\circ = 162^\circ$, $0.35 \cdot 360^\circ = 126^\circ$, $0.15 \cdot 360^\circ = 54^\circ$, $0.05 \cdot 360^\circ = 18^\circ$.
3. Suma: $162 + 126 + 54 + 18 = 360^\circ$.

:::figura[Los grupos sanguíneos de los 600 donantes: cuatro categorías con diferencias claras, donde el pastel sí comunica la composición.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [O, A, B, AB]
valores: [270, 210, 90, 30]
variable: Donantes
vista: pastel
```
:::

## Propiedades

- **Parte de un todo:** el círculo completo transmite que las categorías forman un total, algo que las barras no comunican por sí mismas.
- **Pocas categorías:** con dos o tres sectores, o con un sector dominante, la lectura es clara.
- **Ángulo y área juntos:** como el área de un sector es proporcional a su ángulo, ambos codifican la misma proporción.
- **Ángulos difíciles de comparar:** las diferencias pequeñas entre sectores no alineados se perciben mal.

:::figura[Uso adecuado: proporción de viajes con retraso en un aeropuerto, una sola parte contra el resto.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [A tiempo, Con retraso]
valores: [82, 18]
variable: Porcentaje de vuelos
vista: pastel
```
:::

:::figura[La comparación de ángulos frente a la de longitudes: dos valores, 40 y 52, codificados de seis formas. La longitud y la posición permiten estimar la razón mucho mejor que el ángulo.]{componente="ChartGallery"}
```yaml
grafico: percepcion
a: 40
b: 52
```
:::

## Errores comunes

- **Demasiadas rebanadas.** Con ocho o más categorías los sectores pequeños se vuelven ilegibles; conviene agrupar en "Otro" o usar barras.
- **Pastel en perspectiva tridimensional.** La inclinación agranda los sectores del frente y achica los del fondo: dos partes iguales parecen distintas.
- **Comparar dos pasteles.** Para comparar la composición de dos grupos, unas barras agrupadas o apiladas al 100 % son mucho más claras.
- **Porcentajes que no suman 100.** Con preguntas de opción múltiple las categorías no son excluyentes y el pastel es incorrecto.

:::figura[Demasiadas categorías: gasto de un hogar en nueve rubros. En el pastel los sectores pequeños son indistinguibles; las barras ordenadas los separan.]{componente="ChartGallery"}
```yaml
grafico: barras
categorias: [Vivienda, Alimentos, Transporte, Educación, Salud, Ropa, Ocio, Comunicación, Otros]
valores: [28, 24, 12, 9, 7, 6, 6, 4, 4]
variable: Porcentaje del gasto
vista: ambas
ordenar: true
```
:::

## Conexiones

El pastel codifica las mismas proporciones que un [[grafico-de-barras]], pero con ángulos y áreas. La jerarquía de precisión entre longitud, ángulo y área se estudia en [[percepcion-visual-y-codificacion-de-variables]], y el pastel en perspectiva es uno de los [[graficos-enganosos]]. Cuando hay dos variables categóricas, el [[grafico-de-mosaico]] muestra proporciones condicionales con rectángulos alineados.

## Formulario

:::formula[Ángulo de cada sector]
$$
\theta_k = 360^\circ \cdot \frac{f_k}{n}
$$

- $\theta_k$: ángulo del sector $k$ en grados.
- $f_k$: valor de la categoría $k$.
- $n$: total, $n = \sum_k f_k$.
:::

:::formula[Área de cada sector]
$$
A_k = \frac{f_k}{n}\,\pi R^2
$$

- $A_k$: área del sector $k$.
- $R$: radio del círculo; $\pi R^2$ es el área total.
- $f_k / n$: proporción de la categoría $k$.
:::

:::formula[Grados por punto porcentual]
$$
1\,\% \ \longleftrightarrow\ 3.6^\circ
$$

- Cada punto porcentual de diferencia entre dos categorías equivale a 3.6 grados de diferencia entre sus sectores.
:::
